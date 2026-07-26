'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { siteConfig, BLOB_URL } from '@/lib/site-config'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import InlineVideoPlayer from '@/components/InlineVideoPlayer'

const GennoorLogo = dynamic(() => import('@/components/GennoorLogo'), {
  ssr: false,
  loading: () => <div className="h-[180px] w-[650px] animate-pulse bg-gray-200/10 rounded-lg" />
})

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 1.8,
    },
  },
} as const

const slideIn = {
  hidden: { opacity: 0, x: -30, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring' as const, stiffness: 200, damping: 25 },
  },
}

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center">
      {/* Ambient gradient mesh background */}
      <div className="absolute inset-0 bg-white" />
      <div className="absolute inset-0 bg-gradient-mesh" />

      {/* Animated ambient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-32 right-[10%] w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(37, 99, 235, 0.06) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
          animate={{
            y: [0, -20, 10, 0],
            x: [0, 15, -10, 0],
            scale: [1, 1.05, 0.98, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-32 left-[5%] w-[450px] h-[450px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(13, 148, 136, 0.05) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
          animate={{
            y: [0, 15, -20, 0],
            x: [0, -10, 15, 0],
            scale: [1, 0.97, 1.04, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
        <motion.div
          className="absolute top-[30%] left-[40%] w-[300px] h-[300px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(37, 99, 235, 0.03) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
          animate={{
            y: [0, 20, -15, 0],
            scale: [1, 1.08, 0.96, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        />
      </div>

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

            {/* Left Column - Text Content */}
            <motion.div
              className="text-left"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Badge — one8 micro-badge */}
              <motion.div variants={slideIn}>
                <div className="inline-flex items-center rounded-full border border-gray-300 bg-white px-4 py-1.5 mb-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-900">
                  {siteConfig.hero.badge}
                </div>
              </motion.div>

              {/* Main Headline — solid near-black display type */}
              <motion.h1
                className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 mb-6 leading-[1.1]"
                variants={slideIn}
              >
                {siteConfig.hero.headline}
              </motion.h1>

              {/* Brand Promise — the five-word transformation arc */}
              <motion.div
                variants={slideIn}
                className="font-heading mb-5 flex flex-wrap items-center gap-x-1.5 text-sm sm:text-base font-semibold tracking-wide"
              >
                {siteConfig.hero.brandPromise.split(' ').map((word, idx) => {
                  const isPunct = word.endsWith('.')
                  const clean = isPunct ? word.slice(0, -1) : word
                  return (
                    <span key={`${word}-${idx}`} className="inline-flex items-baseline">
                      <span className="text-gray-700">{clean}</span>
                      {isPunct && <span className="text-amber-500">.</span>}
                    </span>
                  )
                })}
              </motion.div>

              {/* Subheadline */}
              <motion.p
                className="text-base sm:text-lg text-gray-500 mb-8 max-w-xl leading-relaxed"
                variants={slideIn}
              >
                {siteConfig.hero.subheadline}
              </motion.p>

              {/* CTAs */}
              <motion.div className="flex flex-col sm:flex-row gap-3" variants={slideIn}>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href={siteConfig.hero.cta1.href}
                    className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:shadow-glow-blue transition-all duration-300 group"
                  >
                    {siteConfig.hero.cta1.text}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href={siteConfig.hero.cta2.href}
                    className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-semibold rounded-xl text-gray-700 glass-card hover:border-primary-200 transition-all duration-300"
                  >
                    {siteConfig.hero.cta2.text}
                  </Link>
                </motion.div>
              </motion.div>

              {/* POC Link — demoted to a quiet secondary link so the primary CTA stays singular */}
              <motion.div className="mt-5" variants={slideIn}>
                <Link
                  href="/services/poc-development#live-demo"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-primary-600 transition-colors group"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>See our latest PoC in action</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Column - Video */}
            <motion.div
              className="flex flex-col items-center lg:items-end"
              initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ delay: 2.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="relative w-[280px] sm:w-[320px] lg:w-[360px] max-w-full lg:mr-8">
                {/* Ambient glow behind video */}
                <div className="absolute -inset-8 bg-gradient-to-br from-primary-500/8 to-accent-500/8 rounded-3xl blur-2xl" />

                <div className="relative mb-6">
                  <div className="rounded-2xl overflow-hidden glass-card p-1">
                    <InlineVideoPlayer
                      videoSrc={`${BLOB_URL}/videos/gennoor-promo-vo.mp4`}
                      posterSrc={`${BLOB_URL}/videos/gennoor-promo-poster.jpg`}
                      aspectClass="aspect-[9/16]"
                      rounded="rounded-xl"
                      className="shadow-none"
                    />
                  </div>
                  <p className="text-center text-sm font-semibold text-gray-500 mt-4 tracking-wide">
                    Gennoor in 2 minutes — sound on 🔊
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade to white */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  )
}
