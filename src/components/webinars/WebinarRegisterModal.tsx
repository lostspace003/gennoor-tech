'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import type { UpcomingWebinar } from '@/data/webinars'

/**
 * Shared "Register free" modal for live sessions.
 *
 * Extracted from /webinars so the Academy dashboard's Live Sessions area can
 * reuse the exact same registration path (POST /api/webinar-register →
 * confirmation email + admin notification + WebinarRegistration row) rather
 * than growing a parallel implementation.
 */

const FIELD =
  'w-full box-border text-[14px] px-3.5 py-[11px] border border-gray-300 rounded-xl bg-raised text-gray-900 placeholder:text-gray-400 outline-none focus:border-primary-600 focus:ring-0 transition-colors'

export default function WebinarRegisterModal({
  webinar,
  onClose,
  defaultName = '',
  defaultEmail = '',
}: {
  webinar: UpcomingWebinar
  onClose: () => void
  /** Prefill for signed-in learners. */
  defaultName?: string
  defaultEmail?: string
}) {
  const [name, setName] = useState(defaultName)
  const [email, setEmail] = useState(defaultEmail)
  const [company, setCompany] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    try {
      const res = await fetch('/api/webinar-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          company,
          webinarId: webinar.id,
          webinarTitle: webinar.title,
          webinarDate: `${webinar.month} ${webinar.day} · ${webinar.meta}`,
        }),
      })
      if (!res.ok) throw new Error('failed')
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-raised rounded-3xl w-full max-w-md p-7 border border-gray-200">
        {status === 'success' ? (
          <div className="text-center py-6">
            <div className="text-[44px] font-bold text-green-600 mb-3">✓</div>
            <h3 className="text-[20px] font-bold text-gray-900 mb-2">You&rsquo;re registered.</h3>
            <p className="text-[14px] text-gray-500 mb-6">
              Confirmation sent to your email. The joining link arrives before
              the session.
            </p>
            <button onClick={onClose} className="pill-secondary">
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-gray-400 mb-1.5">
              Register free · {webinar.type}
            </div>
            <h3 className="text-[19px] font-bold text-gray-900 mb-1">{webinar.title}</h3>
            <p className="text-[12.5px] text-gray-400 mb-5">
              {webinar.month} {webinar.day} · {webinar.meta}
            </p>
            <form onSubmit={submit} className="space-y-3">
              {status === 'error' && (
                <p className="text-sm text-red-700 border border-red-300 bg-red-50 rounded-xl px-4 py-3">
                  Something went wrong — please try again or email webinar@gennoor.com.
                </p>
              )}
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                aria-label="Your name"
                className={FIELD}
              />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Work email"
                aria-label="Work email"
                className={FIELD}
              />
              <input
                type="text"
                value={company}
                onChange={e => setCompany(e.target.value)}
                placeholder="Company (optional)"
                aria-label="Company"
                className={FIELD}
              />
              <div className="flex items-center gap-3 pt-1.5">
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white text-[14px] font-semibold px-6 py-2.5 rounded-full transition-colors disabled:opacity-50"
                >
                  {status === 'submitting' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Registering…
                    </>
                  ) : (
                    'Register free'
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-[13px] font-medium text-gray-500 hover:text-gray-900"
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
