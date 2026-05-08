'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Clock, BarChart3, Award, PlayCircle } from 'lucide-react'
import ChapterList from '@/components/academy/ChapterList'
import type { ChapterProgress } from '@/components/academy/ChapterList'
import { getLocalProgress } from '@/lib/progress-store'
import type { Course } from '@/config/courses'

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
            <p className="text-lg text-white/80 leading-relaxed mb-8 max-w-2xl">
              {course.longDescription}
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
                  Start Chapter 00
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

      {/* Chapter list */}
      <section className="section-padding">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h2 className="font-heading text-2xl font-bold text-gray-900 mb-6">Course Content</h2>
          <ChapterList courseId={course.id} chapters={course.chapters} progress={progress} />
        </div>
      </section>
    </main>
  )
}
