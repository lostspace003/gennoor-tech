import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { BlobServiceClient } from '@azure/storage-blob'

// Streams a candidate's resume from the private `resumes` container.
// Path: /api/admin/resume-download?path=<sessionId>/<filename>
export async function GET(request: NextRequest) {
  const { authorized } = await verifyAdmin(request)
  if (!authorized) return unauthorizedResponse()

  const blobPath = request.nextUrl.searchParams.get('path')
  if (!blobPath || blobPath.includes('..')) {
    return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
  }

  const connStr = process.env.AZURE_STORAGE_CONNECTION_STRING
  if (!connStr) return NextResponse.json({ error: 'Storage not configured' }, { status: 500 })

  try {
    const svc = BlobServiceClient.fromConnectionString(connStr)
    const container = svc.getContainerClient('resumes')
    const blob = container.getBlobClient(blobPath)
    const exists = await blob.exists()
    if (!exists) return NextResponse.json({ error: 'Resume not found' }, { status: 404 })

    const props = await blob.getProperties()
    const buf = await blob.downloadToBuffer()
    const filename = blobPath.split('/').pop() || 'resume'

    return new NextResponse(new Uint8Array(buf), {
      headers: {
        'Content-Type': props.contentType || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'private, no-store',
      },
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
