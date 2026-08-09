import fs from 'fs/promises'
import path from 'path'
import { Document, Packer, Paragraph, TextRun, BorderStyle, ImageRun, AlignmentType } from 'docx'
import PDFDocument from 'pdfkit'

// Renders a proposal markdown one-pager into a .docx buffer. Understands the
// exact structure generatePitchDoc emits: # title, *italic subtitle*, ## section
// headings, - bullets, **bold** inline, plain paragraphs.

const BRAND = '2563EB' // Gennoor blue
const INK = '1F2937'
const MUTED = '6B7280'
const HEADER_BG = '0C1426' // same navy band the branded emails use

// The white wordmark sits on the navy band at the top of every proposal — the
// same asset and band colour the branded emails use, so a proposal and the
// email carrying it look like one thing. (The `-white` files are white-BACKGROUND
// cards; on navy they'd read as a white box.) Read from public/ at request
// time; if it's ever missing the document still builds, just without the mark.
const LOGO_PATH = path.join(process.cwd(), 'public', 'logos', 'gennoor-tech-horizontal-dark-bright_760x260_email-header.png')
const LOGO_RATIO = 260 / 760

let logoCache: Buffer | null | undefined
async function whiteLogo(): Promise<Buffer | null> {
  if (logoCache !== undefined) return logoCache
  try {
    logoCache = await fs.readFile(LOGO_PATH)
  } catch (e) {
    console.error('Proposal logo missing:', e)
    logoCache = null
  }
  return logoCache
}

function inlineRuns(text: string, base?: Partial<{ bold: boolean; italics: boolean; color: string; size: number }>): TextRun[] {
  return text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((part) =>
    /^\*\*[^*]+\*\*$/.test(part)
      ? new TextRun({ text: part.slice(2, -2), bold: true, ...base })
      : new TextRun({ text: part, ...base })
  )
}

export async function buildPitchDocx(markdown: string, footer: string): Promise<Buffer> {
  const children: Paragraph[] = []

  // Branded header: white wordmark on the navy band, full text-column width
  const logo = await whiteLogo()
  if (logo) {
    const width = 170
    children.push(new Paragraph({
      shading: { fill: HEADER_BG },
      alignment: AlignmentType.LEFT,
      spacing: { before: 0, after: 260 },
      children: [
        new ImageRun({
          data: logo,
          type: 'png',
          transformation: { width, height: Math.round(width * LOGO_RATIO) },
        }),
      ],
    }))
  }

  for (const raw of markdown.split('\n')) {
    const line = raw.trimEnd()
    if (!line.trim()) continue
    if (line.startsWith('# ')) {
      children.push(new Paragraph({
        children: inlineRuns(line.slice(2), { bold: true, color: BRAND, size: 40 }),
        spacing: { after: 60 },
      }))
    } else if (/^\*[^*].*\*$/.test(line.trim())) {
      children.push(new Paragraph({
        children: [new TextRun({ text: line.trim().slice(1, -1), italics: true, color: MUTED, size: 21 })],
        spacing: { after: 200 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: 'E5E7EB', space: 6 } },
      }))
    } else if (line.startsWith('## ')) {
      children.push(new Paragraph({
        children: inlineRuns(line.slice(3), { bold: true, color: BRAND, size: 25 }),
        spacing: { before: 220, after: 80 },
      }))
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      children.push(new Paragraph({
        children: inlineRuns(line.slice(2), { color: INK, size: 22 }),
        bullet: { level: 0 },
        spacing: { after: 40 },
      }))
    } else {
      children.push(new Paragraph({
        children: inlineRuns(line, { color: INK, size: 22 }),
        spacing: { after: 80 },
      }))
    }
  }

  children.push(new Paragraph({
    children: [new TextRun({ text: footer, color: MUTED, size: 17, italics: true })],
    spacing: { before: 300 },
    border: { top: { style: BorderStyle.SINGLE, size: 6, color: 'E5E7EB', space: 6 } },
  }))

  const doc = new Document({
    styles: { default: { document: { run: { font: 'Calibri' } } } },
    sections: [{
      properties: { page: { margin: { top: 850, bottom: 850, left: 1000, right: 1000 } } },
      children,
    }],
  })
  return Buffer.from(await Packer.toBuffer(doc))
}

