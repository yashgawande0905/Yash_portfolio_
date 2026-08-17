# Yash Gawande — Portfolio

Production build of the portfolio: **React + TypeScript + Vite** frontend, a **serverless
contact API** that emails you whenever someone gets in touch, and a Flask server kept for
local development. Theme: a "technomancer" aesthetic — rotating portal/mandala circles,
an ember/arcane/mystic palette, glassmorphism cards, a custom cursor, an ambient particle
field, 3D-tilt hover cards, a pinch/zoom lightbox, and scroll-triggered reveals.

```
├── api/contact.js      Vercel serverless function — validates + emails via Resend
├── frontend/           Vite + React + TypeScript + Tailwind + Framer Motion (SPA)
│   ├── src/
│   │   ├── components/ Navbar, Hero, About, Skills, Education, Experience,
│   │   │               Projects, Contact, Footer + VFX components
│   │   └── data/portfolioData.ts   ← all your content lives here
│   └── public/assets/  Images, favicon, robots.txt, sitemap.xml
├── backend/app.py      Flask dev server — same contact logic, for running locally
└── vercel.json         Build, routing, caching and security-header config
```

---

## 1. Contact form — verified working

The form posts to `/api/contact`, which sends the message to your inbox through
[Resend](https://resend.com). Free tier is 3,000 emails/month. The key is already in
`backend/.env` for local development, and delivery has been confirmed end-to-end against
the live Resend API — from both the Vercel function and the Flask backend.

You still need to paste the same key into Vercel (step 2) so it works in production.
Find it at **[resend.com/api-keys](https://resend.com/api-keys)**, or in `backend/.env`.

> **Why the default sender works with zero setup:** Resend's shared `onboarding@resend.dev`
> address needs no domain or DNS records, but it can *only* deliver to the email address
> that owns the Resend account. For a contact form that's exactly right — every message
> goes to you. If you later buy a domain, verify it in Resend and set `CONTACT_FROM_EMAIL`
> to something like `Yash Gawande <hello@yourdomain.com>`.

Every message arrives with **Reply-To set to the sender**, so hitting Reply in Gmail
answers the visitor directly.

---

## 2. Deploy to Vercel

**Vercel is the right host here** — a portfolio must load instantly for a recruiter
opening it on a phone. Vercel serves the frontend from a global CDN and runs the contact
API as a serverless function that responds immediately. Render's free tier spins your
service down after 15 minutes idle, so the first visitor of the day waits ~50 seconds for
a cold start, and the contact form would appear broken. Both are free; Vercel is faster
for this shape of project.

### GitHub — already done

The code lives at **[github.com/yashgawande0905/portfolio](https://github.com/yashgawande0905/portfolio)**
(private). `.gitignore` excludes `.env`, `node_modules/`, `venv/` and `dist/`, so no
secrets are in the history.

To make it public later (optional — Vercel deploys private repos fine):

```bash
gh repo edit yashgawande0905/portfolio --visibility public --accept-visibility-change-consequences
```

Subsequent changes deploy automatically on push:

```bash
git add . && git commit -m "your message" && git push
```

### Import into Vercel

1. Go to **[vercel.com/new](https://vercel.com/new)** and sign in **with GitHub**.
2. Find `portfolio` in the list and click **Import**. If it isn't listed, click
   *Adjust GitHub App Permissions* and grant access to the repo (it's private).
3. Leave **Root Directory** as `./` — `vercel.json` already points the build at
   `frontend/` and the output at `frontend/dist`. Don't change the build settings.
4. Expand **Environment Variables** and add both of these *before* deploying:

   | Name | Value |
   |---|---|
   | `RESEND_API_KEY` | `re_...` (the key from your Resend dashboard) |
   | `CONTACT_TO_EMAIL` | `yashgawande0905@gmail.com` |

5. Click **Deploy**. First build takes about a minute.

### After the first deploy

You'll get a URL like `https://portfolio-xyz.vercel.app`. To make the SEO tags and
sitemap match it, update the URL in these three places and push again:

- `frontend/index.html` — `og:url`, `og:image`, `twitter:image`, `canonical`
- `frontend/public/sitemap.xml` — the `<loc>` value
- `frontend/public/robots.txt` — the `Sitemap:` line

Then **send yourself a test message through the live form** to confirm delivery.

### Custom domain (optional)

In Vercel: **Settings → Domains → Add**. Point your registrar's nameservers or add the
CNAME Vercel shows you. HTTPS is issued automatically.

---

## 3. Run it locally

**Frontend (hot reload):**

```bash
cd frontend
npm install
npm run dev            # http://localhost:5173
```

`/api/contact` is proxied to `http://127.0.0.1:5000`, so start the backend too if you
want the form to actually send mail while developing.

**Backend:**

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows;  source venv/bin/activate on macOS/Linux
pip install -r requirements.txt
cp .env.example .env           # then paste your Resend key in
python app.py                  # http://127.0.0.1:5000
```

Check `http://127.0.0.1:5000/api/health` — it reports whether your env vars loaded.

**Production build locally:**

```bash
cd frontend && npm run build && npm run preview
```

---

## 4. Editing content

Everything text-based — bio, roles, education, experience, projects, skills, stats —
lives in **`frontend/src/data/portfolioData.ts`**. Change it there and every section
updates; you never need to touch a component for a content edit.

**Look and feel:**

- Colors & fonts — `frontend/tailwind.config.js`
- Glass/glow utility classes — `frontend/src/index.css`
- The portal/mandala graphic — `frontend/src/components/SanctumRing.tsx`
- Intro sequence timing — `frontend/src/components/PortalLoader.tsx`

**Adding a photo:** drop it in `frontend/public/assets/` and reference it as
`/assets/yourfile.jpg`. Files there are cached for a day with revalidation, so a
replacement goes live within 24 hours; the hashed JS/CSS in `/build/` is cached forever
and busts automatically on each deploy.

---

## What's in place for production

**Contact API** (`api/contact.js`, mirrored in `backend/app.py`)

- Server-side validation of every field, with length bounds
- All user input HTML-escaped before it reaches the email body
- Newline rejection in name/email/subject to block header injection
- Hidden honeypot field — bots that fill it get a fake success and no email is sent
- Rate limiting, 5 messages per IP per hour
- `Reply-To` set to the visitor so you can reply straight from Gmail
- Plain-text alternative alongside the HTML body
- Errors logged server-side; visitors only ever see a friendly message
- 20-second client timeout so the button can't spin forever

**Frontend**

- Mobile/tablet nav rewritten — verified working at 390px, 820px and 1440px
- Real IIT Delhi and IIT Mandi campus photos on the experience cards, with a graceful
  sigil fallback if an image ever fails to load
- Full SEO: title, description, canonical, Open Graph + Twitter cards, a generated
  1200×630 share image, JSON-LD `Person` structured data, `robots.txt`, `sitemap.xml`
- Vendor code split into cached chunks; hero image downscaled, with the full-resolution
  original reserved for the pinch-zoom lightbox
- Security headers incl. a Content-Security-Policy (`vercel.json`)
- `prefers-reduced-motion` respected throughout; custom cursor and heavy intro
  animation disabled on touch devices

### Image credits

The campus photographs are used under Creative Commons and attributed in-page:

- IIT Delhi — Azanti, [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Indian_Institute_of_Technology_Delhi.jpg), CC BY-SA 4.0
- IIT Mandi — Timothy A. Gonsalves, [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:IIT_Mandi_Campus_from_Griffon_Peak_Jan_2020_D72_13785.jpg), CC BY-SA 4.0

Keep the credit links in `portfolioData.ts` — the licence requires attribution.

---

## Troubleshooting

**Form says "not configured yet"** — `RESEND_API_KEY` or `CONTACT_TO_EMAIL` is missing in
Vercel. Add it, then **redeploy** (env changes need a new deployment to take effect).

**Form submits but no email arrives** — check spam. Then check Vercel → your project →
**Logs**, filter to `/api/contact`; the Resend error is logged in full there. The usual
cause is `CONTACT_TO_EMAIL` differing from the address that owns the Resend account,
which the shared `onboarding@resend.dev` sender is not allowed to deliver to.

**Icons or fonts missing after deploy** — the CSP in `vercel.json` lists the hosts the
page may load from. If you add an image from a new domain, add that host to `img-src`.
Enabling Vercel Analytics also requires adding `https://va.vercel-scripts.com` to
`script-src`.

**Build fails on Vercel** — run `npm --prefix frontend ci && npm --prefix frontend run build`
locally; it runs the exact same commands.
