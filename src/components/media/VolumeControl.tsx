'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { Volume1, Volume2, VolumeX } from 'lucide-react'

/**
 * The sound button of every video player on the site.
 *
 *  - Pointing at it shows the level, small ("120%").
 *  - Pressing it opens a slider from 0 to 200 percent (or to 100 where the video cannot be
 *    made louder). It does not mute: sliding to 0, or the small button beside the slider, does.
 *  - Pressing it while the sound is off turns the sound on, because that is what was meant.
 *
 * The level itself comes from `useBoostedVolume`; whether the sound is on is the player's own
 * business (some players start without sound), so both are handed in.
 * It sits on video, so its colours are fixed: white on near-black, on both themes.
 */
export default function VolumeControl({
  level, max, muted, onLevel, onMuted, label, name = 'Volume',
  buttonClassName = 'w-9 h-9 rounded-md flex items-center justify-center hover:bg-white/15 transition-colors',
  iconClassName = 'w-5 h-5', align = 'center', className = '',
}: {
  /** 0 to 200 */
  level: number
  /** 200, or 100 when this video cannot be made louder */
  max: number
  muted: boolean
  onLevel: (percent: number) => void
  onMuted: (muted: boolean) => void
  /** A word shown beside the icon ("Voice") */
  label?: string
  /** What the slider is called for a screen reader */
  name?: string
  buttonClassName?: string
  iconClassName?: string
  /** Which edge of the button the slider lines up with */
  align?: 'left' | 'center' | 'right'
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const [near, setNear] = useState(false)
  const box = useRef<HTMLSpanElement>(null)
  const leaving = useRef<ReturnType<typeof setTimeout> | null>(null)
  const id = useId()

  const silent = muted || level === 0
  const shown = muted ? 0 : level
  const Icon = silent ? VolumeX : shown < 60 ? Volume1 : Volume2

  // Closes when the listener presses anywhere else, or Escape
  useEffect(() => {
    if (!open) return
    const away = (e: PointerEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false) }
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('pointerdown', away)
    document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('pointerdown', away); document.removeEventListener('keydown', esc) }
  }, [open])
  useEffect(() => () => { if (leaving.current) clearTimeout(leaving.current) }, [])

  /** Sound that is off comes back at the level it had, or at 100 when it was slid down to nothing. */
  const soundOn = () => {
    if (level === 0) onLevel(100)
    if (muted) onMuted(false)
  }
  const press = () => {
    if (!open && silent) soundOn()
    setOpen((o) => !o)
  }
  const slide = (percent: number) => {
    onLevel(percent)
    if (percent > 0 && muted) onMuted(false)
    if (percent === 0 && !muted) onMuted(true)
  }
  const side = align === 'left' ? 'left-0' : align === 'right' ? 'right-0' : 'left-1/2 -translate-x-1/2'

  return (
    <span
      ref={box}
      className={`relative inline-flex ${className}`}
      onPointerEnter={() => { if (leaving.current) clearTimeout(leaving.current); setNear(true) }}
      onPointerLeave={() => { setNear(false); if (open) leaving.current = setTimeout(() => setOpen(false), 1600) }}
      // A key pressed on the slider must not also drive the player (arrows skip, space pauses)
      onKeyDown={(e) => { if (open) e.stopPropagation() }}
    >
      <button
        type="button"
        onClick={press}
        aria-label={`${name}: ${silent ? 'off' : `${shown} percent`}. Press to change it.`}
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        className={buttonClassName}
      >
        <Icon className={iconClassName} aria-hidden="true" />
        {label && <span>{label}</span>}
      </button>

      {/* The level, small, while the pointer is on the button */}
      {near && !open && (
        <span className={`pointer-events-none absolute bottom-full mb-1.5 ${side} z-20 whitespace-nowrap rounded-md bg-[#0b1220]/95 px-1.5 py-0.5 text-[10.5px] font-semibold leading-none tabular-nums text-[#fff] shadow-lg ring-1 ring-white/10`} aria-hidden="true">
          {silent ? 'Off' : `${shown}%`}
        </span>
      )}

      {open && (
        <span id={id} role="group" aria-label={name} className={`gn-vol-pop absolute bottom-full mb-2 ${side} z-30 flex items-center gap-2.5 rounded-xl bg-[#0b1220]/95 px-3 py-2.5 text-[#fff] shadow-[0_18px_40px_-12px_rgba(0,0,0,.8)] ring-1 ring-white/12 backdrop-blur`}>
          <button
            type="button"
            onClick={() => (silent ? soundOn() : onMuted(true))}
            aria-label={silent ? 'Turn the sound on' : 'Turn the sound off'}
            aria-pressed={silent}
            className="gn-vol-mute"
          >
            {silent ? <VolumeX aria-hidden="true" /> : <Volume2 aria-hidden="true" />}
          </button>
          <span className="relative block w-[132px]">
            <input
              type="range"
              min={0}
              max={max}
              step={5}
              value={shown}
              onChange={(e) => slide(Number(e.target.value))}
              aria-label={`${name}, 0 to ${max} percent`}
              aria-valuetext={`${shown} percent`}
              className="block w-full h-4 cursor-pointer accent-[#2f8bff]"
              style={{ margin: 0 }}
            />
            {/* Where "normal" is, when the slider goes past it */}
            {max > 100 && <span className="pointer-events-none absolute left-1/2 top-full h-1.5 w-px -translate-x-1/2 bg-white/50" aria-hidden="true" />}
          </span>
          <span className="w-[46px] shrink-0 text-right text-[12px] font-semibold leading-none tabular-nums" aria-live="polite">
            {silent ? 'Off' : `${level}%`}
            {max > 100 && level > 100 && !muted && <span className="mt-1 block text-[9px] font-medium text-white/60">louder</span>}
          </span>
        </span>
      )}
    </span>
  )
}
