'use client'

import Link from 'next/link'

/**
 * The Academy panel — a rounded #f5f5f7 card, per the Home prototype.
 * The AB-100 deep link and the "no credit card" reassurance line from the
 * previous section are kept as quiet secondary lines.
 */

export default function AcademyCTA() {
  return (
    <section className="bg-white py-16 lg:py-24 px-8">
      <div className="max-w-[1080px] mx-auto bg-[#f5f5f7] rounded-3xl px-8 py-14 lg:px-12 lg:py-[72px] text-center">
        <div className="kicker !tracking-[0.14em]">Gennoor Academy</div>
        <h2 className="display-card mt-3.5 mb-2.5">42 courses. 6 tracks. Free.</h2>
        <p className="text-[17px] text-[#6e6e73] max-w-[520px] mx-auto mb-7">
          Self-paced AI learning for executives, functions, and engineers —
          including the interactive AB-100 certification course.
        </p>
        <Link href="/academy" className="pill-primary-sm">
          Browse the Academy
        </Link>
        <p className="mt-5 text-[13px]">
          <Link href="/ai-academy/ab-100" className="text-primary-600 font-medium hover:text-[#0077ed]">
            View the AB-100 course ›
          </Link>
        </p>
        <p className="mt-3 text-xs text-[#86868b]">
          No credit card required · No login needed to start · Progress saved automatically
        </p>
      </div>
    </section>
  )
}
