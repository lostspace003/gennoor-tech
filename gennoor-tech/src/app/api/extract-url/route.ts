import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 30

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json() as { url: string }

    if (!url?.trim()) {
      return NextResponse.json({ error: 'No URL provided' }, { status: 400 })
    }

    let parsed: URL
    try {
      parsed = new URL(url)
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 })
    }

    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return NextResponse.json({ error: 'Only HTTP/HTTPS URLs are supported' }, { status: 400 })
    }

    // Block LinkedIn — it requires authentication and blocks scraping
    if (/linkedin\.com/i.test(parsed.hostname)) {
      return NextResponse.json({
        error: 'LinkedIn blocks automated access. Please export your LinkedIn profile as PDF (Profile > More > Save to PDF) and upload it instead.'
      }, { status: 422 })
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    let html: string
    try {
      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; GennoorBot/1.0; +https://gennoor.com)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      })
      clearTimeout(timeout)

      if (!res.ok) {
        return NextResponse.json({ error: `Failed to fetch URL (HTTP ${res.status})` }, { status: 422 })
      }

      const contentType = res.headers.get('content-type') || ''
      if (!contentType.includes('text/html') && !contentType.includes('text/plain') && !contentType.includes('application/xhtml')) {
        return NextResponse.json({ error: 'URL does not return HTML content' }, { status: 422 })
      }

      html = await res.text()
    } catch (fetchErr: any) {
      clearTimeout(timeout)
      if (fetchErr.name === 'AbortError') {
        return NextResponse.json({ error: 'URL took too long to respond (10s timeout)' }, { status: 422 })
      }
      return NextResponse.json({ error: `Failed to fetch URL: ${fetchErr.message}` }, { status: 422 })
    }

    // Strip script and style tags with their content
    let text = html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, '')
      .replace(/<nav[\s\S]*?<\/nav>/gi, '')
      .replace(/<footer[\s\S]*?<\/footer>/gi, '')
      .replace(/<header[\s\S]*?<\/header>/gi, ' ')

    // Strip all remaining HTML tags
    text = text.replace(/<[^>]+>/g, ' ')

    // Decode common HTML entities
    text = text
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ')
      .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))

    // Clean up whitespace
    text = text
      .replace(/[ \t]+/g, ' ')
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .trim()

    if (!text) {
      return NextResponse.json({ error: 'No text content could be extracted from this URL' }, { status: 422 })
    }

    // Limit to 10000 chars
    text = text.slice(0, 10000)

    return NextResponse.json({ text })
  } catch (error: any) {
    console.error('URL extraction error:', error)
    return NextResponse.json({
      error: `Failed to extract from URL: ${error.message || 'Unknown error'}`
    }, { status: 500 })
  }
}
