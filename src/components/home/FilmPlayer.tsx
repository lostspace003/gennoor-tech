'use client'

import { useEffect, useRef, useState } from 'react'
import { Play, RotateCcw, Volume2 } from 'lucide-react'

/**
 * One of our short films, as the centre of a page.
 *
 * It starts by itself, without sound, when it comes into view (what is said is written
 * on the picture) and stops when it leaves. "Play with sound" starts it again from the
 * beginning with the voice and the music, and gives the visitor the usual controls.
 * Visitors who ask their device for less motion get the still picture and a play button.
 * The words of the film are also on the page for screen readers.
 */
export default function FilmPlayer({ src, poster, title, transcript, seconds, tone = 'blue', className = '' }: {
  src: string
  poster: string
  title: string
  transcript?: string
  seconds?: number
  tone?: 'blue' | 'gold'
  className?: string
}) {
  const video = useRef<HTMLVideoElement>(null)
  const [sound, setSound] = useState(false)      // the visitor asked for the voice and music
  const [playing, setPlaying] = useState(false)
  const [ended, setEnded] = useState(false)
  const [still, setStill] = useState(false)      // reduced motion, or the browser would not start it by itself

  useEffect(() => {
    const v = video.current
    if (!v) return
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (calm.matches) { setStill(true); return }
    const watch = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) v.play().catch(() => setStill(true))
      else v.pause()
    }, { threshold: 0.4 })
    watch.observe(v)
    return () => watch.disconnect()
  }, [])

  function withSound() {
    const v = video.current
    if (!v) return
    v.muted = false
    v.loop = false
    v.currentTime = 0
    v.controls = true
    setSound(true)
    setEnded(false)
    setStill(false)
    v.play().catch(() => {})
  }

  const length = seconds ? `${Math.floor(seconds / 60)}:${String(Math.round(seconds % 60)).padStart(2, '0')}` : ''
  const glow = tone === 'gold' ? 'shadow-[0_30px_80px_-24px_rgba(245,166,35,.55)]' : 'shadow-[0_30px_80px_-24px_rgba(10,108,255,.55)]'
  const button = tone === 'gold' ? 'bg-[#ffc24b] text-[#2a1a00] hover:bg-[#ffd06b]' : 'bg-[#fff] text-[#0b1220] hover:bg-[#e8f1ff]'

  return (
    <div className={`relative aspect-video overflow-hidden rounded-[22px] bg-[#060914] ring-1 ring-white/15 ${glow} ${className}`}>
      <video
        ref={video}
        src={src}
        poster={poster}
        muted={!sound}
        loop={!sound}
        playsInline
        preload="metadata"
        aria-label={title}
        className="absolute inset-0 h-full w-full object-cover"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setEnded(true)}
      />
      {/* Without sound: one clear way to hear it. It sits at the top, clear of the words at the foot of the picture. */}
      {!sound && (
        <button
          type="button"
          onClick={withSound}
          className={`absolute left-2.5 top-2.5 sm:left-4 sm:top-4 inline-flex items-center gap-1.5 sm:gap-2 rounded-full px-3 py-1.5 sm:px-4 sm:py-2.5 text-[12.5px] sm:text-[14px] font-semibold shadow-lg transition-colors ${button}`}
        >
          {still && !playing ? <Play className="h-4 w-4 fill-current" /> : <Volume2 className="h-4 w-4" />}
          {still && !playing ? 'Play the film' : 'Play with sound'}
          {length && <span className="font-normal opacity-70">{length}</span>}
        </button>
      )}
      {sound && ended && (
        <button type="button" onClick={withSound} className="absolute inset-0 flex items-center justify-center bg-black/55 text-white">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-3 text-[15px] font-semibold backdrop-blur hover:bg-white/25"><RotateCcw className="h-4 w-4" /> Watch it again</span>
        </button>
      )}
      {transcript && <p className="sr-only">{title}. What the film says: {transcript}</p>}
    </div>
  )
}
