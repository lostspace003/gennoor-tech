/**
 * ⌘K search index — DERIVED, not hand-maintained.
 *
 * Closes gap 1.5 in newinclusioncheck/README.md: the index used to be a
 * hardcoded array in SearchModal.tsx, so any route added or renamed in
 * `portal-nav.ts` silently disappeared from search until someone remembered
 * to edit that array by hand.
 *
 * How it works now:
 *  1. Every entry in `portalNav` (sections + children) is indexed automatically.
 *     Add a page to the rail and it becomes searchable with no extra step;
 *     rename an href there and search follows it.
 *  2. `PAGE_META` supplies rich descriptions/keywords keyed by href. It is
 *     purely additive — a route with no metadata still gets indexed using its
 *     nav label and a derived description, so it can never vanish.
 *  3. `STANDALONE_ROUTES` covers real pages that are intentionally not in the
 *     rail (guides, calculators, legal, landing pages).
 *  4. `PRIVATE_PREFIXES` keeps internal surfaces (CRM, admin, dev) out.
 *
 * Adding a page: put it in the rail, or add its href to STANDALONE_ROUTES.
 * Metadata is optional polish, never a requirement for discoverability.
 */

import { portalNav } from './portal-nav'

export const SEARCH_CATEGORY_ORDER = [
  'Programs',
  'Services',
  'Solutions',
  'Resources',
  'Guides',
  'About',
  'Contact',
] as const

export type SearchCategory = (typeof SEARCH_CATEGORY_ORDER)[number]

export interface SearchablePage {
  title: string
  description: string
  href: string
  category: SearchCategory
  keywords: string[]
}

/** Internal surfaces that must never appear in public search. */
const PRIVATE_PREFIXES = ['/crm', '/admin', '/dev', '/demo', '/api', '/sitemap-index']

interface PageMeta {
  /** Override the nav label when the rail uses a shorter name. */
  title?: string
  description: string
  category?: SearchCategory
  keywords: string[]
}

/**
 * Curated metadata by href. Every key here should be a route that exists —
 * but a stale key is harmless (it only contributes if the route is indexed).
 */
