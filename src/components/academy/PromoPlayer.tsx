'use client'

import { useEffect, useRef, useState } from 'react'
import { Play, VolumeX } from 'lucide-react'
import { useBoostedVolume } from '@/hooks/useBoostedVolume'
import PlayerBar from '@/components/media/PlayerBar'

/**
 * Course promo: starts by itself as the page opens (muted, as browsers require)
 * with an always-visible control bar (components/media/PlayerBar): a slider to move through it, play or pause, sound (0 to 200 percent), the time, full screen.
 * framed={false} drops the rounded frame and shadow so it fills a course card's picture area.
 */
export default function PromoPlayer({ src, poster, startMuted = true, framed = true, autoPlay = true, resumeKey }: { src: string; poster?: string | null; startMuted?: boolean; framed?: boolean; autoPlay?: boolean; resumeKey?: string }) {
  const boxRef = useRef<HTMLDivElement>(null)
  const ref = useRef<HTMLVideoElement>(null)
  const lastSaved = useRef(0)

  // resumeKey: the same promo opened from a card popup and from its course page continues from where it stopped (kept in this browser only)
  useEffect(() => {
    const v = ref.current
    if (!v || !resumeKey) return
    try {
      const t = parseFloat(localStorage.getItem(`promo:${resumeKey}`) || '0')
      if (t > 1) {
        const seek = () => { if (isFinite(v.duration) && t < v.duration - 3) v.currentTime = t }
        if (v.readyState >= 1) seek()
        else v.addEventListener('loadedmetadata', seek, { once: true })
      }
    } catch { /* storage blocked: start from the beginning */ }
  }, [resumeKey])
  const savePos = (t: number, ended = false) => {
    if (!resumeKey) return
    try {
      if (ended) localStorage.removeItem(`promo:${resumeKey}`)
      else if (Math.abs(t - lastSaved.current) > 2) { localStorage.setItem(`promo:${resumeKey}`, String(t)); lastSaved.current = t }
    } catch { /* ignore */ }
  }
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(autoPlay && startMuted)
  const [cur, setCur] = useState(0)
  const [dur, setDur] = useState(0)
  const [full, setFull] = useState(false)
  const loud = useBoostedVolume(ref)
  const soundTo = (off: boolean) => {
    const v = ref.current
    if (!v) return
    v.muted = off
    if (!off) loud.prime()
  }

  // The video can finish loading before this component hydrates, so its events are missed:
  // read the real state once on mount, then keep it in step with the events below.
  useEffect(() => {
    const v = ref.current
    if (!v) return
    if (v.readyState >= 1 && isFinite(v.duration)) setDur(v.duration)
    setCur(v.currentTime)
    setPlaying(!v.paused)
    setMuted(v.muted)
  }, [])

  useEffect(() => {
    const onFs = () => setFull(document.fullscreenElement === boxRef.current)
    document.addEventListener('fullscreenchange', onFs)
    return () => document.removeEventListener('fullscreenchange', onFs)
  }, [])

  const toggle = () => {
    const v = ref.current
    if (!v) return
    if (v.paused) v.play().catch(() => {})
    else v.pause()
  }

  // iPhone Safari can't put a div full screen, only the video itself.
  const fullScreen = () => {
    if (document.fullscreenElement) return void document.exitFullscreen()
    const box = boxRef.current
    const v = ref.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null
    if (box?.requestFullscreen) box.requestFullscreen().catch(() => {})
    else v?.webkitEnterFullscreen?.()
  }

  return (
    <div ref={boxRef} className={`st-keep relative aspect-video overflow-hidden bg-black ${framed ? 'rounded-2xl shadow-[0_30px_60px_-20px_rgba(0,0,0,.6)] ring-1 ring-white/10' : ''}`}>
      <video
        ref={ref}
        src={src}
        poster={poster || undefined}
        autoPlay={autoPlay}
        muted={autoPlay && startMuted}
        playsInline
        preload={autoPlay ? 'auto' : 'metadata'}
        disablePictureInPicture
        className="w-full h-full"
        onClick={toggle}
        onLoadedMetadata={e => setDur(e.currentTarget.duration)}
        onDurationChange={e => { if (isFinite(e.currentTarget.duration)) setDur(e.currentTarget.duration) }}
        onCanPlay={e => { if (isFinite(e.currentTarget.duration)) setDur(e.currentTarget.duration) }}
        onTimeUpdate={e => { setCur(e.currentTarget.currentTime); savePos(e.currentTarget.currentTime) }}
        onEnded={() => savePos(0, true)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onVolumeChange={e => setMuted(e.currentTarget.muted)}
      />

      {/* Playing without sound: one round button, no words (owner, 13 November 2026) */}
      {muted && playing && (
        <button
          type="button"
          onClick={() => soundTo(false)}
          aria-label="Turn on the sound"
          title="Turn on the sound"
          className="absolute left-3 top-3 sm:left-4 sm:top-4 grid h-10 w-10 place-items-center rounded-full bg-black/60 backdrop-blur text-[#fff] hover:bg-black/75 transition-colors"
        >
          <VolumeX className="w-[18px] h-[18px]" aria-hidden="true" />
        </button>
      )}

      {!playing && (
        <button type="button" onClick={toggle} aria-label="Play" className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30 hover:scale-105 transition duration-200">
          <Play className="w-7 h-7 text-white fill-white ml-0.5" />
        </button>
      )}

      <PlayerBar
        playing={playing} muted={muted} cur={cur} dur={dur} full={full} level={loud.level} max={loud.max}
        onToggle={toggle}
        onSeek={(to) => { const v = ref.current; if (v) { v.currentTime = to; setCur(v.currentTime) } }}
        onLevel={loud.setLevel} onMuted={soundTo} onFull={fullScreen}
      />
    </div>
  )
}
