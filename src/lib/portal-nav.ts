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
  {
    name: 'Home',
    href: '/',
    icon: Home,
  },
  {
    name: 'Programs',
    href: '/services/training',
    icon: GraduationCap,
    children: [
      { name: 'Training Programs', href: '/services/training', icon: Layers },
      { name: 'Course Curriculum (22)', href: '/services/training#catalog', icon: BookOpen },
      { name: 'Azure AI Foundry Workshop', href: '/services/azure-ai-foundry-workshop', icon: Cpu },
      { name: 'Copilot Studio Training', href: '/services/copilot-studio-training', icon: Bot },
      { name: 'Enterprise AI Roadmap', href: '/services/enterprise-ai-roadmap-workshop', icon: Map },
      { name: 'Certifications', href: '/services/certifications', icon: BadgeCheck },
    ],
  },
  {
    name: 'Services',
    href: '/services',
    icon: Briefcase,
    children: [
      { name: 'For SMB', href: '/solutions/for-smb', icon: Building2 },
      { name: 'For Enterprise', href: '/solutions/for-enterprise', icon: Users },
      { name: 'AI Strategy & Consulting', href: '/services/ai-strategy', icon: Lightbulb },
      { name: 'PoC Development', href: '/services/poc-development', icon: FlaskConical },
      { name: 'Agentic AI Solutions', href: '/services/agentic-ai', icon: Bot },
      { name: 'Collaboration', href: '/services/collaboration', icon: Handshake },
    ],
  },
  {
    name: 'The Gennoor Way',
    href: '/the-gennoor-way',
    icon: Compass,
  },
  {
    name: 'AI Academy',
    href: '/academy',
    icon: Sparkles,
    children: [
      { name: 'All Courses', href: '/academy', icon: BookOpen, badge: 'Free' },
      { name: 'AI Readiness Diagnostic', href: '/ai-readiness', icon: Activity },
    ],
  },
  {
    name: 'Resources',
    href: '/resources/blog',
    icon: BookOpen,
    children: [
      { name: 'Blog', href: '/resources/blog', icon: FileText },
      { name: 'Videos', href: '/resources/videos', icon: Video },
      { name: 'Webinars', href: '/webinars', icon: CalendarDays },
      { name: 'Workshops', href: '/workshops', icon: Wrench },
      { name: 'PoC Catalog', href: '/resources/pocs', icon: FlaskConical },
      { name: 'Book a Call', href: '/resources/calendar', icon: Phone },
    ],
  },
  {
    name: 'About',
    href: '/about',
    icon: Info,
    children: [
      { name: 'My Journey', href: '/about/journey', icon: Route },
      { name: 'Gennoor Tech', href: '/about/company', icon: Building },
      { name: 'Team & Delivery', href: '/about/team-and-delivery', icon: Users },
      { name: 'Trust & Security', href: '/about/trust-and-security', icon: ShieldCheck },
      { name: 'Certifications', href: '/about/certifications', icon: Award },
      { name: 'Case Studies', href: '/portfolio/case-studies', icon: FolderOpen },
      { name: 'Testimonials', href: '/portfolio/testimonials', icon: Star },
      { name: 'Open Source', href: '/portfolio/open-source', icon: Github },
    ],
  },
  {
    name: 'Contact',
    href: '/contact',
    icon: Mail,
  },
]

/**
 * Pinned shortcuts surfaced at the very top of the rail.
 * Kept short — these are the actions a logged-in user would reach for first.
 */
export const portalPinned: PortalNavChild[] = [
  { name: 'Book a Call', href: '/resources/calendar', icon: Phone },
  { name: 'AI Readiness', href: '/ai-readiness', icon: Activity },
  { name: 'AI Academy', href: '/academy', icon: Sparkles, badge: 'Free' },
]

/**
 * Resolve a friendly label for a path segment used by the breadcrumb.
 * Falls back to title-casing the raw slug.
 */
const BREADCRUMB_LABELS: Record<string, string> = {
  '/': 'Home',
  '/services': 'Services',
  '/services/training': 'Training Programs',
  '/services/training/curriculum': 'Curriculum',
  '/services/azure-ai-foundry-workshop': 'Azure AI Foundry Workshop',
  '/services/copilot-studio-training': 'Copilot Studio Training',
  '/services/enterprise-ai-roadmap-workshop': 'Enterprise AI Roadmap',
  '/services/certifications': 'Certifications',
  '/services/ai-strategy': 'AI Strategy & Consulting',
  '/services/poc-development': 'PoC Development',
  '/services/agentic-ai': 'Agentic AI Solutions',
  '/services/collaboration': 'Collaboration',
  '/solutions': 'Solutions',
  '/solutions/for-smb': 'For SMB',
  '/solutions/for-enterprise': 'For Enterprise',
  '/the-gennoor-way': 'The Gennoor Way',
  '/academy': 'AI Academy',
  '/ai-academy': 'AI Academy',
  '/ai-readiness': 'AI Readiness',
  '/resources': 'Resources',
  '/resources/blog': 'Blog',
  '/resources/videos': 'Videos',
  '/resources/pocs': 'PoCs',
  '/resources/calendar': 'Book a Call',
  '/webinars': 'Webinars',
  '/workshops': 'Workshops',
  '/about': 'About',
  '/about/journey': 'My Journey',
  '/about/company': 'Gennoor Tech',
  '/about/team-and-delivery': 'Team & Delivery',
  '/about/trust-and-security': 'Trust & Security',
  '/about/certifications': 'Certifications',
  '/portfolio': 'Portfolio',
  '/portfolio/case-studies': 'Case Studies',
  '/portfolio/testimonials': 'Testimonials',
  '/portfolio/open-source': 'Open Source',
  '/contact': 'Contact',
}

export function labelForPath(path: string): string {
  if (BREADCRUMB_LABELS[path]) return BREADCRUMB_LABELS[path]
  const last = path.split('/').filter(Boolean).pop() ?? ''
  if (!last) return 'Home'
  return last
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export function breadcrumbsFor(pathname: string): { label: string; href: string }[] {
  if (!pathname || pathname === '/') {
    return [{ label: 'Home', href: '/' }]
  }
  const segs = pathname.split('/').filter(Boolean)
  const trail: { label: string; href: string }[] = [{ label: 'Home', href: '/' }]
  let acc = ''
  for (const s of segs) {
    acc += `/${s}`
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
