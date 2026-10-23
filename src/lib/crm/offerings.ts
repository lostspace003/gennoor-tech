import { allPrograms, type TrainingProgram } from '@/data/training-programs'
import { courses as academyCourses } from '@/data/academy/courses'
import type { Course as AcademyCourse } from '@/data/academy/types'

/**
 * What Gennoor can actually sell, in a form a model can reason over: the training
 * programme catalogue, the Academy courses, automation, Claude training and the
 * Learning Studio courses. Each entry has a short code the model must quote, so its
 * answer can be resolved back to something real (no invented course names).
 */

export type OfferingKind = 'training' | 'automation' | 'studio'
export type JourneyPhase = 'diagnose' | 'train' | 'poc' | 'development' | 'sustain'

export interface OfferingRef {
  /** Stable, model-quotable id: TRN-bootcamp-1, AUTO-process, STUDIO-ai-103 */
  code: string
  kind: OfferingKind
  title: string
  /** Training is 'train'; automation is 'development'. */
  phase: JourneyPhase
  industries: string[]
  functions: string[]
  /** One line for the prompt index. */
  line: string
  /** Public page, when the offering has one. */
  href?: string
}

const clip = (s: string | undefined, n: number) => {
  const v = (s || '').replace(/\s+/g, ' ').trim()
  return v.length > n ? `${v.slice(0, n - 1)}…` : v
}

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

// Bootcamps and courses are the Train step; the level tells us whether they
// suit a technical or a business audience, which is half the targeting.
function trainingRef(p: TrainingProgram): OfferingRef {
  const cert = p.certCode || (p.certification === 'Yes' ? 'yes' : '')
  return {
    code: `TRN-${p.id}`,
    kind: 'training',
    title: p.title,
    phase: 'train',
    industries: p.industry ? [p.industry] : [],
    functions: [],
    href: `/services/training/${slugify(p.title)}`,
    line: [
      `TRN-${p.id}`,
      p.title,
      `${p.category} · ${p.duration} · ${p.level}`,
      `for: ${clip(p.audience, 60)}`,
      `tech: ${p.technology}`,
      cert ? `cert: ${cert}` : '',
      `industry: ${p.industry}`,
    ].filter(Boolean).join(' | '),
  }
}

/**
 * Academy courses. These are the vertical and by-function tracks (AI for
 * Finance & Accounting, AI in Healthcare…) that the delivery catalogue doesn't
 * carry, and they're tagged by function/industry/audience — which is exactly
 * what makes a match land. They're also what the POCs name as their paired
 * course, so including them lets a POC match pull its training partner in.
 */
function academyRef(c: AcademyCourse): OfferingRef {
  return {
    code: `TRN-${c.slug}`,
    kind: 'training',
    title: c.title,
    phase: 'train',
    industries: c.industries || [],
    functions: c.functions || [],
    href: "/ai-academy",
    line: [
      `TRN-${c.slug}`,
      c.title,
      `${c.track} track · ${c.duration} · ${c.level}`,
      `for: ${(c.audience || []).join(', ') || 'all'}`,
      c.functions?.length ? `functions: ${c.functions.join(', ')}` : '',
      c.industries?.length ? `industries: ${c.industries.join(', ')}` : '',
      c.hookSentence ? `value: ${clip(c.hookSentence, 110)}` : clip(c.subtitle, 110),
    ].filter(Boolean).join(' | '),
  }
}

