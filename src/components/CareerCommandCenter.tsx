'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CareerCommandCenter() {
  const [showPulse, setShowPulse] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowPulse(false), 15000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center">
      {/* Bouncing agent emoji */}
      <span className="animate-agent-bounce text-2xl mb-1 drop-shadow-lg select-none pointer-events-none">
        🤖
      </span>

      {/* Main button with glow */}
      <Link
        href="/career-coach"
        onClick={() => setShowPulse(false)}
        className="relative flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-600 to-accent-600 px-5 py-3 text-white shadow-2xl transition-all duration-300 hover:scale-105 animate-glow-pulse"
        aria-label="Open Career Command Center"
      >
        {showPulse && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary-400 opacity-75" />
            <span className="relative inline-flex h-4 w-4 rounded-full bg-secondary-500" />
          </span>
        )}
        <span className="h-5 w-5 animate-spin-slow flex items-center justify-center">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </span>
        <span className="text-sm font-semibold">AI Career Coach</span>
      </Link>
    </div>
  )
}
