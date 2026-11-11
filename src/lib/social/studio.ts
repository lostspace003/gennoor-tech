import { BlobServiceClient } from '@azure/storage-blob'
import { randomBytes } from 'crypto'
import { agentFetch, agentServiceConfigured } from '@/lib/social/agent-service'
import { refSourceUrls, sourceImageFromUrl, withReferences, type Ref } from '@/lib/social/references'
import { foundryAuthHeader, foundryConfigured } from '@/lib/crm/foundry'
import { artBrief, artInstruction, pickArt, type Art } from '@/lib/social/art-direction'
import { extractHashtags, formatForLinkedIn, LINKEDIN_STYLE_GUIDE } from '@/lib/linkedin-format'

// Social studio drafts: one JSON blob for the drafts, one blob per generated image.
// Same blob-store pattern as the rest of the admin tooling.
const CONTAINER = 'crm-data'
const DRAFTS = 'social/drafts.json'
const BASE = process.env.FOUNDRY_OPENAI_BASE || 'https://admin-5924-resource.openai.azure.com'
export const TEXT_MODEL = process.env.FOUNDRY_POST_MODEL || process.env.FOUNDRY_WEB_MODEL || 'gpt-5.4'
const IMAGE_DEPLOYMENT = process.env.FOUNDRY_IMAGE_DEPLOYMENT || 'gpt-image-2'

export type DraftKind = 'post' | 'poll'
export type PollDuration = 'ONE_DAY' | 'THREE_DAYS' | 'SEVEN_DAYS' | 'FOURTEEN_DAYS'
export interface PollSpec { question: string; options: string[]; duration: PollDuration }

export type DraftStatus = 'draft' | 'approved' | 'published'

export interface TraceStep { agent: string; label: string; output: string; usd: number }
export interface Motion { scene: Record<string, unknown>; seconds: number }

