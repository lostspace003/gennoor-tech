'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Clock, BarChart3, Award, PlayCircle, CheckCircle2 } from 'lucide-react'
import ChapterList from '@/components/academy/ChapterList'
import type { ChapterProgress } from '@/components/academy/ChapterList'
import { getLocalProgress } from '@/lib/progress-store'
import type { Course } from '@/config/courses'

/**
 * Split a long description into reader-friendly paragraphs. Heuristic:
 * - Break on sentence boundaries followed by a capital letter
 * - Group sentences into chunks of 2-3 so paragraphs feel like prose,
 *   not a teleprompter line list.
 */
function splitToParagraphs(text: string): string[] {
  const sentences = text
    .split(/(?<=[.!?])\s+(?=[A-Z"])/g)
    .map(s => s.trim())
    .filter(Boolean)
  const paragraphs: string[] = []
  let buf: string[] = []
  for (const s of sentences) {
    buf.push(s)
    if (buf.length >= 3) {
      paragraphs.push(buf.join(' '))
      buf = []
    }
  }
  if (buf.length) paragraphs.push(buf.join(' '))
  return paragraphs
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

  const introParagraphs = useMemo(() => splitToParagraphs(course.longDescription), [course.longDescription])
  const heroLead = introParagraphs[0] || course.description
  const bodyParagraphs = introParagraphs.slice(1)
  const themeAccent = course.theme?.accent || '#F97316'
  const startCtaBg = course.theme ? course.theme.primaryDeep : undefined

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#0C1426] via-primary-800 to-primary-700 overflow-hidden">
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

      {/* What you'll learn + About */}
      <section className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-14 max-w-4xl">
          {course.learningOutcomes && course.learningOutcomes.length > 0 && (
            <div className="mb-12">
              <h2 className="font-heading text-2xl font-bold text-gray-900 mb-1">What you'll learn</h2>
              <p className="text-sm text-gray-500 mb-6">
                The specific outcomes you walk out with — no fluff.
              </p>
              <ul className="grid sm:grid-cols-2 gap-4">
                {course.learningOutcomes.map((outcome, i) => (
                  <li key={i} className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 ring-1 ring-gray-100">
                    <CheckCircle2
                      className="w-5 h-5 flex-shrink-0 mt-0.5"
                      style={{ color: themeAccent }}
                      strokeWidth={2.5}
                    />
                    <span className="text-sm text-gray-800 leading-relaxed">{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {bodyParagraphs.length > 0 && (
            <div>
              <h2 className="font-heading text-2xl font-bold text-gray-900 mb-6">About this course</h2>
              <div className="space-y-4 text-[15px] text-gray-700 leading-[1.75]">
                {bodyParagraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Chapter list */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h2 className="font-heading text-2xl font-bold text-gray-900 mb-1">Course content</h2>
          <p className="text-sm text-gray-500 mb-6">
            {course.totalChapters} chapters · {course.duration}
            {startCtaBg ? '' : ''}
          </p>
          <ChapterList courseId={course.id} chapters={course.chapters} progress={progress} />
        </div>
      </section>
    </main>
  )
}
