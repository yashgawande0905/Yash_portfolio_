import { useEffect, useRef } from 'react'

type Particle = {
  x: number
  y: number
  r: number
  vy: number
  vx: number
  hue: 'ember' | 'arcane' | 'mystic'
  alpha: number
  drift: number
}

const HUES: Record<Particle['hue'], string> = {
  ember: '255, 106, 61',
  arcane: '34, 224, 255',
  mystic: '168, 107, 255'
}

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)
    let particles: Particle[] = []
    let raf = 0

    const COUNT = Math.min(70, Math.floor((width * height) / 22000))

    function spawn(): Particle {
      const hues: Particle['hue'][] = ['ember', 'arcane', 'mystic']
      return {
        x: Math.random() * width,
        y: height + Math.random() * 100,
        r: Math.random() * 2 + 0.6,
        vy: Math.random() * 0.5 + 0.15,
        vx: (Math.random() - 0.5) * 0.3,
        hue: hues[Math.floor(Math.random() * hues.length)],
        alpha: Math.random() * 0.5 + 0.15,
        drift: Math.random() * 0.02
      }
    }

    particles = Array.from({ length: COUNT }, () => ({ ...spawn(), y: Math.random() * height }))

    function resize() {
      width = canvas!.width = window.innerWidth
      height = canvas!.height = window.innerHeight
    }
    window.addEventListener('resize', resize)

    let t = 0
    function tick() {
      ctx!.clearRect(0, 0, width, height)
      t += 1
      for (const p of particles) {
        p.y -= p.vy
        p.x += p.vx + Math.sin(t * p.drift) * 0.3
        if (p.y < -20) {
          Object.assign(p, spawn(), { y: height + 10 })
        }
        ctx!.beginPath()
        const grad = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4)
        grad.addColorStop(0, `rgba(${HUES[p.hue]}, ${p.alpha})`)
        grad.addColorStop(1, `rgba(${HUES[p.hue]}, 0)`)
        ctx!.fillStyle = grad
        ctx!.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2)
        ctx!.fill()
      }
      raf = requestAnimationFrame(tick)
    }

    if (!prefersReduced) {
      tick()
    }

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 opacity-70"
      aria-hidden="true"
    />
  )
}
