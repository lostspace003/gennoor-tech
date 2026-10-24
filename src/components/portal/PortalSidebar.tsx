'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight, X, Search, PanelLeftOpen, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  portalNav,
  isItemActive,
  isSectionActive,
  type PortalNavSection,
} from '@/lib/portal-nav'

/**
 * The site rail in the Apple idiom (per the redesign handoff):
 *
 *  - a #f5f5f7 panel with a hairline border, logo card at the top,
 *    one filled pill ("Book a call") at the bottom
 *  - selection is a filled tint (#e8f0fe) with accent text — no edge markers
 *  - rows are 13.5px, icons 17px monochrome; the only colour in the rail is
 *    the accent on the selected row
 *  - the desktop top bar is gone; search and collapse live here instead
 */

interface Props {
  /** Whether the user has pinned the rail open (desktop only). */
  pinned: boolean
  /** Whether the rail is currently collapsed to icon-only (desktop). */
  collapsed: boolean
  /** Whether the mobile drawer is open. */
  mobileOpen: boolean
  /** Close handler — used by mobile drawer and route changes. */
  onMobileClose: () => void
  /** Toggle the pinned state (desktop only). */
  onTogglePin?: () => void
  /** Open the ⌘K search modal. */
  onSearchOpen?: () => void
}

/** Shared row geometry so sections and children line up exactly. */
const ROW = 'flex items-center gap-[11px] rounded-lg px-3 py-2 text-[13.5px] transition-colors duration-100'
const ROW_IDLE = 'text-gray-900 font-normal hover:bg-[#eaeaef]'
const ROW_ACTIVE = 'bg-primary-100 text-primary-600 font-semibold'
const ICON_IDLE = 'text-[#86868b]'
const ICON_ACTIVE = 'text-primary-600'

/** Tooltip shown beside collapsed-rail icons — explains what each icon is. */
const WHATSAPP_URL =
  'https://wa.me/919326352241?text=' +
  encodeURIComponent('Hi Jalal, I visited gennoor.com and would like to talk about AI training and automation for my organization.')

/** WhatsApp, always just above "Book a call". The label shows on hover or keyboard focus. */
function WhatsAppLink({ compact }: { compact?: boolean }) {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Connect to WhatsApp"
      className={cn(
        'group relative flex items-center justify-center rounded-full bg-[#25d366] hover:bg-[#1fb857] text-white shadow-sm hover:shadow-md transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25d366]',
        compact ? 'w-9 h-9 mx-auto mb-2' : 'w-10 h-10',
      )}
    >
      <MessageCircle className={compact ? 'w-[18px] h-[18px]' : 'w-5 h-5'} />
      <span className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 rounded-lg bg-[#1d1d1f] text-white text-[11.5px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-150 z-[70] shadow-lg">
        Connect to WhatsApp
      </span>
    </a>
  )
}

function RailTip({ label }: { label: string }) {
  return (
    <span className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 rounded-lg bg-[#1d1d1f] text-white text-[11.5px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-[70] shadow-lg">
      {label}
    </span>
  )
}

/** The Gennoor Tech logo drawn inline: same colours as the brand SVG, tagline large enough to read. */
function RailLogo() {
  const arc: Array<[number, number]> = [[105.8, 84.0], [93.4, 99.9], [75.4, 108.8], [55.3, 108.9], [37.1, 100.3], [24.5, 84.6], [20.0, 65.0], [24.5, 45.4], [37.1, 29.7], [55.3, 21.1], [75.4, 21.2], [93.4, 30.1]]
  return (
    <Link href="/" aria-label="Gennoor Tech home" className="block select-none">
      <div className="flex items-center gap-2.5">
        <svg viewBox="10 10 110 110" className="h-[48px] w-[48px] flex-shrink-0" aria-hidden="true">
          {arc.map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={6.4} fill="#2563EB" />)}
          <circle cx={80} cy={65} r={6.4} fill="#F59E0B" />
          <circle cx={95} cy={65} r={6.4} fill="#F59E0B" />
          <circle cx={110} cy={65} r={6.4} fill="#2563EB" />
        </svg>
        <span className="font-heading text-[21.5px] font-extrabold leading-none tracking-[-0.01em] whitespace-nowrap">
          <span className="text-[#2D3748]">Ge</span><span className="text-[#2563EB]">nn</span><span className="text-[#F59E0B]">oo</span><span className="text-[#2563EB]">r</span><span className="text-[#4A5568]"> Tech</span>
        </span>
      </div>
      <div className="mt-1.5 whitespace-nowrap text-[11.5px] font-bold uppercase tracking-[0.16em] text-[#475569]">Train. Innovate. Build.</div>
    </Link>
  )
}

