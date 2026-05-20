/**
 * Course curriculum PDF generator.
 *
 * Format matches docs/5-Claude Code for Developers.docx exactly:
 *   - Page 1: Course title · Duration line · Requirements paragraph · Course Outcome (numbered list)
 *   - Page 2+: "Table of Content" heading · Module XX: Title + bullet topics
 *
 * This is a paid 2-day (16-hour) training curriculum document. No marketing
 * chrome — no gradient cover bands, no enablement sidebar, no next-steps
 * back cover. Light Gennoor branding only (small logo top-left page 1, page
 * numbers in footer).
 */

import PDFDocument from 'pdfkit'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { CoursePdf } from '../data/course-pdfs.ts'

// Typography & palette — professional curriculum doc, not marketing piece
const NAVY = '#0C1426'
const TEXT = '#1B2845'
const MUTED = '#5C6784'
const ACCENT = '#1D4ED8'
const RULE = '#E5E7EB'

// A4 portrait dimensions (points)
const PAGE_W = 595
const PAGE_H = 842
const MARGIN_X = 60
const MARGIN_TOP = 70
const MARGIN_BOTTOM = 70
const CONTENT_W = PAGE_W - MARGIN_X * 2
const CONTENT_BOTTOM = PAGE_H - MARGIN_BOTTOM

const ASSETS_DIR = (() => {
  const here = path.dirname(fileURLToPath(import.meta.url))
  return path.resolve(here, '..', '..', 'public')
})()

const LOGO = path.join(ASSETS_DIR, 'gennoor-tech-horizontal-dark_760x260_website-header.png')

export async function generateCoursePdf(course: CoursePdf): Promise<Buffer> {
  const doc = new PDFDocument({
    size: 'A4',
    layout: 'portrait',
    margin: 0,
    info: {
      Title: course.title,
      Author: 'Gennoor Tech',
      Subject: 'Training curriculum',
      Keywords: `training, curriculum, ${course.slug}, gennoor tech`,
    },
    bufferPages: true, // needed so we can write page numbers at the end
  })

  const chunks: Buffer[] = []
  doc.on('data', chunk => chunks.push(chunk as Buffer))

  return new Promise<Buffer>((resolve, reject) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    // PAGE 1 — Title, Duration, Requirements, Course Outcome
    drawTitlePage(doc, course)

    // PAGE 2+ — Table of Content (modules + bullet topics)
    doc.addPage()
    drawTableOfContent(doc, course)

    // Walk all pages and stamp footer (page number + course title)
    stampFooters(doc, course)

    doc.end()
  })
}

// =====================================================================
// PAGE 1 — Title / Duration / Requirements / Course Outcome
// =====================================================================

function drawTitlePage(doc: PDFKit.PDFDocument, c: CoursePdf) {
  // Light header band — Gennoor logo top-left, no fill
  try {
    doc.image(LOGO, MARGIN_X, 30, { width: 130 })
  } catch {
    doc.fillColor(NAVY).font('Helvetica-Bold').fontSize(12).text('GENNOOR TECH', MARGIN_X, 40)
  }

  // Hairline below logo
  doc.rect(MARGIN_X, 85, CONTENT_W, 0.5).fill(RULE)

  // Course title
  let y = 130
  doc.fillColor(TEXT).font('Helvetica-Bold').fontSize(26)
    .text(c.title, MARGIN_X, y, { width: CONTENT_W, lineGap: 4 })

  y += doc.heightOfString(c.title, { width: CONTENT_W, lineGap: 4 }) + 28

  // Duration
  y = writeKeyValue(doc, y, 'Duration', c.duration)

  y += 12

  // Requirements (if present)
  if (c.requirements && c.requirements.trim()) {
    y = writeKeyValue(doc, y, 'Requirements', c.requirements)
    y += 18
  } else {
    y += 6
  }

  // Course Outcome heading
  doc.fillColor(TEXT).font('Helvetica-Bold').fontSize(14)
    .text('Course Outcome', MARGIN_X, y)
  y += 22

  // Numbered outcomes
  c.outcomes.forEach((outcome, i) => {
    const num = `${i + 1}.`
    doc.fillColor(TEXT).font('Helvetica-Bold').fontSize(11)
      .text(num, MARGIN_X, y, { width: 24, continued: false })
    doc.fillColor(TEXT).font('Helvetica').fontSize(11)
      .text(outcome, MARGIN_X + 24, y, { width: CONTENT_W - 24, lineGap: 3 })

    const h = doc.heightOfString(outcome, { width: CONTENT_W - 24, lineGap: 3 })
    y += Math.max(20, h + 8)

    // Page break safety — though page 1 should fit
    if (y > CONTENT_BOTTOM - 30) {
      doc.addPage()
      y = MARGIN_TOP
    }
  })
}

