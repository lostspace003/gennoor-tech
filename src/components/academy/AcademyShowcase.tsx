'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Play } from 'lucide-react'
import { courses as catalogCourses } from '@/data/academy/courses'
import { tracks } from '@/data/academy/taxonomy'

/**
 * The Academy showcase — a "grand" product-preview carousel that advertises
 * the learning experience (learner dashboard, video-style chapter player,
 * verified certificates) and funnels visitors into the Academy. Used on the
 * Home page and on /academy. All visuals are CSS product previews in the
 * site palette — no screenshots, no fake user data (previews are labelled).
 */

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'
const AUTO_ADVANCE_MS = 6000

// ─── Product-preview mocks ───────────────────────────────────────────────

function DashboardMock() {
  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 w-full max-w-[400px] select-none" aria-hidden="true">
      <div className="text-[13px] font-bold text-gray-900 mb-3">Welcome back 👋</div>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          [String(catalogCourses.length), 'Courses'],
          [String(tracks.length), 'Tracks'],
          ['Certificate', 'On completion'],
        ].map(([v, l]) => (
          <div key={l} className="bg-[#f5f5f7] rounded-xl px-2 py-2.5 text-center">
            <div className="text-[17px] font-bold tracking-[-0.02em] text-gray-900 leading-none">{v}</div>
            <div className="text-[10px] text-[#86868b] mt-1">{l}</div>
          </div>
        ))}
      </div>
      <div className="text-[10.5px] font-semibold tracking-[0.1em] uppercase text-[#86868b] mb-1.5">
        Continue learning
      </div>
      <div className="border border-[#e8e8ed] rounded-xl px-3.5 py-3 mb-3">
        <div className="flex items-center justify-between gap-3">
          <div className="text-[12px] font-semibold text-gray-900 truncate">AB-100 · Agentic AI Architect</div>
          <span className="text-[10px] font-semibold text-primary-600 whitespace-nowrap">Continue ›</span>
        </div>
        <div className="mt-2 h-1 bg-[#f0f0f2] rounded-full overflow-hidden">
          <div className="h-full w-[68%] bg-primary-600 rounded-full" />
        </div>
      </div>
      <div className="flex gap-1.5 flex-wrap">
        {['✓ Chapter quizzes', '🎧 Narrated', '🏅 Certificate'].map(chip => (
          <span key={chip} className="text-[10px] font-medium text-[#6e6e73] bg-[#f5f5f7] rounded-full px-2 py-1">
            {chip}
          </span>
        ))}
      </div>
    </div>
  )
}

function PlayerMock() {
  return (
    <div className="bg-[#1d1d1f] rounded-2xl overflow-hidden w-full max-w-[400px] select-none" aria-hidden="true">
      <div className="px-5 pt-5 pb-4">
        <div className="text-[9px] font-semibold tracking-[0.14em] uppercase text-[#86868b] mb-2">
          Ch 03 · Develop AI strategy
        </div>
        <div className="text-[15px] font-bold text-white leading-snug mb-3">
          Agent types and solution design rules
        </div>
        <div className="space-y-1.5">
          <div className="h-1.5 bg-white/15 rounded-full w-[85%]" />
          <div className="h-1.5 bg-white/15 rounded-full w-[70%]" />
          <div className="h-1.5 bg-white/10 rounded-full w-[78%]" />
        </div>
      </div>
      <div className="bg-black/40 px-4 py-3 flex items-center gap-2.5">
        <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center flex-shrink-0">
          <Play className="w-3 h-3 text-gray-900 ml-px fill-current" />
        </span>
        <div className="relative flex-1 h-1 bg-white/20 rounded-full">
          <div className="absolute inset-y-0 left-0 w-[42%] bg-primary-600 rounded-full" />
          {[18, 34, 55, 74, 88].map(x => (
            <span key={x} className="absolute top-0 bottom-0 w-px bg-white/40" style={{ left: `${x}%` }} />
          ))}
        </div>
        <span className="text-[9px] text-white/60 tabular-nums">3:21 / 7:55</span>
        <span className="text-[9px] font-bold text-white bg-white/10 rounded-full px-1.5 py-0.5">1.0x</span>
      </div>
    </div>
  )
}

