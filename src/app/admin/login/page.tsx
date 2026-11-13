'use client'

import { useState, Suspense, useEffect, useRef } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AlertCircle, Sparkles, Shield } from 'lucide-react'

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const autoTried = useRef(false)

  const callbackUrl = searchParams.get('callbackUrl') || '/crm'
  const urlError = searchParams.get('error')

  const handleMicrosoftSignIn = async () => {
    setLoading(true)
    setError('')

    try {
      await signIn('microsoft-entra-id', {
        callbackUrl,
        redirect: true,
      })
    } catch (err) {
      setError('Failed to sign in with Microsoft. Please try again.')
      setLoading(false)
    }
  }

  // Silent SSO: when we land here mid-navigation (callbackUrl present, no
  // error), bounce straight through Microsoft — the Entra session usually
  // signs the user back in without any clicks. Guards: only once per
  // 2 minutes per tab (sessionStorage), so a failing bounce can never loop —
  // the second landing shows the normal button instead.
  const [autoSigning, setAutoSigning] = useState(false)
  useEffect(() => {
    if (autoTried.current) return
    if (urlError || !searchParams.get('callbackUrl')) return
    try {
      const last = Number(sessionStorage.getItem('gnr.sso.tried') || 0)
      if (Date.now() - last < 120_000) return // recent attempt didn't stick — show the button
      sessionStorage.setItem('gnr.sso.tried', String(Date.now()))
    } catch { /* private mode — still try once */ }
    autoTried.current = true
    setAutoSigning(true)
    handleMicrosoftSignIn()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (autoSigning && !error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logos/gennoor-tech-horizontal-transparent.svg" alt="Gennoor Tech" className="h-16 w-auto mx-auto mb-5" />
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-600">Signing you in with Microsoft…</p>
          <button onClick={() => setAutoSigning(false)} className="mt-4 text-xs text-gray-400 hover:text-gray-600 underline">
            Taking too long? Sign in manually
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logos/gennoor-tech-horizontal-transparent.svg" alt="Gennoor Tech" className="h-16 w-auto mx-auto" />
          <p className="text-xs text-gray-500 tracking-widest mt-2">TRAIN. INNOVATE. BUILD.</p>
        </div>

        <div className="bg-raised rounded-xl border border-gray-200 shadow-sm p-6">
          <h1 className="text-lg font-semibold text-gray-900">Sign in to CRM</h1>
          <p className="text-sm text-gray-500 mt-0.5 mb-5">CRM Lead Intelligence System</p>

          {(error || urlError) && (
            <div className="mb-4 p-3 bg-red-100 rounded-md flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-700 mt-0.5 shrink-0" />
              <span className="text-sm text-red-800 break-words">
                {error || (urlError === 'AccessDenied'
                  ? 'Access denied. Your account is not authorized.'
                  : 'Authentication error. Please try again.')}
              </span>
            </div>
          )}

          <button
            onClick={handleMicrosoftSignIn}
            disabled={loading}
            className="w-full py-2.5 px-4 bg-gray-800 text-white text-sm font-medium rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 21 21">
                  <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
                  <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
                  <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
                  <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
                </svg>
                Sign in with Microsoft Entra ID
              </>
            )}
          </button>

          <div className="mt-5 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              Secure access for authorized Gennoor team members only.
            </p>
            <p className="text-xs text-gray-400 text-center mt-2">
              <Shield className="w-3 h-3 inline mr-1" />
              Secure CRM System • Gennoor Tech
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}