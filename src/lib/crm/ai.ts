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
  let response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'api-key': c.key },
    body: JSON.stringify({ ...payload, max_completion_tokens: options?.maxTokens ?? 1500 }),
  })
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
Free relationship-building offers used in outreach: a free 2-hour webinar tailored to the company's needs, and a free 1-day online training. There is also a YouTube channel on enterprise AI agent development.
Contact: admin@gennoor.com, +91 9326352241.
STRICT RULES for anything you write: never invent statistics, client counts, or case studies. No fabricated claims like "100+ implementations" or "40% cost reduction". Be honest, specific and concise.`

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
- Mention the YouTube channel on enterprise AI agent development as a resource
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
    body: parsed.body || '',
  }
}
