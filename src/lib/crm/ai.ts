import { PIPELINE_STAGES } from './types'
import type { Lead, ChatMessage, AIResearch, OfferingMatch } from './types'
import { teamMember, signOffText } from './team'
import type { TeamMember } from './team'
import { offeringsIndex, findOffering } from './offerings'

// Real Azure OpenAI calls — same endpoint pattern the ai-readiness feature
// uses in production. When not configured we fail honestly instead of
// returning canned fake "research".
//
// Self-healing: several endpoint/key/deployment combos may be configured and
// some may be stale (dead DNS, deleted deployments). We try candidates in
// order and cache the first one that answers.
interface AiCandidate { endpoint: string; key: string; deployment: string; apiVersion: string }

function candidates(): AiCandidate[] {
  const v = (s?: string) => (s || '').trim()
  const list: AiCandidate[] = []
  if (v(process.env.AZURE_OPENAI_READINESS_ENDPOINT) && v(process.env.AZURE_OPENAI_READINESS_KEY)) {
    list.push({
      endpoint: v(process.env.AZURE_OPENAI_READINESS_ENDPOINT),
      key: v(process.env.AZURE_OPENAI_READINESS_KEY),
      deployment: v(process.env.AZURE_OPENAI_READINESS_DEPLOYMENT) || 'gpt-41-mini',
      apiVersion: '2024-12-01-preview',
    })
  }
  if (v(process.env.AZURE_OPENAI_ENDPOINT) && (v(process.env.AZURE_OPENAI_API_KEY) || v(process.env.AZURE_OPENAI_KEY))) {
    list.push({
      endpoint: v(process.env.AZURE_OPENAI_ENDPOINT),
      key: v(process.env.AZURE_OPENAI_API_KEY) || v(process.env.AZURE_OPENAI_KEY),
      deployment: v(process.env.AZURE_OPENAI_DEPLOYMENT) || 'gpt-4o',
      apiVersion: v(process.env.AZURE_OPENAI_API_VERSION) || '2024-12-01-preview',
    })
  }
  return list
}

let workingCandidate: AiCandidate | null = null

export function aiConfigured(): boolean {
  return candidates().length > 0
}

async function callCandidate(
  c: AiCandidate,
  messages: Array<{ role: string; content: string }>,
  options?: { json?: boolean; maxTokens?: number }
): Promise<string> {
  const base = c.endpoint.endsWith('/') ? c.endpoint : `${c.endpoint}/`
  const url = `${base}openai/deployments/${c.deployment}/chat/completions?api-version=${c.apiVersion}`
  const payload: Record<string, unknown> = {
    messages,
    ...(options?.json ? { response_format: { type: 'json_object' } } : {}),
  }
  // Newer models reject max_tokens in favor of max_completion_tokens; try
  // the modern name first and fall back once on unsupported_parameter.
  // 429s get one retry after the server's cooldown — deployments are shared.
  let response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'api-key': c.key },
    body: JSON.stringify({ ...payload, max_completion_tokens: options?.maxTokens ?? 1500 }),
  })
  if (response.status === 429) {
    const retryAfter = Math.min(Number(response.headers.get('retry-after')) || 12, 30)
    await new Promise((r) => setTimeout(r, retryAfter * 1000))
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'api-key': c.key },
      body: JSON.stringify({ ...payload, max_completion_tokens: options?.maxTokens ?? 1500 }),
    })
  }
  if (!response.ok) {
    const text = await response.text()
    if (/unsupported_parameter|max_completion_tokens/i.test(text)) {
      response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'api-key': c.key },
        body: JSON.stringify({ ...payload, max_tokens: options?.maxTokens ?? 1500 }),
      })
      if (!response.ok) throw new Error(`Azure OpenAI error ${response.status}: ${(await response.text()).slice(0, 300)}`)
    } else {
      throw new Error(`Azure OpenAI error ${response.status}: ${text.slice(0, 300)}`)
    }
  }
  const data = await response.json()
  return data.choices?.[0]?.message?.content || ''
}

export async function chatCompletion(
  messages: Array<{ role: string; content: string }>,
  options?: { json?: boolean; maxTokens?: number }
): Promise<string> {
  const list = workingCandidate ? [workingCandidate, ...candidates().filter((c) => c.endpoint !== workingCandidate!.endpoint)] : candidates()
  if (list.length === 0) {
    throw new Error('Azure OpenAI is not configured (AZURE_OPENAI_ENDPOINT / AZURE_OPENAI_KEY)')
  }
  let lastError: unknown
  for (const c of list) {
    try {
      const result = await callCandidate(c, messages, options)
      workingCandidate = c
      return result
    } catch (error) {
      lastError = error
      workingCandidate = null
    }
  }
  throw lastError
}

