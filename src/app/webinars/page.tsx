'use client'

import { useState } from 'react'
import Link from 'next/link'
import { getPublicWebinars, pastWebinars, type UpcomingWebinar } from '@/data/webinars'
import WebinarRegisterModal from '@/components/webinars/WebinarRegisterModal'

/**
 * Webinars in the Apple idiom, per the redesign handoff's "Learn live."
 * page. Fully data-driven from src/data/webinars.ts:
 *  - upcoming sessions render the prototype rows with a working
 *    "Register free" flow (POST /api/webinar-register → confirmation
 *    email + admin notification)
 *  - past sessions render with "Watch recording ›" links
 *  - with no events published, the schedule area states that honestly.
 */

export default function WebinarsPage() {
  const [registering, setRegistering] = useState<UpcomingWebinar | null>(null)
  // Academy-only sessions are surfaced on the Academy dashboard, not here.
  const upcomingWebinars = getPublicWebinars()

  return (
    <main className="min-h-screen bg-white">
      {/* ===== Hero ===== */}
      <section className="px-8 pt-20 lg:pt-[100px] pb-12 text-center">
        <div className="kicker mb-5">Resources · Webinars &amp; Workshops</div>
        <h1 className="text-[clamp(40px,4.8vw,64px)] leading-[1.06] tracking-[-0.03em] font-bold text-gray-900">
          Learn live.
        </h1>
        <p className="text-[clamp(18px,1.8vw,22px)] leading-[1.45] text-[#6e6e73] max-w-[560px] mx-auto mt-5">
          Free monthly webinars and hands-on workshops. Bring your questions —
          recordings if you can&rsquo;t make it.
        </p>
      </section>

      {/* ===== Schedule ===== */}
      <section className="bg-[#f5f5f7] px-8 py-16 pb-24">
        <div className="max-w-[920px] mx-auto">
          <h2 className="text-[22px] font-bold tracking-[-0.01em] text-gray-900 mb-5">Upcoming</h2>

          {upcomingWebinars.length > 0 ? (
            <div className="flex flex-col gap-3">
              {upcomingWebinars.map(s => (
                <div
                  key={s.id}
                  className="bg-white border border-[#e8e8ed] rounded-2xl px-6 py-[22px] grid grid-cols-[70px_1fr] sm:grid-cols-[90px_1fr_auto] gap-4 sm:gap-6 items-center"
                >
                  <div className="text-center bg-[#f5f5f7] rounded-xl py-2.5">
                    <div className="text-[11px] font-semibold uppercase text-[#86868b]">{s.month}</div>
                    <div className="text-[22px] font-bold tracking-[-0.02em] text-gray-900">{s.day}</div>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-[15.5px] font-bold text-gray-900">{s.title}</span>
                      <span
                        className={`text-[10.5px] font-semibold tracking-[0.08em] uppercase ${
                          s.type === 'Workshop' ? 'text-[#1d8348]' : 'text-primary-600'
                        }`}
                      >
                        {s.type}
                      </span>
                    </div>
                    <div className="text-[12.5px] text-[#86868b] mt-0.5">{s.meta}</div>
                  </div>
                  <button
                    onClick={() => setRegistering(s)}
                    className="justify-self-start sm:justify-self-auto col-span-2 sm:col-span-1 text-[12.5px] font-semibold bg-primary-600 hover:bg-[#0077ed] text-white px-5 py-[9px] rounded-full transition-colors"
                  >
                    Register free
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-[#e8e8ed] rounded-2xl px-8 py-12 text-center">
              <p className="text-[15.5px] font-bold text-gray-900 mb-1.5">
                First public dates announcing soon.
              </p>
              <p className="text-[13.5px] text-[#6e6e73] max-w-[440px] mx-auto mb-6">
                Live webinars on AI strategy, hands-on workshops, and expert
                panels are in the works. Sessions will also stream on our YouTube
                channel.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-[22px] justify-center items-center">
                <a
                  href="https://www.youtube.com/@GennoorTech?sub_confirmation=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pill-primary-sm"
                >
                  Subscribe on YouTube
                </a>
                <Link href="/contact" className="text-[15px] font-medium text-primary-600 hover:text-[#0077ed]">
                  Get notified ›
                </Link>
              </div>
            </div>
          )}

          {/* Past sessions — appears once recordings are published */}
          {pastWebinars.length > 0 && (
            <>
              <h2 className="text-[22px] font-bold tracking-[-0.01em] text-gray-900 mt-14 mb-5">
                Past sessions
              </h2>
              <div className="bg-white border border-[#e8e8ed] rounded-2xl overflow-hidden">
                {pastWebinars.map((p, i) => (
                  <div
                    key={`${p.title}-${p.date}`}
                    className={`grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-2 sm:gap-5 px-6 py-[15px] items-baseline ${
                      i < pastWebinars.length - 1 ? 'border-b border-[#f5f5f7]' : ''
                    }`}
                  >
                    <span className="text-sm font-semibold text-gray-900">{p.title}</span>
                    <span className="text-xs text-[#86868b]">{p.date}</span>
                    {p.recordingUrl ? (
                      <a
                        href={p.recordingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[12.5px] font-semibold text-primary-600 hover:text-[#0077ed]"
                      >
                        Watch recording ›
                      </a>
                    ) : (
                      <span className="text-[12.5px] text-[#86868b]">Recording soon</span>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          <h2 className="text-[22px] font-bold tracking-[-0.01em] text-gray-900 mt-14 mb-5">
            In the meantime
          </h2>
          <div className="bg-white border border-[#e8e8ed] rounded-2xl overflow-hidden">
            {[
              { title: 'Free hands-on workshops', detail: 'Claude Cowork and more — run regularly across GCC, India, and East Africa.', href: '/workshops', cta: 'See workshops ›' },
              { title: 'Training excerpts and walkthroughs', detail: 'Full sessions and deep dives on the video library.', href: '/resources/videos', cta: 'Watch videos ›' },
              { title: 'The free Academy', detail: 'Self-paced courses for executives, functions, and engineers.', href: '/academy', cta: 'Browse the Academy ›' },
            ].map((row, i, arr) => (
              <div
                key={row.title}
                className={`grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 sm:gap-5 px-6 py-4 items-baseline ${
                  i < arr.length - 1 ? 'border-b border-[#f5f5f7]' : ''
                }`}
              >
                <div>
                  <span className="text-sm font-semibold text-gray-900">{row.title}</span>
                  <span className="text-xs text-[#86868b]"> — {row.detail}</span>
                </div>
                <Link href={row.href} className="text-[12.5px] font-semibold text-primary-600 hover:text-[#0077ed]">
                  {row.cta}
                </Link>
              </div>
            ))}
          </div>

          <p className="text-[13px] text-[#86868b] mt-5 text-center">
            Want a private session for your team?{' '}
            <Link href="/contact" className="font-medium text-primary-600 hover:text-[#0077ed]">
              Talk to us
            </Link>{' '}
            — we run these in-house with your data.
          </p>
        </div>
      </section>

      {registering && (
        <WebinarRegisterModal webinar={registering} onClose={() => setRegistering(null)} />
      )}
    </main>
  )
}
