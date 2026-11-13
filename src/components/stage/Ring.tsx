import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'

/** The logo mark, dot for dot: twelve blue dots in an open ring, and the bar of the G. */
const MARK_DOTS: Array<[number, number]> = [[51.8, 40.1], [45.2, 48.6], [35.5, 53.4], [24.8, 53.4], [15.1, 48.8], [8.4, 40.5], [6, 30], [8.4, 19.5], [15.1, 11.2], [24.8, 6.6], [35.5, 6.6], [45.2, 11.4]]

export function Mark({ size = 60, glow = true, className }: { size?: number; glow?: boolean; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      className={className}
      style={{ overflow: 'visible', filter: glow ? `drop-shadow(0 0 ${size * 0.12}px rgba(61,148,255,.55))` : undefined }}
      aria-hidden="true"
    >
      {MARK_DOTS.map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={3.5} fill="#3d94ff" />)}
      <circle cx={38} cy={30} r={3.5} fill="#ffb02e" />
      <circle cx={46} cy={30} r={3.5} fill="#ffb02e" />
      <circle cx={54} cy={30} r={3.5} fill="#3d94ff" />
    </svg>
  )
}

interface RingProps {
  /** Radius in pixels of the drawing; the ring scales with the box it is put in. */
  r?: number
  /** How many dots. */
  n?: number
  dot?: number
  /** Dots left out at the upper right: the opening of the G. */
  open?: number
  /** How many of the first dots are gold. */
  gold?: number
  color?: string
  alpha?: number
  /** Seconds for one full turn. Negative turns the other way. 0 keeps it still. */
  turn?: number
  className?: string
  style?: CSSProperties
}

/**
 * A large ring of fine dots: the logo's ring at the scale of a picture. It turns slowly.
 * It is the site's only ornament. One per view is enough; behind a statement, never behind a list.
 */
export function Ring({ r = 300, n = 84, dot = 2.4, open = 4, gold = 3, color = '#6fb4ff', alpha = 0.9, turn = 180, className, style }: RingProps) {
  const size = r * 2 + 40
  const dots = []
  for (let i = 0; i < n - open; i++) {
    const a = (i / n) * Math.PI * 2 + 0.44
    const big = i % 6 === 0
    dots.push(
      <circle
        key={i}
        cx={(size / 2 + r * Math.cos(a)).toFixed(1)}
        cy={(size / 2 + r * Math.sin(a)).toFixed(1)}
        r={(big ? dot * 1.7 : dot).toFixed(1)}
        fill={i < gold ? '#ffc24b' : color}
        opacity={(big ? alpha : alpha * 0.55).toFixed(2)}
      />,
    )
  }
  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className={cn('st-ring', turn !== 0 && 'st-spin', className)}
      style={{ ...(turn ? ({ '--per': `${Math.abs(turn)}s`, animationDirection: turn < 0 ? 'reverse' : undefined } as CSSProperties) : null), ...style }}
      aria-hidden="true"
    >
      {dots}
    </svg>
  )
}
