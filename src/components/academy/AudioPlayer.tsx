'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Play, Pause, Info, X } from 'lucide-react'

interface AudioPlayerProps {
  audioDir?: string
  currentSlide: number
  totalSlides: number
  stepsInSlide: number
  currentStepInSlide: number
  onSlideAudioEnd?: () => void
  onAdvanceStep?: () => void
  onResetSteps?: () => void
  onRevealAllSteps?: () => void
  transcriptText?: string
}

const SPEEDS = [1.0, 1.1, 1.2, 1.3]

export default function AudioPlayer({ audioDir, currentSlide, totalSlides, stepsInSlide, currentStepInSlide, onSlideAudioEnd, onAdvanceStep, onResetSteps, onRevealAllSteps, transcriptText }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [autoPlay, setAutoPlay] = useState(false)
  const [speedIndex, setSpeedIndex] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showInfo, setShowInfo] = useState(false)
  const [audioReady, setAudioReady] = useState(false)
  const prevSlideRef = useRef(currentSlide)
  const sentStepRef = useRef(0)
  const playWhenReadyRef = useRef<(() => void) | null>(null)

  if (!audioDir) return null

  const speed = SPEEDS[speedIndex]
  const slideAudioSrc = `/api/content${audioDir}/slide-${String(currentSlide).padStart(2, '0')}.mp3`

  // When slide changes, load new audio and play if in auto-play mode
  useEffect(() => {
    if (currentSlide === prevSlideRef.current) return
    prevSlideRef.current = currentSlide
    sentStepRef.current = 0

    const audio = audioRef.current
    if (!audio) return

    // Clean up any stale canplaythrough listener from previous slide
    if (playWhenReadyRef.current) {
      audio.removeEventListener('canplaythrough', playWhenReadyRef.current)
      playWhenReadyRef.current = null
    }

    setAudioReady(false)
    setCurrentTime(0)
    setDuration(0)
    audio.src = slideAudioSrc
    audio.playbackRate = SPEEDS[speedIndex]
    audio.load()

    if (autoPlay) {
      if (stepsInSlide > 0) onResetSteps?.()
      const playWhenReady = () => {
        setTimeout(() => { audio.play().catch(() => {}) }, 750)
        audio.removeEventListener('canplaythrough', playWhenReady)
        playWhenReadyRef.current = null
      }
      playWhenReadyRef.current = playWhenReady
      audio.addEventListener('canplaythrough', playWhenReady)
    } else {
      onRevealAllSteps?.()
    }
  }, [currentSlide, slideAudioSrc, autoPlay, speedIndex, stepsInSlide, onResetSteps, onRevealAllSteps])

  // Step timing: short intro (~8% or max 3s), then equal time per step
  const getStepTiming = useCallback((dur: number, steps: number) => {
    const introTime = Math.min(dur * 0.08, 3)
    const stepTime = (dur - introTime) / steps
    return { introTime, stepTime }
  }, [])

  const getExpectedStep = useCallback((time: number, dur: number, steps: number) => {
    if (steps === 0 || dur === 0) return 0
    const { introTime, stepTime } = getStepTiming(dur, steps)
    if (time < introTime) return 0
    return Math.min(Math.floor((time - introTime) / stepTime) + 1, steps)
  }, [getStepTiming])

  const getStepAudioTime = useCallback((step: number, dur: number, steps: number) => {
    if (step <= 0 || steps === 0) return 0
    const { introTime, stepTime } = getStepTiming(dur, steps)
    return introTime + (step - 1) * stepTime
  }, [getStepTiming])

  // Step auto-advance: advance content steps in sync with audio playback
  useEffect(() => {
    if (!isPlaying || stepsInSlide === 0 || duration === 0) return

    const checkSteps = () => {
      const audio = audioRef.current
      if (!audio) return

      const expectedStep = getExpectedStep(audio.currentTime, duration, stepsInSlide)

      while (sentStepRef.current < expectedStep) {
        sentStepRef.current++
        onAdvanceStep?.()
      }
    }

    const id = setInterval(checkSteps, 150)
    return () => clearInterval(id)
  }, [isPlaying, stepsInSlide, duration, onAdvanceStep, getExpectedStep])

  // User step sync: when user manually changes step, seek audio to match
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !duration || stepsInSlide === 0) return
    if (currentStepInSlide === sentStepRef.current) return

    audio.currentTime = Math.min(getStepAudioTime(currentStepInSlide, duration, stepsInSlide), duration - 0.1)
    sentStepRef.current = currentStepInSlide
  }, [currentStepInSlide, duration, stepsInSlide, getStepAudioTime])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
      setAutoPlay(false)
    } else {
      setAutoPlay(true)
      if (audio.currentTime === 0) {
        onResetSteps?.()
        sentStepRef.current = 0
      }
      audio.play().catch(() => {})
    }
  }, [isPlaying, onResetSteps])

  const cycleSpeed = useCallback(() => {
    const nextIndex = (speedIndex + 1) % SPEEDS.length
    setSpeedIndex(nextIndex)
    if (audioRef.current) {
      audioRef.current.playbackRate = SPEEDS[nextIndex]
    }
  }, [speedIndex])

  const handleEnded = useCallback(() => {
    setIsPlaying(false)
    if (autoPlay && onSlideAudioEnd) {
      setTimeout(() => onSlideAudioEnd(), 1500)
    }
  }, [autoPlay, onSlideAudioEnd])

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    if (!audio || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percent = x / rect.width
    audio.currentTime = percent * duration
  }, [duration])

  // Spacebar shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === 'Space' && document.activeElement?.tagName !== 'IFRAME') {
        e.preventDefault()
        togglePlay()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [togglePlay])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={slideAudioSrc}
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
        onLoadedMetadata={() => { setDuration(audioRef.current?.duration || 0); setAudioReady(true) }}
        onEnded={handleEnded}
        onError={() => setAudioReady(false)}
      />

      <div className="flex items-center gap-1.5 flex-shrink-0">
        {/* Play / Pause */}
        <button
          onClick={togglePlay}
          className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold transition-colors ${
            isPlaying
              ? 'bg-secondary-400 text-dark-900'
              : 'bg-white/10 hover:bg-white/20 text-white'
          }`}
          title={isPlaying ? 'Pause (Space)' : autoPlay ? 'Resume (Space)' : 'Play & auto-advance (Space)'}
        >
          {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          {isPlaying ? 'PAUSE' : 'PLAY'}
        </button>

        {/* Auto-play indicator */}
        {autoPlay && !isPlaying && (
          <span className="text-[10px] text-secondary-400 font-bold">AUTO</span>
        )}

        {/* Speed */}
        <button
          onClick={cycleSpeed}
          className="px-2 py-1 text-xs font-bold bg-white/10 hover:bg-white/20 rounded transition-colors"
          title="Cycle playback speed"
        >
          {speed.toFixed(1)}x
        </button>

        {/* Slide audio seek bar */}
        {audioReady && duration > 0 && (
          <div
            className="w-16 h-1.5 bg-white/20 rounded-full cursor-pointer group hidden sm:block"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-secondary-400 rounded-full transition-all"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
        )}

        {/* Info */}
        <div className="relative">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-1 rounded hover:bg-white/10 transition-colors"
            title="Controls info"
          >
            <Info className="w-3.5 h-3.5 text-white/60" />
          </button>
          {showInfo && (
            <div className="absolute right-0 top-full mt-1 w-56 bg-white text-gray-700 rounded-lg shadow-xl p-3 z-50 text-xs space-y-1.5">
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-gray-900">Audio Controls</span>
                <button onClick={() => setShowInfo(false)}><X className="w-3 h-3" /></button>
              </div>
              <p><kbd className="px-1 py-0.5 bg-gray-100 rounded text-[10px]">Space</kbd> Play / Pause</p>
              <p><kbd className="px-1 py-0.5 bg-gray-100 rounded text-[10px]">Speed</kbd> Cycle 1.0x to 1.3x</p>
              <p className="text-gray-500 pt-1 border-t border-gray-100">Audio narrates and auto-advances content steps. Navigate manually and audio stays in sync.</p>
            </div>
          )}
        </div>

        {/* Time */}
        {audioReady && duration > 0 && (
          <span className="text-[10px] text-white/40 hidden sm:inline">
            {formatTime(currentTime)}/{formatTime(duration)}
          </span>
        )}
      </div>
    </>
  )
}
