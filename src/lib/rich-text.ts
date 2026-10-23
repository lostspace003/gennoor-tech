/**
 * Small allow-list sanitizer for the rich text in the community and discussions. The editor only
 * produces a handful of tags; anything else is dropped (its text stays). Runs on the server before
 * a post is stored, and the stored result is the only HTML the pages ever render.
 */
const ALLOWED = new Set(['p', 'br', 'b', 'strong', 'i', 'em', 'u', 'ul', 'ol', 'li', 'h3', 'blockquote', 'code', 'pre', 'a'])
const VOID = new Set(['br'])

const escText = (s: string) => s.replace(/&(?!(?:amp|lt|gt|quot|#39|nbsp);)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function safeHref(raw: string): string | null {
  const v = raw.trim().replace(/&amp;/g, '&')
  if (!/^(https?:\/\/|mailto:)/i.test(v)) return null
  return v.replace(/"/g, '%22').replace(/</g, '%3C').replace(/>/g, '%3E')
}

export function sanitizeHtml(input: string, max = 8000): string {
  const src = String(input || '').slice(0, max * 2)
  const out: string[] = []
  const open: string[] = []
  const tag = /<\s*(\/?)\s*([a-zA-Z0-9]+)([^<>]*)>/g
  let last = 0
  let m: RegExpExecArray | null
  const dropBlock = /^(script|style|iframe|object|embed)$/i
  let skipUntil: string | null = null
  while ((m = tag.exec(src))) {
    const text = src.slice(last, m.index)
    last = m.index + m[0].length
    const name = m[2].toLowerCase()
    const closing = m[1] === '/'
    if (skipUntil) { if (closing && name === skipUntil) skipUntil = null; continue }
    if (text) out.push(escText(text))
    if (!closing && dropBlock.test(name)) { skipUntil = name; continue }
    if (!ALLOWED.has(name)) continue
    if (closing) {
      const i = open.lastIndexOf(name)
      if (i === -1) continue
      while (open.length > i) out.push(`</${open.pop()}>`)
      continue
    }
    if (name === 'a') {
      const h = /href\s*=\s*("([^"]*)"|'([^']*)')/i.exec(m[3])
      const href = h ? safeHref(h[2] ?? h[3] ?? '') : null
      if (!href) continue
      out.push(`<a href="${href}" target="_blank" rel="noopener noreferrer nofollow">`); open.push('a')
    } else if (VOID.has(name)) {
      out.push(`<${name}>`)
    } else {
      out.push(`<${name}>`); open.push(name)
    }
  }
  if (!skipUntil) out.push(escText(src.slice(last)))
  while (open.length) out.push(`</${open.pop()}>`)
  return out.join('').slice(0, max)
}

/** Plain text of sanitized HTML, for previews and the empty-post check. */
export function htmlToText(html: string): string {
  return String(html || '')
    .replace(/<\/(p|li|h3|blockquote|pre)>|<br>/gi, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ').trim()
}

/** Plain text typed before the editor existed becomes paragraphs. */
export function textToHtml(text: string): string {
  return String(text || '').split(/\n{2,}/).map(p => `<p>${escText(p.trim()).replace(/\n/g, '<br>')}</p>`).join('')
}
