'use client'

import { useEffect, useRef, useState } from 'react'
import { Play, Pause, Volume2, Loader2 } from 'lucide-react'

interface ChapterAudioProps {
  courseSlug: string
  chapterNumber: number
  chapterTitle: string
  estimatedDuration: string
}

/**
 * Audio player for chapter narration.
 * Lazily requests audio from /api/speech/chapter/[slug]/[number] on first play.
 * Falls back to a friendly "audio unavailable" state if the API errors.
 */
export default function ChapterAudio({
  courseSlug,
  chapterNumber,
  chapterTitle,
  estimatedDuration,
}: ChapterAudioProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [state, setState] = useState<'idle' | 'loading' | 'playing' | 'paused' | 'error'>(
    'idle',
  )
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playbackRate, setPlaybackRate] = useState(1)
  const audioUrl = `/api/speech/chapter/${courseSlug}/${chapterNumber}`

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
      }
    }
  }, [])

  const togglePlay = async () => {
    if (state === 'error') return

    if (!audioRef.current) {
      const audio = new Audio()
      audio.preload = 'none'
      audioRef.current = audio

      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration)
      })
      audio.addEventListener('timeupdate', () => {
        setProgress(audio.currentTime)
      })
      audio.addEventListener('ended', () => {
        setState('paused')
        setProgress(0)
      })
      audio.addEventListener('error', () => {
        setState('error')
      })
    }

    const audio = audioRef.current
    if (state === 'playing') {
      audio.pause()
      setState('paused')
      return
    }

    // Starting fresh OR resuming
    if (!audio.src) {
      setState('loading')
      audio.src = audioUrl
      audio.playbackRate = playbackRate
    }

    try {
      await audio.play()
      setState('playing')
    } catch {
      setState('error')
    }
  }

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current || !duration) return
    const t = parseFloat(e.target.value)
    audioRef.current.currentTime = t
    setProgress(t)
  }

  const cycleSpeed = () => {
    const speeds = [1, 1.25, 1.5, 0.75]
    const idx = speeds.indexOf(playbackRate)
    const next = speeds[(idx + 1) % speeds.length]
    setPlaybackRate(next)
    if (audioRef.current) {
      audioRef.current.playbackRate = next
    }
  }

  const formatTime = (s: number): string => {
    if (!isFinite(s)) return '--:--'
    const mins = Math.floor(s / 60)
    const secs = Math.floor(s % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (state === 'error') {
    return (
      <div className="rounded-2xl p-4 bg-gray-50/80 border border-gray-200">
        <p className="text-xs text-gray-500 leading-relaxed">
          <strong className="text-gray-700">Audio narration</strong> — temporarily
          unavailable. The text below has the full chapter content.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl p-4 glass-card glow-border">
      <div className="flex items-center gap-3">
        {/* Play / Pause / Loading */}
        <button
          onClick={togglePlay}
          disabled={state === 'loading'}
          aria-label={
            state === 'playing'
              ? 'Pause chapter audio'
              : state === 'loading'
                ? 'Loading audio'
                : 'Play chapter audio'
          }
          className="flex-shrink-0 w-11 h-11 rounded-full bg-gradient-to-br from-primary-600 to-primary-700 text-white flex items-center justify-center shadow-lg shadow-primary-500/20 hover:shadow-glow-blue transition-all disabled:opacity-60"
        >
          {state === 'loading' ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : state === 'playing' ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 ml-0.5" />
          )}
        </button>

        {/* Title + progress */}
        <div className="flex-grow min-w-0">
          <div className="flex items-baseline justify-between gap-3 mb-1">
            <p className="text-xs font-bold tracking-widest text-primary-600 uppercase inline-flex items-center gap-1.5">
              <Volume2 className="w-3 h-3" /> Narration
            </p>
            <p className="text-xs text-gray-500 font-mono tabular-nums whitespace-nowrap">
              {duration > 0 ? (
                <>
                  {formatTime(progress)} / {formatTime(duration)}
                </>
              ) : (
                <>~ {estimatedDuration}</>
              )}
            </p>
          </div>
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={progress}
            onChange={seek}
            disabled={!duration}
            aria-label={`Audio progress for ${chapterTitle}`}
            className="w-full h-1.5 rounded-full bg-gray-200 accent-primary-600 cursor-pointer disabled:cursor-not-allowed"
          />
        </div>

        {/* Speed */}
        <button
          onClick={cycleSpeed}
          aria-label="Change playback speed"
          className="flex-shrink-0 px-2.5 py-1.5 text-xs font-bold text-gray-600 hover:text-primary-600 bg-gray-50 hover:bg-primary-50 border border-gray-200 hover:border-primary-200 rounded-lg transition-all tabular-nums"
        >
          {playbackRate}×
        </button>
      </div>
      {state === 'idle' && (
        <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">
          Click play to start narration. Generated fresh from Azure Speech the first time —
          cached after that for instant playback.
        </p>
      )}
    </div>
  )
}
