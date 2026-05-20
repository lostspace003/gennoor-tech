'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import PortalTopBar from './PortalTopBar'
import PortalSidebar from './PortalSidebar'
import PortalBreadcrumb from './PortalBreadcrumb'
import SearchModal from '@/components/SearchModal'
import { cn } from '@/lib/utils'

const PIN_STORAGE_KEY = 'gennoor.portal.pinned'

export default function PortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [pinned, setPinned] = useState(true) // SSR default — expanded on desktop
  const [hovering, setHovering] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Hydrate pinned state from localStorage on the client
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(PIN_STORAGE_KEY)
      if (raw !== null) setPinned(raw === '1')
    } catch {
      /* ignore */
    }
    setMounted(true)
  }, [])

  // Persist pinned state
  useEffect(() => {
    if (!mounted) return
    try {
      window.localStorage.setItem(PIN_STORAGE_KEY, pinned ? '1' : '0')
    } catch {
      /* ignore */
    }
  }, [pinned, mounted])

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // ⌘K / Ctrl+K opens search globally
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  // Desktop collapsed state — collapsed when not pinned AND not hovered
  const collapsed = !pinned && !hovering

  return (
    <>
      <PortalTopBar
        pinned={pinned}
        collapsed={collapsed}
        onTogglePin={() => setPinned(p => !p)}
        onMobileOpen={() => setMobileOpen(true)}
        onSearchOpen={() => setSearchOpen(true)}
      />

      <PortalSidebar
        pinned={pinned}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        onHoverChange={setHovering}
      />

      {/* Content area — pushes right of the rail on desktop, full width on mobile.
          On hover-expand we DON'T shift content (rail floats over it, Azure-style). */}
      <div
        className={cn(
          'min-h-screen pt-[var(--portal-topbar-h)] transition-[padding-left] duration-200 ease-out',
          // When pinned & expanded → push content. Otherwise rail floats over content.
          pinned ? 'lg:pl-[var(--portal-rail-w-expanded)]' : 'lg:pl-[var(--portal-rail-w-collapsed)]'
        )}
      >
        <PortalBreadcrumb />
        {children}
      </div>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
