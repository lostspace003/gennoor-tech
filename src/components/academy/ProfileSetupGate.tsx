'use client'

import { useEffect, useState } from 'react'
import LearnerProfileSetupForm, {
  fetchLearnerProfile,
  type LearnerProfileSnapshot,
} from './LearnerProfileSetupForm'

/**
 * Drops a non-dismissible "complete your profile" sheet over the page when a
 * signed-in learner is missing any of their registration details.
 *
 * It exists because the compulsory step in the sign-in modal only catches
 * people signing in from now on. Accounts created before it — and anyone who
 * closed the tab midway — are caught here, once, on their next visit.
 *
 * Mount it anywhere a learner might land; it renders nothing at all for signed
 * out visitors and for learners whose profile is already complete.
 */
export default function ProfileSetupGate({ onComplete }: { onComplete?: () => void } = {}) {
  const [profile, setProfile] = useState<LearnerProfileSnapshot | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchLearnerProfile().then(p => {
      if (cancelled) return
      if (p && !p.profileComplete) setProfile(p)
    })
    return () => { cancelled = true }
  }, [])

  if (!profile) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" />
      <div className="relative bg-white rounded-[22px] shadow-2xl w-full max-w-[440px] max-h-[92vh] overflow-y-auto animate-fade-in">
        <div className="px-7 pt-8 pb-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#86868b] mb-2">
            Gennoor Academy
          </p>
          <h2 className="text-[22px] font-bold tracking-[-0.02em] text-gray-900 leading-tight">
            Complete your profile
          </h2>
          <p className="text-[13.5px] leading-[1.5] text-[#6e6e73] mt-1.5 mb-5">
            One quick step before you start. These details appear on your certificates
            and let you sign back in from any device.
          </p>
          <LearnerProfileSetupForm
            profile={profile}
            onDone={() => {
              setProfile(null)
              onComplete?.()
            }}
          />
        </div>
      </div>
    </div>
  )
}
