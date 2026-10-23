'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { LmsCourseCard } from '@/lib/lms'

/** "Go deeper" strip shown on the Express pages: real Labs courses with their images. */
export default function LabsSpotlight({ className = '' }: { className?: string }) {
  const [courses, setCourses] = useState<LmsCourseCard[] | null>(null)

  useEffect(() => {
    fetch('/api/lms/catalog')
      .then(r => (r.ok ? r.json() : null))
      .then(d => setCourses(d?.courses ?? []))
      .catch(() => setCourses([]))
  }, [])

  if (courses && courses.length === 0) return null

  return (
    <section className={`bg-[#0f1824] ${className}`}>
      <div className="max-w-6xl mx-auto px-6 py-14 lg:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="font-heading text-[28px] lg:text-[34px] font-bold tracking-[-0.02em] !text-white">Want to go deeper? Try certifications and projects.</h2>
            <p className="text-[16px] text-[#aab6c8] mt-2 max-w-xl">Full video courses with labs and projects, taught step by step. Your progress follows you to any device.</p>
          </div>
          <Link href="/studio" className="px-6 py-2.5 rounded-full bg-white text-gray-900 text-[15px] font-semibold hover:bg-[#e8eefc] transition-colors">See all certifications and projects</Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {(courses ?? [null, null, null]).slice(0, 3).map((c, i) =>
            c ? (
              <Link key={c.slug} href={`/studio/${c.slug}`} className="group rounded-2xl overflow-hidden bg-white/[0.06] hover:bg-white/[0.1] transition-colors duration-200">
                <div className="aspect-video bg-black/30 overflow-hidden">
                  {c.thumbnailUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.thumbnailUrl} alt="" loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                  )}
                </div>
                <div className="p-5">
                  <p className="text-[13px] text-[#8d9bb0]">{c.vendor}, {c.kind}</p>
                  <h3 className="text-[16.5px] font-semibold leading-snug text-white mt-1.5">{c.title}</h3>
                  <p className="text-[13px] text-[#8d9bb0] mt-3 tabular-nums">{c.lectures} lessons{c.hours ? `, ${c.hours} hours` : ''}</p>
                </div>
              </Link>
            ) : (
              <div key={i} className="rounded-2xl bg-white/[0.06] aspect-[4/3] animate-pulse" />
            ),
          )}
        </div>
      </div>
    </section>
  )
}
