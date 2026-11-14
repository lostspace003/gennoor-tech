'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { SessionProvider, useSession, signOut } from 'next-auth/react'
import {
  Users, Inbox, Calendar, FolderOpen, Mail, MessageSquare, Phone,
  LogOut, RefreshCw, Menu, X, AlertCircle, Zap, UsersRound, MessageCircle,
  PanelLeftClose, PanelLeftOpen, ChevronDown,
} from 'lucide-react'
import { CrmProvider, useCrm } from '@/components/crm/CrmContext'
import AdminThemeSwitch from '@/components/admin/AdminThemeSwitch'
import { needsAnswer } from '@/lib/crm/replies'

// The everyday screens, in the order the work happens. The rest sit under "More".
const NAV = [
  { href: '/crm/queue', label: 'Today', icon: Zap },
  { href: '/crm/leads', label: 'Leads', icon: Users },
  { href: '/crm/inbox', label: 'Replies', icon: Inbox },
  { href: '/crm/scheduler', label: 'Meetings', icon: Calendar },
  { href: '/crm/emails', label: 'Emails', icon: Mail },
  { href: '/crm/playbook', label: 'Call guide', icon: Phone },
  { href: '/crm/enquiries', label: 'Website enquiries', icon: MessageSquare, more: true },
  { href: '/crm/documents', label: 'Files', icon: FolderOpen, more: true },
  { href: '/crm/team', label: 'Team', icon: UsersRound, managerOnly: true, more: true },
  { href: '/crm/botlog', label: 'GennoorCare', icon: MessageCircle, managerOnly: true, more: true },
] as Array<{ href: string; label: string; icon: any; managerOnly?: boolean; more?: boolean }>

// Same idiom as the site rail: the hamburger collapses the sidebar to an icon
// rail on desktop (choice remembered) and opens the drawer on mobile.
const RAIL_STORAGE_KEY = 'crm.sidebar.collapsed'

export default function CrmShell({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthGate>
        <CrmProvider>
          <Frame>{children}</Frame>
        </CrmProvider>
      </AuthGate>
    </SessionProvider>
  )
}

function AuthGate({ children }: { children: React.ReactNode }) {
  const { status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace(`/admin/login?callbackUrl=${encodeURIComponent(pathname || '/crm')}`)
    }
  }, [status, router, pathname])

  if (status !== 'authenticated') {
    return (
      <div className="h-dvh flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading Gennoor CRM...</p>
        </div>
      </div>
    )
  }
  return <>{children}</>
}

