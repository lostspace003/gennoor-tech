/**
 * Course catalog PDF generator.
 *
 * Layout per docs/transformation/05-courses-plan.md:
 *   - Cover (logo + title + subtitle + track + audience + duration + tagline)
 *   - Inside front cover (About + Gennoor Way mini diagram + How to use)
 *   - Outcomes page
 *   - Requirements page (if requirements text present)
 *   - Table of contents
 *   - Module detail pages (one per module, with enablement sidebar at end)
 *   - Back cover (Next steps + contact)
 *
 * Pure pdfkit. No browser. Embeds existing public/ logo PNGs.
 */

import PDFDocument from 'pdfkit'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { CoursePdf } from '../data/course-pdfs.ts'

// Brand palette
const NAVY = '#0C1426'
const PRIMARY = '#2563EB'
const PRIMARY_DEEP = '#1D4ED8'
const AMBER = '#F59E0B'
const AMBER_LIGHT = '#FCD34D'
const CREAM = '#FFF8F0'
const TEXT = '#1B2845'
const MUTED = '#5C6784'
const RULE = '#e6dfd4'

// A4 portrait dimensions (points)
const PAGE_W = 595
const PAGE_H = 842
const MARGIN_X = 50
const CONTENT_W = PAGE_W - MARGIN_X * 2

// Public assets we embed
const ASSETS_DIR = (() => {
  // Resolve from src/lib/ → ../../public
  const here = path.dirname(fileURLToPath(import.meta.url))
  return path.resolve(here, '..', '..', 'public')
})()

const LOGO_HORIZONTAL = path.join(ASSETS_DIR, 'gennoor-tech-horizontal-dark_760x260_website-header.png')
const LOGO_WHITE = path.join(ASSETS_DIR, 'gennoor-tech-horizontal-white_760x260_website-header.png')
const LOGO_ICON = path.join(ASSETS_DIR, 'gennoor-tech-icon-dark_128x128_icon-small.png')

export async function generateCoursePdf(course: CoursePdf): Promise<Buffer> {
  const doc = new PDFDocument({
    size: 'A4',
    layout: 'portrait',
    margin: 0,
    info: {
      Title: course.title,
      Author: 'Gennoor Tech',
      Subject: `${course.trackLabel} — ${course.subtitle}`,
      Keywords: `gennoor academy, ${course.track}, ${course.slug}`,
    },
  })

  const chunks: Buffer[] = []
  doc.on('data', chunk => chunks.push(chunk as Buffer))

  return new Promise<Buffer>((resolve, reject) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    drawCover(doc, course)
    doc.addPage()
    drawInsideFront(doc, course)
    doc.addPage()
    drawOutcomes(doc, course)
    if (course.requirements) {
      doc.addPage()
      drawRequirements(doc, course)
    }
    doc.addPage()
    drawTableOfContents(doc, course)

    // One page per module
    for (const mod of course.modules) {
      doc.addPage()
      drawModule(doc, course, mod)
    }

    doc.addPage()
    drawBackCover(doc, course)

    doc.end()
  })
}

// =====================================================================
// PAGE DRAWERS
// =====================================================================

