import { motion } from 'framer-motion'
import { profile, domains } from '../data/portfolioData'
import ZoomableImage from './ZoomableImage'

export default function About() {
  return (
    <section id="about" className="relative mx-auto max-w-5xl px-6 py-20">
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.6 }}
        className="eyebrow text-center"
      >
        The Origin
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="section-heading mt-2 text-center"
      >
        About Yash
      </motion.h2>

      {/* Signature skyline banner — click to zoom / pinch */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="card-edge glass-panel relative mt-10 overflow-hidden"
      >
        <ZoomableImage
          src={profile.bannerWeb}
          fullSrc={profile.banner}
          width={1600}
          height={1200}
          alt="Yash Gawande overlooking the city from a hilltop fort at night"
          imgClassName="h-64 w-full object-cover object-[center_30%] transition-transform duration-700 hover:scale-105 sm:h-80"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent" />
        <p className="pointer-events-none absolute bottom-4 left-5 font-mono text-[11px] uppercase tracking-widest text-white/60">
          Click to zoom &middot; pinch on mobile
        </p>
      </motion.div>

      <div className="mt-6 grid gap-6 md:grid-cols-[0.9fr_1.1fr]">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7 }}
          className="card-edge glass-panel flex flex-col justify-center gap-4 p-8"
        >
          <StatRow label="Discipline" value="Mechanical Engineering + AI/ML" />
          <StatRow label="Based at" value="MIT Academy of Engineering, Pune" />
          <StatRow label="Currently" value="Research Intern, CAIR IIT Mandi" />
          <StatRow label="Status" value="Open to internships & collaborations" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="card-edge glass-panel p-8"
        >
          {profile.bioParagraphs.slice(1).map((p, i) => (
            <p key={i} className="mb-4 text-white/75 leading-relaxed last:mb-0">
              {p}
            </p>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="mt-6 flex flex-wrap items-center justify-center gap-3"
      >
        {domains.map((d) => (
          <span
            key={d}
            className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 font-mono text-xs uppercase tracking-widest text-arcane-soft"
          >
            {d}
          </span>
        ))}
      </motion.div>
    </section>
  )
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 border-b border-white/5 pb-4 last:border-0 last:pb-0">
      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-ember shadow-[0_0_8px_2px_rgba(255,106,61,0.6)]" />
      <div>
        <p className="font-mono text-[11px] uppercase tracking-widest text-white/45">{label}</p>
        <p className="rune-text text-white">{value}</p>
      </div>
    </div>
  )
}
