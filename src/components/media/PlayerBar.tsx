'use client'

import { Maximize, Minimize, Pause, Play } from 'lucide-react'
import VolumeControl from '@/components/media/VolumeControl'

export function clock(sec: number): string {
  if (!isFinite(sec) || sec < 0) sec = 0
  const s = Math.floor(sec)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

/**
 * The bar at the foot of our own video players: a slider to move through the video, play or pause,
 * the sound (0 to 200 percent), the time, and full screen.
 *
 * It draws only; the player that uses it owns the video and hands in what to show and what to do.
 * `hidden` fades it out (a film that plays by itself shows the bar only while the pointer is on it);
 * it stays reachable by keyboard, and comes back whenever the keyboard's focus is inside it.
 * It sits on video, so its colours are fixed: white on a dark fade, on both themes.
 */
export default function PlayerBar({
  playing, muted, cur, dur, full, level, max, hidden = false, strong = false,
  onToggle, onSeek, onLevel, onMuted, onFull,
}: {
  playing: boolean
  muted: boolean
  cur: number
  dur: number
  full: boolean
  /** 0 to 200: the loudness, from useBoostedVolume */
  level: number
  max: number
  hidden?: boolean
  /** A darker fade, for a film that has its spoken words written at the foot of the picture */
  strong?: boolean
  onToggle: () => void
  onSeek: (seconds: number) => void
  onLevel: (percent: number) => void
  onMuted: (muted: boolean) => void
  onFull: () => void
}) {
  return (
    <div
      className={`absolute inset-x-0 bottom-0 px-3 pb-2.5 pt-10 bg-gradient-to-t ${strong ? 'from-black from-40% via-black/80 to-transparent' : 'from-black/80 to-transparent'} text-[#fff] transition-opacity duration-200 [&:has(:focus-visible)]:opacity-100 [&:has(:focus-visible)]:pointer-events-auto ${hidden ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      <input
        type="range"
        min={0}
        max={dur || 1}
        step={0.1}
        disabled={!dur}
        value={dur ? Math.min(cur, dur) : 0}
        aria-label="Move through the video"
        aria-valuetext={`${clock(cur)} of ${clock(dur)}`}
        onChange={(e) => onSeek(Number(e.target.value))}
        className="block w-full h-1.5 accent-[#2f8bff] cursor-pointer"
      />
      <div className="flex items-center gap-1 mt-1.5">
        <button type="button" aria-label={playing ? 'Pause' : 'Play'} onClick={onToggle} className="w-9 h-9 rounded-md flex items-center justify-center hover:bg-white/15 transition-colors">
          {playing ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
        </button>
        <VolumeControl level={level} max={max} muted={muted} onLevel={onLevel} onMuted={onMuted} align="left" />
        <span className="text-[13px] tabular-nums px-1">{clock(cur)} <span className="text-white/60">/ {clock(dur)}</span></span>
        <span className="flex-1" />
        <button type="button" aria-label={full ? 'Exit full screen' : 'Full screen'} onClick={onFull} className="w-9 h-9 rounded-md flex items-center justify-center hover:bg-white/15 transition-colors">
          {full ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
        </button>
      </div>
    </div>
  )
}
