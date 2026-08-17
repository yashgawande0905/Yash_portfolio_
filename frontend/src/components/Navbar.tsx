import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SECTIONS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Edu' },
  { id: 'experience', label: 'Exp' },
  { id: 'projects', label: 'Work' },
  { id: 'certifications', label: 'Certs' },
  { id: 'contact', label: 'Contact' }
]

/** Height of the floating nav bar — sections scroll to just below it. */
const NAV_OFFSET = 96

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  )

  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches)
    setMatches(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])

  return matches
}

export default function Navbar() {
  const [active, setActive] = useState('home')
  const [menuOpen, setMenuOpen] = useState(false)
  // Render exactly one nav rather than mounting both and hiding one with
  // `hidden lg:flex`. That kept a display:none layoutId pill alive on phones for
  // framer-motion to measure, and duplicated all eight links for screen readers.
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const panelRef = useRef<HTMLElement | null>(null)
  const toggleRef = useRef<HTMLButtonElement | null>(null)

  // Scroll-spy: pick the section with the largest visible area rather than the
  // last one to fire, so fast scrolling doesn't leave the wrong item lit.
  useEffect(() => {
    const ratios = new Map<string, number>()

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => ratios.set(entry.target.id, entry.intersectionRatio))
        let best = ''
        let bestRatio = 0
        ratios.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio
            best = id
          }
        })
        if (best) setActive(best)
      },
      { rootMargin: `-${NAV_OFFSET}px 0px -40% 0px`, threshold: [0, 0.15, 0.35, 0.6, 1] }
    )

    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  // Any of these should dismiss the menu.
  useEffect(() => {
    if (!menuOpen) return

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        closeMenu()
        toggleRef.current?.focus()
      }
    }

    function onPointerDown(e: PointerEvent) {
      const target = e.target as Node
      if (panelRef.current?.contains(target) || toggleRef.current?.contains(target)) return
      closeMenu()
    }

    window.addEventListener('keydown', onKey)
    // `capture` so the tap closes the menu even if a child stops propagation.
    window.addEventListener('pointerdown', onPointerDown, true)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onPointerDown, true)
    }
  }, [menuOpen, closeMenu])

  // Rotating the phone / resizing into the desktop layout must not strand an
  // open dropdown behind the desktop nav.
  useEffect(() => {
    if (isDesktop) setMenuOpen(false)
  }, [isDesktop])

  // Deliberately no body-scroll lock here: this is a dropdown, not a full-screen
  // sheet, and locking `overflow` would swallow the smooth scroll that goTo()
  // fires from the very same tap. The panel scrolls internally instead
  // (max-h + overscroll-contain).

  const goTo = useCallback((id: string) => {
    setMenuOpen(false)
    const el = document.getElementById(id)
    if (!el) return
    // scrollIntoView would tuck the heading under the floating nav, so offset it.
    const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: Math.max(0, top), behavior: reduced ? 'auto' : 'smooth' })
    setActive(id)
  }, [])

  return (
    <div className="fixed left-1/2 top-4 z-50 w-[95%] max-w-5xl -translate-x-1/2 sm:top-6">
      <motion.div
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2.4, duration: 0.7, ease: 'easeOut' }}
      >
        <div className="glass-panel relative z-10 flex items-center justify-between gap-2 px-4 py-2.5 sm:px-6">
          <button
            type="button"
            onClick={() => goTo('home')}
            data-cursor="active"
            className="rune-text touch-manipulation text-lg font-bold tracking-widest text-gilt sm:text-xl"
          >
            YG
          </button>

          {isDesktop ? (
            <nav aria-label="Sections" className="flex items-center gap-0.5">
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => goTo(s.id)}
                  data-cursor="active"
                  aria-current={active === s.id ? 'true' : undefined}
                  className="relative shrink-0 rounded-full px-2 py-2 font-mono text-[11px] uppercase tracking-wider text-white/70 transition-colors hover:text-white xl:px-3 xl:text-xs xl:tracking-widest"
                >
                  {active === s.id && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-ember/25 to-arcane/25 shadow-glow-arcane"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{s.label}</span>
                </button>
              ))}
            </nav>
          ) : (
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              data-cursor="active"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              className="flex h-10 w-10 touch-manipulation items-center justify-center rounded-full border border-white/15 text-white transition-colors active:bg-white/10"
            >
              <span aria-hidden="true" className="font-mono text-lg leading-none">
                {menuOpen ? '✕' : '☰'}
              </span>
            </button>
          )}
        </div>

        <AnimatePresence>
          {menuOpen && !isDesktop && (
            <motion.nav
              id="mobile-nav"
              ref={panelRef}
              key="mobile-nav"
              aria-label="Sections"
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              // bg-void/95 overrides .glass's near-transparent fill — at full
              // transparency the page behind bleeds through the labels.
              className="glass-panel absolute inset-x-0 top-full z-20 mt-2 flex max-h-[70vh] flex-col overflow-y-auto overscroll-contain bg-void/95 p-1"
            >
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => goTo(s.id)}
                  data-cursor="active"
                  aria-current={active === s.id ? 'true' : undefined}
                  className={`touch-manipulation rounded-xl px-4 py-3.5 text-left font-mono text-sm uppercase tracking-widest transition-colors active:bg-white/10 ${
                    active === s.id ? 'bg-white/[0.06] text-ember-soft' : 'text-white/70'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
