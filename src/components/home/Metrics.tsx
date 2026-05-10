'use client'

import { siteConfig } from '@/lib/site-config'
import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

const metrics = [
  {
    value: siteConfig.metrics.trainingPrograms,
    label: 'Training Programs Delivered',
    description: 'Across Fortune 500 companies',
  },
  {
    value: siteConfig.metrics.certifications,
    label: 'Active Microsoft Certifications',
    description: 'Including MCT & Agentic AI',
  },
  {
    value: siteConfig.metrics.cSuiteLeaders,
    label: 'C-Suite Leaders Trained',
    description: 'In AI strategy & adoption',
  },
  {
    value: siteConfig.metrics.countries,
    label: 'Countries',
    description: 'International delivery experience',
  },
]

function AnimatedNumber({ value, inView }: { value: string; inView: boolean }) {
  const numMatch = value.match(/^(\d+)(.*)$/)
  const [displayed, setDisplayed] = useState(0)
  const target = numMatch ? parseInt(numMatch[1]) : 0
  const suffix = numMatch ? numMatch[2] : value

  useEffect(() => {
    if (!inView || !numMatch) return
    let start = 0
    const duration = 1500
    const startTime = performance.now()
    const step = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayed(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [inView, target])

  if (!numMatch) return <span>{value}</span>
  return <span>{displayed}{suffix}</span>
}

export default function Metrics() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '0px 0px -100px 0px' })

  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      {/* Premium gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f1729] via-[#111b33] to-[#0c1524]" />

      {/* Ambient glow orbs */}
      <motion.div
        className="absolute top-0 left-[20%] w-[500px] h-[500px] rounded-full opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.2) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        animate={{ y: [0, -15, 10, 0], scale: [1, 1.05, 0.97, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-0 right-[15%] w-[400px] h-[400px] rounded-full opacity-25"
        style={{
          background: 'radial-gradient(circle, rgba(13, 148, 136, 0.2) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        animate={{ y: [0, 12, -18, 0], scale: [1, 0.96, 1.04, 1] }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div ref={ref} className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.div
            className="inline-flex items-center justify-center px-5 py-2 mb-4 text-sm font-semibold rounded-full border border-white/10"
            style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)' }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="flex h-2 w-2 rounded-full bg-primary-400 mr-2.5 animate-pulse shadow-glow-blue" />
            <span className="text-white/80">Founder & Lead Trainer</span>
          </motion.div>
          <p className="text-blue-200/60 text-lg max-w-3xl mx-auto">
            Building AI excellence through hands-on experience with Fortune 500 companies worldwide
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              className="text-center group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div
                className="rounded-2xl p-7 transition-all duration-500 border border-white/[0.06]"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(8px)',
                }}
                whileHover={{
                  y: -4,
                  background: 'rgba(255, 255, 255, 0.06)',
                  borderColor: 'rgba(37, 99, 235, 0.15)',
                }}
              >
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                  <AnimatedNumber value={metric.value} inView={isInView} />
                </div>
                <div className="text-blue-200/70 font-semibold mb-1 text-sm">
                  {metric.label}
                </div>
                <div className="text-blue-300/40 text-xs">
                  {metric.description}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