function CertificateMock() {
  return (
    <div className="bg-white rounded-2xl border border-[#e8e8ed] p-5 sm:p-6 w-full max-w-[400px] text-center select-none" aria-hidden="true">
      <div className="w-12 h-12 mx-auto rounded-full border-2 border-primary-600 flex items-center justify-center mb-3">
        <span className="text-[16px]">🏅</span>
      </div>
      <div className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[#86868b]">
        Certificate of completion
      </div>
      <div className="text-[16px] font-bold text-gray-900 mt-1.5">Your Name Here</div>
      <div className="text-[11px] text-[#6e6e73] mt-0.5 mb-3.5">AB-100 · Agentic AI Architect</div>
      <div className="inline-block text-[10px] font-medium text-primary-600 bg-primary-100 rounded-full px-3 py-1">
        gennoor.com/verify/GT-████-████
      </div>
    </div>
  )
}

// ─── Slides ──────────────────────────────────────────────────────────────

interface Slide {
  key: string
  kicker: string
  title: string
  body: string
  points: string[]
  cta: { label: string; href: string }
  secondary?: { label: string; href: string }
  /** Panel background classes */
  panel: string
  dark?: boolean
  Mock: () => React.ReactElement
}

const SLIDES: Slide[] = [
  {
    key: 'dashboard',
    kicker: 'Your learning home',
    title: 'Pick up exactly where you left off.',
    body: 'A learner dashboard that tracks every chapter, course, and certificate — one sign-in to start.',
    points: ['Progress saved automatically', 'All courses, one place', 'Certificates in your pocket'],
    cta: { label: 'Open the dashboard', href: '/academy/dashboard' },
    secondary: { label: 'Browse courses ›', href: '/studio' },
    panel: 'bg-[#1d1d1f]',
    dark: true,
    Mock: DashboardMock,
  },
  {
    key: 'player',
    kicker: 'Lessons that play like video',
    title: 'Press play. The course teaches itself.',
    body: 'Narrated chapters with a real timeline — scrub, jump slides, go fullscreen. The voice stays in sync in both directions.',
    points: ['Human-quality narration', 'Scrub like YouTube', 'Fullscreen, distraction-free'],
    cta: { label: 'Try a chapter', href: '/ai-academy/ab-100/course-introduction' },
    secondary: { label: 'All courses ›', href: '/studio' },
    panel: 'bg-[#f5f5f7]',
    Mock: PlayerMock,
  },
  {
    key: 'certificates',
    kicker: 'Proof you can share',
    title: 'Finish. Claim. Verify.',
    body: 'Every completed course ends in a verifiable certificate — claimed with just your email, checkable by anyone at a public link.',
    points: ['OTP-verified claim', 'Public verification page', 'LinkedIn-ready'],
    cta: { label: 'Start a course', href: '/studio' },
    secondary: { label: 'How the Academy works ›', href: '/studio' },
    panel: 'bg-white border border-[#e8e8ed]',
    Mock: CertificateMock,
  },
]

// ─── Carousel ────────────────────────────────────────────────────────────

export default function AcademyShowcase() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const go = useCallback((i: number) => {
    setIndex(((i % SLIDES.length) + SLIDES.length) % SLIDES.length)
  }, [])

  useEffect(() => {
    if (paused) return
    timerRef.current = setInterval(() => {
      setIndex(i => (i + 1) % SLIDES.length)
    }, AUTO_ADVANCE_MS)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [paused])

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="region"
      aria-label="Inside the Learning Studio"
    >
      {/* Viewport */}
      <div className="overflow-hidden rounded-3xl">
        <div
          className="flex"
          style={{ transform: `translateX(-${index * 100}%)`, transition: `transform 700ms ${EASE}` }}
        >
          {SLIDES.map(slide => {
            const Mock = slide.Mock
            return (
              <div key={slide.key} className={`w-full flex-shrink-0 ${slide.panel} rounded-3xl`}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center px-8 py-10 sm:px-12 sm:py-12 lg:px-14 min-h-[380px]">
                  <div>
                    <div className={`kicker !tracking-[0.14em] mb-3 ${slide.dark ? '' : ''}`}>
                      {slide.kicker}
                    </div>
                    <h3
                      className={`text-[clamp(24px,2.6vw,34px)] font-bold tracking-[-0.02em] leading-[1.15] ${
                        slide.dark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {slide.title}
                    </h3>
                    <p className={`text-[15px] leading-[1.55] mt-3 ${slide.dark ? 'text-[#a1a1a6]' : 'text-[#6e6e73]'}`}>
                      {slide.body}
                    </p>
                    <ul className="mt-4 space-y-1.5">
                      {slide.points.map(p => (
                        <li key={p} className={`text-[13.5px] flex gap-2 ${slide.dark ? 'text-[#f5f5f7]' : 'text-gray-900'}`}>
                          <span className="text-primary-600 font-bold">›</span>
                          {p}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center gap-5 mt-6 flex-wrap">
                      <Link href={slide.cta.href} className="pill-primary-sm">
                        {slide.cta.label}
                      </Link>
                      {slide.secondary && (
                        <Link
                          href={slide.secondary.href}
                          className={`text-[14px] font-medium ${
                            slide.dark ? 'text-[#2997ff] hover:text-[#52a8ff]' : 'text-primary-600 hover:text-[#0077ed]'
                          }`}
                        >
                          {slide.secondary.label}
                        </Link>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Mock />
                    <span className={`text-[10px] ${slide.dark ? 'text-white/40' : 'text-[#86868b]'}`}>
                      Product preview
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 mt-5">
        <button
          onClick={() => go(index - 1)}
          className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-[#f5f5f7] transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex gap-1.5">
          {SLIDES.map((s, i) => (
            <button
              key={s.key}
              onClick={() => go(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? 'w-5 bg-gray-900' : 'w-1.5 bg-[#d2d2d7] hover:bg-[#a1a1a6]'
              }`}
              aria-label={`Go to slide ${i + 1}: ${s.kicker}`}
              aria-current={i === index}
            />
          ))}
        </div>
        <button
          onClick={() => go(index + 1)}
          className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-[#f5f5f7] transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
