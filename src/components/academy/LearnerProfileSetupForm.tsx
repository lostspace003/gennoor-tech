'use client'

import { useEffect, useState } from 'react'
import { Loader2, Eye, EyeOff } from 'lucide-react'

export interface LearnerProfileSnapshot {
  email: string
  name: string
  organization: string
  role: string
  username: string
  suggestedUsername: string
  hasPassword: boolean
  profileComplete: boolean
}

/** Fetch the signed-in learner's profile. null when not signed in. */
export async function fetchLearnerProfile(): Promise<LearnerProfileSnapshot | null> {
  try {
    const res = await fetch('/api/learner/profile')
    if (!res.ok) return null
    return (await res.json()) as LearnerProfileSnapshot
  } catch {
    return null
  }
}

const inputCls =
  'w-full px-4 py-2.5 bg-white border border-[#d2d2d7] rounded-xl text-[15px] text-gray-900 placeholder:text-[#a1a1a6] focus:outline-none focus:ring-2 focus:ring-primary-600/40 focus:border-primary-600 transition-colors'
const labelCls = 'block text-[12px] font-semibold text-[#6e6e73] mb-1.5'

/**
 * The one-time registration details every learner completes before a course
 * opens: who they are, the username they can sign in with if they forget which
 * email they used, and a password.
 *
 * Submitted as a single atomic request so a learner is never left half
 * registered. Everything is stored against their Azure learner record.
 */
export default function LearnerProfileSetupForm({
  profile,
  onDone,
}: {
  profile: LearnerProfileSnapshot
  onDone: () => void
}) {
  const [name, setName] = useState(profile.name || '')
  const [username, setUsername] = useState(profile.username || profile.suggestedUsername || '')
  const [organization, setOrganization] = useState(profile.organization || '')
  const [role, setRole] = useState(profile.role || '')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  // A learner who already has a password isn't asked to invent a new one just
  // to fill in the details they were missing.
  const needsPassword = !profile.hasPassword

  useEffect(() => { setError('') }, [name, username, organization, role, password, confirm])

  const submit = async () => {
    if (!name.trim()) return setError('Please enter your full name.')
    if (!username.trim()) return setError('Please choose a username.')
    if (!organization.trim()) return setError('Please enter your organization.')
    if (!role.trim()) return setError('Please enter your role.')
    if (needsPassword) {
      if (password.length < 8) return setError('Password must be at least 8 characters.')
      if (password !== confirm) return setError('Passwords do not match.')
    }

    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/learner/complete-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          username: username.trim(),
          organization: organization.trim(),
          role: role.trim(),
          password: needsPassword ? password : '',
        }),
      })
      if (res.ok) {
        onDone()
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Could not save your details. Please try again.')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-3.5">
      <div>
        <label className={labelCls}>Full name</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your name"
          className={inputCls}
          maxLength={80}
          autoFocus
          autoComplete="name"
        />
      </div>

      <div>
        <label className={labelCls}>Username</label>
        <input
          value={username}
          onChange={e => setUsername(e.target.value.toLowerCase())}
          placeholder="e.g. jalal.khan"
          className={inputCls}
          maxLength={24}
          autoComplete="username"
          spellCheck={false}
        />
        <p className="text-[11.5px] text-[#a1a1a6] mt-1.5 leading-snug">
          Use this to sign in or reset your password if you forget which email you used.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3.5">
        <div>
          <label className={labelCls}>Organization</label>
          <input
            value={organization}
            onChange={e => setOrganization(e.target.value)}
            placeholder="Company or team"
            className={inputCls}
            maxLength={120}
            autoComplete="organization"
          />
        </div>
        <div>
          <label className={labelCls}>Role</label>
          <input
            value={role}
            onChange={e => setRole(e.target.value)}
            placeholder="e.g. Head of Operations"
            className={inputCls}
            maxLength={80}
            autoComplete="organization-title"
          />
        </div>
      </div>

      {needsPassword && (
        <div className="grid sm:grid-cols-2 gap-3.5">
          <div>
            <label className={labelCls}>Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
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
          </div>
          <div>
            <label className={labelCls}>Confirm password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="Repeat password"
              className={inputCls}
              autoComplete="new-password"
              onKeyDown={e => e.key === 'Enter' && submit()}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="px-4 py-2.5 bg-red-50 border border-red-100 text-red-700 text-[13px] rounded-xl">
          {error}
        </div>
      )}

      <button
        onClick={submit}
        disabled={saving}
        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary-600 hover:bg-[#0077ed] text-white text-[15px] font-medium rounded-full transition-colors disabled:opacity-50"
      >
        {saving && <Loader2 className="w-4 h-4 animate-spin" />}
        Save &amp; continue
      </button>

      <p className="text-[11.5px] text-[#a1a1a6] text-center leading-snug">
        Signed in as {profile.email}
      </p>
    </div>
  )
}
