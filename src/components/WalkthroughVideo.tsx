'use client'

import { useRef, useState } from 'react'

const VIDEO = '/videos/learning-studio-walkthrough.mp4'
const POSTER = '/videos/learning-studio-walkthrough-poster.jpg'

/** The Learning Studio walkthrough: the title card shows first, the video starts on click. */
export default function WalkthroughVideo({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [started, setStarted] = useState(false)

  function start() {
    setStarted(true)
    const v = ref.current
    if (v) { v.controls = true; void v.play() }
  }

  return (
    <div className={`relative overflow-hidden rounded-[20px] bg-[#0b1220] shadow-[0_18px_50px_rgba(11,18,32,0.25)] aspect-video ${className}`}>
      <video
        ref={ref}
        src={VIDEO}
        poster={POSTER}
        preload="none"
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        aria-label="How to use the Gennoor Learning Studio"
      />
      {!started && (
        <button
          type="button"
          onClick={start}
          aria-label="Play the Learning Studio walkthrough"
          className="absolute inset-0 group"
        >
          <span className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 flex items-center gap-3 rounded-full bg-white/95 py-2.5 pl-3 pr-5 shadow-xl transition-transform group-hover:scale-105">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0071e3]">
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="#fff" /></svg>
            </span>
            <span className="text-[15px] font-semibold text-gray-900">Watch · 8 min</span>
          </span>
        </button>
      )}
    </div>
  )
}
