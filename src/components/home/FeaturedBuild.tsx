'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, ExternalLink, Sparkles } from 'lucide-react'
import InlineVideoPlayer from '@/components/InlineVideoPlayer'
import { BLOB_URL } from '@/lib/site-config'

const LIVE_URL = 'https://safar-anbiya.gennoor.com'

const highlights = [
  '25 interactive prophet journeys, each with its own animated night sky',
  'Bilingual neural-voice narration (English + Urdu) with real Qur’an recitation',
  'A full cloud backend — accounts, child profiles, progress, media',
  'Installable on any phone as an app — works offline',
]

export default function FeaturedBuild() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      {/* Twilight backdrop — the product's own palette */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #0C0820 0%, #1A1140 55%, #0C0820 100%)' }} />
      {/* Aurora / star wash */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background:
            'radial-gradient(60% 50% at 18% 22%, rgba(245,196,81,0.10) 0%, transparent 60%), radial-gradient(50% 45% at 85% 75%, rgba(46,158,107,0.10) 0%, transparent 60%)',
        }}
      />
      <motion.div
        aria-hidden
        className="absolute -top-24 right-[12%] w-[420px] h-[420px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(245,196,81,0.12) 0%, transparent 70%)', filter: 'blur(50px)' }}
        animate={{ y: [0, -12, 8, 0], scale: [1, 1.04, 0.98, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
            {/* Portrait video */}
            <motion.div
              className="lg:col-span-5"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mx-auto max-w-[300px]">
                <div
                  className="rounded-[2rem] p-2"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(245,196,81,0.25)', boxShadow: '0 30px 80px -30px rgba(245,196,81,0.35)' }}
                >
                  <InlineVideoPlayer
                    videoSrc={`${BLOB_URL}/videos/safar-anbiya-full.mp4`}
                    posterSrc="/showcase/safar-anbiya/screenshot-phone.png"
                    aspectClass="aspect-[9/16]"
                    posterFit="cover"
                    rounded="rounded-[1.6rem]"
                    className="shadow-none"
                  />
                </div>
                <p className="mt-3 text-center text-xs text-amber-100/60">
                  🔊 Sound on — one full journey, start to finish (4:36)
                </p>
              </div>
            </motion.div>

            {/* Copy */}
            <motion.div
              className="lg:col-span-7"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs font-semibold text-amber-200">
                <Sparkles className="h-3.5 w-3.5" />
                Built &amp; shipped by Gennoor Tech
              </div>

              <div className="mb-4 flex items-center gap-3">
                <Image
                  src="/showcase/safar-anbiya/emblem.png"
                  alt="Safar-e-Anbiya lantern emblem"
                  width={48}
                  height={48}
                  className="h-12 w-12 object-contain drop-shadow"
                />
                <h2 className="text-3xl font-black text-white lg:text-4xl">
                  Safar-e-Anbiya <span className="text-amber-300">· Journey of the Prophets</span>
                </h2>
              </div>

              <p className="mb-6 max-w-xl text-lg leading-relaxed text-indigo-100/80">
                A cinematic, gamified learning app for children that turns the lives of all 25
                prophets into an interactive adventure — story, a moral choice, the real Qur&rsquo;anic
                verse, a quiz and a reward, all wrapped in a light-and-stars progress journey.
                Designed, built and shipped end-to-end — web, mobile and cloud.
              </p>

              <ul className="mb-8 space-y-2.5">
                {highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 text-sm text-indigo-100/85">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-300" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/work/safar-anbiya"
                  className="group inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-sm font-bold text-[#1A1140] shadow-lg shadow-amber-400/25 transition-all hover:bg-amber-300"
                >
                  See how it&rsquo;s built
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <a
                  href={LIVE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Open the live app
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
