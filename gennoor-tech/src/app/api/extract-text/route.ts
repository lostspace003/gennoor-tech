import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 30

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Maximum size is 10MB.' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const ext = file.name.split('.').pop()?.toLowerCase()

    let text = ''

    if (ext === 'txt') {
      text = buffer.toString('utf-8')
    } else if (ext === 'pdf') {
      try {
        // pdf-parse v1.1.1 — uses pdfjs-dist v2, no workers or DOM APIs needed
        const pdfParse = (await import('pdf-parse')).default
        const data = await pdfParse(buffer)
        text = data.text
      } catch (pdfError: any) {
        console.error('PDF parse error:', pdfError)
        return NextResponse.json({
          error: `Failed to parse PDF: ${pdfError.message || 'Unknown error'}. Try pasting your text directly into the form.`
        }, { status: 422 })
      }
    } else {
      return NextResponse.json({ error: 'Unsupported file type. Please upload a PDF or TXT file.' }, { status: 400 })
    }

    if (!text.trim()) {
      return NextResponse.json({
        error: 'No text could be extracted. It may be a scanned/image-based PDF. Try pasting text directly into the form.'
      }, { status: 422 })
    }

    return NextResponse.json({ text: text.trim() })
  } catch (error: any) {
    console.error('Text extraction error:', error)
    return NextResponse.json({
      error: `Failed to extract text: ${error.message || 'Unknown error'}`
    }, { status: 500 })
  }
}
