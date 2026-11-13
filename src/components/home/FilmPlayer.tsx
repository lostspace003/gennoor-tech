'use client'

import { useEffect, useRef, useState } from 'react'
import { Play, RotateCcw, VolumeX } from 'lucide-react'
import { useBoostedVolume } from '@/hooks/useBoostedVolume'
import PlayerBar from '@/components/media/PlayerBar'

/**
 * One of our short films, as the centre of a page.
 *
 * It starts by itself, without sound, when it comes into view (what is said is written
 * on the picture) and stops when it leaves.
 *
 * Two things are there for the visitor (owner, 13 November 2026: "just having that simple icon
 * can be good", and "we should be able to see the video slider ... the moment we hover over it"):
 *  - A round speaker button at the top left, with no words. It plays the film from the beginning
 *    with the voice and the music.
 *  - A bar at the foot with a slider to move through the film, play or pause, the sound, the time
 *    and full screen. It shows while the pointer is on the film, after a tap on a phone, while the
 *    film is paused, and whenever the keyboard is in it. It is out of the way otherwise, because the
 *    spoken words are written at the foot of the picture.
 *
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
  const box = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const hide = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [sound, setSound] = useState(false)      // the visitor asked for the voice and music
  const [muted, setMuted] = useState(true)
  const [playing, setPlaying] = useState(false)
  const [ended, setEnded] = useState(false)
  const [still, setStill] = useState(false)      // reduced motion, or the browser would not start it by itself
  const [stopped, setStopped] = useState(false)  // the visitor paused it: do not start it again by itself
  const [near, setNear] = useState(false)        // the pointer is on the film, or it was just tapped
  const [cur, setCur] = useState(0)
  const [dur, setDur] = useState(seconds || 0)
  const [full, setFull] = useState(false)
  const loud = useBoostedVolume(video)
  const stoppedRef = useRef(false)
  stoppedRef.current = stopped

  useEffect(() => {
    const v = video.current
    if (!v) return
    // The film can be ready before this runs: read where it really is, once
    if (v.readyState >= 1 && isFinite(v.duration)) setDur(v.duration)
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (calm.matches) { setStill(true); return }
    const watch = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { if (!stoppedRef.current) v.play().catch(() => setStill(true)) }
      else v.pause()
    }, { threshold: 0.4 })
    watch.observe(v)
    return () => watch.disconnect()
  }, [])

  useEffect(() => {
    const onFs = () => setFull(document.fullscreenElement === box.current)
    document.addEventListener('fullscreenchange', onFs)
    return () => { document.removeEventListener('fullscreenchange', onFs); if (hide.current) clearTimeout(hide.current) }
  }, [])

  /** From the beginning, with the voice and the music. */
  function withSound() {
    const v = video.current
    if (!v) return
    v.muted = false
    v.loop = false
    v.currentTime = 0
    loud.prime()
    setSound(true)
    setEnded(false)
    setStill(false)
    setStopped(false)
    v.play().catch(() => {})
  }

  function toggle() {
    const v = video.current
    if (!v) return
    if (v.paused) { setStopped(false); setEnded(false); v.play().catch(() => {}) }
    else { setStopped(true); v.pause() }
  }

  /** Sound on or off from the bar: where the film is now, not from the beginning. */
  function soundTo(off: boolean) {
    const v = video.current
    if (!v) return
    v.muted = off
    if (!off) { v.loop = false; loud.prime(); setSound(true) }
  }

  function seek(to: number) {
    const v = video.current
    if (!v) return
    v.currentTime = to
    setCur(to)
    setEnded(false)
  }

  // An iPhone cannot put a box full screen, only the video itself
  function fullScreen() {
    if (document.fullscreenElement) return void document.exitFullscreen()
    const v = video.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null
    if (box.current?.requestFullscreen) box.current.requestFullscreen().catch(() => {})
    else v?.webkitEnterFullscreen?.()
  }

  /** Show the bar now, and let it go a moment after the pointer stops (a phone has no "pointer left"). */
  function wake(stay = 2600) {
    setNear(true)
    if (hide.current) clearTimeout(hide.current)
    hide.current = setTimeout(() => setNear(false), stay)
  }

  const glow = tone === 'gold' ? 'shadow-[0_30px_80px_-24px_rgba(245,166,35,.55)]' : 'shadow-[0_30px_80px_-24px_rgba(10,108,255,.55)]'
  const button = tone === 'gold' ? 'bg-[#ffc24b] text-[#2a1a00] hover:bg-[#ffd06b]' : 'bg-[#fff] text-[#0b1220] hover:bg-[#e8f1ff]'
  const waiting = still && !playing && !sound   // nothing moves yet: one play button in the middle
  const barHidden = waiting || (!near && playing)

  return (
    <div
      ref={box}
      className={`st-keep relative aspect-video overflow-hidden rounded-[22px] bg-[#060914] ring-1 ring-white/15 ${glow} ${className}`}
      onPointerMove={() => wake()}
      onPointerLeave={(e) => { if (e.pointerType === 'mouse') { if (hide.current) clearTimeout(hide.current); setNear(false) } }}
    >
      <video
        ref={video}
        src={src}
        poster={poster}
        muted={muted}
        loop={!sound}
        playsInline
        preload="metadata"
        aria-label={title}
        className="absolute inset-0 h-full w-full object-cover"
        // A mouse click on the picture pauses or plays; a tap on a phone only brings the bar up
        onPointerUp={(e) => { if (waiting) return; if (e.pointerType === 'mouse') toggle(); else wake(3600) }}
        onLoadedMetadata={(e) => { if (isFinite(e.currentTarget.duration)) setDur(e.currentTarget.duration) }}
        onDurationChange={(e) => { if (isFinite(e.currentTarget.duration)) setDur(e.currentTarget.duration) }}
        onTimeUpdate={(e) => setCur(e.currentTarget.currentTime)}
        onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setEnded(true)}
      />

      {/* Without sound: one round button, no words. It sits at the top, clear of the words at the foot of the picture. */}
      {!sound && !waiting && (
        <button
          type="button"
          onClick={withSound}
          aria-label="Play with sound, from the beginning"
          title="Play with sound"
          className={`absolute left-2.5 top-2.5 sm:left-4 sm:top-4 grid h-10 w-10 sm:h-11 sm:w-11 place-items-center rounded-full shadow-lg transition-colors ${button}`}
        >
          <VolumeX className="h-[18px] w-[18px] sm:h-5 sm:w-5" aria-hidden="true" />
        </button>
      )}

      {waiting && (
        <button type="button" onClick={withSound} aria-label="Play the film" className={`absolute inset-0 m-auto grid h-16 w-16 place-items-center rounded-full shadow-lg transition-transform duration-200 hover:scale-105 ${button}`}>
          <Play className="h-7 w-7 fill-current ml-0.5" aria-hidden="true" />
        </button>
      )}

      {sound && ended && (
        <button type="button" onClick={withSound} className="absolute inset-0 flex items-center justify-center bg-black/55 text-[#fff]">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-3 text-[15px] font-semibold backdrop-blur hover:bg-white/25"><RotateCcw className="h-4 w-4" /> Watch it again</span>
        </button>
      )}

      <PlayerBar
        playing={playing} muted={muted} cur={cur} dur={dur} full={full} level={loud.level} max={loud.max}
        hidden={barHidden} strong
        onToggle={toggle} onSeek={seek} onLevel={loud.setLevel} onMuted={soundTo} onFull={fullScreen}
      />

      {transcript && <p className="sr-only">{title}. What the film says: {transcript}</p>}
    </div>
  )
}
