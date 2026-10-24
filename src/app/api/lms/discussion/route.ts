import { NextRequest, NextResponse } from 'next/server'
import { verifyLearnerSession, isStudioAdmin } from '@/lib/learner-auth'
import { getLmsCourse, isEnrolled } from '@/lib/lms'
import { COMMUNITY_SCOPE, addPost, adminResults, castVote, deletePost, getPostRaw, getThread, listThreads, setPostClosed, setPostHidden, toggleLike, type PostKind } from '@/lib/lms-community'
import { htmlToText, sanitizeHtml } from '@/lib/rich-text'
import { rateLimit } from '@/lib/rate-limit'
import { noStore } from '@/lib/lms-guard'

export const dynamic = 'force-dynamic'

/**
 * The community can be read by anyone. Writing (posting, replying, liking, deleting) needs a
 * Learning Studio sign-in. A course discussion needs sign-in and enrollment in that course.
 */
async function gate(scope: string | null, write: boolean) {
  if (!scope) return { error: NextResponse.json({ error: 'Missing space' }, { status: 400 }) }
  const learner = await verifyLearnerSession()
  if (scope === COMMUNITY_SCOPE) {
    if (write && !learner) return { error: NextResponse.json({ error: 'Sign in to join the discussion.' }, { status: 401 }) }
    return { learner }
  }
  if (!learner) return { error: NextResponse.json({ error: 'Sign in to join the discussion.' }, { status: 401 }) }
  if (isStudioAdmin(learner)) return { learner }
  const course = await getLmsCourse(scope)
  if (!course) return { error: NextResponse.json({ error: 'Unknown course' }, { status: 404 }) }
  if (!(await isEnrolled(learner.email, scope))) return { error: NextResponse.json({ error: 'Enroll in this course to join its discussion.' }, { status: 403 }) }
  return { learner }
}

export async function GET(req: NextRequest) {
  const scope = req.nextUrl.searchParams.get('scope')
  const g = await gate(scope, false)
  if (g.error) return g.error
  const admin = isStudioAdmin(g.learner)
  const thread = req.nextUrl.searchParams.get('thread')
  if (thread) {
    const t = await getThread(scope!, thread, g.learner?.email)
    if (!t) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (admin) {
      // Only the admin session gets the answer key and who chose what.
      const raw = await getPostRaw(scope!, thread)
      return NextResponse.json({ ...t, isAdmin: true, adminResults: raw ? adminResults(raw) : undefined }, { headers: noStore })
    }
    return NextResponse.json(t, { headers: noStore })
  }
  return NextResponse.json({ threads: await listThreads(scope!, g.learner?.email), signedIn: !!g.learner, ...(admin ? { isAdmin: true } : {}) }, { headers: noStore })
}

