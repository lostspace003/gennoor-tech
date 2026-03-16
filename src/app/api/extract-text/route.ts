import { NextRequest, NextResponse } from 'next/server'
import { PDFParse } from 'pdf-parse'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const ext = file.name.split('.').pop()?.toLowerCase()

    let text = ''

    if (ext === 'txt') {
      text = buffer.toString('utf-8')
    } else if (ext === 'pdf') {
      const parser = new PDFParse({ data: new Uint8Array(buffer) })
      const result = await parser.getText()
      text = result.text
    } else {
      return NextResponse.json({ error: 'Unsupported file type. Please upload a PDF or TXT file.' }, { status: 400 })
    }

    return NextResponse.json({ text: text.trim() })
  } catch (error) {
    console.error('Text extraction error:', error)
    return NextResponse.json({ error: 'Failed to extract text from file' }, { status: 500 })
  }
}
