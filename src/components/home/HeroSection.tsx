'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { BLOB_URL } from '@/lib/site-config'
import { motion } from 'framer-motion'
import InlineVideoPlayer from '@/components/InlineVideoPlayer'

/**
 * Apple-style centered hero, per the redesign handoff. The 2-minute promo
 * video the old split hero carried survives as a quiet media block directly
 * below the display type.
 */

const EASE = [0.16, 1, 0.3, 1] as const

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease: EASE, delay },
})

export default function HeroSection() {
  return (
    <section className="bg-white">
      {/* Display block */}
      <div className="px-8 pt-24 lg:pt-[140px] pb-16 text-center">
        <motion.div {...rise(0)} className="kicker mb-[22px]">
          Enterprise AI Transformation
        </motion.div>
        <motion.h1 {...rise(0.08)} className="display-hero max-w-[820px] mx-auto">
          AI that actually ships.
        </motion.h1>
        <motion.p
          {...rise(0.16)}
          className="text-[clamp(19px,2vw,24px)] leading-[1.45] text-[#6e6e73] max-w-[640px] mx-auto mt-[26px]"
        >
          We train your people, build your production agents, and stay until it
          works. Fixed price, from $3k, live in six weeks.
        </motion.p>
        <motion.div
          {...rise(0.24)}
          className="flex flex-col sm:flex-row gap-5 sm:gap-[22px] justify-center items-center mt-[38px]"
        >
          <Link href="/ai-readiness" className="pill-primary">
            Run the diagnostic
          </Link>
          <Link href="/contact" className="link-arrow">
            Talk to our team ›
          </Link>
        </motion.div>
        <motion.div {...rise(0.34)} className="text-sm text-[#86868b] mt-14">
          Diagnose &nbsp;·&nbsp; Train &nbsp;·&nbsp; Innovate &nbsp;·&nbsp; Build &nbsp;·&nbsp; Sustain
        </motion.div>
      </div>

      {/* Promo video — preserved feature, presented as a quiet media block */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '0px 0px -60px 0px' }}
        transition={{ duration: 0.9, ease: EASE }}
        className="px-8 pb-24 lg:pb-[110px]"
      >
        <div className="w-[280px] sm:w-[320px] max-w-full mx-auto">
          <div className="rounded-3xl overflow-hidden border border-[#e8e8ed] bg-[#f5f5f7] p-1.5">
            <InlineVideoPlayer
              videoSrc={`${BLOB_URL}/videos/gennoor-promo-vo.mp4`}
              posterSrc={`${BLOB_URL}/videos/gennoor-promo-poster.jpg`}
              aspectClass="aspect-[9/16]"
              rounded="rounded-[18px]"
              className="shadow-none"
            />
          </div>
          <p className="text-center text-[13px] text-[#86868b] mt-4">
            Gennoor in 2 minutes — sound on
          </p>
          <p className="text-center mt-2">
            <Link
              href="/services/poc-development#live-demo"
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#6e6e73] hover:text-primary-600 transition-colors group"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>See our latest PoC in action</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </p>
        </div>
      </motion.div>
    </section>
  )
}
