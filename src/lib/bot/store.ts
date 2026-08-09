import { BlobServiceClient, ContainerClient } from '@azure/storage-blob'
import crypto from 'crypto'

// Storage layer for the public website GennoorBot.
//   site-index/meta.json    — chunks (url, title, text, hash) without vectors
//   site-index/vectors.bin  — one concatenated Float32Array (chunk order = meta order)
//   bot-usage/YYYY-MM-DD.json — daily request/token counters (budget breaker)
//   bot-cache/<sha1>.json   — 24h cached answers for repeated questions
//   bot-logs/YYYY-MM-DD.json — conversation log (rendered in CRM, AI-summarized weekly)
const CONTAINER = 'gennoorbot'
// Dimension of the active embedding model. nomic-embed-text-v2-moe = 768,
// bge-m3 = 1024. Changing it invalidates every stored vector, so the site
// index must be rebuilt from scratch after a change (POST /api/admin/site-index).
export const EMBED_DIM = Number(process.env.VECTOR_DIMENSIONS || 768)

export interface SiteChunk {
  id: string
  url: string
  title: string
  text: string
  hash: string
}

export interface SiteIndexMeta {
  chunks: SiteChunk[]
  pages: Record<string, string> // url -> content hash (delta detection)
  updatedAt: string
}

function getContainer(): ContainerClient {
  const conn = process.env.AZURE_STORAGE_CONNECTION_STRING
  if (!conn) throw new Error('AZURE_STORAGE_CONNECTION_STRING not configured')
  return BlobServiceClient.fromConnectionString(conn).getContainerClient(CONTAINER)
}

async function readJson<T>(name: string): Promise<T | null> {
  try {
    const buf = await getContainer().getBlockBlobClient(name).downloadToBuffer()
    return JSON.parse(buf.toString('utf-8')) as T
  } catch {
    return null
  }
}

async function writeBlob(name: string, body: Buffer | string, contentType: string) {
  const container = getContainer()
  await container.createIfNotExists()
  const data = Buffer.isBuffer(body) ? body : Buffer.from(body)
  await container.getBlockBlobClient(name).upload(data, data.length, { blobHTTPHeaders: { blobContentType: contentType } })
}

/* ---------- index ---------- */

export async function loadIndexMeta(): Promise<SiteIndexMeta | null> {
  return readJson<SiteIndexMeta>('site-index/meta.json')
}

export async function saveIndex(meta: SiteIndexMeta, vectors: Float32Array) {
  await writeBlob('site-index/meta.json', JSON.stringify(meta), 'application/json')
  await writeBlob('site-index/vectors.bin', Buffer.from(vectors.buffer, vectors.byteOffset, vectors.byteLength), 'application/octet-stream')
}

// Vectors cached in module memory — one blob read per server instance.
let vectorCache: { at: string; data: Float32Array } | null = null

export async function loadVectors(updatedAt: string): Promise<Float32Array | null> {
  if (vectorCache?.at === updatedAt) return vectorCache.data
  try {
    const buf = await getContainer().getBlockBlobClient('site-index/vectors.bin').downloadToBuffer()
    const data = new Float32Array(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength))
    vectorCache = { at: updatedAt, data }
    return data
  } catch {
    return null
  }
}

export function topKScored(
  query: Float32Array,
  vectors: Float32Array,
  chunks: SiteChunk[],
  k: number
): Array<{ chunk: SiteChunk; score: number }> {
  const scored: Array<{ i: number; s: number }> = []
  for (let i = 0; i < chunks.length; i++) {
    let dot = 0
    const off = i * EMBED_DIM
    for (let d = 0; d < EMBED_DIM; d++) dot += query[d] * vectors[off + d]
    scored.push({ i, s: dot }) // embeddings are unit-normalized → dot = cosine
  }
  return scored
    .sort((a, b) => b.s - a.s)
    .slice(0, k)
    .map((x) => ({ chunk: chunks[x.i], score: x.s }))
}

export function topKChunks(query: Float32Array, vectors: Float32Array, chunks: SiteChunk[], k: number): SiteChunk[] {
  return topKScored(query, vectors, chunks, k).map((x) => x.chunk)
}

/* ---------- index job status (async indexing) ---------- */

export interface IndexStatus {
  state: 'running' | 'done' | 'error'
  startedAt: string
  finishedAt?: string
  progress?: string
  result?: {
    pages: number
    chunks: number
    changedPages: number
    embedded: number
    fetchErrors: number
    /** Chunks built from structured catalogue data (courses, POCs, cases…) */
    catalogueChunks?: number
    /** Course PDFs / brochures read out of blob storage */
    blobDocuments?: number
    blobSkipped?: number
    sources?: Record<string, number>
  }
  error?: string
}

export async function readIndexStatus(): Promise<IndexStatus | null> {
  return readJson<IndexStatus>('site-index/status.json')
}

