'use client'

import { useState } from 'react'
import { Bookmark } from 'lucide-react'
import LearnerAuthModal from './LearnerAuthModal'

interface SaveProgressModalProps {
  isVisible: boolean
  onDismiss: () => void
  onLoginSuccess: () => void
  completedChapters: number
}

export default function SaveProgressModal({ isVisible, onDismiss, onLoginSuccess, completedChapters }: SaveProgressModalProps) {
  const [showAuth, setShowAuth] = useState(false)

  if (!isVisible) return null

  if (showAuth) {
    return (
      <LearnerAuthModal
        isOpen={true}
        onClose={() => { setShowAuth(false); onDismiss(); }}
        onLoginSuccess={onLoginSuccess}
        title="Don't Lose Your Progress!"
        subtitle={`You've started ${completedChapters} chapter${completedChapters !== 1 ? 's' : ''}. Sign in to save and continue on any device.`}
      />
    )
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
      <div className="bg-[#0C1426] text-white px-4 sm:px-6 py-4 shadow-2xl border-t-2 border-secondary-400">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary-400/20 flex items-center justify-center flex-shrink-0">
              <Bookmark className="w-5 h-5 text-secondary-400" />
            </div>
            <div>
              <p className="font-semibold text-sm">
                Save your progress on {completedChapters} chapter{completedChapters !== 1 ? 's' : ''}?
              </p>
              <p className="text-xs text-white/60">
                10 seconds · free forever · no credit card · no spam
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setShowAuth(true)}
              className="flex-1 sm:flex-initial px-5 py-2 bg-secondary-400 text-dark-900 text-sm font-bold rounded-lg hover:bg-secondary-300 transition-colors"
            >
              Sign in
            </button>
            <button
              onClick={onDismiss}
              className="px-4 py-2 text-sm text-white/50 hover:text-white/80 transition-colors"
            >
              Later
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
