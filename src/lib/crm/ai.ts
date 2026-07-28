import { Lead, ChatMessage } from './types'

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

export const GENNOOR_CONTEXT = `Gennoor Tech (www.gennoor.com) is an AI training and consulting company. Tagline: TRAIN. INNOVATE. BUILD.
Offerings follow a 5-step client journey:
1. Diagnose — company profile research, understand what they need (technical or non-technical audience)
2. Train — technical + non-technical AI training, or provide a skilled AI worker embedded in their team
3. POC — demo / proof of concept with a web link
4. Product development
5. Sustain — maintenance with complementary hand-holding for 3-6 months
Free relationship-building offers used in outreach: a free 2-hour webinar tailored to the company's needs, and a free 1-day online training. There is also a YouTube channel on enterprise AI agent development: https://www.youtube.com/@GennoorTech — whenever an email mentions the channel, include this exact link.
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
  "opportunities": ["2-4 concrete Gennoor offerings that fit, mapped to the 5-step journey"],
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
{"summary":"2-3 sentences grounded in what you found","insights":["3-5 findings relevant to selling AI training/consulting"],"opportunities":["2-4 Gennoor offerings that fit, mapped to the 5-step journey"],"approach":"2-3 sentences: recommended first touch","techOrNonTech":"technical|non-technical"}
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

export async function researchChat(lead: Lead, history: ChatMessage[]): Promise<string> {
  return chatCompletion([
    {
      role: 'system',
      content: `${GENNOOR_CONTEXT}

You are the CRM research copilot. The team is discussing this lead with you to sharpen the pitch before drafting an email. Be concise and practical. Lead data:
${leadContext(lead)}`,
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
2) What we pitch — mapped to diagnose/train/POC/development/sustain
3) Free offer to lead with — 2-hour webinar or 1-day training, and the suggested topic
4) Tone — technical or non-technical, with one guidance sentence
Keep the whole brief under 180 words. Lead data:
${leadContext(lead)}`,
    },
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: 'Finalize the pitch brief now — the four sections only.' },
  ])
}

// One-page CLIENT-FACING pitch document (markdown). Fresh generate pulls from
// research + copilot discussion; refine revises an existing version per the
// team's instruction. This is what gets exported to Word and emailed.
const PITCH_DOC_FORMAT = `STRUCTURE — pure Markdown, exactly these sections, nothing else before or after:

# AI Enablement Pitch — {company or lead name}
*Prepared for {name}{, designation if known} · Gennoor Tech*

## Where you are
(2-3 sentences on their situation and likely need, grounded in the research — inferred statements say "likely")

## What Gennoor proposes
(3-5 one-line bullets mapped to the journey: Diagnose, Train, POC, Development, Sustain — only the steps that fit)

## Start free, zero obligation
(the free 2-hour webinar and/or free 1-day training, with a suggested topic tailored to them)

## Why Gennoor
(2-3 honest bullets — training + build capability, technical & non-technical tracks, hand-holding through Sustain. NO invented stats or client counts)

## Next step
(one sentence inviting a short call · contact: admin@gennoor.com · +91 9326352241)

HARD RULES: under 280 words total; client-facing tone (they will read this document); no internal jargon like "lead" or "pipeline"; no invented facts.`

export async function generatePitchDoc(lead: Lead, history: ChatMessage[], base?: string, instruction?: string): Promise<string> {
  if (base && instruction) {
    return chatCompletion([
      {
        role: 'system',
        content: `${GENNOOR_CONTEXT}\n\nYou maintain the one-page client-facing pitch document for this lead. Revise the current version according to the team's instruction and return the FULL revised document.\n\n${PITCH_DOC_FORMAT}\n\nLead data:\n${leadContext(lead)}`,
      },
      { role: 'user', content: `CURRENT DOCUMENT:\n${base}\n\nINSTRUCTION: ${instruction}\n\nReturn the full revised one-pager now.` },
    ])
  }
  return chatCompletion([
    {
      role: 'system',
      content: `${GENNOOR_CONTEXT}\n\nWrite the one-page client-facing pitch document for this lead, using the research and the team's copilot discussion below as grounding.\n\n${PITCH_DOC_FORMAT}\n\nLead data:\n${leadContext(lead)}${lead.aiResearch ? `\n\nResearch insights:\n- ${lead.aiResearch.insights.join('\n- ')}\nWhat to pitch:\n- ${lead.aiResearch.opportunities.join('\n- ')}\nApproach: ${lead.aiResearch.approach}` : ''}`,
    },
    ...history.slice(-20).map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: 'Write the one-page pitch document now — the sections only.' },
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

export async function draftEmail(lead: Lead, instructions?: string): Promise<{ subject: string; body: string }> {
  const content = await chatCompletion(
    [
      {
        role: 'system',
        content: `${GENNOOR_CONTEXT}

Write a personalized first-touch outreach email for this lead. Requirements:
- Address the person by name; reference their company/role naturally
- Briefly explain how Gennoor helps (diagnose -> train -> POC -> development -> sustain), matched to their likely needs
- Clearly offer the free 2-hour webinar tailored to their organization AND the free 1-day online training — make clear these are relationship-building, no-obligation offers
- Mention the YouTube channel on enterprise AI agent development as a resource, with its link: https://www.youtube.com/@GennoorTech
- Plain, warm, professional tone. No hype, no invented numbers.
- Return JSON: {"subject": "...", "body": "..."} where body is plain text (no HTML), signed "Team Gennoor Tech" with admin@gennoor.com and +91 9326352241.
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
