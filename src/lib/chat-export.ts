/**
 * Copy and export for the learner Ask chat, shared by the video courses and the interactive courses.
 * Plain text only: a simple question and answer record with a time on every message.
 */

export interface ChatLine { id?: string; role: 'learner' | 'assistant' | 'team'; text: string; at: string }

/** Markdown markers out, words and link addresses kept. */
export function plainText(md: string): string {
  return md
    .replace(/```[a-zA-Z0-9_-]*\n?([\s\S]*?)```/g, (_m, code: string) => code.replace(/\n$/, ''))
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_m, label: string, url: string) => (label.trim() === url ? url : `${label} (${url})`))
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^\s*[-*]\s+/gm, '- ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const two = (n: number) => String(n).padStart(2, '0')

/** 24 Oct 2026, 14:05 (the learner's own clock). */
export function stamp(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}, ${two(d.getHours())}:${two(d.getMinutes())}`
}

const who = (r: ChatLine['role']) => (r === 'learner' ? 'You' : r === 'team' ? 'Gennoor team' : 'Assistant')

function line(m: ChatLine): string {
  const t = stamp(m.at)
  return `${t ? `[${t}] ` : ''}${who(m.role)}: ${plainText(m.text)}`
}

/** The whole conversation as text, with the course and the date on top. */
export function formatTranscript(msgs: ChatLine[], opts: { courseTitle: string; now?: Date }): string {
  const now = opts.now ?? new Date()
  const head = [
    `Gennoor Learning Studio: chat notes`,
    `Course: ${opts.courseTitle}`,
    `Exported: ${stamp(now.toISOString())}`,
    '',
  ]
  return head.concat(msgs.map(line).flatMap(l => [l, ''])).join('\n').trimEnd() + '\n'
}

/** One answer with the question that came right before it. */
export function pairText(msgs: ChatLine[], index: number): string {
  const a = msgs[index]
  if (!a) return ''
  let q: ChatLine | undefined
  for (let i = index - 1; i >= 0; i--) if (msgs[i].role === 'learner') { q = msgs[i]; break }
  return [q ? line(q) : '', line(a)].filter(Boolean).join('\n\n')
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const ta = document.createElement('textarea')
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0'
      document.body.appendChild(ta); ta.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(ta)
      return ok
    } catch { return false }
  }
}

function save(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = name
  document.body.appendChild(a); a.click(); document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}

const fileBase = (title: string) => `chat-notes-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'course'}`

export function downloadText(text: string, courseTitle: string) {
  save(new Blob([text], { type: 'text/plain;charset=utf-8' }), `${fileBase(courseTitle)}.txt`)
}

/* ---- A tiny text PDF writer: A4, Helvetica, wrapped lines, many pages. No dependency. ---- */

// Helvetica widths (per 1000 em) for printable ASCII, enough to wrap lines well.
const W: number[] = [
  278, 278, 355, 556, 556, 889, 667, 191, 333, 333, 389, 584, 278, 333, 278, 278,
  556, 556, 556, 556, 556, 556, 556, 556, 556, 556, 278, 278, 584, 584, 584, 556,
  1015, 667, 667, 722, 722, 667, 611, 778, 722, 278, 500, 667, 556, 833, 722, 778,
  667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 278, 278, 278, 469, 556,
  333, 556, 556, 500, 556, 556, 278, 556, 556, 222, 222, 500, 222, 833, 556, 556,
  556, 556, 333, 500, 278, 556, 500, 722, 500, 500, 500, 334, 260, 334, 584,
]
const adv = (ch: string, size: number) => ((W[ch.charCodeAt(0) - 32] ?? 556) * size) / 1000

/** Keep what Helvetica (WinAnsi) can show; swap a few common symbols; the rest becomes "?". */
export function pdfSafe(s: string): string {
  return s
    .replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, '-')
    .replace(/…/g, '...').replace(/[•●]/g, '-').replace(/[→▸]/g, '>').replace(/ /g, ' ')
    .replace(/\t/g, '  ')
    .replace(/[^\n\x20-\x7E]/g, '?')
}

function wrap(text: string, size: number, maxW: number): string[] {
  const out: string[] = []
  for (const para of pdfSafe(text).split('\n')) {
    if (!para.trim()) { out.push(''); continue }
    let cur = '', curW = 0
    for (const word of para.split(' ')) {
      const ww = [...word].reduce((n, c) => n + adv(c, size), 0)
      if (cur && curW + adv(' ', size) + ww > maxW) { out.push(cur); cur = ''; curW = 0 }
      if (ww > maxW) {                               // a very long word: break it
        if (cur) { out.push(cur); cur = ''; curW = 0 }
        for (const c of word) {
          const cw = adv(c, size)
          if (curW + cw > maxW) { out.push(cur); cur = ''; curW = 0 }
          cur += c; curW += cw
        }
        continue
      }
      if (cur) { cur += ' ' + word; curW += adv(' ', size) + ww } else { cur = word; curW = ww }
    }
    out.push(cur)
  }
  return out
}

const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')

/** Build a PDF from text. Returns the file bytes as a string of 8-bit characters. */
export function buildPdf(text: string, title = 'Chat notes'): string {
  const size = 10.5, lead = 14.5, left = 56, top = 790, bottom = 56, maxW = 595 - left * 2
  const lines = wrap(text, size, maxW)
  const perPage = Math.floor((top - bottom) / lead)
  const pages: string[][] = []
  for (let i = 0; i < lines.length; i += perPage) pages.push(lines.slice(i, i + perPage))
  if (!pages.length) pages.push([''])

  const objs: string[] = []
  const add = (s: string) => { objs.push(s); return objs.length }
  const catalog = add('')                       // 1, filled below
  const tree = add('')                          // 2
  const font = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>')
  const pageIds: number[] = []
  for (const pg of pages) {
    const stream = `BT /F1 ${size} Tf ${lead} TL ${left} ${top} Td\n${pg.map(l => `(${esc(l)}) Tj T*`).join('\n')}\nET`
    const content = add(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`)
    pageIds.push(add(`<< /Type /Page /Parent ${tree} 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${font} 0 R >> >> /Contents ${content} 0 R >>`))
  }
  objs[catalog - 1] = `<< /Type /Catalog /Pages ${tree} 0 R >>`
  objs[tree - 1] = `<< /Type /Pages /Kids [${pageIds.map(i => `${i} 0 R`).join(' ')}] /Count ${pageIds.length} >>`
  const info = add(`<< /Title (${esc(pdfSafe(title))}) /Producer (Gennoor Tech) >>`)

  let pdf = '%PDF-1.4\n'
  const offsets: number[] = []
  objs.forEach((o, i) => { offsets.push(pdf.length); pdf += `${i + 1} 0 obj\n${o}\nendobj\n` })
  const xref = pdf.length
  pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n${offsets.map(o => `${String(o).padStart(10, '0')} 00000 n \n`).join('')}`
  pdf += `trailer\n<< /Size ${objs.length + 1} /Root ${catalog} 0 R /Info ${info} 0 R >>\nstartxref\n${xref}\n%%EOF`
  return pdf
}

export function downloadPdf(text: string, courseTitle: string) {
  const s = buildPdf(text, `Chat notes: ${courseTitle}`)
  const bytes = new Uint8Array(s.length)
  for (let i = 0; i < s.length; i++) bytes[i] = s.charCodeAt(i) & 0xff
  save(new Blob([bytes], { type: 'application/pdf' }), `${fileBase(courseTitle)}.pdf`)
}
