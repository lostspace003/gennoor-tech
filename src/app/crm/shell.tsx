'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { SessionProvider, useSession, signOut } from 'next-auth/react'
import {
  LayoutGrid, Users, TrendingUp, Inbox, Calendar, FolderOpen,
  LogOut, RefreshCw, Menu, X, AlertCircle, Zap, UsersRound, MessageCircle,
} from 'lucide-react'
import { CrmProvider, useCrm } from '@/components/crm/CrmContext'
import CrmCopilot from '@/components/crm/CrmCopilot'

const NAV = [
  { href: '/crm/queue', label: 'Work Queue', icon: Zap },
  { href: '/crm/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { href: '/crm/leads', label: 'Leads', icon: Users },
  { href: '/crm/pipeline', label: 'Pipeline', icon: TrendingUp },
  { href: '/crm/inbox', label: 'Inbox', icon: Inbox },
  { href: '/crm/scheduler', label: 'Scheduler', icon: Calendar },
  { href: '/crm/documents', label: 'Documents', icon: FolderOpen },
  { href: '/crm/team', label: 'Team', icon: UsersRound, managerOnly: true },
  { href: '/crm/botlog', label: 'GennoorCare', icon: MessageCircle, managerOnly: true },
] as Array<{ href: string; label: string; icon: any; managerOnly?: boolean }>

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
  const { leads, loading, loadError, reload, notify, isAdmin, isManager } = useCrm()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [inboxUnseen, setInboxUnseen] = useState(0)

  useEffect(() => setDrawerOpen(false), [pathname])

  // Auto-pull replies: poll the inbox every 3 minutes while the CRM is open;
  // badge counts messages newer than the last time the Inbox page was viewed.
  useEffect(() => {
    let stopped = false
    const check = async () => {
      if (document.hidden) return
      try {
        const res = await fetch('/api/admin/leads/inbox')
        const data = await res.json()
        if (stopped || !res.ok || !Array.isArray(data.messages)) return
        const lastSeen = localStorage.getItem('crm.inbox.lastSeen') || ''
        setInboxUnseen(data.messages.filter((m: any) => m.receivedAt > lastSeen).length)
      } catch { /* polling is best-effort */ }
    }
    check()
    const timer = setInterval(check, 180_000)
    return () => { stopped = true; clearInterval(timer) }
  }, [])

  // Opening the Inbox marks everything seen
  useEffect(() => {
    if (pathname === '/crm/inbox') {
      localStorage.setItem('crm.inbox.lastSeen', new Date().toISOString())
      setInboxUnseen(0)
    }
  }, [pathname])

  const active = NAV.find((n) => pathname?.startsWith(n.href))
  const title = pathname?.match(/^\/crm\/leads\/./) ? 'Lead Workspace' : active?.label || 'CRM'

  const sidebar = (
    <div className="h-full flex flex-col bg-white">
      <Link href="/" className="block px-4 pt-[18px] pb-3.5 border-b border-[#f0f0f2]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logos/gennoor-tech-compact-white_600x140_navbar.png"
          alt="Gennoor Tech"
          className="w-full h-auto rounded-lg"
        />
      </Link>
      <nav className="flex-1 px-2.5 py-2.5 overflow-y-auto">
        {NAV.filter((item) => !item.managerOnly || isManager).map((item) => {
          const isActive = pathname?.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2 rounded-lg mb-px transition-colors ${
                isActive
                  ? 'bg-primary-100 text-primary-600 font-semibold'
                  : 'text-gray-900 hover:bg-[#f5f5f7]'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <item.icon className={`w-4 h-4 ${isActive ? 'text-primary-600' : 'text-[#86868b]'}`} strokeWidth={1.75} />
                <span className="text-[13px]">{item.label}</span>
              </span>
              {item.href === '/crm/leads' && (
                <span className="text-[10.5px] font-semibold bg-[#f0f0f2] text-[#6e6e73] px-[7px] py-px rounded-full">
                  {leads.length}
                </span>
              )}
              {item.href === '/crm/inbox' && inboxUnseen > 0 && (
                <span className="text-[10.5px] font-semibold bg-[#1d8348] text-white px-[7px] py-px rounded-full">
                  {inboxUnseen}
                </span>
              )}
            </Link>
          )
        })}
      </nav>
      <div className="px-4 py-3.5 border-t border-[#f0f0f2]">
        <div className="text-[13px] font-semibold text-gray-900 truncate">
          {session?.user?.email?.split('@')[0]}
        </div>
        <div className="text-[11px] text-[#86868b]">
          {isAdmin ? 'Administrator' : isManager ? 'Manager' : 'Team member'}
        </div>
        <div className="flex items-center gap-3 mt-2">
          <Link href="/" className="text-xs font-medium text-primary-600 hover:text-[#0077ed]">
            ‹ Back to site
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="inline-flex items-center gap-1 text-xs font-medium text-[#c0392b] hover:text-[#9b2c21]"
          >
            <LogOut className="w-3 h-3" /> Sign out
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="h-dvh bg-[#f5f5f7] flex overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-[216px] border-r border-[#e8e8ed] shrink-0">{sidebar}</aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawerOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 shadow-xl">
            {sidebar}
            <button onClick={() => setDrawerOpen(false)} className="absolute top-3 right-3 p-1.5 bg-gray-100 rounded-lg">
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="h-[52px] bg-white border-b border-[#e8e8ed] px-3 sm:px-6 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <button onClick={() => setDrawerOpen(true)} className="p-1.5 hover:bg-[#f5f5f7] rounded-lg lg:hidden">
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-[15px] font-semibold text-gray-900 truncate">{title}</h1>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => reload().then(() => notify('Refreshed'))}
              className="inline-flex items-center gap-1.5 border border-[#d2d2d7] hover:border-[#86868b] bg-white text-xs font-semibold text-gray-900 px-3.5 py-1.5 rounded-full transition-colors"
              title="Refresh data"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <CrmCopilot />
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
