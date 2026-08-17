import { motion } from 'framer-motion'
import { education } from '../data/portfolioData'
import SectionDivider from './SectionDivider'

export default function Education() {
  return (
    <section id="education" className="relative mx-auto max-w-4xl px-6 py-16">
      <SectionDivider />
      <div className="mt-8 text-center">
        <p className="eyebrow">The Path</p>
        <h2 className="section-heading mt-2">Education</h2>
      </div>

      <div className="relative mt-16 flex flex-col gap-14">
        <motion.div
          className="absolute left-6 top-0 h-full w-px origin-top bg-gradient-to-b from-ember via-arcane to-mystic sm:left-1/2"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        />

        {education.map((item, i) => {
          const leftSide = i % 2 === 0
          return (
            <div
              key={item.school}
              className={`relative flex flex-col gap-4 pl-16 sm:items-center sm:gap-10 sm:pl-0 ${
                leftSide ? 'sm:flex-row' : 'sm:flex-row-reverse'
              }`}
            >
              <span className="absolute left-6 top-6 z-10 -translate-x-1/2 sm:left-1/2">
                <motion.span
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="block h-4 w-4 rounded-full border-2 border-ember bg-void shadow-[0_0_16px_4px_rgba(255,106,61,0.6)]"
                />
              </span>

              <motion.div
                initial={{ opacity: 0, x: leftSide ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6 }}
                className="card-edge glass-panel flex-1 gap-4 overflow-hidden p-5 sm:flex"
              >
                <img
                  src={item.image}
                  alt={item.school}
                  className="mb-4 h-32 w-full rounded-xl object-cover sm:mb-0 sm:h-24 sm:w-32 sm:shrink-0"
                  loading="lazy"
                />
                <div>
                  <h3 className="rune-text text-lg text-white">{item.school}</h3>
                  <p className="mt-1 font-mono text-xs uppercase tracking-widest text-arcane-soft">
                    {item.degree} &middot; {item.period}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">{item.detail}</p>
                </div>
              </motion.div>

              <div className="hidden flex-1 sm:block" />
            </div>
          )
        })}
      </div>
    </section>
  )
}
