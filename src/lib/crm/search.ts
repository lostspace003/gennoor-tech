import { createHash } from 'crypto'
import { Lead } from './types'
import { embedTexts } from './vector-service'
import { leadIndexText } from './lead-text'

// Semantic lead search backed by Qdrant (the same store as the course search).
// Hybrid: vector similarity plus keyword matching, fused with reciprocal rank
// fusion. Source of truth stays leads.json: the index is disposable and rebuilt
// in full on every sync, so a dimension or model change needs no migration
// beyond re-running the sync. Each sync fills a new collection and then points
// the `crm_leads` alias at it in one step, so search never sees a half-built index.
const COLLECTION = process.env.QDRANT_CRM_COLLECTION || 'crm_leads' // an alias, not a collection
// nomic-embed-text-v2-moe. Vectors from two models are never comparable.
const DIMENSIONS = Number(process.env.VECTOR_DIMENSIONS || 768)

const base = () => (process.env.QDRANT_URL || '').replace(/\/+$/, '')

export function searchConfigured(): boolean {
  return Boolean(process.env.QDRANT_URL && process.env.QDRANT_API_KEY)
}

async function qd(path: string, init: { method?: string; body?: unknown } = {}): Promise<any> {
  const res = await fetch(`${base()}${path}`, {
    method: init.method || (init.body ? 'POST' : 'GET'),
    headers: { 'api-key': process.env.QDRANT_API_KEY || '', 'Content-Type': 'application/json' },
    body: init.body ? JSON.stringify(init.body) : undefined,
    signal: AbortSignal.timeout(30_000),
    cache: 'no-store',
  })
  if (!res.ok) {
    const err: any = new Error(`Qdrant ${res.status}: ${(await res.text()).slice(0, 200)}`)
    err.status = res.status
    throw err
  }
  return res.json()
}

