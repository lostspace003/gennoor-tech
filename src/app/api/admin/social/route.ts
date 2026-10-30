import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { createDraft, listDrafts } from '@/lib/social/studio'

export const dynamic = 'force-dynamic'
export const maxDuration = 120

export async function GET(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  return NextResponse.json({ drafts: await listDrafts() })
}

/** Writing agent: topic (+ optional notes) in, new draft out. */
export async function POST(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const b = await req.json().catch(() => ({}))
  const topic = String(b.topic || '').trim()
  if (!topic) return NextResponse.json({ error: 'Give the agent a topic.' }, { status: 400 })
  try {
    return NextResponse.json({ draft: await createDraft(topic, String(b.brief || '').trim(), b.kind === 'poll' ? 'poll' : 'post') })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Draft failed' }, { status: 502 })
  }
}
