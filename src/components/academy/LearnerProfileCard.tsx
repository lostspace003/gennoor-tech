'use client'

import { useEffect, useState } from 'react'
import { Loader2, ShieldCheck, LogOut, Check } from 'lucide-react'

interface ProfileData {
  email: string
  name: string
  organization: string
  role: string
  provider: string
  hasPassword: boolean
  memberSince: string | null
}

const PROVIDER_LABEL: Record<string, string> = {
  otp: 'Email code',
  google: 'Google',
  microsoft: 'Microsoft',
  password: 'Password',
}

const inputCls =
  'w-full px-4 py-2.5 bg-white border border-[#d2d2d7] rounded-xl text-[14px] text-gray-900 placeholder:text-[#a1a1a6] focus:outline-none focus:ring-2 focus:ring-primary-600/40 focus:border-primary-600 transition-colors'
const labelCls = 'block text-[12px] font-semibold text-[#6e6e73] mb-1.5'
const saveBtnCls =
  'inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-[#0077ed] text-white text-[14px] font-medium rounded-full transition-colors disabled:opacity-50'

/**
 * The learner's saved profile + security settings. Renders as two
 * hairline cards: identity fields (name / organization / role) and
 * password management + sign-out.
 */
export default function LearnerProfileCard({ onSignOut }: { onSignOut: () => void }) {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)

  // Profile form
  const [name, setName] = useState('')
  const [organization, setOrganization] = useState('')
  const [role, setRole] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [profileError, setProfileError] = useState('')

  // Password form
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwSaving, setPwSaving] = useState(false)
  const [pwSaved, setPwSaved] = useState(false)
  const [pwError, setPwError] = useState('')

  useEffect(() => {
    let cancelled = false
    fetch('/api/learner/profile')
      .then(r => (r.ok ? r.json() : null))
      .then((d: ProfileData | null) => {
        if (cancelled || !d) return
        setProfile(d)
        setName(d.name || '')
        setOrganization(d.organization || '')
        setRole(d.role || '')
      })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const handleSaveProfile = async () => {
    setSaving(true)
    setSaved(false)
    setProfileError('')
    try {
      const res = await fetch('/api/learner/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, organization, role }),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
      } else {
        const data = await res.json().catch(() => ({}))
        setProfileError(data.error || 'Could not save profile')
      }
    } catch {
      setProfileError('Network error')
    } finally {
      setSaving(false)
    }
  }

  const handleSavePassword = async () => {
    setPwError('')
    setPwSaved(false)
    if (newPassword.length < 8) {
      setPwError('Password must be at least 8 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      setPwError('Passwords do not match')
      return
    }
    setPwSaving(true)
    try {
      const res = await fetch('/api/learner/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newPassword,
          currentPassword: currentPassword || undefined,
        }),
      })
      if (res.ok) {
        setPwSaved(true)
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setProfile(p => (p ? { ...p, hasPassword: true } : p))
        setTimeout(() => setPwSaved(false), 2500)
      } else {
        const data = await res.json().catch(() => ({}))
        setPwError(data.error || 'Could not update password')
      }
    } catch {
      setPwError('Network error')
    } finally {
      setPwSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white border border-[#e8e8ed] rounded-2xl px-6 py-8 flex items-center justify-center text-[#86868b] text-sm gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading profile…
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="bg-white border border-[#e8e8ed] rounded-2xl px-6 py-8 text-center text-sm text-[#86868b]">
        Could not load your profile. Refresh the page to try again.
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-2 gap-4 items-start">
      {/* Identity */}
      <div className="bg-white border border-[#e8e8ed] rounded-2xl p-6">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h3 className="text-[17px] font-bold tracking-[-0.01em] text-gray-900">Your profile</h3>
            <p className="text-[12.5px] text-[#86868b] mt-0.5">
              Shown on your certificates and progress records.
            </p>
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#86868b] bg-[#f5f5f7] rounded-full px-2.5 py-1 whitespace-nowrap">
            {PROVIDER_LABEL[profile.provider] || profile.provider}
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <label className={labelCls}>Email</label>
            <input value={profile.email} disabled className={`${inputCls} bg-[#f5f5f7] text-[#86868b] cursor-not-allowed`} />
          </div>
          <div>
            <label className={labelCls}>Full name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" className={inputCls} maxLength={80} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Organization</label>
              <input value={organization} onChange={e => setOrganization(e.target.value)} placeholder="Company or team" className={inputCls} maxLength={120} />
            </div>
            <div>
              <label className={labelCls}>Role</label>
              <input value={role} onChange={e => setRole(e.target.value)} placeholder="e.g. Head of Operations" className={inputCls} maxLength={80} />
            </div>
          </div>

          {profileError && <p className="text-[13px] text-red-600">{profileError}</p>}

          <div className="flex items-center justify-between pt-1">
            <button onClick={handleSaveProfile} disabled={saving} className={saveBtnCls}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : null}
              {saved ? 'Saved' : 'Save changes'}
            </button>
            {profile.memberSince && (
              <span className="text-[12px] text-[#a1a1a6]">
                Learner since {new Date(profile.memberSince).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-white border border-[#e8e8ed] rounded-2xl p-6">
        <div className="flex items-start gap-3 mb-5">
          <div className="w-9 h-9 rounded-full bg-[#e8f0fe] inline-flex items-center justify-center shrink-0">
            <ShieldCheck className="w-[18px] h-[18px] text-primary-600" />
          </div>
          <div>
            <h3 className="text-[17px] font-bold tracking-[-0.01em] text-gray-900">Sign-in &amp; security</h3>
            <p className="text-[12.5px] text-[#86868b] mt-0.5">
              {profile.hasPassword
                ? 'You have a password set. You can also sign in with an email code anytime.'
                : 'Add a password for faster sign-in. Email codes keep working either way.'}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {profile.hasPassword && (
            <div>
              <label className={labelCls}>Current password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="Current password"
                className={inputCls}
                autoComplete="current-password"
              />
            </div>
          )}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>{profile.hasPassword ? 'New password' : 'Password'}</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className={inputCls}
                autoComplete="new-password"
              />
            </div>
            <div>
              <label className={labelCls}>Confirm</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                className={inputCls}
                autoComplete="new-password"
              />
            </div>
          </div>

          {pwError && <p className="text-[13px] text-red-600">{pwError}</p>}

          <div className="flex items-center justify-between pt-1">
            <button onClick={handleSavePassword} disabled={pwSaving || !newPassword} className={saveBtnCls}>
              {pwSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : pwSaved ? <Check className="w-4 h-4" /> : null}
              {pwSaved ? 'Password updated' : profile.hasPassword ? 'Change password' : 'Set password'}
            </button>
            <button
              onClick={onSignOut}
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#6e6e73] hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
