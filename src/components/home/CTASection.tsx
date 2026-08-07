'use client'

import Link from 'next/link'

/**
 * Final CTA — "Start with the diagnostic.", per the Home prototype.
 */

export default function CTASection() {
  return (
    <section className="bg-[#f5f5f7] py-20 lg:py-[100px] px-8 text-center">
      <h2 className="display-section">Start with the diagnostic.</h2>
      <p className="lede mt-3.5 mb-8 max-w-[520px] mx-auto">
        Fifteen minutes. A readiness score, a use-case backlog, and a 12-month
        roadmap.
      </p>
      <div className="flex flex-col sm:flex-row gap-5 sm:gap-[22px] justify-center items-center">
        <Link href="/ai-readiness" className="pill-primary">
          Run the diagnostic
        </Link>
        <Link href="/resources/calendar" className="link-arrow">
          Book a call ›
        </Link>
      </div>
    </section>
  )
}
