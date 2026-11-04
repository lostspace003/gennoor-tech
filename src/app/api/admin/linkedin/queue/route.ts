import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { cancelJob, deleteJobPost, listJobs, deleteByUrn } from '@/lib/linkedin-queue'

export const dynamic = 'force-dynamic'

/** Scheduled and posted carousels / event items. */
export async function GET(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  return NextResponse.json({ jobs: (await listJobs()).slice(0, 60) })
}

/** { action: 'cancel' | 'delete', id } - cancel removes a scheduled item; delete removes the post from LinkedIn. */
export async function POST(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const b = await req.json().catch(() => ({}))
  try {
    if (b.action === 'cancel') return NextResponse.json({ ok: await cancelJob(String(b.id)) })
    if (b.action === 'delete') { await deleteJobPost(String(b.id)); return NextResponse.json({ ok: true }) }
    if (b.action === 'deleteUrn') { await deleteByUrn(String(b.urn || ''), b.as === 'member' ? 'member' : 'organization'); return NextResponse.json({ ok: true }) }
    return NextResponse.json({ error: 'Unknown action.' }, { status: 400 })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed.' }, { status: 502 })
  }
}
