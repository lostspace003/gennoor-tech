import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { blogPostsMeta } from '@/data/blog-posts'
import { getLinkedInState, linkedInConfigured, pageAppConfigured, publishArticle, saveLinkedInState } from '@/lib/linkedin'
import { siteUrl } from '@/lib/tech-call-mail'

export const dynamic = 'force-dynamic'

const WARN_DAYS = 10

/** Connection status (never the token) plus every blog post with where it has been shared. */
export async function GET(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const s = await getLinkedInState()
  const msLeft = s.expiresAt ? new Date(s.expiresAt).getTime() - Date.now() : 0
  const daysLeft = s.accessToken ? Math.floor(msLeft / 86_400_000) : 0
  return NextResponse.json({
    configured: linkedInConfigured(),
    connected: !!s.accessToken && msLeft > 0,
    expired: !!s.accessToken && msLeft <= 0,
    expiresAt: s.expiresAt || null,
    daysLeft,
    expiringSoon: !!s.accessToken && daysLeft <= WARN_DAYS,
    memberName: s.memberName || '',
    orgName: s.orgName || '',
    canPostAsOrg: !!s.orgUrn && !!s.orgAccessToken && !!s.orgExpiresAt && new Date(s.orgExpiresAt) > new Date(),
    pageAppConfigured: pageAppConfigured(),
    posts: blogPostsMeta.map(p => ({ slug: p.slug, title: p.title, date: p.date, shares: s.shares?.[p.slug] || [] })),
  })
}

/** Publish a blog post to LinkedIn as the member, the company page, or both. */
export async function POST(req: NextRequest) {
  const { authorized, email } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const b = await req.json().catch(() => ({}))
  const post = blogPostsMeta.find(p => p.slug === b.slug)
  if (!post) return NextResponse.json({ error: 'Blog post not found.' }, { status: 404 })
  const targets: ('member' | 'organization')[] = (Array.isArray(b.as) ? b.as : []).filter((x: string) => x === 'member' || x === 'organization')
  if (!targets.length) return NextResponse.json({ error: 'Choose where to post.' }, { status: 400 })

  const s = await getLinkedInState()
  if (!s.accessToken || !s.expiresAt || new Date(s.expiresAt) < new Date()) {
    return NextResponse.json({ error: 'LinkedIn is not connected or the token expired. Reconnect first.' }, { status: 409 })
  }

  const hashtags = (post.hashtags || []).slice(0, 4).map(h => (h.startsWith('#') ? h : `#${h}`)).join(' ')
  const note = typeof b.text === 'string' && b.text.trim() ? b.text.trim() : `${post.title}\n\n${post.excerpt.slice(0, 220).trim()}…`
  const commentary = [note, hashtags].filter(Boolean).join('\n\n').slice(0, 3000)
  const url = `${siteUrl()}/resources/blog/${post.slug}`

  const done: string[] = []
  const errors: string[] = []
  s.shares = s.shares || {}
  for (const t of targets) {
    const author = t === 'member' ? s.memberUrn : s.orgUrn
    if (!author) { errors.push(`${t}: not available with this connection`); continue }
    if (s.shares[post.slug]?.some(x => x.as === t) && !b.force) { errors.push(`${t}: already shared`); continue }
    try {
      const pageToken = s.orgAccessToken && s.orgExpiresAt && new Date(s.orgExpiresAt) > new Date() ? s.orgAccessToken : ''
      const urn = await publishArticle({
        token: t === 'member' ? s.accessToken : pageToken, author, commentary, url, title: post.title, description: post.excerpt.slice(0, 250),
      })
      s.shares[post.slug] = [...(s.shares[post.slug] || []), { urn, as: t, at: new Date().toISOString(), by: email || '' }]
      done.push(t)
    } catch (e: any) {
      errors.push(`${t}: ${e?.message || 'failed'}`)
    }
  }
  if (done.length) await saveLinkedInState(s)
  return NextResponse.json({ done, errors }, { status: done.length ? 200 : 502 })
}