export function leadContext(lead: Lead): string {
  return [
    `Name: ${lead.name || '(blank)'}`,
    `Designation: ${lead.designation || '(blank)'}`,
    `Company: ${lead.company || '(blank)'}`,
    `Sector: ${lead.sector || '(blank)'}`,
    `Region/Country/City: ${[lead.region, lead.country, lead.city].filter(Boolean).join(' / ') || '(blank)'}`,
    `LinkedIn: ${lead.linkedin || '(blank)'}`,
    `Website: ${lead.website || '(blank)'}`,
    `Pipeline stage: ${lead.stage}`,
    // Qualification the team filled in by hand. These are OBSERVED facts, not
    // guesses — weight them above anything inferred about the company.
    `Company size: ${lead.companySize || '(not set)'}`,
    `Business function: ${lead.businessFunction || '(not set)'}`,
    `Stated interest: ${lead.interest || '(not set)'}`,
    `Decision role: ${lead.decisionRole || '(not set)'}`,
    `Priority: ${lead.priority || '(not set)'}`,
    lead.leadType ? `Lead type: ${lead.leadType}` : '',
    `Source: ${lead.source || 'unknown'}`,
    `Notes: ${lead.notes || '(none)'}`,
    lead.aiResearch ? `Existing research summary: ${lead.aiResearch.summary}` : '',
    lead.emailHistory?.length
      ? `Emails already sent to this lead (do NOT repeat their content; any new email must advance the conversation): ${lead.emailHistory
          .filter((e) => e.status === 'sent')
          .slice(0, 3)
          .map((e) => `"${e.subject}" on ${e.at.slice(0, 10)}`)
          .join('; ')}`
      : '',
  ].filter(Boolean).join('\n')
}

/**
 * The FULL research, rendered for downstream prompts. `leadContext` carries
 * only the summary — the chat and the proposal both need the findings, the
 * offering fit and the entry plan, or they re-derive them badly.
 */
export function researchContext(lead: Lead): string {
  const r = lead.aiResearch
  if (!r) return 'No research has been run on this lead yet.'
  const matches = (r.offeringMatches || [])
    .slice()
    .sort((a, b) => a.priority - b.priority)
    .map((m) => `  ${m.priority}. [${m.code}] ${m.title} (${m.phase}, ${m.confidence} confidence) — answers: ${m.need} — why: ${m.why}`)
  return [
    `RESEARCH (${r.webGrounded ? 'web-grounded' : 'data-only'}, updated ${r.lastUpdated?.slice(0, 10)})`,
    r.companyProfile ? `Company: ${r.companyProfile}` : `Summary: ${r.summary}`,
    r.personProfile ? `Person: ${r.personProfile}` : '',
    r.insights?.length ? `Findings:\n- ${r.insights.join('\n- ')}` : '',
    matches.length ? `Offering fit (our catalogue against their needs, in the order to lead with):\n${matches.join('\n')}` : '',
    r.entryPlan ? `Entry plan: ${r.entryPlan}` : '',
    r.opportunities?.length ? `Where we can help:\n- ${r.opportunities.join('\n- ')}` : '',
    r.approach ? `Recommended approach: ${r.approach}` : '',
    `Audience profile: ${r.techOrNonTech}`,
    r.sources?.length ? `Sources: ${r.sources.slice(0, 6).map((s) => s.url).join(', ')}` : '',
  ].filter(Boolean).join('\n')
}

