import { Lead } from './types'
import { embedTexts } from './vector-service'
import { leadIndexText } from './lead-text'

// Semantic lead search backed by Azure AI Search (free tier — 50 MB, ~8k
// vectors, plenty for this CRM). Hybrid queries: keyword + vector over one
// index. Purely additive: the copilot's blob-embedding retrieval is separate
// and untouched. Source of truth stays leads.json — the index is disposable
// and rebuilt in full on every sync.
const ENDPOINT = (process.env.AZURE_SEARCH_ENDPOINT || '').replace(/\/$/, '')
const KEY = process.env.AZURE_SEARCH_ADMIN_KEY || ''
const INDEX = 'crm-leads'
const API = '2024-07-01'
// nomic-embed-text-v2-moe. Changing the model changes this, and the index is
// delete-and-recreated on every sync, so a dimension change needs no migration
// beyond re-running the sync. Vectors from two models are never comparable.
const DIMENSIONS = Number(process.env.VECTOR_DIMENSIONS || 768)

export function searchConfigured(): boolean {
  return Boolean(ENDPOINT && KEY)
}

async function searchFetch(path: string, init?: RequestInit): Promise<Response> {
  return fetch(`${ENDPOINT}${path}${path.includes('?') ? '&' : '?'}api-version=${API}`, {
    ...init,
    headers: { 'api-key': KEY, 'Content-Type': 'application/json', ...(init?.headers || {}) },
  })
}

// Shared with the copilot's blob embeddings — see src/lib/crm/lead-text.ts
const leadSearchText = leadIndexText

// Delete + recreate so a sync always leaves the index exactly matching the
// current leads (no stale documents from renames/deletes).
async function recreateIndex(): Promise<void> {
  await searchFetch(`/indexes/${INDEX}`, { method: 'DELETE' })
  const res = await searchFetch(`/indexes/${INDEX}`, {
    method: 'PUT',
    body: JSON.stringify({
      name: INDEX,
      fields: [
        { name: 'id', type: 'Edm.String', key: true, filterable: true },
        { name: 'text', type: 'Edm.String', searchable: true },
        { name: 'company', type: 'Edm.String', filterable: true, searchable: true },
        { name: 'stage', type: 'Edm.String', filterable: true },
        { name: 'owner', type: 'Edm.String', filterable: true },
        {
          name: 'vector', type: 'Collection(Edm.Single)', searchable: true,
          dimensions: DIMENSIONS, vectorSearchProfile: 'default',
        },
      ],
      vectorSearch: {
        algorithms: [{ name: 'hnsw', kind: 'hnsw' }],
        profiles: [{ name: 'default', algorithm: 'hnsw' }],
      },
    }),
  })
  if (!res.ok) throw new Error(`Search index create failed ${res.status}: ${(await res.text()).slice(0, 200)}`)
}

// Full rebuild: embed every lead (batches of 64) and upload (batches of 100).
export async function syncSearchIndex(leads: Lead[]): Promise<number> {
  await recreateIndex()
  const docs: Record<string, unknown>[] = []
  for (let i = 0; i < leads.length; i += 64) {
    const batch = leads.slice(i, i + 64)
    const vectors = await embedTexts(batch.map(leadSearchText))
    batch.forEach((l, j) => docs.push({
      id: l.id, text: leadSearchText(l), company: l.company || '',
      stage: l.stage || '', owner: l.owner || '', vector: vectors[j],
    }))
  }
  for (let i = 0; i < docs.length; i += 100) {
    const res = await searchFetch(`/indexes/${INDEX}/docs/index`, {
      method: 'POST',
      body: JSON.stringify({ value: docs.slice(i, i + 100).map((d) => ({ '@search.action': 'mergeOrUpload', ...d })) }),
    })
    if (!res.ok) throw new Error(`Search upload failed ${res.status}: ${(await res.text()).slice(0, 200)}`)
  }
  return docs.length
}

export interface SearchHit { id: string; score: number }

// Hybrid search: keyword relevance and vector similarity fused by the service
// (RRF). Returns lead ids ranked by relevance.
export async function searchLeads(query: string, topK = 20): Promise<SearchHit[]> {
  // 'query' side of the asymmetric prefix pair — see vector-service.embedTexts
  const [qv] = await embedTexts([query], 'query')
  const res = await searchFetch(`/indexes/${INDEX}/docs/search`, {
    method: 'POST',
    body: JSON.stringify({
      search: query,
      vectorQueries: [{ kind: 'vector', vector: qv, fields: 'vector', k: topK }],
      top: topK,
      select: 'id',
    }),
  })
  if (res.status === 404) throw new IndexMissingError()
  if (!res.ok) throw new Error(`Search failed ${res.status}: ${(await res.text()).slice(0, 200)}`)
  const data = await res.json()
  return (data.value || []).map((d: any) => ({ id: d.id, score: d['@search.score'] }))
}

export class IndexMissingError extends Error {
  constructor() { super('Search index not built yet') }
}
