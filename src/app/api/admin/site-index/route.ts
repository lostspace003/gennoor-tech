import { NextRequest, NextResponse } from 'next/server'
import { requireCrmUser } from '@/lib/crm/access'
import { embedTexts } from '@/lib/crm/embeddings'
import {
  loadIndexMeta, saveIndex, loadVectors, EMBED_DIM, SiteChunk, SiteIndexMeta,
  readIndexStatus, writeIndexStatus,
} from '@/lib/bot/store'
import crypto from 'crypto'

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gennoor.com'
const CHUNK_CHARS = 3200 // ~800 tokens
const EXCLUDE = [/\/crm/, /\/admin/, /\/api\//, /\/verify\//, /sitemap/, /\/media\//]

function hash(s: string) { return crypto.createHash('sha1').update(s).digest('hex') }

function htmlToText(html: string): { title: string; text: string } {
  const title = (html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] || '').replace(/\s*[|—-]\s*Gennoor.*$/i, '').trim()
  const body = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<nav[\s\S]*?<\/nav>/gi, ' ')
    .replace(/<footer[\s\S]*?<\/footer>/gi, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<(h[1-3])[^>]*>/gi, '\n## ')
    .replace(/<(li|p|tr|h[4-6])[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&#x27;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  const text = body.split('\n').map((l) => l.replace(/\s+/g, ' ').trim()).filter(Boolean).join('\n')
  return { title, text }
}

// The actual crawl+embed job. Runs detached from the HTTP request because a
// full index exceeds the App Service request timeout (~230s). Progress and
// result land in site-index/status.json.
async function runIndex() {
  try {
    const sitemapRes = await fetch(`${SITE}/sitemap.xml`, { headers: { 'User-Agent': 'GennoorCare-Indexer' } })
    if (!sitemapRes.ok) throw new Error(`sitemap fetch failed (${sitemapRes.status})`)
    const xml = await sitemapRes.text()
    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
      .map((m) => m[1].trim())
      .filter((u) => !EXCLUDE.some((rx) => rx.test(u)))
    if (urls.length === 0) throw new Error('No URLs found in sitemap')

    const prev = await loadIndexMeta()
    const prevVectors = prev ? await loadVectors(prev.updatedAt) : null
    const prevByChunk = new Map<string, number>()
    prev?.chunks.forEach((c, i) => prevByChunk.set(c.id, i))

    const pages: Record<string, string> = {}
    const chunks: SiteChunk[] = []
    let changedPages = 0
    let fetchErrors = 0

    for (let i = 0; i < urls.length; i += 8) {
      const batch = urls.slice(i, i + 8)
      const results = await Promise.all(batch.map(async (url) => {
        try {
          const res = await fetch(url, { headers: { 'User-Agent': 'GennoorCare-Indexer' } })
          if (!res.ok) return null
          return { url, html: await res.text() }
        } catch { return null }
      }))
      for (const r of results) {
        if (!r) { fetchErrors++; continue }
        const { title, text } = htmlToText(r.html)
        if (text.length < 200) continue
        const pageHash = hash(text)
        pages[r.url] = pageHash
        if (prev?.pages[r.url] !== pageHash) changedPages++
        for (let c = 0, n = 0; c < text.length && n < 12; c += CHUNK_CHARS - 300, n++) {
          const piece = text.slice(c, c + CHUNK_CHARS)
          chunks.push({ id: hash(`${r.url}|${piece}`), url: r.url, title: title || r.url, text: piece, hash: pageHash })
        }
      }
      if (i % 80 === 0) {
        await writeIndexStatus({ state: 'running', startedAt: new Date().toISOString(), progress: `crawled ${Math.min(i + 8, urls.length)}/${urls.length} pages` }).catch(() => {})
      }
    }

    const vectors = new Float32Array(chunks.length * EMBED_DIM)
    const toEmbed: number[] = []
    chunks.forEach((c, i) => {
      const prevIdx = prevByChunk.get(c.id)
      if (prevIdx !== undefined && prevVectors) {
        vectors.set(prevVectors.subarray(prevIdx * EMBED_DIM, (prevIdx + 1) * EMBED_DIM), i * EMBED_DIM)
      } else {
        toEmbed.push(i)
      }
    })
    // Pace embeddings under the deployment's tokens-per-minute limit:
    // 24 chunks (~19K tokens) per call, 12s between calls. A full first
    // index takes ~25 quiet minutes; monthly deltas take seconds.
    const EMBED_BATCH = 24
    for (let i = 0; i < toEmbed.length; i += EMBED_BATCH) {
      const idxs = toEmbed.slice(i, i + EMBED_BATCH)
      const embedded = await embedTexts(idxs.map((x) => `${chunks[x].title}\n${chunks[x].text}`))
      idxs.forEach((x, j) => vectors.set(embedded[j], x * EMBED_DIM))
      if ((i / EMBED_BATCH) % 5 === 0) {
        await writeIndexStatus({ state: 'running', startedAt: new Date().toISOString(), progress: `embedded ${Math.min(i + EMBED_BATCH, toEmbed.length)}/${toEmbed.length} chunks` }).catch(() => {})
      }
      if (i + EMBED_BATCH < toEmbed.length) await new Promise((r) => setTimeout(r, 12_000))
    }

    const meta: SiteIndexMeta = { chunks, pages, updatedAt: new Date().toISOString() }
    await saveIndex(meta, vectors)
    await writeIndexStatus({
      state: 'done',
      startedAt: new Date().toISOString(),
      finishedAt: new Date().toISOString(),
      result: { pages: Object.keys(pages).length, chunks: chunks.length, changedPages, embedded: toEmbed.length, fetchErrors },
    })
  } catch (error: any) {
    console.error('Site index error:', error)
    await writeIndexStatus({ state: 'error', startedAt: new Date().toISOString(), finishedAt: new Date().toISOString(), error: String(error?.message || error) }).catch(() => {})
  }
}

function cronAuthorized(req: NextRequest): boolean {
  return Boolean(process.env.CRM_CRON_SECRET && req.headers.get('x-cron-secret') === process.env.CRM_CRON_SECRET)
}

// POST → start the index job (returns immediately; job continues server-side)
export async function POST(req: NextRequest) {
  const cronOk = cronAuthorized(req)
  const user = cronOk ? null : await requireCrmUser()
  if (!cronOk && !user?.isManager) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const status = await readIndexStatus()
  if (status?.state === 'running' && Date.now() - new Date(status.startedAt).getTime() < 30 * 60_000) {
    return NextResponse.json({ started: false, alreadyRunning: true, progress: status.progress }, { status: 409 })
  }

  await writeIndexStatus({ state: 'running', startedAt: new Date().toISOString(), progress: 'starting crawl' })
  runIndex() // deliberately not awaited — outlives this request
  return NextResponse.json({ started: true, note: 'Indexing runs in the background — poll GET for status.' }, { status: 202 })
}

// GET → index info + job status (manager session or cron secret)
export async function GET(req: NextRequest) {
  const cronOk = cronAuthorized(req)
  const user = cronOk ? null : await requireCrmUser()
  if (!cronOk && !user?.isManager) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [meta, status] = await Promise.all([loadIndexMeta(), readIndexStatus()])
  return NextResponse.json({
    indexed: Boolean(meta),
    pages: meta ? Object.keys(meta.pages).length : 0,
    chunks: meta?.chunks.length || 0,
    updatedAt: meta?.updatedAt || null,
    job: status,
  })
}
