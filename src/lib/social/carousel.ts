import PDFDocument from 'pdfkit'
import { foundry, TEXT_MODEL } from '@/lib/social/studio'

// LinkedIn "document" carousels: a PDF whose pages swipe like cards. One idea per card, big type, brand strip at the bottom.
export interface Slide { title: string; body?: string; bullets?: string[] }
export interface CarouselPlan { title: string; slides: Slide[]; caption: string }

const W = 1080
const H = 1350

const PALETTES = [
  { bg: '#0f172a', fg: '#f8fafc', accent: '#38bdf8' },
  { bg: '#f8fafc', fg: '#0f172a', accent: '#2563eb' },
  { bg: '#14532d', fg: '#f0fdf4', accent: '#facc15' },
  { bg: '#3b0764', fg: '#faf5ff', accent: '#f9a8d4' },
]

const INSTRUCTIONS = `You turn a topic or post into a LinkedIn carousel for Gennoor Tech, an enterprise AI and Microsoft training company (India).
Rules: 7 to 9 cards. Card 1 is a hook title (max 9 words). The last card is a short takeaway with a soft call to action to visit gennoor.com. Middle cards: one idea each, a short title (max 7 words) and either one sentence (max 22 words) or 2-3 bullets (max 10 words each). Use only facts in the material; never invent statistics or quotes. NEVER use first-person singular (no "I", "my", "me"). No emoji.
Also write "caption": a LinkedIn post of 40-90 words that introduces the carousel, direct and impersonal, ending with 3-4 CamelCase hashtags.
Reply as JSON only: {"title": string, "caption": string, "slides": [{"title": string, "body"?: string, "bullets"?: string[]}]}`

export async function planCarousel(material: string): Promise<CarouselPlan> {
  const j = await foundry('/openai/v1/responses', { model: TEXT_MODEL, instructions: INSTRUCTIONS, input: material.slice(0, 12_000) })
  const raw: string = j.output_text || (j.output || []).flatMap((o: any) => o.content || []).map((c: any) => c.text || '').join('')
  const parsed = JSON.parse(raw.slice(raw.indexOf('{'), raw.lastIndexOf('}') + 1))
  const slides: Slide[] = (parsed.slides || []).slice(0, 10).map((s: any) => ({
    title: String(s.title || '').slice(0, 90),
    ...(s.body ? { body: String(s.body).slice(0, 220) } : {}),
    ...(Array.isArray(s.bullets) ? { bullets: s.bullets.slice(0, 4).map((b: any) => String(b).slice(0, 90)) } : {}),
  })).filter((s: Slide) => s.title)
  if (slides.length < 3) throw new Error('The agent returned too few cards. Try again with more detail.')
  return { title: String(parsed.title || slides[0].title).slice(0, 120), caption: String(parsed.caption || ''), slides }
}

export function renderCarouselPdf(plan: CarouselPlan): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: [W, H], margin: 0, info: { Title: plan.title, Author: 'Gennoor Tech' } })
    const chunks: Buffer[] = []
    doc.on('data', (c) => chunks.push(c))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    const pal = PALETTES[0]
    plan.slides.forEach((s, i) => {
      if (i > 0) doc.addPage({ size: [W, H], margin: 0 })
      const p = i === 0 || i === plan.slides.length - 1 ? pal : PALETTES[1]
      doc.rect(0, 0, W, H).fill(p.bg)
      doc.rect(90, 120, 90, 8).fill(p.accent)
      const first = i === 0
      doc.fillColor(p.fg).font('Helvetica-Bold').fontSize(first ? 88 : 66)
      const titleH = doc.heightOfString(s.title, { width: W - 180 })
      doc.text(s.title, 90, 170, { width: W - 180 })
      let y = 170 + titleH + 56
      doc.font('Helvetica').fontSize(40).fillColor(p.fg)
      if (s.body) { doc.text(s.body, 90, y, { width: W - 180, lineGap: 10 }); y += doc.heightOfString(s.body, { width: W - 180, lineGap: 10 }) + 30 }
      for (const b of s.bullets || []) {
        doc.circle(104, y + 22, 8).fill(p.accent)
        doc.fillColor(p.fg).text(b, 140, y, { width: W - 230, lineGap: 8 })
        y += doc.heightOfString(b, { width: W - 230, lineGap: 8 }) + 28
      }
      // brand strip
      doc.rect(0, H - 110, W, 110).fill(p.fg === '#f8fafc' ? '#1e293b' : '#e2e8f0')
      doc.fillColor(p.fg === '#f8fafc' ? '#f8fafc' : '#0f172a').font('Helvetica-Bold').fontSize(30).text('Gennoor Tech', 90, H - 72, { lineBreak: false })
      doc.font('Helvetica').fontSize(28).text('www.gennoor.com', 0, H - 70, { width: W - 90, align: 'right', lineBreak: false })
      doc.fillColor(p.accent).font('Helvetica-Bold').fontSize(26).text(`${i + 1}/${plan.slides.length}`, 0, 60, { width: W - 90, align: 'right', lineBreak: false })
    })
    doc.end()
  })
}
