import { NextRequest, NextResponse } from 'next/server'
import { verifyLearnerSession } from '@/lib/learner-auth'
import { saveCourseProgress, getCourseProgress } from '@/lib/azure-storage'

export async function GET(request: NextRequest) {
  const learner = await verifyLearnerSession()
  if (!learner) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const courseId = request.nextUrl.searchParams.get('courseId')
  if (!courseId) {
    return NextResponse.json({ error: 'courseId is required' }, { status: 400 })
  }

  const entries = await getCourseProgress(learner.email, courseId)
  const chapters: Record<string, any> = {}
  for (const entry of entries) {
    chapters[entry.chapterId] = entry
  }

  return NextResponse.json({ courseId, chapters })
}

export async function POST(request: NextRequest) {
  const learner = await verifyLearnerSession()
  if (!learner) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const body = await request.json()
  const { courseId, chapterId, currentSlide, totalSlides, completionPercent, completed } = body

  if (!courseId || !chapterId) {
    return NextResponse.json({ error: 'courseId and chapterId are required' }, { status: 400 })
  }

  await saveCourseProgress({
    email: learner.email,
    courseId,
    chapterId,
    currentSlide: currentSlide || 0,
    totalSlides: totalSlides || 0,
    completionPercent: completionPercent || 0,
    completed: completed || false,
  })

  return NextResponse.json({ success: true })
}
