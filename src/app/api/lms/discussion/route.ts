import { NextRequest, NextResponse } from 'next/server'
import { verifyLearnerSession } from '@/lib/learner-auth'
import { getLmsCourse, isEnrolled } from '@/lib/lms'
import { COMMUNITY_SCOPE, addPost, deletePost, getPostRaw, getThread, listThreads } from '@/lib/lms-community'
import { rateLimit } from '@/lib/rate-limit'
import { noStore } from '@/lib/lms-guard'

export const dynamic = 'force-dynamic'

/** Signed-in learners only. A course discussion also needs enrollment in that course. */
async function gate(scope: string | null) {
  const learner = await verifyLearnerSession()
  if (!learner) return { error: NextResponse.json({ error: 'Sign in to join the discussion.' }, { status: 401 }) }
  if (!scope) return { error: NextResponse.json({ error: 'Missing space' }, { status: 400 }) }
  if (scope !== COMMUNITY_SCOPE) {
    const course = await getLmsCourse(scope)
    if (!course) return { error: NextResponse.json({ error: 'Unknown course' }, { status: 404 }) }
    if (!(await isEnrolled(learner.email, scope))) return { error: NextResponse.json({ error: 'Enroll in this course to join its discussion.' }, { status: 403 }) }
  }
  return { learner }
}

export async function GET(req: NextRequest) {
  const scope = req.nextUrl.searchParams.get('scope')
  const g = await gate(scope)
  if (g.error) return g.error
  const thread = req.nextUrl.searchParams.get('thread')
  if (thread) {
    const t = await getThread(scope!, thread, g.learner!.email)
    return t ? NextResponse.json(t, { headers: noStore }) : NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json({ threads: await listThreads(scope!, g.learner!.email) }, { headers: noStore })
}

export async function POST(req: NextRequest) {
  const b = await req.json().catch(() => ({}))
  const scope = typeof b.scope === 'string' ? b.scope : null
  const g = await gate(scope)
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

/** A learner can remove their own posts (a topic takes its replies with it). */
export async function DELETE(req: NextRequest) {
  const scope = req.nextUrl.searchParams.get('scope')
  const g = await gate(scope)
  if (g.error) return g.error
  const id = req.nextUrl.searchParams.get('id') || ''
  const post = await getPostRaw(scope!, id)
  if (!post || post.email !== g.learner!.email.toLowerCase()) return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
  await deletePost(scope!, id)
  return NextResponse.json({ ok: true })
}
