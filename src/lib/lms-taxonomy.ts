/**
 * How every Learning Studio course is classified. One definition, used by the
 * catalog filters, the admin importer and the course data, so a new course
 * always lands in the right place.
 *
 *   platform  who the course is about (Microsoft, Google Cloud, AWS, Oracle, Claude ...)
 *   kind      what you get (certification prep, a project, a skills course)
 *   level     where to start
 *   topic     the skill (AI agents, RAG, security ...)
 *   domain    the line of work it is applied to (Finance, HR, Healthcare ...)
 */

/** Always shown in the filter, even before a platform has courses. */
export const PRIMARY_PLATFORMS = ['Microsoft', 'Google Cloud', 'AWS', 'Oracle', 'Claude'] as const
/** Shown once at least one course uses them. */
export const OTHER_PLATFORMS = ['OpenAI', 'Databricks', 'Snowflake', 'Salesforce', 'NVIDIA', 'Vendor-neutral'] as const
export const ALL_PLATFORMS: string[] = [...PRIMARY_PLATFORMS, ...OTHER_PLATFORMS]

export const KINDS = [
  { id: 'certification', label: 'Certification prep' },
  { id: 'project', label: 'Project' },
  { id: 'course', label: 'Use case' },
] as const

/**
 * Where a use-case course sits (filter: Area). Same five tracks as the interactive AI Essentials
 * courses, so a video course lines up with the course it replaces.
 */
export const TRACKS = [
  { id: 'foundations', label: 'Foundations', line: 'Understand AI and use it well' },
  { id: 'leadership', label: 'Leadership', line: 'Strategy, risk and governance for decision makers' },
  { id: 'function', label: 'Teams & functions', line: 'AI for HR, sales, support, operations and more' },
  { id: 'industry', label: 'Industries', line: 'AI applied to finance, healthcare, retail and more' },
  { id: 'builder', label: 'Builders', line: 'Build agents and RAG with real tools' },
] as const

export const LEVELS = ['Beginner', 'Intermediate', 'Expert'] as const

export const TOPICS = [
  'Generative AI',
  'AI Agents',
  'RAG & Search',
  'Prompt Engineering',
  'Machine Learning',
  'Data & Analytics',
  'Security & Governance',
  'DevOps & CI/CD',
  'Cloud Infrastructure',
  'Automation',
  'Fabric',
] as const

export const DOMAINS = [
  'Finance & Accounting',
  'Banking & Insurance',
  'HR & People',
  'Healthcare',
  'Legal & Compliance',
  'Sales & Marketing',
  'Customer Support',
  'Retail & E-commerce',
  'Manufacturing & Supply Chain',
  'Software Engineering',
  'Education',
  'Government',
] as const

export type Kind = (typeof KINDS)[number]['id']

// ---------------------------------------------------------------- custom options
// The admin can add filter values on top of the built-in lists above (a new company,
// type, level, topic or industry). They are stored by src/lib/lms-taxonomy-store.ts.

export const FACETS = ['vendor', 'kind', 'level', 'topic', 'domain'] as const
export type Facet = (typeof FACETS)[number]
export const MAX_OPTION_LENGTH = 40
export const MAX_CUSTOM_PER_FACET = 60

export interface CustomTaxonomy {
  vendor: string[]
  level: string[]
  topic: string[]
  domain: string[]
  kind: { id: string; label: string }[]
}
export const EMPTY_CUSTOM: CustomTaxonomy = { vendor: [], level: [], topic: [], domain: [], kind: [] }

