import { BlobServiceClient } from '@azure/storage-blob'
import { randomBytes } from 'crypto'
import { foundryAuthHeader, foundryConfigured } from '@/lib/crm/foundry'

// Social studio drafts: one JSON blob for the drafts, one blob per generated image.
// Same blob-store pattern as the rest of the admin tooling.
const CONTAINER = 'crm-data'
const DRAFTS = 'social/drafts.json'
const BASE = process.env.FOUNDRY_OPENAI_BASE || 'https://admin-5924-resource.openai.azure.com'
const TEXT_MODEL = process.env.FOUNDRY_POST_MODEL || process.env.FOUNDRY_WEB_MODEL || 'gpt-5.4'
const IMAGE_DEPLOYMENT = process.env.FOUNDRY_IMAGE_DEPLOYMENT || 'gpt-image-2'

export type DraftKind = 'post' | 'poll'
export type PollDuration = 'ONE_DAY' | 'THREE_DAYS' | 'SEVEN_DAYS' | 'FOURTEEN_DAYS'
export interface PollSpec { question: string; options: string[]; duration: PollDuration }

export type DraftStatus = 'draft' | 'approved' | 'published'

export interface Draft {
  id: string
  kind?: DraftKind
  poll?: PollSpec
  topic: string
  status: DraftStatus
  text: string
  imagePrompt: string
  hasImage: boolean
  createdAt: string
  updatedAt: string
  published: { as: 'member' | 'organization'; urn: string; at: string }[]
}

function container() {
  const conn = process.env.AZURE_STORAGE_CONNECTION_STRING
  if (!conn) throw new Error('AZURE_STORAGE_CONNECTION_STRING not configured')
  return BlobServiceClient.fromConnectionString(conn).getContainerClient(CONTAINER)
}

async function readBlob(name: string): Promise<Buffer | null> {
  try {
    const d = await container().getBlockBlobClient(name).download()
    const chunks: Buffer[] = []
    for await (const c of d.readableStreamBody as AsyncIterable<Buffer>) chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c))
    return Buffer.concat(chunks)
  } catch (e: any) {
    if (e?.statusCode === 404) return null
    throw e
  }
}

async function writeBlob(name: string, body: Buffer | string, type: string) {
  const c = container()
  await c.createIfNotExists()
  const buf = typeof body === 'string' ? Buffer.from(body) : body
  await c.getBlockBlobClient(name).upload(buf, buf.length, { blobHTTPHeaders: { blobContentType: type } })
}

export async function listDrafts(): Promise<Draft[]> {
  const raw = await readBlob(DRAFTS)
  const all: Draft[] = raw ? JSON.parse(raw.toString('utf-8')) : []
  return all.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

async function saveDrafts(all: Draft[]) { await writeBlob(DRAFTS, JSON.stringify(all), 'application/json') }

export async function getDraft(id: string) { return (await listDrafts()).find(d => d.id === id) || null }

export async function mutateDraft(id: string, fn: (d: Draft) => void): Promise<Draft | null> {
  const all = await listDrafts()
  const d = all.find(x => x.id === id)
  if (!d) return null
  fn(d)
  d.updatedAt = new Date().toISOString()
  await saveDrafts(all)
  return d
}

export async function deleteDraft(id: string) {
  await saveDrafts((await listDrafts()).filter(d => d.id !== id))
  try { await container().getBlockBlobClient(`social/${id}.png`).deleteIfExists() } catch { /* best effort */ }
}

export const getImage = (id: string) => readBlob(`social/${id}.png`)

async function foundry(path: string, body: unknown): Promise<any> {
  if (!foundryConfigured()) throw new Error('Foundry is not configured (FOUNDRY_API_KEY).')
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { ...(await foundryAuthHeader()), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json?.error?.message || `Foundry request failed (${res.status})`)
  return json
}

const WRITER = `You write LinkedIn posts for Gennoor Tech, an enterprise AI and Microsoft training company (India). Voice: practical, credible, no hype, no emoji spam. Write 120-220 words, short paragraphs, a strong first line, one concrete takeaway, a soft call to action, and 3-4 relevant hashtags at the end. Never invent statistics or quotes. Also write an image prompt for a clean, on-brand, text-free illustration (dark navy and electric blue palette, modern, no logos, no readable text).
Reply as JSON only: {"text": string, "imagePrompt": string}`

const POLL_WRITER = `You write LinkedIn polls for Gennoor Tech, an enterprise AI and Microsoft training company (India). Write a short intro (40-90 words, plain, a clear reason to vote, 3 relevant hashtags at the end) and a poll. LinkedIn limits: question max 140 characters, 2 to 4 options, each option max 30 characters. Options must be distinct and balanced. Never invent statistics.
Reply as JSON only: {"text": string, "question": string, "options": string[]}`

/** The post-writing agent: topic in, reviewed-by-human draft out. */
export async function createDraft(topic: string, brief = '', kind: DraftKind = 'post'): Promise<Draft> {
  const json = await foundry('/openai/v1/responses', {
    model: TEXT_MODEL,
    instructions: kind === 'poll' ? POLL_WRITER : WRITER,
    input: `Topic: ${topic}${brief ? `\nNotes from the editor: ${brief}` : ''}`,
  })
  const out: string = json.output_text
    || (json.output || []).flatMap((o: any) => o.content || []).map((c: any) => c.text || '').join('')
  let parsed: { text?: string; imagePrompt?: string; question?: string; options?: string[] } = {}
  try { parsed = JSON.parse(out.slice(out.indexOf('{'), out.lastIndexOf('}') + 1)) } catch { parsed = { text: out } }
  const now = new Date().toISOString()
  const d: Draft = {
    id: randomBytes(6).toString('hex'), topic, status: 'draft', kind,
    ...(kind === 'poll' ? { poll: {
      question: (parsed.question || topic).slice(0, 140),
      options: (parsed.options?.length ? parsed.options : ['Yes', 'No']).slice(0, 4).map(o => String(o).slice(0, 30)),
      duration: 'SEVEN_DAYS' as PollDuration,
    } } : {}),
    text: (parsed.text || '').trim(), imagePrompt: (parsed.imagePrompt || '').trim(),
    hasImage: false, createdAt: now, updatedAt: now, published: [],
  }
  await saveDrafts([d, ...(await listDrafts())])
  return d
}

/** Image agent: renders imagePrompt with gpt-image and stores the PNG. */
export async function generateImage(id: string): Promise<Draft | null> {
  const d = await getDraft(id)
  if (!d) return null
  if (!d.imagePrompt.trim()) throw new Error('Write an image prompt first.')
  const json = await foundry(`/openai/deployments/${IMAGE_DEPLOYMENT}/images/generations?api-version=2025-04-01-preview`, {
    prompt: d.imagePrompt, size: '1536x1024', n: 1,
  })
  const b64 = json.data?.[0]?.b64_json
  if (!b64) throw new Error('The image model returned no image.')
  await writeBlob(`social/${id}.png`, Buffer.from(b64, 'base64'), 'image/png')
  return mutateDraft(id, x => { x.hasImage = true })
}