function writeKeyValue(doc: PDFKit.PDFDocument, y: number, label: string, value: string): number {
  // Inline: "Label: value" with the label bold, value normal
  doc.fillColor(TEXT).font('Helvetica-Bold').fontSize(11)
    .text(`${label}: `, MARGIN_X, y, { continued: true, lineGap: 3 })
  doc.font('Helvetica')
    .text(value, { width: CONTENT_W, lineGap: 3 })
  return y + doc.heightOfString(`${label}: ${value}`, { width: CONTENT_W, lineGap: 3 }) + 4
}

// =====================================================================
// PAGE 2+ — Table of Content (Module XX: Title + bullet topics)
// =====================================================================

function drawTableOfContent(doc: PDFKit.PDFDocument, c: CoursePdf) {
  let y = MARGIN_TOP

  // Heading
  doc.fillColor(TEXT).font('Helvetica-Bold').fontSize(16)
    .text('Table of Content', MARGIN_X, y)
  y += 30

  c.modules.forEach((mod, idx) => {
    // Estimate height we need for this module — title + N topics
    const titleH = 22
    const topicsH = mod.topics.reduce((sum, t) => {
      const lineH = doc.heightOfString(t, { width: CONTENT_W - 24, lineGap: 3 })
      return sum + Math.max(16, lineH + 4)
    }, 0)
    const blockH = titleH + topicsH + 18 // spacing between modules

    // Page-break if this module wouldn't fit
    if (y + blockH > CONTENT_BOTTOM) {
      doc.addPage()
      y = MARGIN_TOP
    }

    // Module heading: "Module 01: Setup and Configuration"
    doc.fillColor(TEXT).font('Helvetica-Bold').fontSize(13)
      .text(`Module ${mod.number}: ${mod.title}`, MARGIN_X, y, { width: CONTENT_W, lineGap: 2 })
    const headingH = doc.heightOfString(`Module ${mod.number}: ${mod.title}`, { width: CONTENT_W, lineGap: 2 })
    y += headingH + 8

    // Topics — bullet list (en dash for clean curriculum look)
    mod.topics.forEach(topic => {
      // Bullet (en dash) + topic text
      doc.fillColor(MUTED).font('Helvetica').fontSize(11)
        .text('—', MARGIN_X, y, { width: 18 })
      doc.fillColor(TEXT).font('Helvetica').fontSize(11)
        .text(topic, MARGIN_X + 18, y, { width: CONTENT_W - 18, lineGap: 3 })

      const lineH = doc.heightOfString(topic, { width: CONTENT_W - 18, lineGap: 3 })
      y += Math.max(16, lineH + 4)

      // Mid-module page break — keep at least 4 lines together where possible
      if (y > CONTENT_BOTTOM - 16) {
        doc.addPage()
        y = MARGIN_TOP
      }
    })

    // Spacer between modules
    if (idx < c.modules.length - 1) {
      y += 14
    }
  })
}

// =====================================================================
// FOOTERS — page number + small course title attribution
// =====================================================================

function stampFooters(doc: PDFKit.PDFDocument, c: CoursePdf) {
  const range = doc.bufferedPageRange()
  const total = range.count
  for (let i = 0; i < total; i++) {
    doc.switchToPage(range.start + i)
    const pageNum = i + 1

    // Hairline above footer
    doc.rect(MARGIN_X, PAGE_H - 50, CONTENT_W, 0.5).fill(RULE)

    // Left: course title (small, muted)
    doc.fillColor(MUTED).font('Helvetica').fontSize(9)
      .text(c.title, MARGIN_X, PAGE_H - 38, { width: CONTENT_W / 2 })

    // Right: page X of Y
    doc.fillColor(MUTED).font('Helvetica').fontSize(9)
      .text(`Page ${pageNum} of ${total}`, MARGIN_X, PAGE_H - 38, { width: CONTENT_W, align: 'right' })

    // Centered accent dot on first page only (tiny brand mark, optional)
    if (i === 0) {
      doc.circle(PAGE_W / 2, PAGE_H - 35, 1.5).fill(ACCENT)
    }
  }
}
