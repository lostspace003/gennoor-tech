'use client'

import { useEffect, useRef, useState } from 'react'
import PromoPlayer from '@/components/academy/PromoPlayer'
import type { LmsCourseCard } from '@/lib/lms'

/** The course previews on the home page. A video only loads and starts once it scrolls into view. */
function LazyPromo({ c }: { c: LmsCourseCard }) {
  const ref = useRef<HTMLDivElement>(null)
  const [armed, setArmed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || armed) return
    const io = new IntersectionObserver(
      entries => {
        if (entries.some(e => e.isIntersecting)) {
          setArmed(true)
          io.disconnect()
        }
      },
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [armed])

  return (
    <div ref={ref}>
      {armed && c.promoUrl ? (
        <PromoPlayer src={c.promoUrl} poster={c.thumbnailUrl} />
      ) : c.thumbnailUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={c.thumbnailUrl} alt="" className="w-full aspect-video object-cover rounded-2xl ring-1 ring-black/5" />
      ) : (
        <div className="w-full aspect-video rounded-2xl bg-[#0f1824]" />
      )}
    </div>
  )
}

export default function HomeCourses({ courses }: { courses: LmsCourseCard[] }) {
  return (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
      {courses.map(c => (
        <div key={c.slug}>
          <LazyPromo c={c} />
          <h3 className="font-heading text-[19px] font-bold tracking-[-0.01em] text-gray-900 mt-5 leading-snug">{c.title}</h3>
          <p className="text-[14px] text-gray-500 mt-1.5 tabular-nums">
            {c.lectures} lessons{c.hours ? `, ${c.hours} hours` : ''}
          </p>
        </div>
      ))}
    </div>
  )
}
