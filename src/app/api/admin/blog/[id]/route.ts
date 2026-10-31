import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { deleteBlogDraft, mutateBlogDraft, readTimeOf, slugify, type BlogMeta } from '@/lib/blog-studio'

export const dynamic = 'force-dynamic'

const str = (v: unknown, max: number) => String(v ?? '').slice(0, max)
const strs = (v: unknown, n: number, max: number) => (Array.isArray(v) ? v : []).map(x => str(x, max).trim()).filter(Boolean).slice(0, n)

/** Editor changes: any part of the article or its metadata, plus draft/approved status. */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const { id } = await params
  const b = await req.json().catch(() => ({}))
  const d = await mutateBlogDraft(id, x => {
    if (x.status === 'submitted') return
    if (typeof b.body === 'string') { x.body = b.body.slice(0, 200_000); x.meta.readTime = readTimeOf(x.body) }
    const m: Partial<BlogMeta> = b.meta || {}
    if (typeof m.title === 'string') x.meta.title = str(m.title, 160)
    if (typeof m.slug === 'string' && slugify(m.slug)) x.meta.slug = slugify(m.slug)
    if (typeof m.excerpt === 'string') x.meta.excerpt = str(m.excerpt, 600)
    if (typeof m.tldr === 'string') x.meta.tldr = str(m.tldr, 800)
    if (typeof m.category === 'string' && m.category.trim()) x.meta.category = str(m.category, 60).trim()
    if (typeof m.icon === 'string') x.meta.icon = str(m.icon, 8)
    if (typeof m.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(m.date)) x.meta.date = m.date
    if (typeof m.coverColor === 'string' && /^#[0-9a-f]{6}$/i.test(m.coverColor)) x.meta.coverColor = m.coverColor
    if (Array.isArray(m.tags)) x.meta.tags = strs(m.tags, 12, 50)
    if (Array.isArray(m.hashtags)) x.meta.hashtags = strs(m.hashtags, 10, 40).map(h => (h.startsWith('#') ? h : `#${h}`))
    if (Array.isArray(m.keyTakeaways)) x.meta.keyTakeaways = strs(m.keyTakeaways, 8, 500)
    if (Array.isArray(m.faqs)) x.meta.faqs = m.faqs.map(f => ({ question: str(f?.question, 300).trim(), answer: str(f?.answer, 1200).trim() })).filter(f => f.question && f.answer).slice(0, 8)
    if (Array.isArray(m.references)) x.meta.references = m.references.map(r => ({ title: str(r?.title, 250).trim(), url: str(r?.url, 500).trim(), source: str(r?.source, 150).trim() })).filter(r => /^https?:\/\//.test(r.url) && r.title).slice(0, 14)
    if (b.status === 'draft' || b.status === 'approved') x.status = b.status
  })
  if (!d) return NextResponse.json({ error: 'Not found.' }, { status: 404 })
  return NextResponse.json({ draft: d })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  await deleteBlogDraft((await params).id)
  return NextResponse.json({ ok: true })
}
