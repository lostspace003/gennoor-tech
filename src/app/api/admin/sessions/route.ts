import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { listDrafts } from '@/lib/social/studio'
import { listBlogDrafts } from '@/lib/blog-studio'
import { listActivity } from '@/lib/linkedin-hub'

export const dynamic = 'force-dynamic'

export interface SessionEvent { at: string; area: 'social' | 'blog' | 'linkedin'; title: string; detail: string; href?: string }

/** One timeline of everything done in the studios and the LinkedIn hub, newest first. The page groups it into sessions. */
export async function GET(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const [social, blog, activity] = await Promise.all([listDrafts(), listBlogDrafts(), listActivity()])
  const ev: SessionEvent[] = []

  for (const d of social) {
    const kind = d.motion ? 'motion graphic' : d.kind === 'poll' ? 'poll' : 'post'
    ev.push({ at: d.createdAt, area: 'social', title: `Drafted ${kind}: ${d.topic}`, detail: d.trace?.length ? 'AI agent team' : 'AI draft', href: `/admin/social?draft=${d.id}` })
    if (d.updatedAt > d.createdAt) ev.push({ at: d.updatedAt, area: 'social', title: `Edited ${kind}: ${d.topic}`, detail: d.status, href: `/admin/social?draft=${d.id}` })
    for (const p of d.published) ev.push({ at: p.at, area: 'social', title: `Posted to LinkedIn: ${d.topic}`, detail: p.as === 'organization' ? 'company page' : 'your profile', href: `/admin/social?draft=${d.id}` })
  }
  for (const d of blog) {
    ev.push({ at: d.createdAt, area: 'blog', title: `Drafted article: ${d.meta.title}`, detail: `${d.meta.category} · ${d.meta.readTime}`, href: `/admin/blog?draft=${d.id}` })
    if (d.updatedAt > d.createdAt) ev.push({ at: d.updatedAt, area: 'blog', title: `${d.status === 'submitted' ? 'Submitted' : 'Edited'} article: ${d.meta.title}`, detail: d.pr ? `PR #${d.pr.number}` : d.status, href: `/admin/blog?draft=${d.id}` })
  }
  for (const a of activity.slice(-600)) {
    ev.push({ at: a.at, area: 'linkedin', title: `${a.kind === 'action' ? 'Action' : 'Lookup'}: ${a.label}${a.summary ? ` — ${a.summary}` : ''}`, detail: a.ok ? (a.cached ? 'from cache' : `${(a.ms / 1000).toFixed(1)}s`) : `failed${a.error ? `: ${a.error}` : ''}`, href: '/admin/linkedin-hub' })
  }
  ev.sort((a, b) => b.at.localeCompare(a.at))
  return NextResponse.json({ events: ev.slice(0, 800) })
}
