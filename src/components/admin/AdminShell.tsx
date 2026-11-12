'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import RouteProgress from '@/components/portal/RouteProgress'
import {
  LayoutDashboard, Linkedin, Sparkles, GraduationCap, MessageSquare, Users, PhoneCall, Mail, Menu, X, ExternalLink, Wallet, PenLine, Bot, Network, History,
  ChevronLeft, ChevronRight, PanelLeftOpen, BarChart3, TrendingUp, Activity, BookOpen, Send, Calendar, Settings, HardDrive, Search, Globe, Lock, LogOut, Briefcase, MessageCircle,
  Film, CalendarDays,
} from 'lucide-react'

// The dashboard's own sections now live here, nested under "Dashboard" (a menu inside the menu). The page and this menu
// talk through browser events, so they always show the same tab, and any tab can be opened with /admin?tab=<key>.
const DASH_GROUPS = [
  { key: 'analytics', label: 'Analytics', icon: BarChart3, tabs: [
    { key: 'overview', label: 'Overview', icon: BarChart3 }, { key: 'traffic', label: 'Traffic', icon: TrendingUp }, { key: 'insights', label: 'Insights', icon: Activity },
    { key: 'academy', label: 'Academy', icon: BookOpen }, { key: 'certificates', label: 'Certificates', icon: GraduationCap }, { key: 'course-feedback', label: 'Course feedback', icon: MessageSquare },
  ] },
  { key: 'communications', label: 'Communications', icon: Mail, tabs: [
    { key: 'enquiries', label: 'Enquiries', icon: Mail }, { key: 'cowork', label: 'Cowork', icon: Users }, { key: 'emails', label: 'Emails', icon: Send }, { key: 'comments', label: 'Comments', icon: MessageSquare },
  ] },
  { key: 'bookings', label: 'Bookings', icon: Calendar, tabs: [{ key: 'bookings', label: 'All requests', icon: Calendar }] },
  { key: 'system', label: 'System', icon: Settings, tabs: [
    { key: 'storage', label: 'Storage', icon: HardDrive }, { key: 'seo', label: 'SEO health', icon: Search }, { key: 'indexing', label: 'Indexing', icon: Globe },
    { key: 'auth-log', label: 'Auth log', icon: Lock }, { key: 'setup', label: 'Setup', icon: Settings },
  ] },
]

// Grouped by the job being done, so each group is short and its pages belong together:
// run the business, sell, work LinkedIn, publish content, look after learners, settings.
const GROUPS = [
  { title: 'Home', items: [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, dash: true },
    { href: '/admin/sessions', label: 'Work history', icon: History },
    { href: '/admin/costs', label: 'Costs', icon: Wallet },
  ] },
  { title: 'Sales', items: [
    { href: '/crm', label: 'CRM', icon: Briefcase },
    { href: '/admin/weekend', label: 'AI Weekend', icon: CalendarDays },
    { href: '/admin/events', label: 'Events', icon: Calendar },
    { href: '/admin/tech-calls', label: 'Tech calls', icon: PhoneCall },
  ] },
  { title: 'LinkedIn', items: [
    { href: '/admin/linkedin-hub', label: 'LinkedIn hub', icon: Network },
    { href: '/admin/autopilot', label: 'Autopilot', icon: Bot },
    { href: '/admin/linkedin', label: 'Connection', icon: Linkedin },
  ] },
  { title: 'Content', items: [
    { href: '/admin/social', label: 'Social studio', icon: Sparkles },
    { href: '/admin/blog', label: 'Blog studio', icon: PenLine },
    { href: '/admin/video-series', label: 'Cert videos', icon: Film },
  ] },
  { title: 'Learners', items: [
    { href: '/admin/lms', label: 'Learning Studio', icon: GraduationCap },
    { href: '/admin/community', label: 'Community', icon: Users },
    { href: '/admin/comments', label: 'Blog comments', icon: MessageSquare },
    { href: '/crm/botlog', label: 'GennoorCare chats', icon: MessageCircle },
  ] },
  { title: 'Settings', items: [
    { href: '/admin/mailboxes', label: 'Mailboxes', icon: Mail },
  ] },
]

// Same idiom as the website's own navigation rail: a #f5f5f7 panel with a hairline border, the logo on top, quiet
// monochrome icons, and a soft tinted pill on the current page.
const ROW = 'flex items-center gap-[11px] rounded-lg px-3 py-2 text-[13.5px] transition-colors duration-100'
const ROW_IDLE = 'text-gray-900 font-normal hover:bg-[#eaeaef]'
const ROW_ACTIVE = 'bg-primary-100 text-primary-600 font-semibold'
const SUB = 'flex items-center gap-2.5 rounded-md pl-3 pr-2 py-1.5 text-[13px] transition-colors duration-100'

