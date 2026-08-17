import { motion } from 'framer-motion'
import { FormEvent, useState } from 'react'
import { profile } from '../data/portfolioData'
import SectionDivider from './SectionDivider'
import Magnetic from './Magnetic'

type Status = 'idle' | 'sending' | 'success' | 'error'

const MESSAGE_MAX = 5000

/**
 * Same-origin by default (the Vercel function lives at /api/contact next to the
 * static build). Set VITE_API_BASE_URL only if you split the frontend and the
 * API across two hosts.
 */
const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

export default function Contact() {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [messageLength, setMessageLength] = useState(0)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const value = (n: string) =>
      (form.elements.namedItem(n) as HTMLInputElement | HTMLTextAreaElement).value.trim()

    const data = {
      name: value('name'),
      email: value('email'),
      subject: value('subject'),
      message: value('message'),
      company: value('company') // honeypot — must stay empty
    }

    // Mirror the server's rules so obvious mistakes never cost a round trip.
    if (data.name.length < 2) {
      setStatus('error')
      setErrorMsg('Please enter your name.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(data.email)) {
      setStatus('error')
      setErrorMsg('Please enter a valid email address so I can reply.')
      return
    }
    if (data.message.length < 10) {
      setStatus('error')
      setErrorMsg('Please write a slightly longer message (at least 10 characters).')
      return
    }

    setStatus('sending')
    setErrorMsg('')

    // Don't leave the button spinning forever if the network stalls.
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 20000)

    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: controller.signal
      })
      const json = await res.json().catch(() => ({}))

      if (res.ok) {
        setStatus('success')
        form.reset()
        setMessageLength(0)
      } else {
        setStatus('error')
        setErrorMsg(json.error || `Something went wrong (status ${res.status}).`)
      }
    } catch (err) {
      setStatus('error')
      setErrorMsg(
        (err as Error)?.name === 'AbortError'
          ? 'That took too long. Please try again, or email me directly.'
          : 'Network error — please check your connection, or email me directly.'
      )
    } finally {
      window.clearTimeout(timeout)
    }
  }

  return (
    <section id="contact" className="relative mx-auto max-w-3xl px-6 py-16 pb-32">
      <SectionDivider />
      <div className="mt-8 text-center">
        <p className="eyebrow">Open a Portal</p>
        <h2 className="section-heading mt-2">Get In Touch</h2>
        <p className="mx-auto mt-4 max-w-lg text-white/65">
          Have a project, an internship opening, or just want to talk engineering and AI? Send a message and
          I&rsquo;ll get back to you.
        </p>
        <a
          href={`mailto:${profile.socials.email}`}
          data-cursor="active"
          className="mt-3 inline-block font-mono text-sm text-arcane-soft hover:text-arcane-soft/80"
        >
          {profile.socials.email}
        </a>
      </div>

      <motion.form
        onSubmit={handleSubmit}
        noValidate
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="card-edge glass-panel mt-12 flex flex-col gap-4 p-6 sm:p-8"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            name="name"
            type="text"
            placeholder="Your name"
            autoComplete="name"
            maxLength={100}
            required
            className="field"
          />
          <input
            name="email"
            type="email"
            placeholder="Your email"
            autoComplete="email"
            inputMode="email"
            maxLength={254}
            required
            className="field"
          />
        </div>
        <input name="subject" type="text" placeholder="Subject" maxLength={150} className="field" />
        <div>
          <textarea
            name="message"
            rows={6}
            placeholder="Message"
            maxLength={MESSAGE_MAX}
            required
            onChange={(e) => setMessageLength(e.target.value.length)}
            className="field resize-none"
          />
          <p className="mt-1 text-right font-mono text-[10px] text-white/30">
            {messageLength}/{MESSAGE_MAX}
          </p>
        </div>

        {/* Honeypot. Hidden from humans and from screen readers; bots fill it in
            and the server silently drops the submission. */}
        <div aria-hidden="true" className="pointer-events-none absolute -left-[9999px] opacity-0">
          <label>
            Company
            <input name="company" type="text" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <Magnetic strength={10} className="mt-2 self-start">
          <button
            type="submit"
            disabled={status === 'sending'}
            data-cursor="active"
            className="btn-glow touch-manipulation disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === 'sending' ? 'Sending…' : 'Send Message'}
          </button>
        </Magnetic>

        {/* aria-live so screen readers announce the outcome */}
        <div aria-live="polite" className="min-h-[1.25rem]">
          {status === 'success' && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono text-sm text-arcane-soft">
              Message sent — it&rsquo;s in my inbox and I&rsquo;ll reply soon. ✅
            </motion.p>
          )}
          {status === 'error' && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono text-sm text-ember">
              {errorMsg}
            </motion.p>
          )}
        </div>
      </motion.form>

      <div className="mt-10 flex justify-center gap-6 font-mono text-sm text-white/60">
        <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-arcane-soft" data-cursor="active">
          LinkedIn
        </a>
        <span className="text-white/20">/</span>
        <a href={profile.socials.github} target="_blank" rel="noreferrer" className="hover:text-arcane-soft" data-cursor="active">
          GitHub
        </a>
      </div>
    </section>
  )
}
