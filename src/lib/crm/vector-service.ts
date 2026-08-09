/**
 * Client for the Gennoor vector service (services/vector) — multilingual
 * embeddings and FAISS semantic search, running as a container app.
 *
 * Every retrieval surface goes through here: the gennoor.com bot, the CRM
 * copilot, CRM lead search, and agent drafting. Embedding used to be an Azure
 * OpenAI call with a shared, rate-limited deployment; the site index had to
 * sleep 12s between batches and a full rebuild took ~25 minutes. A dedicated
 * container has no rate limit, so rebuilds run at wire speed.
 *
 * Two shapes of use:
 *   embedTexts()  — raw vectors, for callers that own their own storage
 *                   (the site index's packed Float32Array, the AI Search index)
 *   upsert/search — let FAISS hold the vectors and do the ranking
 */

const BASE = (process.env.VECTOR_SERVICE_URL || '').replace(/\/$/, '')
const KEY = process.env.VECTOR_API_KEY || ''

export function vectorServiceConfigured(): boolean {
  return Boolean(BASE && KEY)
}

/** Namespaces are separate FAISS indexes; the service maps each to a model. */
export type VectorNamespace = 'site' | 'leads'

export interface VectorItem {
  id: string
  text: string
  meta?: Record<string, unknown>
}

export interface VectorHit {
  id: string
  score: number
  text: string
  meta: Record<string, any>
}

async function call<T>(path: string, body?: unknown, init?: { method?: string; timeoutMs?: number }): Promise<T> {
  if (!vectorServiceConfigured()) {
    throw new Error('Vector service not configured (VECTOR_SERVICE_URL / VECTOR_API_KEY)')
  }
  // Embedding a large batch on CPU is genuinely slow; the default fetch
  // timeout would abort a legitimate index build.
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), init?.timeoutMs ?? 180_000)
  try {
    const res = await fetch(`${BASE}${path}`, {
      method: init?.method || (body ? 'POST' : 'GET'),
      headers: { 'Content-Type': 'application/json', 'x-api-key': KEY },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
      cache: 'no-store',
    })
    if (!res.ok) {
      throw new Error(`Vector service ${res.status}: ${(await res.text()).slice(0, 200)}`)
    }
    return (await res.json()) as T
  } finally {
    clearTimeout(timer)
  }
}

/**
 * Embed texts. `kind` matters: nomic-embed-text-v2-moe is trained with
 * asymmetric prefixes and quietly loses accuracy if a query is embedded as a
 * document. Queries must pass kind:'query'.
 *
 * Batched because a 500-chunk request would hold one CPU-bound worker for
 * minutes; smaller batches also keep memory flat on a 4 GiB container.
 */
export async function embedTexts(
  texts: string[],
  kind: 'query' | 'document' = 'document',
  opts?: { batch?: number; model?: string }
): Promise<number[][]> {
  if (texts.length === 0) return []
  const batch = opts?.batch ?? 32
  const out: number[][] = []
  for (let i = 0; i < texts.length; i += batch) {
    const res = await call<{ vectors: number[][] }>('/embed', {
      texts: texts.slice(i, i + batch),
      kind,
      model: opts?.model,
    })
    out.push(...res.vectors)
  }
  return out
}

/** Add or replace documents in a namespace. `replaceAll` clears it first. */
export async function upsertVectors(
  namespace: VectorNamespace,
  items: VectorItem[],
  opts?: { replaceAll?: boolean; batch?: number }
): Promise<{ upserted: number; total: number }> {
  const batch = opts?.batch ?? 64
  let upserted = 0
  let total = 0
  // The clear must ride with the first batch, or a multi-batch rebuild would
  // wipe everything it just wrote.
  for (let i = 0; i < items.length; i += batch) {
    const res = await call<{ upserted: number; total: number }>(`/index/${namespace}/upsert`, {
      items: items.slice(i, i + batch),
      replaceAll: i === 0 ? Boolean(opts?.replaceAll) : false,
    })
    upserted += res.upserted
    total = res.total
  }
  if (items.length === 0 && opts?.replaceAll) {
    const res = await call<{ total: number }>(`/index/${namespace}/upsert`, { items: [], replaceAll: true })
    total = res.total
  }
  return { upserted, total }
}

export async function searchVectors(
  namespace: VectorNamespace,
  query: string,
  topK = 8,
  filter?: Record<string, unknown>
): Promise<VectorHit[]> {
  const res = await call<{ hits: VectorHit[] }>(`/index/${namespace}/search`, { query, topK, filter }, { timeoutMs: 30_000 })
  return res.hits
}

export async function removeVectors(namespace: VectorNamespace, ids: string[]): Promise<number> {
  if (ids.length === 0) return 0
  const res = await call<{ removed: number }>(`/index/${namespace}/remove`, ids)
  return res.removed
}

/** Ids already indexed — lets callers embed only what changed. */
export async function indexedKeys(namespace: VectorNamespace): Promise<string[]> {
  const res = await call<{ keys: string[] }>(`/index/${namespace}/keys`, undefined, { timeoutMs: 30_000 })
  return res.keys
}

export interface VectorHealth {
  ok: boolean
  models: Record<string, { dim: number; loaded: boolean }>
  namespaces: Record<string, { model: string; vectors: number }>
}

export async function vectorHealth(): Promise<VectorHealth> {
  return call<VectorHealth>('/health', undefined, { timeoutMs: 15_000 })
}
