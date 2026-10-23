import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import {
  COMMUNITY_SCOPE, adminResults, addPost, deletePost, getPostRaw, listAllPostsForAdmin, listAllReviewsForAdmin,
  setPostClosed, setPostHidden, setReviewHidden, type PostKind,
} from '@/lib/lms-community'
import { listLmsCourses } from '@/lib/lms'
import { htmlToText, sanitizeHtml } from '@/lib/rich-text'

export const dynamic = 'force-dynamic'

/** Everything learners have written (discussion, polls, quizzes) and the reviews, with poll and quiz results. */
export async function GET(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const [posts, reviews, courses] = await Promise.all([listAllPostsForAdmin(), listAllReviewsForAdmin(), listLmsCourses().catch(() => [])])
  return NextResponse.json({
    posts: posts.map(p => ({ ...p, likers: undefined, votes: undefined, results: adminResults(p) })),
    reviews,
    spaces: [{ scope: COMMUNITY_SCOPE, name: 'Community' }, ...courses.map(c => ({ scope: c.slug, name: c.code }))],
  })
}

/** Moderate or publish: hide / show / delete a post, close or reopen a poll or quiz, hide / show a review, reply as the team, or create an announcement, poll, quiz or topic. */
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
    case 'close': case 'reopen':
      await setPostClosed(scope, id, action === 'close'); break
    case 'delete':
      await deletePost(scope, id); break
    case 'hideReview': case 'showReview':
      await setReviewHidden(scope, id, action === 'hideReview'); break
    case 'reply': {
      const html = b.html ? sanitizeHtml(String(b.html)) : ''
      const body = (html ? htmlToText(html) : String(b.body || '')).trim()
      const parent = await getPostRaw(scope, id)
      if (!body || !parent || parent.parentId) return NextResponse.json({ error: 'Nothing to reply to.' }, { status: 400 })
      await addPost({ scope, parentId: id, body, html, email: email || 'team', name: 'Gennoor team', isTeam: true })
      break
    }
    case 'create': {
      const kind: PostKind = ['announcement', 'poll', 'quiz', 'topic'].includes(String(b.kind)) ? (String(b.kind) as PostKind) : 'announcement'
      const title = String(b.title || '').trim()
      const html = b.html ? sanitizeHtml(String(b.html)) : ''
      const body = htmlToText(html)
      const options: string[] = Array.isArray(b.options) ? b.options.map(String).map((o: string) => o.trim()).filter(Boolean) : []
      if (!scope) return NextResponse.json({ error: 'Choose where to post it.' }, { status: 400 })
      if (!title) return NextResponse.json({ error: 'Add a title.' }, { status: 400 })
      if ((kind === 'announcement' || kind === 'topic') && !body) return NextResponse.json({ error: 'Write the message.' }, { status: 400 })
      if ((kind === 'poll' || kind === 'quiz') && options.length < 2) return NextResponse.json({ error: 'Add at least two choices.' }, { status: 400 })
      const answer = Number(b.answer)
      if (kind === 'quiz' && !(Number.isInteger(answer) && answer >= 0 && answer < options.length)) return NextResponse.json({ error: 'Mark the correct choice.' }, { status: 400 })
      await addPost({ scope, title, body, html, email: email || 'team', name: 'Gennoor team', isTeam: true, kind, options, answer, explanation: String(b.explanation || '') })
      break
    }
    default:
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  }
  return NextResponse.json({ ok: true })
}