function Badge({ n }: { n?: number }) {
  return n ? <span className="ml-auto px-1.5 py-0.5 min-w-[20px] text-center text-xs leading-none rounded-full bg-red-500 text-white">{n}</span> : null
}

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
  const [tab, setTab] = useState('overview')
  const [badges, setBadges] = useState<Record<string, number>>({})
  // The dashboard's sixteen sections stay folded away unless you are on the dashboard
  const [dashOpen, setDashOpen] = useState(false)
  const [openGroup, setOpenGroup] = useState('analytics')

  useEffect(() => { try { setCollapsed(localStorage.getItem('admin-rail') === 'collapsed') } catch { /* default open */ } }, [])
  useEffect(() => { setOpen(false) }, [path])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    const onTab = (e: Event) => { const t = String((e as CustomEvent).detail); setTab(t); const g = DASH_GROUPS.find(x => x.tabs.some(y => y.key === t)); if (g) setOpenGroup(g.key) }
    const onBadges = (e: Event) => setBadges((e as CustomEvent).detail || {})
    window.addEventListener('keydown', onKey); window.addEventListener('admin:tab', onTab); window.addEventListener('admin:badges', onBadges)
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('admin:tab', onTab); window.removeEventListener('admin:badges', onBadges) }
  }, [])
  // Opening /admin?tab=x straight from a link highlights that tab before the page has reported in.
  useEffect(() => {
    if (path !== '/admin') { setDashOpen(false); return }
    const q = new URLSearchParams(window.location.search).get('tab')
    if (q) { setTab(q); const g = DASH_GROUPS.find(x => x.tabs.some(y => y.key === q)); if (g) setOpenGroup(g.key) }
    setDashOpen(true)
  }, [path])
  const toggle = () => setCollapsed(c => { try { localStorage.setItem('admin-rail', c ? 'open' : 'collapsed') } catch { /* ignore */ } return !c })

  if (path.startsWith('/admin/login') || path.startsWith('/admin/crm-complete')) return <>{children}</>

  const onDash = path === '/admin'
  const current = GROUPS.flatMap(g => g.items).find(i => (i.href === '/admin' ? onDash : path === i.href || path.startsWith(i.href + '/')))
  const labels = !collapsed
  const section = GROUPS.find(g => g.items.some(i => i === current))
  const dashTab = onDash ? DASH_GROUPS.flatMap(g => g.tabs.map(tb => ({ ...tb, group: g.label }))).find(tb => tb.key === tab) : undefined
  const pickTab = (e: React.MouseEvent, key: string) => {
    if (!onDash) return // a normal link to /admin?tab=key
    e.preventDefault()
    window.dispatchEvent(new CustomEvent('admin:select-tab', { detail: key }))
  }

  return (
    <div data-admin className="h-dvh flex bg-gray-50 text-gray-900">
      <RouteProgress />
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
                  const on = n === current && !(n.dash && onDash)
                  return (
                    <li key={n.href}>
                      {n.dash ? (
                        <div className={`${ROW} ${ROW_IDLE} ${labels ? '' : 'justify-center px-0'} ${onDash ? 'font-semibold' : ''}`}>
                          <Link href="/admin" title={labels ? undefined : n.label} className="flex items-center gap-[11px] flex-1 min-w-0">
                            <n.icon className={`w-[17px] h-[17px] shrink-0 ${onDash ? 'text-primary-600' : 'text-[#86868b]'}`} strokeWidth={1.7} />
                            {labels && <span className="truncate">{n.label}</span>}
                          </Link>
                          {labels && <button onClick={() => setDashOpen(o => !o)} aria-label={dashOpen ? 'Hide dashboard sections' : 'Show dashboard sections'} aria-expanded={dashOpen} className="p-0.5 -mr-1 rounded text-gray-500 hover:bg-white">
                            <ChevronRight className={`w-4 h-4 transition-transform duration-150 ${dashOpen ? 'rotate-90' : ''}`} /></button>}
                        </div>
                      ) : (
                        <Link href={n.href} title={labels ? undefined : n.label} aria-current={on ? 'page' : undefined}
                          className={`${ROW} ${on ? ROW_ACTIVE : ROW_IDLE} ${labels ? '' : 'justify-center px-0'}`}>
                          <n.icon className={`w-[17px] h-[17px] shrink-0 ${on ? 'text-primary-600' : 'text-[#86868b]'}`} strokeWidth={1.7} />
                          {labels && <span className="truncate">{n.label}</span>}
                        </Link>
                      )}

                      {/* The menu inside the menu: the dashboard's own sections */}
                      {n.dash && labels && dashOpen && (
                        <ul className="mt-0.5 mb-1 ml-[22px] pl-2 border-l border-[#e0e0e6] space-y-0.5">
                          {DASH_GROUPS.map(dg => {
                            const isOpen = openGroup === dg.key
                            const total = badges[dg.key]
                            return (
                              <li key={dg.key}>
                                <button onClick={() => setOpenGroup(isOpen ? '' : dg.key)} aria-expanded={isOpen} className={`${SUB} w-full text-gray-700 font-medium hover:bg-[#eaeaef]`}>
                                  <dg.icon className="w-[15px] h-[15px] shrink-0 text-[#86868b]" strokeWidth={1.7} />
                                  <span className="truncate">{dg.label}</span>
                                  {!isOpen && <Badge n={total} />}
                                  <ChevronRight className={`w-3.5 h-3.5 ${isOpen && total ? '' : 'ml-auto'} shrink-0 text-gray-400 transition-transform duration-150 ${isOpen ? 'rotate-90' : ''}`} />
                                </button>
                                {isOpen && (
                                  <ul className="ml-3 pl-2 border-l border-[#e0e0e6] space-y-0.5 py-0.5">
                                    {dg.tabs.map(tb => {
                                      const act = onDash && tab === tb.key
                                      return (
                                        <li key={tb.key}>
                                          <Link href={`/admin?tab=${tb.key}`} onClick={e => pickTab(e, tb.key)} aria-current={act ? 'page' : undefined}
                                            className={`${SUB} ${act ? 'bg-primary-100 text-primary-600 font-semibold' : 'text-gray-800 hover:bg-[#eaeaef]'}`}>
                                            <tb.icon className={`w-[15px] h-[15px] shrink-0 ${act ? 'text-primary-600' : 'text-[#86868b]'}`} strokeWidth={1.7} />
                                            <span className="truncate">{tb.label}</span>
                                            <Badge n={badges[tb.key]} />
                                          </Link>
                                        </li>
                                      )
                                    })}
                                  </ul>
                                )}
                              </li>
                            )
                          })}
                        </ul>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className={`border-t border-[#e8e8ed] ${labels ? 'p-3' : 'p-2'} space-y-0.5`}>
          <a href="/" target="_blank" rel="noreferrer" title="View site" className={`${ROW} ${ROW_IDLE} ${labels ? '' : 'justify-center px-0'}`}>
            <ExternalLink className="w-[17px] h-[17px] shrink-0 text-[#86868b]" strokeWidth={1.7} />{labels && <span>View site</span>}
          </a>
          <button onClick={() => signOut({ callbackUrl: '/admin/login' })} title="Sign out" className={`${ROW} ${ROW_IDLE} w-full text-left ${labels ? '' : 'justify-center px-0'} hover:text-red-600`}>
            <LogOut className="w-[17px] h-[17px] shrink-0 text-[#86868b]" strokeWidth={1.7} />{labels && <span>Sign out</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Phone top bar: the hamburger opens the same menu as a drawer */}
        <header className="lg:hidden shrink-0 h-12 flex items-center gap-3 px-3 border-b border-gray-200 bg-white">
          <button onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open} className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-700 hover:bg-gray-100"><Menu className="w-5 h-5" /></button>
          <span className="text-sm font-semibold">Gennoor Admin</span>
          {current && <span className="text-sm text-gray-500">/ {current.label}</span>}
        </header>
        {/* Where you are, and the connected pages of this section one click away */}
        {current && section && (
          <div className="shrink-0 min-h-11 px-4 lg:px-5 py-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-gray-200 bg-white">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[13px] text-gray-500 min-w-0">
              <span>{section.title}</span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-300 shrink-0" />
              <span className={`truncate ${dashTab ? '' : 'text-gray-900 font-medium'}`}>{current.label}</span>
              {dashTab && <><ChevronRight className="w-3.5 h-3.5 text-gray-300 shrink-0" /><span className="text-gray-500 truncate">{dashTab.group}</span><ChevronRight className="w-3.5 h-3.5 text-gray-300 shrink-0" /><span className="text-gray-900 font-medium truncate">{dashTab.label}</span></>}
            </nav>
            {section.items.length > 1 && (
              <div className="sm:ml-auto flex items-center gap-1 overflow-x-auto max-w-full" role="tablist" aria-label={`${section.title} pages`}>
                {section.items.map(i => (
                  <Link key={i.href} href={i.href} role="tab" aria-selected={i === current}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] whitespace-nowrap transition-colors ${i === current ? 'bg-gray-800 text-white font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
                    <i.icon className="w-3.5 h-3.5" strokeWidth={1.8} />{i.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
        <main key={path} className="flex-1 min-h-0 overflow-y-auto admin-page-in">{children}</main>
      </div>
    </div>
  )
}
