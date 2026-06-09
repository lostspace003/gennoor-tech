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

function toWebStream(nodeStream: NodeJS.ReadableStream): ReadableStream {
  return new ReadableStream({
    start(controller) {
      nodeStream.on('data', (chunk: Buffer) => controller.enqueue(new Uint8Array(chunk)))
      nodeStream.on('end', () => controller.close())
      nodeStream.on('error', (err: Error) => controller.error(err))
    },
  })
}

export async function GET(
  req: NextRequest,
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
    const contentType = getContentType(blobPath)

    const properties = await blob.getProperties()
    const totalLength = properties.contentLength ?? 0

    // Range support — chapter audio runs to ~30 MB per file; without 206
    // responses the browser can't seek without buffering everything first.
    const range = req.headers.get('range')
    if (range && totalLength > 0) {
      const match = range.match(/bytes=(\d+)-(\d*)/)
      if (match) {
        const start = parseInt(match[1], 10)
        const end = match[2] ? Math.min(parseInt(match[2], 10), totalLength - 1) : totalLength - 1
        if (start >= totalLength || start > end) {
          return new NextResponse(null, {
            status: 416,
            headers: { 'Content-Range': `bytes */${totalLength}` },
          })
        }
        const partial = await blob.download(start, end - start + 1)
        if (!partial.readableStreamBody) {
          return NextResponse.json({ error: 'Not found' }, { status: 404 })
        }
        return new NextResponse(toWebStream(partial.readableStreamBody), {
          status: 206,
          headers: {
            'Content-Type': contentType,
            'Content-Range': `bytes ${start}-${end}/${totalLength}`,
            'Content-Length': String(end - start + 1),
            'Accept-Ranges': 'bytes',
            'Cache-Control': 'public, max-age=86400',
          },
        })
      }
    }

    const download = await blob.download(0)
    if (!download.readableStreamBody) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const headers: Record<string, string> = {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
    }
    if (totalLength > 0) headers['Content-Length'] = String(totalLength)
    if (contentType.startsWith('audio/') || contentType.startsWith('video/')) {
      headers['Accept-Ranges'] = 'bytes'
    }

    return new NextResponse(toWebStream(download.readableStreamBody), {
      status: 200,
      headers,
    })
  } catch (err: any) {
    if (err?.statusCode === 404 || err?.details?.errorCode === 'BlobNotFound') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    console.error('Content API error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
