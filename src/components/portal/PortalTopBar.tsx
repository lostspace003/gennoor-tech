'use client'

import { Menu, Search } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { RailLogo } from './PortalSidebar'
import ThemeSwitch from './ThemeSwitch'
import type { Theme } from '@/lib/theme'

/**
 * Mobile-only chrome. On desktop the Apple-style rail carries the logo,
 * search, and the one filled action, so there is no top bar at all — the
 * content sits directly against the viewport, exactly as in the redesign
 * prototypes.
 */

interface Props {
  onMobileOpen: () => void
  onSearchOpen: () => void
  theme: Theme
  onTheme: (t: Theme) => void
}

const GLYPH =
  'inline-flex items-center justify-center rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-100'

export default function PortalTopBar({ onMobileOpen, onSearchOpen, theme, onTheme }: Props) {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-[var(--portal-topbar-h)] bg-surface/85 backdrop-blur-xl border-b border-gray-200 lg:hidden"
      role="banner"
    >
      <div className="flex items-center h-full px-2 sm:px-3 gap-1">
        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={onMobileOpen}
          className={cn(GLYPH, 'w-9 h-9')}
          aria-label="Open navigation"
        >
          <Menu className="w-[19px] h-[19px]" strokeWidth={1.75} />
        </button>

        {/* Logo: drawn in type, like the rail's, so it reads on the dark bar */}
        <div className="flex-shrink-0 ml-0.5"><RailLogo compact /></div>

        <div className="flex-1" />

        {/* Search */}
        <button
          type="button"
          onClick={onSearchOpen}
          className={cn(GLYPH, 'w-9 h-9')}
          aria-label="Search the website"
        >
          <Search className="w-[17px] h-[17px]" strokeWidth={1.75} />
        </button>

        {/* Dark or light */}
        <ThemeSwitch theme={theme} onChange={onTheme} compact />

        {/* The one filled action */}
        <Link
          href="/resources/calendar"
          className="inline-flex items-center justify-center h-9 px-4 ml-1 text-[13px] font-semibold text-white bg-primary-600 hover:bg-primary-500 rounded-full transition-colors duration-100 whitespace-nowrap"
        >
          Book a call
        </Link>
      </div>
    </header>
  )
}
