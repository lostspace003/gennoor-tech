import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { reviseDraft } from '@/lib/social/studio'

export const dynamic = 'force-dynamic'
export const maxDuration = 120

/** Revision agent: rewrites the draft per the editor's instruction. */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const { id } = await params
  const b = await req.json().catch(() => ({}))
  const instruction = String(b.instruction || '').trim()
  if (!instruction) return NextResponse.json({ error: 'Say what to change.' }, { status: 400 })
  try {
    const draft = await reviseDraft(id, instruction, b.target === 'image' ? 'image' : 'post')
    if (!draft) return NextResponse.json({ error: 'Not found.' }, { status: 404 })
    return NextResponse.json({ draft })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Revision failed' }, { status: 502 })
  }
}
