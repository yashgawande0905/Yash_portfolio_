import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { PropsWithChildren, useRef, useState } from 'react'

interface TiltCardProps {
  className?: string
  intensity?: number
  glowColor?: string
}

export default function TiltCard({
  children,
  className = '',
  intensity = 12,
  glowColor = 'rgba(34,224,255,0.25)'
}: PropsWithChildren<TiltCardProps>) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [hovering, setHovering] = useState(false)
  const x = useMotionValue(0.5)
  const y = useMotionValue(0.5)

  const springX = useSpring(x, { stiffness: 150, damping: 18 })
  const springY = useSpring(y, { stiffness: 150, damping: 18 })

  const rotateX = useTransform(springY, [0, 1], [intensity, -intensity])
  const rotateY = useTransform(springX, [0, 1], [-intensity, intensity])
  const glowX = useTransform(x, [0, 1], ['0%', '100%'])
  const glowY = useTransform(y, [0, 1], ['0%', '100%'])

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    x.set((e.clientX - rect.left) / rect.width)
    y.set((e.clientY - rect.top) / rect.height)
  }

  function handleLeave() {
    x.set(0.5)
    y.set(0.5)
    setHovering(false)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      data-cursor="active"
      className={`card-edge glass-panel relative overflow-hidden transition-shadow duration-300 ${
        hovering ? 'shadow-glow' : ''
      } ${className}`}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: hovering ? 1 : 0,
          background: `radial-gradient(220px circle at ${glowX} ${glowY}, ${glowColor}, transparent 70%)`
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  )
}