// Same one-pager as PDF (portrait A4, pure pdfkit like the certificate
// generator — default Helvetica fonts, no native deps).
export async function buildPitchPdf(markdown: string, footer: string): Promise<Buffer> {
  const brand = '#2563EB'
  const ink = '#1F2937'
  const muted = '#6B7280'

  const doc = new PDFDocument({ size: 'A4', margins: { top: 56, bottom: 56, left: 60, right: 60 } })
  const chunks: Buffer[] = []
  doc.on('data', (c) => chunks.push(c as Buffer))

  const done = new Promise<Buffer>((resolve, reject) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)
  })

  // Branded header: full-bleed navy band with the white wordmark on it
  const logo = await whiteLogo()
  if (logo) {
    const bandHeight = 74
    const logoWidth = 150
    doc.save().rect(0, 0, doc.page.width, bandHeight).fill(`#${HEADER_BG}`).restore()
    doc.image(logo, doc.page.margins.left, (bandHeight - logoWidth * LOGO_RATIO) / 2, { width: logoWidth })
    doc.y = bandHeight + 28
  }

  // Inline **bold** rendering via pdfkit's continued-text API
  const writeInline = (text: string, size: number, color: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean)
    parts.forEach((part, i) => {
      const bold = /^\*\*[^*]+\*\*$/.test(part)
      doc.font(bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(size).fillColor(color)
        .text(bold ? part.slice(2, -2) : part, { continued: i < parts.length - 1 })
    })
  }

  for (const raw of markdown.split('\n')) {
    const line = raw.trimEnd()
    if (!line.trim()) continue
    if (line.startsWith('# ')) {
      doc.font('Helvetica-Bold').fontSize(19).fillColor(brand).text(line.slice(2))
      doc.moveDown(0.2)
    } else if (/^\*[^*].*\*$/.test(line.trim())) {
      doc.font('Helvetica-Oblique').fontSize(10).fillColor(muted).text(line.trim().slice(1, -1))
      doc.moveDown(0.3)
      doc.moveTo(doc.page.margins.left, doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).strokeColor('#E5E7EB').lineWidth(0.8).stroke()
      doc.moveDown(0.5)
    } else if (line.startsWith('## ')) {
      doc.moveDown(0.5)
      doc.font('Helvetica-Bold').fontSize(12.5).fillColor(brand).text(line.slice(3))
      doc.moveDown(0.15)
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      doc.font('Helvetica').fontSize(10.5).fillColor(ink).text('•  ', { continued: true })
      writeInline(line.slice(2), 10.5, ink)
      doc.moveDown(0.1)
    } else {
      writeInline(line, 10.5, ink)
      doc.moveDown(0.25)
    }
  }

  doc.moveDown(1)
  doc.moveTo(doc.page.margins.left, doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).strokeColor('#E5E7EB').lineWidth(0.8).stroke()
  doc.moveDown(0.4)
  doc.font('Helvetica-Oblique').fontSize(8).fillColor(muted).text(footer)

  doc.end()
  return done
}

// Safe blob/file name for one version of a lead's proposal. The lead sees this
// filename on the attachment, so it reads as a proposal for them — never as a
// "pitch". (The blob folder stays `pitches/` so existing files keep working.)
export function pitchDocName(leadName: string, company: string, v: number, ext: 'docx' | 'pdf'): string {
  const base = (company || leadName || 'lead').replace(/[^a-zA-Z0-9 _-]/g, '').trim().replace(/\s+/g, '-').slice(0, 40)
  return `pitches/${base}-proposal-v${v}.${ext}`
}
