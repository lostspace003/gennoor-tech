'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'
import { breadcrumbsFor } from '@/lib/portal-nav'

export default function PortalBreadcrumb() {
  const pathname = usePathname()
  const trail = breadcrumbsFor(pathname)

  // Don't render breadcrumb on the home page itself — the top bar logo serves as Home.
  if (trail.length <= 1) return null

  return (
    <nav
      aria-label="Breadcrumb"
      className="sticky top-[var(--portal-topbar-h)] z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200/70"
    >
      <ol className="flex items-center gap-1 px-4 sm:px-6 lg:px-8 py-2 text-xs text-gray-500 overflow-x-auto">
        {trail.map((b, i) => {
          const isLast = i === trail.length - 1
          return (
            <li key={b.href} className="flex items-center gap-1 flex-shrink-0">
              {i > 0 && <ChevronRight className="w-3 h-3 text-gray-300" aria-hidden="true" />}
              {isLast ? (
                <span className="font-semibold text-gray-900 truncate max-w-[280px]">
                  {b.label}
                </span>
              ) : (
                <Link
                  href={b.href}
                  className="inline-flex items-center gap-1 hover:text-primary-600 transition-colors"
                >
                  {i === 0 && <Home className="w-3 h-3" aria-hidden="true" />}
                  <span className="truncate max-w-[180px]">{b.label}</span>
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
