'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface SessionPhoto { src: string; alt: string; caption: string; pos?: string }

const SLIDE_MS = 5500
const IDLE_MS = 7000

/** Photo carousel for past sessions. Moves on by itself, and arrows, dots and swipe take over. */
export default function SessionCarousel({ photos }: { photos: SessionPhoto[] }) {
  const [i, setI] = useState(0)
  const [hold, setHold] = useState(false)
  const [still, setStill] = useState(false)
  const idle = useRef<ReturnType<typeof setTimeout> | null>(null)
  const touchX = useRef<number | null>(null)
  const n = photos.length

  useEffect(() => {
    const q = window.matchMedia('(prefers-reduced-motion: reduce)')
    setStill(q.matches)
    const on = () => setStill(q.matches)
    q.addEventListener('change', on)
    return () => q.removeEventListener('change', on)
  }, [])

  useEffect(() => {
    if (hold || still || n < 2) return
    const t = setTimeout(() => setI(x => (x + 1) % n), SLIDE_MS)
    return () => clearTimeout(t)
  }, [i, hold, still, n])
  useEffect(() => () => { if (idle.current) clearTimeout(idle.current) }, [])

  const go = (to: number) => {
    setHold(true)
    if (idle.current) clearTimeout(idle.current)
    idle.current = setTimeout(() => setHold(false), IDLE_MS)
    setI(((to % n) + n) % n)
  }

  return (
    <div
      role="region" aria-roledescription="carousel" aria-label="Photos from the session"
      onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)}
      onTouchStart={e => { touchX.current = e.touches[0].clientX }}
      onTouchEnd={e => {
        const x0 = touchX.current; touchX.current = null
        if (x0 == null) return
        const dx = e.changedTouches[0].clientX - x0
        if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1))
      }}
      onKeyDown={e => { if (e.key === 'ArrowRight') go(i + 1); if (e.key === 'ArrowLeft') go(i - 1) }}
      className="relative"
    >
      <div className="overflow-hidden rounded-[22px] bg-[#0b1220] shadow-[0_18px_50px_-18px_rgba(11,18,32,0.25)]">
        <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${i * 100}%)` }}>
          {photos.map((p, k) => (
            <figure key={p.src} className="w-full shrink-0 m-0" aria-hidden={k !== i} role="group" aria-roledescription="slide" aria-label={`${k + 1} of ${n}`}>
              <div className="relative aspect-[4/3] sm:aspect-[16/10]">
                <Image src={p.src} alt={p.alt} fill sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" style={{ objectPosition: p.pos || 'center' }} priority={k === 0} />
              </div>
              <figcaption className="bg-white px-5 py-3.5 text-[14px] text-[#6e6e73]">{p.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>
      {n > 1 && (
        <>
          <button type="button" onClick={() => go(i - 1)} aria-label="Previous photo"
            className="absolute left-3 top-[38%] -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-gray-800 shadow-md flex items-center justify-center hover:bg-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button type="button" onClick={() => go(i + 1)} aria-label="Next photo"
            className="absolute right-3 top-[38%] -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-gray-800 shadow-md flex items-center justify-center hover:bg-white transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="flex justify-center gap-2 mt-4">
            {photos.map((p, k) => (
              <button key={p.src} type="button" onClick={() => go(k)} aria-label={`Show photo ${k + 1}`} aria-current={k === i}
                className={`h-2 rounded-full transition-all ${k === i ? 'w-6 bg-[#0071e3]' : 'w-2 bg-[#d2d2d7] hover:bg-[#b5b5bb]'}`} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
