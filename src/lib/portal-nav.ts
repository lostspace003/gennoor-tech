/**
 * Portal navigation tree — the hierarchical IA powering the Azure-style left rail.
 *
 * Mirrors siteConfig.navigation.main but augmented with:
 *  - a lucide icon per section and per child
 *  - flat-link sections (no children) supported via the `href` field directly
 *  - a small "pinned" set surfaced at the top of the rail (Home, AI Academy, Book a call)
 */

import {
  Home,
  GraduationCap,
  Briefcase,
  Compass,
  BookOpen,
  Info,
  Mail,
  // Programs
  Layers,
  Cpu,
  Bot,
  Map,
  BadgeCheck,
  // Services
  Building2,
  Users,
  Lightbulb,
  FlaskConical,
  Handshake,
  // Resources
  Sparkles,
  FileText,
  Video,
  CalendarDays,
  Wrench,
  Activity,
  // About
  Route,
  Building,
  ShieldCheck,
  Award,
  FolderOpen,
  Star,
  Github,
  // Misc
  Phone,
  Rocket,
  Zap,
} from 'lucide-react'

import type { LucideIcon } from 'lucide-react'

export interface PortalNavChild {
  name: string
  href: string
  icon?: LucideIcon
  badge?: 'New' | 'Free' | 'Hot'
  description?: string
}

export interface PortalNavSection {
  name: string
  /** Every section is a page of its own: there is nothing in the menu that only opens another menu. */
  href?: string
  icon: LucideIcon
  /** Further pages of the section. They are always shown under it, never folded away. */
  children?: PortalNavChild[]
  /** A small blue tag beside the name, for the one thing we want noticed. */
  badge?: string
  /** Draws a hairline above this row: the first row of a new group. */
  startsGroup?: boolean
}

/**
 * The menu, in the order a visitor reads it: learn on your own, then what we do for teams,
 * then talks and posts, then the company.
 *
 * It has one level. A section that has more than one page is itself the link to its main
 * page, and its other pages are listed under it, always visible. There is no row that only
 * opens a list, and no list inside a list: keep it that way when adding a page.
 */
export const portalNav: PortalNavSection[] = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'AI Weekend', href: '/ai-weekend', icon: Zap, badge: 'Live' },
  {
    name: 'Learning Studio',
    href: '/studio',
    icon: BookOpen,
    children: [
      { name: 'Community', href: '/community' },
    ],
  },
  { name: 'Exam Prep', href: '/services/certifications', icon: BadgeCheck },
  {
    name: 'Claude',
    href: '/claude',
    icon: Sparkles,
    startsGroup: true,
    children: [
      { name: 'Certification Prep', href: '/claude/certifications', badge: 'New' },
    ],
  },
  { name: 'Training', href: '/training', icon: GraduationCap },
  { name: 'Automation', href: '/automation', icon: Wrench },
  { name: 'Webinar & Expert Talks', href: '/webinars', icon: Video, startsGroup: true },
  { name: 'Post & Blogs', href: '/resources/blog', icon: FileText },
  { name: 'About', href: '/about', icon: Info, startsGroup: true },
  { name: 'Contact', href: '/contact', icon: Mail },
]

/**
 * Resolve a friendly label for a path segment used by the breadcrumb.
 * Falls back to title-casing the raw slug.
 */
const BREADCRUMB_LABELS: Record<string, string> = {
  '/': 'Home',
  '/claude': 'Claude',
  '/claude/certifications': 'Certification Prep',
  '/claude/certifications/associate-foundations': 'Associate – Foundations',
  '/claude/certifications/developer-foundations': 'Developer – Foundations',
  '/claude/certifications/architect-foundations': 'Architect – Foundations',
  '/claude/certifications/architect-professional': 'Architect – Professional',
  '/training': 'Training',
  '/ai-weekend': 'AI Weekend',
  '/automation': 'Automation',
  '/services/training': 'Training programs',
  '/services/training/curriculum': 'Curriculum',
  '/services/certifications': 'Exam Prep',
  '/studio': 'Learning Studio',
  '/ai-academy': 'AI Essentials',
  '/ai-readiness': 'AI Readiness',
  '/resources': 'Resources',
  '/resources/blog': 'Post & Blogs',
  '/resources/calendar': 'Book a call',
  '/webinars': 'Webinar & Expert Talks',
  '/workshops': 'Workshops',
  '/workshops/claude-cowork': 'Claude workshop recap',
  '/about': 'About',
  '/about/certifications': 'Credentials',
  '/about/founder': 'Jalal Ahmed Khan',
  '/contact': 'Contact',
  '/join': 'Work with us',
  '/community': 'Community',
}

export function labelForPath(path: string): string {
  if (BREADCRUMB_LABELS[path]) return BREADCRUMB_LABELS[path]
  const last = path.split('/').filter(Boolean).pop() ?? ''
  if (!last) return 'Home'
  if (/^[a-z]{1,3}-\d{2,3}$/i.test(last)) return last.toUpperCase() // course codes: ai-103 -> AI-103
  return last
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

// Path prefixes that have no page of their own, so they are left out of the trail.
const NO_PAGE = new Set(['/services', '/resources', '/guides', '/services/training/curriculum'])

export function breadcrumbsFor(pathname: string): { label: string; href: string }[] {
  if (!pathname || pathname === '/') {
    return [{ label: 'Home', href: '/' }]
  }
  const segs = pathname.split('/').filter(Boolean)
  const trail: { label: string; href: string }[] = [{ label: 'Home', href: '/' }]
  let acc = ''
  for (const s of segs) {
    acc += `/${s}`
    if (NO_PAGE.has(acc)) continue
    trail.push({ label: labelForPath(acc), href: acc })
  }
  return trail
}

/**
 * Whether an item is active for a given pathname — exact match or descendant.
 */
export function isItemActive(href: string, pathname: string): boolean {
  if (!href) return false
  if (href === '/') return pathname === '/'
  // Strip query/hash for active matching
  const cleanHref = href.split('#')[0].split('?')[0]
  return pathname === cleanHref || pathname.startsWith(cleanHref + '/')
}

export function isSectionActive(section: PortalNavSection, pathname: string): boolean {
  if (section.href && isItemActive(section.href, pathname)) return true
  if (section.children) {
    return section.children.some(c => isItemActive(c.href, pathname))
  }
  return false
}

export { Rocket, GraduationCap }
