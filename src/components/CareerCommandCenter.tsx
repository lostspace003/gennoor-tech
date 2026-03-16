'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function CareerCommandCenter() {
  const [showPulse, setShowPulse] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowPulse(false), 15000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center">
      {/* Bouncing bot avatar */}
      <div className="animate-agent-bounce mb-1 drop-shadow-lg select-none pointer-events-none">
        <Image
          src="/logos/bot-avatar-48.png"
          alt="AI Career Coach"
          width={36}
          height={36}
          className="rounded-full"
        />
      </div>

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
        <Image
          src="/logos/bot-avatar-48.png"
          alt=""
          width={20}
          height={20}
          className="rounded-full"
        />
        <span className="text-sm font-semibold">AI Career Coach</span>
      </Link>
    </div>
  )
}
