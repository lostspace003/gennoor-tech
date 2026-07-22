import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface DisclosureProps {
  /** The always-visible one-line summary. */
  summary: string
  /** Optional muted hint shown next to the summary (e.g. "8 modules"). */
  hint?: string
  /** Render expanded on first paint. */
  defaultOpen?: boolean
  className?: string
  children: React.ReactNode
}

/**
 * Clean expand/collapse block for long-form content — shows a short summary line
 * and tucks the full details behind a tap. Native <details>, so it needs no JS,
 * keeps all content in the DOM for SEO, and works everywhere.
 *
 * Server component — safe to render inside any page.
 */
export default function Disclosure({
  summary,
  hint,
  defaultOpen,
  className,
  children,
}: DisclosureProps) {
  return (
    <details
      open={defaultOpen}
      className={cn(
        'group rounded-2xl bg-white transition-all duration-300',
        'border border-gray-200/70 open:border-primary-200/80',
        'shadow-[0_1px_2px_rgba(15,23,42,0.04)] open:shadow-[0_2px_4px_rgba(15,23,42,0.05),0_16px_36px_-14px_rgba(15,23,42,0.1)]',
        className
      )}
    >
      {/* after:content-none neutralizes the global FAQ `details summary::after` "+" rule */}
      <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-4 select-none [&::-webkit-details-marker]:hidden after:content-none">
        <span className="flex-1 text-sm font-semibold text-gray-900">{summary}</span>
        {hint && <span className="hidden sm:inline text-xs text-gray-400 font-medium">{hint}</span>}
        <ChevronDown className="w-4 h-4 flex-shrink-0 text-gray-400 transition-transform duration-200 group-open:rotate-180 group-open:text-primary-600" />
      </summary>
      <div className="px-5 pb-5 pt-1 text-sm text-gray-600 leading-relaxed border-t border-gray-100">
        {children}
      </div>
    </details>
  )
}