export default function PortalSidebar({
  pinned,
  collapsed,
  mobileOpen,
  onMobileClose,
  onTogglePin,
  onSearchOpen,
}: Props) {
  const pathname = usePathname()
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  // Collapsed-rail flyout: which section's submenu panel is open
  const [flyout, setFlyout] = useState<string | null>(null)
  const asideRef = useRef<HTMLElement>(null)

  // Auto-expand any section that contains the active route
  useEffect(() => {
    const next = new Set(expanded)
    portalNav.forEach(s => {
      if (s.children && isSectionActive(s, pathname)) {
        next.add(s.name)
      }
    })
    setExpanded(next)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // Close mobile drawer + any flyout on route change
  useEffect(() => {
    if (mobileOpen) onMobileClose()
    setFlyout(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // Flyout housekeeping: close when the rail expands, when clicking
  // anywhere outside the rail, or on Escape.
  useEffect(() => {
    if (!collapsed) setFlyout(null)
  }, [collapsed])

  useEffect(() => {
    if (!flyout) return
    const onPointerDown = (e: PointerEvent) => {
      if (asideRef.current && !asideRef.current.contains(e.target as Node)) setFlyout(null)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFlyout(null)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [flyout])

  const toggleSection = (name: string) => {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  // Desktop visual state: collapsed unless pinned OR being hovered
  const showLabels = !collapsed

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-gray-900/25 backdrop-blur-[2px] lg:hidden transition-opacity duration-200',
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={onMobileClose}
        aria-hidden="true"
      />

      <aside
        ref={asideRef}
        className={cn(
          'fixed top-0 left-0 z-50 lg:z-40 h-dvh',
          'bg-[#f5f5f7] border-r border-[#e8e8ed] flex flex-col',
          'transition-[width,transform] duration-200 ease-out',
          // Width — desktop
          collapsed ? 'lg:w-[var(--portal-rail-w-collapsed)]' : 'lg:w-[var(--portal-rail-w-expanded)]',
          // Width — mobile (always full expanded width)
          'w-[272px]',
          // Mobile show/hide
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
        aria-label="Primary navigation"
      >
        {/* Mobile header — only renders on mobile */}
        <div className="flex items-center justify-between h-[52px] pl-4 pr-2 border-b border-[#e8e8ed] lg:hidden">
          <span className="text-[15px] font-semibold text-gray-900">Menu</span>
          <button
            type="button"
            onClick={onMobileClose}
            className="p-2 rounded-lg text-gray-500 hover:bg-[#eaeaef] transition-colors"
            aria-label="Close navigation"
          >
            <X className="w-[18px] h-[18px]" />
          </button>
        </div>

        {/* Logo — desktop only; the mobile drawer has its own header. Drawn inline so it sits on the rail, no card. */}
        <div className={cn('hidden lg:block relative', showLabels ? 'px-4 pt-5 pb-3' : 'px-2 pt-3 pb-2')}>
          {showLabels ? (
            <>
              <RailLogo />
              {onTogglePin && (
                <button
                  type="button"
                  onClick={onTogglePin}
                  className="absolute -right-3 top-[30px] z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white border border-[#d2d2d7] text-gray-600 shadow-sm hover:text-gray-900 hover:border-gray-400 transition-colors"
                  aria-label={pinned ? 'Collapse navigation' : 'Pin navigation open'}
                  title={pinned ? 'Collapse navigation' : 'Pin navigation open'}
                >
                  {pinned ? <ChevronLeft className="w-[14px] h-[14px]" strokeWidth={2.25} /> : <ChevronRight className="w-[14px] h-[14px]" strokeWidth={2.25} />}
                </button>
              )}
            </>
          ) : (
            <button
              type="button"
              onClick={onTogglePin}
              className="group relative w-full flex items-center justify-center p-2 rounded-lg text-gray-500 hover:bg-[#eaeaef] transition-colors"
              aria-label="Expand navigation"
            >
              <PanelLeftOpen className="w-[17px] h-[17px]" strokeWidth={1.75} />
              <RailTip label="Expand navigation" />
            </button>
          )}
        </div>

        {/* Search row — opens the ⌘K modal */}
        {onSearchOpen && (
          <div className={cn('hidden lg:block', showLabels ? 'px-3 pb-1' : 'px-2 pb-1')}>
            <button
              type="button"
              onClick={onSearchOpen}
              className={cn(
                ROW,
                'w-full text-left text-[#6e6e73] hover:bg-[#eaeaef]',
                !showLabels && 'group relative justify-center px-0'
              )}
              aria-label="Search the website"
            >
              <Search className={cn('w-[17px] h-[17px] flex-shrink-0', ICON_IDLE)} strokeWidth={1.7} />
              {showLabels ? (
                <>
                  <span className="truncate flex-1">Search</span>
                  <kbd className="text-[10.5px] font-medium text-gray-500 bg-white border border-[#e8e8ed] px-1.5 py-0.5 rounded-md leading-none">
                    ⌘K
                  </kbd>
                </>
              ) : (
                <RailTip label="Search  ⌘K" />
              )}
            </button>
          </div>
        )}

        <div className={cn('flex-1 px-3 py-1.5', showLabels ? 'overflow-y-auto' : 'overflow-visible')}>
          {/* Main nav */}
          <nav aria-label="Site sections">
            <ul className="space-y-0.5">
              {portalNav.map(section => (
                <SectionRow
                  key={section.name}
                  section={section}
                  pathname={pathname}
                  showLabels={showLabels}
                  isExpanded={expanded.has(section.name)}
                  onToggle={() => toggleSection(section.name)}
                  flyoutOpen={flyout === section.name}
                  onFlyoutToggle={() =>
                    setFlyout(f => (f === section.name ? null : section.name))
                  }
                />
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom block — the one filled action, plus the delivery footprint */}
        <div className={cn('border-t border-[#e8e8ed]', showLabels ? 'p-4' : 'p-2')}>
          {showLabels ? (
            <div className="flex flex-col gap-2.5">
              <WhatsAppLink />
              <Link
                href="/resources/calendar"
                className="flex items-center justify-center bg-primary-600 text-white text-[13px] font-semibold py-2.5 rounded-full hover:bg-[#0077ed] transition-colors"
              >
                Book a call
              </Link>
              <p className="text-[11px] text-[#86868b] text-center">Mumbai, India</p>
            </div>
          ) : (
            <>
            <WhatsAppLink compact />
            <Link
              href="/resources/calendar"
              className="group relative flex items-center justify-center w-9 h-9 mx-auto bg-primary-600 text-white rounded-full hover:bg-[#0077ed] transition-colors"
              aria-label="Book a call"
            >
              <ChevronRight className="w-4 h-4" strokeWidth={2} />
              <RailTip label="Book a call" />
            </Link>
            </>
          )}
        </div>
      </aside>
    </>
  )
}

function SectionRow({
  section,
  pathname,
  showLabels,
  isExpanded,
  onToggle,
  flyoutOpen,
  onFlyoutToggle,
}: {
  section: PortalNavSection
  pathname: string
  showLabels: boolean
  isExpanded: boolean
  onToggle: () => void
  flyoutOpen: boolean
  onFlyoutToggle: () => void
}) {
  const Icon = section.icon
  const active = isSectionActive(section, pathname)
  const hasChildren = !!(section.children && section.children.length > 0)

  // Collapsed rail + section WITH children — clicking the icon opens a
  // flyout submenu beside the rail listing the section page and every
  // child, so nothing is more than two taps away while collapsed.
  if (!showLabels && hasChildren) {
    return (
      <li className="relative">
        <button
          type="button"
          onClick={onFlyoutToggle}
          className={cn(
            ROW,
            'group relative w-full justify-center px-0',
            active || flyoutOpen ? ROW_ACTIVE : ROW_IDLE
          )}
          aria-expanded={flyoutOpen}
          aria-haspopup="menu"
        >
          <Icon
            className={cn(
              'w-[17px] h-[17px] flex-shrink-0',
              active || flyoutOpen ? ICON_ACTIVE : ICON_IDLE
            )}
            strokeWidth={1.7}
          />
          <span className="sr-only">{section.name}</span>
          {!flyoutOpen && <RailTip label={section.name} />}
        </button>

        {flyoutOpen && (
          <div
            className="absolute left-full top-0 ml-2 w-60 bg-white border border-[#e8e8ed] rounded-xl shadow-lg p-1.5 z-[70]"
            role="menu"
            aria-label={`${section.name} submenu`}
          >
            {section.href && (
              <Link
                href={section.href}
                className="block px-3 py-2 rounded-lg text-[13px] font-semibold text-gray-900 hover:bg-[#f5f5f7]"
                role="menuitem"
              >
                {section.name}
              </Link>
            )}
            <div className="my-1 border-t border-[#f0f0f2]" />
            {section.children!.map(child => {
              const childActive = isItemActive(child.href, pathname)
              return (
                <Link
                  key={child.name}
                  href={child.href}
                  className={cn(
                    'flex items-center px-3 py-2 rounded-lg text-[13px]',
                    childActive
                      ? 'bg-primary-100 text-primary-600 font-semibold'
                      : 'text-[#6e6e73] hover:bg-[#f5f5f7] hover:text-gray-900'
                  )}
                  role="menuitem"
                >
                  <span className="truncate">{child.name}</span>
                  {child.badge && (
                    <span className="ml-auto text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                      {child.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        )}
      </li>
    )
  }

  // Collapsed rail + leaf section — an icon link with a tooltip naming it.
  if (!showLabels && section.href) {
    const on = isItemActive(section.href, pathname)
    return (
      <li>
        <Link
          href={section.href}
          className={cn(ROW, 'group relative justify-center px-0', on ? ROW_ACTIVE : ROW_IDLE)}
        >
          <Icon
            className={cn('w-[17px] h-[17px] flex-shrink-0', on ? ICON_ACTIVE : ICON_IDLE)}
            strokeWidth={1.7}
          />
          <span className="sr-only">{section.name}</span>
          <RailTip label={section.name} />
        </Link>
      </li>
    )
  }

  // Leaf row (no children) — renders as a plain link
  if (!hasChildren && section.href) {
    const exact = isItemActive(section.href, pathname)
    return (
      <li>
        <Link
          href={section.href}
          className={cn(ROW, exact ? ROW_ACTIVE : ROW_IDLE)}
        >
          <Icon
            className={cn('w-[17px] h-[17px] flex-shrink-0', exact ? ICON_ACTIVE : ICON_IDLE)}
            strokeWidth={1.7}
          />
          <span className="truncate">{section.name}</span>
        </Link>
      </li>
    )
  }

  // Parent row (has children) — expandable.
  // A parent is never "selected"; only its child is. It gets a weight change so
  // you can still see which group you're inside without a second filled pill.
  return (
    <li>
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          ROW,
          'w-full text-left',
          active ? 'text-gray-900 font-medium hover:bg-[#eaeaef]' : ROW_IDLE
        )}
        aria-expanded={isExpanded}
      >
        <Icon
          className={cn('w-[17px] h-[17px] flex-shrink-0', active ? 'text-gray-700' : ICON_IDLE)}
          strokeWidth={1.7}
        />
        <span className="truncate flex-1">{section.name}</span>
        <ChevronRight
          className={cn(
            'w-3.5 h-3.5 flex-shrink-0 text-gray-400 transition-transform duration-200',
            isExpanded && 'rotate-90'
          )}
          strokeWidth={2}
        />
      </button>

      {showLabels && isExpanded && section.children && (
        <ul className="mt-px mb-1 space-y-px">
          {/* Children are text-only and indented to the parent's label column —
              a second row of icons here is what made the rail feel busy. */}
          {section.children.map(child => {
            const childActive = isItemActive(child.href, pathname)
            return (
              <li key={child.name}>
                <Link
                  href={child.href}
                  className={cn(
                    ROW,
                    'pl-[40px] text-[13px]',
                    childActive ? ROW_ACTIVE : 'text-[#6e6e73] hover:bg-[#eaeaef] hover:text-gray-900'
                  )}
                >
                  <span className="truncate">{child.name}</span>
                  {child.badge && (
                    <span className="ml-auto text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                      {child.badge}
                    </span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </li>
  )
}