export const GENNOOR_CONTEXT = `Gennoor Tech (www.gennoor.com) is an AI training and automation company in Mumbai, India. Gennoor is Certified in the Claude Partner Network (use exactly that wording, nothing more).
What Gennoor offers:
1. Training for organizations — live, custom training for a team on Claude and other AI tools (Claude, Microsoft AI, Azure AI, Copilot Studio), built around the work the team does. For smaller teams and larger organizations.
2. Automation — one process at a time, scoped in writing first, built with Claude and other AI tools. Honest about what is and is not worth automating.
3. Learning Studio — self-paced video courses with labs, quizzes and certificates (AI-103 and AI-500 are live), free AI Essentials courses, and Claude courses by domain being prepared.
Never quote prices, timelines or discounts. If cost comes up, say it depends on scope and suggest a short call.
Free relationship-building offers used in outreach: a free 2-hour webinar tailored to the company's needs, and a free 1-day online training. There is also a YouTube channel on AI agent development: https://www.youtube.com/@GennoorTech — whenever an email mentions the channel, include this exact link.
Contact: admin@gennoor.com, +91 9326352241.
STRICT RULES for anything you write: never invent statistics, client counts, or case studies. No fabricated claims like "100+ implementations" or "40% cost reduction". Be honest, specific and concise.
STYLE — business-grade brevity, always: lead with the point; short sentences; bullets over paragraphs; no filler ("I hope this helps", "it's worth noting"), no restating the question, no hedging boilerplate. Outreach emails stay under 170 words. Answers to the team: only the detail they need to act, nothing more.`

export async function researchLead(lead: Lead): Promise<{
  summary: string
  insights: string[]
  opportunities: string[]
  approach: string
  techOrNonTech: 'technical' | 'non-technical'
}> {
  const content = await chatCompletion(
    [
      {
        role: 'system',
        content: `${GENNOOR_CONTEXT}

You research sales leads for Gennoor's team. Based ONLY on the information given (do not invent facts about the company — if you are inferring, say "likely"), produce JSON:
{
  "summary": "2-3 sentence profile of this lead and company based on the data given",
  "insights": ["3-5 short observations relevant to selling AI training/consulting"],
  "opportunities": ["2-4 concrete Gennoor offerings that fit (training, automation, Learning Studio)"],
  "approach": "2-3 sentences: recommended first-touch approach for this lead",
  "techOrNonTech": "technical" or "non-technical" (judge from designation/company)
}`,
      },
      { role: 'user', content: leadContext(lead) },
    ],
    { json: true }
  )
  const parsed = JSON.parse(content)
  return {
    summary: parsed.summary || '',
    insights: Array.isArray(parsed.insights) ? parsed.insights : [],
    opportunities: Array.isArray(parsed.opportunities) ? parsed.opportunities : [],
    approach: parsed.approach || '',
    techOrNonTech: parsed.techOrNonTech === 'technical' ? 'technical' : 'non-technical',
  }
}

// Web-grounded research via Foundry's built-in web_search (when configured).
// Throws on failure — the route falls back to researchLead().
export async function researchLeadWeb(lead: Lead): Promise<{
  summary: string
  insights: string[]
  opportunities: string[]
  approach: string
  techOrNonTech: 'technical' | 'non-technical'
  sources: Array<{ title: string; url: string }>
}> {
  const { webGroundedCompletion } = await import('./foundry')
  const result = await webGroundedCompletion(
    `${GENNOOR_CONTEXT}

Research this sales lead using LIVE WEB SEARCH: look up the company (what it does, size, industry, recent news) and, where public, the person. Then return ONLY a JSON object (no markdown fences):
{"summary":"2-3 sentences grounded in what you found","insights":["3-5 findings relevant to selling AI training/consulting"],"opportunities":["2-4 Gennoor offerings that fit (training, automation, Learning Studio)"],"approach":"2-3 sentences: recommended first touch","techOrNonTech":"technical|non-technical"}
Facts you cannot verify stay out — no invention.`,
    leadContext(lead)
  )
  const match = result.text.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('Web research returned no JSON')
  const parsed = JSON.parse(match[0])
  return {
    summary: parsed.summary || '',
    insights: Array.isArray(parsed.insights) ? parsed.insights : [],
    opportunities: Array.isArray(parsed.opportunities) ? parsed.opportunities : [],
    approach: parsed.approach || '',
    techOrNonTech: parsed.techOrNonTech === 'technical' ? 'technical' : 'non-technical',
    sources: result.citations.slice(0, 8),
  }
}

/* ------------------------------------------------------------------ *
 * Deep research: three passes instead of one prompt doing everything.
 *
 * A single call had to profile the company, read the person AND pick our
 * offerings at once, from a lead row that is often just a name and a company.
 * It generalised, because that was the only honest thing it could do. These
 * passes each get one job, and the third one gets the actual catalogue.
 * ------------------------------------------------------------------ */

const firstJsonObject = (text: string): any => {
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('Model returned no JSON')
  return JSON.parse(match[0])
}

