'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { X, Mail, Loader2, KeyRound, Eye, EyeOff } from 'lucide-react'
import LearnerProfileSetupForm, {
  fetchLearnerProfile,
  type LearnerProfileSnapshot,
} from './LearnerProfileSetupForm'

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

type Step =
  | 'choose'
  | 'password'
  | 'otp-email'
  | 'otp-verify'
  | 'forgot-email'
  | 'forgot-reset'
  // Compulsory registration details, shown after a successful sign-in and
  // before the learner reaches any course.
  | 'profile-setup'

interface LearnerAuthModalProps {
  isOpen: boolean
  onClose: () => void
  onLoginSuccess: () => void
  title?: string
  subtitle?: string
}

const inputCls =
  'w-full px-4 py-2.5 bg-white border border-[#d2d2d7] rounded-xl text-[15px] text-gray-900 placeholder:text-[#a1a1a6] focus:outline-none focus:ring-2 focus:ring-primary-600/40 focus:border-primary-600 transition-colors'
const primaryBtnCls =
  'flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-[#0077ed] text-white text-[15px] font-medium rounded-full transition-colors disabled:opacity-50'
const backBtnCls = 'px-4 py-2.5 text-[14px] text-[#6e6e73] hover:text-gray-900 transition-colors'

export default function LearnerAuthModal({ isOpen, onClose, onLoginSuccess, title, subtitle }: LearnerAuthModalProps) {
  const [step, setStep] = useState<Step>('choose')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(false)
  const [setupProfile, setSetupProfile] = useState<LearnerProfileSnapshot | null>(null)
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])
  const googleBtnRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) {
      setStep('choose')
      setEmail('')
      setName('')
      setPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setShowPassword(false)
      setOtp(['', '', '', '', '', ''])
      setError('')
      setNotice('')
      setSetupProfile(null)
    }
  }, [isOpen])

  /**
   * Every successful sign-in funnels through here. A learner missing any
   * registration detail is held on the compulsory setup step; only a complete
   * profile is allowed through to the course.
   *
   * Declared above the Google effect on purpose — that effect lists it as a
   * dependency, and dependency arrays are evaluated during render.
   */
  const finishSignIn = useCallback(async () => {
    const profile = await fetchLearnerProfile()
    if (profile && !profile.profileComplete) {
      setSetupProfile(profile)
      setStep('profile-setup')
      setError('')
      setNotice('')
      setLoading(false)
      return
    }
    onLoginSuccess()
    onClose()
  }, [onLoginSuccess, onClose])

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
          await finishSignIn()
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
  }, [isOpen, step, finishSignIn])

  const goTo = useCallback((next: Step) => {
    setStep(next)
    setError('')
    setNotice('')
    setOtp(['', '', '', '', '', ''])
  }, [])

  if (!isOpen) return null

  const validEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

  const sendOtp = async (nextStep: Step) => {
    if (!validEmail(email)) {
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
        goTo(nextStep)
        setNotice(`We sent a 6-digit code to ${email}.`)
      } else {
        const data = await res.json().catch(() => ({}))
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
      const verifyRes = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: code }),
      })
      if (!verifyRes.ok) {
        const data = await verifyRes.json().catch(() => ({}))
        setError(data.error || 'Invalid code')
        setLoading(false)
        return
      }

      const loginRes = await fetch('/api/learner/login-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: name || undefined }),
      })
      if (loginRes.ok) {
        await finishSignIn()
      } else {
        setError('Login failed. Please try again.')
      }
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordLogin = async () => {
    // The field takes an email address OR a username — a learner who has
    // forgotten which address they used can still get in.
    if (!email.trim()) {
      setError('Please enter your email or username')
      return
    }
    if (!password) {
      setError('Please enter your password')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/learner/login-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: email.trim(), password }),
      })
      if (res.ok) {
        await finishSignIn()
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Sign-in failed')
      }
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Forgot-password start. The field accepts an email address OR a username,
   * so a learner who has lost track of which address they signed up with can
   * still recover — the code always goes to the address on file.
   */
  const sendResetCode = async () => {
    if (!email.trim()) {
      setError('Enter your email address or username')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/learner/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: email.trim() }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        goTo('forgot-reset')
        setNotice(`We sent a 6-digit code to ${data.maskedEmail || 'your email'}.`)
      } else {
        setError(data.error || 'Failed to send code')
      }
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async () => {
    const code = otp.join('')
    if (code.length !== 6) {
      setError('Please enter the 6-digit code from your email')
      return
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/learner/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: email.trim(), otp: code, newPassword }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Could not reset password')
        setLoading(false)
        return
      }
      // Password is set — sign straight in with it.
      const loginRes = await fetch('/api/learner/login-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: email.trim(), password: newPassword }),
      })
      if (loginRes.ok) {
        await finishSignIn()
      } else {
        setPassword('')
        goTo('password')
        setNotice('Password updated. Sign in with your new password.')
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

  const otpBoxes = (
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
          className="w-11 h-12 text-center text-lg font-bold border border-[#d2d2d7] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-600/40 focus:border-primary-600"
          autoFocus={i === 0}
        />
      ))}
    </div>
  )

  const heading =
    step === 'password' ? 'Sign in with password'
    : step === 'otp-email' ? 'Continue with email'
    : step === 'otp-verify' ? 'Check your inbox'
    : step === 'forgot-email' ? 'Reset your password'
    : step === 'forgot-reset' ? 'Choose a new password'
    : step === 'profile-setup' ? 'Complete your profile'
    : title || 'Sign in to Learning Studio'

  const subheading =
    step === 'password' ? 'Sign in with your email address or username.'
    : step === 'otp-email' ? 'We’ll email you a one-time code — no password needed.'
    : step === 'otp-verify' ? `Enter the 6-digit code we sent to ${email}.`
    : step === 'forgot-email' ? 'Enter your email or username — we’ll send a code to the address on file.'
    : step === 'forgot-reset' ? 'Enter the code from your email, then pick a new password.'
    : step === 'profile-setup' ? 'One quick step before your course opens. These details appear on your certificates.'
    : subtitle || 'Your progress and certificates, saved across devices.'

  // The compulsory step has no exit: closing it would leave a signed-in
  // learner without the details every certificate and sign-in path depends on.
  const dismissible = step !== 'profile-setup'

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={dismissible ? onClose : undefined}
      />
      <div
        className={`relative bg-white rounded-[22px] shadow-2xl w-full overflow-hidden animate-fade-in ${
          step === 'profile-setup' ? 'max-w-[440px] max-h-[92vh] overflow-y-auto' : 'max-w-[400px]'
        }`}
      >
        {dismissible && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 inline-flex items-center justify-center rounded-full text-[#86868b] hover:text-gray-900 hover:bg-[#f5f5f7] transition-colors"
            aria-label="Close"
          >
            <X className="w-[18px] h-[18px]" />
          </button>
        )}

        <div className="px-7 pt-8 pb-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#86868b] mb-2">Learning Studio</p>
          <h2 className="text-[22px] font-bold tracking-[-0.02em] text-gray-900 leading-tight">{heading}</h2>
          <p className="text-[13.5px] leading-[1.5] text-[#6e6e73] mt-1.5 mb-5">{subheading}</p>

          {error && (
            <div className="mb-4 px-4 py-2.5 bg-red-50 border border-red-100 text-red-700 text-[13px] rounded-xl">
              {error}
            </div>
          )}
          {notice && !error && (
            <div className="mb-4 px-4 py-2.5 bg-[#f0f7ff] border border-[#d6e8ff] text-primary-600 text-[13px] rounded-xl">
              {notice}
            </div>
          )}

          {step === 'choose' && (
            <div className="space-y-3">
              {GOOGLE_CLIENT_ID ? (
                <div ref={googleBtnRef} className="flex justify-center min-h-[44px]" />
              ) : null}

              <button
                onClick={handleMicrosoftLogin}
                className="w-full flex items-center gap-3 px-4 py-3 border border-[#d2d2d7] rounded-xl hover:bg-[#f5f5f7] transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 23 23">
                  <path fill="#f35325" d="M1 1h10v10H1z"/>
                  <path fill="#81bc06" d="M12 1h10v10H12z"/>
                  <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                  <path fill="#ffba08" d="M12 12h10v10H12z"/>
                </svg>
                <span className="text-[14px] font-medium text-gray-900">Continue with Microsoft</span>
              </button>

              <div className="flex items-center gap-4 py-1.5">
                <div className="flex-1 h-px bg-[#e8e8ed]" />
                <span className="text-[11px] text-[#a1a1a6] uppercase tracking-[0.08em]">or use email</span>
                <div className="flex-1 h-px bg-[#e8e8ed]" />
              </div>

              <button
                onClick={() => goTo('otp-email')}
                className="w-full flex items-center gap-3 px-4 py-3 border border-[#d2d2d7] rounded-xl hover:bg-[#f5f5f7] transition-colors"
              >
                <Mail className="w-5 h-5 text-primary-600" />
                <span className="text-[14px] font-medium text-gray-900">Email me a one-time code</span>
              </button>

              <button
                onClick={() => goTo('password')}
                className="w-full flex items-center gap-3 px-4 py-3 border border-[#d2d2d7] rounded-xl hover:bg-[#f5f5f7] transition-colors"
              >
                <KeyRound className="w-5 h-5 text-primary-600" />
                <span className="text-[14px] font-medium text-gray-900">Sign in with password</span>
              </button>
            </div>
          )}

          {step === 'password' && (
            <div className="space-y-3.5">
              <input
                type="text"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email or username"
                className={inputCls}
                autoFocus
                autoComplete="username"
                spellCheck={false}
              />
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Password"
                  className={`${inputCls} pr-11`}
                  autoComplete="current-password"
                  onKeyDown={e => e.key === 'Enter' && handlePasswordLogin()}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#a1a1a6] hover:text-gray-900"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                </button>
              </div>
              <div className="flex gap-3 pt-1">
                <button onClick={() => goTo('choose')} className={backBtnCls}>Back</button>
                <button onClick={handlePasswordLogin} disabled={loading} className={primaryBtnCls}>
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Sign in
                </button>
              </div>
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => goTo('forgot-email')}
                  className="text-[13px] text-primary-600 hover:text-[#0077ed]"
                >
                  Forgot password?
                </button>
                <button
                  onClick={() => goTo('otp-email')}
                  className="text-[13px] text-primary-600 hover:text-[#0077ed]"
                >
                  Email me a code instead
                </button>
              </div>
            </div>
          )}

          {step === 'otp-email' && (
            <div className="space-y-3.5">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={inputCls}
                autoFocus
                autoComplete="email"
                onKeyDown={e => e.key === 'Enter' && sendOtp('otp-verify')}
              />
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name (optional)"
                className={inputCls}
                autoComplete="name"
              />
              <div className="flex gap-3 pt-1">
                <button onClick={() => goTo('choose')} className={backBtnCls}>Back</button>
                <button onClick={() => sendOtp('otp-verify')} disabled={loading} className={primaryBtnCls}>
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Send code
                </button>
              </div>
            </div>
          )}

          {step === 'otp-verify' && (
            <div className="space-y-4">
              {otpBoxes}
              <div className="flex gap-3">
                <button onClick={() => goTo('otp-email')} className={backBtnCls}>Back</button>
                <button onClick={handleVerifyOtp} disabled={loading} className={primaryBtnCls}>
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Verify &amp; sign in
                </button>
              </div>
              <button
                onClick={() => sendOtp('otp-verify')}
                className="w-full text-[13px] text-primary-600 hover:text-[#0077ed]"
              >
                Resend code
              </button>
            </div>
          )}

          {step === 'forgot-email' && (
            <div className="space-y-3.5">
              <input
                type="text"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email or username"
                className={inputCls}
                autoFocus
                autoComplete="username"
                spellCheck={false}
                onKeyDown={e => e.key === 'Enter' && sendResetCode()}
              />
              <div className="flex gap-3 pt-1">
                <button onClick={() => goTo('password')} className={backBtnCls}>Back</button>
                <button onClick={sendResetCode} disabled={loading} className={primaryBtnCls}>
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Send code
                </button>
              </div>
            </div>
          )}

          {step === 'forgot-reset' && (
            <div className="space-y-3.5">
              {otpBoxes}
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="New password (min. 8 characters)"
                  className={`${inputCls} pr-11`}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#a1a1a6] hover:text-gray-900"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className={inputCls}
                autoComplete="new-password"
                onKeyDown={e => e.key === 'Enter' && handleResetPassword()}
              />
              <div className="flex gap-3 pt-1">
                <button onClick={() => goTo('forgot-email')} className={backBtnCls}>Back</button>
                <button onClick={handleResetPassword} disabled={loading} className={primaryBtnCls}>
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Reset &amp; sign in
                </button>
              </div>
              <button
                onClick={sendResetCode}
                className="w-full text-[13px] text-primary-600 hover:text-[#0077ed]"
              >
                Resend code
              </button>
            </div>
          )}

          {step === 'profile-setup' && setupProfile && (
            <LearnerProfileSetupForm
              profile={setupProfile}
              onDone={() => {
                onLoginSuccess()
                onClose()
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
