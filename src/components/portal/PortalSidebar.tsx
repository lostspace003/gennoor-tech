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
          'fixed inset-0 z-40 bg-gray-900/40 backdrop-blur-sm lg:hidden transition-opacity',
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={onMobileClose}
        aria-hidden="true"
      />

      <aside
        className={cn(
          'fixed top-0 left-0 z-50 lg:z-40 h-screen lg:h-[calc(100vh-var(--portal-topbar-h))]',
          'lg:top-[var(--portal-topbar-h)]',
          'bg-white border-r border-gray-200 flex flex-col',
          'transition-[width,transform] duration-200 ease-out',
          // Width — desktop
          collapsed ? 'lg:w-[var(--portal-rail-w-collapsed)]' : 'lg:w-[var(--portal-rail-w-expanded)]',
          // Width — mobile (always full expanded width)
          'w-[280px]',
          // Mobile show/hide
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
        onMouseEnter={() => onHoverChange?.(true)}
        onMouseLeave={() => onHoverChange?.(false)}
        aria-label="Primary navigation"
      >
        {/* Mobile header — only renders on mobile */}
        <div className="flex items-center justify-between h-14 px-4 border-b border-gray-200 lg:hidden">
          <span className="text-xs font-bold tracking-widest text-gray-500 uppercase">
            Navigate
          </span>
          <button
            type="button"
            onClick={onMobileClose}
            className="p-2 -mr-1 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pinned shortcuts */}
        {showLabels && (
          <div className="px-3 pt-3 pb-2 border-b border-gray-100">
            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-2 px-1">
              Pinned
            </p>
            <div className="space-y-0.5">
              {portalPinned.map(p => {
                const Icon = p.icon
                const active = isItemActive(p.href, pathname)
                return (
                  <Link
                    key={p.name}
                    href={p.href}
                    className={cn(
                      'group flex items-center gap-2.5 px-2 py-1.5 rounded-md text-[13px] font-medium transition-colors relative',
                      active
                        ? 'text-primary-700 bg-primary-50'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    )}
                  >
                    {active && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-primary-600 rounded-r" />
                    )}
                    {Icon && <Icon className={cn('w-4 h-4 flex-shrink-0', active ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600')} />}
                    <span className="truncate">{p.name}</span>
                    {p.badge && (
                      <span
                        className={cn(
                          'ml-auto text-[9px] font-black px-1.5 py-0.5 rounded leading-none uppercase',
                          p.badge === 'Free' && 'bg-emerald-100 text-emerald-700',
                          p.badge === 'New' && 'bg-primary-100 text-primary-700',
                          p.badge === 'Hot' && 'bg-orange-100 text-orange-700'
                        )}
                      >
                        {p.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Main nav — scrollable */}
        <nav className="flex-1 overflow-y-auto px-2 py-2" aria-label="Site sections">
          {showLabels && (
            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1.5 px-3 mt-1">
              Navigate
            </p>
          )}
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

        {/* Footer hint when expanded */}
        {showLabels && (
          <div className="border-t border-gray-100 px-4 py-3">
            <p className="text-[10px] text-gray-400 leading-relaxed">
              Press <kbd className="font-mono bg-gray-100 text-gray-600 px-1 py-0.5 rounded">⌘K</kbd> to search the site
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
    return (
      <li>
        <Link
          href={section.href}
          className={cn(
            'group flex items-center gap-2.5 px-3 py-2 rounded-md text-[13.5px] font-medium transition-colors relative',
            active
              ? 'text-primary-700 bg-primary-50'
              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100',
            !showLabels && 'justify-center px-0'
          )}
          title={!showLabels ? section.name : undefined}
        >
          {active && (
            <span className="absolute left-0 top-2 bottom-2 w-0.5 bg-primary-600 rounded-r" />
          )}
          <Icon className={cn('w-[18px] h-[18px] flex-shrink-0', active ? 'text-primary-600' : 'text-gray-500 group-hover:text-gray-700')} />
          {showLabels && <span className="truncate">{section.name}</span>}
        </Link>
      </li>
    )
  }

  // Parent row (has children) — expandable
  return (
    <li>
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          'group w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[13.5px] font-medium transition-colors text-left relative',
          active
            ? 'text-primary-700 bg-primary-50/60'
            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100',
          !showLabels && 'justify-center px-0'
        )}
        aria-expanded={isExpanded}
        title={!showLabels ? section.name : undefined}
      >
        {active && (
          <span className="absolute left-0 top-2 bottom-2 w-0.5 bg-primary-600 rounded-r" />
        )}
        <Icon className={cn('w-[18px] h-[18px] flex-shrink-0', active ? 'text-primary-600' : 'text-gray-500 group-hover:text-gray-700')} />
        {showLabels && (
          <>
            <span className="truncate flex-1">{section.name}</span>
            <ChevronRight
              className={cn(
                'w-3.5 h-3.5 flex-shrink-0 text-gray-400 transition-transform duration-200',
                isExpanded && 'rotate-90'
              )}
            />
          </>
        )}
      </button>

      {showLabels && isExpanded && section.children && (
        <ul className="mt-0.5 mb-1 ml-3 pl-3 border-l border-gray-200 space-y-0.5">
          {section.children.map(child => {
            const ChildIcon = child.icon
            const childActive = isItemActive(child.href, pathname)
            return (
              <li key={child.name}>
                <Link
                  href={child.href}
                  className={cn(
                    'group flex items-center gap-2 px-2 py-1.5 rounded-md text-[12.5px] transition-colors',
                    childActive
                      ? 'text-primary-700 bg-primary-50 font-semibold'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  )}
                >
                  {ChildIcon && (
                    <ChildIcon className={cn('w-3.5 h-3.5 flex-shrink-0', childActive ? 'text-primary-600' : 'text-gray-400')} />
                  )}
                  <span className="truncate">{child.name}</span>
                  {child.badge && (
                    <span
                      className={cn(
                        'ml-auto text-[9px] font-black px-1.5 py-0.5 rounded leading-none uppercase',
                        child.badge === 'Free' && 'bg-emerald-100 text-emerald-700',
                        child.badge === 'New' && 'bg-primary-100 text-primary-700',
                        child.badge === 'Hot' && 'bg-orange-100 text-orange-700'
                      )}
                    >
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
