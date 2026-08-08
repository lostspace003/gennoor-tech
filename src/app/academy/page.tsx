import type { Metadata } from 'next'
import Link from 'next/link'
import { BreadcrumbJsonLd } from '@/components/JsonLd'
import AcademyCatalog from '@/components/academy/AcademyCatalog'
import { courses } from '@/data/academy/courses'
import { tracks } from '@/data/academy/taxonomy'
import { courses as interactiveCourses } from '@/config/courses'

export const metadata: Metadata = {
  title: 'Gennoor Academy — Courses That End in a Shipped System',
  description:
    'Free, masterclass-grade courses for businesses across 6 tracks — Foundations, Function, Leadership, Industry, Builder, Applied. Each course pairs with an optional 4-week pilot to deploy what you learn inside your environment.',
  keywords: [
    'AI courses for business',
    'AI training company',
    'AI for HR',
    'AI for Finance',
    'AI strategy course',
    'AI in BFSI',
    'enterprise AI academy',
    'Gennoor Academy',
  ],
  alternates: { canonical: 'https://gennoor.com/academy' },
  openGraph: {
    title: 'Gennoor Academy — Courses That End in a Shipped System',
    description:
      'Free, masterclass-grade B2B courses across 6 tracks. Each course pairs with an optional 4-week pilot.',
    url: 'https://gennoor.com/academy',
  },
}

/**
 * Academy landing in the Apple idiom, per the redesign handoff: display
 * hero with dashboard CTA, six track cards on the grey band, the live
 * filterable catalog, hairline how-it-works grid, custom-courses card,
 * and the dark team CTA. All data stays live from src/data.
 */

export default function AcademyPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://gennoor.com' },
          { name: 'Academy', url: 'https://gennoor.com/academy' },
        ]}
      />

      <main className="min-h-screen bg-white">
        {/* ===== Hero ===== */}
        <section className="px-8 pt-20 lg:pt-[110px] pb-[72px] text-center">
          <div className="kicker mb-5">Gennoor Academy · Free</div>
          <h1 className="text-[clamp(40px,4.8vw,64px)] leading-[1.06] tracking-[-0.03em] font-bold text-gray-900 max-w-[820px] mx-auto">
            Courses that end in a shipped system, not a certificate.
          </h1>
          <p className="text-[clamp(18px,1.8vw,22px)] leading-[1.45] text-[#6e6e73] max-w-[640px] mx-auto mt-[22px]">
            {courses.length} masterclass-grade courses across six tracks. Free, no
            account needed. Every course pairs with an optional 4-week pilot in
            your environment.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 sm:gap-[22px] justify-center items-center mt-8">
            <Link href="/academy/dashboard" className="pill-primary-sm">
              Open the learner dashboard
            </Link>
            <Link href="/contact" className="text-[15px] font-medium text-primary-600 hover:text-[#0077ed]">
              Run this for your team ›
            </Link>
          </div>
          <p className="text-[13px] text-[#86868b] mt-9">
            {courses.length} courses in catalog &nbsp;·&nbsp; {interactiveCourses.length} fully
            interactive &nbsp;·&nbsp; certificate on completion &nbsp;·&nbsp; no credit card
          </p>
        </section>

        {/* ===== Tracks ===== */}
        <section className="bg-[#f5f5f7] px-8 py-20">
          <div className="max-w-[1080px] mx-auto">
            <h2 className="display-card text-center mb-12">Six paths through the catalog.</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tracks.map(track => {
                const trackCourses = courses.filter(c => c.track === track.id)
                return (
                  <div key={track.id} className="bg-white border border-[#e8e8ed] rounded-[18px] px-[26px] py-7">
                    <div className="flex justify-between items-baseline mb-2.5">
                      <h3 className="text-[18px] font-bold text-gray-900">{track.label}</h3>
                      <span className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[#86868b]">
                        {trackCourses.length} live
                      </span>
                    </div>
                    <p className="text-[12.5px] font-semibold text-primary-600 mb-2">{track.tagline}</p>
                    <p className="text-[13.5px] leading-[1.55] text-[#6e6e73]">{track.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ===== Catalog (client filter) ===== */}
        <div id="catalog" className="scroll-mt-16" />
        <AcademyCatalog allCourses={courses} />

        {/* ===== How it works ===== */}
        <section className="px-8 py-16 lg:py-24">
          <div className="max-w-[1080px] mx-auto">
            <h2 className="display-card text-center mb-3">Free to learn. Optional to apply.</h2>
            <p className="text-[18px] text-[#6e6e73] text-center mb-14">
              Most courses run 45–65 minutes across 6–9 chapters.
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-[#e8e8ed] border border-[#e8e8ed] rounded-[18px] overflow-hidden">
              {[
                { step: '01', title: 'Pick a course', body: 'Browse by track, level, function, industry, or stack.' },
                { step: '02', title: 'Work through it', body: 'Chapters, quizzes, and a capstone applied to your own organization.' },
                { step: '03', title: 'Apply it at work', body: 'Run it for your team, scope a pilot on your data, or just talk.' },
              ].map(s => (
                <div key={s.step} className="bg-white px-7 py-8">
                  <div className="text-[13px] font-bold text-[#d2d2d7] tracking-[0.08em] mb-3">{s.step}</div>
                  <h3 className="text-[18px] font-bold text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-sm leading-[1.55] text-[#6e6e73]">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Custom courses ===== */}
        <section className="bg-[#f5f5f7] px-8 py-20">
          <div className="max-w-[920px] mx-auto bg-white rounded-3xl px-8 py-12 lg:px-12 lg:py-[52px] text-center">
            <h2 className="text-[clamp(26px,3vw,36px)] font-bold tracking-[-0.02em] text-gray-900 mb-2.5">
              Don&rsquo;t see your topic?
            </h2>
            <p className="text-[16px] leading-[1.55] text-[#6e6e73] max-w-[560px] mx-auto mb-6">
              We co-author bespoke courses around your data, workflows, and
              industry — typically 4–6 weeks for a function-specific course with
              a team workshop.
            </p>
            <Link href="/contact" className="link-arrow !text-[15px]">
              Talk to us about a custom course ›
            </Link>
          </div>
        </section>

        {/* ===== Team CTA ===== */}
        <section className="bg-[#1d1d1f] px-8 py-[90px] text-center">
          <h2 className="display-card !text-white">Want this for your whole team?</h2>
          <p className="text-[18px] text-[#a1a1a6] mt-3 mb-7 max-w-[560px] mx-auto">
            Every course pairs with an optional 2-day workshop (up to 25 people)
            and a 4-week pilot. Same content, applied to your data, with senior
            delivery.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 sm:gap-[22px] justify-center items-center">
            <Link
              href="/solutions/for-smb"
              className="inline-flex items-center justify-center bg-white text-gray-900 text-[15px] font-medium px-6 py-3 rounded-full hover:bg-[#f5f5f7] transition-colors"
            >
              SMB packages from $5k
            </Link>
            <Link
              href="/solutions/for-enterprise"
              className="text-[15px] font-medium text-[#2997ff] hover:text-[#52a8ff]"
            >
              Enterprise programs ›
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}
