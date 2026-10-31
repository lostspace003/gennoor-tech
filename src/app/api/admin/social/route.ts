import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { createDraft, listDrafts, listSpend } from '@/lib/social/studio'
import { getRefs } from '@/lib/social/references'

export const dynamic = 'force-dynamic'
export const maxDuration = 120

export async function GET(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const [drafts, spend] = await Promise.all([listDrafts(), listSpend()])
  const byDraft: Record<string, number> = {}
  for (const s of spend) byDraft[s.draftId] = (byDraft[s.draftId] || 0) + s.usd
  const monthKey = new Date().toISOString().slice(0, 7)
  return NextResponse.json({
    drafts,
    spend: {
      total: spend.reduce((a, s) => a + s.usd, 0),
      month: spend.filter(s => s.at.startsWith(monthKey)).reduce((a, s) => a + s.usd, 0),
      byDraft,
      entries: spend.slice(-200),
    },
  })
}

/** Writing agent: topic (+ optional notes) in, new draft out. */
export async function POST(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const b = await req.json().catch(() => ({}))
  const topic = String(b.topic || '').trim()
  if (!topic) return NextResponse.json({ error: 'Give the agent a topic.' }, { status: 400 })
  try {
    const refs = await getRefs(Array.isArray(b.refIds) ? b.refIds.map(String) : [])
    return NextResponse.json({ draft: await createDraft(topic, String(b.brief || '').trim(), b.kind === 'poll' ? 'poll' : 'post', refs) })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Draft failed' }, { status: 502 })
  }
}
