/**
 * POST /api/contact — portfolio contact form.
 *
 * Runs as a Vercel Node.js Function. Deliberately dependency-free: it uses the
 * global `fetch` (Node 18+) to talk to the Resend REST API, so there is no
 * package.json for this directory and nothing to keep patched.
 *
 * Required environment variables (set them in the Vercel dashboard):
 *   RESEND_API_KEY     re_...  from https://resend.com/api-keys
 *   CONTACT_TO_EMAIL   the inbox that should receive the messages
 *
 * Optional:
 *   CONTACT_FROM_EMAIL  defaults to Resend's shared onboarding sender, which can
 *                       only deliver to the address that owns the Resend account.
 *                       Point this at your own verified domain to send anywhere.
 *   ALLOWED_ORIGINS     comma-separated list; defaults to same-origin only.
 */

const LIMITS = {
  name: { min: 2, max: 100 },
  email: { max: 254 },
  subject: { max: 150 },
  message: { min: 10, max: 5000 }
}

// Best-effort throttle. Serverless instances are recycled, so this only slows
// down bursts that land on a warm instance — it is a speed bump, not a wall.
// Vercel's platform-level DDoS protection is the real defence.
const RATE_LIMIT = { windowMs: 60 * 60 * 1000, max: 5 }
const hits = new Map()

function rateLimited(ip) {
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_LIMIT.windowMs)

  if (hits.size > 5000) hits.clear() // crude guard against unbounded growth

  if (recent.length >= RATE_LIMIT.max) {
    hits.set(ip, recent)
    return true
  }
  recent.push(now)
  hits.set(ip, recent)
  return false
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// Intentionally permissive — real validation is "did the reply bounce".
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i

function validate(body) {
  const name = String(body.name ?? '').trim()
  const email = String(body.email ?? '').trim()
  const subject = String(body.subject ?? '').trim()
  const message = String(body.message ?? '').trim()

  if (name.length < LIMITS.name.min || name.length > LIMITS.name.max) {
    return { error: 'Please enter your name (2–100 characters).' }
  }
  if (!email || email.length > LIMITS.email.max || !EMAIL_RE.test(email)) {
    return { error: 'Please enter a valid email address.' }
  }
  if (subject.length > LIMITS.subject.max) {
    return { error: `Subject must be under ${LIMITS.subject.max} characters.` }
  }
  if (message.length < LIMITS.message.min || message.length > LIMITS.message.max) {
    return { error: `Message must be between ${LIMITS.message.min} and ${LIMITS.message.max} characters.` }
  }
  // Header-injection guard: newlines have no business in these fields.
  if (/[\r\n]/.test(name) || /[\r\n]/.test(email) || /[\r\n]/.test(subject)) {
    return { error: 'Invalid characters in name, email or subject.' }
  }

  return { data: { name, email, subject, message } }
}

function buildEmail({ name, email, subject, message }, meta) {
  const safeSubject = subject || 'No subject'
  const html = `
    <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:640px;margin:0 auto;color:#1a1a1a">
      <h2 style="margin:0 0 4px;font-size:18px">New portfolio message</h2>
      <p style="margin:0 0 20px;color:#666;font-size:13px">Just reply to this email to answer ${escapeHtml(name)} directly.</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="padding:6px 0;color:#666;width:80px">Name</td><td style="padding:6px 0"><strong>${escapeHtml(name)}</strong></td></tr>
        <tr><td style="padding:6px 0;color:#666">Email</td><td style="padding:6px 0"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
        <tr><td style="padding:6px 0;color:#666">Subject</td><td style="padding:6px 0">${escapeHtml(safeSubject)}</td></tr>
      </table>
      <div style="margin-top:16px;padding:16px;background:#f6f6f8;border-radius:8px;white-space:pre-wrap;font-size:14px;line-height:1.6">${escapeHtml(message)}</div>
      <p style="margin-top:20px;color:#999;font-size:11px">Sent from your portfolio contact form · ${escapeHtml(meta.ip)}</p>
    </div>`

  const text =
    `New portfolio message\n\n` +
    `Name: ${name}\nEmail: ${email}\nSubject: ${safeSubject}\n\n${message}\n\n— sent from your portfolio contact form`

  return { html, text, safeSubject }
}

module.exports = async (req, res) => {
  const allowed = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean)
  const origin = req.headers.origin
  if (origin && allowed.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Vary', 'Origin')
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(204).end()
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' })
  }

  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_TO_EMAIL
  const from = process.env.CONTACT_FROM_EMAIL || 'Portfolio <onboarding@resend.dev>'

  if (!apiKey || !to) {
    // Config problem, not the visitor's fault — log loudly, stay vague publicly.
    console.error('[contact] Missing RESEND_API_KEY or CONTACT_TO_EMAIL env var')
    return res.status(503).json({ error: 'The contact form is not configured yet. Please email me directly.' })
  }

  let body
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
  } catch {
    return res.status(400).json({ error: 'Malformed request body.' })
  }

  // Honeypot: real people never see this field, bots fill everything in.
  // Return a normal success so the bot has no signal to adapt to.
  if (String(body.company ?? '').trim() !== '') {
    console.warn('[contact] honeypot triggered')
    return res.status(200).json({ ok: true })
  }

  const { error, data } = validate(body)
  if (error) return res.status(400).json({ error })

  const ip =
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    'unknown'

  if (rateLimited(ip)) {
    return res.status(429).json({ error: 'Too many messages sent. Please try again later.' })
  }

  const { html, text, safeSubject } = buildEmail(data, { ip })

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: data.email, // hitting Reply in Gmail goes straight to the sender
        subject: `[Portfolio] ${safeSubject} — ${data.name}`,
        html,
        text
      })
    })

    if (!response.ok) {
      const detail = await response.text().catch(() => '')
      console.error(`[contact] Resend responded ${response.status}: ${detail}`)
      return res.status(502).json({ error: 'Could not send the message right now. Please email me directly.' })
    }

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('[contact] Unexpected failure:', err)
    return res.status(500).json({ error: 'Could not send the message right now. Please email me directly.' })
  }
}
