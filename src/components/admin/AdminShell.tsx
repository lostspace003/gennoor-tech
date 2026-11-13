'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import RouteProgress from '@/components/portal/RouteProgress'
import {
  LayoutDashboard, Linkedin, Sparkles, GraduationCap, MessageSquare, Users, PhoneCall, Mail, Menu, X, ExternalLink, Wallet, PenLine, Bot, Network, History,
  ChevronLeft, ChevronRight, PanelLeftOpen, BarChart3, TrendingUp, Activity, BookOpen, Send, Calendar, Settings, HardDrive, Search, Globe, Lock, LogOut, Briefcase, MessageCircle,
  Film, CalendarDays, LineChart, Megaphone, } from 'lucide-react'

/**
 * The frame of the admin centre: the menu on the left, where you are at the top.
 *
 * The menu has ONE level: groups of pages, every row a page. Nothing in it opens another
 * list (docs/DESIGN.md, "The menu"). The dashboard has sixteen sections of its own; they
 * are the tabs of that page, so they sit at the top of the page, in two rows: the four
 * kinds first, then the sections of the kind that is open. The page and this bar talk
 * through browser events, so they always show the same section, and any section can be
 * opened with /admin?tab=<key>.
 */
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
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/sessions', label: 'Work history', icon: History },
    { href: '/admin/costs', label: 'Costs', icon: BarChart3 },
  ] },
  { title: 'Sales', items: [
    { href: '/crm', label: 'CRM', icon: Briefcase },
    { href: '/admin/payments', label: 'Payments', icon: Wallet },
    { href: '/admin/weekend', label: 'AI Weekend', icon: CalendarDays },
    { href: '/admin/events', label: 'Events', icon: Calendar },
    { href: '/admin/tech-calls', label: 'Tech calls', icon: PhoneCall },
  ] },
  { title: 'LinkedIn', items: [
    { href: '/admin/linkedin-hub', label: 'LinkedIn hub', icon: Network },
    { href: '/admin/autopilot', label: 'Autopilot', icon: Bot },
    { href: '/admin/campaign', label: 'Film campaign', icon: Megaphone },
    { href: '/admin/linkedin', label: 'Connection', icon: Linkedin },
  ] },
  { title: 'Content', items: [
    { href: '/admin/social', label: 'Social studio', icon: Sparkles },
    { href: '/admin/blog', label: 'Blog studio', icon: PenLine },
    { href: '/admin/video-series', label: 'Cert videos', icon: Film },
  ] },
  { title: 'Learners', items: [
    { href: '/admin/learners', label: 'Learner analytics', icon: LineChart },
    { href: '/admin/lms', label: 'Learning Studio', icon: GraduationCap },
    { href: '/admin/community', label: 'Community', icon: Users },
    { href: '/admin/comments', label: 'Blog comments', icon: MessageSquare },
    { href: '/crm/botlog', label: 'GennoorCare chats', icon: MessageCircle },
  ] },
  { title: 'Settings', items: [
    { href: '/admin/mailboxes', label: 'Mailboxes', icon: Mail },
  ] },
]

// Same idiom as the website's own menu: a quiet panel with a hairline border, the logo on top,
// monochrome icons, and a soft tinted pill on the current page.
const ROW = 'flex items-center gap-[11px] rounded-lg px-3 py-2 text-[13.5px] transition-colors duration-100'
const ROW_IDLE = 'text-gray-900 font-normal hover:bg-[#eaeaef]'
const ROW_ACTIVE = 'bg-primary-100 text-primary-600 font-semibold'

