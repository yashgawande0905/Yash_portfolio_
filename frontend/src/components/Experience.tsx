import { motion } from 'framer-motion'
import { useState } from 'react'
import { experience, type ExperienceItem } from '../data/portfolioData'
import SectionDivider from './SectionDivider'
import TiltCard from './TiltCard'
import SanctumRing from './SanctumRing'

function Glyph({ item }: { item: ExperienceItem }) {
  const label = item.glyphLabel || item.org.slice(0, 4).toUpperCase()
  return (
    <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-void-300 via-void-200 to-void-300">
      <div className="absolute opacity-30">
        <SanctumRing size={200} color="#a86bff" />
      </div>
      <span className="rune-text relative text-2xl font-bold tracking-widest text-white/60">{label}</span>
    </div>
  )
}

function Visual({ item }: { item: ExperienceItem }) {
  // If a photo ever fails to load in production, fall back to the sigil rather
  // than leaving a broken-image box in the card.
  const [failed, setFailed] = useState(false)

  if (!item.image || failed) return <Glyph item={item} />

  return (
    <>
      <img
        src={item.image}
        alt={`${item.org} campus`}
        onError={() => setFailed(true)}
        style={{ objectPosition: item.imagePosition }}
        className="h-full w-full object-cover"
        loading="lazy"
        decoding="async"
      />
      {item.credit && (
        <a
          href={item.credit.href}
          target="_blank"
          rel="noreferrer nofollow"
          data-cursor="active"
          title={`Photo: ${item.credit.text}`}
          className="absolute right-2 top-2 z-20 rounded-full bg-black/55 px-2 py-0.5 font-mono text-[8px] uppercase tracking-wider text-white/45 backdrop-blur transition-colors hover:text-white/80"
        >
          © {item.credit.text.split(' /')[0]}
        </a>
      )}
    </>
  )
}

export default function Experience() {
  return (
    <section id="experience" className="relative mx-auto max-w-6xl px-6 py-16">
      <SectionDivider />
      <div className="mt-8 text-center">
        <p className="eyebrow">The Trials</p>
        <h2 className="section-heading mt-2">Experience</h2>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {experience.map((item, i) => (
          <motion.div
            key={item.org}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
          >
            <TiltCard glowColor="rgba(255,106,61,0.25)" className="flex h-full flex-col">
              <div className="relative h-40 w-full overflow-hidden">
                <Visual item={item} />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void via-void/10 to-transparent" />
                <span className="pointer-events-none absolute bottom-3 left-4 rounded-full border border-white/20 bg-black/40 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-arcane-soft backdrop-blur">
                  {item.period}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-2 p-6">
                <h3 className="rune-text text-lg text-white">{item.role}</h3>
                <p className="font-mono text-xs uppercase tracking-widest text-ember-soft">{item.org}</p>
                <p className="font-mono text-[11px] text-white/40">{item.location}</p>
                <p className="mt-1 flex-1 text-sm leading-relaxed text-white/65">{item.detail}</p>
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
