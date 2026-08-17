import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import SanctumRing from './SanctumRing'

export default function PortalLoader() {
  const [visible, setVisible] = useState(true)
  const [burst, setBurst] = useState(false)
  const prefersReduced = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  )

  useEffect(() => {
    const burstDelay = prefersReduced ? 0 : 1500
    const closeDelay = prefersReduced ? 150 : 2150
    const t1 = setTimeout(() => setBurst(true), burstDelay)
    const t2 = setTimeout(() => setVisible(false), closeDelay)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [prefersReduced])

  useEffect(() => {
    const original = document.body.style.overflow
    document.body.style.overflow = visible ? 'hidden' : original || ''
    return () => {
      document.body.style.overflow = original
    }
  }, [visible])

  const sparks = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => {
        const angle = (i / 22) * Math.PI * 2
        const dist = 140 + Math.random() * 180
        return {
          id: i,
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist,
          hue: i % 3 === 0 ? '#ff9159' : i % 3 === 1 ? '#7cf0ff' : '#c8a4ff'
        }
      }),
    []
  )

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-void"
          exit={{ opacity: 0, transition: { duration: 0.7, ease: 'easeInOut' } }}
        >
          <motion.div
            className="absolute"
            initial={{ opacity: 0, scale: 0.6, rotate: -30 }}
            animate={{ opacity: 1, scale: 1.15, rotate: 30 }}
            transition={{ duration: 1.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <SanctumRing size={340} color="#22e0ff" />
          </motion.div>
          <motion.div
            className="absolute"
            initial={{ opacity: 0, scale: 0.4, rotate: 20 }}
            animate={{ opacity: 0.8, scale: 0.85, rotate: -60 }}
            transition={{ duration: 1.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            <SanctumRing size={220} color="#ff6a3d" />
          </motion.div>

          {/* Shockwave ring */}
          {burst && !prefersReduced && (
            <motion.span
              className="absolute rounded-full border border-arcane-soft/70"
              initial={{ width: 20, height: 20, opacity: 0.9 }}
              animate={{ width: 900, height: 900, opacity: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
            />
          )}

          {/* Spark burst */}
          {burst &&
            !prefersReduced &&
            sparks.map((s) => (
              <motion.span
                key={s.id}
                className="absolute h-1 w-1 rounded-full"
                style={{ backgroundColor: s.hue, boxShadow: `0 0 8px 2px ${s.hue}` }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{ x: s.x, y: s.y, opacity: 0, scale: 0.3 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            ))}

          <motion.p
            className="relative z-10 rune-text text-2xl tracking-[0.4em] text-transparent bg-clip-text bg-gradient-to-r from-gilt via-ember-soft to-arcane-soft sm:text-3xl"
            initial={{ opacity: 0, letterSpacing: '0.9em' }}
            animate={{ opacity: 1, letterSpacing: '0.4em' }}
            transition={{ duration: 1.3, delay: 0.4, ease: 'easeOut' }}
          >
            YASH GAWANDE
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