// What we offer besides the programme catalogue. Kept short and factual: no prices, no timelines.
const SERVICE_REFS: OfferingRef[] = [
  {
    code: 'AUTO-process', kind: 'automation', title: 'Automation, one process at a time', phase: 'development',
    industries: [], functions: [], href: '/automation',
    line: 'AUTO-process | Automation, one process at a time | scoped in writing first, built with Claude and other AI tools, tested on the team\'s own examples | for: a process that costs a team hours every week | honest about what is not worth automating',
  },
  {
    code: 'AUTO-custom-course', kind: 'automation', title: 'Custom course to automate your own process', phase: 'train',
    industries: [], functions: [], href: '/training',
    line: 'AUTO-custom-course | Custom course to automate your own process | live course built around one process the team runs, so they learn to automate it themselves | for: teams that want to own the automation',
  },
  {
    code: 'TRN-claude', kind: 'training', title: 'Claude training for teams', phase: 'train',
    industries: [], functions: [], href: '/claude',
    line: 'TRN-claude | Claude training for teams | live sessions on Claude for everyday work, Claude Cowork and Claude Code, built around what the team does | Gennoor is Certified in the Claude Partner Network',
  },
  {
    code: 'STUDIO-ai-103', kind: 'studio', title: 'AI-103: Build and Ship AI Agents on Microsoft Azure', phase: 'train',
    industries: [], functions: ['it-engineering'], href: '/studio/ai-103',
    line: 'STUDIO-ai-103 | AI-103: Build and Ship AI Agents on Microsoft Azure | self-paced video course with labs, quizzes and a certificate | for: developers and architects building AI agents on Azure',
  },
  {
    code: 'STUDIO-ai-500', kind: 'studio', title: 'AI-500: Designing and Implementing Multi-Agent AI Solutions', phase: 'train',
    industries: [], functions: ['it-engineering'], href: '/studio/ai-500',
    line: 'STUDIO-ai-500 | AI-500: Designing and Implementing Multi-Agent AI Solutions | self-paced video course with labs, quizzes and a certificate | for: engineers designing multi-agent systems',
  },
]

let cached: OfferingRef[] | null = null

export function allOfferings(): OfferingRef[] {
  if (!cached) {
    cached = [
      ...allPrograms.map(trainingRef),
      ...academyCourses.map(academyRef),
      ...SERVICE_REFS,
    ]
  }
  return cached
}

export function findOffering(code: string): OfferingRef | undefined {
  const key = (code || '').trim().toUpperCase()
  return allOfferings().find((o) => o.code.toUpperCase() === key)
}

export interface OfferingFilter {
  sector?: string
  businessFunction?: string
  interest?: string
  companySize?: string
  techProfile?: string
}

const norm = (s: string | undefined) => (s || '').toLowerCase()

// The three catalogues label industries differently — the Academy uses slugs
// ('financial-services'), the delivery catalogue uses labels ('BFSI'), and a
// lead's sector is whatever the salesperson typed ('Retail Banking'). Both
// sides get folded into the same buckets so they can actually be compared.
const INDUSTRY_BUCKETS: Record<string, RegExp> = {
  'financial-services': /bank|bfsi|financ|insur|nbfc|fintech|capital|lending|audit|wealth/,
  healthcare: /health|hospital|clinic|pharma|medical|life science/,
  manufacturing: /manufact|factory|industrial|automotive|plant|supply chain|logistic/,
  government: /government|public sector|ministry|municipal|govt|citizen/,
  'energy-utilities': /energy|utilit|oil|gas|power|renewable/,
  'retail-ecommerce': /retail|e-?commerce|consumer|fmcg|telecom/,
  education: /education|school|universit|college|academy|edtech/,
  technology: /technolog|software|saas|it services|startup|product engineering/,
  legal: /legal|law firm|compliance|real estate/,
}

const FUNCTION_BUCKETS: Record<string, RegExp> = {
  hr: /hr|human resource|people|talent|l&d|learning/,
  finance: /financ|account|treasury|audit|controller/,
  sales: /sales|marketing|revenue|business development|growth/,
  'customer-service': /customer service|support|contact cent|cx/,
  operations: /operation|supply|procurement|logistic|delivery/,
  'legal-compliance': /legal|compliance|risk|governance/,
  'it-engineering': /it|tech|engineer|developer|data|platform|architect/,
  strategy: /leader|c-suite|csuite|executive|strategy|transformation|board/,
}

/**
 * Disambiguate sector phrases where one word belongs to another vertical:
 * "Retail Banking" is a bank, not a retailer, and would otherwise pull the
 * retail/e-commerce catalogue in ahead of the finance one.
 */
