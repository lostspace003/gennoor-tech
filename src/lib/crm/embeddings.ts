import { BlobServiceClient } from '@azure/storage-blob'
import crypto from 'crypto'
import { Lead } from './types'

// Embedding retrieval for GennoorBot. Below SMALL_CRM_LIMIT leads the copilot
// passes the whole snapshot directly (more accurate); above it, we embed each
// lead once (re-embedding only when its content changes) and retrieve the
// most relevant leads for the question. Vectors live in one blob.
export const SMALL_CRM_LIMIT = 150
const CONTAINER = 'crm-data'
const BLOB = 'embeddings.json'
const DEPLOYMENT = 'text-embedding-3-small'
const BASE = process.env.FOUNDRY_OPENAI_BASE || 'https://admin-5924-resource.openai.azure.com'

interface StoredVector { hash: string; vector: number[] }
type VectorStore = Record<string, StoredVector>

function leadText(l: Lead): string {
  return [
    l.name, l.designation, l.company, l.sector, l.leadType, l.region, l.country, l.city,
    l.stage, l.status, l.processStatus, l.priority, l.owner, l.notes,
    l.aiResearch?.summary, ...(l.aiResearch?.insights || []),
  ].filter(Boolean).join(' | ')
}

function hashOf(text: string): string {
  return crypto.createHash('sha1').update(text).digest('hex')
}

async function getBlob() {
  const conn = process.env.AZURE_STORAGE_CONNECTION_STRING
  if (!conn) throw new Error('AZURE_STORAGE_CONNECTION_STRING not configured')
  const container = BlobServiceClient.fromConnectionString(conn).getContainerClient(CONTAINER)
  await container.createIfNotExists()
  return container.getBlockBlobClient(BLOB)
}

async function loadStore(): Promise<VectorStore> {
  try {
    const blob = await getBlob()
    const buf = await blob.downloadToBuffer()
    return JSON.parse(buf.toString('utf-8'))
  } catch {
    return {}
  }
}

async function saveStore(store: VectorStore) {
  const blob = await getBlob()
  const body = JSON.stringify(store)
  await blob.upload(body, Buffer.byteLength(body), { blobHTTPHeaders: { blobContentType: 'application/json' } })
}

// Exported for the website bot's site index — same deployment, same SP token.
export async function embedTexts(texts: string[]): Promise<number[][]> {
  return embed(texts)
}

async function embed(texts: string[]): Promise<number[][]> {
  const { foundryConfigured } = await import('./foundry')
  if (!foundryConfigured()) throw new Error('Embeddings need the Foundry service principal')
  // Same SP bearer token used for web search — role covers embeddings too
  const { ConfidentialClientApplication } = await import('@azure/msal-node')
  const cca = new ConfidentialClientApplication({
    auth: {
      clientId: process.env.FOUNDRY_CLIENT_ID!,
      authority: `https://login.microsoftonline.com/${process.env.FOUNDRY_TENANT_ID}`,
      clientSecret: process.env.FOUNDRY_CLIENT_SECRET!,
    },
  })
  const token = await cca.acquireTokenByClientCredential({ scopes: ['https://cognitiveservices.azure.com/.default'] })
  // 429s are routine on the shared deployment — wait out the window and retry
  for (let attempt = 0; attempt < 6; attempt++) {
    const res = await fetch(`${BASE}/openai/deployments/${DEPLOYMENT}/embeddings?api-version=2023-05-15`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token!.accessToken}`, 'Content-Type': 'application/json' },
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

function cosine(a: number[], b: number[]): number {
  let dot = 0, na = 0, nb = 0
  for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i] }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) || 1)
}

// Returns the top-K most relevant leads for a question, keeping the vector
// store in sync (only changed/new leads are re-embedded).
export async function retrieveRelevantLeads(leads: Lead[], question: string, topK = 30): Promise<Lead[]> {
  const store = await loadStore()

  const stale = leads.filter((l) => store[l.id]?.hash !== hashOf(leadText(l)))
  // Embed stale leads in batches of 64
  for (let i = 0; i < stale.length; i += 64) {
    const batch = stale.slice(i, i + 64)
    const vectors = await embed(batch.map(leadText))
    batch.forEach((l, j) => { store[l.id] = { hash: hashOf(leadText(l)), vector: vectors[j] } })
  }
  // Drop vectors for deleted leads
  const ids = new Set(leads.map((l) => l.id))
  for (const id of Object.keys(store)) if (!ids.has(id)) delete store[id]
  if (stale.length > 0) await saveStore(store)

  const [qv] = await embed([question])
  return leads
    .map((l) => ({ l, score: store[l.id] ? cosine(qv, store[l.id].vector) : 0 }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((x) => x.l)
}
