'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface HeroSlide {
  id: string
  title: string
  caption: string
  href: string
  src: string
  poster?: string
}

const SLIDE_MS = 8000
const IDLE_MS = 6000

/**
 * Home page card carousel. The visible card plays silently and the carousel moves on by itself;
 * arrows, dots and swipe let a visitor take over, and it stays put while they hover, focus or
 * have just used a control. Visitors who prefer reduced motion see still cards.
 */
export default function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [i, setI] = useState(0)
  const [hold, setHold] = useState(false)
  const [still, setStill] = useState(false)
  const idle = useRef<ReturnType<typeof setTimeout> | null>(null)
  const touchX = useRef<number | null>(null)
  const videos = useRef<(HTMLVideoElement | null)[]>([])
  const n = slides.length

  useEffect(() => {
    const q = window.matchMedia('(prefers-reduced-motion: reduce)')
    setStill(q.matches)
    const on = () => setStill(q.matches)
    q.addEventListener('change', on)
    return () => q.removeEventListener('change', on)
  }, [])

  // Only the visible card plays
  useEffect(() => {
    videos.current.forEach((v, k) => {
      if (!v) return
      if (k === i && !still) { v.muted = true; void v.play().catch(() => {}) } else v.pause()
    })
  }, [i, still])

  useEffect(() => {
    if (hold || still || n < 2) return
    const t = setTimeout(() => setI(x => (x + 1) % n), SLIDE_MS)
    return () => clearTimeout(t)
  }, [i, hold, still, n])

  const touched = useCallback(() => {
    setHold(true)
    if (idle.current) clearTimeout(idle.current)
    idle.current = setTimeout(() => setHold(false), IDLE_MS)
  }, [])
  useEffect(() => () => { if (idle.current) clearTimeout(idle.current) }, [])

  const go = (to: number) => { touched(); setI(((to % n) + n) % n) }

  if (n === 0) return null
  return (
    <div
      className="relative w-full max-w-[560px] mx-auto"
      role="region"
      aria-roledescription="carousel"
      aria-label="Learning Studio previews"
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={() => setHold(false)}
      onTouchStart={e => { touchX.current = e.touches[0].clientX }}
      onTouchEnd={e => {
        const x0 = touchX.current
        touchX.current = null
        if (x0 == null) return
        const dx = e.changedTouches[0].clientX - x0
        if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1))
      }}
      onKeyDown={e => {
        if (e.key === 'ArrowRight') go(i + 1)
        if (e.key === 'ArrowLeft') go(i - 1)
      }}
    >
      <div className="relative overflow-hidden rounded-[22px] bg-white border border-[#e8e8ed] shadow-[0_18px_50px_-18px_rgba(11,18,32,0.18)]">
        <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${i * 100}%)` }}>
          {slides.map((s, k) => (
            <div key={s.id} className="w-full shrink-0" aria-hidden={k !== i} role="group" aria-roledescription="slide" aria-label={`${k + 1} of ${n}: ${s.title}`}>
              <Link href={s.href} tabIndex={k === i ? 0 : -1} className="block">
                <div className="relative aspect-video bg-[#0b1220]">
                  <video
                    ref={el => { videos.current[k] = el }}
                    src={s.src}
                    poster={s.poster}
                    muted
                    loop
                    playsInline
                    preload={k === 0 ? 'auto' : 'metadata'}
                    className="absolute inset-0 w-full h-full object-cover"
                    aria-hidden
                  />
                </div>
                <div className="px-5 py-4">
                  <h3 className="font-heading text-[16px] font-bold text-gray-900 leading-snug">{s.title}</h3>
                  <p className="text-[13.5px] text-[#6e6e73] mt-1">{s.caption}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {n > 1 && (
        <>
          <button type="button" onClick={() => go(i - 1)} aria-label="Previous card"
            className="absolute left-2 top-[calc(28%)] -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-gray-800 shadow-md flex items-center justify-center hover:bg-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button type="button" onClick={() => go(i + 1)} aria-label="Next card"
            className="absolute right-2 top-[calc(28%)] -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-gray-800 shadow-md flex items-center justify-center hover:bg-white transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="flex justify-center gap-2 mt-4">
            {slides.map((s, k) => (
              <button key={s.id} type="button" onClick={() => go(k)} aria-label={`Show card ${k + 1}`} aria-current={k === i}
                className={`h-2 rounded-full transition-all ${k === i ? 'w-6 bg-[#0071e3]' : 'w-2 bg-[#d2d2d7] hover:bg-[#b5b5bb]'}`} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
