'use client'

import { useState } from 'react'
import { Award, Loader2, Mail, ArrowRight, ShieldCheck } from 'lucide-react'
import { getLocalProgress } from '@/lib/progress-store'

const CERTS_KEY = 'gennoor:academy:certs'

interface Props {
  courseId: string
  onClaimed: (certId: string) => void
}

type Step = 'details' | 'code' | 'claiming'

interface ClaimedCertRecord {
  certId: string
  verifyUrl: string
  issueDate: string
  name: string
}

function storeClaimedCert(courseId: string, record: ClaimedCertRecord) {
  if (typeof window === 'undefined') return
  try {
    const raw = window.localStorage.getItem(CERTS_KEY)
    const existing: Record<string, ClaimedCertRecord> = raw ? JSON.parse(raw) : {}
    existing[courseId] = record
    window.localStorage.setItem(CERTS_KEY, JSON.stringify(existing))
  } catch {
    /* localStorage unavailable — cert still issued server-side */
  }
}

/**
 * No-login certificate claim: name + email → OTP code → cert.
 * Rendered inside the CourseCompletionOverlay when there is no learner session.
 */
export default function CertificateClaimForm({ courseId, onClaimed }: Props) {
  const [step, setStep] = useState<Step>('details')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  const nameValid = name.trim().length >= 2 && name.trim().length <= 100

  async function sendCode() {
    if (!nameValid) {
      setError('Please enter your full name — it goes on the certificate.')
      return
    }
    if (!emailValid) {
      setError('Please enter a valid email address.')
      return
    }
    setError(null)
    setSending(true)
    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      const j = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error((j as { error?: string }).error || 'Could not send the code. Try again.')
      }
      setStep('code')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Network error — try again in a moment.')
    } finally {
      setSending(false)
    }
  }

  async function claim() {
    if (otp.trim().length !== 6) {
      setError('Enter the 6-digit code from your email.')
      return
    }
    setError(null)
    setStep('claiming')
    try {
      const local = getLocalProgress(courseId)
      const progress: Record<string, { completed: boolean; completionPercent: number }> = {}
      if (local) {
        for (const [chapterId, ch] of Object.entries(local.chapters)) {
          progress[chapterId] = {
            completed: ch.completed,
            completionPercent: ch.completionPercent,
          }
        }
      }

      const res = await fetch(`/api/learner/courses/${courseId}/claim-cert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          otp: otp.trim(),
          progress,
        }),
      })
      const j = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(
          (j as { error?: string }).error || 'Could not issue the certificate. Try again.',
        )
      }

      const cert = (j as { cert?: { certId?: string; issueDate?: string }; verifyUrl?: string })
      const certId = cert.cert?.certId
      if (!certId) throw new Error('Unexpected response — try again in a moment.')

      storeClaimedCert(courseId, {
        certId,
        verifyUrl: cert.verifyUrl || `/verify/${certId}`,
        issueDate: cert.cert?.issueDate || new Date().toISOString(),
        name: name.trim(),
      })
      onClaimed(certId)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Network error — try again in a moment.')
      setStep('code')
    }
  }

  return (
    <div className="bg-white rounded-2xl">
      <div className="flex items-center justify-center gap-2 mb-2">
        <Award className="w-4 h-4 text-primary-600" />
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest text-center">
          Claim your certificate
        </p>
      </div>

      {step === 'details' && (
        <>
          <h3 className="text-lg font-bold text-gray-900 text-center mb-1">
            Who should we make it out to?
          </h3>
          <p className="text-sm text-gray-500 text-center mb-5">
            No account needed — we just verify your email with a one-time code.
          </p>

          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
            Full name <span className="font-normal normal-case tracking-normal text-gray-400">(appears on the certificate)</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your full name"
            maxLength={100}
            autoComplete="name"
            className="w-full text-sm text-gray-900 placeholder:text-gray-400 bg-gray-50 ring-1 ring-gray-200 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />

          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@company.com"
            autoComplete="email"
            className="w-full text-sm text-gray-900 placeholder:text-gray-400 bg-gray-50 ring-1 ring-gray-200 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />

          {error && (
            <div className="text-sm text-red-600 bg-red-50 ring-1 ring-red-200 rounded-lg px-4 py-2 mb-4 text-center">
              {error}
            </div>
          )}

          <button
            onClick={sendCode}
            disabled={sending}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {sending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending code…
              </>
            ) : (
              <>
                <Mail className="w-4 h-4" />
                Send code
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
          <p className="text-xs text-gray-400 text-center mt-3">
            We only use your email to issue and verify the certificate.
          </p>
        </>
      )}

      {(step === 'code' || step === 'claiming') && (
        <>
          <h3 className="text-lg font-bold text-gray-900 text-center mb-1">
            Check your inbox
          </h3>
          <p className="text-sm text-gray-500 text-center mb-5">
            We sent a 6-digit code to <span className="font-semibold text-gray-700">{email.trim()}</span>.
          </p>

          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
            Verification code
          </label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={otp}
            onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="123456"
            maxLength={6}
            autoComplete="one-time-code"
            disabled={step === 'claiming'}
            className="w-full text-center font-mono text-xl tracking-[0.5em] text-gray-900 placeholder:text-gray-300 placeholder:tracking-[0.5em] bg-gray-50 ring-1 ring-gray-200 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-60"
          />

          {error && (
            <div className="text-sm text-red-600 bg-red-50 ring-1 ring-red-200 rounded-lg px-4 py-2 mb-4 text-center">
              {error}
            </div>
          )}

          <button
            onClick={claim}
            disabled={step === 'claiming' || otp.trim().length !== 6}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {step === 'claiming' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Issuing certificate…
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                Claim certificate
              </>
            )}
          </button>

          <button
            onClick={() => { setStep('details'); setOtp(''); setError(null) }}
            disabled={step === 'claiming'}
            className="w-full text-xs text-gray-500 hover:text-gray-700 mt-3 transition-colors disabled:opacity-50"
          >
            Wrong email? Go back
          </button>
        </>
      )}
    </div>
  )
}
