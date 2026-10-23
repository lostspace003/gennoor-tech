import { NextRequest, NextResponse } from 'next/server'
import { verifyLearnerSession } from '@/lib/learner-auth'
import { enroll, getLmsCourse } from '@/lib/lms'

export async function POST(req: NextRequest) {
  const learner = await verifyLearnerSession()
  if (!learner) return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
  const { slug } = await req.json().catch(() => ({}))
  const course = await getLmsCourse(String(slug || ''))
  if (!course) return NextResponse.json({ error: 'Unknown course' }, { status: 404 })
  await enroll(learner.email, learner.name, course.slug)
  return NextResponse.json({ enrolled: true })
}
