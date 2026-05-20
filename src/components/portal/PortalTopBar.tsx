'use client'

import Link from 'next/link'
import { Menu, PanelLeftClose, PanelLeftOpen, Search, ArrowRight, Sparkles } from 'lucide-react'
import GennoorLogo from '@/components/GennoorLogo'
import { cn } from '@/lib/utils'

interface Props {
  pinned: boolean
  collapsed: boolean
  onTogglePin: () => void
  onMobileOpen: () => void
  onSearchOpen: () => void
}

export default function PortalTopBar({
  pinned,
  collapsed,
  onTogglePin,
  onMobileOpen,
  onSearchOpen,
}: Props) {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-[var(--portal-topbar-h)] bg-white/95 backdrop-blur-xl border-b border-gray-200/70"
      role="banner"
    >
      <div className="flex items-center h-full px-3 sm:px-4 gap-2">
        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={onMobileOpen}
          className="lg:hidden p-2 -ml-1 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop pin/collapse toggle */}
        <button
          type="button"
          onClick={onTogglePin}
          className="hidden lg:inline-flex items-center justify-center w-9 h-9 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          aria-label={pinned ? 'Collapse navigation' : 'Pin navigation open'}
          title={pinned ? 'Collapse navigation' : 'Pin navigation open'}
        >
          {pinned && !collapsed ? (
            <PanelLeftClose className="w-4.5 h-4.5" />
          ) : (
            <PanelLeftOpen className="w-4.5 h-4.5" />
          )}
        </button>

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center flex-shrink-0 -ml-1 sm:ml-0"
          aria-label="Gennoor Tech home"
        >
          <div className="w-[180px] h-[44px] overflow-hidden">
            <div className="origin-top-left scale-[0.22]">
              <GennoorLogo variant="horizontal" />
            </div>
          </div>
        </Link>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Search */}
        <button
          type="button"
          onClick={onSearchOpen}
          className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Search the website"
        >
          <Search className="w-4 h-4" />
          <span className="hidden sm:inline text-[11px] text-gray-400 font-medium bg-gray-100 px-1.5 py-0.5 rounded-md">
            ⌘K
          </span>
        </button>

        {/* AI Academy */}
        <Link
          href="/academy"
          className={cn(
            'hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-[12.5px] font-bold rounded-lg transition-all',
            'text-white bg-gradient-to-r from-accent-600 to-accent-700 hover:shadow-glow-teal'
          )}
        >
          <Sparkles className="w-3.5 h-3.5" />
          AI Academy
          <span className="text-[9px] font-black bg-white/20 text-white px-1.5 py-0.5 rounded leading-none uppercase ml-0.5">
            Free
          </span>
        </Link>

        {/* Book a Call */}
        <Link
          href="/resources/calendar"
          className="inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-1.5 text-[12.5px] font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg hover:shadow-glow-blue transition-all whitespace-nowrap"
        >
          <span className="hidden sm:inline">Book a Call</span>
          <span className="sm:hidden">Book</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </header>
  )
}
