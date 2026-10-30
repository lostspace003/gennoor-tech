import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { deleteDraft, mutateDraft } from '@/lib/social/studio'

export const dynamic = 'force-dynamic'

/** Human edits: text, image prompt, and approval status. Published drafts are locked. */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const { id } = await params
  const b = await req.json().catch(() => ({}))
  let locked = false
  const d = await mutateDraft(id, x => {
    if (x.status === 'published') { locked = true; return }
    if (typeof b.text === 'string') x.text = b.text.slice(0, 3000)
    if (typeof b.imagePrompt === 'string') x.imagePrompt = b.imagePrompt.slice(0, 4000)
    if (b.status === 'draft' || b.status === 'approved') x.status = b.status
  })
  if (!d) return NextResponse.json({ error: 'Not found.' }, { status: 404 })
  if (locked) return NextResponse.json({ error: 'Already published.' }, { status: 409 })
  return NextResponse.json({ draft: d })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  await deleteDraft((await params).id)
  return NextResponse.json({ ok: true })
}