const PAGE_META: Record<string, PageMeta> = {
  '/': {
    title: 'Home',
    description: 'AI training and automation, Mumbai, India',
    category: 'Resources',
    keywords: ['home', 'gennoor', 'start', 'main', 'landing'],
  },

  '/claude': {
    title: 'Claude',
    description: 'Claude Partner Network, Claude training and automation',
    category: 'Services',
    keywords: ['claude', 'anthropic', 'partner network', 'cowork', 'claude code'],
  },
  '/training': {
    title: 'Training',
    description: 'Training for organizations',
    category: 'Services',
    keywords: ['training', 'teams', 'organization', 'smb', 'custom course'],
  },
  '/automation': {
    title: 'Automation',
    description: 'Automation built one process at a time',
    category: 'Services',
    keywords: ['automation', 'workflow', 'process', 'build', 'agents'],
  },

  // ---- Programs -----------------------------------------------------------
  '/services/training': {
    title: 'Training Programs',
    description: 'Training course catalog',
    category: 'Programs',
    keywords: ['bootcamp', 'workshop', 'learn', 'upskill', 'course catalog', 'AI training'],
  },
  '/services/training#catalog': {
    title: 'Course Curriculum',
    description: 'Full catalogue of training programs and modules',
    category: 'Programs',
    keywords: ['curriculum', 'catalog', 'catalogue', 'syllabus', 'modules', 'courses', 'outline'],
  },
  '/services/certifications': {
    title: 'Certifications',
    description: 'Microsoft certification prep courses',
    category: 'Programs',
    keywords: ['exam', 'cert', 'microsoft certified', 'badge', 'credential', 'prep', 'study', 'AZ', 'AI', 'PL', 'SC', 'DP'],
  },
  '/workshops/claude-cowork': {
    title: 'Claude for Productivity',
    description: 'Free hands-on Claude workshop — event completed, view recap',
    category: 'Programs',
    keywords: ['claude', 'anthropic', 'cowork', 'free workshop', 'automation', 'AI assistant', 'productivity'],
  },

  // ---- Services -----------------------------------------------------------

  // ---- Solutions ----------------------------------------------------------

  // ---- Resources ----------------------------------------------------------
  '/studio': {
    title: 'Learning Studio',
    description: 'Certification and project courses, taught hands-on with labs and quizzes',
    category: 'Resources',
    keywords: ['video course', 'project', 'lab', 'AI-103', 'AI-500', 'certification', 'microsoft', 'studio'],
  },
  '/ai-academy': {
    title: 'AI Essentials',
    description: 'Free interactive AI courses you finish in an hour',
    category: 'Resources',
    keywords: ['free course', 'learn', 'academy', 'interactive', 'self-paced', 'essentials'],
  },
  '/academy/dashboard': {
    title: 'Academy Dashboard',
    description: 'Your progress, certificates, live sessions and analytics',
    category: 'Resources',
    keywords: ['dashboard', 'progress', 'my learning', 'certificate', 'analytics', 'profile', 'live sessions'],
  },
  '/resources/blog': {
    title: 'Blog',
    description: 'AI insights, tutorials & articles',
    category: 'Resources',
    keywords: ['article', 'post', 'tutorial', 'insights', 'news', 'write-up', 'thought leadership'],
  },
  '/webinars': {
    title: 'Webinars',
    description: 'Live and recorded webinar sessions',
    category: 'Resources',
    keywords: ['webinar', 'live session', 'online event', 'recording', 'presentation', 'register'],
  },
  '/workshops': {
    title: 'Workshops',
    description: 'Free hands-on AI workshops',
    category: 'Resources',
    keywords: ['workshop', 'hands-on', 'live', 'free session', 'claude cowork', 'bootcamp'],
  },
  '/ai-readiness': {
    title: 'AI Readiness Assessment',
    description: "Check your organisation's AI readiness",
    category: 'Resources',
    keywords: ['assessment', 'readiness', 'quiz', 'score', 'evaluate', 'maturity', 'checklist'],
  },
  '/resources/calendar': {
    title: 'Book a Discovery Call',
    description: 'Schedule a free consultation',
    category: 'Contact',
    keywords: ['book', 'call', 'schedule', 'meeting', 'consultation', 'calendar', 'appointment'],
  },

  // ---- Guides -------------------------------------------------------------
  '/guides/ai-103-azure-ai-engineer': {
    title: 'AI-103 Azure AI Engineer Guide',
    description: 'Study guide for AI-103: Developing AI Apps and Agents on Azure (replaces AI-102)',
    category: 'Guides',
    keywords: ['AI-103', 'AI-102', 'azure AI engineer', 'exam guide', 'study', 'certification prep', 'foundry', 'agents'],
  },
  '/guides/ai-102-azure-ai-engineer': {
    title: 'AI-102 Azure AI Engineer Guide (retiring)',
    description: 'AI-102 study guide — exam retires June 30, 2026',
    category: 'Guides',
    keywords: ['AI-102', 'azure AI engineer', 'exam guide', 'study', 'certification prep', 'retiring'],
  },
  '/guides/ms-4004-copilot-365': {
    title: 'MS-4004 Copilot for M365 Guide',
    description: 'Guide for Microsoft Copilot certification',
    category: 'Guides',
    keywords: ['MS-4004', 'copilot', 'microsoft 365', 'exam guide', 'study'],
  },
  '/guides/pl-300-power-bi-analyst': {
    title: 'PL-300 Power BI Analyst Guide',
    description: 'Study guide for Power BI certification',
    category: 'Guides',
    keywords: ['PL-300', 'power BI', 'analyst', 'data visualization', 'exam guide'],
  },

  // ---- About --------------------------------------------------------------
  '/about': {
    title: 'About',
    description: 'About Gennoor Tech',
    category: 'About',
    keywords: ['about', 'company', 'who we are'],
  },
  '/about/certifications': {
    title: 'Professional Certifications',
    description: '16 Microsoft & AI certifications',
    category: 'About',
    keywords: ['certifications', 'credentials', 'badges', 'microsoft certified', 'MCT', 'qualifications'],
  },
  '/about/founder': {
    description: 'About the founder',
    category: 'About',
    keywords: ['founder', 'jalal', 'owner', 'leadership', 'bio'],
  },

  // ---- Contact / legal ----------------------------------------------------
  '/contact': {
    title: 'Contact',
    description: 'Get in touch with us',
    category: 'Contact',
    keywords: ['contact', 'email', 'reach out', 'enquiry', 'message', 'get in touch'],
  },
  '/privacy': {
    title: 'Privacy Policy',
    description: 'How we handle your data',
    category: 'Contact',
    keywords: ['privacy', 'policy', 'data', 'GDPR', 'cookies', 'legal'],
  },
  '/terms': {
    title: 'Terms of Service',
    description: 'Terms and conditions of use',
    category: 'Contact',
    keywords: ['terms', 'conditions', 'legal', 'ToS', 'agreement'],
  },
}

