'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Building2, Rocket, ArrowRight, Check } from 'lucide-react'

const tracks = [
  {
    icon: Rocket,
    eyebrow: 'For SMB & Growing Businesses',
    title: 'Ship your first AI pilot in 6 weeks.',
    blurb:
      'Productized offers from $3k. Fixed price. Fixed scope. Built in your environment, owned by your team.',
    bullets: [
      'AI Readiness Kit from $3k · 1 week',
      'Copilot Kickstart from $10k · 4 weeks',
      'Single Agent Build from $25k · 6 weeks',
    ],
    cta: { text: 'Explore SMB Solutions', href: '/services' },
    accent: 'from-amber-500 to-amber-600',
    accentLight: 'amber-50',
  },
  {
    icon: Building2,
    eyebrow: 'For Enterprises',
    title: 'Transformation programs that survive the org chart.',
    blurb:
      'Multi-quarter delivery with executive sponsorship, governance, procurement-ready, and senior delivery in your region.',
    bullets: [
      'Strategic Diagnostic · 4 weeks',
      'Executive & Functional Bootcamps',
      'Transformation Programs · 9–20 weeks',
    ],
    cta: { text: 'Explore Enterprise Solutions', href: '/services' },
    accent: 'from-primary-500 to-primary-700',
    accentLight: 'primary-50',
  },
]

export default function DualAudienceSelector() {
  return (
    <section className="py-20 lg:py-24 relative">
      <div className="section-divider absolute top-0 left-[10%] right-[10%]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            className="inline-flex items-center rounded-full px-3 py-1 mb-4 text-xs font-semibold text-primary-600 bg-primary-50/80 border border-primary-100/60"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Pick Your Track
          </motion.div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Two paths. Same Gennoor Way.
          </h2>
          <p className="text-lg text-gray-500 leading-relaxed">
            Whether you're a 30-person mid-cap in Nairobi or a 30,000-person bank in Riyadh,
            we deliver the same five-phase journey — scoped, priced, and paced to fit.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {tracks.map((track, i) => {
            const Icon = track.icon
            return (
              <motion.div
                key={track.eyebrow}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4 }}
              >
                <Link
                  href={track.cta.href}
                  className="group block h-full rounded-3xl p-8 lg:p-10 glass-card glow-border transition-all duration-500 relative overflow-hidden"
                >
                  {/* Subtle accent glow on hover */}
                  <div
                    className={`absolute -top-24 -right-24 w-64 h-64 rounded-full bg-gradient-to-br ${track.accent} opacity-0 group-hover:opacity-[0.08] blur-3xl transition-opacity duration-700`}
                  />

                  <div className="relative">
                    {/* Icon */}
                    <div
                      className={`inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br ${track.accent} items-center justify-center mb-5 shadow-lg shadow-primary-500/15 group-hover:scale-105 transition-transform`}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>

                    <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-2">
                      {track.eyebrow}
                    </p>
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 leading-tight">
                      {track.title}
                    </h3>
                    <p className="text-base text-gray-500 leading-relaxed mb-6">
                      {track.blurb}
                    </p>

                    <ul className="space-y-2.5 mb-7">
                      {track.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2.5 text-sm text-gray-600">
                          <Check className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="inline-flex items-center text-primary-600 font-semibold group-hover:text-primary-700 transition-colors">
                      <span>{track.cta.text}</span>
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
