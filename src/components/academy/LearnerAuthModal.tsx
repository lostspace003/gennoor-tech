'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Mail, Loader2 } from 'lucide-react'

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (response: { credential: string }) => void }) => void
          renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void
          prompt: () => void
        }
      }
    }
  }
}

interface LearnerAuthModalProps {
  isOpen: boolean
  onClose: () => void
  onLoginSuccess: () => void
  title?: string
  subtitle?: string
}

export default function LearnerAuthModal({ isOpen, onClose, onLoginSuccess, title, subtitle }: LearnerAuthModalProps) {
  const [step, setStep] = useState<'choose' | 'otp-email' | 'otp-verify'>('choose')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])
  const googleBtnRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) {
      setStep('choose')
      setEmail('')
      setName('')
      setOtp(['', '', '', '', '', ''])
      setError('')
    }
  }, [isOpen])

  // Load Google Identity Services and render the official sign-in button when available
  useEffect(() => {
    if (!isOpen || step !== 'choose' || !GOOGLE_CLIENT_ID) return

    const handleGoogleCredential = async (response: { credential: string }) => {
      setLoading(true)
      setError('')
      try {
        const res = await fetch('/api/learner/login-google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ credential: response.credential }),
        })
        if (res.ok) {
          onLoginSuccess()
          onClose()
        } else {
          const data = await res.json().catch(() => ({}))
          setError(data.error || 'Google sign-in failed')
        }
      } catch {
        setError('Network error')
      } finally {
        setLoading(false)
      }
    }

    const init = () => {
      if (!window.google || !googleBtnRef.current) return
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCredential,
      })
      googleBtnRef.current.innerHTML = ''
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: 'outline',
        size: 'large',
        width: 320,
        text: 'continue_with',
      })
    }

    if (window.google) {
      init()
      return
    }
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = init
    document.head.appendChild(script)
  }, [isOpen, step, onLoginSuccess, onClose])

  if (!isOpen) return null

  const handleSendOtp = async () => {
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Please enter a valid email')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setStep('otp-verify')
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to send code')
      }
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    const code = otp.join('')
    if (code.length !== 6) {
      setError('Please enter the 6-digit code')
      return
    }
    setLoading(true)
    setError('')
    try {
      // Verify OTP
      const verifyRes = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: code }),
      })
      if (!verifyRes.ok) {
        const data = await verifyRes.json()
        setError(data.error || 'Invalid code')
        setLoading(false)
        return
      }

      // Create learner session
      const loginRes = await fetch('/api/learner/login-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: name || undefined }),
      })
      if (loginRes.ok) {
        onLoginSuccess()
        onClose()
      } else {
        setError('Login failed. Please try again.')
      }
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const newOtp = [...otp]
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i]
    }
    setOtp(newOtp)
    otpRefs.current[Math.min(pasted.length, 5)]?.focus()
  }

  const handleMicrosoftLogin = () => {
    const returnTo = typeof window !== 'undefined' ? window.location.pathname : '/ai-academy'
    window.location.href = `/api/learner/login-microsoft?returnTo=${encodeURIComponent(returnTo)}`
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-accent-600 px-6 py-5">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white">
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-heading font-bold text-white">
            {title || 'Save Your Progress'}
          </h2>
          <p className="text-sm text-white/80 mt-1">
            {subtitle || 'Sign in to save your learning progress across devices.'}
          </p>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
              {error}
            </div>
          )}

          {step === 'choose' && (
            <div className="space-y-3">
              {/* Google */}
              {GOOGLE_CLIENT_ID ? (
                <div ref={googleBtnRef} className="flex justify-center min-h-[44px]" />
              ) : null}

              {/* Microsoft */}
              <button
                onClick={handleMicrosoftLogin}
                className="w-full flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 23 23">
                  <path fill="#f35325" d="M1 1h10v10H1z"/>
                  <path fill="#81bc06" d="M12 1h10v10H12z"/>
                  <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                  <path fill="#ffba08" d="M12 12h10v10H12z"/>
                </svg>
                <span className="text-sm font-medium text-gray-700">Continue with Microsoft</span>
              </button>

              {/* Divider */}
              <div className="flex items-center gap-4 py-2">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 uppercase">or use email</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Email OTP */}
              <button
                onClick={() => setStep('otp-email')}
                className="w-full flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Mail className="w-5 h-5 text-primary-500" />
                <span className="text-sm font-medium text-gray-700">Continue with Email</span>
              </button>
            </div>
          )}

          {step === 'otp-email' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                  autoFocus
                  onKeyDown={e => e.key === 'Enter' && handleSendOtp()}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name (optional)</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep('choose')}
                  className="px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900"
                >
                  Back
                </button>
                <button
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Send Code
                </button>
              </div>
            </div>
          )}

          {step === 'otp-verify' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                We sent a 6-digit code to <span className="font-medium">{email}</span>
              </p>
              <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => { otpRefs.current[i] = el }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(i, e)}
                    className="w-11 h-12 text-center text-lg font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    autoFocus={i === 0}
                  />
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => { setStep('otp-email'); setOtp(['', '', '', '', '', '']); }}
                  className="px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900"
                >
                  Back
                </button>
                <button
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Verify & Sign In
                </button>
              </div>
              <button
                onClick={handleSendOtp}
                className="w-full text-sm text-primary-600 hover:text-primary-700"
              >
                Resend code
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
