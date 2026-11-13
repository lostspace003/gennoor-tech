import type { CSSProperties } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * What a tile's colour says about the thing it stands for. Keep to these meanings:
 *   blue    something to watch or read (a lesson, a page, the Learning Studio)
 *   violet  something to do or practise (a lab, a build, a workshop)
 *   green   help, or something done (the assistant, a result, a tick)
 *   gold    something earned, live, or not to be missed (a certificate, the AI Weekend)
 *   claude  anything Claude
 *   rose    a check or a question (a quiz, the question board)
 *   cyan    a connection between things (a workflow, an integration)
 *   ink     off, not yet, or "no"
 */
export type Tone = 'blue' | 'violet' | 'green' | 'gold' | 'claude' | 'rose' | 'cyan' | 'ink'

interface IcoProps {
  icon: LucideIcon
  tone?: Tone
  /** Width and height in pixels. Leave out to size it with a class (w-14 h-14) or with `fill`. */
  size?: number
  /** A circle instead of a rounded square. */
  round?: boolean
  /** Fill the box it is put in. */
  fill?: boolean
  /** Say what it is, if it is the only thing that does. Otherwise it is hidden from screen readers. */
  label?: string
  className?: string
  style?: CSSProperties
}

/**
 * The icon tile of the site: a glass square lit from the top left, with the icon drawn twice
 * (a soft fill, then the line), exactly as in the films and the presentation.
 * Use a lucide icon. One tile per idea; do not put a tile beside every line of text.
 */
export function Ico({ icon: Icon, tone = 'blue', size, round, fill, label, className, style }: IcoProps) {
  const box: CSSProperties = { ...(size ? ({ '--s': `${size}px` } as CSSProperties) : null), ...style }
  return (
    <span
      className={cn('st-ico', tone !== 'blue' && `t-${tone}`, round && 'st-round', fill && 'st-ico-fill', className)}
      style={box}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <Icon fill="#fff" fillOpacity={0.26} stroke="none" />
      <Icon fill="none" stroke="#fff" strokeWidth={1.75} />
    </span>
  )
}

/** The eight-ray spark used on the Claude pages, as a tile. `code` puts a certification code under it. */
export function SparkIco({ size, code, className, label }: { size?: number; code?: string; className?: string; label?: string }) {
  return (
    <span
      className={cn('st-ico t-claude', className)}
      style={{ ...(size ? ({ '--s': `${size}px` } as CSSProperties) : null), flexDirection: 'column', gap: '4%' }}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <svg viewBox="0 0 24 24" style={{ position: 'static', width: code ? '40%' : '56%', height: code ? '40%' : '56%' }}>
        <path fill="#fff" d="M12 2l1.6 6.1L19 4.9l-3.4 5.2 6.1 1.9-6.1 1.9L19 19.1l-5.4-3.2L12 22l-1.6-6.1L5 19.1l3.4-5.2L2.3 12l6.1-1.9L5 4.9l5.4 3.2L12 2z" />
      </svg>
      {code && <b style={{ position: 'relative', fontSize: 'calc(var(--s, 64px) * 0.17)', fontWeight: 800, lineHeight: 1, letterSpacing: '0.02em', color: '#fff' }}>{code}</b>}
    </span>
  )
}
