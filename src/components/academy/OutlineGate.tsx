'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useLearnerAuth } from '@/hooks/useLearnerAuth'
import type { LmsKind } from '@/lib/lms-kind'
import LearnerAuthModal from './LearnerAuthModal'
import { LessonLine } from './LessonLine'

/**
 * The course outline on the course page. A lesson that is clicked by someone who is not enrolled yet
 * first asks them to sign in (or sign up), enrolls them, and then opens that lesson: ready to play,
 * paused, at the start. The lesson is remembered in the address (?open=) so even the full-page
 * Microsoft sign-in lands on it afterwards.
 */
const OpenLesson = createContext<((id: string) => void) | null>(null)

export function OutlineGate({ slug, children }: { slug: string; children: React.ReactNode }) {
  const router = useRouter()
  const { refreshSession } = useLearnerAuth()
  const [authOpen, setAuthOpen] = useState(false)
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')
  const pending = useRef('')

  const learnUrl = useCallback((id: string) => `/studio/${slug}/learn?item=${encodeURIComponent(id)}`, [slug])

  const enrollAndGo = useCallback(async (id: string) => {
    setBusy(id)
    setError('')
    try {
      const res = await fetch('/api/lms/enroll', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug }) })
      if (res.status === 401) {
        // Not signed in: remember the lesson, then sign in.
        pending.current = id
        window.history.replaceState(null, '', `${window.location.pathname}?open=${encodeURIComponent(id)}`)
        setAuthOpen(true)
        return
      }
      if (!res.ok) throw new Error()
      router.push(learnUrl(id))
    } catch {
      setError('Could not open the lesson. Please try again.')
    } finally {
      setBusy('')
    }
  }, [slug, router, learnUrl])

  // Back from a full-page sign-in with a lesson in the address: carry on to that lesson.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('open')
    if (!id) return
    window.history.replaceState(null, '', window.location.pathname)
    fetch('/api/learner/session')
      .then(r => (r.ok ? r.json() : null))
      .then(d => { if (d?.authenticated) enrollAndGo(id) })
      .catch(() => {})
  }, [enrollAndGo])

  return (
    <OpenLesson.Provider value={enrollAndGo}>
      {children}
      {error && <p role="alert" className="mt-4 text-[14px] text-red-600">{error}</p>}
      {busy && (
        <div className="fixed inset-x-0 bottom-6 z-40 flex justify-center pointer-events-none" aria-live="polite">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#0f1824] text-white text-[13.5px] font-medium px-4 py-2 shadow-lg">
            <Loader2 className="w-4 h-4 animate-spin" /> Opening the lesson
          </span>
        </div>
      )}
      <LearnerAuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onLoginSuccess={async () => {
          setAuthOpen(false)
          await refreshSession()
          if (pending.current) enrollAndGo(pending.current)
        }}
        title="Sign in to open this lesson"
        subtitle="One Learning Studio account for every course."
      />
    </OpenLesson.Provider>
  )
}

/** A lesson row in the outline for someone who is not enrolled: it looks the same, and opens the sign-in. */
export function OutlineLesson({ id, title, kind, minutes }: { id: string; title: string; kind: LmsKind; minutes?: number }) {
  const open = useContext(OpenLesson)
  return (
    <button
      type="button"
      onClick={() => open?.(id)}
      className="group/line block w-full rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500"
    >
      <LessonLine title={title} kind={kind} minutes={minutes} />
    </button>
  )
}
