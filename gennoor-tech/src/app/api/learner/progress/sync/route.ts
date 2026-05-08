import { NextRequest, NextResponse } from 'next/server'
import { verifyLearnerSession } from '@/lib/learner-auth'
import { saveCourseProgress, getCourseProgress } from '@/lib/azure-storage'

export async function POST(request: NextRequest) {
  const learner = await verifyLearnerSession()
  if (!learner) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { progress } = await request.json()
  if (!progress || typeof progress !== 'object') {
    return NextResponse.json({ error: 'Invalid progress data' }, { status: 400 })
  }

  const merged: Record<string, Record<string, any>> = {}

  for (const [courseId, courseProgress] of Object.entries(progress) as [string, any][]) {
    const serverEntries = await getCourseProgress(learner.email, courseId)
    const serverMap = new Map(serverEntries.map(e => [e.chapterId, e]))

    const chapters = courseProgress.chapters || {}
    for (const [chapterId, localChapter] of Object.entries(chapters) as [string, any][]) {
      const serverChapter = serverMap.get(chapterId)
      const localPercent = localChapter.completionPercent || 0
      const serverPercent = serverChapter?.completionPercent || 0

      // Keep whichever has higher progress
      if (!serverChapter || localPercent > serverPercent) {
        await saveCourseProgress({
          email: learner.email,
          courseId,
          chapterId,
          currentSlide: localChapter.currentSlide || 0,
          totalSlides: localChapter.totalSlides || 0,
          completionPercent: localPercent,
          completed: localChapter.completed || localPercent >= 95,
        })
      }
    }

    // Return merged state
    const final = await getCourseProgress(learner.email, courseId)
    merged[courseId] = {}
    for (const entry of final) {
      merged[courseId][entry.chapterId] = entry
    }
  }

  return NextResponse.json({ success: true, progress: merged })
}
