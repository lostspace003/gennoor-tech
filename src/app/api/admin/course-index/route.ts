import { NextRequest, NextResponse } from 'next/server'
import { requireCrmUser } from '@/lib/crm/access'
import { qdrantConfigured } from '@/lib/course-index'
import { findUnindexedCourses, runCourseIndexJobs } from '@/lib/course-index-sync'

// Makes every published course searchable for the Ask bot and lesson search: any course that has no
// lessons in Qdrant yet is indexed, video and interactive alike. When everything is indexed it does
// nothing. The app also runs this by itself after every deploy (src/instrumentation.ts); this route is
// for a manager who wants it now. Authorised by the cron secret or a CRM manager session.
async function authorized(req: NextRequest): Promise<boolean> {
  if (process.env.CRM_CRON_SECRET && req.headers.get('x-cron-secret') === process.env.CRM_CRON_SECRET) return true
  const user = await requireCrmUser()
  return Boolean(user?.isManager)
}

export async function POST(req: NextRequest) {
  if (!(await authorized(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!qdrantConfigured()) return NextResponse.json({ error: 'Qdrant is not configured' }, { status: 503 })

  let found
  try {
    found = await findUnindexedCourses()
  } catch (e: any) {
    return NextResponse.json({ error: `Could not check the index: ${e?.message}` }, { status: 502 })
  }

  // Detached from the request: a new course can take longer than the App Service request limit.
  if (found.pending.length) void runCourseIndexJobs(found.pending)

  return NextResponse.json(
    { checked: found.checked, indexing: found.pending.map((j) => j.slug) },
    { status: found.pending.length ? 202 : 200 },
  )
}
