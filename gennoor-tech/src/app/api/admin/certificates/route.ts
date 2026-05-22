import { NextRequest, NextResponse } from 'next/server'
import { TableClient } from '@azure/data-tables'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'

interface CertRow {
  certId: string
  recipientName: string
  recipientEmail: string
  workshopSlug: string
  workshopTitle: string
  workshopDate: string
  issueDate: string
  trainerName: string
  pdfBlobPath: string
  verifyUrl: string
  status: 'issued' | 'revoked'
  createdAt: string
}

export async function POST(request: NextRequest) {
  const { authorized } = await verifyAdmin(request)
  if (!authorized) return unauthorizedResponse()

  const connStr = process.env.AZURE_STORAGE_CONNECTION_STRING
  if (!connStr) return NextResponse.json({ summary: {}, perCourse: [], recent: [] })

  try {
    const client = TableClient.fromConnectionString(connStr, 'Certificates')
    const certs: CertRow[] = []
    for await (const e of client.listEntities()) {
      certs.push({
        certId: String(e.certId || e.rowKey || ''),
        recipientName: String(e.recipientName || ''),
        recipientEmail: String(e.recipientEmail || ''),
        workshopSlug: String(e.workshopSlug || e.partitionKey || ''),
        workshopTitle: String(e.workshopTitle || ''),
        workshopDate: String(e.workshopDate || ''),
        issueDate: String(e.issueDate || e.createdAt || ''),
        trainerName: String(e.trainerName || ''),
        pdfBlobPath: String(e.pdfBlobPath || ''),
        verifyUrl: String(e.verifyUrl || ''),
        status: (e.status as 'issued' | 'revoked') || 'issued',
        createdAt: String(e.createdAt || ''),
      })
    }

    certs.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))

    const issued = certs.filter(c => c.status === 'issued')
    const revoked = certs.filter(c => c.status === 'revoked')

    const byCourse = new Map<string, { slug: string; title: string; count: number }>()
    for (const c of issued) {
      const key = c.workshopSlug || 'unknown'
      const existing = byCourse.get(key)
      if (existing) existing.count++
      else byCourse.set(key, { slug: key, title: c.workshopTitle || key, count: 1 })
    }
    const perCourse = [...byCourse.values()].sort((a, b) => b.count - a.count)

    const uniqueLearners = new Set(issued.map(c => c.recipientEmail.toLowerCase())).size

    const now = Date.now()
    const past7 = issued.filter(c => now - new Date(c.createdAt).getTime() < 7 * 86400000).length
    const past30 = issued.filter(c => now - new Date(c.createdAt).getTime() < 30 * 86400000).length

    return NextResponse.json({
      summary: {
        total: certs.length,
        issued: issued.length,
        revoked: revoked.length,
        uniqueLearners,
        past7,
        past30,
      },
      perCourse,
      recent: certs.slice(0, 100),
    })
  } catch (err: any) {
    if (err?.statusCode === 404 || err?.message?.includes('TableNotFound')) {
      return NextResponse.json({ summary: { total: 0, issued: 0, revoked: 0, uniqueLearners: 0, past7: 0, past30: 0 }, perCourse: [], recent: [] })
    }
    console.error('certificates admin error:', err)
    return NextResponse.json({ error: 'Failed to fetch certificates' }, { status: 500 })
  }
}
