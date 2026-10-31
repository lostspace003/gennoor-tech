import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { reviseBlogDraft } from '@/lib/blog-studio'

export const dynamic = 'force-dynamic'
export const maxDuration = 180

/** AI revision of the whole article, only the body, or only the metadata, per the editor's instruction. */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const b = await req.json().catch(() => ({}))
  const instruction = String(b.instruction || '').trim()
  if (!instruction) return NextResponse.json({ error: 'Say what to change.' }, { status: 400 })
  try {
    const draft = await reviseBlogDraft((await params).id, instruction, b.part === 'body' || b.part === 'meta' ? b.part : 'all')
    return draft ? NextResponse.json({ draft }) : NextResponse.json({ error: 'Not found.' }, { status: 404 })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Revision failed' }, { status: 502 })
  }
}
