'use client'

import { useEffect, useRef, useState } from 'react'
import { Maximize, Minimize, Pause, Play, Volume2, VolumeX } from 'lucide-react'

function fmt(sec: number): string {
  if (!isFinite(sec) || sec < 0) sec = 0
  const s = Math.floor(sec)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

/**
 * Course promo: starts by itself as the page opens (muted, as browsers require)
 * with an always-visible control bar: play or pause, time, seek, sound, full screen.
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
    <div ref={boxRef} className={`relative aspect-video overflow-hidden bg-black ${framed ? 'rounded-2xl shadow-[0_30px_60px_-20px_rgba(0,0,0,.6)] ring-1 ring-white/10' : ''}`}>
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

      {muted && playing && (
        <button
          type="button"
          onClick={() => { const v = ref.current; if (v) { v.muted = false; v.volume = 1 } }}
          className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-black/60 backdrop-blur px-4 py-2 text-[13px] font-semibold text-white hover:bg-black/75 transition-colors"
        >
          <Volume2 className="w-4 h-4" /> Turn on sound
        </button>
      )}

      {!playing && (
        <button type="button" onClick={toggle} aria-label="Play" className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30 hover:scale-105 transition duration-200">
          <Play className="w-7 h-7 text-white fill-white ml-0.5" />
        </button>
      )}

      <div className="absolute inset-x-0 bottom-0 px-3 pb-2.5 pt-10 bg-gradient-to-t from-black/80 to-transparent text-white">
        <input
          type="range"
          min={0}
          max={dur || 1}
          step={0.1}
          disabled={!dur}
          value={dur ? Math.min(cur, dur) : 0}
          aria-label="Seek"
          onChange={e => { const v = ref.current; if (v) { v.currentTime = Number(e.target.value); setCur(v.currentTime) } }}
          className="w-full h-1 accent-[#2f8bff] cursor-pointer"
        />
        <div className="flex items-center gap-1 mt-1.5">
          <button type="button" aria-label={playing ? 'Pause' : 'Play'} onClick={toggle} className="w-9 h-9 rounded-md flex items-center justify-center hover:bg-white/15 transition-colors">
            {playing ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
          </button>
          <button
            type="button"
            aria-label={muted ? 'Unmute' : 'Mute'}
            onClick={() => { const v = ref.current; if (v) { v.muted = !v.muted; if (!v.muted && v.volume === 0) v.volume = 1 } }}
            className="w-9 h-9 rounded-md flex items-center justify-center hover:bg-white/15 transition-colors"
          >
            {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <span className="text-[13px] tabular-nums px-1">{fmt(cur)} <span className="text-white/60">/ {fmt(dur)}</span></span>
          <span className="flex-1" />
          <button
            type="button"
            aria-label={full ? 'Exit full screen' : 'Full screen'}
            onClick={fullScreen}
            className="w-9 h-9 rounded-md flex items-center justify-center hover:bg-white/15 transition-colors"
          >
            {full ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  )
}