export interface CompanyPass {
  profile: string
  signals: string[]
  sizeEstimate: string
  aiMaturity: string
  sources: Array<{ title: string; url: string }>
}

// Pass 1 — the company. Web-grounded when Foundry is up, because this is the
// pass that genuinely needs the outside world.
export async function researchCompanyPass(lead: Lead, useWeb: boolean): Promise<CompanyPass> {
  const instructions = `${GENNOOR_CONTEXT}

PASS 1 of 3 — COMPANY. Profile ONLY the organization${useWeb ? ', using live web search: their site, recent news, hiring pages, published tech choices' : ' from the information provided'}. Do not discuss Gennoor's offerings — a later pass does that.
Return ONLY JSON (no fences):
{"profile":"3-5 sentences: what they do, who they serve, scale, how they operate","signals":["4-6 SPECIFIC observations that matter for AI adoption — systems in use, hiring, regulation, recent moves, stated priorities. Each names something concrete."],"sizeEstimate":"headcount/revenue band or 'unknown'","aiMaturity":"one of: none visible | experimenting | piloting | scaling — plus a half-sentence of evidence"${useWeb ? ',"sources":[{"title":"page title","url":"https://…"}]  ← every page you actually used; the team checks these' : ''}}
${useWeb ? 'Facts you cannot verify on the web stay out. Only list URLs you genuinely opened.' : 'Anything inferred must be marked "likely".'} Never invent named clients, numbers or partnerships.`

  if (useWeb) {
    const { webGroundedCompletion } = await import('./foundry')
    const result = await webGroundedCompletion(instructions, leadContext(lead))
    const parsed = firstJsonObject(result.text)
    // Inline url_citation annotations only attach to cited PROSE — this pass
    // returns pure JSON, so the model lists what it opened instead. Merge both
    // and de-dupe: the team clicks these to check the research.
    const declared = (Array.isArray(parsed.sources) ? parsed.sources : [])
      .filter((s: any) => s && typeof s.url === 'string' && /^https?:\/\//i.test(s.url))
      .map((s: any) => ({ title: String(s.title || s.url).slice(0, 160), url: String(s.url) }))
    const sources: Array<{ title: string; url: string }> = []
    for (const s of [...result.citations, ...declared]) {
      if (!sources.some((x) => x.url === s.url)) sources.push(s)
    }
    return {
      profile: parsed.profile || '',
      signals: Array.isArray(parsed.signals) ? parsed.signals : [],
      sizeEstimate: parsed.sizeEstimate || 'unknown',
      aiMaturity: parsed.aiMaturity || 'unknown',
      sources: sources.slice(0, 8),
    }
  }
  const parsed = firstJsonObject(
    await chatCompletion([{ role: 'system', content: instructions }, { role: 'user', content: leadContext(lead) }], { json: true })
  )
  return {
    profile: parsed.profile || '',
    signals: Array.isArray(parsed.signals) ? parsed.signals : [],
    sizeEstimate: parsed.sizeEstimate || 'unknown',
    aiMaturity: parsed.aiMaturity || 'unknown',
    sources: [],
  }
}

export interface PersonPass {
  profile: string
  techOrNonTech: 'technical' | 'non-technical'
  decisionRole: string
  cares: string[]
}

// Pass 2 — the person. Seniority, remit, and what would actually make them
// reply. Cheap, no web: designation plus the team's own qualification fields
// carry most of it, and public info on individuals is thin and risky.
export async function researchPersonPass(lead: Lead, companyProfile: string): Promise<PersonPass> {
  const parsed = firstJsonObject(
    await chatCompletion(
      [
        {
          role: 'system',
          content: `${GENNOOR_CONTEXT}

PASS 2 of 3 — THE PERSON. Read the individual, not the company. Where the team has already recorded a decision role or business function, TRUST IT over your own inference.
Return ONLY JSON:
{"profile":"2-3 sentences: their likely remit, what they own, what pressure they're under","techOrNonTech":"technical|non-technical","decisionRole":"Decision-maker|Influencer|End-user","cares":["3-4 things THIS person is measured on or worries about — concrete, role-specific, not generic 'efficiency'"]}
Say "likely" for anything inferred. Invent nothing about them personally.`,
        },
        { role: 'user', content: `${leadContext(lead)}\n\nCompany profile from pass 1:\n${companyProfile}` },
      ],
      { json: true }
    )
  )
  return {
    profile: parsed.profile || '',
    techOrNonTech: parsed.techOrNonTech === 'technical' ? 'technical' : 'non-technical',
    decisionRole: parsed.decisionRole || lead.decisionRole || '',
    cares: Array.isArray(parsed.cares) ? parsed.cares : [],
  }
}

// Pass 3 — the intersect. THIS is the pass that was missing: the real
// catalogue, scored against what passes 1 and 2 found, with training-first /
// automation-second ordering made explicit rather than left to the model's taste.
export async function matchOfferingsPass(
  lead: Lead,
  company: CompanyPass,
  person: PersonPass
): Promise<{
  summary: string
  insights: string[]
  opportunities: string[]
  approach: string
  offeringMatches: OfferingMatch[]
  entryPlan: string
  suggestedQuestions: string[]
}> {
  const catalogue = offeringsIndex({
    sector: lead.sector,
    businessFunction: lead.businessFunction,
    interest: lead.interest,
    companySize: lead.companySize,
    techProfile: person.techOrNonTech,
  })

  const parsed = firstJsonObject(
    await chatCompletion(
      [
        {
          role: 'system',
          content: `${GENNOOR_CONTEXT}

PASS 3 of 3 — THE INTERSECT. You have research on the company and the person, and the REAL Gennoor catalogue below. Find where they meet.

${catalogue}

RULES FOR MATCHING — these are what make the answer useful instead of generic:
- Every match must cite a code from the catalogue EXACTLY as written (TRN-…, AUTO-…, STUDIO-…). Never invent a programme, and never describe an offering that isn't listed.
- Every match must name the OBSERVED need it answers, drawn from the findings — not a generic benefit. If you cannot point at a specific finding, drop the match.
- 3-5 matches maximum. Fewer, well-argued matches beat a catalogue dump.
- ENTRY ORDER: training first, automation second. Training is how the relationship starts (it's low-risk and it's where the free webinar / 1-day session leads); automation is the natural second step once they've seen us teach. Give priority 1 to a training programme unless the lead's stated interest says otherwise (e.g. interest = "POC" or they already train internally) — if you invert the order, say why in entryPlan.
- Match the audience: technical people get the technical tracks, business/leadership get the executive ones.
- confidence: "high" only when a finding directly supports it; "low" when it's a reasonable guess.

Return ONLY JSON:
{"summary":"2-3 sentence profile of this lead and company",
 "insights":["3-5 short observations that matter for selling AI training/consulting"],
 "opportunities":["2-4 lines describing where we can help, in their language"],
 "approach":"2-3 sentences: the recommended first touch for THIS person",
 "offeringMatches":[{"code":"TRN-…","title":"exact catalogue title","phase":"train|development","need":"the observed need, quoting the finding","why":"why this offering specifically","priority":1,"confidence":"high|medium|low"}],
 "entryPlan":"2-3 sentences: which offering we lead with, what it sets up next, and why that order for this lead",
 "suggestedQuestions":["4-5 questions the sales team should ask the copilot next about THIS lead — each grounded in a specific finding, phrased as the team would type it, under 90 characters"]}`,
        },
        {
          role: 'user',
          content: [
            leadContext(lead),
            '',
            `COMPANY (pass 1): ${company.profile}`,
            `Signals: ${company.signals.join(' | ')}`,
            `Size: ${company.sizeEstimate} · AI maturity: ${company.aiMaturity}`,
            '',
            `PERSON (pass 2): ${person.profile}`,
            `Audience: ${person.techOrNonTech} · Decision role: ${person.decisionRole}`,
            `They care about: ${person.cares.join(' | ')}`,
          ].join('\n'),
        },
      ],
      { json: true, maxTokens: 2200 }
    )
  )

  // Only keep matches that name something we actually sell.
  const raw: any[] = Array.isArray(parsed.offeringMatches) ? parsed.offeringMatches : []
  const offeringMatches: OfferingMatch[] = []
  for (const m of raw) {
    const ref = findOffering(String(m.code || ''))
    if (!ref) continue
    if (offeringMatches.some((x) => x.code === ref.code)) continue
    offeringMatches.push({
      code: ref.code,
      title: ref.title,
      phase: (PIPELINE_STAGES as string[]).includes(m.phase) ? m.phase : ref.phase,
      need: String(m.need || '').slice(0, 300),
      why: String(m.why || '').slice(0, 300),
      priority: Number(m.priority) || offeringMatches.length + 1,
      confidence: ['high', 'medium', 'low'].includes(m.confidence) ? m.confidence : 'medium',
    })
  }
  // Models happily hand out "priority: 1" three times. Keep their relative
  // order (and the training-first rule as the tiebreak) but renumber 1..n so
  // the team gets an actual sequence to work through.
  const rank = { high: 0, medium: 1, low: 2 }
  offeringMatches
    .sort((a, b) =>
      a.priority - b.priority ||
      Number(a.phase !== 'train') - Number(b.phase !== 'train') ||
      rank[a.confidence] - rank[b.confidence]
    )
    .forEach((m, i) => { m.priority = i + 1 })

  return {
    summary: parsed.summary || '',
    insights: Array.isArray(parsed.insights) ? parsed.insights : [],
    opportunities: Array.isArray(parsed.opportunities) ? parsed.opportunities : [],
    approach: parsed.approach || '',
    offeringMatches,
    entryPlan: parsed.entryPlan || '',
    suggestedQuestions: (Array.isArray(parsed.suggestedQuestions) ? parsed.suggestedQuestions : [])
      .map((q: any) => String(q).slice(0, 120))
      .slice(0, 5),
  }
}

/**
 * The full agent: company → person → intersect. Each pass degrades on its own
 * — a failed web pass falls back to data-only, a failed person pass still
 * lets the intersect run — so the team always gets the best available answer
 * and `passes` records which ones actually happened.
 */
export async function researchLeadDeep(lead: Lead, opts: { web: boolean }): Promise<Omit<AIResearch, 'lastUpdated'>> {
  const passes: string[] = []
  let webGrounded = false

  let company: CompanyPass
  try {
    company = await researchCompanyPass(lead, opts.web)
    webGrounded = opts.web
    passes.push(opts.web ? 'company (web)' : 'company')
  } catch (error: any) {
    if (!opts.web) throw error
    console.error('Company pass (web) failed, retrying data-only:', error?.message)
    company = await researchCompanyPass(lead, false)
    passes.push('company')
  }

  let person: PersonPass
  try {
    person = await researchPersonPass(lead, company.profile)
    passes.push('person')
  } catch (error: any) {
    console.error('Person pass failed:', error?.message)
    person = {
      profile: '',
      techOrNonTech: /engineer|developer|cto|architect|data|technical|it /i.test(lead.designation || '') ? 'technical' : 'non-technical',
      decisionRole: lead.decisionRole || '',
      cares: [],
    }
  }

  const match = await matchOfferingsPass(lead, company, person)
  passes.push('offering match')

  return {
    summary: match.summary || company.profile,
    insights: match.insights.length ? match.insights : company.signals,
    opportunities: match.opportunities,
    approach: match.approach,
    techOrNonTech: person.techOrNonTech,
    sources: company.sources,
    webGrounded,
    companyProfile: company.profile,
    personProfile: [person.profile, person.cares.length ? `Cares about: ${person.cares.join('; ')}` : '']
      .filter(Boolean).join(' '),
    offeringMatches: match.offeringMatches,
    entryPlan: match.entryPlan,
    suggestedQuestions: match.suggestedQuestions,
    passes,
  }
}

/**
 * Live chat suggestions. Regenerated as the discussion moves so the chips stay
 * about what hasn't been covered yet, rather than repeating the research.
 */
export async function suggestQuestions(lead: Lead, history: ChatMessage[]): Promise<string[]> {
  const asked = history.filter((m) => m.role === 'user').slice(-8).map((m) => m.content).join(' | ')
  const content = await chatCompletion(
    [
      {
        role: 'system',
        content: `${GENNOOR_CONTEXT}

You suggest the NEXT questions a Gennoor salesperson should ask the research copilot about this lead. Ground every one in a specific finding or offering match below — no generic prompts like "tell me more". Skip anything already asked. Each under 90 characters, phrased as the salesperson would type it.
Return ONLY JSON: {"suggestions":["…","…","…","…"]}

${leadContext(lead)}

${researchContext(lead)}`,
      },
      { role: 'user', content: asked ? `Already asked in this chat: ${asked}\n\nSuggest 4 fresh next questions.` : 'Suggest 4 opening questions.' },
    ],
    { json: true, maxTokens: 400 }
  )
  const parsed = JSON.parse(content)
  return (Array.isArray(parsed.suggestions) ? parsed.suggestions : [])
    .map((s: any) => String(s).slice(0, 120))
    .filter(Boolean)
    .slice(0, 5)
}

export async function researchChat(lead: Lead, history: ChatMessage[]): Promise<string> {
  return chatCompletion([
    {
      role: 'system',
      content: `${GENNOOR_CONTEXT}

You are the CRM research copilot. The team is discussing this lead with you to sharpen the angle before the proposal and the email get written. Be concise and practical.

Ground your answers in the research below — quote the specific finding or offering code you're reasoning from. When you recommend something we'd sell, name the catalogue entry (its code and title) rather than a generic category, and respect the entry order: training first, POC second, unless the research argues otherwise. If the research doesn't cover what's being asked, say so and suggest what to look up — don't fill the gap with invention.

Lead data:
${leadContext(lead)}

${researchContext(lead)}`,
    },
    ...history.map((m) => ({ role: m.role, content: m.content })),
  ])
}

export async function finalizePitch(lead: Lead, history: ChatMessage[]): Promise<string> {
  return chatCompletion([
    {
      role: 'system',
      content: `${GENNOOR_CONTEXT}

Based on the research discussion below, write the FINAL locked pitch brief for this lead. This is an INTERNAL brief for the outreach team — NOT an email. STRICT FORMAT, exactly these four numbered sections and NOTHING else (no greeting, no sign-off, no subject line, no draft email, no closing remarks after section 4):
1) Likely need — one or two sentences
2) What we pitch — training, automation or a Learning Studio course
3) Free offer to lead with — 2-hour webinar or 1-day training, and the suggested topic
4) Tone — technical or non-technical, with one guidance sentence
Keep the whole brief under 180 words. Lead data:
${leadContext(lead)}`,
    },
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: 'Finalize the pitch brief now — the four sections only.' },
  ])
}

