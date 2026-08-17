import { motion } from 'framer-motion'

export default function SectionDivider() {
  return (
    <div className="relative mx-auto my-4 h-16 w-full max-w-5xl px-6">
      <svg viewBox="0 0 800 40" className="h-full w-full" preserveAspectRatio="none" aria-hidden="true">
        <motion.line
          x1="0"
          y1="20"
          x2="800"
          y2="20"
          stroke="url(#divider-gradient)"
          strokeWidth="1.5"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        />
        <motion.circle
          cx="400"
          cy="20"
          r="3"
          fill="#ff9159"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.9, duration: 0.4 }}
        />
        <defs>
          <linearGradient id="divider-gradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ff6a3d" stopOpacity="0" />
            <stop offset="50%" stopColor="#e8c27a" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#22e0ff" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
