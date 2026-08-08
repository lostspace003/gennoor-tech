'use client'

import { useEffect, useState } from 'react'
import { X, Loader2, Check, ShieldCheck, UserRound } from 'lucide-react'
import { fetchLearnerProfile, type LearnerProfileSnapshot } from './LearnerProfileSetupForm'

const inputCls =
  'w-full px-3.5 py-2.5 bg-white border border-[#d2d2d7] rounded-xl text-[14px] text-gray-900 placeholder:text-[#a1a1a6] focus:outline-none focus:ring-2 focus:ring-primary-600/40 focus:border-primary-600 transition-colors'
const labelCls = 'block text-[11.5px] font-semibold text-[#6e6e73] mb-1.5'
const btnCls =
  'inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-[#0077ed] text-white text-[14px] font-medium rounded-full transition-colors disabled:opacity-50'

type Tab = 'details' | 'password'

/**
 * The learner's self-service account sheet, opened from the academy account
 * menu: edit the details on file, change the password, or — when the current
 * one has been forgotten — reset it with a code emailed to the address on the
 * account. Everything writes straight through to the Azure learner record.
 */
export default function LearnerAccountModal({
  isOpen,
  onClose,
  onSaved,
}: {
  isOpen: boolean
  onClose: () => void
  onSaved?: () => void
}) {
  const [tab, setTab] = useState<Tab>('details')
  const [profile, setProfile] = useState<LearnerProfileSnapshot | null>(null)
  const [loading, setLoading] = useState(true)

  // Details
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [organization, setOrganization] = useState('')
  const [role, setRole] = useState('')
  const [savingDetails, setSavingDetails] = useState(false)
  const [detailsSaved, setDetailsSaved] = useState(false)
  const [detailsError, setDetailsError] = useState('')

  // Password
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [savingPw, setSavingPw] = useState(false)
  const [pwSaved, setPwSaved] = useState(false)
  const [pwError, setPwError] = useState('')

  // Forgot-password branch, inside the same sheet
  const [resetting, setResetting] = useState(false)
  const [resetCode, setResetCode] = useState('')
  const [resetSent, setResetSent] = useState('')
  const [sendingCode, setSendingCode] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    setLoading(true)
    fetchLearnerProfile().then(p => {
      if (!p) { setLoading(false); return }
      setProfile(p)
      setName(p.name || '')
      setUsername(p.username || p.suggestedUsername || '')
      setOrganization(p.organization || '')
      setRole(p.role || '')
      setLoading(false)
    })
  }, [isOpen])

  // A fresh open should never inherit half-typed secrets or stale banners.
  useEffect(() => {
    if (isOpen) return
    setTab('details')
    setCurrentPassword(''); setNewPassword(''); setConfirmPassword('')
    setResetting(false); setResetCode(''); setResetSent('')
    setDetailsError(''); setPwError(''); setDetailsSaved(false); setPwSaved(false)
  }, [isOpen])

  if (!isOpen) return null

  const saveDetails = async () => {
    setDetailsError('')
    setDetailsSaved(false)
    if (!name.trim()) return setDetailsError('Please enter your full name.')
    if (!username.trim()) return setDetailsError('Please choose a username.')
    setSavingDetails(true)
    try {
      const res = await fetch('/api/learner/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          username: username.trim(),
          organization: organization.trim(),
          role: role.trim(),
        }),
      })
      if (res.ok) {
        setDetailsSaved(true)
        setProfile(p => (p ? { ...p, name: name.trim(), username: username.trim() } : p))
        onSaved?.()
        setTimeout(() => setDetailsSaved(false), 2500)
      } else {
        const data = await res.json().catch(() => ({}))
        setDetailsError(data.error || 'Could not save your details.')
      }
    } catch {
      setDetailsError('Network error.')
    } finally {
      setSavingDetails(false)
    }
  }

  const savePassword = async () => {
    setPwError('')
    setPwSaved(false)
    if (newPassword.length < 8) return setPwError('Password must be at least 8 characters.')
    if (newPassword !== confirmPassword) return setPwError('Passwords do not match.')
    setSavingPw(true)
    try {
      const res = await fetch('/api/learner/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword, currentPassword: currentPassword || undefined }),
      })
      if (res.ok) {
        setPwSaved(true)
        setCurrentPassword(''); setNewPassword(''); setConfirmPassword('')
        setProfile(p => (p ? { ...p, hasPassword: true } : p))
        setTimeout(() => setPwSaved(false), 2500)
      } else {
        const data = await res.json().catch(() => ({}))
        setPwError(data.error || 'Could not update your password.')
      }
    } catch {
      setPwError('Network error.')
    } finally {
      setSavingPw(false)
    }
  }

  /** Forgotten the current password — prove the mailbox instead. */
  const sendResetCode = async () => {
    if (!profile) return
    setPwError('')
    setSendingCode(true)
    try {
      const res = await fetch('/api/learner/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: profile.email }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        setResetting(true)
        setResetSent(`We sent a 6-digit code to ${data.maskedEmail || profile.email}.`)
      } else {
        setPwError(data.error || 'Could not send the code.')
      }
    } catch {
      setPwError('Network error.')
    } finally {
      setSendingCode(false)
    }
  }

  const submitReset = async () => {
    if (!profile) return
    setPwError('')
    if (resetCode.replace(/\D/g, '').length !== 6) return setPwError('Enter the 6-digit code from your email.')
    if (newPassword.length < 8) return setPwError('Password must be at least 8 characters.')
    if (newPassword !== confirmPassword) return setPwError('Passwords do not match.')
    setSavingPw(true)
    try {
      const res = await fetch('/api/learner/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: profile.email,
          otp: resetCode.replace(/\D/g, ''),
          newPassword,
        }),
      })
      if (res.ok) {
        setPwSaved(true)
        setResetting(false)
        setResetCode(''); setNewPassword(''); setConfirmPassword(''); setResetSent('')
        setProfile(p => (p ? { ...p, hasPassword: true } : p))
        setTimeout(() => setPwSaved(false), 2500)
      } else {
        const data = await res.json().catch(() => ({}))
        setPwError(data.error || 'Could not reset your password.')
      }
    } catch {
      setPwError('Network error.')
    } finally {
      setSavingPw(false)
    }
  }

  const tabCls = (t: Tab) =>
    `flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-[13px] font-medium rounded-lg transition-colors ${
      tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-[#6e6e73] hover:text-gray-900'
    }`

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-[22px] shadow-2xl w-full max-w-[440px] max-h-[92vh] overflow-y-auto animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 inline-flex items-center justify-center rounded-full text-[#86868b] hover:text-gray-900 hover:bg-[#f5f5f7] transition-colors"
          aria-label="Close"
        >
          <X className="w-[18px] h-[18px]" />
        </button>

        <div className="px-6 pt-7 pb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#86868b] mb-2">
            Gennoor Academy
          </p>
          <h2 className="text-[20px] font-bold tracking-[-0.02em] text-gray-900 leading-tight">
            Your account
          </h2>
          <p className="text-[13px] text-[#6e6e73] mt-1 mb-5 truncate">
            {profile?.email || 'Loading…'}
          </p>

          {loading ? (
            <div className="py-10 flex items-center justify-center gap-2 text-[#86868b] text-sm">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading…
            </div>
          ) : !profile ? (
            <p className="py-8 text-center text-sm text-[#86868b]">
              Could not load your account. Refresh the page to try again.
            </p>
          ) : (
            <>
              <div className="flex gap-1 p-1 bg-[#f5f5f7] rounded-xl mb-5">
                <button onClick={() => setTab('details')} className={tabCls('details')}>
                  <UserRound className="w-4 h-4" /> Details
                </button>
                <button onClick={() => setTab('password')} className={tabCls('password')}>
                  <ShieldCheck className="w-4 h-4" /> Password
                </button>
              </div>

              {tab === 'details' && (
                <div className="space-y-3.5">
                  <div>
                    <label className={labelCls}>Full name</label>
                    <input value={name} onChange={e => setName(e.target.value)} className={inputCls} maxLength={80} />
                  </div>
                  <div>
                    <label className={labelCls}>Username</label>
                    <input
                      value={username}
                      onChange={e => setUsername(e.target.value.toLowerCase())}
                      className={inputCls}
                      maxLength={24}
                      spellCheck={false}
                    />
                    <p className="text-[11.5px] text-[#a1a1a6] mt-1.5 leading-snug">
                      Sign in with this if you forget which email you used.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Organization</label>
                      <input value={organization} onChange={e => setOrganization(e.target.value)} className={inputCls} maxLength={120} />
                    </div>
                    <div>
                      <label className={labelCls}>Role</label>
                      <input value={role} onChange={e => setRole(e.target.value)} className={inputCls} maxLength={80} />
                    </div>
                  </div>
                  {detailsError && <p className="text-[13px] text-red-600">{detailsError}</p>}
                  <button onClick={saveDetails} disabled={savingDetails} className={`${btnCls} w-full`}>
                    {savingDetails ? <Loader2 className="w-4 h-4 animate-spin" /> : detailsSaved ? <Check className="w-4 h-4" /> : null}
                    {detailsSaved ? 'Saved' : 'Save changes'}
                  </button>
                </div>
              )}

              {tab === 'password' && (
                <div className="space-y-3.5">
                  {resetSent && !pwSaved && (
                    <div className="px-3.5 py-2.5 bg-[#f0f7ff] border border-[#d6e8ff] text-primary-600 text-[13px] rounded-xl">
                      {resetSent}
                    </div>
                  )}

                  {resetting ? (
                    <div>
                      <label className={labelCls}>6-digit code</label>
                      <input
                        value={resetCode}
                        onChange={e => setResetCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="000000"
                        inputMode="numeric"
                        className={`${inputCls} tracking-[0.4em] font-semibold`}
                      />
                    </div>
                  ) : profile.hasPassword ? (
                    <div>
                      <label className={labelCls}>Current password</label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={e => setCurrentPassword(e.target.value)}
                        className={inputCls}
                        autoComplete="current-password"
                      />
                    </div>
                  ) : null}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>New password</label>
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
                        onKeyDown={e => e.key === 'Enter' && (resetting ? submitReset() : savePassword())}
                      />
                    </div>
                  </div>

                  {pwError && <p className="text-[13px] text-red-600">{pwError}</p>}

                  <button
                    onClick={resetting ? submitReset : savePassword}
                    disabled={savingPw || !newPassword}
                    className={`${btnCls} w-full`}
                  >
                    {savingPw ? <Loader2 className="w-4 h-4 animate-spin" /> : pwSaved ? <Check className="w-4 h-4" /> : null}
                    {pwSaved ? 'Password updated' : resetting ? 'Reset password' : profile.hasPassword ? 'Change password' : 'Set password'}
                  </button>

                  {!resetting && profile.hasPassword && (
                    <button
                      onClick={sendResetCode}
                      disabled={sendingCode}
                      className="w-full text-[13px] text-primary-600 hover:text-[#0077ed] disabled:opacity-50"
                    >
                      {sendingCode ? 'Sending code…' : 'Forgot your current password? Email me a code'}
                    </button>
                  )}
                  {resetting && (
                    <button
                      onClick={() => { setResetting(false); setResetSent(''); setPwError('') }}
                      className="w-full text-[13px] text-[#6e6e73] hover:text-gray-900"
                    >
                      Back to changing it with my current password
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
