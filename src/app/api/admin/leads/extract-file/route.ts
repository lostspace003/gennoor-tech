import { NextRequest, NextResponse } from 'next/server'
import { requireCrmUser } from '@/lib/crm/access'

// Server-side text extraction for formats the browser can't parse:
// DOCX (mammoth) and PDF (pdf-parse). Honest limits: image-only/scanned
// PDFs have no text layer and return empty — we say so instead of guessing.
export async function POST(req: NextRequest) {
  const user = await requireCrmUser()
  if (!user?.isManager) return NextResponse.json({ error: 'Only managers can import leads' }, { status: 403 })

  try {
    const form = await req.formData()
    const file = form.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'file required' }, { status: 400 })
    if (file.size > 15 * 1024 * 1024) return NextResponse.json({ error: 'File too large (max 15 MB)' }, { status: 400 })

    const buffer = Buffer.from(await file.arrayBuffer())
    const ext = (file.name.split('.').pop() || '').toLowerCase()
    let text = ''

    if (ext === 'docx') {
      const mammoth = (await import('mammoth')).default
      text = (await mammoth.extractRawText({ buffer })).value
    } else if (ext === 'pdf') {
      const pdfParse = (await import('pdf-parse')).default
      text = (await pdfParse(buffer)).text
    } else {
      return NextResponse.json({ error: `Unsupported format .${ext} for server extraction` }, { status: 400 })
    }

    text = text.replace(/\s+\n/g, '\n').trim()
    if (!text) {
      return NextResponse.json({
        error: ext === 'pdf'
          ? 'This PDF has no text layer (likely scanned). OCR is not set up — export it as text or Excel instead.'
          : 'No text found in this file.',
      }, { status: 422 })
    }
    return NextResponse.json({ text: text.slice(0, 60_000), truncated: text.length > 60_000 })
  } catch (error) {
    console.error('Extract file error:', error)
    return NextResponse.json({ error: 'Failed to extract text from file' }, { status: 500 })
  }
}