export async function POST(req: NextRequest) {
  const b = await req.json().catch(() => ({}))
  const scope = typeof b.scope === 'string' ? b.scope : null
  const g = await gate(scope, true)
  if (g.error) return g.error
  const learner = g.learner!
  const admin = isStudioAdmin(learner)
  if (!admin && !rateLimit(`lms-post:${learner.email}`, 20, 30 * 60_000)) return NextResponse.json({ error: 'You are posting quickly. Please wait a few minutes.' }, { status: 429 })

  // Rich text arrives as HTML and is cleaned here; plain text (older clients) still works.
  const html = b.html ? sanitizeHtml(String(b.html)) : ''
  const body = (html ? htmlToText(html) : String(b.body ?? '')).trim().slice(0, 4000)
  const title = String(b.title ?? '').trim()
  const parentId = String(b.parentId ?? '')
  // Learners can write topics and polls; announcements and quizzes are the team's.
  // The studio admin can also publish announcements and quizzes, as the team.
  if (!admin && (b.kind === 'announcement' || b.kind === 'quiz')) return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
  const kind: PostKind = parentId ? 'topic' : admin && ['announcement', 'quiz', 'poll', 'topic'].includes(String(b.kind)) ? (String(b.kind) as PostKind) : b.kind === 'poll' ? 'poll' : 'topic'
  const options = kind === 'poll' && Array.isArray(b.options) ? b.options.map(String).map((o: string) => o.trim()).filter(Boolean) : []
  if (!body && !((kind === 'poll' || kind === 'quiz') && options.length >= 2)) return NextResponse.json({ error: 'Write something first.' }, { status: 400 })
  if (!parentId && !title) return NextResponse.json({ error: 'Give your topic a title.' }, { status: 400 })
  if ((kind === 'poll' || kind === 'quiz') && options.length < 2) return NextResponse.json({ error: 'Add at least two choices.' }, { status: 400 })
  const answer = Number(b.answer)
  if (kind === 'quiz' && !(Number.isInteger(answer) && answer >= 0 && answer < options.length)) return NextResponse.json({ error: 'Mark the correct choice.' }, { status: 400 })
  if (parentId) {
    const parent = await getPostRaw(scope!, parentId)
    if (!parent || parent.parentId || parent.hidden) return NextResponse.json({ error: 'That topic is not available.' }, { status: 404 })
  }
  const post = await addPost({
    scope: scope!, parentId, title, body, html, email: learner.email, name: admin ? 'Gennoor team' : learner.name, kind, options,
    ...(admin ? { isTeam: true, answer, explanation: String(b.explanation || '') } : {}),
  })
  return NextResponse.json({ post: { ...post, mine: true } }, { headers: noStore })
}

/** Answer a poll or a quiz. */
export async function PATCH(req: NextRequest) {
  const b = await req.json().catch(() => ({}))
  const scope = typeof b.scope === 'string' ? b.scope : null
  const g = await gate(scope, true)
  if (g.error) return g.error
  if (typeof b.action === 'string') {
    if (!isStudioAdmin(g.learner)) return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
    const id = String(b.id ?? '')
    if (!(await getPostRaw(scope!, id))) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (b.action === 'close' || b.action === 'reopen') await setPostClosed(scope!, id, b.action === 'close')
    else if (b.action === 'hide' || b.action === 'show') await setPostHidden(scope!, id, b.action === 'hide')
    else return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    return NextResponse.json({ ok: true }, { headers: noStore })
  }
  if (!rateLimit(`lms-vote:${g.learner!.email}`, 60, 10 * 60_000)) return NextResponse.json({ error: 'Slow down a little.' }, { status: 429 })
  const r = await castVote(scope!, String(b.id ?? ''), g.learner!.email, Number(b.option))
  return r.error ? NextResponse.json({ error: r.error }, { status: 400 }) : NextResponse.json({ results: r.results }, { headers: noStore })
}

/** Like or unlike a topic or a reply. */
export async function PUT(req: NextRequest) {
  const b = await req.json().catch(() => ({}))
  const scope = typeof b.scope === 'string' ? b.scope : null
  const g = await gate(scope, true)
  if (g.error) return g.error
  if (!rateLimit(`lms-like:${g.learner!.email}`, 60, 10 * 60_000)) return NextResponse.json({ error: 'Slow down a little.' }, { status: 429 })
  const post = await getPostRaw(scope!, String(b.id ?? ''))
  if (!post || post.hidden) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const r = await toggleLike(scope!, post.id, g.learner!.email)
  return r ? NextResponse.json(r, { headers: noStore }) : NextResponse.json({ error: 'Not found' }, { status: 404 })
}

/** A learner can remove their own posts (a topic takes its replies with it). The studio admin can remove any. */
export async function DELETE(req: NextRequest) {
  const scope = req.nextUrl.searchParams.get('scope')
  const g = await gate(scope, true)
  if (g.error) return g.error
  const id = req.nextUrl.searchParams.get('id') || ''
  const post = await getPostRaw(scope!, id)
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (post.email !== g.learner!.email.toLowerCase() && !isStudioAdmin(g.learner)) return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
  await deletePost(scope!, id)
  return NextResponse.json({ ok: true })
}