function drawCover(doc: PDFKit.PDFDocument, c: CoursePdf) {
  // Background — clean white with navy header band
  doc.rect(0, 0, PAGE_W, PAGE_H).fill('#FFFFFF')
  doc.rect(0, 0, PAGE_W, 260).fill(NAVY)
  doc.rect(0, 254, PAGE_W, 6).fill(AMBER)

  // Logo (white horizontal) on the navy band
  try {
    doc.image(LOGO_WHITE, MARGIN_X, 40, { width: 200 })
  } catch {
    doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(20).text('GENNOOR TECH', MARGIN_X, 50)
  }

  // Track label top-right
  doc.fillColor(AMBER_LIGHT).font('Helvetica-Bold').fontSize(10)
    .text(c.trackLabel.toUpperCase(), MARGIN_X, 50, { width: CONTENT_W, align: 'right', characterSpacing: 2 })

  // Tagline bottom-right of the band
  doc.fillColor('#FFFFFFAA').font('Helvetica-Oblique').fontSize(10)
    .text('train. innovate. build.', MARGIN_X, 220, { width: CONTENT_W, align: 'right' })

  // Main title block — sits below the band
  const titleY = 320
  doc.fillColor(MUTED).font('Helvetica-Bold').fontSize(10)
    .text('GENNOOR ACADEMY · COURSE BRIEF', MARGIN_X, titleY, { characterSpacing: 2 })

  doc.fillColor(TEXT).font('Helvetica-Bold').fontSize(28)
    .text(c.title, MARGIN_X, titleY + 22, { width: CONTENT_W, lineGap: 4 })

  // Underline accent
  doc.rect(MARGIN_X, titleY + 22 + doc.heightOfString(c.title, { width: CONTENT_W }) + 10, 60, 3).fill(AMBER)

  // Subtitle
  const subtitleY = titleY + 22 + doc.heightOfString(c.title, { width: CONTENT_W }) + 28
  doc.fillColor(MUTED).font('Helvetica').fontSize(13)
    .text(c.subtitle, MARGIN_X, subtitleY, { width: CONTENT_W, lineGap: 2 })

  // Meta block (bottom)
  const metaY = PAGE_H - 200
  doc.rect(MARGIN_X, metaY, CONTENT_W, 110).fill(CREAM)
  doc.rect(MARGIN_X, metaY, 4, 110).fill(AMBER)

  const metaInnerX = MARGIN_X + 16
  doc.fillColor(MUTED).font('Helvetica-Bold').fontSize(8).text('AUDIENCE', metaInnerX, metaY + 14, { characterSpacing: 1.5 })
  doc.fillColor(TEXT).font('Helvetica').fontSize(10).text(c.audience, metaInnerX, metaY + 26, { width: CONTENT_W - 32 })

  doc.fillColor(MUTED).font('Helvetica-Bold').fontSize(8).text('READ TIME', metaInnerX, metaY + 64, { characterSpacing: 1.5 })
  doc.fillColor(TEXT).font('Helvetica').fontSize(10).text(c.duration, metaInnerX, metaY + 76)

  doc.fillColor(MUTED).font('Helvetica-Bold').fontSize(8).text('PAGES', metaInnerX + 230, metaY + 64, { characterSpacing: 1.5 })
  doc.fillColor(TEXT).font('Helvetica').fontSize(10).text(`~${c.pages}`, metaInnerX + 230, metaY + 76)

  // Bottom-line
  doc.fillColor(MUTED).font('Helvetica').fontSize(8)
    .text('gennoor.com  ·  train. innovate. build.', MARGIN_X, PAGE_H - 40, { width: CONTENT_W, align: 'center', characterSpacing: 1 })
}

