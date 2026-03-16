import { BlobServiceClient } from '@azure/storage-blob'
import { NextRequest, NextResponse } from 'next/server'

const MIME_TYPES: Record<string, string> = {
  'svg': 'image/svg+xml',
  'png': 'image/png',
  'jpg': 'image/jpeg',
  'jpeg': 'image/jpeg',
  'webp': 'image/webp',
  'gif': 'image/gif',
  'ico': 'image/x-icon',
  'mp4': 'video/mp4',
  'webm': 'video/webm',
  'pdf': 'application/pdf',
  'html': 'text/html; charset=utf-8',
  'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  const blobPath = path.join('/')

  // Block path traversal attempts
  if (blobPath.includes('..') || blobPath.startsWith('/')) {
    return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
  }

  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING
  if (!connectionString) {
    return NextResponse.json({ error: 'Storage not configured' }, { status: 500 })
  }

  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString)
    const containerClient = blobServiceClient.getContainerClient('media')
    const blobClient = containerClient.getBlobClient(blobPath)

    const properties = await blobClient.getProperties()
    const downloadResponse = await blobClient.download(0)

    if (!downloadResponse.readableStreamBody) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const ext = blobPath.split('.').pop()?.toLowerCase() || ''
    const contentType = MIME_TYPES[ext] || properties.contentType || 'application/octet-stream'

    // Stream the blob to the client
    const nodeStream = downloadResponse.readableStreamBody
    const webStream = new ReadableStream({
      start(controller) {
        nodeStream.on('data', (chunk: Buffer) => controller.enqueue(chunk))
        nodeStream.on('end', () => controller.close())
        nodeStream.on('error', (err: Error) => controller.error(err))
      },
    })

    const headers: Record<string, string> = {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400',
      'X-Content-Type-Options': 'nosniff',
    }

    if (properties.contentLength) {
      headers['Content-Length'] = properties.contentLength.toString()
    }

    // Support range requests for video streaming
    const range = request.headers.get('range')
    if (range && properties.contentLength) {
      const match = range.match(/bytes=(\d+)-(\d*)/)
      if (match) {
        const start = parseInt(match[1], 10)
        const end = match[2] ? parseInt(match[2], 10) : properties.contentLength - 1
        const rangeDownload = await blobClient.download(start, end - start + 1)
        if (rangeDownload.readableStreamBody) {
          const rangeStream = new ReadableStream({
            start(controller) {
              rangeDownload.readableStreamBody!.on('data', (chunk: Buffer) => controller.enqueue(chunk))
              rangeDownload.readableStreamBody!.on('end', () => controller.close())
              rangeDownload.readableStreamBody!.on('error', (err: Error) => controller.error(err))
            },
          })
          return new NextResponse(rangeStream, {
            status: 206,
            headers: {
              'Content-Type': contentType,
              'Content-Range': `bytes ${start}-${end}/${properties.contentLength}`,
              'Content-Length': (end - start + 1).toString(),
              'Accept-Ranges': 'bytes',
              'Cache-Control': 'public, max-age=86400',
            },
          })
        }
      }
    }

    if (ext === 'mp4' || ext === 'webm') {
      headers['Accept-Ranges'] = 'bytes'
    }

    return new NextResponse(webStream, { headers })
  } catch (error: any) {
    if (error.statusCode === 404) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    console.error('Media proxy error:', error.message)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
