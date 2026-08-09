import { allPrograms, type TrainingProgram } from '@/data/training-programs'
import { courses as academyCourses } from '@/data/academy/courses'
import type { Course as AcademyCourse } from '@/data/academy/types'
import { pocs, type PoC } from '@/data/pocs'
import { caseStudies, type CaseStudy } from '@/data/case-studies'

/**
 * What Gennoor can actually sell, in a form a model can reason over.
 *
 * Before this existed, every research and proposal prompt knew our offerings
 * only as a ten-line paragraph ("diagnose → train → POC → develop → sustain"),
 * so the best it could ever say was "training". The catalogue on the site —
 * ~45 programmes, ~28 POCs and the delivered case studies — was invisible to
 * it. This module turns that catalogue into a compact, code-addressable index
 * so the AI can name the specific programme or POC that fits a lead, and so we
 * can resolve its answer back to something real (no invented course names).
 *
 * Server-side only in practice (it pulls the site data files), but it holds no
 * server-only imports itself.
 */

export type OfferingKind = 'training' | 'poc' | 'case'
export type JourneyPhase = 'diagnose' | 'train' | 'poc' | 'development' | 'sustain'

export interface OfferingRef {
  /** Stable, model-quotable id: TRN-bootcamp-1, POC-hr-onboarding-copilot, CASE-… */
  code: string
  kind: OfferingKind
  title: string
  /** Where it sits on the 5-step journey. */
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
    href: `/academy/courses/${c.slug}`,
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

// POCs are the Build step but carry the problem they solve — that problem
// statement is what makes a match feel specific rather than catalogue-shaped.
function pocRef(p: PoC): OfferingRef {
  const phase: JourneyPhase = p.phaseTag.includes('Train') ? 'train'
    : p.phaseTag.includes('Diagnose') ? 'diagnose'
    : p.phaseTag.includes('Sustain') ? 'sustain'
    : 'poc'
  return {
    code: `POC-${p.id}`,
    kind: 'poc',
    title: p.title,
    phase,
    industries: p.industries || [],
    functions: p.functions || [],
    href: `/services/poc-development#${p.id}`,
    line: [
      `POC-${p.id}`,
      p.title,
      p.timeline,
      `industries: ${(p.industries || []).join(', ') || 'any'}`,
      p.functions?.length ? `functions: ${p.functions.join(', ')}` : '',
      `solves: ${clip(p.problem, 150)}`,
      p.pairedCourseTitle ? `pairs with training: ${p.pairedCourseTitle}` : '',
    ].filter(Boolean).join(' | '),
  }
}

// Delivered work. Not something to sell — something to cite honestly when a
// lead asks "have you done this before?". Keeps the AI off invented proof.
function caseRef(c: CaseStudy): OfferingRef {
  return {
    code: `CASE-${c.id}`,
    kind: 'case',
    title: c.title,
    phase: 'train',
    industries: c.industry ? [c.industry] : [],
    functions: [],
    href: '/portfolio',
    line: [
      `CASE-${c.id}`,
      c.title,
      `client: ${c.client} (${c.industry})`,
      [c.duration, c.participants].filter(Boolean).join(' · '),
      `did: ${clip(c.approach?.[0], 120)}`,
    ].filter(Boolean).join(' | '),
  }
}

let cached: OfferingRef[] | null = null

export function allOfferings(): OfferingRef[] {
  if (!cached) {
    cached = [
      ...allPrograms.map(trainingRef),
      ...academyCourses.map(academyRef),
      ...pocs.map(pocRef),
      ...caseStudies.map(caseRef),
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
  if ((interest.includes('poc') || interest.includes('development')) && o.kind === 'poc') n += 4
  if (interest.includes('advisory') && o.phase === 'diagnose') n += 3

  if (f.techProfile === 'technical' && /technical|engineer|developer|advanced|builder/i.test(o.line)) n += 2
  if (f.techProfile === 'non-technical' && /executive|business|leader|foundational|beginner|all-staff|manager/i.test(o.line)) n += 2

  // Training first, POC second — the house order, applied as a tiebreak
  if (o.kind === 'training') n += 1.5
  else if (o.kind === 'poc') n += 1
  return n
}

/**
 * The catalogue as prompt text. `filter` biases which entries survive the cap;
 * everything relevant to the lead's sector/function stays, the rest is trimmed.
 */
export function offeringsIndex(filter: OfferingFilter = {}, limits?: { training?: number; poc?: number; cases?: number }): string {
  const cap = { training: limits?.training ?? 22, poc: limits?.poc ?? 16, cases: limits?.cases ?? 5 }
  const pick = (kind: OfferingKind, n: number) =>
    allOfferings()
      .filter((o) => o.kind === kind)
      .map((o) => ({ o, s: score(o, filter) }))
      .sort((a, b) => b.s - a.s)
      .slice(0, n)
      .map((x) => x.o.line)

  return [
    'TRAINING PROGRAMMES (the Train step — bootcamps and courses we actually run):',
    ...pick('training', cap.training),
    '',
    'PROOF-OF-CONCEPT BUILDS (the POC step — each with the problem it solves and a typical timeline):',
    ...pick('poc', cap.poc),
    '',
    'DELIVERED WORK (real engagements — cite these for credibility; never invent others):',
    ...pick('case', cap.cases),
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
