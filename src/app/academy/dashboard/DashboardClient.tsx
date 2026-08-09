'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Award, ArrowRight, CheckCircle2, Circle, PlayCircle, Loader2, ExternalLink, UserCircle2, Search, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { courses as allCourses } from '@/config/courses'
import { courses as catalogCourses } from '@/data/academy/courses'
import { CatalogFilterBar, useCatalogFilters } from '@/components/academy/CatalogFilters'
import { getAllLocalProgress } from '@/lib/progress-store'
import { useLearnerAuth } from '@/hooks/useLearnerAuth'
import LearnerAuthModal from '@/components/academy/LearnerAuthModal'
import LearnerProfileCard from '@/components/academy/LearnerProfileCard'
import LearnerAnalytics from '@/components/academy/LearnerAnalytics'
import AcademyLiveSessions from '@/components/academy/AcademyLiveSessions'
import LearnerAccountMenu from '@/components/academy/LearnerAccountMenu'
import ProfileSetupGate from '@/components/academy/ProfileSetupGate'

const LOCAL_CERTS_KEY = 'gennoor:academy:certs'

/**
 * The runtime course configs carry no taxonomy — track, level, audience and the
 * rest live in the public catalog, where every course is keyed by a slug equal
 * to the runtime course id. This is the join that lets the dashboard offer the
 * same six-facet filter as /academy.
 */
const catalogBySlug = new Map(catalogCourses.map(c => [c.slug, c]))

/** Two rows of the three-up grid per page — enough to scan without scrolling far. */
const COURSES_PER_PAGE = 9

type StatusFilter = 'all' | 'in-progress' | 'completed' | 'not-started'

