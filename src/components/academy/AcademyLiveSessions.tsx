'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CalendarDays, Radio } from 'lucide-react'
import { getAcademyWebinars, type UpcomingWebinar } from '@/data/webinars'
import WebinarRegisterModal from '@/components/webinars/WebinarRegisterModal'

/**
 * Academy "Live sessions" — closes gap 1.3 in newinclusioncheck/README.md.
 *
 * The dashboard prototype showed a dark "Next live session" card and a live
 * sessions list with registration, but no system backed it. Rather than build
 * a second events system, this reads the same source as /webinars
 * (src/data/webinars.ts) filtered to Academy audiences, and registers through
 * the same POST /api/webinar-register path.
 *
 * With nothing published it renders an honest empty state pointing at the
 * public schedule — never an invented session.
 */

export default function AcademyLiveSessions({
  learnerName = '',
  learnerEmail = '',
}: {
  learnerName?: string
  learnerEmail?: string
}) {
  const [registering, setRegistering] = useState<UpcomingWebinar | null>(null)
  const sessions = getAcademyWebinars()
  const [next, ...rest] = sessions

  return (
    <>
      {next ? (
        <>
          {/* Next live session — the dark card from the prototype */}
          <div className="bg-gray-900 rounded-2xl px-6 py-6 sm:px-8 sm:py-7 flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="text-center bg-white/10 rounded-xl py-2.5 px-4 shrink-0 self-start sm:self-auto">
              <div className="text-[11px] font-semibold uppercase text-white/60">{next.month}</div>
              <div className="text-[26px] font-bold tracking-[-0.02em] text-white leading-none mt-0.5">
                {next.day}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <Radio className="w-3.5 h-3.5 text-[#5ac8fa]" />
                <span className="text-[10.5px] font-semibold tracking-[0.12em] uppercase text-[#5ac8fa]">
                  Next live session
                </span>
              </div>
              <p className="text-[17px] font-bold text-white leading-snug">{next.title}</p>
              <p className="text-[12.5px] text-white/60 mt-1">{next.meta}</p>
            </div>
            <button
              onClick={() => setRegistering(next)}
              className="shrink-0 self-start sm:self-auto text-[13px] font-semibold bg-raised hover:bg-surface/90 text-gray-900 px-5 py-2.5 rounded-full transition-colors"
            >
              Register free
            </button>
          </div>

          {/* Remaining sessions */}
          {rest.length > 0 && (
            <div className="bg-raised border border-gray-200 rounded-2xl overflow-hidden mt-4">
              {rest.map((s, i) => (
                <div
                  key={s.id}
                  className={`grid grid-cols-1 sm:grid-cols-[auto_1fr_auto] gap-2 sm:gap-5 px-6 py-4 items-center ${
                    i < rest.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <span className="text-[12.5px] font-semibold text-gray-400 tabular-nums">
                    {s.month} {s.day}
                  </span>
                  <div className="min-w-0">
                    <span className="text-sm font-semibold text-gray-900">{s.title}</span>
                    <span className="block text-xs text-gray-400 mt-0.5">{s.meta}</span>
                  </div>
                  <button
                    onClick={() => setRegistering(s)}
                    className="justify-self-start sm:justify-self-auto text-[12.5px] font-semibold text-primary-600 hover:text-primary-500"
                  >
                    Register free ›
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="bg-raised border border-gray-200 rounded-2xl px-6 py-8 text-center">
          <div className="w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
            <CalendarDays className="w-[22px] h-[22px] text-gray-400" />
          </div>
          <p className="text-[15px] font-bold text-gray-900 mb-1.5">
            No Academy sessions scheduled yet.
          </p>
          <p className="text-[13px] text-gray-500 max-w-[420px] mx-auto mb-5">
            Live cohort sessions and Q&amp;A clinics will appear here. In the
            meantime, every course below is self-paced and available now.
          </p>
          <Link href="/webinars" className="text-[13px] font-semibold text-primary-600 hover:text-primary-500">
            See the public schedule ›
          </Link>
        </div>
      )}

      {registering && (
        <WebinarRegisterModal
          webinar={registering}
          onClose={() => setRegistering(null)}
          defaultName={learnerName}
          defaultEmail={learnerEmail}
        />
      )}
    </>
  )
}
