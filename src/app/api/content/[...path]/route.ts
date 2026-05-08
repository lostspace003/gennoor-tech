import { NextRequest, NextResponse } from 'next/server'
import { BlobServiceClient } from '@azure/storage-blob'

const CONTAINER = 'website-content'

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.json': 'application/json',
  '.css': 'text/css',
  '.js': 'application/javascript',
}

function getContentType(blobPath: string): string {
  const ext = blobPath.slice(blobPath.lastIndexOf('.')).toLowerCase()
  return MIME[ext] || 'application/octet-stream'
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  const blobPath = path.join('/')

  if (!blobPath || blobPath.includes('..')) {
    return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
  }

  const connStr = process.env.AZURE_STORAGE_CONNECTION_STRING
  if (!connStr) {
    return NextResponse.json({ error: 'Storage not configured' }, { status: 500 })
  }

  try {
    const blobService = BlobServiceClient.fromConnectionString(connStr)
    const container = blobService.getContainerClient(CONTAINER)
    const blob = container.getBlobClient(blobPath)

    const download = await blob.download(0)
    if (!download.readableStreamBody) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const chunks: Buffer[] = []
    for await (const chunk of download.readableStreamBody) {
      chunks.push(Buffer.from(chunk))
    }
    const body = Buffer.concat(chunks)

    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': getContentType(blobPath),
        'Content-Length': String(body.length),
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
      },
    })
  } catch (err: any) {
    if (err?.statusCode === 404 || err?.details?.errorCode === 'BlobNotFound') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    console.error('Content API error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
