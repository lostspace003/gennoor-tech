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
 *  - A small round speaker button in the top right corner, with no words. It plays the film from the
 *    beginning with the voice and the music. (Top right since 14 November 2026: every button on a video
 *    of ours is there, small and quiet. It was a larger white or yellow button at the top left.)
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

  // A soft glow under the film, not a bright one (owner, 14 November 2026: "too much flashy")
  const glow = tone === 'gold' ? 'shadow-[0_26px_70px_-28px_rgba(245,166,35,.32)]' : 'shadow-[0_26px_70px_-28px_rgba(10,108,255,.32)]'
  // The one button of every video (st-play in src/styles/stage.css): small, quiet, top right
  const button = tone === 'gold' ? 'st-play st-gold' : 'st-play'
  const waiting = still && !playing && !sound   // nothing moves yet: the same button plays it, and so does the picture
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

      {/* Without sound: one small round button, no words, in the top right corner like every button on a video.
          The top, because the words of the film and its slider are at the foot of the picture. */}
      {!sound && !waiting && (
        <button type="button" onClick={withSound} aria-label="Play with sound, from the beginning" title="Play with sound" className={button}>
          <VolumeX aria-hidden="true" />
        </button>
      )}

      {/* Nothing moves yet: the whole picture plays it, and the same small button says so */}
      {waiting && (
        <button type="button" onClick={withSound} aria-label="Play the film" className="absolute inset-0">
          <span className={button}><Play className="fill-current ml-px" aria-hidden="true" /></span>
        </button>
      )}

      {sound && ended && (
        <button type="button" onClick={withSound} className="absolute inset-0 bg-black/55">
          <span className={button}><RotateCcw aria-hidden="true" /> Watch it again</span>
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
