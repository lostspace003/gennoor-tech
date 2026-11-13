import type { CSSProperties, ElementType, ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** Where the light comes from. Each is three glows: [across %, down %, size in px, colour]. */
const GLOWS = {
  blue: [[10, 0, 760, 'rgba(34,110,255,.34)'], [92, 92, 700, 'rgba(120,96,255,.26)'], [78, 6, 460, 'rgba(255,190,80,.09)']],
  deep: [[88, 10, 760, 'rgba(34,110,255,.32)'], [8, 92, 640, 'rgba(98,224,232,.14)'], [50, 112, 600, 'rgba(120,96,255,.2)']],
  violet: [[50, 2, 820, 'rgba(120,96,255,.3)'], [6, 94, 600, 'rgba(34,110,255,.28)'], [96, 88, 520, 'rgba(98,224,232,.12)']],
  claude: [[86, 12, 760, 'rgba(229,138,98,.3)'], [8, 90, 680, 'rgba(34,110,255,.26)'], [56, 112, 520, 'rgba(255,190,80,.1)']],
  gold: [[50, -2, 760, 'rgba(255,170,46,.2)'], [6, 88, 720, 'rgba(34,110,255,.34)'], [94, 90, 600, 'rgba(120,96,255,.26)']],
  green: [[88, 86, 760, 'rgba(62,213,152,.16)'], [10, 8, 760, 'rgba(34,110,255,.32)'], [56, -6, 520, 'rgba(120,96,255,.16)']],
} as const
export type Glow = keyof typeof GLOWS

interface GroundProps {
  /** Which light: blue for most pages, gold for the AI Weekend, claude for Claude, green for automation. */
  glow?: Glow
  /** The grid of dots. Its brightest point is at (mx, my), in percent. */
  dots?: boolean
  mx?: number
  my?: number
  as?: ElementType
  id?: string
  className?: string
  children: ReactNode
  'aria-labelledby'?: string
  'aria-label'?: string
}

/**
 * A lit part of a page: a ground with three slow glows and a faint grid of dots, and the
 * content in front. It follows the theme: navy on the dark one, a deeper tint of the page on
 * the light one (the light theme has no navy blocks). So write the words inside with the
 * colour names (`text-gray-900`, `text-gray-600`), never `text-white`. Use it for the top of a
 * page and for the one or two bands that should be noticed; ordinary sections need nothing.
 */
export default function Ground({ glow = 'blue', dots = true, mx = 50, my = 40, as: Tag = 'section', className, children, ...rest }: GroundProps) {
  return (
    <Tag className={cn('st-ground', className)} {...rest}>
      <div className="st-auras" aria-hidden="true">
        {GLOWS[glow].map(([x, y, size, c], i) => (
          <div
            key={i}
            className="st-aura st-drift"
            style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2, '--c': c, '--per': `${24 + i * 7}s`, animationDelay: `${-i * 6}s` } as CSSProperties}
          />
        ))}
        {dots && <div className="st-dots" style={{ '--mx': `${mx}%`, '--my': `${my}%` } as CSSProperties} />}
      </div>
      {children}
    </Tag>
  )
}
