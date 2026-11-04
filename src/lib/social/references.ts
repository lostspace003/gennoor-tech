import { randomBytes } from 'crypto'
import dns from 'dns/promises'
import net from 'net'
import { readBlob, writeBlob } from '@/lib/social/studio'
import { foundryConfigured, webGroundedCompletion } from '@/lib/crm/foundry'

// Reference material for the writing and image agents: pasted URLs, documents and images.
// Text is extracted once at upload and stored beside the draft data; images are kept as-is for vision input.
export interface Ref { id: string; kind: 'url' | 'file' | 'image'; name: string; chars: number; mime?: string }

const MAX_FILE = 8 * 1024 * 1024
const MAX_TEXT_PER_REF = 12_000
const MAX_TEXT_TOTAL = 30_000
const metaKey = (id: string) => `social/refs/${id}.json`
const imgKey = (id: string) => `social/refs/${id}.bin`

function isPrivate(ip: string) {
  if (net.isIPv6(ip)) return ip === '::1' || ip.startsWith('fc') || ip.startsWith('fd') || ip.startsWith('fe80') || ip.startsWith('::ffff:127.') || ip.startsWith('::ffff:10.') || ip.startsWith('::ffff:192.168.')
  const [a, b] = ip.split('.').map(Number)
  return a === 10 || a === 127 || a === 0 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || a >= 224
}

async function assertPublicHttp(u: URL) {
  if (u.protocol !== 'https:' && u.protocol !== 'http:') throw new Error('Only http and https links can be used.')
  const host = u.hostname.replace(/^\[|\]$/g, '')
  const addrs = net.isIP(host) ? [{ address: host }] : await dns.lookup(host, { all: true })
  if (!addrs.length || addrs.some(a => isPrivate(a.address))) throw new Error('That address is not reachable from here.')
}

function htmlToText(html: string) {
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() || ''
  const body = html
    .replace(/<(script|style|noscript|svg|nav|footer|header)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<(br|\/p|\/div|\/li|\/h[1-6]|\/tr)[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/[ \t]+/g, ' ').replace(/\n\s*\n+/g, '\n\n').trim()
  return { title, text: body }
}

async function save(kind: Ref['kind'], name: string, text: string, mime?: string, image?: Buffer): Promise<Ref> {
  const id = randomBytes(6).toString('hex')
  const ref: Ref = { id, kind, name: name.slice(0, 120), chars: text.length, ...(mime ? { mime } : {}) }
  await writeBlob(metaKey(id), JSON.stringify({ ...ref, text: text.slice(0, MAX_TEXT_PER_REF) }), 'application/json')
  if (image) await writeBlob(imgKey(id), image, mime || 'application/octet-stream')
  return ref
}

export async function addUrlRef(raw: string): Promise<Ref> {
  let u = new URL(raw.trim())
  let res: Response | undefined
  for (let i = 0; i < 4; i++) {
    await assertPublicHttp(u)
    res = await fetch(u, { redirect: 'manual', signal: AbortSignal.timeout(10_000), headers: { 'User-Agent': 'GennoorStudio/1.0', Accept: 'text/html,text/plain' } })
    const loc = res.headers.get('location')
    if (res.status >= 300 && res.status < 400 && loc) { u = new URL(loc, u); continue }
    break
  }
  if (!res || !res.ok) {
    // Many course and news sites (Udemy, Coursera, paywalled news) refuse automated readers. Fall back to the AI's own
    // web search for that page, so the link still gives the agent real content to work from.
    if ([401, 403, 429, 503].includes(res?.status ?? 0) && foundryConfigured()) {
      try {
        const g = await webGroundedCompletion(
          'You read web pages for a content team. Using web search, find the page at the given URL (or what is published about it) and write a faithful factual summary: title, who it is for, objectives or key points, curriculum or section headings, and any concrete numbers shown. Plain text, no opinions, never invent details. If you cannot find it, say exactly: NOT FOUND.',
          u.toString(), 1500)
        if (g.text && g.text.length > 120 && !/^\s*NOT FOUND/i.test(g.text)) return save('url', `${u.hostname} (via web search)`, `Source: ${u.toString()}
${g.text}`)
      } catch { /* fall through to the clear message */ }
    }
    throw new Error(`That site (${res?.status ?? 'no response'}) blocks automated readers. Paste the key points into the notes box instead.`)
  }
  const buf = Buffer.from(await res.arrayBuffer())
  if (buf.length > 2 * 1024 * 1024) throw new Error('That page is too large to use as a reference.')
  const type = res.headers.get('content-type') || ''
  const body = buf.toString('utf-8')
  const { title, text } = /html/i.test(type) ? htmlToText(body) : { title: '', text: body }
  if (text.length < 40) throw new Error('No readable text found at that link.')
  return save('url', title || u.hostname, `Source: ${u.toString()}\n${text}`)
}

export async function addFileRef(name: string, mime: string, buf: Buffer): Promise<Ref> {
  if (buf.length > MAX_FILE) throw new Error('Files must be under 8 MB.')
  const lower = name.toLowerCase()
  if (mime.startsWith('image/')) return save('image', name, '', mime, buf)
  let text = ''
  if (lower.endsWith('.pdf')) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdf = require('pdf-parse/lib/pdf-parse.js')
    text = (await pdf(buf)).text
  } else if (lower.endsWith('.docx')) {
    const mammoth = await import('mammoth')
    text = (await mammoth.extractRawText({ buffer: buf })).value
  } else if (/\.(txt|md|markdown|csv|json|html?)$/.test(lower) || mime.startsWith('text/')) {
    text = /\.html?$/.test(lower) ? htmlToText(buf.toString('utf-8')).text : buf.toString('utf-8')
  } else {
    throw new Error('Supported: PDF, Word (.docx), text, markdown, CSV, JSON, HTML and images.')
  }
  text = text.replace(/\s+\n/g, '\n').trim()
  if (text.length < 20) throw new Error('No readable text found in that file.')
  return save('file', name, text, mime)
}

