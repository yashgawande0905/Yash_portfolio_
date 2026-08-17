import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import SanctumRing from './SanctumRing'
import Magnetic from './Magnetic'
import { profile } from '../data/portfolioData'

function useTypewriter(words: string[], typingSpeed = 90, deletingSpeed = 45, pause = 1400) {
  const [text, setText] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = words[wordIndex % words.length]
    let timeout: number

    if (!deleting && text === current) {
      timeout = window.setTimeout(() => setDeleting(true), pause)
    } else if (deleting && text === '') {
      setDeleting(false)
      setWordIndex((i) => i + 1)
    } else {
      timeout = window.setTimeout(
        () => {
          setText(current.substring(0, deleting ? text.length - 1 : text.length + 1))
        },
        deleting ? deletingSpeed : typingSpeed
      )
    }
    return () => window.clearTimeout(timeout)
  }, [text, deleting, wordIndex, words, typingSpeed, deletingSpeed, pause])

  return text
}

export default function Hero() {
  const typed = useTypewriter(profile.roles)

  return (
    <section
      id="home"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pb-16 pt-28"
    >
      {/* Portal rings */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="animate-spin-slower opacity-40">
          <SanctumRing size={720} color="#22e0ff" />
        </div>
        <div className="absolute animate-spin-reverse opacity-30">
          <SanctumRing size={520} color="#ff6a3d" />
        </div>
        <div className="absolute animate-spin-slow opacity-25">
          <SanctumRing size={360} color="#a86bff" />
        </div>
      </div>

      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center gap-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 2.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="absolute inset-0 -z-10 animate-pulse-glow rounded-full bg-gradient-to-br from-ember/40 via-mystic/30 to-arcane/40 blur-2xl" />
          <div className="card-edge glass h-40 w-40 overflow-hidden rounded-full p-1 sm:h-52 sm:w-52">
            <img
              src={profile.portrait}
              alt={profile.name}
              className="h-full w-full rounded-full object-cover"
            />
          </div>
        </motion.div>

        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.9, duration: 0.6 }}
            className="eyebrow mb-3"
          >
            Engineering &middot; Sorcery of Systems
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.0, duration: 0.7 }}
            className="rune-text text-5xl font-bold leading-[1.1] text-white sm:text-6xl md:text-7xl"
          >
            Hi, it&rsquo;s{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gilt via-ember-soft to-arcane-soft">
              Yash
            </span>
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.2, duration: 0.7 }}
            className="mt-4 font-mono text-lg text-arcane-soft sm:text-xl"
          >
            I&rsquo;m a <span className="text-white">{typed}</span>
            <span className="animate-pulse text-ember">|</span>
          </motion.h2>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.4, duration: 0.7 }}
          className="max-w-2xl text-balance text-base leading-relaxed text-white/75 sm:text-lg"
        >
          {profile.bioParagraphs[0]}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.6, duration: 0.7 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Magnetic strength={14}>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="btn-glow"
              data-cursor="active"
            >
              Wanna hire me
            </a>
          </Magnetic>

          <Magnetic strength={22}>
            <a
              href={profile.socials.github}
              target="_blank"
              rel="noreferrer"
              data-cursor="active"
              className="glass flex h-12 w-12 items-center justify-center rounded-full text-white/80 transition-colors hover:text-arcane-soft hover:shadow-glow-arcane"
            >
              <GithubIcon />
            </a>
          </Magnetic>

          <Magnetic strength={22}>
            <a
              href={profile.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              data-cursor="active"
              className="glass flex h-12 w-12 items-center justify-center rounded-full text-white/80 transition-colors hover:text-arcane-soft hover:shadow-glow-arcane"
            >
              <LinkedinIcon />
            </a>
          </Magnetic>

          <Magnetic strength={22}>
            <a
              href={`mailto:${profile.socials.email}`}
              data-cursor="active"
              className="glass flex h-12 w-12 items-center justify-center rounded-full text-white/80 transition-colors hover:text-arcane-soft hover:shadow-glow-arcane"
              aria-label="Email Yash"
            >
              <MailIcon />
            </a>
          </Magnetic>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4, duration: 1 }}
        className="absolute bottom-8 flex flex-col items-center gap-2 text-white/50"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="h-6 w-px bg-gradient-to-b from-ember to-transparent"
        />
      </motion.div>
    </section>
  )
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.73.5.5 5.74.5 12.03c0 5.03 3.26 9.3 7.79 10.8.57.1.78-.25.78-.55v-2.15c-3.17.69-3.84-1.36-3.84-1.36-.52-1.32-1.27-1.67-1.27-1.67-1.03-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.67 1.24 3.32.95.1-.74.4-1.24.72-1.53-2.53-.29-5.19-1.27-5.19-5.63 0-1.24.44-2.26 1.17-3.06-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.14 1.17a10.9 10.9 0 0 1 5.72 0c2.18-1.48 3.14-1.17 3.14-1.17.62 1.57.23 2.73.11 3.02.73.8 1.17 1.82 1.17 3.06 0 4.37-2.67 5.34-5.21 5.62.41.35.77 1.05.77 2.12v3.14c0 .3.2.66.79.55A10.53 10.53 0 0 0 23.5 12c0-6.27-5.23-11.5-11.5-11.5Z" />
    </svg>
  )
}
function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.45-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
  )
}
function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.2" />
      <path d="m3 6 9 7 9-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
