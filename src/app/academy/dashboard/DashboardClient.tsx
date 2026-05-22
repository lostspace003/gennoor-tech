'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Trophy, BookOpen, Clock, Award, ArrowRight, CheckCircle2, Circle, PlayCircle, Loader2, ExternalLink } from 'lucide-react'
import { courses as allCourses } from '@/config/courses'
import { getAllLocalProgress } from '@/lib/progress-store'
import { useLearnerAuth } from '@/hooks/useLearnerAuth'

interface ProgressRow {
  chapterId: string
  courseId: string
  currentSlide: number
  totalSlides: number
  completionPercent: number
  completed: boolean
  lastAccessed: string
}

interface CertRow {
  certId: string
  workshopSlug: string
  workshopTitle: string
  issueDate: string
  verifyUrl: string
}

interface DashboardData {
  learner: { name: string; email: string }
  progress: ProgressRow[]
  certificates: CertRow[]
}

export default function DashboardClient() {
  const router = useRouter()
  const { isLoggedIn, loading: authLoading, session } = useLearnerAuth()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) return
    if (!isLoggedIn) {
      setLoading(false)
      return
    }
    let cancelled = false
    fetch('/api/learner/dashboard')
      .then(async r => {
        if (!r.ok) throw new Error(`Server returned ${r.status}`)
        return r.json()
      })
      .then(d => { if (!cancelled) setData(d) })
      .catch(e => { if (!cancelled) setError(e instanceof Error ? e.message : 'Could not load dashboard') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [isLoggedIn, authLoading])

  // Per-course summary: combine config + progress rows + cert.
  const courseSummaries = useMemo(() => {
    const progressByCourse = new Map<string, ProgressRow[]>()
    const certByCourse = new Map<string, CertRow>()

    if (data) {
      for (const row of data.progress) {
        const arr = progressByCourse.get(row.courseId) || []
        arr.push(row)
        progressByCourse.set(row.courseId, arr)
      }
      for (const c of data.certificates) {
        certByCourse.set(c.workshopSlug, c)
      }
    } else {
      // Fallback to localStorage for non-logged-in users
      const local = getAllLocalProgress()
      for (const courseId in local) {
        const rows: ProgressRow[] = []
        for (const chId in local[courseId].chapters) {
          const ch = local[courseId].chapters[chId]
          rows.push({
            chapterId: ch.chapterId,
            courseId: ch.courseId,
            currentSlide: ch.currentSlide,
            totalSlides: ch.totalSlides,
            completionPercent: ch.completionPercent,
            completed: ch.completed,
            lastAccessed: ch.lastAccessed,
          })
        }
        progressByCourse.set(courseId, rows)
      }
    }

    return allCourses
      .map(course => {
        const rows = progressByCourse.get(course.id) || []
        const gated = course.chapters.filter(c => !c.isMockExam && c.id !== 'chapter-00')
        const completed = gated.filter(ch => rows.find(r => r.chapterId === ch.id)?.completed).length
        const inProgress = rows.some(r => !r.completed && r.completionPercent > 0)
        const lastTouched = rows.length > 0
          ? rows.reduce((acc, r) => r.lastAccessed > acc ? r.lastAccessed : acc, '')
          : ''
        const nextChapter = gated.find(ch => !rows.find(r => r.chapterId === ch.id)?.completed)
        return {
          course,
          rows,
          totalChapters: gated.length,
          completedChapters: completed,
          percentComplete: gated.length === 0 ? 0 : Math.round((completed / gated.length) * 100),
          inProgress,
          notStarted: rows.length === 0,
          isCompleted: completed === gated.length && gated.length > 0,
          cert: certByCourse.get(course.id) || null,
          lastTouched,
          nextChapter,
        }
      })
      .sort((a, b) => {
        // Order: in-progress first, then completed, then not-started
        const bucket = (s: typeof a) => s.isCompleted ? 1 : s.inProgress ? 0 : 2
        const ba = bucket(a)
        const bb = bucket(b)
        if (ba !== bb) return ba - bb
        if (a.lastTouched && b.lastTouched) return b.lastTouched.localeCompare(a.lastTouched)
        return 0
      })
  }, [data])

  const stats = useMemo(() => {
    const started = courseSummaries.filter(s => !s.notStarted).length
    const completed = courseSummaries.filter(s => s.isCompleted).length
    const certs = data?.certificates.length ?? 0
    const minutes = courseSummaries.reduce((sum, s) => {
      if (!s.notStarted) {
        return sum + s.course.chapters.reduce((m, ch) => {
          const row = s.rows.find(r => r.chapterId === ch.id)
          return m + (row?.completed ? (ch.estimatedMinutes || 0) : 0)
        }, 0)
      }
      return sum
    }, 0)
    return { started, completed, certs, minutes }
  }, [courseSummaries, data])

  if (authLoading || loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="inline-flex items-center gap-2 text-gray-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading your dashboard…
        </div>
      </main>
    )
  }

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 max-w-2xl text-center">
          <Trophy className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign in to see your dashboard</h1>
          <p className="text-gray-600 mb-6">
            Track which courses you have started, which are pending, and the certificates you have earned.
          </p>
          <Link
            href="/ai-academy"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            Browse courses
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-14 max-w-5xl">
          <p className="text-xs font-bold uppercase tracking-widest text-orange-400 mb-2">Your Gennoor Academy dashboard</p>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-2">
            Welcome back{session?.name ? `, ${session.name.split(' ')[0]}` : ''}
          </h1>
          <p className="text-white/75 text-sm max-w-xl">
            Here is everything you have started, completed, and earned.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-5xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: BookOpen, label: 'Courses started', value: String(stats.started), color: 'text-slate-700' },
              { icon: CheckCircle2, label: 'Courses completed', value: String(stats.completed), color: 'text-emerald-600' },
              { icon: Award, label: 'Certificates earned', value: String(stats.certs), color: 'text-orange-600' },
              { icon: Clock, label: 'Minutes invested', value: String(stats.minutes), color: 'text-slate-700' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900 leading-none">{s.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certificates */}
      {data && data.certificates.length > 0 && (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-5xl">
          <h2 className="font-heading text-2xl font-bold text-gray-900 mb-1">Your certificates</h2>
          <p className="text-sm text-gray-500 mb-5">Download the PDF, add to LinkedIn, or share the verification link.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {data.certificates.map(c => (
              <Link
                key={c.certId}
                href={`/verify/${c.certId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-2 p-5 rounded-2xl bg-white ring-1 ring-gray-200 hover:ring-orange-300 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-orange-500" />
                  <p className="text-xs font-bold uppercase tracking-widest text-orange-600">Certified</p>
                </div>
                <h3 className="text-base font-bold text-gray-900 leading-tight">{c.workshopTitle}</h3>
                <p className="text-xs text-gray-500">Issued {new Date(c.issueDate).toLocaleDateString()}</p>
                <p className="font-mono text-xs text-gray-700">{c.certId}</p>
                <span className="text-xs font-semibold text-orange-600 inline-flex items-center gap-1 mt-2">
                  View &amp; download
                  <ExternalLink className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Course list */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-5xl">
        <h2 className="font-heading text-2xl font-bold text-gray-900 mb-1">All courses</h2>
        <p className="text-sm text-gray-500 mb-5">Continue what you started, or pick up a new one.</p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm ring-1 ring-red-200">
            {error}
          </div>
        )}

        <div className="space-y-3">
          {courseSummaries.map(s => {
            const theme = s.course.theme
            const accent = theme?.accent || '#F97316'
            const statusBadge = s.isCompleted
              ? { label: 'Completed', cls: 'bg-emerald-50 text-emerald-700 ring-emerald-200' }
              : s.inProgress
                ? { label: 'In progress', cls: 'bg-amber-50 text-amber-700 ring-amber-200' }
                : { label: 'Not started', cls: 'bg-gray-50 text-gray-600 ring-gray-200' }
            const ctaHref = s.notStarted
              ? `/ai-academy/${s.course.id}`
              : s.nextChapter
                ? `/ai-academy/${s.course.id}/${s.nextChapter.slug}`
                : `/ai-academy/${s.course.id}`
            const ctaLabel = s.isCompleted ? 'Review course' : s.notStarted ? 'Start course' : 'Continue'
            return (
              <Link
                key={s.course.id}
                href={ctaHref}
                className="group block bg-white rounded-2xl ring-1 ring-gray-200 hover:ring-gray-300 hover:shadow-md transition-all"
              >
                <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ring-1 ${statusBadge.cls}`}>
                        {statusBadge.label}
                      </span>
                      {s.cert && (
                        <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ring-1 bg-orange-50 text-orange-700 ring-orange-200 inline-flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          Certified
                        </span>
                      )}
                      <span className="text-xs text-gray-500">{s.course.duration}</span>
                    </div>
                    <h3 className="text-base font-bold text-gray-900 leading-tight mb-1">
                      {s.course.title}
                    </h3>
                    {!s.notStarted && (
                      <>
                        <div className="flex items-center gap-3 mt-2 mb-1">
                          <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                            <div
                              className="h-full transition-all duration-500"
                              style={{ width: `${s.percentComplete}%`, backgroundColor: accent }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-gray-700 tabular-nums">
                            {s.completedChapters} / {s.totalChapters}
                          </span>
                        </div>
                        {!s.isCompleted && s.nextChapter && (
                          <p className="text-xs text-gray-500 mt-1.5 truncate">
                            Up next: <span className="text-gray-700 font-medium">{s.nextChapter.title}</span>
                          </p>
                        )}
                      </>
                    )}
                    {s.notStarted && (
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                        {s.course.description}
                      </p>
                    )}
                  </div>
                  <div className="sm:flex-shrink-0">
                    <span
                      className="inline-flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl group-hover:gap-2 transition-all"
                      style={{ backgroundColor: accent, color: '#fff' }}
                    >
                      {s.isCompleted ? <CheckCircle2 className="w-4 h-4" /> : s.inProgress ? <PlayCircle className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                      {ctaLabel}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/ai-academy"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors inline-flex items-center gap-1"
          >
            Browse all academy courses
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </main>
  )
}
