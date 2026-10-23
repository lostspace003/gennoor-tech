import { NextRequest, NextResponse } from 'next/server'
import { requireEnrolled, noStore } from '@/lib/lms-guard'
import { verifyLearnerSession } from '@/lib/learner-auth'
import { getReviews, saveReview } from '@/lib/lms-community'
import { rateLimit } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

/** Public: the rating summary and written reviews. Signed-in learners also get their own review back. */
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug')
  if (!slug) return NextResponse.json({ error: 'Missing course' }, { status: 400 })
  const learner = await verifyLearnerSession()
  return NextResponse.json(await getReviews(slug, learner?.email), { headers: noStore })
}

/** One review per learner per course; posting again edits it. Enrolled learners only. */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const g = await requireEnrolled(typeof body.slug === 'string' ? body.slug : null)
  if (g instanceof NextResponse) return g
  const rating = Number(body.rating)
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) return NextResponse.json({ error: 'Choose a rating from 1 to 5 stars.' }, { status: 400 })
  if (!rateLimit(`lms-review:${g.learner.email}`, 10, 60 * 60_000)) return NextResponse.json({ error: 'Please try again later.' }, { status: 429 })
  await saveReview(g.course.slug, g.learner.email, g.learner.name, rating, String(body.text ?? '').trim())
  return NextResponse.json(await getReviews(g.course.slug, g.learner.email), { headers: noStore })
}
