'use client'

import { Fragment, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight, X, Search, PanelLeftOpen, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { portalNav, isItemActive, type PortalNavSection } from '@/lib/portal-nav'
import type { Theme } from '@/lib/theme'
import ThemeSwitch from './ThemeSwitch'

/**
 * The site menu.
 *
 * One level, read from top to bottom. A section with more than one page (Learning Studio,
 * Claude) is the link to its main page, and its other pages sit under it on a thin line,
 * always visible: nothing has to be opened to find a page, and there is no menu inside the
 * menu. Folded to icons, each icon is still one link, with its name beside it on hover.
 *
 * It takes the look of the site (dark or light) from the theme on <html>; the switch for it
 * is at the foot, above WhatsApp and "Book a call".
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
  theme: Theme
  onTheme: (t: Theme) => void
}

/** Shared row geometry so sections and their pages line up exactly. */
const ROW = 'flex items-center gap-[11px] rounded-lg px-3 py-2 text-[13.5px] transition-colors duration-100'
const ROW_IDLE = 'text-gray-900 font-normal hover:bg-gray-100'
const ROW_ACTIVE = 'bg-primary-100 text-primary-600 font-semibold'
const ICON_IDLE = 'text-gray-400'
const ICON_ACTIVE = 'text-primary-600'

const WHATSAPP_URL =
  'https://wa.me/919326352241?text=' +
  encodeURIComponent('Hi Jalal, I visited gennoor.com and would like to talk about AI training and automation for my organization.')

/** The name of an icon, beside it, when the menu is folded. */
function RailTip({ label }: { label: string }) {
  return (
    <span className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 rounded-lg bg-[#16213f] text-white text-[11.5px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-150 z-[70] shadow-lg">
      {label}
    </span>
  )
}

/** WhatsApp, always just beside "Book a call". The label shows on hover or keyboard focus. */
function WhatsAppLink({ compact }: { compact?: boolean }) {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Connect to WhatsApp"
      className={cn(
        'group relative flex shrink-0 items-center justify-center rounded-full bg-[#25d366] hover:bg-[#1fb857] text-white shadow-sm hover:shadow-md transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25d366]',
        compact ? 'w-9 h-9 mx-auto' : 'w-10 h-10',
      )}
    >
      <MessageCircle className={compact ? 'w-[18px] h-[18px]' : 'w-5 h-5'} />
      <RailTip label="Connect to WhatsApp" />
    </a>
  )
}

/** The Gennoor Tech logo drawn inline: the brand's blue and gold; the quiet letters follow the theme, so it reads on the dark rail. */
export function RailLogo({ compact = false }: { compact?: boolean }) {
  const arc: Array<[number, number]> = [[105.8, 84.0], [93.4, 99.9], [75.4, 108.8], [55.3, 108.9], [37.1, 100.3], [24.5, 84.6], [20.0, 65.0], [24.5, 45.4], [37.1, 29.7], [55.3, 21.1], [75.4, 21.2], [93.4, 30.1]]
  return (
    <Link href="/" aria-label="Gennoor Tech home" className="flex select-none items-center gap-2.5">
      <svg viewBox="10 10 110 110" className={cn('flex-shrink-0', compact ? 'h-[34px] w-[34px]' : 'h-[46px] w-[46px]')} aria-hidden="true">
        {arc.map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={6.4} fill="#3d94ff" />)}
        <circle cx={80} cy={65} r={6.4} fill="#ffb02e" />
        <circle cx={95} cy={65} r={6.4} fill="#ffb02e" />
        <circle cx={110} cy={65} r={6.4} fill="#3d94ff" />
      </svg>
      <div className="min-w-0">
        <div className={cn('font-heading font-extrabold leading-none tracking-[-0.01em] whitespace-nowrap', compact ? 'text-[17px]' : 'text-[21px]')}>
          <span className="text-gray-900">Ge</span><span className="text-[#3d94ff]">nn</span><span className="text-[#ffb02e]">oo</span><span className="text-[#3d94ff]">r</span><span className="text-gray-700"> Tech</span>
        </div>
        <div className={cn('whitespace-nowrap font-bold uppercase tracking-[0.1em] text-gray-500', compact ? 'mt-1 text-[8.5px]' : 'mt-1.5 text-[10.5px]')}>Train. Innovate. Build.</div>
      </div>
    </Link>
  )
}

