import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { liveBlogPipelineDeps, mergeBlogPost, retryBlogPipeline } from '@/lib/blog-publish'
import { pipelineTick } from '@/lib/blog-pipeline'
import { getBlogDraft } from '@/lib/blog-studio'

export const dynamic = 'force-dynamic'
export const maxDuration = 120

/** The Merge button, and "check / retry" for a post that needs attention. */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const { id } = await params
  const b = await req.json().catch(() => ({}))
  try {
    if (b.action === 'merge') await mergeBlogPost(id)
    else if (b.action === 'retry') await retryBlogPipeline(id)
    else return NextResponse.json({ error: 'Unknown action.' }, { status: 400 })
    // Carry the flow forward straight away instead of waiting for the next scheduled check.
    await pipelineTick(liveBlogPipelineDeps())
    return NextResponse.json({ draft: await getBlogDraft(id) })
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message || 'Failed.') }, { status: 502 })
  }
}