export interface Draft {
  id: string
  /** Pages this post is about; their own picture is used as the base of the image. */
  sourceUrls?: string[]
  kind?: DraftKind
  poll?: PollSpec
  topic: string
  status: DraftStatus
  text: string
  imagePrompt: string
  hasImage: boolean
  createdAt: string
  updatedAt: string
  published: { as: 'member' | 'organization'; urn: string; at: string; reshare?: boolean; comment?: string; commentError?: string }[]
  references?: Ref[]
  /** Motion-graphic GIF produced by the agent service, plus the editable scene spec. */
  motion?: Motion
  /** What each agent did when the draft was made, kept so the process can be reviewed later. */
  trace?: TraceStep[]
  review?: { verdict: string; notes: string[] }
  /** The look chosen for this post's image, so consecutive posts never match. */
  art?: Art
  /** Text as last sent to LinkedIn, so edits made after publishing can be detected. */
  publishedText?: string
  /** Set when the editor chose a time: the heartbeat posts it then. Cleared once posted or cancelled. */
  scheduled?: { at: string; as: ('member' | 'organization')[]; media: 'gif' | 'still'; state: 'pending' | 'publishing' | 'failed'; tries: number; error?: string; busyAt?: string }
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

const WRITER = `You write LinkedIn posts for Gennoor Tech, an enterprise AI and Microsoft training company (India). Voice: practical, credible, no hype, no emoji spam. NEVER use first-person singular (no "I", "I'm", "I've", "my", "me"); write direct and impersonal, about the topic or "you". Choose the shape that suits the topic and vary it from post to post: a tight 60-word take, a numbered walkthrough, a list of as many items as the material supports, a short before/after story, or a copyable prompt; usually 60-250 words with short lines. A strong first line (never "X announced Y"), one concrete takeaway, a closing line that invites a reply or a save, and 3-4 relevant hashtags at the end. Never invent statistics or quotes. Also write an image prompt for a realistic, text-free photograph of a believable real-world scene (styled per the art direction you are given, no logos, no readable text).
Reply as JSON only: {"text": string, "imagePrompt": string}`

const POLL_WRITER = `You write LinkedIn polls for Gennoor Tech, an enterprise AI and Microsoft training company (India). Never use first-person singular ("I", "my", "me"). Write a short intro (40-90 words, plain, a clear reason to vote, 3 relevant hashtags at the end) and a poll. LinkedIn limits: question max 140 characters, 2 to 4 options, each option max 30 characters. Options must be distinct and balanced. Never invent statistics.
Reply as JSON only: {"text": string, "question": string, "options": string[]}`

/** The post-writing agent: topic in, reviewed-by-human draft out. */
export async function createDraft(topic: string, brief = '', kind: DraftKind = 'post', refs: Ref[] = []): Promise<Draft> {
  const art = pickArt((await listDrafts()).slice(0, 8).map(x => x.art).filter(Boolean) as Art[])
  const json = await foundry('/openai/v1/responses', {
    model: TEXT_MODEL,
    instructions: kind === 'poll' ? POLL_WRITER : WRITER + artInstruction(art),
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
    text: await polishPost((parsed.text || '').trim()), imagePrompt: parsed.imagePrompt?.trim() ? `${parsed.imagePrompt.trim()}

${artBrief(art)}` : '', art,
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
      instructions: `You tidy LinkedIn posts for Gennoor Tech without changing their meaning. ${LINKEDIN_STYLE_GUIDE}\nKeep every fact, name, number and link exactly. Rewrite any first-person singular ("I", "I'm", "I've", "my", "me") into a direct, impersonal voice. Do not add claims. If the post already has hashtags keep them; if it has none, add 3 to 5 relevant ones. Return only the final post text.`,
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
      instructions: 'You rewrite image-generation prompts for realistic, magazine-quality, text-free LinkedIn photographs (keep the art direction already in the prompt unless the editor asks to change it; no logos, no readable text). Apply the editor\'s instruction and reply as JSON only: {"imagePrompt": string}',
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
/** Adds the Gennoor logo + website strip under an image (same as generated images). Returns the original if the service is unreachable. */
export async function brandImageBuffer(image: Buffer): Promise<{ data: Buffer; branded: boolean }> {
  if (!agentServiceConfigured()) return { data: image, branded: false }
  try {
    const r = await agentFetch('/brand', { image: image.toString('base64') }, AbortSignal.timeout(120_000))
    const j = await r.json().catch(() => ({}))
    if (r.ok && j.image) return { data: Buffer.from(j.image, 'base64'), branded: true }
  } catch { /* keep the unbranded image */ }
  return { data: image, branded: false }
}

export async function generateImage(id: string): Promise<Draft | null> {
  const d = await getDraft(id)
  if (!d) return null
  if (!d.imagePrompt.trim()) throw new Error('Write an image prompt first.')
  const url = `/openai/deployments/${IMAGE_DEPLOYMENT}/images/generations?api-version=2025-04-01-preview`
  const REAL = 'Make it a realistic, natural-looking professional photograph with true-to-life lighting and proportions. No text, no logos, no illustration or CGI look.'
  let json: any
  // 1) Build on the real picture from the source page (when it has one): edit it into a clean, realistic hero image.
  const sources = [...(d.sourceUrls || []), ...(await refSourceUrls(d.references))].slice(0, 3)
  for (const src of sources) {
    const base = await sourceImageFromUrl(src)
    if (!base) continue
    try {
      const form = new FormData()
      form.append('image', new Blob([new Uint8Array(base)], { type: 'image/png' }), 'source.png')
      form.append('prompt', `${d.imagePrompt}

Use the supplied photo as the real subject and setting; keep it recognisable and true to life, improve framing and lighting, extend it to a wide landscape composition. ${REAL}`)
      form.append('size', '1536x1024')
      const res = await fetch(`${BASE}/openai/deployments/${IMAGE_DEPLOYMENT}/images/edits?api-version=2025-04-01-preview`, { method: 'POST', headers: await foundryAuthHeader(), body: form })
      const j = await res.json().catch(() => ({}))
      if (res.ok && j.data?.[0]?.b64_json) { json = j; break }
    } catch { /* try the next source, then plain generation */ }
  }
  // 2) Otherwise generate a realistic photograph from the prompt. Highest quality first; fall back if not accepted.
  if (!json) {
    const prompt = `${d.imagePrompt}

${REAL}`
    json = await foundry(url, { prompt, size: '1536x1024', n: 1, quality: 'high' }).catch(e => (/quality|unknown|unsupported|invalid/i.test(String(e?.message)) ? foundry(url, { prompt, size: '1536x1024', n: 1 }) : Promise.reject(e)))
  }
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

export const getMotion = (id: string) => readBlob(`social/${id}.gif`)

export async function saveMotion(id: string, r: { gif: string; seconds: number }, scene: Record<string, unknown>) {
  await writeBlob(`social/${id}.gif`, Buffer.from(r.gif, 'base64'), 'image/gif')
  return mutateDraft(id, x => { x.motion = { scene, seconds: r.seconds } })
}

/** Persists the result of an agent run as a normal draft, so it flows through the same edit / approve / publish steps. */
export async function createAgentDraft(
  topic: string,
  res: { text?: string; imagePrompt?: string; scene?: Record<string, unknown>; review?: { verdict: string; notes: string[] }; render?: { gif: string; seconds: number } },
  trace: TraceStep[], refs: Ref[] = [], sourceUrls: string[] = [],
): Promise<Draft> {
  const now = new Date().toISOString()
  const art = pickArt((await listDrafts()).slice(0, 8).map(x => x.art).filter(Boolean) as Art[])
  const d: Draft = {
    id: randomBytes(6).toString('hex'), topic, status: 'draft', kind: 'post',
    text: await polishPost((res.text || '').trim()), imagePrompt: res.imagePrompt?.trim() ? `${res.imagePrompt.trim()}

${artBrief(art)}` : '', art,
    hasImage: false, createdAt: now, updatedAt: now, published: [],
    ...(sourceUrls.length ? { sourceUrls } : {}), ...(refs.length ? { references: refs } : {}), trace, ...(res.review ? { review: res.review } : {}),
  }
  await saveDrafts([d, ...(await listDrafts())])
  if (res.render && res.scene) return (await saveMotion(d.id, res.render, res.scene)) || d
  return d
}
