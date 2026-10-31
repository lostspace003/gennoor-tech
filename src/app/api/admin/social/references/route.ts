import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { addFileRef, addUrlRef } from '@/lib/social/references'
import { getDraft, mutateDraft } from '@/lib/social/studio'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

/** Adds reference material (a link, a document or an image). With a draftId it is attached to that draft. */
export async function POST(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  try {
    let ref
    let draftId = ''
    if ((req.headers.get('content-type') || '').includes('multipart/form-data')) {
      const form = await req.formData()
      const file = form.get('file')
      draftId = String(form.get('draftId') || '')
      if (!(file instanceof File)) return NextResponse.json({ error: 'Choose a file.' }, { status: 400 })
      ref = await addFileRef(file.name, file.type || '', Buffer.from(await file.arrayBuffer()))
    } else {
      const b = await req.json().catch(() => ({}))
      draftId = String(b.draftId || '')
      if (!b.url) return NextResponse.json({ error: 'Paste a link.' }, { status: 400 })
      ref = await addUrlRef(String(b.url))
    }
    if (draftId) {
      if (!(await getDraft(draftId))) return NextResponse.json({ error: 'Draft not found.' }, { status: 404 })
      const draft = await mutateDraft(draftId, d => { d.references = [...(d.references || []), ref] })
      return NextResponse.json({ ref, draft })
    }
    return NextResponse.json({ ref })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Could not add that reference.' }, { status: 400 })
  }
}
