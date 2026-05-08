import { NextRequest, NextResponse } from 'next/server'
import { TableClient } from '@azure/data-tables'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  try {
    const { authorized } = await verifyAdmin(request)
    if (!authorized) return unauthorizedResponse()

    const connStr = process.env.AZURE_STORAGE_CONNECTION_STRING
    if (!connStr) return NextResponse.json({ learners: [], progress: [], summary: {} })

    const learners: any[] = []
    try {
      const client = TableClient.fromConnectionString(connStr, 'Learners')
      for await (const entity of client.listEntities()) {
        learners.push({
          email: entity.email || entity.rowKey,
          name: entity.name || '',
          provider: entity.provider || '',
          lastLogin: entity.lastLogin || '',
          createdAt: entity.createdAt || '',
        })
      }
    } catch { /* table may not exist yet */ }

    const progress: any[] = []
    try {
      const client = TableClient.fromConnectionString(connStr, 'CourseProgress')
      for await (const entity of client.listEntities()) {
        progress.push({
          email: entity.partitionKey,
          courseId: entity.courseId || '',
          chapterId: entity.chapterId || '',
          currentSlide: entity.currentSlide || 0,
          totalSlides: entity.totalSlides || 0,
          completionPercent: entity.completionPercent || 0,
          completed: entity.completed || false,
          lastAccessed: entity.lastAccessed || '',
        })
      }
    } catch { /* table may not exist yet */ }

    const totalLearners = learners.length
    const byProvider = learners.reduce((acc: Record<string, number>, l) => {
      acc[l.provider] = (acc[l.provider] || 0) + 1
      return acc
    }, {})

    const uniqueActiveEmails = new Set(progress.map(p => p.email))
    const completedEntries = progress.filter(p => p.completed)
    const uniqueCompletedLearners = new Set(completedEntries.map(p => p.email))

    const chapterStats: Record<string, { views: number; completions: number; avgPercent: number }> = {}
    for (const p of progress) {
      const key = p.chapterId
      if (!chapterStats[key]) chapterStats[key] = { views: 0, completions: 0, avgPercent: 0 }
      chapterStats[key].views++
      if (p.completed) chapterStats[key].completions++
      chapterStats[key].avgPercent += p.completionPercent || 0
    }
    for (const key of Object.keys(chapterStats)) {
      if (chapterStats[key].views > 0) {
        chapterStats[key].avgPercent = Math.round(chapterStats[key].avgPercent / chapterStats[key].views)
      }
    }

    const courseStats: Record<string, { learners: Set<string>; completions: number }> = {}
    for (const p of progress) {
      if (!courseStats[p.courseId]) courseStats[p.courseId] = { learners: new Set(), completions: 0 }
      courseStats[p.courseId].learners.add(p.email)
      if (p.completed) courseStats[p.courseId].completions++
    }
    const byCourse = Object.entries(courseStats).map(([courseId, stats]) => ({
      courseId,
      learners: stats.learners.size,
      completions: stats.completions,
    }))

    return NextResponse.json({
      learners,
      progress,
      summary: {
        totalLearners,
        activeLearners: uniqueActiveEmails.size,
        learnersWithCompletion: uniqueCompletedLearners.size,
        totalProgressEntries: progress.length,
        byProvider,
        byCourse,
      },
      chapterStats,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
