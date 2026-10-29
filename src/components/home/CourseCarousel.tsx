'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, X, ArrowUpRight } from 'lucide-react'
import PromoPlayer from '@/components/academy/PromoPlayer'
import type { CatalogueCard } from '@/lib/catalogue'

/** The popup that opens when a course card is clicked: its promo plays at once, with a blinking button to the course page. */
function VideoPopup({ card, onClose }: { card: CatalogueCard; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [onClose])
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={card.title}>
      <div className="fixed inset-0 bg-black/70" onClick={onClose} />
      <div className="relative z-10 w-full max-w-4xl">
        <div className="flex items-center justify-between gap-3 mb-3">
          <p className="text-white font-semibold text-[15px] truncate">{card.title}</p>
          <div className="flex items-center gap-2 shrink-0">
            <Link href={card.href} className="inline-flex items-center gap-1.5 rounded-full bg-primary-600 px-4 py-2 text-[13.5px] font-semibold text-white animate-pulse hover:animate-none hover:bg-primary-700">
              Go to course page <ArrowUpRight className="w-4 h-4" />
            </Link>
            <button type="button" onClick={onClose} aria-label="Close video" className="p-2 rounded-full bg-white/15 hover:bg-white/25 text-white"><X className="w-5 h-5" /></button>
          </div>
        </div>
        <PromoPlayer src={card.video as string} poster={card.image} autoPlay startMuted={false} resumeKey={card.id} />
      </div>
    </div>
  )
}

/** A row of course cards that scrolls sideways (swipe on a phone, arrows on a desktop). A card with a promo plays it in a popup; every card links to its course page. */
export default function CourseCarousel({ cards, label }: { cards: CatalogueCard[]; label: string }) {
  const row = useRef<HTMLUListElement>(null)
  const [open, setOpen] = useState<CatalogueCard | null>(null)
  if (!cards.length) return null
  const go = (dir: 1 | -1) => row.current?.scrollBy({ left: dir * Math.max(280, row.current.clientWidth * 0.8), behavior: 'smooth' })

  return (
    <div className="relative" role="region" aria-roledescription="carousel" aria-label={label}>
      <ul ref={row} className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-3 -mx-1 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {cards.map(c => (
          <li key={c.id} className="snap-start shrink-0 w-[78%] sm:w-[44%] lg:w-[31.5%]">
            <Link
              href={c.href}
              onClick={e => { if (c.video && !(e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1)) { e.preventDefault(); setOpen(c) } }}
              className="group block h-full rounded-[18px] border border-[#e8e8ed] bg-white p-4 hover:border-primary-600 transition-colors"
            >
              {c.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.image} alt={`${c.title} thumbnail`} width={1280} height={720} loading="lazy" decoding="async" className="w-full aspect-video object-cover rounded-xl border border-[#e8e8ed]" />
              ) : (
                <div className="w-full aspect-video rounded-xl bg-[#0f1824]" aria-hidden />
              )}
              <h3 className="font-heading text-[16.5px] font-bold text-gray-900 leading-snug mt-4 group-hover:text-primary-600 transition-colors">{c.title}</h3>
              <p className="text-[13.5px] text-[#86868b] mt-1.5 tabular-nums">{c.meta}</p>
            </Link>
          </li>
        ))}
      </ul>
      <button type="button" onClick={() => go(-1)} aria-label="Previous courses" className="hidden md:flex absolute -left-4 top-[34%] w-10 h-10 items-center justify-center rounded-full bg-white border border-[#e2e5ec] shadow-sm hover:border-primary-600"><ChevronLeft className="w-5 h-5" /></button>
      <button type="button" onClick={() => go(1)} aria-label="Next courses" className="hidden md:flex absolute -right-4 top-[34%] w-10 h-10 items-center justify-center rounded-full bg-white border border-[#e2e5ec] shadow-sm hover:border-primary-600"><ChevronRight className="w-5 h-5" /></button>
      {open && open.video && <VideoPopup card={open} onClose={() => setOpen(null)} />}
    </div>
  )
}