// Qdrant point ids must be integers or UUIDs; derive a stable UUID from the lead id.
function pointId(id: string): string {
  const h = createHash('sha1').update(id).digest('hex')
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20, 32)}`
}

// Shared with the copilot's blob embeddings — see src/lib/crm/lead-text.ts
const leadSearchText = leadIndexText

// Build a fresh collection for this sync (the alias keeps serving the old one meanwhile).
async function createGeneration(): Promise<string> {
  const name = `${COLLECTION}_${Date.now()}`
  await qd(`/collections/${name}`, { method: 'PUT', body: { vectors: { size: DIMENSIONS, distance: 'Cosine' } } })
  await qd(`/collections/${name}/index`, {
    method: 'PUT',
    body: { field_name: 'text', field_schema: { type: 'text', tokenizer: 'word', min_token_len: 2, lowercase: true } },
  })
  return name
}

// Point the alias at the new collection atomically, then drop the older generations.
async function promote(name: string): Promise<void> {
  const create = { create_alias: { collection_name: name, alias_name: COLLECTION } }
  try {
    await qd('/collections/aliases', { method: 'POST', body: { actions: [{ delete_alias: { alias_name: COLLECTION } }, create] } })
  } catch {
    // first sync: there is no alias to replace yet
    await qd('/collections/aliases', { method: 'POST', body: { actions: [create] } })
  }
  const all: { name: string }[] = (await qd('/collections')).result?.collections || []
  for (const c of all) {
    if (c.name.startsWith(`${COLLECTION}_`) && c.name !== name) {
      await qd(`/collections/${c.name}`, { method: 'DELETE' }).catch(() => {})
    }
  }
}

// Full rebuild: embed every lead (batches of 64) and upload (batches of 100).
export async function syncSearchIndex(leads: Lead[]): Promise<number> {
  const target = await createGeneration()
  try {
    const points: { id: string; vector: number[]; payload: Record<string, unknown> }[] = []
    for (let i = 0; i < leads.length; i += 64) {
      const batch = leads.slice(i, i + 64)
      const vectors = await embedTexts(batch.map(leadSearchText))
      batch.forEach((l, j) => points.push({
        id: pointId(l.id),
        vector: vectors[j],
        payload: { leadId: l.id, text: leadSearchText(l), company: l.company || '', stage: l.stage || '', owner: l.owner || '' },
      }))
    }
    for (let i = 0; i < points.length; i += 100) {
      await qd(`/collections/${target}/points?wait=true`, { method: 'PUT', body: { points: points.slice(i, i + 100) } })
    }
    await promote(target)
    return points.length
  } catch (e) {
    await qd(`/collections/${target}`, { method: 'DELETE' }).catch(() => {})
    throw e
  }
}

// Leads change all day (notes, stages, imports). After a change, rebuild the index once things
// have been quiet for a minute and a half; changes that arrive meanwhile just move the timer.
let syncTimer: ReturnType<typeof setTimeout> | null = null
let syncing = false
export function scheduleSearchSync(readLeads: () => Promise<Lead[]>, delayMs = 90_000): void {
  if (!searchConfigured() || !process.env.VECTOR_SERVICE_URL) return
  if (syncTimer) clearTimeout(syncTimer)
  syncTimer = setTimeout(async () => {
    syncTimer = null
    if (syncing) return scheduleSearchSync(readLeads, delayMs)
    syncing = true
    try {
      console.log(`crm-search: re-synced ${await syncSearchIndex(await readLeads())} leads`)
    } catch (e) {
      console.error('crm-search: auto sync failed -', e instanceof Error ? e.message : e)
    } finally {
      syncing = false
    }
  }, delayMs)
}

export interface SearchHit { id: string; score: number }

const RRF_K = 60
const BM25_K1 = 1.2
const BM25_B = 0.75
const tokens = (q: string) => q.toLowerCase().match(/[\p{L}\p{N}]{2,}/gu) || []

// Keyword side: BM25 over the leads that contain at least one query word.
// Document frequencies come from Qdrant (one count per word), so the weighting
// matches a whole-collection BM25 rather than just the candidate set.
async function keywordRank(query: string): Promise<{ id: string }[]> {
  const terms = Array.from(new Set(tokens(query)))
  if (!terms.length) return []
  const total: number = (await qd(`/collections/${COLLECTION}/points/count`, { body: { exact: true } })).result.count
  if (!total) return []
  const df = await Promise.all(terms.map(async (t) =>
    (await qd(`/collections/${COLLECTION}/points/count`, {
      body: { exact: true, filter: { must: [{ key: 'text', match: { text: t } }] } },
    })).result.count as number))
  const r = await qd(`/collections/${COLLECTION}/points/scroll`, {
    body: { filter: { should: terms.map((t) => ({ key: 'text', match: { text: t } })) }, limit: 500, with_payload: ['leadId', 'text'] },
  })
  const docs = (r.result?.points || []).map((p: any) => ({ id: p.payload.leadId as string, words: tokens(String(p.payload?.text || '')) }))
  if (!docs.length) return []
  const avgdl = docs.reduce((n: number, d: { words: string[] }) => n + d.words.length, 0) / docs.length || 1
  return docs
    .map((d: { id: string; words: string[] }) => {
      let score = 0
      terms.forEach((t, i) => {
        if (!df[i]) return
        const tf = d.words.filter((w) => w === t).length
        if (!tf) return
        const idf = Math.log(1 + (total - df[i] + 0.5) / (df[i] + 0.5))
        score += idf * ((tf * (BM25_K1 + 1)) / (tf + BM25_K1 * (1 - BM25_B + (BM25_B * d.words.length) / avgdl)))
      })
      return { id: d.id, score }
    })
    .filter((d: { score: number }) => d.score > 0)
    .sort((x: { score: number }, y: { score: number }) => y.score - x.score)
}

// Hybrid search: vector similarity and BM25 keyword relevance fused by reciprocal
// rank fusion. Returns lead ids ranked by relevance.
export async function searchLeads(query: string, topK = 20): Promise<SearchHit[]> {
  // 'query' side of the asymmetric prefix pair — see vector-service.embedTexts
  const [qv] = await embedTexts([query], 'query')
  let semantic: { payload: any }[]
  try {
    semantic = (await qd(`/collections/${COLLECTION}/points/search`, {
      body: { vector: qv, limit: topK, with_payload: ['leadId'] },
    })).result
  } catch (e: any) {
    if (e?.status === 404) throw new IndexMissingError()
    throw e
  }
  const keyword = await keywordRank(query)

  const score = new Map<string, number>()
  semantic.forEach((p, rank) => score.set(p.payload.leadId, (score.get(p.payload.leadId) || 0) + 1 / (RRF_K + rank + 1)))
  keyword.slice(0, topK).forEach((k, rank) => score.set(k.id, (score.get(k.id) || 0) + 1 / (RRF_K + rank + 1)))
  return Array.from(score, ([id, sc]) => ({ id, score: sc })).sort((x, y) => y.score - x.score).slice(0, topK)
}

export class IndexMissingError extends Error {
  constructor() { super('Search index not built yet') }
}
