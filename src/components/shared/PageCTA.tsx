import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface PageCTAAction {
  label: string
  href: string
  variant?: 'primary' | 'ghost'
}

export interface PageCTAProps {
  /** Eyebrow above the heading. */
  eyebrow?: string
  /** CTA heading. */
  title: string
  /** Supporting description. */
  description?: string
  /** Up to two action buttons. */
  ctas: PageCTAAction[]
  /** Optional small footnote text below the buttons. */
  footnote?: string
}

/**
 * Brand-aligned closing CTA section. Light gradient background, primary used as
 * accent only — mirrors the homepage's CTASection so every page closes the same way.
 *
 * Server component — safe to render inside any page.
 */
export default function PageCTA({
  eyebrow = 'Get Started',
  title,
  description,
  ctas,
  footnote,
}: PageCTAProps) {
  return (
    <section className="py-16 lg:py-24 relative overflow-hidden">
      {/* Light brand-tinted mesh background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f0f4ff] via-white to-[#f0fdf8]" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-mesh" aria-hidden="true" />

      {/* Ambient blurred orb — pure CSS */}
      <div
        aria-hidden="true"
        className="absolute top-[20%] left-[30%] w-[400px] h-[400px] rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.06) 0%, transparent 70%)',
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center rounded-full px-3 py-1 mb-5 text-[11px] font-semibold text-primary-700 bg-primary-50/90 border border-primary-100/70">
            {eyebrow}
          </div>

          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-gray-900 mb-5">
            {title}
          </h2>

          {description && (
            <p className="text-base sm:text-lg text-gray-600 mb-9 max-w-2xl mx-auto leading-relaxed">
              {description}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {ctas.map((c, i) => (
              <Link
                key={`${c.label}-${i}`}
                href={c.href}
                className={cn(
                  'inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-xl transition-all duration-300 group',
                  c.variant === 'ghost'
                    ? 'text-gray-700 bg-white/80 backdrop-blur-sm ring-1 ring-gray-200 hover:ring-primary-300 hover:text-primary-700'
                    : 'text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:shadow-glow-blue'
                )}
              >
                {c.label}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>

          {footnote && (
            <p className="mt-7 text-xs text-gray-400 tracking-wide">{footnote}</p>
          )}
        </div>
      </div>
    </section>
  )
}
