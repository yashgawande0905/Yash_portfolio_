import { motion } from 'framer-motion'
import { useState } from 'react'
import { skillCategories } from '../data/portfolioData'
import SectionDivider from './SectionDivider'

function sigil(name: string) {
  const words = name.replace(/[^a-zA-Z0-9 ]/g, '').split(' ').filter(Boolean)
  if (words.length > 1) return words.map((w) => w[0]).join('').slice(0, 3).toUpperCase()
  return name.slice(0, 3).toUpperCase()
}

function Sigil({ name }: { name: string }) {
  return (
    <span className="font-mono text-[10px] font-semibold tracking-wider text-arcane-soft">
      {sigil(name)}
    </span>
  )
}

/**
 * Several logos are hotlinked from third-party CDNs, and those URLs do rot —
 * fall back to the lettered sigil instead of showing a broken-image box.
 */
function SkillIcon({ name, icon }: { name: string; icon?: string }) {
  const [failed, setFailed] = useState(false)
  if (!icon || failed) return <Sigil name={name} />
  return (
    <img
      src={icon}
      alt={name}
      onError={() => setFailed(true)}
      className="h-full w-full object-contain"
      loading="lazy"
      decoding="async"
    />
  )
}

export default function Skills() {
  return (
    <section id="skills" className="relative mx-auto max-w-6xl px-6 py-16">
      <SectionDivider />
      <div className="mt-8 text-center">
        <p className="eyebrow">The Arsenal</p>
        <h2 className="section-heading mt-2">Skills &amp; Tools</h2>
      </div>

      <div className="mt-14 flex flex-col gap-14">
        {skillCategories.map((cat, ci) => (
          <div key={cat.title}>
            <motion.h3
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.5 }}
              className="mb-5 flex items-center gap-3 font-mono text-sm uppercase tracking-[0.25em] text-arcane-soft"
            >
              <span className="text-ember">{cat.glyph}</span> {cat.title}
            </motion.h3>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {cat.skills.map((skill, i) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, y: 24, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.4, delay: (ci * 0.05 + i * 0.04) % 0.6 }}
                  whileHover={{ y: -6 }}
                  data-cursor="active"
                  className="card-edge glass-panel group flex flex-col items-center gap-3 p-4 transition-shadow duration-300 hover:shadow-glow-arcane"
                >
                  <motion.div
                    whileHover={{ rotate: 12 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 12 }}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 p-2"
                  >
                    <SkillIcon name={skill.name} icon={skill.icon} />
                  </motion.div>
                  <span className="text-center font-mono text-xs text-white/75 group-hover:text-white">
                    {skill.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
