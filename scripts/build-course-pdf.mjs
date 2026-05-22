/**
 * Build a per-course detailed-TOC PDF for an academy course.
 *
 * Format inspired by docs/5-Claude Code for Developers.docx — substantive
 * enough that a company can hand it to executives or L&D and decide to take
 * this from us as a paid engagement.
 *
 *   Page 1     — themed cover (eyebrow · big title · subtitle · stats row)
 *   Page 2     — Course Brief (Duration · Format · Audience · Prerequisites · Course Outcomes)
 *   Page 3+    — Table of Content (8 modules with detailed 4-6 bullets each)
 *   Final page — Taking This Further (engagement options + contact CTA)
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
const BODY_W = PAGE_W - 2 * M

/* ────────────────────────────────────────────────────────────────────────
 * Content helpers — derive Requirements / Outcomes / Bullets from course
 * ──────────────────────────────────────────────────────────────────────── */

function splitToBullets(text) {
  if (!text) return []
  // Primary: split on the · delimiter the academy uses throughout.
  const byMid = text.split(/\s*·\s*/).map(s => s.trim()).filter(Boolean)
  if (byMid.length >= 2) return byMid
  // Fallback: split into sentences.
  return text
    .split(/(?<=[.!?])\s+(?=[A-Z"])/g)
    .map(s => s.trim())
    .filter(Boolean)
}

// Extract additional bullets from the built chapter HTML when the
// description is too thin. Reads `tmp/academy-build/<id>/chapters/<slug>.html`
// and pulls out the per-slide `<div class="eyebrow">` lines, which the
// chapter author wrote as topic labels. Returns [] if the HTML isn't found.
function extractBulletsFromChapterHtml(courseId, chapter) {
  const fname = `${chapter.slug || chapter.id}.html`
  const candidates = [
    path.resolve(process.cwd(), 'tmp', 'academy-build', courseId, 'chapters', fname),
  ]
  for (const p of candidates) {
    if (!fs.existsSync(p)) continue
    try {
      const html = fs.readFileSync(p, 'utf8')
      const matches = [...html.matchAll(/<div class="eyebrow">([^<]+)<\/div>/g)]
      const items = matches.map(m => m[1].trim()).filter(Boolean)
      // Drop transitional/structural eyebrows that aren't topic bullets:
      //  - "CHAPTER N · …" (title slide)
      //  - "END OF CHAPTER N" (close slide)
      //  - "Next up · Chapter N" (transition)
      //  - "Last chapter" (penultimate transition)
      //  - "Interactive · build …" (builder slide eyebrow on last chapter)
      //  - "The course · in one breath" / "End of course …"
      const isNoise = s => (
        /^CHAPTER\s+\d+/i.test(s) ||
        /^END OF\s+(CHAPTER|COURSE)/i.test(s) ||
        /^Next up/i.test(s) ||
        /^Last chapter/i.test(s) ||
        /^Interactive\s*·?\s*build/i.test(s) ||
        /in one breath/i.test(s) ||
        /the close/i.test(s) ||
        /^from chapter/i.test(s)
      )
      return items.filter(s => s.length > 0 && !isNoise(s))
    } catch {
      return []
    }
  }
  return []
}

function getChapterBullets(course, chapter) {
  const descBullets = splitToBullets(chapter.description)
  if (descBullets.length >= 4) return descBullets.slice(0, 6)
  // Augment with chapter HTML eyebrows
  const htmlBullets = extractBulletsFromChapterHtml(course.id, chapter)
  if (htmlBullets.length >= 3) return htmlBullets.slice(0, 6)
  // Last resort: whatever we have from description (1-3 bullets)
  return descBullets.length ? descBullets : [chapter.description || chapter.title]
}

function deriveAudience(course) {
  const id = course.id
  if (id.includes('strategy') || id.includes('c-suite')) return 'CEOs, CDOs, CIOs, board directors, CFOs reviewing AI capital plans, transformation leaders.'
  if (id.includes('governance') || id.includes('risk-boards')) return 'Board directors, audit committees, risk officers, CISOs, general counsels, AI governance leads.'
  if (id.includes('roi-business-case')) return 'AI champions, business-case authors, transformation leads, function heads, and finance partners reviewing AI cases.'
  if (id.includes('readiness-assessment')) return 'Transformation leaders, CIOs, CDAOs, AI program owners building a defensible readiness diagnostic.'
  if (id.includes('program-management-pmo')) return 'AI program managers, PMO leads, transformation directors, chiefs of staff running AI portfolios.'
  if (id.includes('talent-strategy')) return 'CHROs, CTOs, CIOs, and AI/talent leaders accountable for the talent strategy behind AI ambitions.'
  if (id.includes('finance') && id.includes('accounting')) return 'CFOs, controllers, FP&A heads, audit partners, finance transformation leads.'
  if (id.includes('financial-services')) return 'Banking + insurance + capital markets executives, Chief Risk Officers, General Counsels, model risk heads.'
  if (id.includes('hr') || id.includes('people')) return 'CHROs, CPOs, talent acquisition leaders, HR operations, people + culture leads.'
  if (id.includes('healthcare')) return 'Hospital executives, CMOs/CMIOs, healthcare CIOs, clinical leaders, payer leaders.'
  if (id.includes('m365') || id.includes('copilot-adoption')) return 'CIOs, IT leaders, change managers, workplace technology heads, adoption + enablement leads.'
  if (id.includes('sales-marketing')) return 'CROs, CMOs, Revenue Operations heads, sales + marketing leaders, marketing technology leads.'
  if (id.includes('customer-service') || id.includes('support')) return 'CX leaders, customer service VPs, support operations heads, contact centre leadership.'
  if (id.includes('operations-supply-chain') || id.includes('supply-chain')) return 'COOs, Chief Supply Chain Officers, supply chain VPs, procurement leaders, operations + logistics heads.'
  if (id.includes('manufacturing')) return 'Plant managers, VPs of Manufacturing, operations leadership, process + quality engineers, IT/OT leaders.'
  if (id.includes('legal')) return 'General Counsels, CLOs, Legal Operations leads, compliance officers, DPOs, privacy + risk teams.'
  if (id.includes('energy-utilities')) return 'Utility executives, grid operators, generation operators, demand planning leaders, utility customer ops.'
  if (id.includes('retail-ecommerce')) return 'Retail executives, eCommerce VPs, merchandising heads, marketing operations, supply chain + fulfilment leads.'
  if (id.includes('cybersecurity-soc')) return 'SOC leaders, CISO directs, detection engineers, threat-intel managers responsible for SecOps capacity.'
  if (id.includes('public-sector') || id.includes('government')) return 'Government CIOs, agency heads, public-sector transformation leaders, programme directors, civil servants.'
  if (id.includes('pharma') || id.includes('life-sciences')) return 'Pharma R&D directors, clinical operations leaders, regulatory affairs heads, pharmacovigilance + commercial operators.'
  if (id.includes('education')) return 'Superintendents, heads of school, provosts, deans, curriculum directors, IT and academic affairs leaders.'
  if (id.includes('product-management')) return 'Product managers shipping AI features, product directors leading PM teams, founder/PMs at AI startups.'
  if (id.includes('demand-forecasting')) return 'Chief Supply Chain Officers, S&OP heads, demand planners, supply chain analysts, operations finance.'
  if (id.includes('month-end-close')) return 'Controllers, assistant controllers, FP&A heads, CFOs, accounting operations leaders.'
  if (id.includes('agents') || id.includes('copilot-studio')) return 'Power Platform builders, AI developers, solution architects, L&D + internal trainers.'
  if (id.includes('prompting')) return 'Power users, developers, AI engineering teams, knowledge workers going deeper, internal AI champions.'
  if (id.includes('working-with-copilots')) return 'Professionals using M365 Copilot, GitHub Copilot, ChatGPT Enterprise — knowledge workers adopting AI.'
  if (id.includes('evaluating-ai-output')) return 'Professionals reviewing AI work, editors + reviewers, quality + compliance teams, AI-adopting knowledge workers.'
  if (id.includes('literacy-non-technical')) return 'HR, Marketing, Sales, and Ops professionals — non-technical functions adopting AI tools.'
  if (id.includes('recruiting')) return 'Recruiters, Talent Acquisition leaders, TA Operations, people + culture teams.'
  if (id.includes('revops')) return 'RevOps leaders, Sales Operations, Marketing Operations, CRO offices.'
  if (id.includes('foundations')) return 'Anyone starting their AI journey — non-technical professionals, managers, analysts, L&D teams.'
  if (id.includes('generative-ai-for-business')) return 'Mid + senior managers, business unit leaders, function heads exploring AI, L&D + transformation teams.'
  if (id.includes('data-foundations')) return 'Chief Data Officers, data platform leads, data engineering managers, CIOs accountable for the data foundation behind AI.'
  if (id.includes('ab-100')) return 'Solution architects, AI developers, Power Platform developers, L&D and internal trainers.'
  if (id.includes('trusted-support-bots')) return 'CS leaders, Support Operations, CX Operations, customer service tech leads.'
  return 'Business + technology leaders, function heads + transformation owners, L&D + internal trainers, AI-curious managers.'
}

function derivePrerequisites(course) {
  // Most academy courses target non-technical leaders. Builder track is the only one with light tech expectations.
  const id = course.id
  if (
    id.includes('agents') ||
    id.includes('copilot-studio') ||
    id.includes('prompting') ||
    id.includes('ab-100') ||
    id.includes('data-foundations') ||
    id.includes('product-management')
  ) {
    return 'Comfort with technology and product workflows. No coding experience required to follow the material; helpful for the hands-on takeaway.'
  }
  if (id.includes('cybersecurity-soc')) {
    return 'Familiarity with SOC operations terminology. No coding required — the course focuses on operating model, not tooling.'
  }
  return 'No technical prerequisites. The material is written for business decision-makers and assumes only general business literacy.'
}

/* ────────────────────────────────────────────────────────────────────────
 * Drawing primitives
 * ──────────────────────────────────────────────────────────────────────── */

function ensureDir(p) {
  fs.mkdirSync(path.dirname(p), { recursive: true })
}

function drawPageFooter(doc, page) {
  const y = PAGE_H - 36
  doc.fillColor(TEXT_MUTED).fontSize(8).font('Helvetica')
  doc.text('© 2026 Gennoor Tech Private Limited', M, y, { lineBreak: false })
  doc.text('www.gennoor.com  ·  enquiry@gennoor.com', M, y, { width: BODY_W, align: 'center', lineBreak: false })
  doc.text(`Page ${page}`, M, y, { width: BODY_W, align: 'right', lineBreak: false })
}

function drawLogo(doc, x, y, fontSize = 10) {
  doc.font('Helvetica-Bold').fontSize(fontSize)
  const part1 = 'Genn', part2 = 'oor', part3 = ' Tech'
  const w1 = doc.widthOfString(part1)
  const w2 = doc.widthOfString(part2)
  doc.fillColor(TEXT_DARK).text(part1, x, y, { lineBreak: false })
  doc.fillColor(BRAND_ORANGE).text(part2, x + w1, y, { lineBreak: false })
  doc.fillColor(TEXT_DARK).text(part3, x + w1 + w2, y, { lineBreak: false })
}

function drawLogoWhite(doc, x, y, fontSize, accent) {
  doc.font('Helvetica-Bold').fontSize(fontSize)
  const w1 = doc.widthOfString('Genn')
  const w2 = doc.widthOfString('oor')
  doc.fillColor('#FFFFFF').text('Genn', x, y, { lineBreak: false })
  doc.fillColor(accent).text('oor', x + w1, y, { lineBreak: false })
  doc.fillColor('#FFFFFF').text(' Tech', x + w1 + w2, y, { lineBreak: false })
}

function drawHeader(doc, eyebrow) {
  const y = 36
  drawLogo(doc, M, y, 10)
  doc.fillColor(TEXT_MUTED).fontSize(9).font('Helvetica-Bold')
    .text((eyebrow || '').toUpperCase(), M, y, { width: BODY_W, align: 'right', characterSpacing: 1.2, lineBreak: false })
  doc.moveTo(M, y + 18).lineTo(PAGE_W - M, y + 18).strokeColor(RULE).lineWidth(0.5).stroke()
}

function drawSectionTitle(doc, text, accentWord) {
  const y = doc.y
  if (accentWord) {
    doc.font('Helvetica-Bold').fontSize(20).fillColor(TEXT_DARK).text(text + ' ', M, y, { continued: true, lineBreak: false })
    doc.fillColor(BRAND_BLUE).text(accentWord, { lineBreak: true })
  } else {
    doc.font('Helvetica-Bold').fontSize(20).fillColor(TEXT_DARK).text(text, M, y)
  }
  doc.moveDown(0.4)
}

/* ────────────────────────────────────────────────────────────────────────
 * Page 1 — Cover
 * ──────────────────────────────────────────────────────────────────────── */

function drawCoverPage(doc, course) {
  const theme = course.theme
  const accent = theme?.accent || BRAND_ORANGE
  const navy = theme?.navy || BRAND_NAVY

  doc.rect(0, 0, PAGE_W, PAGE_H).fill(navy)
  doc.rect(0, 0, PAGE_W, 6).fill(accent)

  // Centered logo
  const logoFont = 22
  doc.font('Helvetica-Bold').fontSize(logoFont)
  const totalLogoW = doc.widthOfString('Gennoor Tech')
  const logoX = (PAGE_W - totalLogoW) / 2
  drawLogoWhite(doc, logoX, 230, logoFont, accent)

  doc.fillColor('#FFFFFF').fillOpacity(0.65).fontSize(8).font('Helvetica-Bold')
    .text('TRAIN. INNOVATE. BUILD.', 0, 230 + logoFont + 8, { width: PAGE_W, align: 'center', characterSpacing: 2.5, lineBreak: false })
  doc.fillOpacity(1)

  // Eyebrow pill
  const pillText = `GENNOOR ACADEMY · SELF-PACED · ${course.duration.toUpperCase().replace(/^~/, '')}`
  doc.font('Helvetica-Bold').fontSize(8)
  const pillTextW = doc.widthOfString(pillText)
  const pillW = pillTextW + 36
  const pillX = (PAGE_W - pillW) / 2
  const pillY = 305
  doc.roundedRect(pillX, pillY, pillW, 24, 12).strokeColor(accent).lineWidth(1).stroke()
  doc.fillColor('#FFFFFF').text(pillText, pillX, pillY + 8, { width: pillW, align: 'center', characterSpacing: 1.5, lineBreak: false })

  // Title
  const titleFontSize = course.title.length > 32 ? 26 : course.title.length > 20 ? 30 : 36
  doc.fillColor(accent).font('Helvetica-Bold').fontSize(titleFontSize)
    .text(course.title, M, 360, { width: BODY_W, align: 'center' })

  // Subtitle
  doc.fillColor('#FFFFFF').fillOpacity(0.82).font('Helvetica').fontSize(11)
    .text(course.description, M + 20, doc.y + 12, { width: BODY_W - 40, align: 'center', lineGap: 2 })
  doc.fillOpacity(1)

  const lineY = doc.y + 18
  doc.moveTo(PAGE_W / 2 - 24, lineY).lineTo(PAGE_W / 2 + 24, lineY).strokeColor(accent).lineWidth(2).stroke()

  // Stats row
  const statsY = lineY + 40
  const totalChapters = course.chapters.filter(c => !c.isMockExam && c.id !== 'chapter-00').length
  const durationCompact = course.duration.replace(/^~/, '').replace(/\s+min$/i, ' min')
  const levelCompact = course.level.length > 12 ? course.level.slice(0, 10) + '…' : course.level
  const stats = [
    { value: String(totalChapters), label: 'MODULES' },
    { value: durationCompact, label: 'DURATION' },
    { value: levelCompact, label: 'LEVEL' },
    { value: 'FREE', label: 'CERTIFICATE' },
  ]
  const statW = BODY_W / stats.length
  stats.forEach((s, i) => {
    const x = M + i * statW
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

  doc.fillColor('#FFFFFF').fillOpacity(0.55).font('Helvetica').fontSize(8)
    .text('www.gennoor.com · enquiry@gennoor.com', 0, PAGE_H - 60, { width: PAGE_W, align: 'center' })
  doc.fillOpacity(1)
}

/* ────────────────────────────────────────────────────────────────────────
 * Page 2 — Course Brief (Duration · Format · Audience · Prerequisites · Outcomes)
 * ──────────────────────────────────────────────────────────────────────── */

function drawLabeledRow(doc, label, body, x, y, w) {
  doc.fillColor(BRAND_BLUE).font('Helvetica-Bold').fontSize(9.5)
    .text(label.toUpperCase(), x, y, { width: 90, characterSpacing: 1.2, lineBreak: false })
  doc.fillColor(TEXT_DARK).font('Helvetica').fontSize(10.5)
    .text(body, x + 100, y, { width: w - 100, lineGap: 2 })
  const newY = doc.y
  return newY
}

function drawBriefPage(doc, course, page) {
  drawHeader(doc, 'Course Brief')
  doc.y = 86
  drawSectionTitle(doc, 'Course', 'Brief')

  // 4-row meta block
  const rowYStart = doc.y + 4
  let curY = rowYStart
  curY = drawLabeledRow(doc, 'Duration', `${course.duration.replace(/^~/, '')} · ${course.chapters.filter(c => !c.isMockExam && c.id !== 'chapter-00').length} modules · self-paced`, M, curY, BODY_W)
  curY += 12
  curY = drawLabeledRow(doc, 'Format', 'Audio-narrated slide chapters with synchronized progress tracking. Interactive end-of-course Markdown builder you take to the next meeting. Free verifiable certificate on completion.', M, curY, BODY_W)
  curY += 12
  curY = drawLabeledRow(doc, 'Audience', deriveAudience(course), M, curY, BODY_W)
  curY += 12
  curY = drawLabeledRow(doc, 'Prerequisites', derivePrerequisites(course), M, curY, BODY_W)
  curY += 18

  // Soft divider
  doc.moveTo(M, curY).lineTo(PAGE_W - M, curY).strokeColor(RULE).lineWidth(0.5).stroke()
  doc.y = curY + 16

  drawSectionTitle(doc, 'Course', 'Outcomes')
  const outcomes = (course.learningOutcomes && course.learningOutcomes.length
    ? course.learningOutcomes
    : [course.description]).slice(0, 8)

  outcomes.forEach((o, i) => {
    if (doc.y > PAGE_H - 80) return // outcomes overflow guard
    const y0 = doc.y
    doc.circle(M + 9, y0 + 7, 9).fill(BRAND_BLUE)
    doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(9).text(String(i + 1), M, y0 + 3, { width: 18, align: 'center', lineBreak: false })
    doc.fillColor(TEXT_DARK).font('Helvetica').fontSize(10).text(o, M + 26, y0 + 2, { width: BODY_W - 26, lineGap: 2 })
    doc.moveDown(0.45)
  })

  drawPageFooter(doc, page)
}

/* ────────────────────────────────────────────────────────────────────────
 * Page 3+ — Table of Content (detailed)
 * ──────────────────────────────────────────────────────────────────────── */

function drawTocPages(doc, course, startPage) {
  const realChapters = course.chapters.filter(c => !c.isMockExam && c.id !== 'chapter-00')
  let page = startPage

  doc.addPage()
  drawHeader(doc, 'Table of Content')
  doc.y = 86
  drawSectionTitle(doc, 'Table of', 'Content')

  doc.fillColor(TEXT_MUTED).font('Helvetica').fontSize(10).text(
    `${realChapters.length} modules · ${course.duration.replace(/^~/, '')} of audio-narrated learning · each module ends with a Monday-move you can apply that week.`,
    M, doc.y, { width: BODY_W, lineGap: 2 },
  )
  doc.moveDown(1.0)

  realChapters.forEach((ch, idx) => {
    // Module-block height estimate (header + bullets + spacing) so we
    // page-break BEFORE rather than splitting a module across pages.
    const bullets = getChapterBullets(course, ch).slice(0, 6)
    // Module header (label + title + meta) ≈ 56 px · bullets ≈ 18 px each · 14 px separator
    const estBlockH = 56 + bullets.length * 18 + 14
    if (doc.y + estBlockH > PAGE_H - 60) {
      drawPageFooter(doc, page)
      page++
      doc.addPage()
      drawHeader(doc, 'Table of Content (continued)')
      doc.y = 86
    }

    const blockY = doc.y
    const num = String(ch.number).padStart(2, '0')

    // Module label on its own line above the title.
    doc.fillColor(BRAND_BLUE).font('Helvetica-Bold').fontSize(9)
      .text(`MODULE ${num}`, M, blockY, { characterSpacing: 1.8, lineBreak: false })

    // Title — bigger, dedicated line so it never collides with the label.
    doc.fillColor(TEXT_DARK).font('Helvetica-Bold').fontSize(14)
      .text(ch.title, M, blockY + 14, { width: BODY_W, lineGap: 0 })

    // Meta line — small grey "~5 MIN · NARRATED + INTERACTIVE · CAPSTONE BUILDER"
    const isCapstone = idx === realChapters.length - 1
    const meta = `~${ch.estimatedMinutes || 5} MIN · NARRATED + INTERACTIVE${isCapstone ? ' · CAPSTONE BUILDER' : ''}`
    doc.fillColor(TEXT_MUTED).font('Helvetica-Bold').fontSize(8)
      .text(meta, M, doc.y + 3, { characterSpacing: 0.8, width: BODY_W, lineBreak: false })
    doc.moveDown(0.6)

    // Bulleted detail lines (4-6 bullets per docx style)
    bullets.forEach(b => {
      const y0 = doc.y
      doc.fillColor(BRAND_ORANGE).font('Helvetica-Bold').fontSize(11).text('•', M + 12, y0, { lineBreak: false })
      doc.fillColor(TEXT_DARK).font('Helvetica').fontSize(10).text(b, M + 26, y0 + 1, { width: BODY_W - 26, lineGap: 2 })
      doc.moveDown(0.18)
    })

    // Subtle separator
    doc.moveDown(0.4)
    if (idx < realChapters.length - 1) {
      const sepY = doc.y
      doc.moveTo(M + 12, sepY).lineTo(PAGE_W - M - 12, sepY).strokeColor(RULE).lineWidth(0.4).stroke()
      doc.moveDown(0.6)
    }
  })

  drawPageFooter(doc, page)
  return page
}

/* ────────────────────────────────────────────────────────────────────────
 * Final page — Taking This Further (engagement options + CTA)
 * ──────────────────────────────────────────────────────────────────────── */

function drawClosingPage(doc, course, page) {
  doc.addPage()
  drawHeader(doc, 'Taking This Further')
  doc.y = 86
  drawSectionTitle(doc, 'Taking This', 'Further')

  doc.fillColor(TEXT_DARK).font('Helvetica').fontSize(11).text(
    'The course is the starting point. The same content powers three concrete next steps you can engage Gennoor Tech to deliver inside your organisation:',
    M, doc.y, { width: BODY_W, lineGap: 3 },
  )
  doc.moveDown(1.0)

  const options = [
    {
      title: '4-week Pilot',
      bullets: [
        'Fixed scope · fixed price · production artifact',
        'A working AI capability tied to the content of this course — set up on your data and tooling',
        'Suitable for: a single function or business unit ready to prove value',
      ],
    },
    {
      title: 'Org-wide Rollout',
      bullets: [
        '90-day adoption programme · executive + frontline tracks',
        'Champions network, prompt libraries, governance pack, weekly office hours',
        'Suitable for: 200-5,000-seat rollouts of Copilot, ChatGPT Enterprise, or similar',
      ],
    },
    {
      title: 'Continuous Build',
      bullets: [
        'Quarterly retainer · embedded engineering + delivery + governance',
        'Multiple parallel AI initiatives sustained against an evolving roadmap',
        'Suitable for: large enterprises with portfolio-scale AI ambitions',
      ],
    },
  ]

  options.forEach((o) => {
    const blockY = doc.y
    const blockH = 24 + o.bullets.length * 16 + 10
    doc.roundedRect(M, blockY, BODY_W, blockH, 6).fillOpacity(0.5).fill(BRAND_LIGHT_BG)
    doc.fillOpacity(1)
    doc.fillColor(TEXT_DARK).font('Helvetica-Bold').fontSize(13).text(o.title, M + 14, blockY + 10, { width: BODY_W - 28, lineBreak: false })
    let by = blockY + 32
    o.bullets.forEach(b => {
      doc.fillColor(BRAND_ORANGE).font('Helvetica-Bold').fontSize(11).text('•', M + 14, by, { lineBreak: false })
      doc.fillColor(TEXT_DARK).font('Helvetica').fontSize(9.5).text(b, M + 26, by + 1, { width: BODY_W - 40, lineGap: 1 })
      by += 16
    })
    doc.y = blockY + blockH + 10
  })

  doc.moveDown(0.8)
  doc.moveTo(M, doc.y).lineTo(PAGE_W - M, doc.y).strokeColor(RULE).lineWidth(0.5).stroke()
  doc.moveDown(0.8)

  // Contact CTA
  doc.fillColor(TEXT_DARK).font('Helvetica-Bold').fontSize(15).text('Get in touch', M, doc.y)
  doc.moveDown(0.3)
  doc.fillColor(TEXT_DARK).font('Helvetica').fontSize(10.5).text(
    'Tell us about your AI ambitions, your team, and the constraints you are working under. We respond within one business day across India, GCC, SEA, US, and EU time zones.',
    M, doc.y, { width: BODY_W, lineGap: 2 },
  )
  doc.moveDown(0.5)
  const contactY = doc.y
  doc.fillColor(BRAND_BLUE).font('Helvetica-Bold').fontSize(11)
    .text('enquiry@gennoor.com', M, contactY, { lineBreak: false })
  const emailW = doc.widthOfString('enquiry@gennoor.com')
  doc.fillColor(TEXT_MUTED).font('Helvetica').fontSize(11)
    .text('  ·  www.gennoor.com  ·  +91  ·  +971  ·  +1', M + emailW, contactY, { lineBreak: false })

  drawPageFooter(doc, page)
}

/* ────────────────────────────────────────────────────────────────────────
 * Entry point
 * ──────────────────────────────────────────────────────────────────────── */

export async function buildCoursePdf(course, outPath) {
  ensureDir(outPath)
  return await new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      layout: 'portrait',
      margin: 0,
      info: {
        Title: `${course.title} — Gennoor Academy`,
        Author: 'Gennoor Tech',
        Subject: course.title,
        Keywords: `gennoor academy, ${course.id}, ${course.tags?.join(', ') || ''}`,
      },
    })
    const stream = fs.createWriteStream(outPath)
    doc.pipe(stream)

    // Page 1 — Cover
    drawCoverPage(doc, course)

    // Page 2 — Course Brief
    doc.addPage()
    drawBriefPage(doc, course, 2)

    // Page 3+ — Table of Content
    const lastTocPage = drawTocPages(doc, course, 3)

    // Final — Taking This Further (engagement + contact)
    drawClosingPage(doc, course, lastTocPage + 1)

    doc.end()
    stream.on('finish', () => resolve(outPath))
    stream.on('error', reject)
  })
}
