'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Menu, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Mobile-only chrome. On desktop the Apple-style rail carries the logo,
 * search, and the one filled action, so there is no top bar at all — the
 * content sits directly against the viewport, exactly as in the redesign
 * prototypes.
 */

interface Props {
  onMobileOpen: () => void
  onSearchOpen: () => void
}

const GLYPH =
  'inline-flex items-center justify-center rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-100'

export default function PortalTopBar({ onMobileOpen, onSearchOpen }: Props) {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-[var(--portal-topbar-h)] bg-white/85 backdrop-blur-xl border-b border-[#e8e8ed] lg:hidden"
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

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center flex-shrink-0 ml-0.5 rounded-lg"
          aria-label="Gennoor Tech home"
        >
          <Image
            src="/logos/gennoor-tech-compact-white_600x140_navbar.png"
            alt="Gennoor Tech"
            width={600}
            height={140}
            priority
            className="h-[34px] w-auto"
          />
        </Link>

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

        {/* The one filled action */}
        <Link
          href="/resources/calendar"
          className="inline-flex items-center justify-center h-9 px-4 ml-1 text-[13px] font-semibold text-white bg-primary-600 hover:bg-[#0077ed] rounded-full transition-colors duration-100 whitespace-nowrap"
        >
          Book a call
        </Link>
      </div>
    </header>
  )
}
