'use client'

import Link from 'next/link'
import { Menu, PanelLeftClose, PanelLeftOpen, Search, Sparkles } from 'lucide-react'
import GennoorLogo from '@/components/GennoorLogo'
import { cn } from '@/lib/utils'

/**
 * The top bar carries exactly one filled button ("Book a call"). Everything
 * else — menu, collapse, search, Academy — is a quiet glyph or text link.
 *
 * The old bar had two gradient buttons side by side, which meant neither read
 * as the primary action. One filled control per surface is the rule.
 */

interface Props {
  pinned: boolean
  collapsed: boolean
  onTogglePin: () => void
  onMobileOpen: () => void
  onSearchOpen: () => void
}

const GLYPH =
  'inline-flex items-center justify-center rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-100'

export default function PortalTopBar({
  pinned,
  collapsed,
  onTogglePin,
  onMobileOpen,
  onSearchOpen,
}: Props) {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-[var(--portal-topbar-h)] bg-white/85 backdrop-blur-xl border-b border-gray-200"
      role="banner"
    >
      <div className="flex items-center h-full px-2 sm:px-3 gap-1">
        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={onMobileOpen}
          className={cn(GLYPH, 'lg:hidden w-9 h-9')}
          aria-label="Open navigation"
        >
          <Menu className="w-[19px] h-[19px]" strokeWidth={1.75} />
        </button>

        {/* Desktop pin/collapse toggle */}
        <button
          type="button"
          onClick={onTogglePin}
          className={cn(GLYPH, 'hidden lg:inline-flex w-9 h-9')}
          aria-label={pinned ? 'Collapse navigation' : 'Pin navigation open'}
          title={pinned ? 'Collapse navigation' : 'Pin navigation open'}
        >
          {pinned && !collapsed ? (
            <PanelLeftClose className="w-[18px] h-[18px]" strokeWidth={1.75} />
          ) : (
            <PanelLeftOpen className="w-[18px] h-[18px]" strokeWidth={1.75} />
          )}
        </button>

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center flex-shrink-0 ml-0.5 rounded-lg"
          aria-label="Gennoor Tech home"
        >
          <div className="w-[168px] h-[40px] overflow-hidden">
            <div className="origin-top-left scale-[0.205]">
              <GennoorLogo variant="horizontal" />
            </div>
          </div>
        </Link>

        <div className="flex-1" />

        {/* Search */}
        <button
          type="button"
          onClick={onSearchOpen}
          className={cn(GLYPH, 'gap-2 h-9 px-2.5')}
          aria-label="Search the website"
        >
          <Search className="w-[17px] h-[17px]" strokeWidth={1.75} />
          <span className="hidden sm:inline text-[11px] font-medium text-gray-500 border border-gray-200 rounded-md px-1.5 py-0.5 leading-none">
            ⌘K
          </span>
        </button>

        {/* AI Academy — a text link, not a second filled button */}
        <Link
          href="/academy"
          className={cn(GLYPH, 'hidden md:inline-flex gap-1.5 h-9 px-2.5 text-[13px] font-medium')}
        >
          <Sparkles className="w-[15px] h-[15px]" strokeWidth={1.75} />
          AI Academy
          <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
            Free
          </span>
        </Link>

        {/* The one filled action on this bar */}
        <Link
          href="/resources/calendar"
          className="inline-flex items-center justify-center h-9 px-3.5 ml-1 text-[13px] font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors duration-100 whitespace-nowrap"
        >
          <span className="hidden sm:inline">Book a call</span>
          <span className="sm:hidden">Book</span>
        </Link>
      </div>
    </header>
  )
}
