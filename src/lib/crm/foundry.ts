import { ConfidentialClientApplication } from '@azure/msal-node'

// Foundry built-in Web Search: calls the Azure OpenAI v1 Responses API with
// the zero-setup web_search tool (Bing managed by Microsoft — no separate
// resource). gpt-5 on this account is shared with other workloads and often
// rate-limits, so callers must treat failures as expected and fall back.
const BASE = process.env.FOUNDRY_OPENAI_BASE || 'https://admin-5924-resource.openai.azure.com'
const MODEL = process.env.FOUNDRY_WEB_MODEL || 'gpt-5'

export function foundryConfigured(): boolean {
  return Boolean(
    process.env.FOUNDRY_API_KEY ||
    (process.env.FOUNDRY_TENANT_ID && process.env.FOUNDRY_CLIENT_ID && process.env.FOUNDRY_CLIENT_SECRET)
  )
}

// Auth header: api-key (lostspace003 account) preferred; SP bearer legacy.
export async function foundryAuthHeader(): Promise<Record<string, string>> {
  if (process.env.FOUNDRY_API_KEY) return { 'api-key': process.env.FOUNDRY_API_KEY }
  return { Authorization: `Bearer ${await getToken()}` }
}

let cachedToken: { value: string; expires: number } | null = null

async function getToken(): Promise<string> {
  if (cachedToken && cachedToken.expires > Date.now() + 60_000) return cachedToken.value
  const cca = new ConfidentialClientApplication({
    auth: {
      clientId: process.env.FOUNDRY_CLIENT_ID!,
      authority: `https://login.microsoftonline.com/${process.env.FOUNDRY_TENANT_ID}`,
      clientSecret: process.env.FOUNDRY_CLIENT_SECRET!,
    },
  })
  const result = await cca.acquireTokenByClientCredential({
    scopes: ['https://cognitiveservices.azure.com/.default'],
  })
  if (!result?.accessToken) throw new Error('Foundry token acquisition failed')
  cachedToken = { value: result.accessToken, expires: result.expiresOn?.getTime() || Date.now() + 30 * 60_000 }
  return result.accessToken
}

export interface WebSearchResult {
  text: string
  citations: Array<{ title: string; url: string }>
}

// One web-grounded completion. Retries once on rate-limit, then throws —
// callers fall back to the non-web model.
export async function webGroundedCompletion(instructions: string, input: string, maxOutputTokens = 1800): Promise<WebSearchResult> {
  if (!foundryConfigured()) throw new Error('Foundry web search not configured')

  for (let attempt = 0; attempt < 2; attempt++) {
    const response = await fetch(`${BASE}/openai/v1/responses`, {
      method: 'POST',
      headers: { ...(await foundryAuthHeader()), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        instructions,
        input,
        tools: [{ type: 'web_search' }],
        max_output_tokens: maxOutputTokens,
      }),
    })

    if (response.status === 429 && attempt === 0) {
      await new Promise((r) => setTimeout(r, 8000))
      continue
    }
    if (!response.ok) {
      throw new Error(`Foundry web search error ${response.status}: ${(await response.text()).slice(0, 200)}`)
    }

    const data = await response.json()
    let text = ''
    const citations: Array<{ title: string; url: string }> = []
    for (const item of data.output || []) {
      if (item.type === 'message' && Array.isArray(item.content)) {
        for (const c of item.content) {
          if (c.text) text += c.text
          for (const a of c.annotations || []) {
            if (a.url) citations.push({ title: a.title || a.url, url: a.url })
          }
        }
      }
    }
    if (!text) throw new Error('Foundry web search returned empty output')
    return { text, citations }
  }
  throw new Error('Foundry web search rate-limited (gpt-5 busy) — try again shortly')
}
