import { BlobServiceClient } from '@azure/storage-blob'
import { randomBytes } from 'crypto'
import { agentFetch, agentServiceConfigured } from '@/lib/social/agent-service'
import { withReferences, type Ref } from '@/lib/social/references'
import { foundryAuthHeader, foundryConfigured } from '@/lib/crm/foundry'
import { extractHashtags, formatForLinkedIn, LINKEDIN_STYLE_GUIDE } from '@/lib/linkedin-format'

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

export interface TraceStep { agent: string; label: string; output: string; usd: number }
export interface Motion { scene: Record<string, unknown>; seconds: number; hasMp4: boolean }

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
  references?: Ref[]
  /** Motion-graphic GIF (and MP4) produced by the agent service, plus the editable scene spec. */
  motion?: Motion
  /** What each agent did when the draft was made, kept so the process can be reviewed later. */
  trace?: TraceStep[]
  review?: { verdict: string; notes: string[] }
  /** Text as last sent to LinkedIn, so edits made after publishing can be detected. */
  publishedText?: string
}

function container() {
  const conn = process.env.AZURE_STORAGE_CONNECTION_STRING
  if (!conn) throw new Error('AZURE_STORAGE_CONNECTION_STRING not configured')
  return BlobServiceClient.fromConnectionString(conn).getContainerClient(CONTAINER)
}

