'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ChevronRight, X, Search, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
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
function RailTip({ label }: { label: string }) {
  return (
    <span className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 rounded-lg bg-[#1d1d1f] text-white text-[11.5px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-[70] shadow-lg">
      {label}
    </span>
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

  // Close mobile drawer on route change
  useEffect(() => {
    if (mobileOpen) onMobileClose()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

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

        {/* Logo card — desktop only; the mobile drawer has its own header */}
        <div className={cn('hidden lg:block', showLabels ? 'px-4 pt-[18px] pb-3' : 'px-2 pt-3 pb-2')}>
          {showLabels ? (
            <div className="relative group/logo">
              <Link href="/" aria-label="Gennoor Tech home" className="block">
                <Image
                  src="/logos/gennoor-tech-compact-white_600x140_navbar.png"
                  alt="Gennoor Tech"
                  width={600}
                  height={140}
                  priority
                  className="w-full h-auto block rounded-[10px] border border-[#e8e8ed] bg-white"
                />
              </Link>
              {onTogglePin && (
                <button
                  type="button"
                  onClick={onTogglePin}
                  className="absolute -right-1.5 -top-1.5 p-1.5 rounded-lg bg-white border border-[#e8e8ed] text-gray-400 opacity-0 group-hover/logo:opacity-100 hover:text-gray-700 transition-all"
                  aria-label={pinned ? 'Collapse navigation' : 'Pin navigation open'}
                  title={pinned ? 'Collapse navigation' : 'Pin navigation open'}
                >
                  {pinned ? (
                    <PanelLeftClose className="w-[14px] h-[14px]" strokeWidth={1.75} />
                  ) : (
                    <PanelLeftOpen className="w-[14px] h-[14px]" strokeWidth={1.75} />
                  )}
                </button>
              )}
            </div>
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
                />
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom block — the one filled action, plus the delivery footprint */}
        <div className={cn('border-t border-[#e8e8ed]', showLabels ? 'p-4' : 'p-2')}>
          {showLabels ? (
            <div className="flex flex-col gap-2.5">
              <Link
                href="/resources/calendar"
                className="flex items-center justify-center bg-primary-600 text-white text-[13px] font-semibold py-2.5 rounded-full hover:bg-[#0077ed] transition-colors"
              >
                Book a call
              </Link>
              <p className="text-[11px] text-[#86868b] text-center">GCC · Africa · South Asia</p>
            </div>
          ) : (
            <Link
              href="/resources/calendar"
              className="group relative flex items-center justify-center w-9 h-9 mx-auto bg-primary-600 text-white rounded-full hover:bg-[#0077ed] transition-colors"
              aria-label="Book a call"
            >
              <ChevronRight className="w-4 h-4" strokeWidth={2} />
              <RailTip label="Book a call" />
            </Link>
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
}: {
  section: PortalNavSection
  pathname: string
  showLabels: boolean
  isExpanded: boolean
  onToggle: () => void
}) {
  const Icon = section.icon
  const active = isSectionActive(section, pathname)
  const hasChildren = !!(section.children && section.children.length > 0)

  // Collapsed rail — every section renders as an icon link with a tooltip
  // naming it. Parents navigate to their section landing page directly.
  if (!showLabels && section.href) {
    const on = hasChildren ? active : isItemActive(section.href, pathname)
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
