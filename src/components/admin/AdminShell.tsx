'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Linkedin, Sparkles, GraduationCap, MessageSquare, Users, PhoneCall, Mail, Menu, X, ExternalLink, Wallet, PenLine, Bot, Network, History } from 'lucide-react'

const GROUPS = [
  { title: 'Overview', items: [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/sessions', label: 'Sessions', icon: History },
    { href: '/admin/costs', label: 'Cost centre', icon: Wallet },
  ] },
  { title: 'Publishing', items: [
    { href: '/admin/social', label: 'Social studio', icon: Sparkles },
    { href: '/admin/blog', label: 'Blog studio', icon: PenLine },
    { href: '/admin/autopilot', label: 'LinkedIn autopilot', icon: Bot },
    { href: '/admin/linkedin-hub', label: 'LinkedIn hub', icon: Network },
    { href: '/admin/linkedin', label: 'LinkedIn connection', icon: Linkedin },
  ] },
  { title: 'Learning', items: [
    { href: '/admin/lms', label: 'Learning Studio', icon: GraduationCap },
    { href: '/admin/comments', label: 'Comments', icon: MessageSquare },
    { href: '/admin/community', label: 'Community', icon: Users },
  ] },
  { title: 'Inbox', items: [
    { href: '/admin/tech-calls', label: 'Tech calls', icon: PhoneCall },
    { href: '/admin/mailboxes', label: 'Mailboxes', icon: Mail },
  ] },
]

/** Admin frame: a slim top bar with a hamburger that opens/closes the full admin centre. */
export default function AdminShell({ children }: { children: React.ReactNode }) {
  const path = usePathname() || ''
  const [open, setOpen] = useState(false)

  useEffect(() => { setOpen(false) }, [path])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (path.startsWith('/admin/login') || path.startsWith('/admin/crm-complete')) return <>{children}</>

  const current = GROUPS.flatMap(g => g.items).find(i => (i.href === '/admin' ? path === '/admin' : path === i.href || path.startsWith(i.href + '/')))

  return (
    <div data-admin className="h-dvh flex flex-col bg-gray-50 text-gray-900">
      <header className="shrink-0 h-12 flex items-center gap-3 px-3 border-b border-gray-200 bg-white">
        <button onClick={() => setOpen(o => !o)} aria-label={open ? 'Close admin menu' : 'Open admin menu'} aria-expanded={open}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <Link href="/admin" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logos/gennoor-tech-horizontal-transparent.svg" alt="Gennoor" className="h-7 w-auto" />
        </Link>
        {current && <span className="hidden sm:inline text-sm text-gray-500">/ {current.label}</span>}
        <a href="/" target="_blank" rel="noreferrer" className="ml-auto inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800">View site <ExternalLink className="w-3 h-3" /></a>
      </header>

      <div className="relative flex-1 min-h-0">
        <main className="h-full overflow-y-auto">{children}</main>

        <div className={`absolute inset-0 z-40 bg-gray-900/30 backdrop-blur-[1px] transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setOpen(false)} />
        <aside aria-hidden={!open}
          className={`absolute z-50 inset-y-0 left-0 w-72 max-w-[85vw] bg-white border-r border-gray-200 shadow-xl overflow-y-auto transition-transform duration-300 ease-out ${open ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="px-4 pt-4 pb-2 text-xs uppercase tracking-wide text-gray-400">Admin centre</div>
          <nav className="px-2 pb-4">
            {GROUPS.map(g => (
              <div key={g.title} className="mb-3">
                <div className="px-3 py-1 text-xs font-medium text-gray-400">{g.title}</div>
                {g.items.map(n => {
                  const on = n === current
                  return (
                    <Link key={n.href} href={n.href} tabIndex={open ? 0 : -1}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${on ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
                      <n.icon className="w-4 h-4 shrink-0" />{n.label}
                    </Link>
                  )
                })}
              </div>
            ))}
          </nav>
        </aside>
      </div>
    </div>
  )
}
