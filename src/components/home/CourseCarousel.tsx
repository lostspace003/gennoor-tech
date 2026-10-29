'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { CatalogueCard } from '@/lib/catalogue'

/** A row of course cards that scrolls sideways (swipe on a phone, arrows on a desktop). Each card opens its course page. */
export default function CourseCarousel({ cards, label }: { cards: CatalogueCard[]; label: string }) {
  const row = useRef<HTMLUListElement>(null)
  if (!cards.length) return null
  const go = (dir: 1 | -1) => row.current?.scrollBy({ left: dir * Math.max(280, row.current.clientWidth * 0.8), behavior: 'smooth' })

  return (
    <div className="relative" role="region" aria-roledescription="carousel" aria-label={label}>
      <ul ref={row} className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-3 -mx-1 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {cards.map(c => (
          <li key={c.id} className="snap-start shrink-0 w-[78%] sm:w-[44%] lg:w-[31.5%]">
            <Link href={c.href} className="group block h-full rounded-[18px] border border-[#e8e8ed] bg-white p-4 hover:border-primary-600 transition-colors">
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
    </div>
  )
}
