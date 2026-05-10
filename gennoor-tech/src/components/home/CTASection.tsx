'use client'

import Link from 'next/link'
import { ArrowRight, CheckCircle, BookOpen } from 'lucide-react'
import { motion } from 'framer-motion'

export default function CTASection() {
  const benefits = [
    '14+ years of enterprise experience',
    'Hands-on PoC development',
    'Microsoft Certified Trainer',
    'Free AI Academy courses',
  ]

  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      {/* Ambient gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f0f4ff] via-white to-[#f0fdf8]" />
      <div className="absolute inset-0 bg-gradient-mesh" />

      {/* Ambient glow */}
      <motion.div
        className="absolute top-[20%] left-[30%] w-[400px] h-[400px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.06) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{ y: [0, -10, 10, 0], scale: [1, 1.03, 0.97, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <motion.div
              className="inline-flex items-center rounded-full px-3 py-1 mb-5 text-xs font-semibold text-primary-600 bg-primary-50/80 border border-primary-100/60"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Get Started
            </motion.div>

            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Ready to Bring AI to Your Organization?
            </h2>
            <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
              Whether you need strategic guidance, team training, or hands-on implementation,
              I'm here to help you navigate your AI transformation journey.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="flex items-center justify-center gap-2 text-sm text-gray-600 rounded-xl py-3 px-3 glass-card"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                >
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span className="text-xs font-medium">{benefit}</span>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/resources/calendar"
                  className="inline-flex items-center justify-center px-8 py-4 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:shadow-glow-blue transition-all duration-300 group"
                >
                  Book a Discovery Call
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/ai-academy"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-semibold rounded-xl text-accent-700 glass-card border-accent-200/50 hover:border-accent-300 transition-all duration-300"
                >
                  <BookOpen className="h-4 w-4" />
                  Start Free Academy
                </Link>
              </motion.div>
            </div>

            <p className="mt-8 text-xs text-gray-400 tracking-wide">
              No commitment required • Free courses available • Let's discuss your AI goals
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
