'use client'

import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
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

export interface ChapterAudioControlsHandle {
  /** Seek the audio to the cue matching (slide, step?) and also post it down
   *  to the iframe so the visual updates even if audio is paused. */
  seekToCue: (slide: number, step?: number) => void
  /** Seek the audio relative to the current cue. Positive = forward N cues,
   *  negative = back N cues. Used when the parent toolbar's prev/next slide
   *  buttons fire without knowing the current state. */
  step: (direction: 'next-slide' | 'prev-slide' | 'next-step' | 'prev-step') => void
}

interface ChapterAudioControlsProps {
  /** Path under /api/content — e.g. /courses/<slug>/audio/chapter-01/chapter-01.mp3 */
  chapterAudio: string
  /** Path under /api/content — e.g. /courses/<slug>/audio/chapter-01/cues.json */
  chapterCues?: string
  /** Reference to the chapter <iframe> — used to postMessage cue events to it. */
  iframeRef: React.RefObject<HTMLIFrameElement | null> | React.MutableRefObject<HTMLIFrameElement | null>
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
 * Parent-level player for the timestamp-fire pattern.
 *
 * Loads one MP3 per chapter and a cues.json. Renders Play/Pause + speed +
 * scrubber in the parent ChapterViewer toolbar. Audio progression posts cues
 * down to the iframe so slides advance in sync. ChapterViewer holds a ref to
 * this component so its own slide-nav and iframe-nav events can seek the
 * audio — bidirectional sync.
 */
const ChapterAudioControls = forwardRef<ChapterAudioControlsHandle, ChapterAudioControlsProps>(
  function ChapterAudioControls({ chapterAudio, chapterCues, iframeRef }, ref) {
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
      return () => { cancelled = true }
    }, [cuesSrc])

    const postCue = useCallback((idx: number) => {
      const iframe = iframeRef.current
      if (!iframe || !iframe.contentWindow) return
      const cue = cues[idx]
      if (!cue) return
      try {
        iframe.contentWindow.postMessage(
          { type: 'gennoor-academy:cue', slide: cue.slide, step: cue.step, at: cue.at },
          '*',
        )
      } catch {}
    }, [cues, iframeRef])

    const seekToCue = useCallback((targetSlide: number, targetStep?: number) => {
      if (cues.length === 0) return
      // Exact match first
      let idx = -1
      for (let i = 0; i < cues.length; i++) {
        if (cues[i].slide === targetSlide && cues[i].step === targetStep) {
          idx = i
          break
        }
      }
      // If no exact match, prefer the slide-start cue for that slide
      if (idx < 0) {
        for (let i = 0; i < cues.length; i++) {
          if (cues[i].slide === targetSlide && cues[i].step === undefined) {
            idx = i
            break
          }
        }
      }
      // Still nothing? First cue of that slide
      if (idx < 0) {
        for (let i = 0; i < cues.length; i++) {
          if (cues[i].slide === targetSlide) { idx = i; break }
        }
      }
      if (idx < 0) return
      const cue = cues[idx]
      currentCueIdxRef.current = idx
      if (audioRef.current && Number.isFinite(cue.at)) {
        try { audioRef.current.currentTime = cue.at } catch {}
      }
      // Mirror the visual state down immediately — handles the paused case
      postCue(idx)
    }, [cues, postCue])

    const stepNav = useCallback((direction: 'next-slide' | 'prev-slide' | 'next-step' | 'prev-step') => {
      if (cues.length === 0) return
      let cur = currentCueIdxRef.current
      if (cur < 0) cur = 0
      let target = cur
      const curCue = cues[cur]
      if (!curCue) return
      if (direction === 'next-step') {
        target = Math.min(cues.length - 1, cur + 1)
      } else if (direction === 'prev-step') {
        target = Math.max(0, cur - 1)
      } else if (direction === 'next-slide') {
        for (let i = cur + 1; i < cues.length; i++) {
          if (cues[i].slide > curCue.slide && cues[i].step === undefined) { target = i; break }
        }
      } else if (direction === 'prev-slide') {
        // Mid-slide → return to current slide's start. Otherwise → prev slide's start.
        if (curCue.step !== undefined) {
          for (let i = cur - 1; i >= 0; i--) {
            if (cues[i].slide === curCue.slide && cues[i].step === undefined) { target = i; break }
          }
        } else {
          for (let j = cur - 1; j >= 0; j--) {
            if (cues[j].slide < curCue.slide && cues[j].step === undefined) { target = j; break }
          }
        }
      }
      if (target === cur) return
      const cue = cues[target]
      currentCueIdxRef.current = target
      if (audioRef.current && Number.isFinite(cue.at)) {
        try { audioRef.current.currentTime = cue.at } catch {}
      }
      postCue(target)
    }, [cues, postCue])

    useImperativeHandle(ref, () => ({ seekToCue, step: stepNav }), [seekToCue, stepNav])

    useEffect(() => {
      currentCueIdxRef.current = -1
      setCurrentTime(0)
      setDuration(0)
      setIsPlaying(false)
      setAudioReady(false)
      setAudioError(false)
    }, [audioSrc])

    useEffect(() => {
      if (audioRef.current) audioRef.current.playbackRate = SPEEDS[speedIndex]
    }, [speedIndex])

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

    function cycleSpeed() { setSpeedIndex(prev => (prev + 1) % SPEEDS.length) }

    function handleSeek(e: React.MouseEvent<HTMLDivElement>) {
      const audio = audioRef.current
      if (!audio || !duration) return
      const rect = e.currentTarget.getBoundingClientRect()
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
      audio.currentTime = ratio * duration
      currentCueIdxRef.current = -1
    }

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

        <button
          onClick={cycleSpeed}
          className="px-2 py-1 text-xs font-bold bg-white/10 hover:bg-white/20 rounded transition-colors"
          title="Cycle playback speed"
        >
          {speed.toFixed(1)}x
        </button>

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

        {audioReady && duration > 0 && (
          <span className="text-[10px] text-white/40 hidden sm:inline tabular-nums">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        )}
      </>
    )
  },
)

export default ChapterAudioControls