// One-page CLIENT-FACING document (markdown). Fresh generate pulls from
// research + copilot discussion; refine revises an existing version per the
// team's instruction. This is what gets exported to Word and emailed.
//
// Deliberately NOT a sales-pitch flyer: the lead reads it as a short written
// proposal about THEIR problem — what we understand, what we'd do about it,
// how it would start. Brochure language is banned outright below.
const proposalFormat = (sender: TeamMember) => `STRUCTURE — pure Markdown, exactly these sections, nothing else before or after:

# {Company name} — {plain description of the work, e.g. "Getting the operations team productive with AI"}
*Prepared for {name}{, designation if known} by {sender name}, Gennoor Tech*

## What we understand
(2-4 sentences on their situation and the problem in their own terms, grounded in the research. Anything inferred says "likely" or "as we understand it". No flattery, no "in today's fast-moving world" opener.)

## What we'd propose
(3-5 bullets, in the priority order given by the offering fit. Each bullet is ONE named piece of work from our catalogue — the actual programme or build, its shape (duration/audience/timeline), and the specific need of theirs it answers. Describe it in their language; do not print our internal codes. Drop anything the research can't justify — a short list that lands beats a long one that doesn't.)

## How we'd start
(2-3 sentences on the first step and what it needs from them. Follow the entry plan: training first, a build second, unless the research says otherwise. Where a free 2-hour webinar or free 1-day session is the sensible opener, put it here as a practical starting point — one line, stated plainly, not as an offer or promotion.)

## What this gives you
(2-3 bullets: the outcome for their team. Capability they keep, not features we sell. No invented numbers, no client counts, no superlatives.)

## Next step
(One sentence proposing a short call to confirm scope. Then a plain contact line: ${[sender.name, ...sender.phones, sender.email].filter(Boolean).join(' · ')})

HARD RULES:
- Every proposed item must come from the offering fit / catalogue you are given. Never invent a programme, duration, price or client.
- Under 320 words total. Written TO them, about their work.
- It must read like a considered note from someone who understood their problem — NOT marketing copy, NOT a brochure, NOT a deck slide.
- BANNED words and moves: "pitch", "cutting-edge", "leverage", "unlock", "empower", "revolutionise/revolutionize", "world-class", "best-in-class", "seamless", "game-changer", "excited to partner", "at Gennoor, we believe", exclamation marks, and any closing sales flourish.
- No invented facts, statistics, client counts or case studies.
- No internal jargon ("lead", "pipeline", "prospect").`

