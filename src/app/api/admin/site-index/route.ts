import { NextRequest, NextResponse } from 'next/server'
import { requireCrmUser } from '@/lib/crm/access'
import { embedTexts } from '@/lib/crm/embeddings'
import { loadIndexMeta, saveIndex, loadVectors, EMBED_DIM, SiteChunk, SiteIndexMeta } from '@/lib/bot/store'
import crypto from 'crypto'

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gennoor.com'
const CHUNK_CHARS = 3200 // ~800 tokens
const EXCLUDE = [/\/crm/, /\/admin/, /\/api\//, /\/verify\//, /sitemap/, /\/media\//]

function hash(s: string) { return crypto.createHash('sha1').update(s).digest('hex') }

function htmlToText(html: string): { title: string; text: string } {
  const title = (html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] || '').replace(/\s*[|—-]\s*Gennoor.*$/i, '').trim()
  let body = html
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

// Rebuilds the site knowledge index. Delta-based: unchanged pages keep their
// existing chunks and vectors; only new/changed pages are re-embedded.
// Auth: CRM manager session OR the cron secret (monthly GitHub Action).
export async function POST(req: NextRequest) {
  const cronOk = process.env.CRM_CRON_SECRET && req.headers.get('x-cron-secret') === process.env.CRM_CRON_SECRET
  const user = cronOk ? null : await requireCrmUser()
  if (!cronOk && !user?.isManager) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    // 1. Sitemap → URL list
    const sitemapRes = await fetch(`${SITE}/sitemap.xml`, { headers: { 'User-Agent': 'GennoorBot-Indexer' } })
    if (!sitemapRes.ok) return NextResponse.json({ error: `sitemap fetch failed (${sitemapRes.status})` }, { status: 500 })
    const xml = await sitemapRes.text()
    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
      .map((m) => m[1].trim())
      .filter((u) => !EXCLUDE.some((rx) => rx.test(u)))
    if (urls.length === 0) return NextResponse.json({ error: 'No URLs found in sitemap' }, { status: 500 })

    const prev = await loadIndexMeta()
    const prevVectors = prev ? await loadVectors(prev.updatedAt) : null
    const prevByChunk = new Map<string, number>() // chunk id -> index in prev vectors
    prev?.chunks.forEach((c, i) => prevByChunk.set(c.id, i))

    // 2. Fetch pages (batches of 8), detect changes
    const pages: Record<string, string> = {}
    const chunks: SiteChunk[] = []
    let changedPages = 0
    let fetchErrors = 0

    for (let i = 0; i < urls.length; i += 8) {
      const batch = urls.slice(i, i + 8)
      const results = await Promise.all(batch.map(async (url) => {
        try {
          const res = await fetch(url, { headers: { 'User-Agent': 'GennoorBot-Indexer' } })
          if (!res.ok) return null
          return { url, html: await res.text() }
        } catch { return null }
      }))
      for (const r of results) {
        if (!r) { fetchErrors++; continue }
        const { title, text } = htmlToText(r.html)
        if (text.length < 200) continue // skip thin pages
        const pageHash = hash(text)
        pages[r.url] = pageHash
        if (prev?.pages[r.url] !== pageHash) changedPages++
        for (let c = 0, n = 0; c < text.length && n < 12; c += CHUNK_CHARS - 300, n++) {
          const piece = text.slice(c, c + CHUNK_CHARS)
          chunks.push({ id: hash(`${r.url}|${piece}`), url: r.url, title: title || r.url, text: piece, hash: pageHash })
        }
      }
    }

    // 3. Embed only chunks we don't already have vectors for
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
    for (let i = 0; i < toEmbed.length; i += 64) {
      const idxs = toEmbed.slice(i, i + 64)
      const embedded = await embedTexts(idxs.map((x) => `${chunks[x].title}\n${chunks[x].text}`))
      idxs.forEach((x, j) => vectors.set(embedded[j], x * EMBED_DIM))
    }

    const meta: SiteIndexMeta = { chunks, pages, updatedAt: new Date().toISOString() }
    await saveIndex(meta, vectors)

    return NextResponse.json({
      success: true,
      pages: Object.keys(pages).length,
      chunks: chunks.length,
      changedPages,
      embedded: toEmbed.length,
      fetchErrors,
    })
  } catch (error: any) {
    console.error('Site index error:', error)
    return NextResponse.json({ error: `Indexing failed: ${error?.message}` }, { status: 500 })
  }
}

export async function GET() {
  const user = await requireCrmUser()
  if (!user?.isManager) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const meta = await loadIndexMeta()
  return NextResponse.json(meta ? { indexed: true, pages: Object.keys(meta.pages).length, chunks: meta.chunks.length, updatedAt: meta.updatedAt } : { indexed: false })
}