export default function PortalSidebar({ pinned, collapsed, mobileOpen, onMobileClose, onTogglePin, onSearchOpen, theme, onTheme }: Props) {
  const pathname = usePathname()

  // Close the phone's menu when a page is chosen
  useEffect(() => {
    if (mobileOpen) onMobileClose()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // Folded to icons on a desktop; on a phone the menu always shows its names
  const showLabels = !collapsed

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] lg:hidden transition-opacity duration-200',
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={onMobileClose}
        aria-hidden="true"
      />

      <aside
        className={cn(
          'fixed top-0 left-0 z-50 lg:z-40 h-dvh',
          'bg-gray-50 border-r border-gray-200 flex flex-col',
          'transition-[width,transform] duration-200 ease-out',
          // Width — desktop
          collapsed ? 'lg:w-[var(--portal-rail-w-collapsed)]' : 'lg:w-[var(--portal-rail-w-expanded)]',
          // Width — mobile (always full expanded width)
          'w-[280px] max-w-[86vw]',
          // Mobile show/hide
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
        aria-label="Primary navigation"
      >
        {/* Mobile header — only renders on mobile */}
        <div className="flex items-center justify-between h-[56px] pl-4 pr-2 border-b border-gray-200 lg:hidden">
          <RailLogo compact />
          <button
            type="button"
            onClick={onMobileClose}
            className="p-2.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Close the menu"
          >
            <X className="w-5 h-5" />
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
                  className="absolute -right-3 top-[30px] z-10 flex h-6 w-6 items-center justify-center rounded-full bg-raised border border-gray-300 text-gray-600 shadow-sm hover:text-gray-900 hover:border-gray-400 transition-colors"
                  aria-label={pinned ? 'Fold the menu to icons' : 'Keep the menu open'}
                  title={pinned ? 'Fold the menu to icons' : 'Keep the menu open'}
                >
                  {pinned ? <ChevronLeft className="w-[14px] h-[14px]" strokeWidth={2.25} /> : <ChevronRight className="w-[14px] h-[14px]" strokeWidth={2.25} />}
                </button>
              )}
            </>
          ) : (
            <button
              type="button"
              onClick={onTogglePin}
              className="group relative w-full flex items-center justify-center p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
              aria-label="Open the menu"
            >
              <PanelLeftOpen className="w-[17px] h-[17px]" strokeWidth={1.75} />
              <RailTip label="Open the menu" />
            </button>
          )}
        </div>

        {/* Search row — opens the ⌘K modal */}
        {onSearchOpen && (
          <div className={cn('hidden lg:block', showLabels ? 'px-3 pb-1' : 'px-2 pb-1')}>
            <button
              type="button"
              onClick={onSearchOpen}
              className={cn(ROW, 'w-full text-left text-gray-500 hover:bg-gray-100', !showLabels && 'group relative justify-center px-0')}
              aria-label="Search the website"
            >
              <Search className={cn('w-[17px] h-[17px] flex-shrink-0', ICON_IDLE)} strokeWidth={1.7} />
              {showLabels ? (
                <>
                  <span className="truncate flex-1">Search</span>
                  <kbd className="text-[10.5px] font-medium text-gray-500 bg-raised border border-gray-200 px-1.5 py-0.5 rounded-md leading-none">⌘K</kbd>
                </>
              ) : (
                <RailTip label="Search  ⌘K" />
              )}
            </button>
          </div>
        )}

        <div className={cn('flex-1 px-3 py-1.5', showLabels ? 'overflow-y-auto' : 'overflow-visible')}>
          <nav aria-label="Site sections">
            <ul className="space-y-0.5">
              {portalNav.map(section => (
                <Fragment key={section.name}>
                  {/* Group break — padding, not margin, because space-y owns the margins */}
                  {section.startsGroup && (
                    <li aria-hidden="true" className="py-1.5">
                      <div className={cn('border-t border-gray-200', showLabels ? 'mx-3' : 'mx-2')} />
                    </li>
                  )}
                  <SectionRow section={section} pathname={pathname} showLabels={showLabels} />
                </Fragment>
              ))}
            </ul>
          </nav>
        </div>

        {/* The foot: the look of the site, then the two ways to reach us */}
        <div className={cn('border-t border-gray-200', showLabels ? 'p-4' : 'p-2')}>
          {showLabels ? (
            <div className="flex flex-col gap-3">
              <ThemeSwitch theme={theme} onChange={onTheme} />
              <div className="flex items-center gap-2.5">
                <WhatsAppLink />
                <Link
                  href="/resources/calendar"
                  className="flex-1 flex items-center justify-center bg-primary-600 text-white text-[13px] font-semibold py-2.5 rounded-full hover:bg-primary-500 transition-colors"
                >
                  Book a call
                </Link>
              </div>
              <p className="text-[11px] text-gray-400 text-center">Mumbai, India</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <ThemeSwitch theme={theme} onChange={onTheme} compact />
              <WhatsAppLink compact />
              <Link
                href="/resources/calendar"
                className="group relative flex items-center justify-center w-9 h-9 bg-primary-600 text-white rounded-full hover:bg-primary-500 transition-colors"
                aria-label="Book a call"
              >
                <ChevronRight className="w-4 h-4" strokeWidth={2} />
                <RailTip label="Book a call" />
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}

/** One section of the menu: its own row, and under it, on a thin line, its further pages. */
function SectionRow({ section, pathname, showLabels }: { section: PortalNavSection; pathname: string; showLabels: boolean }) {
  const Icon = section.icon
  const children = section.children ?? []
  const childOn = children.some(c => isItemActive(c.href, pathname))
  // A section is the current page only when none of its own pages is
  const on = !!section.href && isItemActive(section.href, pathname) && !childOn
  const href = section.href ?? children[0]?.href ?? '/'

  // Folded to icons: one icon, one link. The name shows beside it; the section's other pages are on its page.
  if (!showLabels) {
    const lit = on || childOn
    return (
      <li>
        <Link href={href} aria-current={on ? 'page' : undefined} className={cn(ROW, 'group relative justify-center px-0', lit ? ROW_ACTIVE : ROW_IDLE)}>
          <Icon className={cn('w-[17px] h-[17px] flex-shrink-0', lit ? ICON_ACTIVE : ICON_IDLE)} strokeWidth={1.7} />
          <span className="sr-only">{section.name}</span>
          <RailTip label={section.name} />
        </Link>
      </li>
    )
  }

  return (
    <li>
      <Link href={href} aria-current={on ? 'page' : undefined} className={cn(ROW, on ? ROW_ACTIVE : ROW_IDLE, childOn && 'font-semibold')}>
        <Icon className={cn('w-[17px] h-[17px] flex-shrink-0', on ? ICON_ACTIVE : childOn ? 'text-gray-700' : ICON_IDLE)} strokeWidth={1.7} />
        <span className="truncate">{section.name}</span>
        {section.badge && (
          <span className="ml-auto rounded-full bg-[#ffc24b] px-2 py-[1px] text-[10px] font-bold uppercase tracking-wide text-[#2a1a00]">{section.badge}</span>
        )}
      </Link>

      {/* The section's other pages: always there, on a thin line under it */}
      {children.length > 0 && (
        <ul className="mt-0.5 mb-1 ml-[20px] border-l border-gray-200 pl-[9px] space-y-0.5">
          {children.map(child => {
            const childActive = isItemActive(child.href, pathname)
            return (
              <li key={child.name}>
                <Link
                  href={child.href}
                  aria-current={childActive ? 'page' : undefined}
                  className={cn(ROW, 'py-1.5 text-[13px]', childActive ? ROW_ACTIVE : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900')}
                >
                  <span className="truncate">{child.name}</span>
                  {child.badge && (
                    <span className="ml-auto rounded-full border border-gray-300 px-1.5 py-[1px] text-[9.5px] font-bold uppercase tracking-wide text-gray-500">{child.badge}</span>
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