export async function generatePitchDoc(
  lead: Lead,
  history: ChatMessage[],
  base?: string,
  instruction?: string,
  senderEmail?: string
): Promise<string> {
  const sender = teamMember(senderEmail)
  const format = proposalFormat(sender)
  if (base && instruction) {
    return chatCompletion([
      {
        role: 'system',
        content: `${GENNOOR_CONTEXT}\n\nYou maintain the one-page client-facing proposal for this organization. Revise the current version according to the team's instruction and return the FULL revised document.\n\n${format}\n\nLead data:\n${leadContext(lead)}`,
      },
      { role: 'user', content: `CURRENT DOCUMENT:\n${base}\n\nINSTRUCTION: ${instruction}\n\nReturn the full revised one-pager now.` },
    ])
  }
  // The matched offerings, spelled out from the catalogue so the proposal can
  // name the real programme (with its real duration and audience) instead of
  // saying "training". Falls back to a filtered catalogue slice when research
  // hasn't produced matches yet.
  const matched = (lead.aiResearch?.offeringMatches || [])
    .map((m) => {
      const ref = findOffering(m.code)
      return ref ? `${ref.line}\n   → answers: ${m.need}\n   → why: ${m.why} (priority ${m.priority}, ${m.confidence} confidence)` : ''
    })
    .filter(Boolean)
  const catalogue = matched.length
    ? `OFFERINGS MATCHED TO THIS LEAD — propose these, in this order:\n${matched.join('\n')}`
    : `No offering match has been computed yet. Choose from the catalogue below and stay inside it:\n${offeringsIndex({
        sector: lead.sector,
        businessFunction: lead.businessFunction,
        interest: lead.interest,
        techProfile: lead.aiResearch?.techOrNonTech,
      }, { training: 12 })}`

  return chatCompletion([
    {
      role: 'system',
      content: `${GENNOOR_CONTEXT}\n\nWrite the one-page client-facing proposal for this organization, using the research, the offering fit and the team's copilot discussion below as grounding.\n\n${format}\n\nLead data:\n${leadContext(lead)}\n\n${researchContext(lead)}\n\n${catalogue}`,
    },
    ...history.slice(-20).map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: 'Write the one-page proposal now — the sections only.' },
  ])
}

