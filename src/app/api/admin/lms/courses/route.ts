import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { listAllLmsCourses, type LmsCourse } from '@/lib/lms'
import { copyStatus } from '@/lib/lms-import'
import { studioCopyStatus } from '@/lib/lms-studio-package'

function expectedBlobs(c: LmsCourse): string[] {
  const out = new Set<string>()
  for (const s of c.sections) {
    for (const i of s.items) {
      if (i.type !== 'lecture') continue
      if (i.video) out.add(i.video)
      if (i.caption) out.add(i.caption)
      i.resources.forEach(r => out.add(r.blob))
    }
  }
  return [...out]
}

export async function GET(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const conn = process.env.LMS_STORAGE_CONNECTION_STRING || process.env.AZURE_STORAGE_CONNECTION_STRING || ''

  const courses = await listAllLmsCourses()
  const rows = await Promise.all(
    courses.map(async c => ({
      slug: c.slug,
      code: c.code,
      title: c.title,
      stats: c.stats,
      published: (c as { published?: boolean }).published !== false,
      vendor: c.vendor || '',
      kind: c.kind || '',
      level: c.level || '',
      topics: c.topics_tags || [],
      domains: c.domains || [],
      track: c.track || '',
      protected: !!c.protected,
      copy: conn
        ? await (c.protected && c.packageFiles ? studioCopyStatus(conn, c) : copyStatus(conn, c.slug, expectedBlobs(c))).catch(() => null)
        : null,
    })),
  )
  return NextResponse.json({ courses: rows })
}
