import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { stats } from '../data/portfolioData'

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setDisplay(value)
      return
    }
    let raf: number
    const start = performance.now()
    const duration = 1200
    function tick(now: number) {
      const progress = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * value))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value])

  return (
    <span
      ref={ref}
      className="rune-text text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gilt via-ember-soft to-arcane-soft sm:text-5xl"
    >
      {display}
      {suffix}
    </span>
  )
}

export default function Stats() {
  return (
    <section className="relative mx-auto max-w-5xl px-6 pb-4 pt-4">
      <div className="card-edge glass-panel grid grid-cols-2 gap-8 p-8 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col items-center gap-2 text-center">
            <Counter value={s.value} suffix={s.suffix} />
            <p className="font-mono text-[10px] uppercase tracking-widest text-white/50 sm:text-[11px]">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
