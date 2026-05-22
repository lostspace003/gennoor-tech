import { NextResponse } from 'next/server'
import { verifyLearnerSession } from '@/lib/learner-auth'
import { getAllCourseProgress } from '@/lib/azure-storage'
import { TableClient } from '@azure/data-tables'

export const dynamic = 'force-dynamic'

/**
 * Aggregate learner dashboard data: progress rows across all courses + every
 * certificate the learner has earned. The client renders per-course cards
 * (started · in-progress · completed) from these two arrays.
 */
export async function GET() {
  const learner = await verifyLearnerSession()
  if (!learner) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  // Progress rows across all courses.
  const progressRows = await getAllCourseProgress(learner.email)

  // Certificates issued to this learner — query the Certificates table by
  // recipientEmail. (Cross-partition scan since the table partitions by
  // workshopSlug not by recipient.)
  const certs: Array<Record<string, unknown>> = []
  try {
    const conn = process.env.AZURE_STORAGE_CONNECTION_STRING
    if (conn) {
      const client = TableClient.fromConnectionString(conn, 'Certificates')
      const lower = learner.email.toLowerCase().trim()
      const query = client.listEntities({
        queryOptions: { filter: `recipientEmail eq '${lower}'` },
      })
      for await (const entity of query) {
        certs.push({
          certId: entity.certId,
          workshopSlug: entity.workshopSlug,
          workshopTitle: entity.workshopTitle,
          issueDate: entity.issueDate,
          verifyUrl: entity.verifyUrl,
          pdfBlobPath: entity.pdfBlobPath,
        })
      }
    }
  } catch {
    // Non-fatal; dashboard still renders with empty certs list.
  }

  return NextResponse.json({
    learner: { name: learner.name, email: learner.email },
    progress: progressRows,
    certificates: certs,
  })
}