function drawInsideFront(doc: PDFKit.PDFDocument, _c: CoursePdf) {
  doc.rect(0, 0, PAGE_W, PAGE_H).fill('#FFFFFF')

  drawPageHeader(doc, 'About this course')

  let y = 110
  doc.fillColor(TEXT).font('Helvetica').fontSize(11).text(
    'This is one of 20+ branded course briefs in the Gennoor Academy catalog. ' +
    'Each brief is designed to give you the operating shape of the course — outcomes, audience, ' +
    'modules, and what changes in your organisation after reading it.',
    MARGIN_X, y, { width: CONTENT_W, lineGap: 4 },
  )
  y += 90

  // About Gennoor
  doc.fillColor(TEXT).font('Helvetica-Bold').fontSize(13).text('About Gennoor Tech', MARGIN_X, y)
  y += 22
  doc.fillColor(MUTED).font('Helvetica').fontSize(10).text(
    'We are an Enterprise AI Transformation Partner serving enterprises and SMBs across GCC, ' +
    'Africa, and South Asia. We run the full journey from readiness diagnostic to deployed agents ' +
    'to long-term sustainment — with senior, Microsoft-certified expertise at boutique speed and price.',
    MARGIN_X, y, { width: CONTENT_W, lineGap: 4 },
  )
  y += 70

  // Gennoor Way mini-diagram
  doc.fillColor(TEXT).font('Helvetica-Bold').fontSize(13).text('The Gennoor Way — five phases', MARGIN_X, y)
  y += 22

  const phases = ['Diagnose', 'Train', 'Innovate', 'Build', 'Sustain']
  const phaseW = (CONTENT_W - (phases.length - 1) * 10) / phases.length
  const phaseH = 50
  phases.forEach((phase, i) => {
    const x = MARGIN_X + i * (phaseW + 10)
    const isTrain = phase === 'Train'
    doc.rect(x, y, phaseW, phaseH).fill(isTrain ? PRIMARY : '#F3F4F6')
    doc.fillColor(isTrain ? '#FFFFFF' : MUTED).font('Helvetica-Bold').fontSize(9)
      .text(`PHASE ${i + 1}`, x + 8, y + 10, { characterSpacing: 1 })
    doc.fillColor(isTrain ? '#FFFFFF' : TEXT).font('Helvetica-Bold').fontSize(12)
      .text(phase, x + 8, y + 26)
  })
  y += phaseH + 12
  doc.fillColor(MUTED).font('Helvetica-Oblique').fontSize(9).text(
    'This course brief sits inside Phase 2 — Train. The enablement sidebar at the end of every ' +
    'module shows what comes next: Phase 3 (Innovate) is a 4-week pilot on your data.',
    MARGIN_X, y, { width: CONTENT_W, lineGap: 3 },
  )
  y += 50

  // How to use
  doc.fillColor(TEXT).font('Helvetica-Bold').fontSize(13).text('How to use this brief', MARGIN_X, y)
  y += 22
  const usePoints = [
    'Read it cover-to-cover in 20 minutes, or skim the table of contents to pick the relevant modules.',
    'Each module ends with a one-paragraph Enablement Sidebar — the bridge from learning to applying.',
    'Use the brief to align your leadership team before scoping a pilot. The shared vocabulary is the win.',
    'Share with HR / L&D — every course in the catalog has a paired interactive version on /ai-academy.',
  ]
  usePoints.forEach((p, i) => {
    doc.fillColor(AMBER).font('Helvetica-Bold').fontSize(10).text(`${i + 1}.`, MARGIN_X, y)
    doc.fillColor(MUTED).font('Helvetica').fontSize(10).text(p, MARGIN_X + 20, y, { width: CONTENT_W - 20, lineGap: 3 })
    y += Math.max(20, doc.heightOfString(p, { width: CONTENT_W - 20, lineGap: 3 }) + 10)
  })

  drawPageFooter(doc, 'About this course')
}

function drawOutcomes(doc: PDFKit.PDFDocument, c: CoursePdf) {
  doc.rect(0, 0, PAGE_W, PAGE_H).fill('#FFFFFF')
  drawPageHeader(doc, 'What you will learn')

  let y = 110
  doc.fillColor(TEXT).font('Helvetica-Bold').fontSize(20).text('Course outcomes', MARGIN_X, y)
  y += 30
  doc.fillColor(MUTED).font('Helvetica').fontSize(11).text(
    'By the end of this course you will be able to:',
    MARGIN_X, y, { width: CONTENT_W },
  )
  y += 26

  c.outcomes.forEach((outcome, i) => {
    // Number circle
    doc.circle(MARGIN_X + 12, y + 10, 12).fill(PRIMARY)
    doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(10)
      .text(String(i + 1), MARGIN_X + 6, y + 5, { width: 12, align: 'center' })

    doc.fillColor(TEXT).font('Helvetica').fontSize(11)
      .text(outcome, MARGIN_X + 32, y + 4, { width: CONTENT_W - 32, lineGap: 3 })
    const h = doc.heightOfString(outcome, { width: CONTENT_W - 32, lineGap: 3 })
    y += Math.max(36, h + 18)
  })

  drawPageFooter(doc, 'Course outcomes')
}

