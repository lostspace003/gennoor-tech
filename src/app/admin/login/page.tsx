'use client'

import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AlertCircle, Sparkles, Shield } from 'lucide-react'

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const callbackUrl = searchParams.get('callbackUrl') || '/admin/crm-complete'
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logos/gennoor-tech-compact-dark.svg" alt="Gennoor Tech" className="h-12 w-auto mx-auto" />
              <p className="text-sm text-gray-600 tracking-widest mt-2">TRAIN. INNOVATE. BUILD.</p>
            </div>
          </div>
          <p className="text-gray-600 mt-2">CRM Lead Intelligence System</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Sign in to CRM</h2>

          {(error || urlError) && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-sm text-red-700">
                {error || (urlError === 'AccessDenied'
                  ? 'Access denied. Your account is not authorized.'
                  : 'Authentication error. Please try again.')}
              </span>
            </div>
          )}

          <button
            onClick={handleMicrosoftSignIn}
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
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

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Secure access for authorized Gennoor team members only.
            </p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              <Shield className="w-3 h-3 inline mr-1" />
              Secure CRM System • Gennoor Tech © 2024
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
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}