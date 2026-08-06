'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  portalNav,
  portalPinned,
  isItemActive,
  isSectionActive,
  type PortalNavSection,
} from '@/lib/portal-nav'

/**
 * The site rail / mobile drawer, in the iCloud idiom:
 *
 *  - the rail is a grey panel, the content beside it is white — that contrast
 *    alone separates them, so the rail needs no shadow and no heavy divider
 *  - selection is a filled rounded pill, not a left edge marker
 *  - icons are monochrome and inherit the row's state; the only colour in the
 *    whole rail is the accent on the selected row
 *  - badges are quiet uppercase text, never a coloured chip
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
  /** Hover handlers for the auto-expand-on-hover behaviour when collapsed. */
  onHoverChange?: (hovering: boolean) => void
}

/** Shared row geometry so pinned items, sections and children line up exactly. */
const ROW = 'flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-[13.5px] transition-colors duration-100'
const ROW_IDLE = 'text-gray-800 hover:bg-gray-200/60'
const ROW_ACTIVE = 'bg-primary-100 text-primary-700 font-medium'
const ICON_IDLE = 'text-gray-500'
const ICON_ACTIVE = 'text-primary-600'

function Badge({ label }: { label: string }) {
  return (
    <span className="ml-auto text-[10px] font-semibold uppercase tracking-wide text-gray-500">
      {label}
    </span>
  )
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-2.5 pt-3 pb-1 text-[11px] font-semibold tracking-wide text-gray-500">
      {children}
    </p>
  )
}

export default function PortalSidebar({
  pinned,
  collapsed,
  mobileOpen,
  onMobileClose,
  onHoverChange,
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
          'fixed top-0 left-0 z-50 lg:z-40 h-dvh lg:h-[calc(100dvh-var(--portal-topbar-h))]',
          'lg:top-[var(--portal-topbar-h)]',
          'bg-gray-100 border-r border-gray-200 flex flex-col',
          'transition-[width,transform] duration-200 ease-out',
          // Width — desktop
          collapsed ? 'lg:w-[var(--portal-rail-w-collapsed)]' : 'lg:w-[var(--portal-rail-w-expanded)]',
          // Width — mobile (always full expanded width)
          'w-[272px]',
          // Mobile show/hide
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
        onMouseEnter={() => onHoverChange?.(true)}
        onMouseLeave={() => onHoverChange?.(false)}
        aria-label="Primary navigation"
      >
        {/* Mobile header — only renders on mobile */}
        <div className="flex items-center justify-between h-[52px] pl-4 pr-2 border-b border-gray-200 lg:hidden">
          <span className="text-[15px] font-semibold text-gray-900">Menu</span>
          <button
            type="button"
            onClick={onMobileClose}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-200/70 transition-colors"
            aria-label="Close navigation"
          >
            <X className="w-[18px] h-[18px]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-3">
          {/* Pinned shortcuts */}
          {showLabels && (
            <>
              <GroupLabel>Quick links</GroupLabel>
              <div className="space-y-px">
                {portalPinned.map(p => {
                  const Icon = p.icon
                  const active = isItemActive(p.href, pathname)
                  return (
                    <Link
                      key={p.name}
                      href={p.href}
                      className={cn(ROW, active ? ROW_ACTIVE : ROW_IDLE)}
                    >
                      {Icon && (
                        <Icon
                          className={cn('w-[17px] h-[17px] flex-shrink-0', active ? ICON_ACTIVE : ICON_IDLE)}
                          strokeWidth={1.75}
                        />
                      )}
                      <span className="truncate">{p.name}</span>
                      {p.badge && <Badge label={p.badge} />}
                    </Link>
                  )
                })}
              </div>
            </>
          )}

          {/* Main nav */}
          <nav aria-label="Site sections">
            {showLabels && <GroupLabel>Browse</GroupLabel>}
            <ul className={cn('space-y-px', !showLabels && 'pt-3')}>
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

        {/* Footer hint when expanded */}
        {showLabels && (
          <div className="border-t border-gray-200 px-4 py-2.5">
            <p className="text-[11px] text-gray-500">
              Press{' '}
              <kbd className="font-sans text-gray-600 bg-white border border-gray-200 px-1.5 py-0.5 rounded-md">
                ⌘K
              </kbd>{' '}
              to search
            </p>
          </div>
        )}
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

  // Leaf row (no children) — renders as a plain link
  if (!hasChildren && section.href) {
    const exact = isItemActive(section.href, pathname)
    return (
      <li>
        <Link
          href={section.href}
          className={cn(
            ROW,
            exact ? ROW_ACTIVE : ROW_IDLE,
            !showLabels && 'justify-center px-0'
          )}
          title={!showLabels ? section.name : undefined}
        >
          <Icon
            className={cn('w-[17px] h-[17px] flex-shrink-0', exact ? ICON_ACTIVE : ICON_IDLE)}
            strokeWidth={1.75}
          />
          {showLabels && <span className="truncate">{section.name}</span>}
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
          active ? 'text-gray-900 font-medium hover:bg-gray-200/60' : ROW_IDLE,
          !showLabels && 'justify-center px-0'
        )}
        aria-expanded={isExpanded}
        title={!showLabels ? section.name : undefined}
      >
        <Icon
          className={cn('w-[17px] h-[17px] flex-shrink-0', active ? 'text-gray-700' : ICON_IDLE)}
          strokeWidth={1.75}
        />
        {showLabels && (
          <>
            <span className="truncate flex-1">{section.name}</span>
            <ChevronRight
              className={cn(
                'w-3.5 h-3.5 flex-shrink-0 text-gray-400 transition-transform duration-200',
                isExpanded && 'rotate-90'
              )}
              strokeWidth={2}
            />
          </>
        )}
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
                    'pl-[34px] text-[13px]',
                    childActive ? ROW_ACTIVE : 'text-gray-600 hover:bg-gray-200/60 hover:text-gray-900'
                  )}
                >
                  <span className="truncate">{child.name}</span>
                  {child.badge && <Badge label={child.badge} />}
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </li>
  )
}