function drawRequirements(doc: PDFKit.PDFDocument, c: CoursePdf) {
  doc.rect(0, 0, PAGE_W, PAGE_H).fill('#FFFFFF')
  drawPageHeader(doc, 'Before you begin')

  let y = 110
  doc.fillColor(TEXT).font('Helvetica-Bold').fontSize(20).text('Requirements', MARGIN_X, y)
  y += 30

  doc.rect(MARGIN_X, y, CONTENT_W, 4).fill(AMBER)
  y += 20

  doc.fillColor(TEXT).font('Helvetica').fontSize(11)
    .text(c.requirements!, MARGIN_X, y, { width: CONTENT_W, lineGap: 4 })

  drawPageFooter(doc, 'Requirements')
}

function drawTableOfContents(doc: PDFKit.PDFDocument, c: CoursePdf) {
  doc.rect(0, 0, PAGE_W, PAGE_H).fill('#FFFFFF')
  drawPageHeader(doc, 'Table of contents')

  let y = 110
  doc.fillColor(TEXT).font('Helvetica-Bold').fontSize(20).text('Modules', MARGIN_X, y)
  y += 30
  doc.fillColor(MUTED).font('Helvetica').fontSize(10).text(
    `${c.modules.length} modules — each with key topics + a one-paragraph enablement bridge to the 4-week pilot.`,
    MARGIN_X, y, { width: CONTENT_W },
  )
  y += 30

  c.modules.forEach((mod) => {
    // Module number block
    doc.rect(MARGIN_X, y, 38, 28).fill(NAVY)
    doc.fillColor(AMBER).font('Helvetica-Bold').fontSize(10)
      .text(mod.number, MARGIN_X, y + 9, { width: 38, align: 'center' })

    doc.fillColor(TEXT).font('Helvetica-Bold').fontSize(12)
      .text(mod.title, MARGIN_X + 50, y + 4, { width: CONTENT_W - 50, lineGap: 2 })

    // Topic count line
    doc.fillColor(MUTED).font('Helvetica').fontSize(9)
      .text(`${mod.topics.length} topic${mod.topics.length !== 1 ? 's' : ''}`, MARGIN_X + 50, y + 19, { width: CONTENT_W - 50 })

    y += 38

    // Add page if running off page
    if (y > PAGE_H - 100) {
      drawPageFooter(doc, 'Table of contents')
      doc.addPage()
      doc.rect(0, 0, PAGE_W, PAGE_H).fill('#FFFFFF')
      drawPageHeader(doc, 'Table of contents (continued)')
      y = 110
    }
  })

  drawPageFooter(doc, 'Table of contents')
}

