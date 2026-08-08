import Link from 'next/link'
import { MonitorPlay, ClipboardCheck, BadgeCheck, Rocket } from 'lucide-react'
import { courses } from '@/data/academy/courses'
import { tracks } from '@/data/academy/taxonomy'
import { courses as interactiveCourses } from '@/config/courses'

/**
 * "The Academy at a glance" — a dark campus-style overview band for the
 * Academy landing page: the whole academy in one view. Numbers are live
 * from the catalog data; the journey strip explains how learning works;
 * the track directory maps the six paths.
 */

const JOURNEY = [
  {
    icon: MonitorPlay,
    title: 'Learn',
    body: 'Voice-guided chapters that play like a video — pause, scrub, and pick up where you left off on any device.',
  },
  {
    icon: ClipboardCheck,
    title: 'Practice',
    body: 'Quizzes in every chapter and a capstone you apply to your own organization, not a toy example.',
  },
  {
    icon: BadgeCheck,
    title: 'Certify',
    body: 'Pass the mock exam and earn a certificate with a public verification link — ready for LinkedIn.',
  },
  {
    icon: Rocket,
    title: 'Apply',
    body: 'Pair any course with an optional 4-week pilot: same content, deployed on your data with senior delivery.',
  },
]

export default function AcademyOverview() {
  const stats = [
    { value: String(courses.length), label: 'courses in catalog' },
    { value: String(tracks.length), label: 'learning tracks' },
    { value: String(interactiveCourses.length), label: 'fully interactive' },
    { value: '100%', label: 'free to learn' },
  ]

  return (
    <section className="bg-[#1d1d1f] px-8 py-20 lg:py-[100px]">
      <div className="max-w-[1080px] mx-auto">
        {/* Heading */}
        <div className="text-center mb-14">
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#86868b] mb-4">
            The Academy at a glance
          </p>
          <h2 className="text-[clamp(30px,3.6vw,44px)] leading-[1.1] tracking-[-0.025em] font-bold text-white max-w-[760px] mx-auto">
            One academy. A complete path from first concept to shipped system.
          </h2>
          <p className="text-[17px] leading-[1.5] text-[#a1a1a6] max-w-[620px] mx-auto mt-5">
            Everything below is live — real courses, real chapters, real
            certificates. Start anywhere; your dashboard keeps the whole
            journey in one place.
          </p>
        </div>

        {/* Live numbers */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10 rounded-[18px] overflow-hidden mb-14">
          {stats.map(s => (
            <div key={s.label} className="bg-[#1d1d1f] px-6 py-7 text-center">
              <p className="text-[34px] font-bold tracking-[-0.02em] text-white leading-none">{s.value}</p>
              <p className="text-[12.5px] text-[#86868b] mt-2">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Journey */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {JOURNEY.map((step, i) => (
            <div key={step.title} className="rounded-[18px] border border-white/10 bg-white/[0.04] px-6 py-7">
              <div className="flex items-center justify-between mb-4">
                <span className="w-10 h-10 rounded-full bg-[#2997ff]/15 inline-flex items-center justify-center">
                  <step.icon className="w-5 h-5 text-[#2997ff]" />
                </span>
                <span className="text-[12px] font-bold tracking-[0.08em] text-[#48484a]">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className="text-[17px] font-bold text-white mb-1.5">{step.title}</h3>
              <p className="text-[13.5px] leading-[1.55] text-[#a1a1a6]">{step.body}</p>
            </div>
          ))}
        </div>

        {/* Track directory */}
        <div className="rounded-[18px] border border-white/10 overflow-hidden mb-12">
          <div className="px-7 py-5 border-b border-white/10 flex items-baseline justify-between gap-4 flex-wrap">
            <h3 className="text-[17px] font-bold text-white">The six tracks</h3>
            <Link href="#catalog" className="text-[13.5px] font-medium text-[#2997ff] hover:text-[#52a8ff]">
              Filter the catalog by track ›
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10">
            {tracks.map(track => {
              const count = courses.filter(c => c.track === track.id).length
              return (
                <Link
                  key={track.id}
                  href="#catalog"
                  className="group bg-[#1d1d1f] hover:bg-white/[0.04] px-7 py-6 transition-colors"
                >
                  <div className="flex items-baseline justify-between mb-1.5">
                    <span className="text-[15px] font-bold text-white group-hover:text-[#2997ff] transition-colors">
                      {track.label}
                    </span>
                    <span className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#86868b]">
                      {count} courses
                    </span>
                  </div>
                  <p className="text-[12.5px] leading-[1.5] text-[#86868b]">{track.tagline}</p>
                </Link>
              )
            })}
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-5 sm:gap-[22px] justify-center items-center">
          <Link
            href="#catalog"
            className="inline-flex items-center justify-center bg-white text-gray-900 text-[15px] font-medium px-6 py-3 rounded-full hover:bg-[#f5f5f7] transition-colors"
          >
            Browse the full catalog
          </Link>
          <Link href="/academy/dashboard" className="text-[15px] font-medium text-[#2997ff] hover:text-[#52a8ff]">
            Open your learner dashboard ›
          </Link>
        </div>
      </div>
    </section>
  )
}
