'use client'

import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Mail, Lock, LogIn, AlertCircle, Users, Sparkles, Shield } from 'lucide-react'

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'local' | 'production'>('local') // For development

  const callbackUrl = searchParams.get('callbackUrl') || '/admin/leads-v2'
  const urlError = searchParams.get('error')

  const authorizedUsers = [
    { email: 'admin@gennoor.com', name: 'Admin' },
    { email: 'contact@gennoor.com', name: 'Contact' },
    { email: 'yusufchaudhary@gennoor.com', name: 'Yusuf Chaudhary' },
    { email: 'jalalkhan@gennoor.com', name: 'Jalal Khan' },
  ]

  const handleLocalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password: password || 'any-password',
        redirect: false,
        callbackUrl,
      })

      if (result?.error) {
        setError('Invalid email. Please use an authorized Gennoor email.')
      } else if (result?.ok) {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const quickLogin = (userEmail: string) => {
    setEmail(userEmail)
    setPassword('local')
    setTimeout(() => {
      document.getElementById('login-form')?.dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true })
      )
    }, 100)
  }

  const isProduction = process.env.NODE_ENV === 'production'

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-xl mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Gennoor Lead Intelligence
          </h1>
          <p className="text-gray-600 mt-2">AI-Powered CRM System</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Sign in to Admin Panel</h2>

          {(error || urlError) && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-sm text-red-700">
                {error || (urlError === 'AccessDenied'
                  ? 'Access denied. Your account is not authorized.'
                  : 'Something went wrong. Please try again.')}
              </span>
            </div>
          )}

          {/* Local Development Form */}
          {!isProduction && mode === 'local' && (
            <>
              <form id="login-form" onSubmit={handleLocalSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@gennoor.com"
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter any password (local dev)"
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">For local development, any password works</p>
                </div>

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <LogIn className="w-5 h-5" />
                      Sign In
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-600 mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Quick login as:
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {authorizedUsers.map((user) => (
                    <button
                      key={user.email}
                      onClick={() => quickLogin(user.email)}
                      className="text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm"
                    >
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Production Mode */}
          {(isProduction || mode === 'production') && (
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
          )}

          {/* Toggle for local dev */}
          {!isProduction && (
            <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800 mb-2">
                <strong>Development Mode:</strong> Toggle authentication method
              </p>
              <button
                onClick={() => setMode(mode === 'local' ? 'production' : 'local')}
                className="text-xs text-blue-600 hover:underline"
              >
                Switch to {mode === 'local' ? 'Entra ID' : 'Local'} mode
              </button>
            </div>
          )}
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
