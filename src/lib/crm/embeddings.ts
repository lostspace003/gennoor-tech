// Text embeddings from Azure AI Foundry. Used by the site and course indexes
// and the blog/LinkedIn automation to compare texts. (The CRM itself no longer
// uses embeddings: lead search is a plain text match.)
const DEPLOYMENT = 'text-embedding-3-small'
const BASE = process.env.FOUNDRY_OPENAI_BASE || 'https://admin-5924-resource.openai.azure.com'

export async function embedTexts(texts: string[]): Promise<number[][]> {
  const { foundryConfigured, foundryAuthHeader } = await import('./foundry')
  if (!foundryConfigured()) throw new Error('Embeddings not configured (FOUNDRY_API_KEY)')
  const authHeader = await foundryAuthHeader()
  // 429s are routine on shared deployments — wait out the window and retry
  for (let attempt = 0; attempt < 6; attempt++) {
    const res = await fetch(`${BASE}/openai/deployments/${DEPLOYMENT}/embeddings?api-version=2023-05-15`, {
      method: 'POST',
      headers: { ...authHeader, 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: texts }),
    })
    if (res.status === 429) {
      const retryAfter = Number(res.headers.get('retry-after')) || 20
      await new Promise((r) => setTimeout(r, Math.min(retryAfter, 60) * 1000))
      continue
    }
    if (!res.ok) throw new Error(`Embedding error ${res.status}: ${(await res.text()).slice(0, 200)}`)
    const data = await res.json()
    return data.data.map((d: any) => d.embedding)
  }
  throw new Error('Embedding rate limit persisted after 6 retries')
}