export async function writeIndexStatus(status: IndexStatus) {
  await writeBlob('site-index/status.json', JSON.stringify(status), 'application/json')
}

/* ---------- daily usage / budget breaker ---------- */

interface DayUsage { requests: number; tokens: number }

export async function addUsage(tokens: number): Promise<DayUsage> {
  const name = `bot-usage/${new Date().toISOString().slice(0, 10)}.json`
  const container = getContainer()
  await container.createIfNotExists()
  const blob = container.getBlockBlobClient(name)
  for (let attempt = 0; attempt < 3; attempt++) {
    let usage: DayUsage = { requests: 0, tokens: 0 }
    let etag: string | undefined
    try {
      const dl = await blob.download()
      const chunks: Buffer[] = []
      for await (const c of dl.readableStreamBody as AsyncIterable<Buffer>) chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c))
      usage = JSON.parse(Buffer.concat(chunks).toString())
      etag = dl.etag
    } catch { /* first request of the day */ }
    usage.requests += 1
    usage.tokens += tokens
    try {
      const body = JSON.stringify(usage)
      await blob.upload(body, Buffer.byteLength(body), {
        blobHTTPHeaders: { blobContentType: 'application/json' },
        conditions: etag ? { ifMatch: etag } : { ifNoneMatch: '*' },
      })
      return usage
    } catch { /* etag race — retry */ }
  }
  return { requests: 0, tokens: 0 }
}

export async function getUsage(date: string): Promise<DayUsage> {
  return (await readJson<DayUsage>(`bot-usage/${date}.json`)) || { requests: 0, tokens: 0 }
}

/* ---------- answer cache ---------- */

export function questionKey(q: string): string {
  return crypto.createHash('sha1').update(q.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim()).digest('hex')
}

export async function getCachedAnswer(key: string): Promise<{ answer: string; links: any[] } | null> {
  const hit = await readJson<{ answer: string; links: any[]; at: string }>(`bot-cache/${key}.json`)
  if (!hit) return null
  if (Date.now() - new Date(hit.at).getTime() > 24 * 3600_000) return null
  return hit
}

export async function setCachedAnswer(key: string, answer: string, links: any[]) {
  await writeBlob(`bot-cache/${key}.json`, JSON.stringify({ answer, links, at: new Date().toISOString() }), 'application/json')
}

/* ---------- conversation log ---------- */

export interface BotLogEntry {
  at: string
  sessionId: string
  q: string
  a: string
  links: string[]
  cached?: boolean
  leadCaptured?: boolean
}

export async function appendLog(entry: BotLogEntry) {
  const name = `bot-logs/${new Date().toISOString().slice(0, 10)}.json`
  const container = getContainer()
  await container.createIfNotExists()
  const blob = container.getBlockBlobClient(name)
  for (let attempt = 0; attempt < 3; attempt++) {
    let entries: BotLogEntry[] = []
    let etag: string | undefined
    try {
      const dl = await blob.download()
      const chunks: Buffer[] = []
      for await (const c of dl.readableStreamBody as AsyncIterable<Buffer>) chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c))
      entries = JSON.parse(Buffer.concat(chunks).toString())
      etag = dl.etag
    } catch { /* first entry of the day */ }
    entries.push(entry)
    if (entries.length > 2000) entries = entries.slice(-2000)
    try {
      const body = JSON.stringify(entries)
      await blob.upload(body, Buffer.byteLength(body), {
        blobHTTPHeaders: { blobContentType: 'application/json' },
        conditions: etag ? { ifMatch: etag } : { ifNoneMatch: '*' },
      })
      return
    } catch { /* retry */ }
  }
}

export async function readLogs(days: number): Promise<BotLogEntry[]> {
  const out: BotLogEntry[] = []
  for (let i = 0; i < days; i++) {
    const date = new Date(Date.now() - i * 86_400_000).toISOString().slice(0, 10)
    const entries = await readJson<BotLogEntry[]>(`bot-logs/${date}.json`)
    if (entries) out.push(...entries)
  }
  return out.sort((a, b) => b.at.localeCompare(a.at))
}

// Logs for an explicit calendar range (inclusive YYYY-MM-DD dates) — powers
// the custom from→to filter in the CRM. Capped at 92 daily blobs per read.
export async function readLogsBetween(from: string, to: string): Promise<BotLogEntry[]> {
  const start = new Date(`${from}T00:00:00Z`).getTime()
  const end = new Date(`${to}T00:00:00Z`).getTime()
  if (isNaN(start) || isNaN(end) || end < start) return []
  const out: BotLogEntry[] = []
  for (let t = start, n = 0; t <= end && n < 92; t += 86_400_000, n++) {
    const date = new Date(t).toISOString().slice(0, 10)
    const entries = await readJson<BotLogEntry[]>(`bot-logs/${date}.json`)
    if (entries) out.push(...entries)
  }
  return out.sort((a, b) => b.at.localeCompare(a.at))
}
