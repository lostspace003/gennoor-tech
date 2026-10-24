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
  href?: string
  icon: LucideIcon
  children?: PortalNavChild[]
}

/**
 * The primary left-rail tree.
 */
export const portalNav: PortalNavSection[] = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Claude', href: '/claude', icon: Sparkles },
  { name: 'Training', href: '/training', icon: GraduationCap },
  { name: 'Exam Prep', href: '/services/certifications', icon: BadgeCheck },
  { name: 'Webinar & Expert Talks', href: '/webinars', icon: Video },
  { name: 'Post & Blogs', href: '/resources/blog', icon: FileText },
  { name: 'Automation', href: '/automation', icon: Wrench },
  {
    name: 'Learning Studio',
    icon: BookOpen,
    children: [
      { name: 'Courses', href: '/studio' },
      { name: 'Community', href: '/community' },
    ],
  },
  { name: 'About', href: '/about', icon: Info },
  { name: 'Contact', href: '/contact', icon: Mail },
]

/**
 * Resolve a friendly label for a path segment used by the breadcrumb.
 * Falls back to title-casing the raw slug.
 */
const BREADCRUMB_LABELS: Record<string, string> = {
  '/': 'Home',
  '/claude': 'Claude',
  '/training': 'Training',
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