function Frame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { leads, loading, loadError, reload, notify, isAdmin, isManager, userEmail } = useCrm()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)

  useEffect(() => setDrawerOpen(false), [pathname])

  // Remember the rail choice across sessions (SSR renders expanded)
  useEffect(() => {
    try { setCollapsed(window.localStorage.getItem(RAIL_STORAGE_KEY) === '1') } catch { /* ignore */ }
  }, [])
  const toggleRail = () => {
    setCollapsed((c) => {
      const next = !c
      try { window.localStorage.setItem(RAIL_STORAGE_KEY, next ? '1' : '0') } catch { /* ignore */ }
      return next
    })
  }

  // Beside "Replies": the leads on this desk who wrote to us and are waiting for an answer. (The mailboxes are
  // looked at by the provider, every three minutes; see CrmContext.)
  const me = userEmail.toLowerCase()
  const inboxUnseen = leads.filter((l) => needsAnswer(l) && (isManager || !l.owner || l.owner.toLowerCase() === me)).length

  const active = NAV.find((n) => pathname?.startsWith(n.href))
  const title = pathname?.match(/^\/crm\/leads\/./) ? 'Lead' : active?.label || 'CRM'

  // `rail` = desktop icon-only mode. The mobile drawer always shows labels.
  const sidebarContent = (rail: boolean) => (
    <div className="h-full flex flex-col bg-surface">
      <Link href="/" className={`block border-b border-gray-100 ${rail ? 'px-2 py-3' : 'px-4 pt-[18px] pb-3.5'}`} title="Gennoor Tech — back to site">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={rail ? '/logos/gennoor-tech-icon-dark_128x128_icon-small.png' : '/logos/gennoor-tech-compact-white_600x140_navbar.png'}
          alt="Gennoor Tech"
          className={rail ? 'w-8 h-8 mx-auto rounded-lg' : 'w-full h-auto rounded-lg'}
        />
      </Link>
      <nav className={`flex-1 py-2.5 overflow-y-auto overflow-x-visible ${rail ? 'px-1.5' : 'px-2.5'}`}>
        {NAV.filter((item) => (!item.managerOnly || isManager) && (rail || !item.more || moreOpen || pathname?.startsWith(item.href))).map((item) => {
          const isActive = pathname?.startsWith(item.href)
          const badge =
            item.href === '/crm/leads' ? leads.filter((l) => !l.dumped).length :
            item.href === '/crm/inbox' && inboxUnseen > 0 ? inboxUnseen : null
          return (
            <Link
              key={item.href}
              href={item.href}
              title={rail ? item.label : undefined}
              className={`group relative flex items-center rounded-lg mb-px transition-colors ${rail ? 'justify-center px-2 py-2.5' : 'justify-between px-3 py-2'} ${
                isActive
                  ? 'bg-primary-100 text-primary-600 font-semibold'
                  : 'text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span className={`flex items-center ${rail ? '' : 'gap-2.5'}`}>
                <span className="relative">
                  <item.icon className={`w-4 h-4 ${isActive ? 'text-primary-600' : 'text-gray-400'}`} strokeWidth={1.75} />
                  {/* Collapsed: the count rides the icon so nothing is lost */}
                  {rail && item.href === '/crm/inbox' && inboxUnseen > 0 && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-600 border border-white" />
                  )}
                </span>
                {!rail && <span className="text-[13px]">{item.label}</span>}
              </span>
              {!rail && badge !== null && (
                <span className={`text-[10.5px] font-semibold px-[7px] py-px rounded-full ${item.href === '/crm/inbox' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  {badge}
                </span>
              )}
              {rail && (
                <span className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1.5 rounded-lg bg-gray-900 text-white text-[11.5px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-[70] shadow-lg">
                  {item.label}{badge !== null ? ` · ${badge}` : ''}
                </span>
              )}
            </Link>
          )
        })}
        {!rail && (
          <button
            type="button"
            onClick={() => setMoreOpen((o) => !o)}
            aria-expanded={moreOpen}
            className="w-full flex items-center gap-2.5 px-3 py-2 mt-1 rounded-lg text-[13px] text-gray-500 hover:bg-gray-50"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${moreOpen ? 'rotate-180' : ''}`} strokeWidth={1.75} />
            {moreOpen ? 'Less' : 'More'}
          </button>
        )}
      </nav>
      <div className={`border-t border-gray-100 ${rail ? 'px-1.5 py-3 space-y-2' : 'px-4 py-3.5'}`}>
        {rail ? (
          <>
            <div className="text-[10px] text-center text-gray-500 truncate" title={session?.user?.email || ''}>
              {session?.user?.email?.split('@')[0]?.slice(0, 8)}
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              className="w-full flex justify-center p-2 rounded-lg text-red-600 hover:bg-red-50"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </>
        ) : (
          <>
            <div className="text-[13px] font-semibold text-gray-900 truncate">
              {session?.user?.email?.split('@')[0]}
            </div>
            <div className="text-[11px] text-gray-500">
              {isAdmin ? 'Administrator' : isManager ? 'Manager' : 'Team member'}
            </div>
            <div className="flex items-center gap-3 mt-2">
              <Link href="/" className="text-xs font-medium text-primary-600 hover:text-primary-500">
                ‹ Back to site
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/admin/login' })}
                className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700"
              >
                <LogOut className="w-3 h-3" /> Sign out
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )

  return (
    <div className="h-dvh bg-gray-50 flex overflow-hidden">
      {/* Desktop sidebar — expanded panel or collapsed icon rail */}
      <aside
        className={`hidden lg:block border-r border-gray-200 shrink-0 transition-[width] duration-200 ease-out ${collapsed ? 'w-[60px]' : 'w-[216px]'}`}
      >
        {sidebarContent(collapsed)}
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawerOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 shadow-xl">
            {sidebarContent(false)}
            <button onClick={() => setDrawerOpen(false)} className="absolute top-3 right-3 p-1.5 bg-gray-100 rounded-lg">
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className="relative flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="h-[52px] bg-surface border-b border-gray-200 px-3 sm:px-6 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => setDrawerOpen(true)}
              className="p-1.5 hover:bg-gray-50 rounded-lg lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={toggleRail}
              className="hidden lg:inline-flex p-1.5 hover:bg-gray-50 rounded-lg"
              title={collapsed ? 'Expand menu' : 'Collapse menu'}
              aria-label={collapsed ? 'Expand menu' : 'Collapse menu'}
              aria-expanded={!collapsed}
            >
              {collapsed
                ? <PanelLeftOpen className="w-5 h-5 text-gray-600" />
                : <PanelLeftClose className="w-5 h-5 text-gray-600" />}
            </button>
            <h1 className="text-[15px] font-semibold text-gray-900 truncate">{title}</h1>
          </div>
          <div className="flex items-center gap-2.5">
            <AdminThemeSwitch className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 hover:border-gray-400 bg-raised transition-colors" />
            <button
              onClick={() => reload().then(() => notify('Refreshed'))}
              className="inline-flex items-center gap-1.5 border border-gray-300 hover:border-gray-400 bg-raised text-xs font-semibold text-gray-900 px-3.5 py-1.5 rounded-full transition-colors"
              title="Refresh data"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <Link
              href="/crm/leads?new=1"
              className="inline-flex items-center text-xs font-semibold text-white bg-primary-600 hover:bg-primary-500 px-3.5 py-[7px] rounded-full transition-colors"
              title="Add a lead"
            >
              New lead
            </Link>
          </div>
        </header>

        {loadError && (
          <div className="bg-red-50 border-b border-red-200 px-4 py-2 flex items-center gap-2 text-sm text-red-700 shrink-0">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="truncate">Could not load leads: {loadError}</span>
            <button onClick={() => reload()} className="underline shrink-0">Retry</button>
          </div>
        )}

        <main className="flex-1 overflow-y-auto min-w-0">{children}</main>

      </div>
    </div>
  )
}
