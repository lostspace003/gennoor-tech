/**
 * Build a per-course brochure PDF for an academy course.
 *
 * Format mirrors the existing Gennoor-Tech-Course-TOCs/* PDFs:
 *   Page 1 — themed cover (eyebrow · big title · subtitle · stats row)
 *   Page 2 — Course Overview · Who Is This For? · Learning Outcomes
 *   Page 3+ — Chapter-by-Chapter curriculum (bulleted)
 *
 * Pure pdfkit — no browser, no native deps beyond the existing package.json.
 */
import PDFDocument from 'pdfkit'
import fs from 'node:fs'
import path from 'node:path'

const BRAND_NAVY = '#0B1F3D'
const BRAND_ORANGE = '#F97316'
const BRAND_BLUE = '#2563EB'
const BRAND_LIGHT_BG = '#F8FAFC'
const TEXT_DARK = '#0F172A'
const TEXT_MUTED = '#64748B'
const RULE = '#E2E8F0'

const PAGE_W = 595.28 // A4 portrait
const PAGE_H = 841.89
const M = 56 // outer margin

function splitToBullets(text) {
  // Heuristic: split a longish description into 1-3 bullet items.
  // Accept "·" separator OR sentence boundary. Strip empty parts.
  if (!text) return []
  const byMid = text.split(/\s*·\s*/).map(s => s.trim()).filter(Boolean)
  if (byMid.length >= 2) return byMid
  return text
    .split(/(?<=[.!?])\s+(?=[A-Z"])/g)
    .map(s => s.trim())
    .filter(Boolean)
}

function whoIsThisFor(course) {
  // Derive from course id + title + tags.
  const id = course.id
  const title = course.title.toLowerCase()
  if (id.includes('strategy') || id.includes('c-suite')) return ['CEOs · CDOs · CIOs', 'Board directors', 'CFOs reviewing AI capital plans', 'Strategy + transformation leaders']
  if (id.includes('governance') || id.includes('risk')) return ['Board directors · audit committees', 'Risk officers · CISOs', 'General Counsels', 'AI governance leads']
  if (id.includes('finance') && id.includes('accounting')) return ['CFOs · controllers', 'FP&A heads', 'Audit partners', 'Finance transformation leads']
  if (id.includes('financial-services') || id.includes('bfsi')) return ['BFSI executives', 'Chief Risk Officers', 'General Counsels · Compliance', 'Heads of model risk']
  if (id.includes('hr') || id.includes('people')) return ['CHROs · CPOs', 'Talent acquisition leaders', 'HR operations', 'People + culture leads']
  if (id.includes('healthcare')) return ['Hospital executives · CMOs', 'CMIOs · healthcare CIOs', 'Clinical leaders', 'Payer leaders']
  if (id.includes('m365') || id.includes('copilot-adoption')) return ['CIOs · IT leaders', 'Change managers', 'Workplace technology heads', 'Adoption + enablement leads']
  if (id.includes('sales') || id.includes('marketing')) return ['CROs · CMOs', 'Revenue Operations heads', 'Sales + marketing leaders', 'Marketing technology leads']
  if (id.includes('customer-service') || id.includes('support')) return ['CX leaders', 'Customer service VPs', 'Support Operations heads', 'Contact centre leadership']
  if (id.includes('operations') || id.includes('supply-chain')) return ['COOs · CSCOs', 'Supply chain VPs', 'Procurement leaders', 'Operations + logistics heads']
  if (id.includes('manufacturing')) return ['Plant managers · VPs Manufacturing', 'Operations leadership', 'Process + quality engineers', 'IT/OT leaders']
  if (id.includes('legal')) return ['General Counsels · CLOs', 'Legal Operations leads', 'Compliance officers · DPOs', 'Privacy + risk teams']
  if (id.includes('demand-forecasting')) return ['CSCOs · S&OP heads', 'Demand planners', 'Supply chain analysts', 'Operations finance']
  if (id.includes('month-end-close')) return ['Controllers · Assistant Controllers', 'FP&A heads', 'CFOs', 'Accounting Operations leaders']
  if (id.includes('agents') || id.includes('copilot-studio')) return ['Power Platform builders', 'AI developers', 'Solution architects', 'L&D + internal trainers']
  if (id.includes('prompting')) return ['Power users + developers', 'AI engineering teams', 'Knowledge workers going deeper', 'Internal AI champions']
  if (id.includes('working-with-copilots')) return ['Professionals using M365 Copilot', 'GitHub Copilot users', 'ChatGPT Enterprise users', 'AI-adopting knowledge workers']
  if (id.includes('evaluating-ai-output')) return ['Professionals reviewing AI work', 'Editors + reviewers', 'Quality + compliance teams', 'AI-adopting knowledge workers']
  if (id.includes('literacy') || id.includes('non-technical')) return ['HR · Marketing · Sales · Ops', 'Non-technical professionals', 'L&D leaders', 'AI-curious managers']
  if (id.includes('recruiting')) return ['Recruiters', 'Talent Acquisition leaders', 'TA Operations', 'People + culture teams']
  if (id.includes('revops')) return ['RevOps leaders', 'Sales Operations', 'Marketing Operations', 'CRO offices']
  if (id.includes('foundations')) return ['Anyone starting their AI journey', 'Non-technical professionals', 'Managers + analysts', 'L&D teams']
  if (id.includes('generative-ai-for-business')) return ['Mid + senior managers', 'Business unit leaders', 'Function heads exploring AI', 'L&D + transformation teams']
  if (id.includes('ab-100')) return ['Solution architects', 'AI developers', 'Power Platform developers', 'L&D · internal trainers']
  if (id.includes('trusted-support-bots')) return ['CS leaders', 'Support Operations', 'CX Operations', 'Customer service tech leads']
  return ['Business + technology leaders', 'Function heads + transformation owners', 'L&D + internal trainers', 'AI-curious managers']
}

function ensureDir(p) {
  fs.mkdirSync(path.dirname(p), { recursive: true })
}

function drawPageFooter(doc, courseTitle, page) {
  const y = PAGE_H - 36
  doc.fillColor(TEXT_MUTED).fontSize(8).font('Helvetica')
  doc.text('© 2026 Gennoor Tech Private Limited', M, y, { lineBreak: false })
  doc.text('www.gennoor.com', M, y, { width: PAGE_W - 2 * M, align: 'center', lineBreak: false })
  doc.text(`Page ${page}`, M, y, { width: PAGE_W - 2 * M, align: 'right', lineBreak: false })
}

/**
 * Two-segment logo: "Gennoor" (dark) + "Tech" (dark) with the middle "oor"
 * coloured orange. Drawn as three separate Text strings at calculated x
 * positions — `continued: true` was duplicating the "oor" glyphs.
 */
function drawLogo(doc, x, y, fontSize = 10) {
  doc.font('Helvetica-Bold').fontSize(fontSize)
  // Measure each segment so they sit flush against each other.
  const part1 = 'Genn'
  const part2 = 'oor'
  const part3 = ' Tech'
  const w1 = doc.widthOfString(part1)
  const w2 = doc.widthOfString(part2)
  doc.fillColor(TEXT_DARK).text(part1, x, y, { lineBreak: false })
  doc.fillColor(BRAND_ORANGE).text(part2, x + w1, y, { lineBreak: false })
  doc.fillColor(TEXT_DARK).text(part3, x + w1 + w2, y, { lineBreak: false })
}

function drawHeader(doc, courseTitle, eyebrow) {
  const y = 36
  drawLogo(doc, M, y, 10)
  doc.fillColor(TEXT_MUTED).fontSize(9).font('Helvetica-Bold').text(eyebrow.toUpperCase(), M, y, { width: PAGE_W - 2 * M, align: 'right', characterSpacing: 1.2, lineBreak: false })
  doc.moveTo(M, y + 18).lineTo(PAGE_W - M, y + 18).strokeColor(RULE).lineWidth(0.5).stroke()
}

function drawSectionTitle(doc, text, accentWord) {
  const y = doc.y
  if (accentWord) {
    doc.font('Helvetica-Bold').fontSize(20).fillColor(TEXT_DARK)
    doc.text(text + ' ', M, y, { continued: true, lineBreak: false })
    doc.fillColor(BRAND_BLUE).text(accentWord, { lineBreak: true })
  } else {
    doc.font('Helvetica-Bold').fontSize(20).fillColor(TEXT_DARK).text(text)
  }
  doc.moveDown(0.4)
}

/**
 * White logo variant for the navy cover. Same 3-segment layout as drawLogo
 * but with white "Genn" + "Tech" and the accent colour for the middle "oor".
 */
function drawLogoWhite(doc, x, y, fontSize, accent) {
  doc.font('Helvetica-Bold').fontSize(fontSize)
  const w1 = doc.widthOfString('Genn')
  const w2 = doc.widthOfString('oor')
  doc.fillColor('#FFFFFF').text('Genn', x, y, { lineBreak: false })
  doc.fillColor(accent).text('oor', x + w1, y, { lineBreak: false })
  doc.fillColor('#FFFFFF').text(' Tech', x + w1 + w2, y, { lineBreak: false })
}

function drawCoverPage(doc, course) {
  const theme = course.theme
  const accent = theme?.accent || BRAND_ORANGE
  const navy = theme?.navy || BRAND_NAVY
  const deep = theme?.primaryDeep || '#1E3A8A'

  // Solid navy background (no overlay rectangles or circles — those caused the grey blob)
  doc.rect(0, 0, PAGE_W, PAGE_H).fill(navy)

  // Subtle accent bar across the top
  doc.rect(0, 0, PAGE_W, 6).fill(accent)

  // ── Centered logo lockup ─────────────────────────────────────────
  const logoFont = 22
  doc.font('Helvetica-Bold').fontSize(logoFont)
  const totalLogoW = doc.widthOfString('Gennoor Tech')
  const logoX = (PAGE_W - totalLogoW) / 2
  drawLogoWhite(doc, logoX, 230, logoFont, accent)

  doc.fillColor('#FFFFFF').fillOpacity(0.65).fontSize(8).font('Helvetica-Bold')
    .text('TRAIN. INNOVATE. BUILD.', 0, 230 + logoFont + 8, { width: PAGE_W, align: 'center', characterSpacing: 2.5, lineBreak: false })
  doc.fillOpacity(1)

  // ── Eyebrow pill ─────────────────────────────────────────────────
  const pillText = `GENNOOR ACADEMY · SELF-PACED · ${course.duration.toUpperCase().replace(/^~/, '')}`
  doc.font('Helvetica-Bold').fontSize(8)
  const pillTextW = doc.widthOfString(pillText)
  const pillW = pillTextW + 36
  const pillX = (PAGE_W - pillW) / 2
  const pillY = 305
  doc.roundedRect(pillX, pillY, pillW, 24, 12).strokeColor(accent).lineWidth(1).stroke()
  doc.fillColor('#FFFFFF').text(pillText, pillX, pillY + 8, { width: pillW, align: 'center', characterSpacing: 1.5, lineBreak: false })

  // ── Title ────────────────────────────────────────────────────────
  // Choose font size based on title length to avoid awkward wrapping
  const titleFontSize = course.title.length > 32 ? 26 : course.title.length > 20 ? 30 : 36
  doc.fillColor(accent).font('Helvetica-Bold').fontSize(titleFontSize)
    .text(course.title, M, 360, { width: PAGE_W - 2 * M, align: 'center' })

  // ── Subtitle (use shorter `description` field, not the long longDescription) ──
  doc.fillColor('#FFFFFF').fillOpacity(0.82).font('Helvetica').fontSize(11)
    .text(course.description, M + 20, doc.y + 12, { width: PAGE_W - 2 * (M + 20), align: 'center', lineGap: 2 })
  doc.fillOpacity(1)

  // ── Accent rule ─────────────────────────────────────────────────
  const lineY = doc.y + 18
  doc.moveTo(PAGE_W / 2 - 24, lineY).lineTo(PAGE_W / 2 + 24, lineY).strokeColor(accent).lineWidth(2).stroke()

  // ── Stats row (4 columns, compact labels so nothing wraps) ──────
  const statsY = lineY + 40
  const totalChapters = course.chapters.filter(c => !c.isMockExam && c.id !== 'chapter-00').length
  const durationCompact = course.duration.replace(/^~/, '').replace(/\s+min$/i, ' min')
  const levelCompact = course.level.length > 12 ? course.level.slice(0, 10) + '…' : course.level
  const stats = [
    { value: String(totalChapters), label: 'CHAPTERS' },
    { value: durationCompact, label: 'DURATION' },
    { value: levelCompact, label: 'LEVEL' },
    { value: 'FREE', label: 'CERTIFICATE' },
  ]
  const statW = (PAGE_W - 2 * M) / stats.length
  stats.forEach((s, i) => {
    const x = M + i * statW
    // Pick a font size that fits the value within the column
    let valSize = 18
    while (valSize > 9) {
      doc.font('Helvetica-Bold').fontSize(valSize)
      if (doc.widthOfString(s.value) <= statW - 8) break
      valSize -= 1
    }
    doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(valSize)
      .text(s.value, x, statsY, { width: statW, align: 'center', lineBreak: false })
    doc.fillColor('#FFFFFF').fillOpacity(0.6).font('Helvetica-Bold').fontSize(8)
      .text(s.label, x, statsY + 28, { width: statW, align: 'center', characterSpacing: 1.5, lineBreak: false })
    doc.fillOpacity(1)
  })

  // ── Footer URL ──────────────────────────────────────────────────
  doc.fillColor('#FFFFFF').fillOpacity(0.55).font('Helvetica').fontSize(8)
    .text('www.gennoor.com · enquiry@gennoor.com', 0, PAGE_H - 60, { width: PAGE_W, align: 'center' })
  doc.fillOpacity(1)
}

function drawOverviewPage(doc, course, page) {
  drawHeader(doc, course.title, course.title)
  doc.y = 86

  // Course Overview
  drawSectionTitle(doc, 'Course', 'Overview')

  const longParas = course.longDescription
    .split(/(?<=[.!?])\s+(?=[A-Z"])/g)
    .map(s => s.trim())
    .filter(Boolean)
  const groupSize = 3
  const grouped = []
  for (let i = 0; i < longParas.length; i += groupSize) grouped.push(longParas.slice(i, i + groupSize).join(' '))
  const firstPara = grouped[0] || course.description

  doc.fillColor(TEXT_DARK).font('Helvetica').fontSize(10).text(firstPara, M, doc.y, { width: PAGE_W - 2 * M, lineGap: 3, align: 'justify' })
  doc.moveDown(0.6)

  // Eyebrow callout (prerequisites-equivalent)
  const calloutW = PAGE_W - 2 * M
  const calloutY = doc.y
  doc.roundedRect(M, calloutY, calloutW, 30, 4).fillOpacity(0.6).fill(BRAND_LIGHT_BG)
  doc.fillOpacity(1).fillColor(BRAND_BLUE).font('Helvetica-Bold').fontSize(9).text('FORMAT:', M + 12, calloutY + 10, { continued: true, lineBreak: false })
  doc.fillColor(TEXT_DARK).font('Helvetica').text(` Self-paced · 8 chapters · audio-narrated slides · interactive end-of-course builder · free certificate on completion`, { lineBreak: false })
  doc.y = calloutY + 42

  // Who Is This For?
  drawSectionTitle(doc, 'Who Is', 'This For?')
  const personas = whoIsThisFor(course)
  const cardW = (PAGE_W - 2 * M - 12 * 3) / 4
  const cardH = 64
  const cardY = doc.y
  personas.slice(0, 4).forEach((p, i) => {
    const x = M + i * (cardW + 12)
    doc.roundedRect(x, cardY, cardW, cardH, 6).fillOpacity(0.55).fill(BRAND_LIGHT_BG)
    doc.fillOpacity(1)
    // Numbered chip instead of glyph (renders consistently in pdfkit Helvetica)
    const chipR = 9
    const chipX = x + cardW / 2 - chipR
    doc.circle(x + cardW / 2, cardY + 16, chipR).fill(BRAND_BLUE)
    doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(10)
      .text(String(i + 1), chipX, cardY + 11, { width: chipR * 2, align: 'center', lineBreak: false })
    doc.fillColor(TEXT_DARK).font('Helvetica-Bold').fontSize(8.5)
      .text(p, x + 6, cardY + 34, { width: cardW - 12, align: 'center', lineGap: 1 })
  })
  doc.y = cardY + cardH + 20

  // Learning Outcomes
  drawSectionTitle(doc, 'Learning', 'Outcomes')
  const outcomes = (course.learningOutcomes || []).slice(0, 8)
  outcomes.forEach((o, i) => {
    const lineY = doc.y
    // Numbered chip
    doc.circle(M + 9, lineY + 7, 9).fill(BRAND_BLUE)
    doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(9).text(String(i + 1), M, lineY + 3, { width: 18, align: 'center', lineBreak: false })
    // Outcome text
    doc.fillColor(TEXT_DARK).font('Helvetica').fontSize(9.5).text(o, M + 26, lineY + 2, { width: PAGE_W - 2 * M - 26, lineGap: 2 })
    doc.moveDown(0.35)
  })

  drawPageFooter(doc, course.title, page)
}

function drawCurriculumPages(doc, course, startPage) {
  const realChapters = course.chapters.filter(c => !c.isMockExam && c.id !== 'chapter-00')
  let page = startPage
  doc.addPage()
  drawHeader(doc, course.title, 'Course Curriculum')
  doc.y = 86
  drawSectionTitle(doc, `${realChapters.length}-Chapter`, 'Curriculum')

  doc.fillColor(TEXT_MUTED).font('Helvetica').fontSize(10).text(
    'Self-paced, audio-narrated slide format. Each chapter ends with a "Monday move" the learner can apply that week.',
    M, doc.y, { width: PAGE_W - 2 * M, lineGap: 2 },
  )
  doc.moveDown(1.0)

  const palette = ['#2563EB', '#F59E0B', '#10B981', '#F97316', '#8B5CF6', '#06B6D4', '#EF4444', '#84CC16']

  realChapters.forEach((ch, idx) => {
    // Page break if we're running low
    if (doc.y > PAGE_H - 160) {
      drawPageFooter(doc, course.title, page)
      page++
      doc.addPage()
      drawHeader(doc, course.title, 'Course Curriculum')
      doc.y = 86
    }
    const numColor = palette[idx % palette.length]
    const blockY = doc.y
    const num = String(ch.number).padStart(2, '0')

    // Numbered badge
    doc.roundedRect(M, blockY, 36, 36, 6).fill(numColor)
    doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(15).text(num, M, blockY + 9, { width: 36, align: 'center', lineBreak: false })

    // Title + eyebrow
    doc.fillColor(TEXT_DARK).font('Helvetica-Bold').fontSize(13).text(ch.title, M + 48, blockY + 2, { width: PAGE_W - 2 * M - 48, lineGap: 0 })
    doc.fillColor(TEXT_MUTED).font('Helvetica-Bold').fontSize(8).text(
      `CHAPTER ${ch.number} · ${ch.estimatedMinutes || 5} MIN · NARRATED + INTERACTIVE`,
      M + 48, doc.y + 1, { characterSpacing: 0.8, width: PAGE_W - 2 * M - 48 },
    )

    // Bulleted highlights from description
    const bullets = splitToBullets(ch.description).slice(0, 6)
    doc.y = Math.max(doc.y, blockY + 42)
    bullets.forEach(b => {
      const y0 = doc.y
      doc.fillColor(numColor).font('Helvetica-Bold').fontSize(10).text('•', M + 48, y0, { lineBreak: false })
      doc.fillColor(TEXT_DARK).font('Helvetica').fontSize(9).text(b, M + 60, y0 + 1, { width: PAGE_W - 2 * M - 60, lineGap: 2 })
    })
    doc.moveDown(0.8)
  })

  drawPageFooter(doc, course.title, page)
}

/**
 * @param {object} course — a Course config object (see src/config/courses.ts)
 * @param {string} outPath — where to write the PDF
 */
export async function buildCoursePdf(course, outPath) {
  ensureDir(outPath)
  return await new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      layout: 'portrait',
      margin: 0,
      info: {
        Title: `${course.title} — Gennoor Academy Course Brochure`,
        Author: 'Gennoor Tech',
        Subject: course.title,
        Keywords: `gennoor academy, ${course.id}, ${course.tags?.join(', ') || ''}`,
      },
    })
    const stream = fs.createWriteStream(outPath)
    doc.pipe(stream)

    // Cover (page 1)
    drawCoverPage(doc, course)

    // Overview (page 2)
    doc.addPage()
    drawOverviewPage(doc, course, 2)

    // Curriculum (page 3+)
    drawCurriculumPages(doc, course, 3)

    doc.end()
    stream.on('finish', () => resolve(outPath))
    stream.on('error', reject)
  })
}
