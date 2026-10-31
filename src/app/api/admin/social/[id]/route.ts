import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { deleteDraft, mutateDraft } from '@/lib/social/studio'
import { formatForLinkedIn } from '@/lib/linkedin-format'

export const dynamic = 'force-dynamic'

/** Human edits: text, image prompt, references and approval status. Published drafts stay editable so they can be re-published. */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const { id } = await params
  const b = await req.json().catch(() => ({}))
  const d = await mutateDraft(id, x => {
    if (typeof b.removeRef === 'string') x.references = (x.references || []).filter(r => r.id !== b.removeRef)
    if (typeof b.text === 'string') x.text = formatForLinkedIn(b.text.slice(0, 3200)) // **bold** becomes Unicode bold, bullets and hashtags are tidied
    if (typeof b.imagePrompt === 'string') x.imagePrompt = b.imagePrompt.slice(0, 4000)
    if (b.poll && x.kind === 'poll') {
      const opts = (Array.isArray(b.poll.options) ? b.poll.options : []).map((o: unknown) => String(o).trim().slice(0, 30)).filter(Boolean).slice(0, 4)
      const dur = ['ONE_DAY', 'THREE_DAYS', 'SEVEN_DAYS', 'FOURTEEN_DAYS'].includes(b.poll.duration) ? b.poll.duration : 'SEVEN_DAYS'
      x.poll = { question: String(b.poll.question || '').trim().slice(0, 140), options: opts, duration: dur }
    }
    if ((b.status === 'draft' || b.status === 'approved') && x.status !== 'published') x.status = b.status
  })
  if (!d) return NextResponse.json({ error: 'Not found.' }, { status: 404 })
  return NextResponse.json({ draft: d })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  await deleteDraft((await params).id)
  return NextResponse.json({ ok: true })
}
