'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Clock, BarChart3, Award, PlayCircle, CheckCircle2, Download, Users, Headphones, Wrench, ShieldCheck, Mic } from 'lucide-react'
import ChapterList from '@/components/academy/ChapterList'
import type { ChapterProgress } from '@/components/academy/ChapterList'
import { getLocalProgress } from '@/lib/progress-store'
import type { Course } from '@/config/courses'

/**
 * Pull the audience sentence out of a longDescription that follows the
 * pattern "For X, Y, and Z. ..." → returns the "For X, Y, and Z" part
 * without the trailing period. Returns null if the description doesn't
 * follow the pattern.
 */
function extractAudience(longDescription: string): string | null {
  const m = longDescription.match(/^(For[^.]+)\./)
  return m ? m[1].trim() : null
}

/**
 * Pull the voice persona ("Voice: Emma." or "Voice: Andrew.") out of a
 * description if present.
 */
function extractVoice(description: string): string | null {
  const m = description.match(/Voice:\s*([A-Za-z]+)/)
  return m ? m[1] : null
}

interface CourseDetailClientProps {
  course: Course
}

export default function CourseDetailClient({ course }: CourseDetailClientProps) {
  const firstChapter = course.chapters[0]
  const [progress, setProgress] = useState<Record<string, ChapterProgress>>({})

  useEffect(() => {
    const local = getLocalProgress(course.id)
    if (local) setProgress(local.chapters)
  }, [course.id])

  const lastAccessedChapter = Object.values(progress)
    .sort((a, b) => new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime())[0]

  const continueChapter = lastAccessedChapter
    ? course.chapters.find(ch => ch.id === lastAccessedChapter.chapterId)
    : null

  const themeAccent = course.theme?.accent || '#F97316'
  const themePrimary = course.theme?.primary || '#475569'
  const themePrimaryDeep = course.theme?.primaryDeep || '#334155'

  // Hero uses the SHORT description (one-paragraph punchline) — not the
  // long longDescription wall of text. Long description content is broken
  // out across structured callout cards below.
  const heroLead = course.description

  // Extract structured fields from the existing longDescription so we can
  // surface them as visual callouts instead of one block of prose.
  const audience = useMemo(() => extractAudience(course.longDescription), [course.longDescription])
  const voice = useMemo(() => extractVoice(course.description), [course.description])

  // Detect whether the course has a capstone builder (last chapter usually).
  const lastRealChapter = useMemo(() => {
    const real = course.chapters.filter(ch => !ch.isMockExam && ch.id !== 'chapter-00')
    return real.length ? real[real.length - 1] : null
  }, [course.chapters])
  const hasBuilder = !!lastRealChapter && /builder|capstone|making.it.stick/i.test(lastRealChapter.slug || lastRealChapter.id)

  const realChapterCount = useMemo(
    () => course.chapters.filter(ch => !ch.isMockExam && ch.id !== 'chapter-00').length,
    [course.chapters],
  )

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <Link
            href="/ai-academy"
            className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to AI Academy
          </Link>

          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="inline-flex items-center px-3 py-1 text-xs font-bold bg-secondary-400 text-dark-900 rounded-full uppercase">
                {course.badge}
              </span>
              <span className="text-white/60 text-sm">{course.certification}</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
              {course.title}
            </h1>
            <p className="text-lg text-white/85 leading-relaxed mb-8 max-w-2xl">
              {heroLead}
            </p>

            <div className="flex flex-wrap gap-4">
              {continueChapter && !lastAccessedChapter?.completed ? (
                <Link
                  href={`/ai-academy/${course.id}/${continueChapter.slug}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-secondary-400 text-dark-900 font-bold rounded-lg hover:bg-secondary-300 transition-colors"
                >
                  <PlayCircle className="w-5 h-5" />
                  Continue: {continueChapter.title}
                </Link>
              ) : (
                <Link
                  href={`/ai-academy/${course.id}/${firstChapter.slug}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-secondary-400 text-dark-900 font-bold rounded-lg hover:bg-secondary-300 transition-colors"
                >
                  <PlayCircle className="w-5 h-5" />
                  {firstChapter.number === 0 ? 'Start Course' : 'Start Chapter 01'}
                </Link>
              )}
              <a
                href={`/api/content/courses-pdfs/${course.id}.pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg ring-1 ring-white/20 hover:ring-white/40 transition-all backdrop-blur-sm"
              >
                <Download className="w-5 h-5" />
                Download course PDF
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: BookOpen, label: 'Chapters', value: String(course.totalChapters) },
              { icon: Clock, label: 'Duration', value: course.duration },
              { icon: BarChart3, label: 'Level', value: course.level },
              { icon: Award, label: 'Certification', value: course.certification },
            ].map(stat => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                  <stat.icon className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Two-column: structured callouts + course brief */}
      <section className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-14 max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left rail (1/3) — Audience + how it works */}
            <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              {audience && (
                <div
                  className="rounded-2xl p-6 ring-1"
                  style={{ background: '#F8FAFC', borderColor: `${themePrimary}1F` } as React.CSSProperties}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: themePrimaryDeep }}
                  >
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">Who this is for</h3>
                  <p className="text-[15px] text-gray-800 leading-relaxed">{audience}.</p>
                </div>
              )}

              <div className="rounded-2xl p-6 ring-1 ring-gray-100 bg-gray-50">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: themePrimaryDeep }}
                >
                  <Headphones className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">How this course works</h3>
                <ul className="space-y-2.5 text-sm text-gray-700">
                  <li className="flex items-start gap-2.5">
                    <BookOpen className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: themeAccent }} />
                    <span>{realChapterCount} audio-narrated slide chapters · {course.duration} of focused content</span>
                  </li>
                  {voice && (
                    <li className="flex items-start gap-2.5">
                      <Mic className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: themeAccent }} />
                      <span>Narrated by {voice} (Azure neural voice)</span>
                    </li>
                  )}
                  {hasBuilder && (
                    <li className="flex items-start gap-2.5">
                      <Wrench className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: themeAccent }} />
                      <span>Capstone with interactive Markdown builder you take to your team</span>
                    </li>
                  )}
                  <li className="flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: themeAccent }} />
                    <span>Trust trip-wires on every play — what not to cross</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Award className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: themeAccent }} />
                    <span>Free verifiable certificate on completion</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right column (2/3) — What you'll learn */}
            <div className="lg:col-span-2">
              {course.learningOutcomes && course.learningOutcomes.length > 0 ? (
                <>
                  <h2 className="font-heading text-2xl font-bold text-gray-900 mb-1">What you'll walk out with</h2>
                  <p className="text-sm text-gray-500 mb-6">
                    Specific outcomes from this course — no fluff.
                  </p>
                  <ul className="grid gap-3">
                    {course.learningOutcomes.map((outcome, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 p-4 rounded-xl bg-white ring-1 ring-gray-200 hover:ring-gray-300 hover:shadow-sm transition-all"
                      >
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ background: `${themeAccent}1A` }}
                        >
                          <CheckCircle2 className="w-4 h-4" style={{ color: themeAccent }} strokeWidth={2.5} />
                        </div>
                        <span className="text-[15px] text-gray-800 leading-relaxed">{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                // Fallback for older courses without learningOutcomes — show description split into compact paragraphs.
                <>
                  <h2 className="font-heading text-2xl font-bold text-gray-900 mb-6">About this course</h2>
                  <div className="space-y-4 text-[15px] text-gray-700 leading-[1.75]">
                    <p>{course.longDescription}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Chapter list */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <h2 className="font-heading text-2xl font-bold text-gray-900 mb-1">Course content</h2>
          <p className="text-sm text-gray-500 mb-6">
            {course.totalChapters} chapters · {course.duration}
          </p>
          <ChapterList courseId={course.id} chapters={course.chapters} progress={progress} />
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-5xl">
          <div
            className="rounded-2xl p-8 lg:p-10 text-white relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${themePrimaryDeep} 0%, ${themePrimary} 100%)` }}
          >
            <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <h3 className="font-heading text-2xl font-bold mb-2">Want this delivered inside your organisation?</h3>
                <p className="text-white/80 text-sm lg:text-base leading-relaxed max-w-2xl">
                  The course is the starting point. The same content powers a 4-week pilot, an org-wide rollout, or a continuous build engagement — set up on your data, with your team, by Gennoor Tech.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/contact#book"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Book a 30-min call
                </Link>
                <a
                  href={`/api/content/courses-pdfs/${course.id}.pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg ring-1 ring-white/30"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
