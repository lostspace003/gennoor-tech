'use client'

import { useState, useRef, useEffect } from 'react'
import { CheckCircle, Loader2 } from 'lucide-react'

interface EmailOTPProps {
  email: string
  onVerified: () => void
  verified: boolean
  compact?: boolean
}

export default function EmailOTP({ email, onVerified, verified, compact = false }: EmailOTPProps) {
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [sending, setSending] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState('')
  const [cooldown, setCooldown] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Cooldown timer for resend
  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  // Reset state when email changes
  useEffect(() => {
    setOtpSent(false)
    setOtp(['', '', '', '', '', ''])
    setError('')
  }, [email])

  const sendOTP = async () => {
    if (!email || sending) return
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email first')
      return
    }

    setSending(true)
    setError('')
    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to send code')
      }
      setOtpSent(true)
      setCooldown(60)
      setOtp(['', '', '', '', '', ''])
      setTimeout(() => inputRefs.current[0]?.focus(), 100)
    } catch (err: any) {
      setError(err.message || 'Failed to send verification code')
    } finally {
      setSending(false)
    }
  }

  const verifyOTPCode = async (code: string) => {
    if (code.length !== 6) return
    setVerifying(true)
    setError('')
    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: code }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Invalid code')
      }
      onVerified()
    } catch (err: any) {
      setError(err.message || 'Invalid code. Please try again.')
      setOtp(['', '', '', '', '', ''])
      setTimeout(() => inputRefs.current[0]?.focus(), 100)
    } finally {
      setVerifying(false)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-verify when all 6 digits entered
    const code = newOtp.join('')
    if (code.length === 6) {
      verifyOTPCode(code)
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 0) return
    const newOtp = [...otp]
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i]
    }
    setOtp(newOtp)
    if (pasted.length === 6) {
      verifyOTPCode(pasted)
    } else {
      inputRefs.current[Math.min(pasted.length, 5)]?.focus()
    }
  }

  // Already verified
  if (verified) {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600">
        <CheckCircle className="h-4 w-4" />
        <span className="font-medium">Email verified</span>
      </div>
    )
  }

  // Not yet sent
  if (!otpSent) {
    return (
      <div>
        <button
          type="button"
          onClick={sendOTP}
          disabled={sending || !email}
          className={`${
            compact
              ? 'text-xs px-3 py-1.5'
              : 'text-sm px-4 py-2'
          } font-medium text-primary-700 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors border border-primary-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1.5`}
        >
          {sending ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Sending...
            </>
          ) : (
            'Verify Email'
          )}
        </button>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    )
  }

  // OTP input
  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-500">
        Enter the 6-digit code sent to <strong>{email}</strong>
      </p>
      <div className="flex gap-2 items-center">
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={el => { inputRefs.current[i] = el }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={e => handleOtpChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            onPaste={i === 0 ? handlePaste : undefined}
            disabled={verifying}
            aria-label={`OTP digit ${i + 1} of 6`}
            className="w-10 h-10 text-center text-lg font-bold rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none disabled:opacity-50"
          />
        ))}
        {verifying && <Loader2 className="h-4 w-4 animate-spin text-primary-600" />}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <button
        type="button"
        onClick={sendOTP}
        disabled={cooldown > 0 || sending}
        className="text-xs text-primary-600 hover:text-primary-700 disabled:text-gray-400 disabled:cursor-not-allowed"
      >
        {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
      </button>
    </div>
  )
}
