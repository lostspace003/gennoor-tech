import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { addPost, deletePost, getPostRaw, listAllPostsForAdmin, listAllReviewsForAdmin, setPostHidden, setReviewHidden } from '@/lib/lms-community'

export const dynamic = 'force-dynamic'

/** Everything learners have written: discussion posts and reviews. */
export async function GET(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const [posts, reviews] = await Promise.all([listAllPostsForAdmin(), listAllReviewsForAdmin()])
  return NextResponse.json({ posts, reviews })
}

/** Moderate or answer: hide / show / delete a post, hide / show a review, or reply as the team. */
export async function POST(req: NextRequest) {
  const { authorized, email } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const b = await req.json().catch(() => ({}))
  const action = String(b.action || '')
  const scope = String(b.scope || '')
  const id = String(b.id || '')

  switch (action) {
    case 'hide': case 'show':
      await setPostHidden(scope, id, action === 'hide'); break
    case 'delete':
      await deletePost(scope, id); break
    case 'hideReview': case 'showReview':
      await setReviewHidden(scope, id, action === 'hideReview'); break
    case 'reply': {
      const body = String(b.body || '').trim()
      const parent = await getPostRaw(scope, id)
      if (!body || !parent || parent.parentId) return NextResponse.json({ error: 'Nothing to reply to.' }, { status: 400 })
      await addPost({ scope, parentId: id, body, email: email || 'team', name: 'Gennoor team', isTeam: true })
      break
    }
    default:
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  }
  return NextResponse.json({ ok: true })
}
