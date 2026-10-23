import { NextRequest, NextResponse } from 'next/server'
import { verifyLearnerSession } from '@/lib/learner-auth'
import { getLmsCourse, isEnrolled } from '@/lib/lms'
import { COMMUNITY_SCOPE, addPost, deletePost, getPostRaw, getThread, listThreads, toggleLike } from '@/lib/lms-community'
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
  const course = await getLmsCourse(scope)
  if (!course) return { error: NextResponse.json({ error: 'Unknown course' }, { status: 404 }) }
  if (!(await isEnrolled(learner.email, scope))) return { error: NextResponse.json({ error: 'Enroll in this course to join its discussion.' }, { status: 403 }) }
  return { learner }
}

export async function GET(req: NextRequest) {
  const scope = req.nextUrl.searchParams.get('scope')
  const g = await gate(scope, false)
  if (g.error) return g.error
  const thread = req.nextUrl.searchParams.get('thread')
  if (thread) {
    const t = await getThread(scope!, thread, g.learner?.email)
    return t ? NextResponse.json(t, { headers: noStore }) : NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json({ threads: await listThreads(scope!, g.learner?.email), signedIn: !!g.learner }, { headers: noStore })
}

export async function POST(req: NextRequest) {
  const b = await req.json().catch(() => ({}))
  const scope = typeof b.scope === 'string' ? b.scope : null
  const g = await gate(scope, true)
  if (g.error) return g.error
  const learner = g.learner!
  if (!rateLimit(`lms-post:${learner.email}`, 20, 30 * 60_000)) return NextResponse.json({ error: 'You are posting quickly. Please wait a few minutes.' }, { status: 429 })

  const body = String(b.body ?? '').trim()
  const title = String(b.title ?? '').trim()
  const parentId = String(b.parentId ?? '')
  if (!body) return NextResponse.json({ error: 'Write something first.' }, { status: 400 })
  if (!parentId && !title) return NextResponse.json({ error: 'Give your topic a title.' }, { status: 400 })
  if (parentId) {
    const parent = await getPostRaw(scope!, parentId)
    if (!parent || parent.parentId || parent.hidden) return NextResponse.json({ error: 'That topic is not available.' }, { status: 404 })
  }
  const post = await addPost({ scope: scope!, parentId, title, body, email: learner.email, name: learner.name })
  return NextResponse.json({ post: { ...post, mine: true } }, { headers: noStore })
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

/** A learner can remove their own posts (a topic takes its replies with it). */
export async function DELETE(req: NextRequest) {
  const scope = req.nextUrl.searchParams.get('scope')
  const g = await gate(scope, true)
  if (g.error) return g.error
  const id = req.nextUrl.searchParams.get('id') || ''
  const post = await getPostRaw(scope!, id)
  if (!post || post.email !== g.learner!.email.toLowerCase()) return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
  await deletePost(scope!, id)
  return NextResponse.json({ ok: true })
}
