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
    description: 'Enterprise AI training, consulting and delivery',
    category: 'Resources',
    keywords: ['home', 'gennoor', 'start', 'main', 'landing'],
  },

  // ---- Programs -----------------------------------------------------------
  '/services/training': {
    title: 'Training Programs',
    description: 'Corporate AI training courses & bootcamps',
    category: 'Programs',
    keywords: ['corporate training', 'bootcamp', 'workshop', 'learn', 'upskill', 'course catalog', 'AI training'],
  },
  '/services/training#catalog': {
    title: 'Course Curriculum',
    description: 'Full catalogue of training programs and modules',
    category: 'Programs',
    keywords: ['curriculum', 'catalog', 'catalogue', 'syllabus', 'modules', 'courses', 'outline'],
  },
  '/services/enterprise-ai-roadmap-workshop': {
    description: 'Strategic AI planning workshop',
    category: 'Programs',
    keywords: ['strategy', 'roadmap', 'planning', 'executive', 'C-suite', 'transformation', 'digital'],
  },
  '/services/certifications': {
    title: 'Certifications',
    description: 'Microsoft certification prep courses',
    category: 'Programs',
    keywords: ['exam', 'cert', 'microsoft certified', 'badge', 'credential', 'prep', 'study', 'AZ', 'AI', 'PL', 'SC', 'DP'],
  },
  '/services/training-rollout': {
    description: 'How a training rollout runs end to end',
    category: 'Programs',
    keywords: ['rollout', 'delivery', 'onboarding', 'implementation', 'programme', 'schedule'],
  },
  '/services/ai-training-india': {
    description: 'AI training delivery in India',
    category: 'Programs',
    keywords: ['india', 'bangalore', 'mumbai', 'delhi', 'onsite', 'training', 'region'],
  },
  '/services/ai-training-saudi-arabia': {
    description: 'AI training delivery in Saudi Arabia',
    category: 'Programs',
    keywords: ['saudi', 'ksa', 'riyadh', 'jeddah', 'gulf', 'onsite', 'training', 'region'],
  },
  '/services/ai-training-remote': {
    description: 'Remote and virtual AI training delivery',
    category: 'Programs',
    keywords: ['remote', 'virtual', 'online', 'live online', 'distributed', 'training'],
  },
  '/workshops/claude-cowork': {
    title: 'Claude for Productivity',
    description: 'Free hands-on Claude workshop — event completed, view recap',
    category: 'Programs',
    keywords: ['claude', 'anthropic', 'cowork', 'free workshop', 'automation', 'AI assistant', 'productivity'],
  },

  // ---- Services -----------------------------------------------------------
  '/services': {
    title: 'Services',
    description: 'Everything Gennoor delivers, in one place',
    category: 'Services',
    keywords: ['services', 'offerings', 'what we do', 'capabilities'],
  },
  '/services/ai-strategy': {
    title: 'AI Strategy & Consulting',
    description: 'Enterprise AI roadmaps & governance frameworks',
    category: 'Services',
    keywords: ['consulting', 'strategy', 'governance', 'ROI', 'advisory', 'digital transformation', 'enterprise'],
  },
  '/services/poc-development': {
    title: 'PoC Development',
    description: 'Production-ready AI prototypes & demos',
    category: 'Services',
    keywords: ['prototype', 'proof of concept', 'demo', 'MVP', 'build', 'development', 'document intelligence', 'chatbot'],
  },
  '/services/agentic-ai': {
    title: 'Agentic AI Solutions',
    description: 'Multi-agent orchestration with LangChain & CrewAI',
    category: 'Services',
    keywords: ['agent', 'langchain', 'crewai', 'autogen', 'orchestration', 'multi-agent', 'autonomous', 'LLM'],
  },
  '/services/collaboration': {
    title: 'Collaboration',
    description: 'Partnership and collaboration opportunities',
    category: 'Services',
    keywords: ['partner', 'collaborate', 'joint venture', 'work together', 'alliance'],
  },
  '/the-gennoor-way': {
    title: 'The Gennoor Way',
    description: 'How we work — our delivery method and principles',
    category: 'Services',
    keywords: ['method', 'approach', 'process', 'how we work', 'principles', 'philosophy', 'delivery'],
  },
  '/industries': {
    description: 'AI work by industry and sector',
    category: 'Services',
    keywords: ['industry', 'sector', 'vertical', 'banking', 'healthcare', 'retail', 'government'],
  },
  '/functions': {
    description: 'AI use cases by business function',
    category: 'Services',
    keywords: ['function', 'department', 'HR', 'finance', 'marketing', 'operations', 'use case'],
  },

  // ---- Solutions ----------------------------------------------------------
  '/solutions': {
    title: 'Solutions',
    description: 'Packaged AI solutions by organisation size',
    category: 'Solutions',
    keywords: ['solutions', 'packages', 'offerings'],
  },
  '/solutions/for-smb': {
    title: 'For SMB',
    description: 'AI solutions for small and mid-size businesses',
    category: 'Solutions',
    keywords: ['SMB', 'small business', 'startup', 'mid-market', 'affordable', 'SME'],
  },
  '/solutions/for-enterprise': {
    title: 'For Enterprise',
    description: 'AI solutions for large enterprises',
    category: 'Solutions',
    keywords: ['enterprise', 'large', 'corporate', 'scale', 'governance', 'compliance'],
  },

  // ---- Resources ----------------------------------------------------------
  '/resources': {
    title: 'Resources',
    description: 'Blog, videos, webinars, workshops, PoCs and assessments',
    category: 'Resources',
    keywords: ['resources', 'hub', 'library', 'learn', 'materials', 'index'],
  },
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
  '/resources/videos': {
    title: 'Videos',
    description: 'Training videos & tutorials',
    category: 'Resources',
    keywords: ['video', 'youtube', 'tutorial', 'watch', 'recording', 'demo'],
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
  '/resources/pocs': {
    title: 'PoC Catalog',
    description: 'Browse proof-of-concept builds you can commission',
    category: 'Resources',
    keywords: ['PoC', 'proof of concept', 'catalog', 'catalogue', 'prototype', 'demo', 'builds'],
  },
  '/ai-readiness': {
    title: 'AI Readiness Assessment',
    description: "Check your organisation's AI readiness",
    category: 'Resources',
    keywords: ['assessment', 'readiness', 'quiz', 'score', 'evaluate', 'maturity', 'checklist'],
  },
  '/resources/calculators/ai-roi': {
    title: 'AI ROI Calculator',
    description: 'Estimate the return on an AI investment',
    category: 'Resources',
    keywords: ['ROI', 'calculator', 'cost', 'savings', 'business case', 'payback', 'estimate'],
  },
  '/resources/calculators/copilot-licensing': {
    title: 'Copilot Licensing Calculator',
    description: 'Work out Microsoft Copilot licensing costs',
    category: 'Resources',
    keywords: ['copilot', 'licensing', 'license', 'cost', 'calculator', 'M365', 'pricing', 'seats'],
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
  '/resources/guides/agentic-ai': {
    title: 'Agentic AI Guide',
    description: 'Complete guide to agentic AI systems',
    category: 'Guides',
    keywords: ['agentic', 'agent', 'autonomous AI', 'guide', 'multi-agent'],
  },
  '/resources/guides/enterprise-ai-training': {
    title: 'Enterprise AI Training Guide',
    description: 'Guide to corporate AI training programs',
    category: 'Guides',
    keywords: ['enterprise', 'corporate training', 'guide', 'L&D', 'upskilling'],
  },
  '/resources/guides/microsoft-copilot-studio': {
    title: 'Microsoft Copilot Studio Guide',
    description: 'Guide to building with Copilot Studio',
    category: 'Guides',
    keywords: ['copilot studio', 'microsoft', 'guide', 'chatbot', 'virtual agent'],
  },
  '/resources/guides/ai-readiness-checklist': {
    title: 'AI Readiness Checklist',
    description: 'A practical checklist before you start an AI programme',
    category: 'Guides',
    keywords: ['checklist', 'readiness', 'guide', 'prepare', 'assessment', 'before you start'],
  },

  // ---- About --------------------------------------------------------------
  '/about': {
    title: 'About',
    description: 'About Gennoor Tech and the team',
    category: 'About',
    keywords: ['about', 'company', 'who we are'],
  },
  '/about/journey': {
    title: 'My Journey',
    description: '14+ years in enterprise AI across 6 countries',
    category: 'About',
    keywords: ['about', 'jalal', 'journey', 'experience', 'background', 'bio', 'who'],
  },
  '/about/company': {
    title: 'Gennoor Tech',
    description: 'About the company and mission',
    category: 'About',
    keywords: ['company', 'about us', 'mission', 'vision', 'gennoor'],
  },
  '/about/team-and-delivery': {
    title: 'Team & Delivery',
    description: 'Who delivers the work and how the team is structured',
    category: 'About',
    keywords: ['team', 'delivery', 'people', 'consultants', 'capacity', 'structure'],
  },
  '/about/trust-and-security': {
    title: 'Trust & Security',
    description: 'Security posture, data handling and compliance',
    category: 'About',
    keywords: ['trust', 'security', 'compliance', 'GDPR', 'data protection', 'privacy', 'ISO'],
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
  '/about/story': {
    description: 'The Gennoor story',
    category: 'About',
    keywords: ['story', 'history', 'origin', 'background', 'why'],
  },
  '/portfolio/case-studies': {
    title: 'Case Studies',
    description: 'Client success stories & outcomes',
    category: 'About',
    keywords: ['case study', 'success story', 'client', 'results', 'outcome', 'portfolio'],
  },
  '/portfolio/testimonials': {
    title: 'Client Testimonials',
    description: 'What clients say about our work',
    category: 'About',
    keywords: ['testimonial', 'review', 'feedback', 'client says', 'recommendation'],
  },
  '/portfolio/open-source': {
    title: 'Open Source',
    description: 'Community contributions & projects',
    category: 'About',
    keywords: ['open source', 'github', 'contribution', 'community', 'projects'],
  },
  '/portfolio/demos': {
    title: 'Demos',
    description: 'Interactive product and build demos',
    category: 'About',
    keywords: ['demo', 'interactive', 'try', 'showcase', 'sandbox'],
  },
  '/portfolio': {
    title: 'Portfolio',
    description: 'Case studies, demos and open-source work',
    category: 'About',
    keywords: ['portfolio', 'work', 'projects', 'showcase'],
  },
  '/case-studies': {
    title: 'Case Studies',
    description: 'Client success stories & outcomes',
    category: 'About',
    keywords: ['case study', 'success story', 'client', 'results'],
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
  '/services',
  '/services/training-rollout',
  '/services/ai-training-india',
  '/services/ai-training-saudi-arabia',
  '/services/ai-training-remote',
  '/solutions',
  '/industries',
  '/functions',
  '/resources',
  '/academy/dashboard',
  '/workshops/claude-cowork',
  '/resources/calculators/ai-roi',
  '/resources/calculators/copilot-licensing',
  '/guides/ai-103-azure-ai-engineer',
  '/guides/ai-102-azure-ai-engineer',
  '/guides/ms-4004-copilot-365',
  '/guides/pl-300-power-bi-analyst',
  '/resources/guides/agentic-ai',
  '/resources/guides/enterprise-ai-training',
  '/resources/guides/microsoft-copilot-studio',
  '/resources/guides/ai-readiness-checklist',
  '/about',
  '/about/founder',
  '/about/story',
  '/portfolio',
  '/portfolio/case-studies',
  '/portfolio/testimonials',
  '/portfolio/open-source',
  '/portfolio/demos',
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
