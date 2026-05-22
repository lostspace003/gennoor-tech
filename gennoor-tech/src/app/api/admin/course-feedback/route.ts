import { NextRequest, NextResponse } from 'next/server'
import { TableClient } from '@azure/data-tables'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'

interface FeedbackRow {
  courseId: string
  certId: string
  learnerEmail: string
  learnerName: string
  rating: number
  comments: string
  createdAt: string
}

export async function POST(request: NextRequest) {
  const { authorized } = await verifyAdmin(request)
  if (!authorized) return unauthorizedResponse()

  const connStr = process.env.AZURE_STORAGE_CONNECTION_STRING
  if (!connStr) return NextResponse.json({ summary: {}, perCourse: [], recent: [] })

  try {
    const client = TableClient.fromConnectionString(connStr, 'CourseFeedback')
    const rows: FeedbackRow[] = []
    for await (const e of client.listEntities()) {
      rows.push({
        courseId: String(e.courseId || e.partitionKey || ''),
        certId: String(e.certId || e.rowKey || ''),
        learnerEmail: String(e.learnerEmail || ''),
        learnerName: String(e.learnerName || ''),
        rating: Number(e.rating || 0),
        comments: String(e.comments || ''),
        createdAt: String(e.createdAt || ''),
      })
    }
    rows.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))

    const total = rows.length
    const avgRating = total > 0 ? parseFloat((rows.reduce((s, r) => s + r.rating, 0) / total).toFixed(2)) : 0
    const fiveStar = rows.filter(r => r.rating === 5).length
    const lowRated = rows.filter(r => r.rating <= 2).length

    const byCourse = new Map<string, { courseId: string; count: number; sum: number; comments: number }>()
    for (const r of rows) {
      const e = byCourse.get(r.courseId)
      if (e) {
        e.count++
        e.sum += r.rating
        if (r.comments?.trim()) e.comments++
      } else {
        byCourse.set(r.courseId, { courseId: r.courseId, count: 1, sum: r.rating, comments: r.comments?.trim() ? 1 : 0 })
      }
    }
    const perCourse = [...byCourse.values()]
      .map(c => ({
        courseId: c.courseId,
        count: c.count,
        avgRating: parseFloat((c.sum / c.count).toFixed(2)),
        commentsCount: c.comments,
      }))
      .sort((a, b) => b.count - a.count)

    return NextResponse.json({
      summary: { total, avgRating, fiveStar, lowRated },
      perCourse,
      recent: rows.slice(0, 100),
    })
  } catch (err: any) {
    if (err?.statusCode === 404 || err?.message?.includes('TableNotFound')) {
      return NextResponse.json({ summary: { total: 0, avgRating: 0, fiveStar: 0, lowRated: 0 }, perCourse: [], recent: [] })
    }
    console.error('course-feedback admin error:', err)
    return NextResponse.json({ error: 'Failed to fetch course feedback' }, { status: 500 })
  }
}