function drawModule(doc: PDFKit.PDFDocument, c: CoursePdf, mod: CoursePdf['modules'][number]) {
  doc.rect(0, 0, PAGE_W, PAGE_H).fill('#FFFFFF')
  drawPageHeader(doc, `Module ${mod.number} · ${c.trackLabel}`)

  let y = 110

  // Module number eyebrow
  doc.fillColor(AMBER).font('Helvetica-Bold').fontSize(10)
    .text(`MODULE ${mod.number}`, MARGIN_X, y, { characterSpacing: 2 })
  y += 18

  // Module title
  doc.fillColor(TEXT).font('Helvetica-Bold').fontSize(22)
    .text(mod.title, MARGIN_X, y, { width: CONTENT_W, lineGap: 3 })
  y += doc.heightOfString(mod.title, { width: CONTENT_W, lineGap: 3 }) + 10

  // Accent underline
  doc.rect(MARGIN_X, y, 50, 3).fill(PRIMARY)
  y += 25

  // Topics list
  doc.fillColor(MUTED).font('Helvetica-Bold').fontSize(9)
    .text('TOPICS COVERED', MARGIN_X, y, { characterSpacing: 1.5 })
  y += 16

  mod.topics.forEach(topic => {
    // bullet
    doc.circle(MARGIN_X + 4, y + 6, 2.5).fill(AMBER)
    doc.fillColor(TEXT).font('Helvetica').fontSize(11)
      .text(topic, MARGIN_X + 16, y, { width: CONTENT_W - 16, lineGap: 3 })
    const h = doc.heightOfString(topic, { width: CONTENT_W - 16, lineGap: 3 })
    y += Math.max(18, h + 6)
  })

  // ENABLEMENT SIDEBAR — always at the bottom of each module page
  const sidebarH = 180
  const sidebarY = PAGE_H - sidebarH - 60
  drawEnablementSidebar(doc, c, MARGIN_X, sidebarY, CONTENT_W, sidebarH)

  drawPageFooter(doc, mod.title)
}

function drawEnablementSidebar(
  doc: PDFKit.PDFDocument,
  c: CoursePdf,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  // Gradient-like fill: cream base with amber left bar
  doc.rect(x, y, w, h).fill(CREAM)
  doc.rect(x, y, 4, h).fill(AMBER)

  const innerX = x + 18
  const innerW = w - 36

  // Eyebrow
  doc.fillColor(AMBER).font('Helvetica-Bold').fontSize(9)
    .text('ENABLEMENT SIDEBAR — WHAT CHANGES IN YOUR ORGANISATION', innerX, y + 16, { characterSpacing: 1.5, width: innerW })

  // Title
  doc.fillColor(TEXT).font('Helvetica-Bold').fontSize(13)
    .text('Reading this is step one. The next step is applying it.', innerX, y + 36, { width: innerW, lineGap: 2 })

  // Body
  doc.fillColor(MUTED).font('Helvetica').fontSize(9.5)
    .text(c.enablementNote, innerX, y + 70, { width: innerW, lineGap: 3 })

  // Bottom strip — price + timeline + CTA hint
  const bottomY = y + h - 38
  doc.fillColor(MUTED).font('Helvetica-Bold').fontSize(8)
    .text('TYPICAL COST', innerX, bottomY, { characterSpacing: 1.2 })
  doc.fillColor(TEXT).font('Helvetica').fontSize(9)
    .text(c.pilotPriceBand || '$12k–30k SMB · $40k–120k Enterprise', innerX, bottomY + 11, { width: 200 })

  doc.fillColor(MUTED).font('Helvetica-Bold').fontSize(8)
    .text('TIMELINE', innerX + 220, bottomY, { characterSpacing: 1.2 })
  doc.fillColor(TEXT).font('Helvetica').fontSize(9)
    .text(c.pilotTimeline || '4 weeks, fixed scope', innerX + 220, bottomY + 11, { width: 180 })

  // CTA hint
  doc.fillColor(PRIMARY).font('Helvetica-Bold').fontSize(9)
    .text('Book a 30-min pilot scoping call →  gennoor.com/contact', innerX, bottomY + 28, { width: innerW })
}

