'use client'

import Link from 'next/link'
import AcademyShowcase from '@/components/academy/AcademyShowcase'
import { courses as catalogCourses } from '@/data/academy/courses'
import { tracks } from '@/data/academy/taxonomy'

/**
 * The Home page's Academy section — the "grand" product-preview carousel
 * that advertises the learning experience and funnels visitors into the
 * Academy. The previous static panel's messaging and links live on in the
 * header and footer lines.
 */

export default function AcademyCTA() {
  return (
    <section className="bg-white py-16 lg:py-24 px-8">
      <div className="max-w-[1080px] mx-auto">
        <div className="text-center mb-10">
          <div className="kicker !tracking-[0.14em]">Gennoor Academy</div>
          <h2 className="display-card mt-3.5 mb-2.5">
            {catalogCourses.length} courses. {tracks.length} tracks. Free.
          </h2>
          <p className="text-[17px] text-[#6e6e73] max-w-[520px] mx-auto">
            Self-paced AI learning for executives, functions, and engineers —
            including the interactive AB-100 certification course.
          </p>
        </div>

        <AcademyShowcase />

        <p className="text-center mt-6 text-xs text-[#86868b]">
          No credit card required · No login needed to start · Progress saved automatically ·{' '}
          <Link href="/ai-academy/ab-100" className="text-primary-600 font-medium hover:text-[#0077ed]">
            View the AB-100 course ›
          </Link>
        </p>
      </div>
    </section>
  )
}
