import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { contentFile, getBlogDraft } from '@/lib/blog-studio'

export const dynamic = 'force-dynamic'

/** Downloads the post as the exact content file the codebase uses (src/data/blog-posts/content/<slug>.ts). */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const d = await getBlogDraft((await params).id)
  if (!d) return NextResponse.json({ error: 'Not found.' }, { status: 404 })
  return new NextResponse(contentFile(d), { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Content-Disposition': `attachment; filename="${d.meta.slug}.ts"` } })
}
