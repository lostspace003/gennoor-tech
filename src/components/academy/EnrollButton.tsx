'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, PlayCircle } from 'lucide-react'
import { useLearnerAuth } from '@/hooks/useLearnerAuth'
import LearnerAuthModal from './LearnerAuthModal'

export default function EnrollButton({
  slug,
  enrolled,
  startLabel = 'Start the course',
  className = '',
}: {
  slug: string
  enrolled: boolean
  startLabel?: string
  className?: string
}) {
  const router = useRouter()
  const { isLoggedIn, refreshSession } = useLearnerAuth()
  const [authOpen, setAuthOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const learnHref = `/studio/${slug}/learn`

  const enroll = async () => {
    setBusy(true)
    setError('')
    try {
      const res = await fetch('/api/lms/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      })
      if (res.status === 401) {
        setAuthOpen(true)
        return
      }
      if (!res.ok) throw new Error()
      // Stay on the course page: it now shows where to start or resume.
      router.refresh()
    } catch {
      setError('Could not enroll. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  if (enrolled) {
    return (
      <button
        type="button"
        onClick={() => router.push(learnHref)}
        className={`inline-flex items-center justify-center gap-2 px-7 py-3 bg-primary-600 hover:bg-[#0077ed] text-white text-sm font-semibold rounded-full transition-colors ${className}`}
      >
        <PlayCircle className="w-4 h-4" /> {startLabel}
      </button>
    )
  }

  return (
    <div className="inline-flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={() => (isLoggedIn ? enroll() : setAuthOpen(true))}
        disabled={busy}
        className={`inline-flex items-center justify-center gap-2 px-7 py-3 bg-primary-600 hover:bg-[#0077ed] text-white text-sm font-semibold rounded-full transition-colors disabled:opacity-60 ${className}`}
      >
        {busy && <Loader2 className="w-4 h-4 animate-spin" />}
        Enroll free
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
      <LearnerAuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onLoginSuccess={async () => {
          setAuthOpen(false)
          await refreshSession()
          enroll()
        }}
        title="Sign in to enroll"
        subtitle="One Learning Studio account for every course."
      />
    </div>
  )
}
