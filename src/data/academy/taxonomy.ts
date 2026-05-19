import type { TrackInfo, LevelInfo, Func, Industry, Audience, Stack } from './types'

export const tracks: TrackInfo[] = [
  {
    id: 'foundations',
    label: 'Foundations',
    description: 'AI literacy for everyone — what AI is, what it isn\'t, and where it fits in modern work.',
    tagline: 'Start here if your team is new to AI.',
  },
  {
    id: 'function',
    label: 'By Function',
    description: 'AI applied to the work you actually do — HR, Finance, Sales, Customer Service, Operations, Legal.',
    tagline: 'Function-specific, with real workflows.',
  },
  {
    id: 'leadership',
    label: 'Leadership',
    description: 'Strategy, governance, risk, and ROI for executives and boards. No code.',
    tagline: 'Built for C-suites and boards.',
  },
  {
    id: 'industry',
    label: 'By Industry',
    description: 'Vertical-specific AI applications — BFSI, Healthcare, Manufacturing, Government, Energy, Retail, Education.',
    tagline: 'Sector-aware, regulator-conscious.',
  },
  {
    id: 'builder',
    label: 'Builder',
    description: 'For technical practitioners — prompt engineering, agent design, RAG, MLOps, evaluation.',
    tagline: 'Hands-on. Stack-flexible.',
  },
  {
    id: 'applied',
    label: 'Applied (Case-led)',
    description: 'Deep case studies — real-world applications walked through end-to-end.',
    tagline: 'Learn by seeing it built.',
  },
]

export const levels: LevelInfo[] = [
  {
    id: 'foundational',
    label: 'Foundational',
    description: 'No prerequisites. For everyone — including non-technical audiences.',
  },
  {
    id: 'intermediate',
    label: 'Intermediate',
    description: 'Builds on foundational concepts. Some prior AI exposure helpful.',
  },
  {
    id: 'advanced',
    label: 'Advanced',
    description: 'Deeper specialization. For practitioners actively building or leading AI work.',
  },
  {
    id: 'mastery',
    label: 'Mastery',
    description: 'Expert-level. For practitioners shaping AI strategy or running production systems.',
  },
]

export const audienceLabels: Record<Audience, string> = {
  'all-staff': 'All staff',
  'individual-contributor': 'Individual contributor',
  manager: 'Manager',
  director: 'Director',
  executive: 'Executive',
  board: 'Board',
  technical: 'Technical practitioner',
}

export const functionLabels: Record<Func, string> = {
  hr: 'HR & People',
  finance: 'Finance & Accounting',
  sales: 'Sales & Marketing',
  'customer-service': 'Customer Service',
  operations: 'Operations & Supply Chain',
  'legal-compliance': 'Legal & Compliance',
  'it-engineering': 'IT & Engineering',
  strategy: 'Strategy',
}

export const industryLabels: Record<Industry, string> = {
  'financial-services': 'Financial Services',
  healthcare: 'Healthcare',
  manufacturing: 'Manufacturing',
  government: 'Government & Public Sector',
  'energy-utilities': 'Energy & Utilities',
  'retail-ecommerce': 'Retail & E-commerce',
  education: 'Education',
  'cross-industry': 'Cross-Industry',
}

export const stackLabels: Record<Stack, string> = {
  microsoft: 'Microsoft',
  aws: 'AWS',
  gcp: 'Google Cloud',
  'open-source': 'Open-source',
  'stack-agnostic': 'Stack-agnostic',
}
