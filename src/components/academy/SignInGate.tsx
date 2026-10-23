'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'
import LearnerAuthModal from './LearnerAuthModal'

/**
 * Shown in place of gated Academy content for signed-out visitors. Signing in
 * re-renders the server page, which now sees the session cookie.
 */
export default function SignInGate({
  heading = 'Sign in to open this course',
  body = 'Every Learning Studio course is free, and opens after you sign in.',
}: {
  heading?: string
  body?: string
}) {
  const router = useRouter()
  const [open, setOpen] = useState(true)

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-6 py-24 bg-white">
      <div className="max-w-md text-center">
        <div className="w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-5">
          <Lock className="w-6 h-6 text-primary-600" />
        </div>
        <h1 className="font-heading text-3xl font-bold tracking-tight text-gray-900 mb-3">{heading}</h1>
        <p className="text-[#6e6e73] mb-7">{body}</p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center justify-center px-7 py-3 bg-primary-600 hover:bg-[#0077ed] text-white text-sm font-semibold rounded-full transition-colors"
        >
          Sign in or create an account
        </button>
      </div>
      <LearnerAuthModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onLoginSuccess={() => {
          setOpen(false)
          router.refresh()
        }}
        title="Sign in to Learning Studio"
        subtitle="One account for every course."
      />
    </main>
  )
}