/** Builds the model input: the prompt text plus reference text (capped) and any images as vision parts. */
export async function withReferences(prompt: string, refs: Ref[] | undefined): Promise<string | unknown[]> {
  if (!refs?.length) return prompt
  let budget = MAX_TEXT_TOTAL
  const blocks: string[] = []
  const images: unknown[] = []
  for (const r of refs) {
    if (r.kind === 'image') {
      const b = await readBlob(imgKey(r.id))
      if (b) images.push({ type: 'input_image', image_url: `data:${r.mime || 'image/png'};base64,${b.toString('base64')}` })
      continue
    }
    const raw = await readBlob(metaKey(r.id))
    if (!raw || budget <= 0) continue
    const text: string = JSON.parse(raw.toString('utf-8')).text.slice(0, budget)
    budget -= text.length
    blocks.push(`--- Reference: ${r.name} ---\n${text}`)
  }
  const full = `${prompt}\n\nReference material supplied by the editor. Use it as the factual basis; do not invent beyond it, and do not copy it verbatim:\n${blocks.join('\n\n')}`
  return images.length ? [{ role: 'user', content: [{ type: 'input_text', text: full }, ...images] }] : full
}

export async function getRefs(ids: string[]): Promise<Ref[]> {
  const out: Ref[] = []
  for (const id of ids.filter(i => /^[0-9a-f]{12}$/.test(i))) {
    const raw = await readBlob(metaKey(id))
    if (!raw) continue
    const { text: _t, ...ref } = JSON.parse(raw.toString('utf-8'))
    out.push(ref as Ref)
  }
  return out
}

/** The page's own hero picture (og:image / twitter:image), fetched safely. Null when there is none or it is unusable. */
export async function sourceImageFromUrl(raw: string): Promise<Buffer | null> {
  try {
    let u = new URL(raw)
    await assertPublicHttp(u)
    const page = await fetch(u, { redirect: 'follow', signal: AbortSignal.timeout(10_000), headers: { 'User-Agent': 'GennoorStudio/1.0', Accept: 'text/html' } })
    if (!page.ok) return null
    const html = (await page.text()).slice(0, 400_000)
    const m = html.match(/<meta[^>]+(?:property|name)=["'](?:og:image(?::secure_url)?|twitter:image)["'][^>]*content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["'](?:og:image|twitter:image)["']/i)
    if (!m) return null
    u = new URL(m[1].replace(/&amp;/g, '&'), u)
    await assertPublicHttp(u)
    const img = await fetch(u, { signal: AbortSignal.timeout(12_000), headers: { 'User-Agent': 'GennoorStudio/1.0' } })
    if (!img.ok || !/^image\/(png|jpe?g|webp)/i.test(img.headers.get('content-type') || '')) return null
    const buf = Buffer.from(await img.arrayBuffer())
    return buf.length > 1000 && buf.length < 8 * 1024 * 1024 ? buf : null
  } catch { return null }
}

/** URLs the editor attached as references (they are stored as "Source: <url>" at the top of the saved text). */
export async function refSourceUrls(refs: Ref[] | undefined): Promise<string[]> {
  const out: string[] = []
  for (const r of refs || []) {
    if (r.kind !== 'url') continue
    try {
      const meta = JSON.parse((await readBlob(metaKey(r.id)))?.toString('utf-8') || '{}')
      const url = String(meta.text || '').match(/^Source: (\S+)/)?.[1]
      if (url) out.push(url)
    } catch { /* skip */ }
  }
  return out
}
