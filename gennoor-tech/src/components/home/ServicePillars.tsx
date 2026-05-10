'use client'

import Link from 'next/link'
import { Brain, GraduationCap, Code2, Bot, ArrowRight } from 'lucide-react'
import { siteConfig } from '@/lib/site-config'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef } from 'react'

const icons = {
  Strategy: Brain,
  GraduationCap: GraduationCap,
  Code2: Code2,
  Bot: Bot,
}

function GlassCard({ service, index }: { service: typeof siteConfig.services[0]; index: number }) {
  const Icon = icons[service.icon as keyof typeof icons]
  const cardRef = useRef<HTMLDivElement>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4, 4]), { stiffness: 300, damping: 30 })

  const handleMouse = (e: React.MouseEvent) => {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const resetMouse = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  const glowX = useTransform(mouseX, [-0.5, 0.5], ['20%', '80%'])
  const glowY = useTransform(mouseY, [-0.5, 0.5], ['20%', '80%'])

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouse}
      onMouseLeave={resetMouse}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className="relative"
    >
      <Link
        href={service.href}
        className="group relative block rounded-2xl p-7 transition-all duration-500 glass-card glow-border overflow-hidden"
      >
        {/* Cursor-reactive glow */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
          style={{
            background: useTransform(
              [glowX, glowY],
              ([x, y]) => `radial-gradient(300px circle at ${x} ${y}, rgba(37, 99, 235, 0.06), transparent 60%)`
            ),
          }}
        />

        {/* Icon */}
        <motion.div
          className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mb-5 shadow-lg shadow-primary-500/15"
          whileHover={{ scale: 1.08, rotate: 3 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          <Icon className="w-7 h-7 text-white" />
        </motion.div>

        <h3 className="text-xl font-bold text-gray-900 mb-3">
          {service.title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-5">
          {service.description}
        </p>

        {/* Learn More */}
        <div className="flex items-center text-primary-600 text-sm font-semibold">
          <span>Learn more</span>
          <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
        </div>
      </Link>
    </motion.div>
  )
}

export default function ServicePillars() {
  return (
    <section className="py-20 lg:py-32 relative">
      {/* Section divider */}
      <div className="section-divider absolute top-0 left-[10%] right-[10%]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            className="inline-flex items-center rounded-full px-3 py-1 mb-4 text-xs font-semibold text-primary-600 bg-primary-50/80 border border-primary-100/60"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Our Services
          </motion.div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            How We Transform Organizations with AI
          </h2>
          <p className="text-lg text-gray-500 leading-relaxed">
            From strategic planning to hands-on implementation, delivering end-to-end AI transformation services
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {siteConfig.services.map((service, index) => (
            <GlassCard key={service.title} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
