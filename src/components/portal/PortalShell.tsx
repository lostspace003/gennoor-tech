'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import PortalTopBar from './PortalTopBar'
import PortalSidebar from './PortalSidebar'
import PortalBreadcrumb from './PortalBreadcrumb'
import RouteProgress from './RouteProgress'
import SearchModal from '@/components/SearchModal'
import { ClaudePartnerBar } from '@/components/ClaudePartner'
import { cn } from '@/lib/utils'
import { isChromelessRoute } from '@/lib/chrome'
import CustomTraining from '@/components/custom-training/CustomTraining'
import { readTheme, saveTheme, showTheme, type Theme } from '@/lib/theme'

const PIN_STORAGE_KEY = 'gennoor.portal.pinned'

export default function PortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [pinned, setPinned] = useState(true) // SSR default — expanded on desktop
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  // Dark is the look the site opens in; the visitor's own choice is read once the page is in the browser
  const [theme, setTheme] = useState<Theme>('dark')

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

  // The look of the site. Pages with their own shell (admin, CRM, the lesson players) carry none.
  useEffect(() => { setTheme(readTheme()) }, [])
  useEffect(() => {
    showTheme(isChromelessRoute(pathname) ? 'none' : theme)
  }, [pathname, theme])
  const changeTheme = (t: Theme) => { setTheme(t); saveTheme(t) }

  // Instant scroll reset on route change. `html { scroll-behavior: smooth }`
  // makes the router's own reset animate and land late/short — behavior:'instant'
  // overrides it so every navigation starts at the true top. The page scrolls in
  // the window (the shell has no inner scroll container), but reset both roots
  // defensively.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
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

  // Desktop collapsed state — simple: collapsed exactly when not pinned.
  // (No hover-to-expand: collapsing must take effect immediately, and the
  // collapsed rail explains its icons with tooltips instead.)
  const collapsed = !pinned

  // App surfaces (CRM, admin, the chapter player) render their own
  // full-screen shells — no site topbar/sidebar/breadcrumb/padding.
  // They are also the "paper" side of the site: light, as before.
  if (isChromelessRoute(pathname)) {
    return <>{children}</>
  }

  // Every other page takes the look on <html>: dark ("stage") or light ("day"), src/styles/stage.css.
  return (
    <>
      <RouteProgress />

      {/* Mobile-only bar — desktop has no top chrome in the Apple idiom */}
      <PortalTopBar
        onMobileOpen={() => setMobileOpen(true)}
        onSearchOpen={() => setSearchOpen(true)}
        theme={theme}
        onTheme={changeTheme}
      />

      <PortalSidebar
        pinned={pinned}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        onTogglePin={() => setPinned(p => !p)}
        onSearchOpen={() => setSearchOpen(true)}
        theme={theme}
        onTheme={changeTheme}
      />

      {/* Content area — pushes right of the rail on desktop, full width on mobile.
          On hover-expand we DON'T shift content (rail floats over it, Azure-style). */}
      <div
        className={cn(
          'min-h-screen pt-[var(--portal-topbar-h)] lg:pt-0 transition-[padding-left] duration-200 ease-out',
          // When pinned & expanded → push content. Otherwise rail floats over content.
          pinned ? 'lg:pl-[var(--portal-rail-w-expanded)]' : 'lg:pl-[var(--portal-rail-w-collapsed)]'
        )}
      >
        
        {/* The home page and the Claude page show the partner badge and line themselves, so no bar above them. */}
        {pathname !== '/' && pathname !== '/claude' && !pathname.startsWith('/claude/') && <ClaudePartnerBar />}
        <PortalBreadcrumb />
        <div key={pathname} className="animate-page-enter">
          {children}
        </div>
      </div>

      <CustomTraining />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