export const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@GennoorTech'

// Safety net: if a draft mentions the YouTube channel but the model dropped
// the URL, splice it in so the lead always gets a clickable link.
export function ensureYouTubeLink(body: string): string {
  if (!body || body.includes('youtube.com')) return body
  if (/YouTube channel/i.test(body)) return body.replace(/YouTube channel/i, (m) => `${m} (${YOUTUBE_CHANNEL_URL})`)
  return body
}

// Every outreach draft is signed by the person working the lead — their name,
// direct number and own gennoor.com address, so replies and calls reach them.
export function signOffInstruction(senderEmail?: string): string {
  return `End the body with EXACTLY this sign-off, on its own lines, and nothing after it:\n${signOffText(teamMember(senderEmail))}`
}

export async function draftEmail(lead: Lead, instructions?: string, senderEmail?: string): Promise<{ subject: string; body: string }> {
  const content = await chatCompletion(
    [
      {
        role: 'system',
        content: `${GENNOOR_CONTEXT}

Write a personalized first-touch outreach email for this lead. Requirements:
- Address the person by name; reference their company/role naturally
- Briefly explain how Gennoor helps (training for their team, automation of one process, or Learning Studio courses), matched to their likely needs
- Clearly offer the free 2-hour webinar tailored to their organization AND the free 1-day online training — make clear these are relationship-building, no-obligation offers
- Mention the YouTube channel on AI agent development as a resource, with its link: https://www.youtube.com/@GennoorTech
- Plain, warm, professional tone. No hype, no invented numbers.
- Return JSON: {"subject": "...", "body": "..."} where body is plain text (no HTML).
- ${signOffInstruction(senderEmail)}
${lead.finalizedPitch ? `\nUse this finalized pitch content as the basis:\n${lead.finalizedPitch}` : ''}`,
      },
      { role: 'user', content: `${leadContext(lead)}${instructions ? `\n\nExtra instructions from the team: ${instructions}` : ''}` },
    ],
    { json: true }
  )
  const parsed = JSON.parse(content)
  return {
    subject: parsed.subject || `Gennoor Tech — AI enablement for ${lead.company || 'your team'}`,
    body: ensureYouTubeLink(parsed.body || ''),
  }
}
