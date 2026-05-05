'use client'

import { useState, useEffect } from 'react'
import { Mail, Lock, ArrowRight, Loader2, X } from 'lucide-react'

interface ReportEmailGateProps {
  isOpen: boolean
  onClose: () => void
  onUnlock: (email: string, name: string) => void
  reportType: 'quick-scan' | 'deep-dive' | 'blueprint'
  generatePdfBase64: () => Promise<string>
  initialName?: string
}

export default function ReportEmailGate({ isOpen, onClose, onUnlock, reportType, generatePdfBase64, initialName }: ReportEmailGateProps) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState(initialName || '')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  async function handleSubmit() {
    if (!email.trim() || !name.trim()) {
      setError('Please enter both your name and email.')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.')
      return
    }

    setError('')
    setSending(true)
    try {
      const pdfBase64 = await generatePdfBase64()
      const res = await fetch('/api/ai-readiness/email-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, pdfBase64, reportType }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to send email')
      }
      onUnlock(email, name)
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    }
    setSending(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative bg-white rounded-2xl border border-gray-200 shadow-2xl p-6 sm:p-8 max-w-md w-full mx-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-50 to-accent-50 border border-primary-100 flex items-center justify-center">
            <Lock className="w-6 h-6 text-primary-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Unlock Your Full Report</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Enter your details to unlock the remaining insights and receive the complete PDF report in your inbox.
          </p>
        </div>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-all"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-all"
            autoFocus
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={sending || !email.trim() || !name.trim()}
            className="w-full py-3.5 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-primary-200/50"
          >
            {sending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending report to your email...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4" />
                Unlock Report & Send PDF
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-4 text-center flex items-center justify-center gap-1.5">
          <Lock className="w-3 h-3" />
          No spam. Your data stays private.
        </p>
      </div>
    </div>
  )
}
