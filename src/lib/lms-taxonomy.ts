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
]

export function inferTopics(text: string): string[] {
  return TOPIC_HINTS.filter(([, re]) => re.test(text)).map(([t]) => t).slice(0, 5)
}
