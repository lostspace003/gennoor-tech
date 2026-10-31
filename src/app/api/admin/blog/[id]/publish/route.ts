import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { missingFields, submitBlogPost } from '@/lib/blog-publish'
import { getBlogDraft, mutateBlogDraft } from '@/lib/blog-studio'
import { parseScheduleAt } from '@/lib/scheduled-publish'
import { blogPostsMeta } from '@/data/blog-posts'
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
  if (b.cancelSchedule === true) {
    const draft = await mutateBlogDraft(id, x => { x.scheduled = undefined })
    return draft ? NextResponse.json({ draft }) : NextResponse.json({ error: 'Not found.' }, { status: 404 })
  }
  if (!githubConfigured()) return NextResponse.json({ error: 'GitHub is not connected yet. Use Export to download the file, or set GITHUB_TOKEN to publish from here.', needsGithub: true }, { status: 412 })
  if (b.scheduleAt) {
    try {
      const at = parseScheduleAt(b.scheduleAt)
      const d = await getBlogDraft(id)
      if (!d) return NextResponse.json({ error: 'Not found.' }, { status: 404 })
      if (d.status !== 'approved') return NextResponse.json({ error: 'Approve the post before scheduling it.' }, { status: 409 })
      const problems = missingFields(d)
      if (problems.length) return NextResponse.json({ error: `Still missing: ${problems.join(', ')}.` }, { status: 409 })
      if (blogPostsMeta.some(p => p.slug === d.meta.slug)) return NextResponse.json({ error: 'A published post already uses this slug. Change it.' }, { status: 409 })
      const draft = await mutateBlogDraft(id, x => { x.scheduled = { at: at.toISOString(), autoMerge: b.autoMerge !== false, shareToLinkedIn: b.shareToLinkedIn !== false, tries: 0 } })
      return NextResponse.json({ draft })
    } catch (e: any) { return NextResponse.json({ error: e.message || 'Could not schedule.' }, { status: 400 }) }
  }
  try {
    const draft = await submitBlogPost(id, { autoMerge: b.autoMerge !== false, shareToLinkedIn: b.shareToLinkedIn !== false })
    return NextResponse.json({ draft, pr: draft.pr })
  } catch (e: any) {
    const msg = String(e?.message || 'Could not publish.')
    return NextResponse.json({ error: msg }, { status: /Not found/.test(msg) ? 404 : /Approve|missing|already|slug/i.test(msg) ? 409 : 502 })
  }
}
