import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 30

// Polyfill browser APIs needed by pdfjs-dist in serverless Node.js
function ensurePolyfills() {
  if (typeof globalThis.DOMMatrix === 'undefined') {
    globalThis.DOMMatrix = class DOMMatrix {
      a = 1; b = 0; c = 0; d = 1; e = 0; f = 0
      m11 = 1; m12 = 0; m13 = 0; m14 = 0
      m21 = 0; m22 = 1; m23 = 0; m24 = 0
      m31 = 0; m32 = 0; m33 = 1; m34 = 0
      m41 = 0; m42 = 0; m43 = 0; m44 = 1
      is2D = true; isIdentity = true
      constructor(init?: any) {
        if (Array.isArray(init) && init.length >= 6) {
          ;[this.a, this.b, this.c, this.d, this.e, this.f] = init
          this.m11 = this.a; this.m12 = this.b
          this.m21 = this.c; this.m22 = this.d
          this.m41 = this.e; this.m42 = this.f
        }
      }
      inverse() { return new DOMMatrix() }
      multiply() { return new DOMMatrix() }
      translate() { return new DOMMatrix() }
      scale() { return new DOMMatrix() }
      rotate() { return new DOMMatrix() }
      transformPoint(p?: any) { return p || { x: 0, y: 0, z: 0, w: 1 } }
      static fromMatrix() { return new DOMMatrix() }
      static fromFloat32Array() { return new DOMMatrix() }
      static fromFloat64Array() { return new DOMMatrix() }
    } as any
  }
  if (typeof globalThis.Path2D === 'undefined') {
    globalThis.Path2D = class Path2D {
      addPath() {}; moveTo() {}; lineTo() {}; bezierCurveTo() {}
      quadraticCurveTo() {}; closePath() {}; rect() {}; arc() {}; arcTo() {}
      ellipse() {}; roundRect() {}
    } as any
  }
  if (typeof globalThis.ImageData === 'undefined') {
    globalThis.ImageData = class ImageData {
      width: number; height: number; data: Uint8ClampedArray
      constructor(w: number, h: number) {
        this.width = w; this.height = h
        this.data = new Uint8ClampedArray(w * h * 4)
      }
    } as any
  }
}

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
        // Set up polyfills BEFORE importing pdf-parse / pdfjs-dist
        ensurePolyfills()
        const { PDFParse } = await import('pdf-parse')
        const parser = new PDFParse({ data: new Uint8Array(buffer) })
        const result = await parser.getText()
        text = result.text
        await parser.destroy()
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
