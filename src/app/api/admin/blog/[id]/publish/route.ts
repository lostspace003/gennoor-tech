import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { submitBlogPost } from '@/lib/blog-publish'
import { githubConfigured } from '@/lib/github-pr'

export const dynamic = 'force-dynamic'
export const maxDuration = 120

/**
 * Approve and publish: opens the pull request and, unless switched off, merges it straight away. The website going
 * live and the company-page and profile LinkedIn posts follow automatically (see the blog pipeline).
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const { id } = await params
  const b = await req.json().catch(() => ({}))
  if (!githubConfigured()) return NextResponse.json({ error: 'GitHub is not connected yet. Use Export to download the file, or set GITHUB_TOKEN to publish from here.', needsGithub: true }, { status: 412 })
  try {
    const draft = await submitBlogPost(id, { autoMerge: b.autoMerge !== false, shareToLinkedIn: b.shareToLinkedIn !== false })
    return NextResponse.json({ draft, pr: draft.pr })
  } catch (e: any) {
    const msg = String(e?.message || 'Could not publish.')
    return NextResponse.json({ error: msg }, { status: /Not found/.test(msg) ? 404 : /Approve|missing|already|slug/i.test(msg) ? 409 : 502 })
  }
}
