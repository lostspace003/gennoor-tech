import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

export interface PageHeroMeta {
  icon: LucideIcon
  label: string
}

export interface PageHeroBreadcrumb {
  label: string
  href?: string
}

export interface PageHeroCta {
  label: string
  href: string
  variant?: 'primary' | 'ghost'
}

export interface PageHeroProps {
  /** Eyebrow badge (e.g. "Workshop", "Service"). */
  eyebrow?: string
  /** Optional breadcrumb trail above the title. */
  breadcrumbs?: PageHeroBreadcrumb[]
  /** Page title — the H1. */
  title: string
  /** Subhead / description. */
  description?: string
  /** Optional meta items rendered as icon + label chips below the description. */
  meta?: PageHeroMeta[]
  /** Up to two CTAs rendered to the right of the description. */
  ctas?: PageHeroCta[]
  /** Vertical rhythm — 'compact' suits utility/legal pages. */
  size?: 'default' | 'compact'
  /** Horizontal alignment of the hero content. */
  align?: 'left' | 'center'
  /** Optional media/extra slot rendered below the CTAs (e.g. a video or illustration). */
  children?: React.ReactNode
}

/**
 * Brand-aligned page hero — light gradient mesh background, primary used as accent
 * only, no full-section solid blue fills. Matches the homepage hero aesthetic.
 *
 * Server component — safe to import from any page; lucide icons pass through unchanged.
 */
export default function PageHero({
  eyebrow,
  breadcrumbs,
  title,
  description,
  meta,
  ctas,
  size = 'default',
  align = 'left',
  children,
}: PageHeroProps) {
  const centered = align === 'center'
  return (
    <section className="relative overflow-hidden">
      {/* The hero is a flat panel. Its separation from the page below comes
          from the surface change plus the hairline — not from tinted orbs. */}
      <div className="absolute inset-0 bg-gray-50" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gray-200" aria-hidden="true" />

      <div
        className={cn(
          'relative container mx-auto px-4 sm:px-6 lg:px-8',
          size === 'compact' ? 'py-10 lg:py-14' : 'py-10 lg:py-16'
        )}
      >
        <div className={cn('max-w-4xl', centered && 'mx-auto text-center')}>
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav aria-label="Breadcrumb" className={cn('flex items-center gap-1.5 text-xs text-gray-500 mb-4', centered && 'justify-center')}>
              {breadcrumbs.map((b, i) => (
                <span key={`${b.label}-${i}`} className="inline-flex items-center gap-1.5">
                  {b.href ? (
                    <Link href={b.href} className="hover:text-primary-600 transition-colors">
                      {b.label}
                    </Link>
                  ) : (
                    <span>{b.label}</span>
                  )}
                  {i < breadcrumbs.length - 1 && <span className="text-gray-300">/</span>}
                </span>
              ))}
            </nav>
          )}

          {eyebrow && (
            <div className="inline-flex items-center rounded-full px-3 py-1 mb-5 text-[11px] font-semibold text-primary-700 bg-primary-50/90 border border-primary-100/70">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary-600 mr-2 animate-pulse" />
              {eyebrow}
            </div>
          )}

          <h1 className="font-heading text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-gray-900 mb-5 leading-tight tracking-tight">
            {title}
          </h1>

          {description && (
            <p className="text-base sm:text-lg text-gray-600 mb-7 leading-relaxed max-w-3xl">
              {description}
            </p>
          )}

          {meta && meta.length > 0 && (
            <div className={cn('flex flex-wrap gap-2.5 mb-8', centered && 'justify-center')}>
              {meta.map((m, i) => {
                const Icon = m.icon
                return (
                  <span
                    key={`${m.label}-${i}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 backdrop-blur-sm ring-1 ring-gray-200 text-xs font-medium text-gray-700"
                  >
                    <Icon className="w-3.5 h-3.5 text-primary-500" />
                    {m.label}
                  </span>
                )
              })}
            </div>
          )}

          {ctas && ctas.length > 0 && (
            <div className={cn('flex flex-col sm:flex-row gap-3', centered && 'sm:justify-center')}>
              {ctas.map((c, i) => (
                <Link
                  key={`${c.label}-${i}`}
                  href={c.href}
                  className={cn(
                    'inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-300',
                    c.variant === 'ghost'
                      ? 'text-gray-700 bg-white/80 backdrop-blur-sm ring-1 ring-gray-200 hover:ring-primary-300 hover:text-primary-700'
                      : 'text-white bg-primary-600'
                  )}
                >
                  {c.label}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ))}
            </div>
          )}

          {children}
        </div>
      </div>
    </section>
  )
}
