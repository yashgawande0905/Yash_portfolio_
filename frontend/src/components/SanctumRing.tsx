interface SanctumRingProps {
  size?: number
  className?: string
  color?: string
}

/**
 * A layered "magic circle" built from concentric rings, tick marks and a
 * hexagram — half mandala, half PCB trace. Rotation/opacity are driven
 * purely by CSS/Tailwind animation classes from the parent for performance.
 */
export default function SanctumRing({ size = 480, className = '', color = '#22e0ff' }: SanctumRingProps) {
  const r1 = size * 0.48
  const r2 = size * 0.38
  const r3 = size * 0.29
  const cx = size / 2
  const cy = size / 2

  const ticks = Array.from({ length: 36 }, (_, i) => {
    const angle = (i * 10 * Math.PI) / 180
    const inner = r1 - 6
    const outer = r1 + (i % 3 === 0 ? 14 : 6)
    return {
      x1: cx + inner * Math.cos(angle),
      y1: cy + inner * Math.sin(angle),
      x2: cx + outer * Math.cos(angle),
      y2: cy + outer * Math.sin(angle)
    }
  })

  const hexPoints = Array.from({ length: 6 }, (_, i) => {
    const angle = (i * 60 * Math.PI) / 180 - Math.PI / 2
    return `${cx + r2 * Math.cos(angle)},${cy + r2 * Math.sin(angle)}`
  }).join(' ')

  const triPoints = Array.from({ length: 3 }, (_, i) => {
    const angle = (i * 120 * Math.PI) / 180 + Math.PI / 2
    return `${cx + r3 * Math.cos(angle)},${cy + r3 * Math.sin(angle)}`
  }).join(' ')

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      className={className}
      style={{ overflow: 'visible' }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="sanctum-fade" cx="50%" cy="50%" r="50%">
          <stop offset="70%" stopColor={color} stopOpacity="0" />
          <stop offset="100%" stopColor={color} stopOpacity="0.08" />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r1} fill="url(#sanctum-fade)" />
      <circle cx={cx} cy={cy} r={r1} stroke={color} strokeOpacity="0.55" strokeWidth="1.5" fill="none" />
      <circle cx={cx} cy={cy} r={r1 - 14} stroke={color} strokeOpacity="0.25" strokeWidth="1" fill="none" />
      {ticks.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={color} strokeOpacity="0.5" strokeWidth="1.2" />
      ))}
      <polygon points={hexPoints} stroke={color} strokeOpacity="0.4" strokeWidth="1" fill="none" />
      <circle cx={cx} cy={cy} r={r2} stroke={color} strokeOpacity="0.35" strokeWidth="1" fill="none" />
      <polygon points={triPoints} stroke={color} strokeOpacity="0.55" strokeWidth="1.2" fill="none" />
      <circle cx={cx} cy={cy} r={r3} stroke={color} strokeOpacity="0.3" strokeWidth="1" fill="none" />
      <circle cx={cx} cy={cy} r={4} fill={color} fillOpacity="0.8" />
    </svg>
  )
}