export async function readBlob(name: string): Promise<Buffer | null> {
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

export async function writeBlob(name: string, body: Buffer | string, type: string) {
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

export async function saveDrafts(all: Draft[]) { await writeBlob(DRAFTS, JSON.stringify(all), 'application/json') }

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

// Spend ledger: one append-only blob, so deleting a draft never loses its cost. Prices are USD estimates
// (set FOUNDRY_TEXT_USD_IN / _OUT per 1M tokens and FOUNDRY_IMAGE_USD per image to match your Azure rates).
const LEDGER = 'social/spend.json'
const USD_IN = Number(process.env.FOUNDRY_TEXT_USD_IN || 2.5) / 1e6
const USD_OUT = Number(process.env.FOUNDRY_TEXT_USD_OUT || 10) / 1e6
const USD_IMAGE = Number(process.env.FOUNDRY_IMAGE_USD || 0.17)

export interface SpendEntry { draftId: string; at: string; label: string; usd: number; tokens?: number }

export async function listSpend(): Promise<SpendEntry[]> {
  const raw = await readBlob(LEDGER)
  return raw ? JSON.parse(raw.toString('utf-8')) : []
}
export async function recordSpend(draftId: string, label: string, usd: number, tokens?: number) {
  const all = await listSpend()
  all.push({ draftId, at: new Date().toISOString(), label, usd, ...(tokens ? { tokens } : {}) })
  await writeBlob(LEDGER, JSON.stringify(all), 'application/json')
}
export const textUsd = (j: any) => (j?.usage?.input_tokens || 0) * USD_IN + (j?.usage?.output_tokens || 0) * USD_OUT
export const tokensOf = (j: any) => (j?.usage?.input_tokens || 0) + (j?.usage?.output_tokens || 0)

export async function foundry(path: string, body: unknown): Promise<any> {
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
export async function createDraft(topic: string, brief = '', kind: DraftKind = 'post', refs: Ref[] = []): Promise<Draft> {
  const json = await foundry('/openai/v1/responses', {
    model: TEXT_MODEL,
    instructions: kind === 'poll' ? POLL_WRITER : WRITER,
    input: await withReferences(`Topic: ${topic}${brief ? `\nNotes from the editor: ${brief}` : ''}`, refs),
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
    text: await polishPost((parsed.text || '').trim()), imagePrompt: (parsed.imagePrompt || '').trim(),
    hasImage: false, createdAt: now, updatedAt: now, published: [], ...(refs.length ? { references: refs } : {}),
  }
  await saveDrafts([d, ...(await listDrafts())])
  await recordSpend(d.id, 'Draft written', textUsd(json), tokensOf(json))
  return d
}

/**
 * "Format for LinkedIn": keeps every fact and the author's voice, and gives the post the house shape: a bold hook,
 * short paragraphs, quiet bullets, at most a light bulb and one plain symbol, and a tidy hashtag line. If the model is
 * unavailable the deterministic formatter still runs, so a post is never left half-formatted.
 */
export async function polishPost(text: string, spendId = 'format'): Promise<string> {
  const plain = (text || '').trim()
  if (!plain) return plain
  try {
    const j = await foundry('/openai/v1/responses', {
      model: TEXT_MODEL,
      instructions: `You tidy LinkedIn posts for Gennoor Tech without changing their meaning. ${LINKEDIN_STYLE_GUIDE}\nKeep every fact, name, number and link exactly. Keep the author's voice. Do not add claims. If the post already has hashtags keep them; if it has none, add 3 to 5 relevant ones. Return only the final post text.`,
      input: plain,
    })
    await recordSpend(spendId, 'Format for LinkedIn', textUsd(j), tokensOf(j))
    const out: string = j.output_text || (j.output || []).flatMap((o: any) => o.content || []).map((c: any) => c.text || '').join('')
    return formatForLinkedIn(out.trim().length > plain.length * 0.5 ? out : plain)
  } catch {
    return formatForLinkedIn(plain)
  }
}

/** The text that actually goes to LinkedIn: always tidied, and given hashtags by the model when it has none. */
export async function prepareForPublish(text: string, spendId = 'format'): Promise<string> {
  return extractHashtags(text).length ? formatForLinkedIn(text) : polishPost(text, spendId)
}

/** Revision agent: current text + the editor's instruction in, rewritten text out. */
export async function reviseDraft(id: string, instruction: string, target: 'post' | 'image' = 'post'): Promise<Draft | null> {
  const d = await getDraft(id)
  if (!d) return null
  if (target === 'image') {
    const j = await foundry('/openai/v1/responses', {
      model: TEXT_MODEL,
      instructions: 'You rewrite image-generation prompts for clean, on-brand, text-free LinkedIn illustrations (dark navy and electric blue palette, modern, no logos, no readable text). Apply the editor\'s instruction and reply as JSON only: {"imagePrompt": string}',
      input: await withReferences(`Post:\n${d.text}\n\nCurrent image prompt:\n${d.imagePrompt}\n\nEditor's instruction: ${instruction}`, d.references),
    })
    const o: string = j.output_text || (j.output || []).flatMap((x: any) => x.content || []).map((c: any) => c.text || '').join('')
    let p: { imagePrompt?: string } = {}
    try { p = JSON.parse(o.slice(o.indexOf('{'), o.lastIndexOf('}') + 1)) } catch { p = { imagePrompt: o } }
    await recordSpend(id, 'Image prompt revised', textUsd(j), tokensOf(j))
    return mutateDraft(id, x => { if (p.imagePrompt?.trim()) x.imagePrompt = p.imagePrompt.trim().slice(0, 4000) })
  }
  const json = await foundry('/openai/v1/responses', {
    model: TEXT_MODEL,
    instructions: `${d.kind === 'poll' ? POLL_WRITER : WRITER}\nYou are revising an existing draft. Apply the editor's instruction, keep what already works, and return the full revised result in the same JSON shape.`,
    input: await withReferences(`Topic: ${d.topic}\n\nCurrent post text:\n${d.text}${d.poll ? `\n\nCurrent poll: ${d.poll.question} | ${d.poll.options.join(' | ')}` : ''}\n\nEditor's instruction: ${instruction}`, d.references),
  })
  const out: string = json.output_text
    || (json.output || []).flatMap((o: any) => o.content || []).map((c: any) => c.text || '').join('')
  let parsed: { text?: string; question?: string; options?: string[] } = {}
  try { parsed = JSON.parse(out.slice(out.indexOf('{'), out.lastIndexOf('}') + 1)) } catch { parsed = { text: out } }
  await recordSpend(id, 'Post revised', textUsd(json), tokensOf(json))
  const polished = parsed.text?.trim() ? await polishPost(parsed.text.trim(), id) : ''
  return mutateDraft(id, x => {
    if (polished) x.text = polished.slice(0, 3000)
    if (x.kind === 'poll' && x.poll && parsed.question) {
      x.poll.question = parsed.question.slice(0, 140)
      if (parsed.options?.length) x.poll.options = parsed.options.slice(0, 4).map(o => String(o).slice(0, 30))
    }
    if (x.status !== 'published') x.status = 'draft'
  })
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
  // The real logo and website go on afterwards: an image model cannot be trusted to draw either correctly.
  let finalB64 = b64
  if (agentServiceConfigured()) {
    try {
      const r = await agentFetch('/brand', { image: b64 })
      const j = await r.json().catch(() => ({}))
      if (r.ok && j.image) finalB64 = j.image
    } catch { /* keep the unbranded image rather than fail the draft */ }
  }
  await writeBlob(`social/${id}.png`, Buffer.from(finalB64, 'base64'), 'image/png')
  await recordSpend(id, 'Image generated', USD_IMAGE)
  return mutateDraft(id, x => { x.hasImage = true })
}

// ---- Agent-service drafts (Microsoft Agent Framework pipeline + motion renderer) ----------------------------------

export const getMotion = (id: string, type: 'gif' | 'mp4') => readBlob(`social/${id}.${type}`)

export async function saveMotion(id: string, r: { gif: string; mp4: string | null; seconds: number }, scene: Record<string, unknown>) {
  await writeBlob(`social/${id}.gif`, Buffer.from(r.gif, 'base64'), 'image/gif')
  if (r.mp4) await writeBlob(`social/${id}.mp4`, Buffer.from(r.mp4, 'base64'), 'video/mp4')
  return mutateDraft(id, x => { x.motion = { scene, seconds: r.seconds, hasMp4: !!r.mp4 } })
}

/** Persists the result of an agent run as a normal draft, so it flows through the same edit / approve / publish steps. */
export async function createAgentDraft(
  topic: string,
  res: { text?: string; imagePrompt?: string; scene?: Record<string, unknown>; review?: { verdict: string; notes: string[] }; render?: { gif: string; mp4: string | null; seconds: number } },
  trace: TraceStep[], refs: Ref[] = [],
): Promise<Draft> {
  const now = new Date().toISOString()
  const d: Draft = {
    id: randomBytes(6).toString('hex'), topic, status: 'draft', kind: 'post',
    text: await polishPost((res.text || '').trim()), imagePrompt: (res.imagePrompt || '').trim(),
    hasImage: false, createdAt: now, updatedAt: now, published: [],
    ...(refs.length ? { references: refs } : {}), trace, ...(res.review ? { review: res.review } : {}),
  }
  await saveDrafts([d, ...(await listDrafts())])
  if (res.render && res.scene) return (await saveMotion(d.id, res.render, res.scene)) || d
  return d
}
