import { NextRequest, NextResponse } from 'next/server'
import { verifyLearnerSession } from '@/lib/learner-auth'
import { saveCourseProgress, getCourseProgress } from '@/lib/azure-storage'

export async function POST(request: NextRequest) {
  const learner = await verifyLearnerSession()
  if (!learner) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  let progress: Record<string, any>
  try {
    const body = await request.json()
    progress = body.progress
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }
  if (!progress || typeof progress !== 'object') {
    return NextResponse.json({ error: 'Invalid progress data' }, { status: 400 })
  }
  // Cap the payload — a learner has at most a few dozen courses' worth of
  // legitimate local progress.
  if (Object.keys(progress).length > 100) {
    return NextResponse.json({ error: 'Too many courses in payload' }, { status: 400 })
  }
  const idOk = (s: string) => /^[a-z0-9][a-z0-9-]{0,80}$/i.test(s)
  const clampPct = (n: unknown) => Math.max(0, Math.min(100, Number(n) || 0))

  const merged: Record<string, Record<string, any>> = {}

  for (const [courseId, courseProgress] of Object.entries(progress) as [string, any][]) {
    if (!idOk(courseId)) continue
    const serverEntries = await getCourseProgress(learner.email, courseId)
    const serverMap = new Map(serverEntries.map(e => [e.chapterId, e]))

    const chapters = courseProgress.chapters || {}
    for (const [chapterId, localChapter] of Object.entries(chapters) as [string, any][]) {
      if (!idOk(chapterId) || !localChapter || typeof localChapter !== 'object') continue
      const serverChapter = serverMap.get(chapterId)
      const localPercent = clampPct(localChapter.completionPercent)
      const serverPercent = serverChapter?.completionPercent || 0

      // Keep whichever has higher progress
      if (!serverChapter || localPercent > serverPercent) {
        await saveCourseProgress({
          email: learner.email,
          courseId,
          chapterId,
          currentSlide: Math.max(0, Number(localChapter.currentSlide) || 0),
          totalSlides: Math.max(0, Number(localChapter.totalSlides) || 0),
          completionPercent: localPercent,
          completed: localChapter.completed === true || localPercent >= 95,
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
