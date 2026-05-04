'use client'

import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { Lock, Shield } from 'lucide-react'
import { Suspense } from 'react'

function LoginContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xl">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-teal-500 rounded-xl flex items-center justify-center">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Gennoor Admin</h1>
              <p className="text-sm text-slate-500">Dashboard &amp; Analytics</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium">
                {error === 'AccessDenied'
                  ? 'Access denied. Your account is not authorized to access this dashboard.'
                  : 'Something went wrong. Please try again.'}
              </p>
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={() => signIn('microsoft-entra-id', { callbackUrl: '/admin' })}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <Shield className="w-5 h-5" />
              Sign in with Microsoft Entra ID
            </button>
            <p className="text-xs text-center text-slate-400">
              Only authorized Gennoor accounts can access this dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Loading...</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
