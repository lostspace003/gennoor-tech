'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { LogOut, Settings, ChevronDown, Loader2 } from 'lucide-react'
import { useLearnerAuth } from '@/hooks/useLearnerAuth'
import LearnerAuthModal from './LearnerAuthModal'
import LearnerAccountModal from './LearnerAccountModal'
import { fetchLearnerProfile } from './LearnerProfileSetupForm'

/**
 * The learner's identity control for the academy — avatar and name at the top
 * right, opening a menu with their details, an account sheet for editing them
 * or their password, and sign out.
 *
 * Signed-out visitors get a plain "Sign in" button instead: the academy is
 * free to browse without an account, so this must never read as a wall.
 */
export default function LearnerAccountMenu({
  variant = 'light',
  className = '',
}: {
  /** 'dark' inverts the colours for the near-black course player bar. */
  variant?: 'light' | 'dark'
  className?: string
}) {
  const { session, loading, isLoggedIn, logout, refreshSession } = useLearnerAuth()
  const [open, setOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [username, setUsername] = useState('')
  const wrapRef = useRef<HTMLDivElement>(null)

  // Click-outside and Escape both close the menu — a dropdown anchored to a
  // fixed header is easy to lose track of otherwise.
  useEffect(() => {
    if (!open) return
    const onPointer = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const loadUsername = useCallback(() => {
    fetchLearnerProfile().then(p => setUsername(p?.username || ''))
  }, [])

  useEffect(() => {
    if (isLoggedIn) loadUsername()
  }, [isLoggedIn, loadUsername])

  const dark = variant === 'dark'

  if (loading) {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <Loader2 className={`w-4 h-4 animate-spin ${dark ? 'text-white/40' : 'text-gray-300'}`} />
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <>
        <button
          onClick={() => setAuthOpen(true)}
          className={`inline-flex items-center gap-2 px-4 py-2 text-[13px] font-semibold rounded-full transition-colors ${className} ${
            dark
              ? 'text-white/80 hover:text-white hover:bg-white/10'
              : 'text-gray-700 bg-white ring-1 ring-gray-200 hover:ring-primary-300 hover:text-primary-700'
          }`}
        >
          Sign in
        </button>
        <LearnerAuthModal
          isOpen={authOpen}
          onClose={() => setAuthOpen(false)}
          onLoginSuccess={() => { refreshSession(); loadUsername() }}
          title="Sign in to Learning Studio"
          subtitle="Save your progress and claim certificates across devices."
        />
      </>
    )
  }

  const displayName = session?.name || session?.email || 'Learner'
  const initial = displayName.trim().charAt(0).toUpperCase() || 'L'

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={`inline-flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-full transition-colors ${
          dark ? 'hover:bg-white/10' : 'hover:bg-[#f5f5f7] ring-1 ring-gray-200 bg-white'
        }`}
      >
        <span className="w-7 h-7 rounded-full bg-primary-600 text-white text-[12px] font-bold inline-flex items-center justify-center shrink-0">
          {initial}
        </span>
        <span className={`hidden sm:inline text-[13px] font-medium max-w-[130px] truncate ${dark ? 'text-white/90' : 'text-gray-900'}`}>
          {displayName}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform ${open ? 'rotate-180' : ''} ${dark ? 'text-white/50' : 'text-[#86868b]'}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+8px)] w-64 bg-white rounded-2xl shadow-2xl ring-1 ring-black/5 overflow-hidden z-50 animate-fade-in"
        >
          <div className="px-4 py-3.5 border-b border-[#f0f0f2]">
            <p className="text-[14px] font-semibold text-gray-900 truncate">{displayName}</p>
            <p className="text-[12px] text-[#86868b] truncate">{session?.email}</p>
            {username && (
              <p className="text-[12px] text-[#a1a1a6] truncate mt-0.5">@{username}</p>
            )}
          </div>

          <button
            role="menuitem"
            onClick={() => { setOpen(false); setAccountOpen(true) }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13.5px] text-gray-800 hover:bg-[#f5f5f7] transition-colors"
          >
            <Settings className="w-4 h-4 text-[#86868b]" />
            Profile &amp; password
          </button>

          <button
            role="menuitem"
            onClick={async () => { setOpen(false); await logout() }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13.5px] text-gray-800 hover:bg-red-50 hover:text-red-600 transition-colors border-t border-[#f0f0f2]"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      )}

      <LearnerAccountModal
        isOpen={accountOpen}
        onClose={() => setAccountOpen(false)}
        onSaved={() => { refreshSession(); loadUsername() }}
      />
    </div>
  )
}
