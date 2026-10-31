'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Linkedin, Sparkles, GraduationCap, MessageSquare, Users, PhoneCall, Mail, Menu, X, ExternalLink, Wallet, PenLine, Bot, Network, History, ChevronLeft, PanelLeftOpen } from 'lucide-react'

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

// Same idiom as the website's own navigation rail: a #f5f5f7 panel with a hairline border, the logo on top, quiet
// monochrome icons, and a soft tinted pill on the current page.
const ROW = 'flex items-center gap-[11px] rounded-lg px-3 py-2 text-[13.5px] transition-colors duration-100'
const ROW_IDLE = 'text-gray-900 font-normal hover:bg-[#eaeaef]'
const ROW_ACTIVE = 'bg-primary-100 text-primary-600 font-semibold'

/** The Gennoor Tech logo, drawn inline in the brand colours so it sits cleanly on the rail. */
function RailLogo() {
  const arc: Array<[number, number]> = [[105.8, 84.0], [93.4, 99.9], [75.4, 108.8], [55.3, 108.9], [37.1, 100.3], [24.5, 84.6], [20.0, 65.0], [24.5, 45.4], [37.1, 29.7], [55.3, 21.1], [75.4, 21.2], [93.4, 30.1], [105.8, 46.0]]
  return (
    <Link href="/admin" aria-label="Gennoor Tech admin home" className="flex select-none items-center gap-2.5">
      <svg viewBox="10 10 110 110" className="h-[42px] w-[42px] flex-shrink-0" aria-hidden="true">
        {arc.map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={6.4} fill="#2563EB" />)}
        <circle cx={80} cy={65} r={6.4} fill="#F59E0B" /><circle cx={95} cy={65} r={6.4} fill="#F59E0B" /><circle cx={110} cy={65} r={6.4} fill="#2563EB" />
      </svg>
      <div className="min-w-0">
        <div className="text-[20px] font-extrabold leading-none tracking-[-0.01em] whitespace-nowrap">
          <span className="text-[#2D3748]">Ge</span><span className="text-[#2563EB]">nn</span><span className="text-[#F59E0B]">oo</span><span className="text-[#2563EB]">r</span><span className="text-[#2D3748]"> Tech</span>
        </div>
        <div className="mt-1 whitespace-nowrap text-[10.5px] font-bold uppercase tracking-[0.1em] text-[#475569]">Admin centre</div>
      </div>
    </Link>
  )
}

/** Admin frame: the navigation rail is open by default (collapsible, remembered), and on phones it is a drawer. */
export default function AdminShell({ children }: { children: React.ReactNode }) {
  const path = usePathname() || ''
  const [open, setOpen] = useState(false) // mobile drawer
  const [collapsed, setCollapsed] = useState(false) // desktop: icons only

  useEffect(() => { try { setCollapsed(localStorage.getItem('admin-rail') === 'collapsed') } catch { /* default open */ } }, [])
  useEffect(() => { setOpen(false) }, [path])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
  const toggle = () => setCollapsed(c => { try { localStorage.setItem('admin-rail', c ? 'open' : 'collapsed') } catch { /* ignore */ } return !c })

  if (path.startsWith('/admin/login') || path.startsWith('/admin/crm-complete')) return <>{children}</>

  const current = GROUPS.flatMap(g => g.items).find(i => (i.href === '/admin' ? path === '/admin' : path === i.href || path.startsWith(i.href + '/')))
  const labels = !collapsed

  return (
    <div data-admin className="h-dvh flex bg-gray-50 text-gray-900">
      {open && <div className="fixed inset-0 z-40 bg-gray-900/25 backdrop-blur-[2px] lg:hidden" onClick={() => setOpen(false)} aria-hidden="true" />}

      <aside
        aria-label="Admin navigation"
        className={`fixed lg:static z-50 inset-y-0 left-0 w-[272px] ${collapsed ? 'lg:w-[68px]' : 'lg:w-[264px]'} shrink-0 flex flex-col bg-[#f5f5f7] border-r border-[#e8e8ed] transition-[width,transform] duration-200 ease-out ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Mobile header */}
        <div className="flex items-center justify-between h-[52px] pl-4 pr-2 border-b border-[#e8e8ed] lg:hidden">
          <span className="text-[15px] font-semibold">Menu</span>
          <button onClick={() => setOpen(false)} className="p-2 rounded-lg text-gray-500 hover:bg-[#eaeaef]" aria-label="Close menu"><X className="w-[18px] h-[18px]" /></button>
        </div>

        {/* Logo + collapse button (desktop) */}
        <div className={`hidden lg:block relative ${labels ? 'px-4 pt-5 pb-3' : 'px-2 pt-3 pb-2'}`}>
          {labels ? (
            <>
              <RailLogo />
              <button onClick={toggle} aria-label="Collapse menu" title="Collapse menu"
                className="absolute -right-3 top-[30px] z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white border border-[#d2d2d7] text-gray-600 shadow-sm hover:text-gray-900 hover:border-gray-400">
                <ChevronLeft className="w-[14px] h-[14px]" strokeWidth={2.25} />
              </button>
            </>
          ) : (
            <button onClick={toggle} aria-label="Expand menu" title="Expand menu" className="w-full flex items-center justify-center p-2 rounded-lg text-gray-500 hover:bg-[#eaeaef]">
              <PanelLeftOpen className="w-[17px] h-[17px]" strokeWidth={1.75} />
            </button>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-1.5" aria-label="Admin sections">
          {GROUPS.map((g, gi) => (
            <div key={g.title} className={gi > 0 ? 'mt-1.5 pt-1.5 border-t border-[#e8e8ed]' : ''}>
              {labels && <div className="px-3 pt-1.5 pb-1 text-xs font-medium text-[#86868b]">{g.title}</div>}
              <ul className="space-y-0.5">
                {g.items.map(n => {
                  const on = n === current
                  return (
                    <li key={n.href}>
                      <Link href={n.href} title={labels ? undefined : n.label} aria-current={on ? 'page' : undefined}
                        className={`${ROW} ${on ? ROW_ACTIVE : ROW_IDLE} ${labels ? '' : 'justify-center px-0'}`}>
                        <n.icon className={`w-[17px] h-[17px] shrink-0 ${on ? 'text-primary-600' : 'text-[#86868b]'}`} strokeWidth={1.7} />
                        {labels && <span className="truncate">{n.label}</span>}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className={`border-t border-[#e8e8ed] ${labels ? 'p-4' : 'p-2'}`}>
          <a href="/" target="_blank" rel="noreferrer" title="View site" className={`${ROW} ${ROW_IDLE} ${labels ? '' : 'justify-center px-0'}`}>
            <ExternalLink className="w-[17px] h-[17px] shrink-0 text-[#86868b]" strokeWidth={1.7} />{labels && <span>View site</span>}
          </a>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Phone top bar: the hamburger opens the same menu as a drawer */}
        <header className="lg:hidden shrink-0 h-12 flex items-center gap-3 px-3 border-b border-gray-200 bg-white">
          <button onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open} className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-700 hover:bg-gray-100"><Menu className="w-5 h-5" /></button>
          <span className="text-sm font-semibold">Gennoor Admin</span>
          {current && <span className="text-sm text-gray-500">/ {current.label}</span>}
        </header>
        <main className="flex-1 min-h-0 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
