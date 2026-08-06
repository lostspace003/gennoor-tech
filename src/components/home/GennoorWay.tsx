'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Compass, GraduationCap, Lightbulb, Hammer, RefreshCcw, ArrowRight } from 'lucide-react'

const phases = [
  {
    number: '01',
    name: 'Diagnose',
    icon: Compass,
    description: 'AI Readiness Score · use-case backlog · 12-month roadmap · governance charter',
    duration: '1–4 weeks',
  },
  {
    number: '02',
    name: 'Train',
    icon: GraduationCap,
    description: 'C-suite, functional and technical cohorts. Custom curricula with your data.',
    duration: '2–8 weeks',
  },
  {
    number: '03',
    name: 'Innovate',
    icon: Lightbulb,
    description: 'A working PoC in your environment. Fixed scope, fixed price, real evaluation.',
    duration: '4–8 weeks',
  },
  {
    number: '04',
    name: 'Build',
    icon: Hammer,
    description: 'Production deployment, MLOps, knowledge transfer to your team.',
    duration: '8–20 weeks',
  },
  {
    number: '05',
    name: 'Sustain',
    icon: RefreshCcw,
    description: 'Quarterly health checks, cost audits, continuous L&D, expansion roadmap.',
    duration: 'Ongoing',
  },
]

export default function GennoorWay() {
  return (
    <section className="py-14 lg:py-20 relative">
      <div className="section-divider absolute top-0 left-[10%] right-[10%]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 lg:mb-16">
          <motion.div
            className="inline-flex items-center rounded-full border border-gray-300 bg-white px-4 py-1.5 mb-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-900"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            The Gennoor Way
          </motion.div>
          <motion.h2
            className="text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 mb-5"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
          >
            One partner. Five phases. End to end.
          </motion.h2>
          <motion.p
            className="text-lg text-gray-500 leading-relaxed"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Diagnose what you have. Train your people. Innovate on the highest-value use case.
            Build for production. Sustain for the long run. Start at any phase.
          </motion.p>
        </div>

        {/* Phases — horizontal flow on desktop, vertical stack on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-3">
          {phases.map((phase, i) => {
            const Icon = phase.icon
            return (
              <motion.div
                key={phase.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                <div className="group h-full rounded-2xl p-6 glass-card glow-border transition-all duration-500">
                  {/* Number + Icon row */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold tracking-widest text-gray-300">
                      {phase.number}
                    </span>
                    <div className="w-11 h-11 rounded-xl bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/15 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">{phase.name}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">
                    {phase.description}
                  </p>
                  <div className="text-xs font-semibold text-primary-600 tracking-wide">
                    {phase.duration}
                  </div>
                </div>

                {/* Arrow connector — desktop only, between phases */}
                {i < phases.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-2 -translate-y-1/2 z-10 pointer-events-none">
                    <ArrowRight className="w-4 h-4 text-primary-300" />
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Footer CTAs */}
        <motion.div
          className="mt-12 flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center items-center"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Link
            href="/the-gennoor-way"
            className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
          >
            Read the full methodology
            <ArrowRight className="w-4 h-4" />
          </Link>
          <span className="hidden sm:inline text-gray-300">·</span>
          <Link
            href="/ai-readiness"
            className="inline-flex items-center gap-2 text-gray-600 font-semibold hover:text-primary-600 transition-colors"
          >
            Or take the 15-minute diagnostic
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
