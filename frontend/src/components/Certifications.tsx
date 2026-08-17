import { motion } from 'framer-motion'
import { certifications } from '../data/portfolioData'
import SectionDivider from './SectionDivider'

export default function Certifications() {
  return (
    <section id="certifications" className="relative mx-auto max-w-5xl px-6 py-16">
      <SectionDivider />
      <div className="mt-8 text-center">
        <p className="eyebrow">The Seals</p>
        <h2 className="section-heading mt-2">Certifications</h2>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {certifications.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            whileHover={{ y: -3 }}
            className="card-edge glass-panel flex items-start gap-4 p-5 transition-shadow duration-300 hover:shadow-glow-arcane"
          >
            <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-arcane/40 text-arcane-soft">
              &#10022;
            </span>
            <div>
              <h3 className="rune-text text-base leading-snug text-white">{c.title}</h3>
              <p className="mt-1 font-mono text-xs uppercase tracking-widest text-ember-soft">{c.issuer}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
