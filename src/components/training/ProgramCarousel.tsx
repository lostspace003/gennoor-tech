'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface ProgramCard { slug: string; title: string; duration: string; level: string; description: string; category: 'bootcamp' | 'course' }

/** The training programs as a sideways-scrolling row of cards, so they are visible on /training without opening another page. */
export default function ProgramCarousel({ programs }: { programs: ProgramCard[] }) {
  const row = useRef<HTMLUListElement>(null)
  const go = (dir: 1 | -1) => row.current?.scrollBy({ left: dir * Math.max(280, (row.current?.clientWidth || 600) * 0.8), behavior: 'smooth' })
  return (
    <div className="relative" role="region" aria-roledescription="carousel" aria-label="Training programs">
      <ul ref={row} className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-3 -mx-1 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {programs.map(p => (
          <li key={p.slug} className="snap-start shrink-0 w-[82%] sm:w-[46%] lg:w-[32%]">
            <Link href={`/services/training/${p.slug}`} className="group flex h-full flex-col rounded-[18px] border border-[#e8e8ed] bg-white p-6 hover:border-primary-600 transition-colors">
              <span className="self-start rounded-full bg-[#f5f5f7] px-3 py-1 text-[12px] font-semibold text-[#6e6e73]">{p.category === 'bootcamp' ? 'Bootcamp' : 'Course'}</span>
              <h3 className="font-heading text-[18px] font-bold text-gray-900 leading-snug mt-4 group-hover:text-primary-600 transition-colors">{p.title}</h3>
              <p className="text-[14.5px] leading-[1.55] text-[#6e6e73] mt-2 line-clamp-3 flex-1">{p.description}</p>
              <p className="text-[13px] text-[#86868b] mt-4">{p.duration} · {p.level}</p>
            </Link>
          </li>
        ))}
      </ul>
      <button type="button" onClick={() => go(-1)} aria-label="Previous programs" className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full bg-white border border-[#e2e5ec] shadow-sm hover:border-primary-600"><ChevronLeft className="w-5 h-5" /></button>
      <button type="button" onClick={() => go(1)} aria-label="Next programs" className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full bg-white border border-[#e2e5ec] shadow-sm hover:border-primary-600"><ChevronRight className="w-5 h-5" /></button>
    </div>
  )
}