interface LocalCertRecord {
  certId: string
  verifyUrl: string
  issueDate: string
  name: string
}

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
  const { isLoggedIn, loading: authLoading, session, logout } = useLearnerAuth()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [localCerts, setLocalCerts] = useState<Record<string, LocalCertRecord>>({})
  const [authOpen, setAuthOpen] = useState(false)
  const [courseQuery, setCourseQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [page, setPage] = useState(1)
  const catalogFilters = useCatalogFilters()
  /**
   * The page used to be one scroll: welcome, stats, sessions, analytics,
   * certificates, and then the entire 48-course catalogue with its own search
   * and filters. Two different jobs — "where was I?" and "what else is there?"
   * — competing in one column, which is what made it feel confusing.
   *
   * Now they're separate modes. Learning is the default because a returning
   * learner almost always wants to resume; browsing is one tap away.
   */
  const [view, setView] = useState<'learning' | 'browse'>('learning')

  // Certificates claimed on this device without an account (OTP claim flow).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(LOCAL_CERTS_KEY)
      if (raw) setLocalCerts(JSON.parse(raw))
    } catch { /* ignore corrupt data */ }
  }, [])

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

  // Server certs (when logged in) merged with device-local claimed certs,
  // deduped by certId.
  const certificates = useMemo<CertRow[]>(() => {
    const merged: CertRow[] = [...(data?.certificates ?? [])]
    const seen = new Set(merged.map(c => c.certId))
    for (const [courseId, rec] of Object.entries(localCerts)) {
      if (!rec?.certId || seen.has(rec.certId)) continue
      seen.add(rec.certId)
      merged.push({
        certId: rec.certId,
        workshopSlug: courseId,
        workshopTitle: allCourses.find(c => c.id === courseId)?.title || courseId,
        issueDate: rec.issueDate,
        verifyUrl: rec.verifyUrl,
      })
    }
    return merged
  }, [data, localCerts])

  // The progress rows powering both the course list and the analytics —
  // server rows when signed in, device-local rows otherwise.
  const progressRows = useMemo<ProgressRow[]>(() => {
    if (data) return data.progress
    const rows: ProgressRow[] = []
    const local = getAllLocalProgress()
    for (const courseId in local) {
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
    }
    return rows
  }, [data])

  // Per-course summary: combine config + progress rows + cert.
  const courseSummaries = useMemo(() => {
    const progressByCourse = new Map<string, ProgressRow[]>()
    const certByCourse = new Map<string, CertRow>()

    for (const c of certificates) {
      certByCourse.set(c.workshopSlug, c)
    }
    for (const row of progressRows) {
      const arr = progressByCourse.get(row.courseId) || []
      arr.push(row)
      progressByCourse.set(row.courseId, arr)
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
          catalog: catalogBySlug.get(course.id),
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
  }, [progressRows, certificates])

  const stats = useMemo(() => {
    const started = courseSummaries.filter(s => !s.notStarted).length
    const completed = courseSummaries.filter(s => s.isCompleted).length
    const certs = certificates.length
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
  }, [courseSummaries, certificates])

  // In-progress courses, furthest along first — the resume strip at the top.
  const resumeCourses = useMemo(
    () => courseSummaries.filter(s => s.inProgress && !s.isCompleted).sort((a, b) => b.percentComplete - a.percentComplete).slice(0, 3),
    [courseSummaries]
  )

  const statusCounts = useMemo(() => ({
    completed: courseSummaries.filter(s => s.isCompleted).length,
    inProgress: courseSummaries.filter(s => !s.isCompleted && !s.notStarted).length,
    notStarted: courseSummaries.filter(s => s.notStarted).length,
  }), [courseSummaries])

  // ── Course browser: search, status filter, taxonomy facets, pagination ──
  // The catalog outgrew a plain list — dozens of full-width rows meant
  // scrolling past everything to find one course.
  const { matches: catalogMatches, reset: resetCatalogFilters, activeCount: catalogActiveCount } = catalogFilters

  const visibleCourses = useMemo(() => {
    const q = courseQuery.trim().toLowerCase()
    return courseSummaries.filter(s => {
      if (statusFilter === 'in-progress' && (s.isCompleted || s.notStarted)) return false
      if (statusFilter === 'completed' && !s.isCompleted) return false
      if (statusFilter === 'not-started' && !s.notStarted) return false
      if (!catalogMatches(s.catalog)) return false
      if (!q) return true
      // Match the things a learner actually remembers about a course.
      const haystack = [
        s.course.title,
        s.course.description,
        s.course.duration,
        ...(s.course.tags || []),
        ...s.course.chapters.map(c => c.title),
      ].join(' ').toLowerCase()
      return haystack.includes(q)
    })
  }, [courseSummaries, courseQuery, statusFilter, catalogMatches])

  const pageCount = Math.max(1, Math.ceil(visibleCourses.length / COURSES_PER_PAGE))
  const currentPage = Math.min(page, pageCount)
  const pagedCourses = useMemo(
    () => visibleCourses.slice((currentPage - 1) * COURSES_PER_PAGE, currentPage * COURSES_PER_PAGE),
    [visibleCourses, currentPage],
  )

  // Narrowing the results while parked on page 4 would otherwise show nothing.
  useEffect(() => { setPage(1) }, [courseQuery, statusFilter, catalogActiveCount, catalogMatches])

  const handleSignOut = async () => {
    await logout()
    window.location.reload()
  }

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

  return (
    <main className="min-h-screen bg-[#f5f5f7]">
      <LearnerAuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onLoginSuccess={() => window.location.reload()}
        title="Sign in to Gennoor Academy"
        subtitle="Your progress, certificates, and analytics — saved across devices."
      />

      {/* Catches accounts created before the compulsory step existed. */}
      {isLoggedIn && <ProfileSetupGate />}

      {/* Header */}
      <section className="bg-white border-b border-[#e8e8ed]">
        <div className="mx-auto px-6 lg:px-10 py-10 max-w-[1040px]">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#86868b] mb-2">
                Gennoor Academy · Learner dashboard
              </p>
              <h1 className="text-[30px] font-bold tracking-[-0.02em] text-gray-900">
                Welcome back{session?.name ? `, ${session.name.split(' ')[0]}` : ''}.
              </h1>
              <p className="text-sm text-[#6e6e73] mt-1">
                Here is everything you have started, completed, and earned.
                {!isLoggedIn && <span className="text-[#86868b]"> Progress is saved on this device.</span>}
              </p>
            </div>
            {isLoggedIn ? (
              <LearnerAccountMenu className="self-start sm:self-auto" />
            ) : (
              <button
                onClick={() => setAuthOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-[#0077ed] text-white text-[14px] font-medium rounded-full transition-colors self-start sm:self-auto"
              >
                <UserCircle2 className="w-[18px] h-[18px]" />
                Sign in
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Sign-in prompt for device-only learners */}
      {!isLoggedIn && (
        <section className="mx-auto px-6 lg:px-10 pt-8 max-w-[1040px]">
          <div className="bg-white border border-[#e8e8ed] rounded-2xl px-6 py-6 sm:px-8 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <h2 className="text-[17px] font-bold tracking-[-0.01em] text-gray-900">
                Keep your progress everywhere.
              </h2>
              <p className="text-[13.5px] text-[#6e6e73] mt-1 leading-[1.5]">
                Create a free learner account with Microsoft, Google, or any email —
                your chapters, certificates, and analytics sync across every device.
                Right now they live only in this browser.
              </p>
            </div>
            <button
              onClick={() => setAuthOpen(true)}
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-primary-600 hover:bg-[#0077ed] text-white text-[14px] font-medium rounded-full transition-colors shrink-0"
            >
              Create account or sign in
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* Mode switch — the two jobs this page does, kept apart */}
      <section className="mx-auto px-6 lg:px-10 pt-6 max-w-[1040px]">
        <div className="inline-flex gap-1 p-1 bg-white border border-[#e8e8ed] rounded-xl">
          {([
            ['learning', 'My learning', stats.started],
            ['browse', 'Browse courses', courseSummaries.length],
          ] as const).map(([value, label, count]) => (
            <button
              key={value}
              onClick={() => setView(value)}
              className={`px-4 py-2 text-[13.5px] font-medium rounded-lg whitespace-nowrap transition-colors ${
                view === value ? 'bg-gray-900 text-white' : 'text-[#6e6e73] hover:text-gray-900 hover:bg-[#f5f5f7]'
              }`}
            >
              {label} <span className="tabular-nums opacity-60">{count}</span>
            </button>
          ))}
        </div>
      </section>

      {view === 'learning' && (
        <>
          {/* Resume — the one thing a returning learner came for */}
          {resumeCourses.length > 0 && (
            <section className="mx-auto px-6 lg:px-10 pt-6 max-w-[1040px]">
              <h2 className="text-[22px] font-bold tracking-[-0.02em] text-gray-900 mb-1">Pick up where you left off</h2>
              <p className="text-sm text-[#6e6e73] mb-5">{resumeCourses.length === 1 ? 'One course in progress.' : `${resumeCourses.length} courses in progress.`}</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {resumeCourses.map(s => {
                  const accent = s.course.theme?.accent || '#F97316'
                  const href = s.nextChapter ? `/ai-academy/${s.course.id}/${s.nextChapter.slug}` : `/ai-academy/${s.course.id}`
                  return (
                    <Link
                      key={s.course.id}
                      href={href}
                      className="group bg-white border border-[#e8e8ed] rounded-2xl p-5 hover:border-gray-300 hover:shadow-md transition-all flex flex-col"
                    >
                      <p className="text-[15px] font-bold text-gray-900 leading-snug line-clamp-2">{s.course.title}</p>
                      <div className="mt-3 h-1.5 rounded-full bg-[#f0f0f2] overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${s.percentComplete}%`, background: accent }} />
                      </div>
                      <p className="text-[11.5px] text-[#86868b] mt-1.5 tabular-nums">{s.percentComplete}% complete</p>
                      {s.nextChapter && (
                        <p className="text-[12.5px] text-[#6e6e73] mt-2 line-clamp-1">
                          Up next: <span className="text-gray-900 font-medium">{s.nextChapter.title}</span>
                        </p>
                      )}
                      <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-primary-600 group-hover:gap-1.5 transition-all">
                        Continue <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </Link>
                  )
                })}
              </div>
            </section>
          )}

          {/* Nothing started yet — sell the thing rather than show four zeros */}
          {stats.started === 0 && (
            <section className="mx-auto px-6 lg:px-10 pt-6 max-w-[1040px]">
              <div className="bg-white border border-[#e8e8ed] rounded-2xl px-6 py-8 sm:px-8">
                <h2 className="text-[20px] font-bold tracking-[-0.01em] text-gray-900">Start your first course.</h2>
                <p className="text-[14px] text-[#6e6e73] mt-1.5 leading-[1.55] max-w-[620px]">
                  {courseSummaries.length} interactive courses — narrated slides, chapter quizzes and a
                  certificate at the end. Free, and your progress saves as you go.
                </p>
                <div className="grid sm:grid-cols-3 gap-3 mt-6">
                  {courseSummaries.slice(0, 3).map(s => (
                    <Link
                      key={s.course.id}
                      href={`/ai-academy/${s.course.id}`}
                      className="group border border-[#e8e8ed] rounded-xl p-4 hover:border-gray-300 hover:shadow-sm transition-all"
                    >
                      <p className="text-[13.5px] font-semibold text-gray-900 leading-snug line-clamp-2">{s.course.title}</p>
                      <span className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold text-primary-600">
                        Start <ArrowRight className="w-3 h-3" />
                      </span>
                    </Link>
                  ))}
                </div>
                <button onClick={() => setView('browse')} className="mt-5 text-[13px] font-semibold text-primary-600 hover:text-[#0077ed]">
                  Browse all {courseSummaries.length} courses ›
                </button>
              </div>
            </section>
          )}

          {/* Stats */}
          <section className="mx-auto px-6 lg:px-10 pt-8 max-w-[1040px]">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
              {[
                { label: 'Courses started', value: String(stats.started) },
                { label: 'Courses completed', value: String(stats.completed) },
                { label: 'Certificates earned', value: String(stats.certs) },
                { label: 'Minutes invested', value: String(stats.minutes) },
              ].map(s => (
                <div key={s.label} className="bg-white border border-[#e8e8ed] rounded-2xl px-5 py-4">
                  <p className="text-[30px] font-bold tracking-[-0.02em] text-gray-900 leading-none">{s.value}</p>
                  <p className="text-xs text-[#86868b] mt-1.5">{s.label}</p>
                </div>
              ))}
            </div>
          </section>

      {/* Live sessions — same event source as /webinars, Academy-filtered */}
      <section className="mx-auto px-6 lg:px-10 pt-10 max-w-[1040px]">
        <h2 className="text-[22px] font-bold tracking-[-0.02em] text-gray-900 mb-1">Live sessions</h2>
        <p className="text-sm text-[#6e6e73] mb-5">
          Cohort sessions and Q&amp;A clinics you can join live — recordings follow.
        </p>
        <AcademyLiveSessions
          learnerName={session?.name ?? data?.learner.name ?? ''}
          learnerEmail={session?.email ?? data?.learner.email ?? ''}
        />
      </section>

      {/* Analytics */}
      <section className="mx-auto px-6 lg:px-10 pt-8 max-w-[1040px]">
        <h2 className="text-[22px] font-bold tracking-[-0.02em] text-gray-900 mb-1">Your analytics</h2>
        <p className="text-sm text-[#6e6e73] mb-5">
          A live view of your learning — updated every time you open a chapter.
        </p>
        <LearnerAnalytics progressRows={progressRows} statusCounts={statusCounts} />
      </section>

      {/* Certificates */}
      {certificates.length > 0 && (
        <section className="mx-auto px-6 lg:px-10 pt-10 max-w-[1040px]">
          <h2 className="text-[22px] font-bold tracking-[-0.02em] text-gray-900 mb-1">Your certificates</h2>
          <p className="text-sm text-[#6e6e73] mb-5">Download the PDF, add to LinkedIn, or share the verification link.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {certificates.map(c => (
              <Link
                key={c.certId}
                href={`/verify/${c.certId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-2 p-5 rounded-2xl bg-white border border-[#e8e8ed] hover:border-amber-300 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <p className="text-xs font-bold uppercase tracking-widest text-amber-600">Certified</p>
                </div>
                <h3 className="text-base font-bold text-gray-900 leading-tight">{c.workshopTitle}</h3>
                <p className="text-xs text-gray-500">Issued {new Date(c.issueDate).toLocaleDateString()}</p>
                <p className="font-mono text-xs text-gray-700">{c.certId}</p>
                <span className="text-xs font-semibold text-amber-600 inline-flex items-center gap-1 mt-2">
                  View &amp; download
                  <ExternalLink className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
        </>
      )}

      {/* Course catalogue — its own mode, so browsing never competes with
          progress for attention */}
      {view === 'browse' && (
      <section className="mx-auto px-6 lg:px-10 py-10 max-w-[1040px]">
        <h2 className="text-[22px] font-bold tracking-[-0.02em] text-gray-900 mb-1">All courses</h2>
        <p className="text-sm text-[#6e6e73] mb-5">Search the full catalogue, or filter by where you are with each one.</p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm ring-1 ring-red-200">
            {error}
          </div>
        )}

        {/* Search + status filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a1a1a6] pointer-events-none" />
            <input
              value={courseQuery}
              onChange={e => setCourseQuery(e.target.value)}
              placeholder="Search courses, topics, or chapters…"
              aria-label="Search courses"
              className="w-full pl-10 pr-9 py-2.5 bg-white border border-[#e8e8ed] rounded-xl text-[14px] text-gray-900 placeholder:text-[#a1a1a6] focus:outline-none focus:ring-2 focus:ring-primary-600/30 focus:border-primary-600 transition-colors"
            />
            {courseQuery && (
              <button
                onClick={() => setCourseQuery('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a1a1a6] hover:text-gray-900"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex gap-1 p-1 bg-white border border-[#e8e8ed] rounded-xl overflow-x-auto">
            {([
              ['all', 'All', courseSummaries.length],
              ['in-progress', 'In progress', statusCounts.inProgress],
              ['completed', 'Completed', statusCounts.completed],
              ['not-started', 'Not started', statusCounts.notStarted],
            ] as const).map(([value, label, count]) => (
              <button
                key={value}
                onClick={() => setStatusFilter(value)}
                className={`px-3 py-1.5 text-[12.5px] font-medium rounded-lg whitespace-nowrap transition-colors ${
                  statusFilter === value
                    ? 'bg-gray-900 text-white'
                    : 'text-[#6e6e73] hover:text-gray-900 hover:bg-[#f5f5f7]'
                }`}
              >
                {label} <span className="tabular-nums opacity-60">{count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* The same six taxonomy facets as the public catalog */}
        <CatalogFilterBar
          filters={catalogFilters}
          showing={visibleCourses.length}
          total={courseSummaries.length}
          className="mb-6"
        />

        {visibleCourses.length === 0 ? (
          <div className="bg-white border border-[#e8e8ed] rounded-2xl px-6 py-12 text-center">
            <p className="text-[15px] font-semibold text-gray-900">No courses match that.</p>
            <p className="text-[13.5px] text-[#6e6e73] mt-1">
              Try a different word, or clear the filters.
            </p>
            <button
              onClick={() => { setCourseQuery(''); setStatusFilter('all'); resetCatalogFilters() }}
              className="mt-4 text-[13px] font-semibold text-primary-600 hover:text-[#0077ed]"
            >
              Clear filters
            </button>
          </div>
        ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pagedCourses.map(s => {
            const theme = s.course.theme
            const accent = theme?.accent || '#F97316'
            const statusBadge = s.isCompleted
              ? { label: 'Completed', cls: 'bg-green-50 text-green-700 ring-green-200' }
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
                className="group flex flex-col bg-white rounded-2xl ring-1 ring-gray-200 hover:ring-gray-300 hover:shadow-md transition-all overflow-hidden"
              >
                {/* Accent keeps courses visually distinguishable at a glance */}
                <div className="h-1" style={{ backgroundColor: accent }} />
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`text-[10.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ring-1 ${statusBadge.cls}`}>
                      {statusBadge.label}
                    </span>
                    {s.cert && (
                      <span className="text-[10.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ring-1 bg-amber-50 text-amber-700 ring-amber-200 inline-flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        Certified
                      </span>
                    )}
                    <span className="text-[11.5px] text-gray-500">{s.course.duration}</span>
                  </div>

                  <h3 className="text-[15px] font-bold text-gray-900 leading-snug mb-1.5 line-clamp-2">
                    {s.course.title}
                  </h3>

                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">
                    {s.course.description}
                  </p>

                  {/* Progress sits directly above the CTA so the card bottoms align */}
                  <div className="mt-auto">
                    {!s.notStarted && (
                      <>
                        <div className="flex items-center gap-2.5 mb-1.5">
                          <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                            <div
                              className="h-full transition-all duration-500"
                              style={{ width: `${s.percentComplete}%`, backgroundColor: accent }}
                            />
                          </div>
                          <span className="text-[11px] font-semibold text-gray-700 tabular-nums shrink-0">
                            {s.completedChapters}/{s.totalChapters}
                          </span>
                        </div>
                        {!s.isCompleted && s.nextChapter && (
                          <p className="text-[11.5px] text-gray-500 truncate mb-3">
                            Up next: <span className="text-gray-700 font-medium">{s.nextChapter.title}</span>
                          </p>
                        )}
                      </>
                    )}
                    <span
                      className="w-full inline-flex items-center justify-center gap-1.5 text-[13px] font-bold px-4 py-2.5 rounded-xl transition-all"
                      style={{ backgroundColor: accent, color: '#fff' }}
                    >
                      {s.isCompleted ? <CheckCircle2 className="w-4 h-4" /> : s.inProgress ? <PlayCircle className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                      {ctaLabel}
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
        )}

        {/* Pagination */}
        {pageCount > 1 && (
          <div className="mt-6 flex items-center justify-between gap-4">
            <p className="text-[12.5px] text-[#86868b] tabular-nums">
              {(currentPage - 1) * COURSES_PER_PAGE + 1}–
              {Math.min(currentPage * COURSES_PER_PAGE, visibleCourses.length)} of {visibleCourses.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                aria-label="Previous page"
                className="w-9 h-9 inline-flex items-center justify-center rounded-lg bg-white border border-[#e8e8ed] text-[#6e6e73] hover:text-gray-900 hover:border-gray-300 disabled:opacity-40 disabled:hover:text-[#6e6e73] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: pageCount }, (_, i) => i + 1).map(n => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  aria-current={n === currentPage ? 'page' : undefined}
                  className={`min-w-9 h-9 px-2.5 inline-flex items-center justify-center rounded-lg text-[13px] font-medium tabular-nums transition-colors ${
                    n === currentPage
                      ? 'bg-gray-900 text-white'
                      : 'bg-white border border-[#e8e8ed] text-[#6e6e73] hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(pageCount, p + 1))}
                disabled={currentPage === pageCount}
                aria-label="Next page"
                className="w-9 h-9 inline-flex items-center justify-center rounded-lg bg-white border border-[#e8e8ed] text-[#6e6e73] hover:text-gray-900 hover:border-gray-300 disabled:opacity-40 disabled:hover:text-[#6e6e73] transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/academy"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors inline-flex items-center gap-1"
          >
            See the full Academy catalogue and tracks
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
      )}

      {/* Profile & security */}
      {isLoggedIn && (
        <section className="mx-auto px-6 lg:px-10 pb-16 max-w-[1040px]">
          <h2 className="text-[22px] font-bold tracking-[-0.02em] text-gray-900 mb-1">Profile &amp; security</h2>
          <p className="text-sm text-[#6e6e73] mb-5">
            Your details, your password, your account — all in one place.
          </p>
          <LearnerProfileCard onSignOut={handleSignOut} />
        </section>
      )}
    </main>
  )
}