function normalizeSectorText(text: string): string {
  return norm(text)
    .replace(/\b(retail|consumer|corporate|investment|private|commercial)\s+bank\w*/g, 'bank')
    .replace(/\bretail\s+financ\w*/g, 'finance')
}

function buckets(text: string, table: Record<string, RegExp>): Set<string> {
  const hay = norm(text)
  const out = new Set<string>()
  if (!hay) return out
  for (const [key, re] of Object.entries(table)) {
    if (re.test(hay) || hay.includes(key)) out.add(key)
  }
  return out
}

const intersects = (a: Set<string>, b: Set<string>) => [...a].some((x) => b.has(x))

/**
 * Relevance score for pre-filtering. The index has to fit in a prompt without
 * crowding out the actual research, so entries the lead's own qualification
 * fields point at float to the top and the long tail gets trimmed.
 */
function score(o: OfferingRef, f: OfferingFilter): number {
  const interest = norm(f.interest)
  let n = 0

  const wantIndustry = buckets(normalizeSectorText(f.sector || ''), INDUSTRY_BUCKETS)
  if (wantIndustry.size) {
    if (intersects(wantIndustry, buckets(o.industries.join(' '), INDUSTRY_BUCKETS))) n += 7
    // Vertical wording in the title counts too ("AI in Financial Services")
    else if (intersects(wantIndustry, buckets(o.title, INDUSTRY_BUCKETS))) n += 6
    else if (/cross-industry|all|any/i.test(o.industries.join(' '))) n += 1
  }

  const wantFunction = buckets(f.businessFunction || '', FUNCTION_BUCKETS)
  if (wantFunction.size) {
    if (intersects(wantFunction, buckets(o.functions.join(' '), FUNCTION_BUCKETS))) n += 6
    else if (intersects(wantFunction, buckets(`${o.title} ${o.line}`, FUNCTION_BUCKETS))) n += 4
  }

  // Stated interest steers the KIND of thing we lead with
  if (interest.includes('train') && o.kind === 'training') n += 4
  if ((interest.includes('automat') || interest.includes('poc') || interest.includes('development')) && o.kind === 'automation') n += 4
  if (interest.includes('claude') && /claude/i.test(o.line)) n += 4
  if ((interest.includes('studio') || interest.includes('course')) && o.kind === 'studio') n += 4

  if (f.techProfile === 'technical' && /technical|engineer|developer|advanced|builder/i.test(o.line)) n += 2
  if (f.techProfile === 'non-technical' && /executive|business|leader|foundational|beginner|all-staff|manager/i.test(o.line)) n += 2

  // Training first, automation second: the house order, applied as a tiebreak
  if (o.kind === 'training') n += 1.5
  else if (o.kind === 'automation') n += 1
  return n
}

/**
 * The catalogue as prompt text. `filter` biases which entries survive the cap;
 * everything relevant to the lead's sector/function stays, the rest is trimmed.
 */
export function offeringsIndex(filter: OfferingFilter = {}, limits?: { training?: number }): string {
  const cap = limits?.training ?? 22
  const pick = (kind: OfferingKind, n: number) =>
    allOfferings()
      .filter((o) => o.kind === kind)
      .map((o) => ({ o, s: score(o, filter) }))
      .sort((a, b) => b.s - a.s)
      .slice(0, n)
      .map((x) => x.o.line)

  return [
    'TRAINING PROGRAMMES (what we teach live, plus Claude training):',
    ...pick('training', cap),
    '',
    'AUTOMATION (what we build and teach people to build):',
    ...pick('automation', 5),
    '',
    'LEARNING STUDIO COURSES (self-paced, with labs and certificates):',
    ...pick('studio', 5),
  ].join('\n')
}

/** Validate model output: keep only matches that name a catalogue entry. */
export function resolveOfferingCodes(codes: string[]): OfferingRef[] {
  const out: OfferingRef[] = []
  for (const c of codes) {
    const ref = findOffering(c)
    if (ref && !out.some((o) => o.code === ref.code)) out.push(ref)
  }
  return out
}
