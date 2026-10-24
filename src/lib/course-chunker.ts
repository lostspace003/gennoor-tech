/**
 * Pure text helpers for course indexing: no network, no env. Used by src/lib/course-index.ts and
 * by scripts/check-course-chunker.ts.
 */

/** About 500 tokens of English narration (1 token is roughly 4 characters). */
export const CHUNK_CHARS = 2000
export const OVERLAP_CHARS = 200

export interface Cue { start: number; text: string }
export interface Chunk { text: string; startSeconds?: number }

export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

/** Parse WebVTT into cues with their start time in seconds. */
export function parseVtt(vtt: string): Cue[] {
  const cues: Cue[] = []
  const blocks = vtt.replace(/\r/g, '').split(/\n\n+/)
  for (const block of blocks) {
    const lines = block.split('\n').filter(Boolean)
    const ti = lines.findIndex(l => l.includes('-->'))
    if (ti < 0) continue
    const m = lines[ti].match(/(?:(\d+):)?(\d{1,2}):(\d{2})[.,](\d{3})/)
    if (!m) continue
    const start = (m[1] ? Number(m[1]) * 3600 : 0) + Number(m[2]) * 60 + Number(m[3]) + Number(m[4]) / 1000
    const text = lines.slice(ti + 1).join(' ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
    if (text) cues.push({ start, text })
  }
  return cues
}

/** Split text into chunks of about CHUNK_CHARS, on sentence ends where possible, with a small overlap. */
export function chunkText(text: string, size = CHUNK_CHARS, overlap = OVERLAP_CHARS): string[] {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (!clean) return []
  if (clean.length <= size) return [clean]
  const out: string[] = []
  let i = 0
  while (i < clean.length) {
    let end = Math.min(clean.length, i + size)
    if (end < clean.length) {
      const window = clean.slice(i + Math.floor(size * 0.6), end)
      const cut = Math.max(window.lastIndexOf('. '), window.lastIndexOf('? '), window.lastIndexOf('! '))
      if (cut >= 0) end = i + Math.floor(size * 0.6) + cut + 1
    }
    out.push(clean.slice(i, end).trim())
    if (end >= clean.length) break
    i = Math.max(end - overlap, i + 1)
  }
  return out
}

/** Chunk caption cues, remembering the start time of the first cue in each chunk. */
export function chunkCues(cues: Cue[], size = CHUNK_CHARS, overlapCues = 2): Chunk[] {
  const out: Chunk[] = []
  let buf: Cue[] = []
  let len = 0
  const flush = () => {
    if (!buf.length) return
    out.push({ text: buf.map(c => c.text).join(' '), startSeconds: Math.floor(buf[0].start) })
  }
  for (const cue of cues) {
    if (len + cue.text.length > size && buf.length) {
      flush()
      buf = buf.slice(-overlapCues)
      len = buf.reduce((n, c) => n + c.text.length + 1, 0)
    }
    buf.push(cue)
    len += cue.text.length + 1
  }
  // do not emit a tail that only repeats the overlap
  if (buf.length && (out.length === 0 || buf.length > overlapCues)) flush()
  return out
}

/** Readable text from a chapter HTML deck: drops scripts, styles and markup. */
export function htmlToPlain(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<(br|\/p|\/div|\/li|\/h[1-6]|\/tr)\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;|&rsquo;/g, "'")
    .replace(/[ \t]+/g, ' ').replace(/ *\n\s*/g, '\n').trim()
}

export function formatClock(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}
