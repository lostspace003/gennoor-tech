'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Pause, Play } from 'lucide-react'

interface Cue {
  at: number
  slide: number
  step?: number
  label?: string
}

interface CuesDoc {
  cues: Cue[]
  expectedDurationSeconds?: number
}

interface ChapterAudioControlsProps {
  /** Path under /api/content — e.g. /courses/<slug>/audio/chapter-01/chapter-01.mp3 */
  chapterAudio: string
  /** Path under /api/content — e.g. /courses/<slug>/audio/chapter-01/cues.json */
  chapterCues?: string
  /** Reference to the chapter <iframe> — used to postMessage cue events to it. */
  iframeRef: React.RefObject<HTMLIFrameElement | null>
  /** Total slides — used for the scrubber's segment markers. Optional. */
  totalSlides?: number
}

const SPEEDS = [1.0, 1.1, 1.2, 1.3]

function formatTime(t: number) {
  if (!Number.isFinite(t)) return '0:00'
  const m = Math.floor(t / 60)
  const s = Math.floor(t % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

/**
 * Lightweight player for the timestamp-fire pattern.
 *
 * Loads one MP3 per chapter and a cues.json. Renders Play / Pause and a scrubber
 * in the parent ChapterViewer toolbar. On timeupdate it advances through cues
 * and postMessages each transition to the embedded chapter HTML iframe, which
 * applies the cue (show slide N, reveal step K). The iframe also hides its own
 * in-iframe Play button when it detects it's embedded — so the user sees one
 * Play button only.
 */
export default function ChapterAudioControls({
  chapterAudio,
  chapterCues,
  iframeRef,
}: ChapterAudioControlsProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [cues, setCues] = useState<Cue[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [speedIndex, setSpeedIndex] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [audioReady, setAudioReady] = useState(false)
  const [audioError, setAudioError] = useState(false)
  const currentCueIdxRef = useRef(-1)

  const audioSrc = useMemo(() => `/api/content${chapterAudio}`, [chapterAudio])
  const cuesSrc = useMemo(() => (chapterCues ? `/api/content${chapterCues}` : null), [chapterCues])

  // Load cues.json once per chapter
  useEffect(() => {
    if (!cuesSrc) return
    let cancelled = false
    fetch(cuesSrc)
      .then(r => (r.ok ? r.json() as Promise<CuesDoc> : Promise.reject(new Error('cues fetch failed'))))
      .then(doc => {
        if (cancelled) return
        if (Array.isArray(doc?.cues)) setCues(doc.cues)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [cuesSrc])

  // Post the current cue to the iframe when it changes
  const postCue = useCallback((idx: number) => {
    const iframe = iframeRef.current
    if (!iframe || !iframe.contentWindow) return
    const cue = cues[idx]
    if (!cue) return
    iframe.contentWindow.postMessage(
      {
        type: 'gennoor-academy:cue',
        slide: cue.slide,
        step: cue.step,
        at: cue.at,
      },
      '*',
    )
  }, [cues, iframeRef])

  // Reset audio + cue index when source changes (new chapter)
  useEffect(() => {
    currentCueIdxRef.current = -1
    setCurrentTime(0)
    setDuration(0)
    setIsPlaying(false)
    setAudioReady(false)
    setAudioError(false)
  }, [audioSrc])

  // Sync speed
  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = SPEEDS[speedIndex]
  }, [speedIndex])

  // timeupdate handler — find latest cue whose at <= currentTime and post it
  function handleTimeUpdate(e: React.SyntheticEvent<HTMLAudioElement>) {
    const t = e.currentTarget.currentTime
    setCurrentTime(t)
    if (cues.length === 0) return
    let target = currentCueIdxRef.current
    for (let i = Math.max(0, target + 1); i < cues.length; i++) {
      if (cues[i].at <= t + 0.05) target = i
      else break
    }
    if (target > currentCueIdxRef.current) {
      currentCueIdxRef.current = target
      postCue(target)
    }
  }

  function togglePlay() {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) audio.play().catch(() => {})
    else audio.pause()
  }

  function cycleSpeed() {
    setSpeedIndex(prev => (prev + 1) % SPEEDS.length)
  }

  function handleSeek(e: React.MouseEvent<HTMLDivElement>) {
    const audio = audioRef.current
    if (!audio || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    audio.currentTime = ratio * duration
    // Reset cue index so we re-evaluate on the next timeupdate
    currentCueIdxRef.current = -1
  }

  // If audio failed to load, render nothing — keep the toolbar clean.
  if (audioError) return null

  const speed = SPEEDS[speedIndex]

  return (
    <>
      <audio
        ref={audioRef}
        src={audioSrc}
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onLoadedMetadata={e => { setDuration(e.currentTarget.duration); setAudioReady(true) }}
        onCanPlay={() => setAudioReady(true)}
        onTimeUpdate={handleTimeUpdate}
        onError={() => setAudioError(true)}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Play / Pause */}
      <button
        onClick={togglePlay}
        disabled={!audioReady}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-colors ${
          isPlaying
            ? 'bg-secondary-400 text-dark-900'
            : audioReady
              ? 'bg-white/10 hover:bg-white/20 text-white'
              : 'bg-white/5 text-white/40 cursor-not-allowed'
        }`}
        title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
      >
        {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        {isPlaying ? 'PAUSE' : audioReady ? 'PLAY' : '…'}
      </button>

      {/* Speed */}
      <button
        onClick={cycleSpeed}
        className="px-2 py-1 text-xs font-bold bg-white/10 hover:bg-white/20 rounded transition-colors"
        title="Cycle playback speed"
      >
        {speed.toFixed(1)}x
      </button>

      {/* Scrubber */}
      {audioReady && duration > 0 && (
        <div
          className="w-32 h-1.5 bg-white/20 rounded-full cursor-pointer hidden sm:block"
          onClick={handleSeek}
        >
          <div
            className="h-full bg-secondary-400 rounded-full transition-all"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>
      )}

      {/* Time */}
      {audioReady && duration > 0 && (
        <span className="text-[10px] text-white/40 hidden sm:inline tabular-nums">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      )}
    </>
  )
}