function Badge({ n }: { n?: number }) {
  return n ? <span className="px-1.5 py-0.5 min-w-[20px] text-center text-xs leading-none rounded-full bg-red-500 text-white">{n}</span> : null
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

/** Admin frame: the menu is open by default (it folds to icons, and that is remembered); on phones it is a drawer. */
export default function AdminShell({ children }: { children: React.ReactNode }) {
  const path = usePathname() || ''
  const [open, setOpen] = useState(false) // mobile drawer
  const [collapsed, setCollapsed] = useState(false) // desktop: icons only
  const [tab, setTab] = useState('overview')
  const [badges, setBadges] = useState<Record<string, number>>({})

  useEffect(() => { try { setCollapsed(localStorage.getItem('admin-rail') === 'collapsed') } catch { /* default open */ } }, [])
  useEffect(() => { setOpen(false) }, [path])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    const onTab = (e: Event) => setTab(String((e as CustomEvent).detail))
    const onBadges = (e: Event) => setBadges((e as CustomEvent).detail || {})
    window.addEventListener('keydown', onKey); window.addEventListener('admin:tab', onTab); window.addEventListener('admin:badges', onBadges)
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('admin:tab', onTab); window.removeEventListener('admin:badges', onBadges) }
  }, [])
  // Opening /admin?tab=x straight from a link shows that section before the page has reported in.
  useEffect(() => {
    if (path !== '/admin') return
    const q = new URLSearchParams(window.location.search).get('tab')
    if (q) setTab(q)
  }, [path])
  const toggle = () => setCollapsed(c => { try { localStorage.setItem('admin-rail', c ? 'open' : 'collapsed') } catch { /* ignore */ } return !c })

  if (path.startsWith('/admin/login') || path.startsWith('/admin/crm-complete')) return <>{children}</>

  const onDash = path === '/admin'
  const current = GROUPS.flatMap(g => g.items).find(i => (i.href === '/admin' ? onDash : path === i.href || path.startsWith(i.href + '/')))
  const labels = !collapsed
  const section = GROUPS.find(g => g.items.some(i => i === current))
  const dashGroup = DASH_GROUPS.find(g => g.tabs.some(t => t.key === tab)) ?? DASH_GROUPS[0]
  const dashTab = dashGroup.tabs.find(t => t.key === tab) ?? dashGroup.tabs[0]
  const pickTab = (e: React.MouseEvent, key: string) => {
    e.preventDefault()
    setTab(key)
    // Written into the address as well: the dashboard reads it when it arrives, so a tab
    // picked while the dashboard is still loading is the one that opens.
    try { const u = new URL(window.location.href); u.searchParams.set('tab', key); window.history.replaceState(null, '', u) } catch { /* ignore */ }
    window.dispatchEvent(new CustomEvent('admin:select-tab', { detail: key }))
  }

  return (
    <div data-admin className="h-dvh flex bg-gray-50 text-gray-900">
      <RouteProgress />
      {open && <div className="fixed inset-0 z-40 bg-gray-900/25 backdrop-blur-[2px] lg:hidden" onClick={() => setOpen(false)} aria-hidden="true" />}

      <aside
        aria-label="Admin navigation"
        className={`fixed lg:static z-50 inset-y-0 left-0 w-[272px] max-w-[86vw] ${collapsed ? 'lg:w-[68px]' : 'lg:w-[248px]'} shrink-0 flex flex-col bg-[#f5f5f7] border-r border-[#e8e8ed] transition-[width,transform] duration-200 ease-out ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Mobile header */}
        <div className="flex items-center justify-between h-[52px] pl-4 pr-2 border-b border-[#e8e8ed] lg:hidden">
          <span className="text-[15px] font-semibold">Admin centre</span>
          <button onClick={() => setOpen(false)} className="p-2.5 rounded-lg text-gray-500 hover:bg-[#eaeaef]" aria-label="Close the menu"><X className="w-5 h-5" /></button>
        </div>

        {/* Logo + fold button (desktop) */}
        <div className={`hidden lg:block relative ${labels ? 'px-4 pt-5 pb-3' : 'px-2 pt-3 pb-2'}`}>
          {labels ? (
            <>
              <RailLogo />
              <button onClick={toggle} aria-label="Fold the menu to icons" title="Fold the menu to icons"
                className="absolute -right-3 top-[30px] z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white border border-[#d2d2d7] text-gray-600 shadow-sm hover:text-gray-900 hover:border-gray-400">
                <ChevronLeft className="w-[14px] h-[14px]" strokeWidth={2.25} />
              </button>
            </>
          ) : (
            <button onClick={toggle} aria-label="Open the menu" title="Open the menu" className="w-full flex items-center justify-center p-2 rounded-lg text-gray-500 hover:bg-[#eaeaef]">
              <PanelLeftOpen className="w-[17px] h-[17px]" strokeWidth={1.75} />
            </button>
          )}
        </div>

        {/* One level: groups of pages. Every row is a page. */}
        <nav className="flex-1 overflow-y-auto px-3 py-1.5" aria-label="Admin sections">
          {GROUPS.map((g, gi) => (
            <div key={g.title} className={gi > 0 ? 'mt-1.5 pt-1.5 border-t border-[#e8e8ed]' : ''}>
              {labels && <div className="px-3 pt-1.5 pb-1 text-[11.5px] font-semibold uppercase tracking-[0.06em] text-[#86868b]">{g.title}</div>}
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
        {/* Phone top bar: the three-line button opens the same menu as a drawer, and the bar says where you are */}
        <header className="lg:hidden shrink-0 h-12 flex items-center gap-2 px-3 border-b border-gray-200 bg-white min-w-0">
          <button onClick={() => setOpen(true)} aria-label="Open the menu" aria-expanded={open} className="w-10 h-10 shrink-0 rounded-lg flex items-center justify-center text-gray-700 hover:bg-gray-100"><Menu className="w-5 h-5" /></button>
          {current && section ? (
            <span className="flex min-w-0 items-center gap-1.5 text-sm">
              <span className="shrink-0 text-gray-500">{section.title}</span>
              <ChevronRight className="w-3.5 h-3.5 shrink-0 text-gray-300" />
              <span className="truncate font-semibold">{current.label}</span>
            </span>
          ) : <span className="text-sm font-semibold">Gennoor Admin</span>}
        </header>

        {/* Where you are (on a phone the top bar already says it) */}
        {current && section && (
          <div className={`shrink-0 border-b border-gray-200 bg-white ${onDash ? '' : 'hidden lg:block'}`}>
            <nav aria-label="Breadcrumb" className={`min-h-10 px-4 lg:px-5 py-2 items-center gap-1.5 text-[13px] text-gray-500 min-w-0 ${onDash ? 'hidden lg:flex' : 'flex'}`}>
              <span>{section.title}</span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-300 shrink-0" />
              <span className={`truncate ${onDash ? '' : 'text-gray-900 font-medium'}`}>{current.label}</span>
              {onDash && <><ChevronRight className="w-3.5 h-3.5 text-gray-300 shrink-0" /><span className="truncate">{dashGroup.label}</span><ChevronRight className="w-3.5 h-3.5 text-gray-300 shrink-0" /><span className="text-gray-900 font-medium truncate">{dashTab.label}</span></>}
            </nav>

            {/* The dashboard's own sections: the four kinds, then the sections of the kind that is open */}
            {onDash && (
              <div className="px-4 lg:px-5 pt-2.5 lg:pt-0 pb-2.5 space-y-2">
                <div className="flex gap-1 overflow-x-auto" role="tablist" aria-label="Kinds of dashboard section">
                  {DASH_GROUPS.map(g => {
                    const on = g === dashGroup
                    return (
                      <a key={g.key} href={`/admin?tab=${g.tabs[0].key}`} onClick={e => pickTab(e, g.tabs[0].key)} role="tab" aria-selected={on}
                        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13.5px] whitespace-nowrap transition-colors ${on ? 'bg-gray-900 text-white font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}>
                        <g.icon className="w-4 h-4" strokeWidth={1.8} />{g.label}<Badge n={badges[g.key]} />
                      </a>
                    )
                  })}
                </div>
                {dashGroup.tabs.length > 1 && (
                  <div className="flex gap-1 overflow-x-auto" role="tablist" aria-label={`${dashGroup.label} sections`}>
                    {dashGroup.tabs.map(tb => {
                      const on = tb === dashTab
                      return (
                        <a key={tb.key} href={`/admin?tab=${tb.key}`} onClick={e => pickTab(e, tb.key)} role="tab" aria-selected={on}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] whitespace-nowrap border transition-colors ${on ? 'border-primary-600 bg-primary-50 text-primary-700 font-semibold' : 'border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900'}`}>
                          <tb.icon className="w-3.5 h-3.5" strokeWidth={1.8} />{tb.label}<Badge n={badges[tb.key]} />
                        </a>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        <main key={path} className="flex-1 min-h-0 overflow-y-auto admin-page-in">{children}</main>
      </div>
    </div>
  )
}
