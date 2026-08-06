'use client'

import Link from 'next/link'
import { BookOpen, Trophy, ArrowRight, GraduationCap, BarChart3, Layers, Sparkles } from 'lucide-react'
import InteractiveCoursesCatalog, { type EnrichedCourse } from '@/components/academy/InteractiveCoursesCatalog'
import { courses as configCourses } from '@/config/courses'
import { courses as academyCourses } from '@/data/academy/courses'

// Join config courses (with theme + chapters) to academy metadata (with track/level/audience/industry) by id == slug
const enriched: EnrichedCourse[] = configCourses.map(cfg => ({
  config: cfg,
  meta: academyCourses.find(a => a.slug === cfg.id),
}))

const totalCourses = enriched.length
const totalAcademyCatalog = academyCourses.length

export default function AcademyPage() {
  return (
    <main className="min-h-screen">
      {/* Banner — part of the broader Gennoor Academy */}
      <section className="relative">
        <div className="bg-primary-50 border-b border-primary-100/60">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center">
              <div className="inline-flex items-center gap-1.5 text-xs text-gray-600">
                <Layers className="w-3.5 h-3.5 text-primary-500" />
                <span>
                  <strong className="text-gray-900">Interactive Courses</strong> · part of{' '}
                  <strong className="text-gray-900">Gennoor Academy</strong>
                </span>
              </div>
              <Link
                href="/academy"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors"
              >
                Browse all {totalAcademyCatalog} courses across 6 tracks
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Hero */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-white" />
        <div className="absolute inset-0" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center rounded-full border border-gray-300 bg-white px-4 py-1.5 mb-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-900">
              <Sparkles className="w-3 h-3 mr-2" />
              Free AI Academy · {totalCourses} interactive courses
            </div>
            <h1 className="font-heading text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.05] mb-6">
              Interactive Courses
            </h1>
            <p className="text-base sm:text-lg text-gray-500 leading-relaxed mb-10 max-w-2xl mx-auto">
              {totalCourses} fully interactive courses — slides, narrated audio, quizzes, progress
              tracked as you go. From AI foundations to building agents with Copilot Studio.
              Free. No account needed. Certificate on completion.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="#courses"
                className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-primary-600 text-white text-sm font-semibold rounded-xl transition-all duration-300"
              >
                Browse the {totalCourses} courses
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                href="/academy"
                className="inline-flex items-center justify-center gap-2 px-7 py-3 text-sm font-semibold rounded-xl text-gray-700 bg-white ring-1 ring-gray-200 hover:ring-primary-300 hover:text-primary-700 transition-all duration-300"
              >
                Or browse the full Academy catalog
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Course Catalog (grouped + filterable) */}
      <InteractiveCoursesCatalog courses={enriched} />

      {/* Cross-link to /academy */}
      <section className="py-12 lg:py-16 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <Link
              href="/academy"
              className="group block rounded-2xl p-8 text-center bg-white border border-gray-200/70 shadow-sm hover:shadow-md hover:border-primary-200/70 transition-all duration-500"
            >
              <div className="w-14 h-14 rounded-full bg-primary-50/80 flex items-center justify-center mb-4 mx-auto">
                <GraduationCap className="w-7 h-7 text-primary-500" />
              </div>
              <h3 className="font-heading font-semibold text-gray-900 mb-2">
                Looking for the broader catalog?
              </h3>
              <p className="text-sm text-gray-500 mb-4 leading-relaxed max-w-xl mx-auto">
                The full Gennoor Academy lists {totalAcademyCatalog} courses across Foundations,
                Function, Leadership, Industry, Builder, and Applied tracks — including ones
                still in production as scaffolded reading and ones already interactive.
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 group-hover:translate-x-1 transition-transform">
                Browse Academy <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section-padding relative">
        <div className="section-divider absolute top-0 left-[10%] right-[10%]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-3">How It Works</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Three steps from opening the first chapter to applying what you learned.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: '01',
                icon: BookOpen,
                title: 'Start free',
                description: 'Every chapter of every course is open. No account, no email required. Pick a course; open it; learn.',
              },
              {
                step: '02',
                icon: BarChart3,
                title: 'Track progress',
                description: 'Your progress saves automatically in your browser — completed chapters get a tick, and you resume from where you left off.',
              },
              {
                step: '03',
                icon: Trophy,
                title: 'Ship the capstone',
                description: 'Every course ends in a capstone — a one-page roadmap, plan, or production-grade artifact applied to your context.',
              },
            ].map(item => (
              <div key={item.step} className="text-center p-6 rounded-2xl bg-white border border-gray-200/70 shadow-sm">
                <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-100 mb-4">
                  <item.icon className="w-7 h-7 text-primary-600" />
                  <span className="absolute -top-2 -right-2 w-7 h-7 bg-gray-400 text-gray-900 text-xs font-bold rounded-full flex items-center justify-center">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-heading font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
