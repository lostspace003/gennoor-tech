'use client'

import Link from 'next/link'
import { ArrowRight, BookOpen, Headphones, Award, Play } from 'lucide-react'
import { motion } from 'framer-motion'

const features = [
  { icon: BookOpen, label: '100% Self-Paced', desc: 'No schedules, no deadlines — learn on your own time, at your own speed', color: 'from-blue-500 to-blue-600' },
  { icon: Headphones, label: 'Built-in Audio', desc: 'Every chapter has narration so you can listen while you follow along', color: 'from-teal-500 to-teal-600' },
  { icon: Award, label: 'Cross-Device Sync', desc: 'Sign in once and pick up right where you left off on any device', color: 'from-amber-500 to-amber-600' },
  { icon: Play, label: 'Free Forever', desc: 'No paywalls, no upsells — full courses completely free, always', color: 'from-purple-500 to-purple-600' },
]

export default function AcademyCTA() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0C1426] via-[#132040] to-[#0d3b66]" />

      {/* Ambient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 right-[10%] w-[400px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(13, 148, 136, 0.15) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
          animate={{ y: [0, -15, 10, 0], scale: [1, 1.05, 0.97, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 left-[5%] w-[350px] h-[350px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.1) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
          animate={{ y: [0, 10, -15, 0], scale: [1, 0.96, 1.04, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left — Text */}
            <div>
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 border border-white/10"
                style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)' }}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <span className="w-1.5 h-1.5 bg-secondary-400 rounded-full animate-pulse" />
                <span className="text-secondary-400 text-xs font-bold tracking-wider uppercase">100% Free</span>
              </motion.div>

              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-5 leading-tight">
                AI Courses for{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-secondary-400">
                  Everyone
                </span>
              </h2>
              <p className="text-lg text-white/50 mb-8 max-w-lg leading-relaxed">
                Whether you&apos;re in tech, business, HR, or any domain — we have free, self-paced courses
                to help you understand and apply AI in your role. No prior technical knowledge needed.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href="/ai-academy"
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-gradient-to-r from-accent-500 to-accent-600 text-white font-bold rounded-xl hover:shadow-glow-teal shadow-lg shadow-accent-500/20 transition-all duration-300 group"
                  >
                    <Play className="w-4 h-4" />
                    Start Learning Free
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href="/ai-academy/ab-100"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-white/70 font-medium border border-white/10 rounded-xl hover:bg-white/5 transition-all duration-300"
                  >
                    View Course Details
                  </Link>
                </motion.div>
              </div>

              <p className="text-xs text-white/30 tracking-wide">
                No credit card required • No login needed to start • Progress saved automatically
              </p>
            </div>

            {/* Right — Feature cards */}
            <div className="grid grid-cols-2 gap-4">
              {features.map((item, index) => (
                <motion.div
                  key={item.label}
                  className="rounded-2xl p-5 border border-white/[0.06] group transition-all duration-400"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(8px)',
                  }}
                  whileHover={{
                    y: -3,
                    background: 'rgba(255, 255, 255, 0.06)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                  }}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-1">{item.label}</h3>
                  <p className="text-white/40 text-xs leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
