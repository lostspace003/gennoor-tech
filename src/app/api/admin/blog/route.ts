import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { listBlogDrafts, taxonomy } from '@/lib/blog-studio'
import { listSpend } from '@/lib/social/studio'
import { githubConfigured } from '@/lib/github-pr'

export const dynamic = 'force-dynamic'

/** Blog drafts, the site's existing categories and tags (for the pickers), and per-draft AI cost. */
export async function GET(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const [drafts, spend] = await Promise.all([listBlogDrafts(), listSpend()])
  const byDraft: Record<string, number> = {}
  for (const s of spend) if (s.draftId.startsWith('blog-')) byDraft[s.draftId.slice(5)] = (byDraft[s.draftId.slice(5)] || 0) + s.usd
  return NextResponse.json({ drafts, taxonomy: taxonomy(), spend: byDraft, githubReady: githubConfigured() })
}
