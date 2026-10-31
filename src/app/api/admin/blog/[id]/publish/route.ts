import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { contentFile, getBlogDraft, mutateBlogDraft, patchIndex } from '@/lib/blog-studio'
import { githubConfigured, openPullRequest, readFile } from '@/lib/github-pr'
import { blogPostsMeta } from '@/data/blog-posts'

export const dynamic = 'force-dynamic'
export const maxDuration = 120

/** Publishes an approved post by opening a pull request: the content file plus the index entry. Merging it deploys the post. */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const { id } = await params
  const d = await getBlogDraft(id)
  if (!d) return NextResponse.json({ error: 'Not found.' }, { status: 404 })
  if (d.status === 'submitted') return NextResponse.json({ error: 'This post has already been submitted.', pr: d.pr }, { status: 409 })
  if (d.status !== 'approved') return NextResponse.json({ error: 'Approve the post before publishing.' }, { status: 409 })
  const m = d.meta
  const problems = [
    !m.title.trim() && 'a title', !m.excerpt.trim() && 'an excerpt', !m.tldr.trim() && 'a TL;DR', !d.body.trim() && 'the article body',
    !m.category.trim() && 'a category', !m.tags.length && 'at least one tag', !m.faqs.length && 'at least one FAQ',
  ].filter(Boolean)
  if (problems.length) return NextResponse.json({ error: `Still missing: ${problems.join(', ')}.` }, { status: 400 })
  if (blogPostsMeta.some(p => p.slug === m.slug)) return NextResponse.json({ error: 'A published post already uses this slug. Change it.' }, { status: 409 })
  if (!githubConfigured()) return NextResponse.json({ error: 'GitHub is not connected yet. Use Export to download the files, or set GITHUB_TOKEN to publish from here.', needsGithub: true }, { status: 412 })

  try {
    const index = patchIndex(await readFile('src/data/blog-posts/index.ts'), d)
    const pr = await openPullRequest({
      branch: `blog/${m.slug}`.slice(0, 80), title: `Add blog post: ${m.title}`.slice(0, 120),
      body: `New post drafted in the Blog studio and approved by an admin.\n\n- Category: ${m.category}\n- Tags: ${m.tags.join(', ')}\n- Read time: ${m.readTime}\n- Slug: /resources/blog/${m.slug}\n\nMerging this deploys the post.\n\n🤖 Generated with [Claude Code](https://claude.com/claude-code)`,
      files: [
        { path: `src/data/blog-posts/content/${m.slug}.ts`, content: contentFile(d) },
        { path: 'src/data/blog-posts/index.ts', content: index },
      ],
    })
    const updated = await mutateBlogDraft(id, x => { x.status = 'submitted'; x.pr = pr })
    return NextResponse.json({ draft: updated, pr })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Could not open the pull request.' }, { status: 502 })
  }
}
