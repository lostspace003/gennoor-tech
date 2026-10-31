import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { getDraft, mutateDraft, polishPost } from '@/lib/social/studio'

export const dynamic = 'force-dynamic'
export const maxDuration = 90

/** "Format for LinkedIn": tidies the post (bold hook, short paragraphs, quiet bullets, sober symbols, hashtag line). */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const { id } = await params
  const d = await getDraft(id)
  if (!d) return NextResponse.json({ error: 'Not found.' }, { status: 404 })
  if (!d.text.trim()) return NextResponse.json({ error: 'Write the post first.' }, { status: 400 })
  const text = await polishPost(d.text, id)
  const draft = await mutateDraft(id, x => { x.text = text.slice(0, 3000) })
  return NextResponse.json({ draft })
}
