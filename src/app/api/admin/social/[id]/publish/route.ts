import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { getLinkedInState, publishPost } from '@/lib/linkedin'
import { getDraft, getImage, mutateDraft } from '@/lib/social/studio'

export const dynamic = 'force-dynamic'
export const maxDuration = 120

/** Pushes an approved draft (text + image) to LinkedIn as the member and/or the company page. */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const { id } = await params
  const b = await req.json().catch(() => ({}))
  const targets: ('member' | 'organization')[] = (Array.isArray(b.as) ? b.as : []).filter((x: string) => x === 'member' || x === 'organization')
  if (!targets.length) return NextResponse.json({ error: 'Choose where to post.' }, { status: 400 })

  const d = await getDraft(id)
  if (!d) return NextResponse.json({ error: 'Not found.' }, { status: 404 })
  if (d.status === 'draft') return NextResponse.json({ error: 'Approve the draft before publishing.' }, { status: 409 })
  if (!d.text.trim()) return NextResponse.json({ error: 'The post is empty.' }, { status: 400 })

  const s = await getLinkedInState()
  if (!s.accessToken || !s.expiresAt || new Date(s.expiresAt) < new Date()) {
    return NextResponse.json({ error: 'LinkedIn is not connected or the token expired. Reconnect on the LinkedIn page.' }, { status: 409 })
  }
  const image = d.hasImage ? (await getImage(id)) || undefined : undefined

  const done: { as: 'member' | 'organization'; urn: string; at: string }[] = []
  const errors: string[] = []
  for (const t of targets) {
    const author = t === 'member' ? s.memberUrn : s.orgUrn
    if (!author) { errors.push(`${t}: not available with this connection`); continue }
    if (d.published.some(p => p.as === t)) { errors.push(`${t}: already posted`); continue }
    try {
      const urn = await publishPost({ token: s.accessToken, author, commentary: d.text, image, altText: d.topic })
      done.push({ as: t, urn, at: new Date().toISOString() })
    } catch (e: any) {
      errors.push(`${t}: ${e?.message || 'failed'}`)
    }
  }
  if (done.length) await mutateDraft(id, x => { x.published.push(...done); x.status = 'published' })
  return NextResponse.json({ done: done.map(x => x.as), errors }, { status: done.length ? 200 : 502 })
}
