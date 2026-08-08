'use client'

import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { Pause, Play, RotateCcw, RotateCw, Volume2, VolumeX } from 'lucide-react'

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
  /** Toggle play/pause. Used by Space-key handlers (parent + iframe). */
  togglePlay: () => void
  /** Relative time seek (VLC-style ±10s). */
  seekBy: (seconds: number) => void
  /** Re-post the authoritative deck state for the CURRENT audio position.
   *  Called by the parent whenever the chapter iframe (re)loads, so a deck
   *  that loaded after a seek/resume immediately shows the right slide
   *  instead of waiting for the next cue boundary. */
  resync: () => void
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
  /** Stable key under which to persist the audio resume position in
   *  localStorage — typically `${courseId}:${chapterId}`. When set, the
   *  player saves currentTime as it advances and restores it on next open. */
  resumeKey?: string
  /** Fired when the chapter narration reaches its natural end — the player
   *  uses this to raise the "Up next" overlay. */
  onEnded?: () => void
}

const SPEEDS = [1.0, 1.1, 1.2, 1.3]

function formatTime(t: number) {
  if (!Number.isFinite(t)) return '0:00'
  const m = Math.floor(t / 60)
  const s = Math.floor(t % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

/**
 * Parent-level player engine + control strip for the timestamp-fire pattern:
 * one MP3 per chapter plus a cues.json. Audio position is the single source
 * of truth — every cue advance posts down to the iframe, and every
 * user-driven seek additionally posts an authoritative apply-state so the
 * deck is correct in BOTH directions. The scrubber supports pointer-drag
 * scrubbing with live visual sync, exactly like a video player.
 */
const RESUME_PREFIX = 'gennoor:academy:resume:'
// Don't restore within this many seconds of the end — the user is effectively
// done, restoring at 99% just makes them re-finish.
const RESUME_TAIL_GUARD_SEC = 3
// Throttle saves on timeupdate so we don't write to localStorage every 250ms.
const RESUME_SAVE_INTERVAL_SEC = 5

const ChapterAudioControls = forwardRef<ChapterAudioControlsHandle, ChapterAudioControlsProps>(
  function ChapterAudioControls({ chapterAudio, chapterCues, iframeRef, resumeKey, onEnded }, ref) {
    const audioRef = useRef<HTMLAudioElement>(null)
    const [cues, setCues] = useState<Cue[]>([])
    const [isPlaying, setIsPlaying] = useState(false)
    const [speedIndex, setSpeedIndex] = useState(0)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [audioReady, setAudioReady] = useState(false)
    const [audioError, setAudioError] = useState(false)
    const [muted, setMuted] = useState(false)
    const [scrubbing, setScrubbing] = useState(false)
    const currentCueIdxRef = useRef(-1)
    const timelineRef = useRef<HTMLDivElement>(null)
    // Stores a seek target that couldn't be applied yet because the audio
    // wasn't loaded enough to seek. Re-applied in onCanPlay / onLoadedData.
    // Without this, slide-nav buttons clicked before the user hits Play
    // would silently fail to seek, and Play would then start from 0 —
    // making the iframe show e.g. slide 4 while audio plays slide 1.
    const pendingSeekRef = useRef<number | null>(null)
    const lastSaveAtRef = useRef(0)

    const applySeek = useCallback((timestamp: number) => {
      const audio = audioRef.current
      if (!audio || !Number.isFinite(timestamp)) {
        pendingSeekRef.current = timestamp
        return
      }
      // HAVE_METADATA (1) is enough for setting currentTime to take effect.
      // Below that, queue the seek for canplay.
      if (audio.readyState >= 1) {
        try {
          audio.currentTime = timestamp
          pendingSeekRef.current = null
        } catch {
          pendingSeekRef.current = timestamp
        }
      } else {
        pendingSeekRef.current = timestamp
      }
    }, [])

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

    /** Latest cue index at or before time t, or -1 when t precedes all cues. */
    const resolveCueIdx = useCallback((t: number) => {
      let idx = -1
      for (let i = 0; i < cues.length; i++) {
        if (cues[i].at <= t + 0.05) idx = i
        else break
      }
      return idx
    }, [cues])

    const postCue = useCallback((idx: number, userDriven = false) => {
      const iframe = iframeRef.current
      if (!iframe || !iframe.contentWindow) return
      const cue = cues[idx]
      if (!cue) return
      try {
        iframe.contentWindow.postMessage(
          { type: 'gennoor-academy:cue', slide: cue.slide, step: cue.step, at: cue.at, userDriven },
          '*',
        )
      } catch {}
    }, [cues, iframeRef])

    // Authoritative state for user-driven seeks: the injected script rebuilds
    // the exact slide/step state for this cue, correcting the built-in
    // adapter's forward-only reveals when the user moves BACKWARD. Idempotent
    // for forward moves. Sent after postCue so the adapter runs first.
    const postApplyState = useCallback((idx: number) => {
      const iframe = iframeRef.current
      if (!iframe || !iframe.contentWindow) return
      const cue = cues[idx]
      if (!cue) return
      try {
        iframe.contentWindow.postMessage(
          { type: 'gennoor-academy:apply-state', slide: cue.slide, step: cue.step ?? null },
          '*',
        )
      } catch {}
    }, [cues, iframeRef])

    /** Reset the deck to the very start (before the first cue). */
    const postDeckReset = useCallback(() => {
      try {
        iframeRef.current?.contentWindow?.postMessage(
          { type: 'gennoor-academy:apply-state', slide: 1, step: null },
          '*',
        )
      } catch {}
    }, [iframeRef])

    /** Push cue + authoritative state for the audio's CURRENT position.
     *  The one true "make the deck match the sound" primitive — used after
     *  resume seeks, on iframe (re)load, and after drag-scrubs. */
    const syncDeckToTime = useCallback((t: number) => {
      const idx = resolveCueIdx(t)
      currentCueIdxRef.current = idx
      if (idx >= 0) {
        postCue(idx)
        postApplyState(idx)
      } else if (cues.length > 0) {
        postDeckReset()
      }
    }, [resolveCueIdx, postCue, postApplyState, postDeckReset, cues.length])

    // After a user-driven seek, also start playback. Without this, manually
    // advancing while paused would seek silently and the user would still
    // need to hit Play before hearing the new slide's narration.
    const playAfterSeek = useCallback(() => {
      const audio = audioRef.current
      if (!audio) return
      if (!audio.paused) return
      const pending = pendingSeekRef.current
      if (pending !== null && audio.readyState < 1) {
        const onReady = () => {
          audio.removeEventListener('canplay', onReady)
          try {
            if (pendingSeekRef.current !== null) {
              audio.currentTime = pendingSeekRef.current
              pendingSeekRef.current = null
            }
          } catch {}
          audio.play().catch(() => {})
        }
        audio.addEventListener('canplay', onReady, { once: true })
        try { audio.load() } catch {}
        return
      }
      audio.play().catch(() => {})
    }, [])

    // Time-based seek shared by the scrubber, ±10s buttons, and keyboard.
    // Resolves the cue for the new position in EITHER direction and pushes
    // authoritative state — never waits for the forward-only timeupdate.
    const seekToTime = useCallback((t: number) => {
      const audio = audioRef.current
      if (!audio || !duration) return
      const clamped = Math.max(0, Math.min(duration, t))
      try { audio.currentTime = clamped } catch { pendingSeekRef.current = clamped }
      setCurrentTime(clamped)
      syncDeckToTime(clamped)
    }, [duration, syncDeckToTime])

    const seekBy = useCallback((seconds: number) => {
      const audio = audioRef.current
      if (!audio) return
      seekToTime(audio.currentTime + seconds)
    }, [seekToTime])

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
      applySeek(cue.at)
      setCurrentTime(cue.at)
      // Mirror the visual state down immediately — handles the paused case.
      // Do NOT mark userDriven: we want the same progressive reveal that
      // happens on auto-advance, so bullets fade in as the voice mentions
      // them rather than dumping the full slide at once.
      postCue(idx)
      postApplyState(idx)
      playAfterSeek()
    }, [cues, postCue, postApplyState, applySeek, playAfterSeek])

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
        let found = false
        for (let i = cur + 1; i < cues.length; i++) {
          if (cues[i].slide > curCue.slide && cues[i].step === undefined) { target = i; found = true; break }
        }
        // Already on the last slide — glide to the end of the narration so
        // the chapter finishes naturally (raising the Up-next overlay)
        // instead of the button silently doing nothing.
        if (!found && duration > 0) {
          seekToTime(Math.max(0, duration - 0.25))
          playAfterSeek()
          return
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
      applySeek(cue.at)
      setCurrentTime(cue.at)
      postCue(target)
      postApplyState(target)
      playAfterSeek()
    }, [cues, duration, seekToTime, postCue, postApplyState, applySeek, playAfterSeek])

    const togglePlay = useCallback(() => {
      const audio = audioRef.current
      if (!audio) return
      if (!audio.paused) { audio.pause(); return }

      // If we have a queued seek (slide-nav clicked before audio was loaded
      // enough to seek), apply it BEFORE play(). Without this, the audio
      // starts from 0 — playing slide-1 content even though the user
      // advanced past it.
      const pending = pendingSeekRef.current
      if (pending !== null) {
        if (audio.readyState >= 1) {
          try { audio.currentTime = pending; pendingSeekRef.current = null } catch {}
          audio.play().catch(() => {})
          return
        }
        const onReady = () => {
          audio.removeEventListener('canplay', onReady)
          try {
            if (pendingSeekRef.current !== null) {
              audio.currentTime = pendingSeekRef.current
              pendingSeekRef.current = null
            }
          } catch {}
          audio.play().catch(() => {})
        }
        audio.addEventListener('canplay', onReady, { once: true })
        try { audio.load() } catch {}
        return
      }
      audio.play().catch(() => {})
    }, [])

    const resync = useCallback(() => {
      const audio = audioRef.current
      if (!audio) return
      // A pending (not yet applied) seek is the truth if present.
      const t = pendingSeekRef.current ?? audio.currentTime
      syncDeckToTime(t)
    }, [syncDeckToTime])

    useImperativeHandle(
      ref,
      () => ({ seekToCue, step: stepNav, togglePlay, seekBy, resync }),
      [seekToCue, stepNav, togglePlay, seekBy, resync],
    )

    useEffect(() => {
      currentCueIdxRef.current = -1
      pendingSeekRef.current = null
      lastSaveAtRef.current = 0
      setCurrentTime(0)
      setDuration(0)
      setIsPlaying(false)
      setAudioReady(false)
      setAudioError(false)

      // Load saved resume position (if any) and queue it as a pending seek.
      // Applied on canplay/loadedmetadata via flushPendingSeek.
      if (typeof window !== 'undefined' && resumeKey) {
        try {
          const raw = window.localStorage.getItem(RESUME_PREFIX + resumeKey)
          if (raw) {
            const saved = Number.parseFloat(raw)
            if (Number.isFinite(saved) && saved > 1) pendingSeekRef.current = saved
          }
        } catch {}
      }
    }, [audioSrc, resumeKey])

    // Re-apply any pending seek when the audio becomes seekable, then bring
    // the DECK to the same position — restoring audio time without the
    // matching slide state was the visible "resume out of sync" glitch.
    const flushPendingSeek = useCallback(() => {
      const audio = audioRef.current
      if (!audio || pendingSeekRef.current === null) return
      try {
        const t = pendingSeekRef.current
        audio.currentTime = t
        pendingSeekRef.current = null
        setCurrentTime(t)
        syncDeckToTime(t)
      } catch {
        // try again on next ready event
      }
    }, [syncDeckToTime])

    useEffect(() => {
      if (audioRef.current) audioRef.current.playbackRate = SPEEDS[speedIndex]
    }, [speedIndex])

    useEffect(() => {
      if (audioRef.current) audioRef.current.muted = muted
    }, [muted])

    // Stop playback on unmount — a detached audio element otherwise keeps
    // narrating after the learner navigates away from the chapter.
    useEffect(() => {
      const audio = audioRef.current
      return () => { audio?.pause() }
    }, [])

    const saveResume = useCallback((t: number) => {
      if (typeof window === 'undefined' || !resumeKey) return
      try {
        if (t > 1 && (!duration || t < duration - RESUME_TAIL_GUARD_SEC)) {
          window.localStorage.setItem(RESUME_PREFIX + resumeKey, String(Math.floor(t)))
        }
      } catch {}
    }, [duration, resumeKey])

    const clearResume = useCallback(() => {
      if (typeof window === 'undefined' || !resumeKey) return
      try { window.localStorage.removeItem(RESUME_PREFIX + resumeKey) } catch {}
    }, [resumeKey])

    function handleTimeUpdate(e: React.SyntheticEvent<HTMLAudioElement>) {
      const t = e.currentTarget.currentTime
      // While the user is dragging the scrubber the drag position owns the
      // UI; don't fight it with stale timeupdates.
      if (!scrubbing) setCurrentTime(t)
      // Throttled resume save — every RESUME_SAVE_INTERVAL_SEC.
      if (t - lastSaveAtRef.current >= RESUME_SAVE_INTERVAL_SEC) {
        lastSaveAtRef.current = t
        saveResume(t)
      }
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

    // Save on tab hide / unload so a learner who closes the tab mid-chapter
    // resumes where they were, not at the last 5-second tick.
    useEffect(() => {
      if (typeof window === 'undefined' || !resumeKey) return
      const flush = () => {
        const audio = audioRef.current
        if (audio) saveResume(audio.currentTime)
      }
      const onVis = () => { if (document.visibilityState === 'hidden') flush() }
      window.addEventListener('pagehide', flush)
      document.addEventListener('visibilitychange', onVis)
      return () => {
        window.removeEventListener('pagehide', flush)
        document.removeEventListener('visibilitychange', onVis)
      }
    }, [resumeKey, saveResume])

    function cycleSpeed() { setSpeedIndex(prev => (prev + 1) % SPEEDS.length) }

    // ── Pointer-drag scrubbing ────────────────────────────────────────────
    // Live scrub like a video player: pointerdown seeks, dragging keeps
    // seeking, pointerup releases. Pointer capture keeps the drag alive
    // even when the cursor leaves the bar.
    const timeAtPointer = useCallback((clientX: number) => {
      const el = timelineRef.current
      if (!el || !duration) return null
      const rect = el.getBoundingClientRect()
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
      return ratio * duration
    }, [duration])

    const onScrubDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
      if (!duration) return
      e.preventDefault()
      try { e.currentTarget.setPointerCapture(e.pointerId) } catch {}
      setScrubbing(true)
      const t = timeAtPointer(e.clientX)
      if (t !== null) seekToTime(t)
    }, [duration, timeAtPointer, seekToTime])

    const onScrubMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
      if (!scrubbing) return
      const t = timeAtPointer(e.clientX)
      if (t !== null) seekToTime(t)
    }, [scrubbing, timeAtPointer, seekToTime])

    const onScrubUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
      if (!scrubbing) return
      try { e.currentTarget.releasePointerCapture(e.pointerId) } catch {}
      setScrubbing(false)
      const t = timeAtPointer(e.clientX)
      if (t !== null) {
        seekToTime(t)
        saveResume(t)
      }
    }, [scrubbing, timeAtPointer, seekToTime, saveResume])

    if (audioError) return null

    const speed = SPEEDS[speedIndex]
    const progressRatio = duration > 0 ? currentTime / duration : 0
    // Slide-start cue positions for the scrubber tick marks (skip slide 1 — it's the origin).
    const slideTicks = duration > 0
      ? cues.filter(c => c.step === undefined && c.slide > 1 && c.at < duration)
      : []

    return (
      <>
        <audio
          ref={audioRef}
          src={audioSrc}
          // 'auto' so the audio data is loaded ahead of any seek. With
          // 'metadata' some browsers silently drop currentTime assignments
          // until data arrives, which made slide-nav-then-play start from 0.
          preload="auto"
          onPlay={() => setIsPlaying(true)}
          onPause={e => { setIsPlaying(false); saveResume(e.currentTarget.currentTime) }}
          onLoadedMetadata={e => { setDuration(e.currentTarget.duration); setAudioReady(true); flushPendingSeek() }}
          onLoadedData={flushPendingSeek}
          onCanPlay={() => { setAudioReady(true); flushPendingSeek() }}
          onTimeUpdate={handleTimeUpdate}
          onError={() => setAudioError(true)}
          onEnded={() => { setIsPlaying(false); clearResume(); onEnded?.() }}
        />

        {/* Play / pause — the primary control */}
        <button
          onClick={togglePlay}
          disabled={!audioReady}
          className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
            audioReady
              ? 'bg-white text-gray-900 hover:bg-[#e8e8ed]'
              : 'bg-white/20 text-white/40 cursor-not-allowed'
          }`}
          title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>

        {/* ±10s */}
        <button
          onClick={() => seekBy(-10)}
          disabled={!audioReady}
          className="hidden min-[480px]:inline-flex p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors flex-shrink-0 disabled:opacity-30"
          title="Back 10 seconds (J)"
          aria-label="Back 10 seconds"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={() => seekBy(10)}
          disabled={!audioReady}
          className="hidden min-[480px]:inline-flex p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors flex-shrink-0 disabled:opacity-30"
          title="Forward 10 seconds (L)"
          aria-label="Forward 10 seconds"
        >
          <RotateCw className="w-4 h-4" />
        </button>

        {/* Timeline scrubber — continuous chapter timeline with slide ticks,
            drag-scrubbable with pointer capture */}
        <div
          ref={timelineRef}
          className="relative flex-1 min-w-[80px] h-6 flex items-center cursor-pointer group touch-none select-none"
          onPointerDown={onScrubDown}
          onPointerMove={onScrubMove}
          onPointerUp={onScrubUp}
          onPointerCancel={onScrubUp}
          title="Seek"
          role="slider"
          aria-label="Chapter timeline"
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
          aria-valuenow={Math.round(currentTime)}
          aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
        >
          <div className={`relative w-full ${scrubbing ? 'h-2.5' : 'h-1.5 group-hover:h-2.5'} bg-white/20 rounded-full transition-all`}>
            <div
              className="absolute inset-y-0 left-0 bg-primary-600 rounded-full"
              style={{ width: `${progressRatio * 100}%` }}
            />
            {slideTicks.map(c => (
              <span
                key={`${c.slide}-${c.at}`}
                className="absolute top-1/2 -translate-y-1/2 w-px h-full bg-white/50"
                style={{ left: `${(c.at / duration) * 100}%` }}
                title={`Slide ${c.slide}`}
              />
            ))}
            <span
              className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow transition-opacity ${
                scrubbing ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}
              style={{ left: `calc(${progressRatio * 100}% - 6px)` }}
            />
          </div>
        </div>

        <span className="hidden min-[420px]:inline text-[11px] text-white/60 tabular-nums flex-shrink-0">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>

        {/* Mute */}
        <button
          onClick={() => setMuted(m => !m)}
          className="hidden min-[380px]:inline-flex p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors flex-shrink-0"
          title={muted ? 'Unmute' : 'Mute'}
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <button
          onClick={cycleSpeed}
          className="hidden min-[480px]:inline-block px-2 py-1 text-[11px] font-bold bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors flex-shrink-0"
          title="Cycle playback speed"
        >
          {speed.toFixed(1)}x
        </button>
      </>
    )
  },
)

export default ChapterAudioControls