/** Plain text only: no markup characters, single spaces, 2-40 chars, never the word free. Returns '' when invalid. */
export function cleanOptionName(raw: unknown): string {
  if (typeof raw !== 'string') return ''
  const s = raw.replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim()
  if (s.length < 2 || s.length > MAX_OPTION_LENGTH) return ''
  if (/[<>{}\\`]/.test(s)) return ''
  if (!/[\p{L}\p{N}]/u.test(s)) return ''
  if (/\bfree\b/i.test(s)) return ''
  return s
}

export function slugifyOption(name: string): string {
  return name.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

/** Built-in plus custom values for every facet. */
export function mergedOptions(custom: CustomTaxonomy = EMPTY_CUSTOM) {
  return {
    vendors: [...ALL_PLATFORMS, ...custom.vendor] as string[],
    levels: [...LEVELS, ...custom.level] as string[],
    topics: [...TOPICS, ...custom.topic] as string[],
    domains: [...DOMAINS, ...custom.domain] as string[],
    kinds: [...KINDS, ...custom.kind] as { id: string; label: string }[],
  }
}

/** True when the name already exists in the facet, ignoring case. */
export function optionExists(facet: Facet, name: string, custom: CustomTaxonomy = EMPTY_CUSTOM): boolean {
  const lc = name.toLowerCase()
  const m = mergedOptions(custom)
  if (facet === 'kind') return m.kinds.some(k => k.label.toLowerCase() === lc || k.id === slugifyOption(name))
  const list = facet === 'vendor' ? m.vendors : facet === 'level' ? m.levels : facet === 'topic' ? m.topics : m.domains
  return list.some(x => x.toLowerCase() === lc)
}

/** Coerce stored JSON into a safe CustomTaxonomy. */
export function sanitizeCustom(v: unknown): CustomTaxonomy {
  const o = (v && typeof v === 'object' ? v : {}) as Record<string, unknown>
  const strs = (x: unknown) => (Array.isArray(x) ? x.map(cleanOptionName).filter(Boolean) : [])
  const kinds = Array.isArray(o.kind)
    ? (o.kind as { id?: unknown; label?: unknown }[]).flatMap(k => {
        const label = cleanOptionName(k?.label)
        const id = typeof k?.id === 'string' ? k.id : ''
        return label && /^[a-z0-9-]{2,50}$/.test(id) ? [{ id, label }] : []
      })
    : []
  return { vendor: strs(o.vendor), level: strs(o.level), topic: strs(o.topic), domain: strs(o.domain), kind: kinds }
}

/** Best guess from a course title/code; the admin can always override. */
export function inferPlatform(text: string): string {
  if (/\b(AI|AZ|DP|PL|SC|MS|AB|MB)-\d{2,4}\b|microsoft|azure|copilot|foundry/i.test(text)) return 'Microsoft'
  if (/google|gcp|vertex|gemini|bigquery/i.test(text)) return 'Google Cloud'
  if (/\baws\b|amazon|bedrock|sagemaker/i.test(text)) return 'AWS'
  if (/oracle|\boci\b/i.test(text)) return 'Oracle'
  if (/claude|anthropic/i.test(text)) return 'Claude'
  if (/openai|chatgpt/i.test(text)) return 'OpenAI'
  if (/databricks/i.test(text)) return 'Databricks'
  if (/snowflake/i.test(text)) return 'Snowflake'
  if (/salesforce/i.test(text)) return 'Salesforce'
  if (/nvidia|cuda/i.test(text)) return 'NVIDIA'
  return 'Vendor-neutral'
}

export function inferKind(text: string): Kind {
  if (/\b[A-Z]{2,3}-\d{2,4}\b|exam|certif/i.test(text)) return 'certification'
  if (/project|capstone|build a |hands-on build/i.test(text)) return 'project'
  return 'course'
}

const TOPIC_HINTS: [string, RegExp][] = [
  ['Generative AI', /generative|\bllm\b|chat app|foundation model|gpt/i],
  ['AI Agents', /agent/i],
  ['RAG & Search', /\brag\b|retriev|ai search|vector|embedding/i],
  ['Prompt Engineering', /prompt/i],
  ['Machine Learning', /machine learning|\bml\b|model training/i],
  ['Data & Analytics', /analytic|data warehouse|power bi|sql|data engineering/i],
  ['Security & Governance', /secur|zero-trust|governance|responsible ai|compliance/i],
  ['DevOps & CI/CD', /ci-cd|ci\/cd|github actions|devops|pipeline/i],
  ['Cloud Infrastructure', /infrastructure|kubernetes|networking|landing zone/i],
  ['Automation', /automation|workflow|power automate/i],
  ['Fabric', /fabric/i],
]

export function inferTopics(text: string): string[] {
  return TOPIC_HINTS.filter(([, re]) => re.test(text)).map(([t]) => t).slice(0, 5)
}