/**
 * Real pages that are deliberately NOT in the left rail but must still be
 * findable. Keep this list in sync when adding standalone routes.
 */
const STANDALONE_ROUTES = [
  '/',
  '/academy/dashboard',
  '/workshops/claude-cowork',
  '/guides/ai-103-azure-ai-engineer',
  '/guides/ai-102-azure-ai-engineer',
  '/guides/ms-4004-copilot-365',
  '/guides/pl-300-power-bi-analyst',
  '/about',
  '/about/founder',
  '/privacy',
  '/terms',
]

/** Map a rail section name onto a search category. */
const SECTION_CATEGORY: Record<string, SearchCategory> = {
  Programs: 'Programs',
  Services: 'Services',
  Resources: 'Resources',
  About: 'About',
  Contact: 'Contact',
  'Learning Studio': 'Resources',
  'AI Readiness': 'Resources',
  'The Gennoor Way': 'Services',
  Home: 'Resources',
}

function isPrivate(href: string): boolean {
  return PRIVATE_PREFIXES.some(p => href === p || href.startsWith(p + '/'))
}

/** Last-resort category when neither metadata nor the rail says. */
function inferCategory(href: string): SearchCategory {
  if (href.startsWith('/guides/') || href.startsWith('/resources/guides/')) return 'Guides'
  if (href.startsWith('/solutions')) return 'Solutions'
  if (href.startsWith('/about') || href.startsWith('/portfolio')) return 'About'
  if (href === '/contact' || href === '/privacy' || href === '/terms') return 'Contact'
  if (href.startsWith('/services')) return 'Services'
  return 'Resources'
}

/** Turn '/resources/guides/agentic-ai' into 'Agentic Ai' as a fallback title. */
function titleFromHref(href: string): string {
  const last = href.split('#')[0].split('?')[0].split('/').filter(Boolean).pop() ?? ''
  if (!last) return 'Home'
  return last
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

/** Keywords derived from the title so an un-annotated page is still findable. */
function keywordsFromTitle(title: string): string[] {
  return title
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(w => w.length > 2)
}

function buildIndex(): SearchablePage[] {
  const byHref = new Map<string, SearchablePage>()

  const add = (href: string, navTitle?: string, sectionName?: string) => {
    if (!href || isPrivate(href)) return
    // Keep hash routes (e.g. /services/training#catalog) as distinct entries.
    if (byHref.has(href)) return

    const meta = PAGE_META[href]
    const title = meta?.title ?? navTitle ?? titleFromHref(href)
    const category =
      meta?.category ??
      (sectionName ? SECTION_CATEGORY[sectionName] : undefined) ??
      inferCategory(href)

    byHref.set(href, {
      title,
      href,
      category,
      description: meta?.description ?? `${title} — Gennoor Tech`,
      keywords: meta?.keywords ?? keywordsFromTitle(title),
    })
  }

  // 1. Everything in the rail, automatically.
  for (const section of portalNav) {
    if (section.href) add(section.href, section.name, section.name)
    for (const child of section.children ?? []) {
      add(child.href, child.name, section.name)
    }
  }

  // 2. Standalone routes that never appear in the rail.
  for (const href of STANDALONE_ROUTES) add(href)

  return Array.from(byHref.values())
}

/** The full searchable page list — derived once at module load. */
export const searchablePages: SearchablePage[] = buildIndex()
