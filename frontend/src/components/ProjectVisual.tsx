import ZoomableImage from './ZoomableImage'

interface ProjectVisualProps {
  kind: 'photo' | 'scan' | 'circuit'
  image?: string
  title: string
}

/**
 * Real projects get a real (zoomable) photo. Projects without matching
 * photography get an honest generative abstract visual instead of a
 * borrowed/mismatched stock image — a scanline sweep for imaging work,
 * a circuit-trace grid for dashboard/data work.
 */
export default function ProjectVisual({ kind, image, title }: ProjectVisualProps) {
  if (kind === 'photo' && image) {
    return (
      <ZoomableImage
        src={image}
        alt={title}
        imgClassName="h-52 w-full object-cover transition-transform duration-500 hover:scale-110"
      />
    )
  }

  if (kind === 'scan') {
    return (
      <div className="relative h-52 w-full overflow-hidden bg-gradient-to-br from-void-300 via-[#0c2230] to-void-200">
        <svg viewBox="0 0 400 208" className="h-full w-full opacity-70" preserveAspectRatio="xMidYMid slice">
          {Array.from({ length: 7 }, (_, i) => (
            <circle
              key={i}
              cx="40"
              cy="104"
              r={18 + i * 26}
              fill="none"
              stroke="#22e0ff"
              strokeOpacity={0.35 - i * 0.03}
              strokeWidth="1.5"
            />
          ))}
          <line x1="40" y1="104" x2="380" y2="40" stroke="#7cf0ff" strokeOpacity="0.5" strokeWidth="1" />
          <line x1="40" y1="104" x2="380" y2="168" stroke="#7cf0ff" strokeOpacity="0.5" strokeWidth="1" />
          {Array.from({ length: 14 }, (_, i) => (
            <circle
              key={`d-${i}`}
              cx={80 + i * 22}
              cy={104 + Math.sin(i * 1.3) * 40}
              r="2"
              fill="#a86bff"
              fillOpacity="0.7"
            />
          ))}
        </svg>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void via-void/20 to-transparent" />
      </div>
    )
  }

  return (
    <div className="relative h-52 w-full overflow-hidden bg-gradient-to-br from-void-300 via-[#1c1430] to-void-200">
      <svg viewBox="0 0 400 208" className="h-full w-full opacity-60" preserveAspectRatio="xMidYMid slice">
        {Array.from({ length: 6 }, (_, i) => (
          <line key={`h-${i}`} x1="0" y1={20 + i * 32} x2="400" y2={20 + i * 32} stroke="#ff9159" strokeOpacity="0.12" strokeWidth="1" />
        ))}
        {Array.from({ length: 10 }, (_, i) => (
          <line key={`v-${i}`} x1={20 + i * 38} y1="0" x2={20 + i * 38} y2="208" stroke="#ff9159" strokeOpacity="0.1" strokeWidth="1" />
        ))}
        <path
          d="M20 180 L20 140 L120 140 L120 60 L220 60 L220 100 L320 100 L320 30 L380 30"
          fill="none"
          stroke="#e8c27a"
          strokeOpacity="0.55"
          strokeWidth="1.5"
        />
        {[
          [20, 180],
          [120, 140],
          [220, 60],
          [320, 100],
          [380, 30]
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="3.5" fill="#a86bff" />
        ))}
      </svg>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void via-void/20 to-transparent" />
    </div>
  )
}