function drawBackCover(doc: PDFKit.PDFDocument, c: CoursePdf) {
  // Top half — navy with logo
  doc.rect(0, 0, PAGE_W, 320).fill(NAVY)
  doc.rect(0, 314, PAGE_W, 6).fill(AMBER)

  try {
    doc.image(LOGO_WHITE, MARGIN_X, 50, { width: 200 })
  } catch {
    doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(20).text('GENNOOR TECH', MARGIN_X, 60)
  }

  doc.fillColor('#FFFFFFCC').font('Helvetica').fontSize(11)
    .text(`You've finished the course brief. Three ways forward.`, MARGIN_X, 150, { width: CONTENT_W })

  doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(24)
    .text('Next steps', MARGIN_X, 175, { width: CONTENT_W })

  // Three next-step cards
  doc.rect(0, 320, PAGE_W, PAGE_H - 320).fill('#FFFFFF')

  const steps = [
    {
      title: 'Apply this in your company',
      body: 'Scope a 4-week pilot on your data with our senior team. ' + c.enablementNote,
      cta: 'Book a 30-min pilot scoping call',
    },
    {
      title: 'Take this course as a team',
      body: 'Workshop with up to 25 people · 1–2 days on-site or virtual · customised to your industry and tools.',
      cta: 'Request a team workshop quote',
    },
    {
      title: 'Go deeper — bootcamp',
      body: 'Multi-day intensive bootcamp with hands-on labs on your live environment. Builder + Function tracks.',
      cta: 'See bootcamp calendar',
    },
  ]

  let y = 350
  steps.forEach((step, i) => {
    doc.rect(MARGIN_X, y, CONTENT_W, 110).fill('#FFFFFF')
    doc.rect(MARGIN_X, y, CONTENT_W, 110).stroke(RULE)
    doc.rect(MARGIN_X, y, 4, 110).fill(i === 0 ? PRIMARY : i === 1 ? AMBER : NAVY)

    doc.fillColor(MUTED).font('Helvetica-Bold').fontSize(8)
      .text(`OPTION ${i + 1}`, MARGIN_X + 16, y + 12, { characterSpacing: 1.5 })

    doc.fillColor(TEXT).font('Helvetica-Bold').fontSize(13)
      .text(step.title, MARGIN_X + 16, y + 26, { width: CONTENT_W - 32 })

    doc.fillColor(MUTED).font('Helvetica').fontSize(9.5)
      .text(step.body, MARGIN_X + 16, y + 50, { width: CONTENT_W - 32, lineGap: 2 })

    doc.fillColor(PRIMARY).font('Helvetica-Bold').fontSize(9)
      .text(`${step.cta} →  gennoor.com/contact`, MARGIN_X + 16, y + 90, { width: CONTENT_W - 32 })

    y += 120
  })

  // Bottom — contact + tagline
  doc.fillColor(MUTED).font('Helvetica').fontSize(8)
    .text('gennoor.com  ·  hello@gennoor.com  ·  GCC · Africa · South Asia', MARGIN_X, PAGE_H - 50, { width: CONTENT_W, align: 'center' })
  doc.fillColor(AMBER).font('Helvetica-Bold').fontSize(9)
    .text('train. innovate. build.', MARGIN_X, PAGE_H - 36, { width: CONTENT_W, align: 'center', characterSpacing: 2 })
}

// =====================================================================
// PAGE CHROME
// =====================================================================

function drawPageHeader(doc: PDFKit.PDFDocument, label: string) {
  // Top hairline + icon + label
  doc.rect(0, 50, PAGE_W, 1).fill(RULE)
  try {
    doc.image(LOGO_ICON, MARGIN_X, 24, { width: 18 })
  } catch {
    // ignore
  }
  doc.fillColor(MUTED).font('Helvetica-Bold').fontSize(8)
    .text('GENNOOR ACADEMY', MARGIN_X + 28, 30, { characterSpacing: 2 })
  doc.fillColor(MUTED).font('Helvetica').fontSize(8)
    .text(label, MARGIN_X, 30, { width: CONTENT_W, align: 'right' })
}

function drawPageFooter(doc: PDFKit.PDFDocument, sectionLabel: string) {
  doc.rect(0, PAGE_H - 40, PAGE_W, 1).fill(RULE)
  doc.fillColor(MUTED).font('Helvetica').fontSize(8)
    .text('gennoor.com · train. innovate. build.', MARGIN_X, PAGE_H - 28, { width: 300 })
  doc.fillColor(MUTED).font('Helvetica').fontSize(8)
    .text(sectionLabel, MARGIN_X, PAGE_H - 28, { width: CONTENT_W, align: 'right' })
}
