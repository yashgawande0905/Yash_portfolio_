import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null)
  const ringRef = useRef<HTMLDivElement | null>(null)
  const [hidden, setHidden] = useState(true)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const isTouch = window.matchMedia('(hover: none)').matches
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isTouch || prefersReduced) return

    let ringX = window.innerWidth / 2
    let ringY = window.innerHeight / 2
    let mouseX = ringX
    let mouseY = ringY

    function onMove(e: MouseEvent) {
      mouseX = e.clientX
      mouseY = e.clientY
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`
      }
      setHidden(false)
    }

    function onOver(e: MouseEvent) {
      const target = e.target as HTMLElement
      setActive(!!target.closest('a, button, [data-cursor="active"]'))
    }

    let raf = 0
    function animateRing() {
      ringX += (mouseX - ringX) * 0.16
      ringY += (mouseY - ringY) * 0.16
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`
      }
      raf = requestAnimationFrame(animateRing)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onOver)
    animateRing()

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      cancelAnimationFrame(raf)
    }
  }, [])

  if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) return null

  return (
    <div className={hidden ? 'hidden' : ''}>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[100] h-1.5 w-1.5 rounded-full bg-ember shadow-[0_0_8px_2px_rgba(255,106,61,0.8)]"
      />
      <div
        ref={ringRef}
        className={`pointer-events-none fixed left-0 top-0 z-[100] rounded-full border transition-[width,height,border-color] duration-200 ease-out ${
          active ? 'h-11 w-11 border-arcane shadow-glow-arcane' : 'h-7 w-7 border-white/40'
        }`}
      />
    </div>
  )
}
