import type { Metadata } from 'next'
import Link from 'next/link'
import {
  GraduationCap,
  ArrowRight,
  Sparkles,
  BookOpen,
  Layers,
  Award,
} from 'lucide-react'
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

export default function AcademyPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://gennoor.com' },
          { name: 'Academy', url: 'https://gennoor.com/academy' },
        ]}
      />

      {/* HERO */}
      <section className="relative py-14 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-white" />
        <div className="absolute inset-0" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center rounded-full border border-gray-300 bg-white px-4 py-1.5 mb-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-900">
              <GraduationCap className="w-3 h-3 mr-2" />
              Free AI Academy
            </div>
            <h1 className="font-heading text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mb-8 leading-[1.05]">
              Courses that end in a shipped system,
              not a certificate.
            </h1>
            <p className="text-lg sm:text-xl text-gray-500 mb-10 leading-relaxed max-w-3xl mx-auto">
              Masterclass-grade B2B courses across six tracks — Foundations, Function,
              Leadership, Industry, Builder, Applied. Free. No account needed. Certificate
              on completion. Every course pairs with an optional 4-week pilot that turns
              what you learned into a working system inside your environment.
            </p>

            <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-gray-500 mb-8">
              <span className="inline-flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-primary-500" />
                {courses.length} courses in catalog · {interactiveCourses.length} fully interactive · scaffolds rolling out through 2026
              </span>
              <span className="text-gray-300">·</span>
              <span className="inline-flex items-center gap-1.5">
                <Award className="w-4 h-4 text-primary-500" />
                Free · no credit card
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="#catalog"
                className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-semibold rounded-xl text-white bg-primary-600 transition-all duration-300"
              >
                Browse the catalog
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-semibold rounded-xl text-gray-700 bg-white ring-1 ring-gray-200 hover:ring-primary-300 hover:text-primary-700 transition-all duration-300"
              >
                Run this for your team
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* TRACKS */}
      <section className="py-10 lg:py-16 relative">
        <div className="section-divider absolute top-0 left-[10%] right-[10%]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-xs font-bold tracking-widest text-primary-600 uppercase mb-3">
              Six Tracks
            </p>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Six paths through the catalog.
            </h2>
            <p className="text-base text-gray-500 leading-relaxed">
              Pick a track to focus, or use the filters below to combine tracks with
              function, industry, audience, level, and stack.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {tracks.map((track) => {
              const trackCourses = courses.filter((c) => c.track === track.id)
              return (
                <div
                  key={track.id}
                  className="rounded-2xl p-6 bg-white border border-gray-200/70 shadow-sm transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/15">
                      <Layers className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-bold tracking-widest text-gray-400">
                      {trackCourses.length} live
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-1">{track.label}</h3>
                  <p className="text-xs font-semibold text-primary-600 mb-2">
                    {track.tagline}
                  </p>
                  <p className="text-sm text-gray-500 leading-relaxed">{track.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CATALOG (client filter) */}
      <div id="catalog" className="scroll-mt-24" />
      <AcademyCatalog allCourses={courses} />

      {/* CUSTOM CONTENT CTA */}
      <section className="section-padding relative">
        <div className="section-divider absolute top-0 left-[10%] right-[10%]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-3xl p-7 lg:p-10 bg-white border border-gray-200/70 shadow-sm hover:shadow-md hover:border-primary-200/70">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/15">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="flex-grow">
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 leading-tight">
                    Don&apos;t see your topic?
                    <br />
                    We build custom courses for client engagements.
                  </h2>
                  <p className="text-base text-gray-600 leading-relaxed mb-5">
                    The published catalog covers our most-requested topics. For client
                    engagements, we co-author bespoke courses built around your data, your
                    workflows, and your industry context — typically 4–6 weeks for a
                    function-specific custom course with team workshop.
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
                  >
                    Talk to us about a custom course
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section-padding relative">
        <div className="section-divider absolute top-0 left-[10%] right-[10%]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-xs font-bold tracking-widest text-primary-600 uppercase mb-3">
              How the Academy works
            </p>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Free to learn. Optional to apply.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {[
              {
                step: '01',
                title: 'Pick a course',
                body:
                  'Browse the catalog by track, level, function, industry, audience, or stack. Most courses are 45–65 minutes, broken into 6–9 chapters.',
              },
              {
                step: '02',
                title: 'Work through it',
                body:
                  'Read or watch, complete the exercises, take the chapter quizzes, and ship the capstone — applied to your own organization.',
              },
              {
                step: '03',
                title: 'Apply it where you work',
                body:
                  'At the end of every course, you get three concrete options to apply it: run it for your team, scope a pilot built on your data, or just talk.',
              },
            ].map((s) => (
              <div key={s.step} className="rounded-2xl p-6 bg-white border border-gray-200/70 shadow-sm hover:shadow-md hover:border-primary-200/70 relative">
                <span className="absolute top-4 right-5 text-2xl font-extrabold text-gray-100">
                  {s.step}
                </span>
                <h3 className="text-base font-bold text-gray-900 mb-2 pr-10">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gray-900" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Want this for your whole team?
          </h2>
          <p className="text-lg text-primary-200/60 mb-8 max-w-2xl mx-auto">
            Every course pairs with an optional 2-day workshop (up to 25 people) and a
            4-week pilot. Same content, applied to your data, with senior delivery.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/solutions/for-smb"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary-700 px-7 py-3.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all duration-300"
            >
              SMB packages from $5k
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/solutions/for-enterprise"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold text-white border border-white/20 hover:bg-white/5 transition-all duration-300"
            >
              Enterprise programs
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
