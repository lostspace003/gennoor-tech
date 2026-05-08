'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Mail, Loader2 } from 'lucide-react'

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

  useEffect(() => {
    if (!isOpen) {
      setStep('choose')
      setEmail('')
      setName('')
      setOtp(['', '', '', '', '', ''])
      setError('')
    }
  }, [isOpen])

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

  const handleGoogleLogin = () => {
    setError('Google sign-in requires GOOGLE_CLIENT_ID configuration. Use email OTP for now.')
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
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="text-sm font-medium text-gray-700">Continue with Google</span>
              </button>

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
