import type { CSSProperties } from 'react'
import { Ico } from '@/components/stage/Ico'
import { blogIcon, TONE_COLOR, type BlogIconSource } from '@/lib/blog-icon'
import { cn } from '@/lib/utils'

/**
 * The picture of a blog post: its icon tile, with two smaller tiles beside it, on a band
 * tinted in the tile's colour (see src/lib/blog-icon.ts for how they are chosen).
 * It follows the theme. Give it a height with a class; `main` is the size of the big tile.
 */
export default function BlogArt({ post, main = 56, className }: { post: BlogIconSource; main?: number; className?: string }) {
  const art = blogIcon(post)
  const small = Math.round(main * 0.54)
  const [left, right] = art.beside
  return (
    <div
      className={cn('st-art', className)}
      style={{ '--art': TONE_COLOR[art.tone], '--art2': TONE_COLOR[left?.tone || 'violet'] } as CSSProperties}
      aria-hidden="true"
    >
      <span className="flex items-center" style={{ gap: Math.round(main * 0.3) }}>
        {left && <Ico icon={left.icon} tone={left.tone} size={small} style={{ transform: 'translateY(22%) rotate(-8deg)', opacity: 0.92 }} />}
        <Ico icon={art.icon} tone={art.tone} size={main} />
        {right && <Ico icon={right.icon} tone={right.tone} size={small} style={{ transform: 'translateY(-26%) rotate(8deg)', opacity: 0.92 }} />}
      </span>
    </div>
  )
}

/** Just the tile, for a line of text or a small list. */
export function BlogTile({ post, size = 40, className }: { post: BlogIconSource; size?: number; className?: string }) {
  const art = blogIcon(post)
  return <Ico icon={art.icon} tone={art.tone} size={size} className={className} />
}
