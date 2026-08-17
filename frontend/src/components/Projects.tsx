import { motion } from 'framer-motion'
import { projects } from '../data/portfolioData'
import SectionDivider from './SectionDivider'
import TiltCard from './TiltCard'
import ProjectVisual from './ProjectVisual'

export default function Projects() {
  return (
    <section id="projects" className="relative mx-auto max-w-6xl px-6 py-16">
      <SectionDivider />
      <div className="mt-8 text-center">
        <p className="eyebrow">The Conjurings</p>
        <h2 className="section-heading mt-2">Projects</h2>
      </div>

      <div className="mt-14 grid gap-7 md:grid-cols-2">
        {projects.map((project, i) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
          >
            <TiltCard glowColor="rgba(168,107,255,0.28)" intensity={8} className="flex h-full flex-col">
              <div className="relative h-52 w-full overflow-hidden">
                <ProjectVisual kind={project.visual} image={'image' in project ? project.image : undefined} title={project.title} />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void via-void/10 to-transparent" />
                <span className="pointer-events-none absolute left-4 top-4 rounded-full border border-white/20 bg-black/40 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-arcane-soft backdrop-blur">
                  {project.tag}
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-3 p-6">
                <h3 className="rune-text text-xl text-white">{project.title}</h3>
                <p className="flex-1 text-sm leading-relaxed text-white/65">{project.description}</p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {project.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] text-white/60"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <div className="mt-3 flex gap-3">
                  <a
                    href={project.codeUrl}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="active"
                    className="btn-glow py-2 text-xs"
                  >
                    View Code
                  </a>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
