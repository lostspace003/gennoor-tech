'use client'

/**
 * One certification course as one clean view: compact header, the horizontal chapter lane, and the
 * current chapter. Navigation lives in the URL hash (#ch3), progress in localStorage (and in the
 * learner progress API when signed in). The first two chapters are free; the rest ask for the site's
 * free sign-in. The practice exam opens as a modal as soon as its chapter is reached.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, Lock, LogIn } from 'lucide-react'
import LearnerAuthModal from '@/components/academy/LearnerAuthModal'
import type { ClaudeCert } from '@/data/claude-certifications'
import '@/styles/cert-course.css'
import ChapterLane from './ChapterLane'
import ChapterView from './ChapterView'
import ExamPlayer, { loadExam } from './ExamPlayer'
import { store, useLearner } from './useLearner'
import type { ChapterMeta, CourseData } from './types'

const FREE_CHAPTERS = 2

interface Props {
  cert: ClaudeCert
  chapters: ChapterMeta[]
  questionCount: number
}

function hashId(): string {
  if (typeof window === 'undefined') return ''
  return decodeURIComponent((window.location.hash || '').slice(1))
}

export default function CourseReader({ cert, chapters, questionCount }: Props) {
  const key = cert.guideKey
  const courseId = 'claude-cert-' + key
  const { auth, refresh } = useLearner()
  const [data, setData] = useState<CourseData | null>(null)
  const [loadError, setLoadError] = useState(false)
  const [current, setCurrent] = useState<string>(chapters[0]?.id || '')
  const [done, setDone] = useState<Record<string, boolean>>({})
  const [seen, setSeen] = useState<Record<string, number>>({})
  const [authOpen, setAuthOpen] = useState(false)
  const [examOpen, setExamOpen] = useState(false)
  const [examAnswered, setExamAnswered] = useState(0)
  const [toast, setToast] = useState<{ text: string; go?: string } | null>(null)
  const examDismissed = useRef<string | null>(null)
  const top = useRef<HTMLDivElement>(null)
  const hydrated = useRef(false)

  const examChapter = useMemo(() => chapters.find(c => c.kind === 'exam') || null, [chapters])
  const resolveId = useCallback((id: string) => {
    if (id === 'exam' && examChapter) return examChapter.id
    return chapters.some(c => c.id === id) ? id : chapters[0]?.id || ''
  }, [chapters, examChapter])

  // ---- load the course body ----
  useEffect(() => {
    let alive = true
    fetch(`/cert-data/${cert.slug}.json`, { cache: 'force-cache' })
      .then(r => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then(j => { if (alive) setData(j) })
      .catch(() => { if (alive) setLoadError(true) })
    return () => { alive = false }
  }, [cert.slug])

  // ---- local state ----
  useEffect(() => {
    setDone(store<Record<string, boolean>>(key + '.done') || {})
    setSeen(store<Record<string, number>>(key + '.seen') || {})
    setExamAnswered(Object.keys(loadExam(key).checked).length)
    setCurrent(resolveId(hashId()))
    hydrated.current = true
    const onHash = () => setCurrent(resolveId(hashId()))
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [key, resolveId])

  const index = Math.max(0, chapters.findIndex(c => c.id === current))
  const isLocked = useCallback((i: number) => auth === false && i >= FREE_CHAPTERS, [auth])
  const locked = isLocked(index)
  const checking = auth === null && index >= FREE_CHAPTERS

  const navigate = useCallback((id: string) => {
    const target = resolveId(id)
    if (target === current) { top.current?.scrollIntoView({ block: 'start', behavior: 'smooth' }); return }
    history.pushState(null, '', '#' + target)
    setCurrent(target)
  }, [current, resolveId])

  // scroll to the top of the reader on every chapter change (after first paint)
  useEffect(() => {
    if (!hydrated.current) return
    const y = (top.current?.getBoundingClientRect().top || 0) + window.scrollY - 8
    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' })
  }, [current])

  // ---- progress ----
  const pushProgress = useCallback((chapterId: string, doneMap: Record<string, boolean>) => {
    if (!auth) return
    const countable = chapters.filter(c => !c.nocheck)
    const cnt = countable.filter(c => doneMap[c.id]).length
    fetch('/api/learner/progress', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        courseId, chapterId,
        currentSlide: chapters.findIndex(c => c.id === chapterId) + 1,
        totalSlides: chapters.length,
        completionPercent: countable.length ? Math.round((100 * cnt) / countable.length) : 0,
        completed: countable.length > 0 && cnt === countable.length,
      }),
    }).catch(() => {})
  }, [auth, chapters, courseId])

  useEffect(() => {
    if (!hydrated.current || !current) return
    setSeen(s => { if (s[current]) return s; const n = { ...s, [current]: Date.now() }; store(key + '.seen', n); return n })
    if (!locked) pushProgress(current, done)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, locked])

  const toggleDone = (id: string, v: boolean) => {
    setDone(d => { const n = { ...d, [id]: v }; if (!v) delete n[id]; store(key + '.done', n); pushProgress(id, n); return n })
  }

  // welcome back from the server (signed in on another device)
  useEffect(() => {
    if (!auth) return
    fetch('/api/learner/progress?courseId=' + encodeURIComponent(courseId)).then(r => (r.ok ? r.json() : null)).then(j => {
      if (!j?.chapters) return
      let last: string | null = null, ts = 0
      Object.keys(j.chapters).forEach(cid => {
        const e = j.chapters[cid]; const t = Date.parse(e.timestamp || e.Timestamp || '') || 0
        if (t >= ts) { ts = t; last = cid }
      })
      if (last && last !== hashId() && chapters.some(c => c.id === last) && index === 0) {
        const ch = chapters.find(c => c.id === last)!
        setToast({ text: `Welcome back. You were on “${ch.title}”.`, go: ch.id })
        setTimeout(() => setToast(null), 12000)
      }
    }).catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth])

  // ---- exam: open as soon as its chapter is reached ----
  const currentMeta = chapters[index]
  useEffect(() => {
    if (!data || !currentMeta) return
    if (currentMeta.kind === 'exam' && !locked && !checking && examDismissed.current !== currentMeta.id) setExamOpen(true)
    if (currentMeta.kind !== 'exam') { setExamOpen(false); examDismissed.current = null }
  }, [currentMeta, data, locked, checking])

  const closeExam = () => {
    setExamOpen(false)
    examDismissed.current = currentMeta?.id || null
    setExamAnswered(Object.keys(loadExam(key).checked).length)
  }

  const countable = chapters.filter(c => !c.nocheck)
  const doneCount = countable.filter(c => done[c.id]).length
  const pct = countable.length ? Math.round((100 * doneCount) / countable.length) : 0
  const lastSeen = useMemo(() => {
    let last: string | null = null, ts = 0
    Object.keys(seen).forEach(id => { if (seen[id] >= ts && chapters.some(c => c.id === id)) { ts = seen[id]; last = id } })
    return last
  }, [seen, chapters])

  const chapter = data?.chapters.find(c => c.id === current) || null

  return (
    <div className="cc" style={{ ['--cc-accent' as string]: cert.accent }} ref={top}>
      <div className="cc-head">
        <Link href="/claude/certifications" className="back"><ChevronLeft size={14} /> All Claude certifications</Link>
        <span className="code">{cert.code}</span>
        <span className="name">{cert.name}</span>
        <div className="right">
          <span className="cc-prog" title={`${doneCount} of ${countable.length} chapters complete`}>
            <span className="ring" style={{ ['--p' as string]: pct }}><i /></span>{pct}%
          </span>
          {auth ? (
            <Link href="/academy/dashboard" className="cc-user" title="Signed in · progress is saved">
              <span className="av">{(auth.name || auth.email).charAt(0).toUpperCase()}</span>{auth.name || auth.email.split('@')[0]}
            </Link>
          ) : auth === false ? (
            <button type="button" className="cc-user" onClick={() => setAuthOpen(true)}><LogIn size={14} /> Sign in</button>
          ) : null}
        </div>
      </div>

      <ChapterLane chapters={chapters} current={current} done={done} isLocked={isLocked} onSelect={navigate} />

      {loadError ? (
        <div className="cc-lock"><h2>The course could not be loaded.</h2><p>Please reload the page. If it keeps happening, the course data file is missing.</p></div>
      ) : locked ? (
        <div className="cc-lock">
          <span className="ic"><Lock size={22} /></span>
          <h2>Sign in free to continue the course</h2>
          <p>You have read the free chapters of {cert.name}. One email code (no password) creates your Gennoor account, unlocks every chapter and the practice exam, saves your progress and scores, and lets you join the discussion. The same account works across all of Gennoor.</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button type="button" className="cc-btn pri" onClick={() => setAuthOpen(true)}><LogIn /> Sign in or create an account</button>
            <button type="button" className="cc-btn" onClick={() => navigate(chapters[FREE_CHAPTERS - 1].id)}>Back to the free chapters</button>
          </div>
        </div>
      ) : !data || !chapter || checking ? (
        <div className="cc-skel" aria-busy="true"><i style={{ width: '40%' }} /><i /><i style={{ width: '85%' }} /><i style={{ width: '70%' }} /><i /><i style={{ width: '55%' }} /></div>
      ) : (
        <ChapterView
          cert={cert}
          data={data}
          chapter={chapter}
          prev={index > 0 ? chapters[index - 1] : null}
          next={index < chapters.length - 1 ? chapters[index + 1] : null}
          done={done}
          lastSeen={lastSeen}
          examAnswered={examAnswered}
          onToggleDone={toggleDone}
          onNavigate={navigate}
          onStartExam={() => { examDismissed.current = null; setExamOpen(true) }}
        />
      )}

      {data && (
        <ExamPlayer
          open={examOpen && !locked}
          courseKey={key}
          questions={data.questions}
          chapters={chapters}
          auth={auth}
          onClose={closeExam}
          onSignIn={() => setAuthOpen(true)}
          onReview={id => { closeExam(); navigate(id) }}
        />
      )}

      <LearnerAuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onLoginSuccess={() => { setAuthOpen(false); refresh() }}
        title={locked ? 'Unlock the full course' : 'Sign in to Gennoor'}
        subtitle="One free account for every course, exam score and discussion."
      />

      {toast && (
        <div className="cc-toast" role="status">
          <span>{toast.text}</span>
          {toast.go && <button type="button" onClick={() => { navigate(toast.go!); setToast(null) }}>Continue ›</button>}
          <button type="button" aria-label="Dismiss" onClick={() => setToast(null)} style={{ color: '#8e8e93' }}>✕</button>
        </div>
      )}
    </div>
  )
}
