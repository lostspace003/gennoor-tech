import type { Lead } from './types'
import { STEP_LABELS } from './types'
import { teamMember, signOffText } from './team'

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

/** What the writing assistant is told about one lead. Facts only. */
export function leadContext(lead: Lead): string {
  const sent = (lead.emailHistory || []).filter((e) => e.status === 'sent').slice(0, 4)
  return [
    `Name: ${lead.name || '(blank)'}`,
    `Designation: ${lead.designation || '(blank)'}`,
    `Organization: ${lead.company || '(blank)'}`,
    `Country: ${lead.country || '(blank)'}`,
    `Where they stand: ${STEP_LABELS[lead.status] || lead.status}`,
    `Notes from the team: ${lead.notes || '(none)'}`,
    sent.length
      ? `Emails already sent (do not repeat them; move the conversation on): ${sent.map((e) => `"${e.subject}" on ${e.at.slice(0, 10)}`).join('; ')}`
      : 'No emails sent yet.',
  ].join('\n')
}

export const GENNOOR_CONTEXT = `Gennoor Tech (www.gennoor.com) is a corporate training company in Mumbai, India. Gennoor is Certified in the Claude Partner Network (use exactly that wording, nothing more).
What Gennoor offers:
1. Learning Studio (www.gennoor.com/studio): self-paced video courses with labs to download, quizzes, captions, an assistant inside the player, a discussion page and a certificate. A few lessons of every course are free previews that anyone can watch without signing in; the full course is bought once, per learner. Live courses include AI-103 and AI-500 on Microsoft Azure, both built around one project.
2. Claude: certification preparation guides for the four Claude certifications (www.gennoor.com/claude/certifications), Claude training for teams, and automation of one process at a time.
3. Instructor-led bootcamps and courses on AI and cloud (Microsoft, Google Cloud, AWS, Claude, open source); the catalogue is an Excel workbook.
4. Custom training built around an organization's own processes, delivered on Gennoor's platform or on a learning platform set up for that organization. Lessons can use a custom voice and a digital presenter. Other features are added on request.
5. The aim: less classroom time. People learn concepts from short lessons and labs, and trainer time is kept for questions, online or on the client's premises. After the training, learners post doubts on the platform and a trainer answers.
Never quote prices, timelines or discounts. If cost comes up, say it depends on team size and scope, and suggest a short call (www.gennoor.com/resources/calendar).
STRICT RULES: never invent statistics, client names, client counts or case studies. Do not promise a specific saving for a specific client. Be honest, specific and brief.
STYLE: plain business English. Lead with the point. Short sentences. No filler, no hype, no exclamation marks. Emails stay under 150 words.`

// Every draft is signed by the person working the lead.
export function signOffInstruction(senderEmail?: string): string {
  return `End the body with EXACTLY this sign-off, on its own lines, and nothing after it:\n${signOffText(teamMember(senderEmail))}`
}

/**
 * A one-off email to one lead: a reply to something they wrote, or a note on a
 * topic the sender names. (The standard emails are the series in
 * ./sequence-emails.ts; they are fixed text and never go through a model.)
 */
export async function draftEmail(lead: Lead, instructions?: string, senderEmail?: string, isReply = false): Promise<{ subject: string; body: string }> {
  const content = await chatCompletion(
    [
      {
        role: 'system',
        content: `${GENNOOR_CONTEXT}

Write ${isReply ? 'a reply to the email from this lead that is quoted below' : 'a short email to this lead'}. Requirements:
- Address the person by first name.
- ${isReply ? 'Answer what they actually asked, first. If they asked about cost, say it depends on team size and scope and offer a short call.' : 'One purpose only, taken from the instructions.'}
- Mention only offerings that are relevant to what they said. Do not list everything.
- End with one clear next step.
- Plain text only, no markdown, no HTML.
- Return JSON: {"subject": "...", "body": "..."}.
- ${signOffInstruction(senderEmail)}`,
      },
      { role: 'user', content: `${leadContext(lead)}${instructions ? `\n\n${instructions}` : ''}` },
    ],
    { json: true }
  )
  const parsed = JSON.parse(content)
  return {
    subject: parsed.subject || `Gennoor Tech and ${lead.company || 'your team'}`,
    body: parsed.body || '',
  }
}
