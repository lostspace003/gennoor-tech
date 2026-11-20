/**
 * The only HTML a blog article may be made of.
 *
 * An article is written by a model from what a web search found, and (when the daily blog is on) it reaches the
 * live site with nobody reading it first. Until 20 November 2026 its HTML went into the site exactly as the model
 * wrote it. A web page that the search read could therefore have put a script, a frame or a full-screen "sign in
 * again" block on gennoor.com, and into the browser of whoever opened the draft in the admin centre
 * (docs/SECURITY.md, "Words written by a model").
 *
 * `cleanArticleHtml` REBUILDS the HTML instead of trying to take bad parts out of it. It walks the text, and
 * writes out again only:
 *   - the tags listed here, with the attributes listed here, each value checked against its own pattern;
 *   - every other character as plain text (so `<` that is not one of those tags is shown, never obeyed).
 * A tag that is not on the list is dropped and its words stay. Nothing the model wrote reaches the page as
 * markup unless this file wrote it.
 *
 * No server-only parts: the admin preview runs the same function in the browser. Running it twice gives the
 * same result as running it once, so it is safe to call wherever a body is saved, read or published.
 */

/** The tags of an article's text. */
const HTML_TAGS = new Set([
  'p', 'br', 'hr', 'strong', 'b', 'em', 'i', 'u', 'sup', 'sub', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre',
  'a', 'span', 'div', 'figure', 'figcaption', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
])
/** The small drawings of some articles: shapes and words, nothing that loads, links or moves. */
const SVG_HOLDERS = new Set(['svg', 'g', 'defs', 'marker', 'text', 'tspan'])
const SVG_SHAPES = new Set(['rect', 'line', 'polygon', 'polyline', 'circle', 'ellipse', 'path'])
const VOID = new Set(['br', 'hr'])

/** Tags that are dropped WITH everything inside them: what they hold is not the article's words. */
const DROP_WITH_CONTENT = new Set([
  'script', 'style', 'iframe', 'frame', 'frameset', 'object', 'embed', 'applet', 'noscript', 'template', 'textarea', 'title', 'xmp',
  'noembed', 'noframes', 'plaintext', 'foreignobject', 'math', 'select', 'head', 'audio', 'video', 'canvas',
])

/**
 * The class names an article may carry: the blog's own blocks (figures, steps, comparison, note) and its table.
 * A class is not harmless: `fixed inset-0 z-50` exists in the site's stylesheet, and would lay a block over the
 * whole window. So this is a list of what is allowed, never a list of what is not.
 */
const CLASSES = new Set([
  'blog-stats', 'stat', 'stat-value', 'stat-label',
  'blog-flow', 'flow-step', 'flow-arrow', 'step-num', 'step-label',
  'blog-compare', 'compare-card', 'compare-title',
  'blog-callout', 'callout-tip', 'callout-warning', 'callout-info', 'callout-title',
  'blog-diagram',
  'overflow-x-auto', 'my-6', 'w-full', 'border-collapse', 'text-sm', 'text-left',
  'border', 'border-gray-300', 'dark:border-gray-700', 'px-3', 'py-2',
])

type Kind = 'num' | 'list' | 'paint' | 'word' | 'ref' | 'id' | 'ns' | 'label'
/** Attributes of the drawing tags: the name as the browser wants it, and which pattern its value must fit. */
const SVG_ATTRS: Record<string, [string, Kind]> = {
  x: ['x', 'num'], y: ['y', 'num'], x1: ['x1', 'num'], y1: ['y1', 'num'], x2: ['x2', 'num'], y2: ['y2', 'num'],
  cx: ['cx', 'num'], cy: ['cy', 'num'], r: ['r', 'num'], rx: ['rx', 'num'], ry: ['ry', 'num'], dx: ['dx', 'num'], dy: ['dy', 'num'],
  width: ['width', 'num'], height: ['height', 'num'], opacity: ['opacity', 'num'],
  'stroke-width': ['stroke-width', 'num'], 'font-size': ['font-size', 'num'],
  'fill-opacity': ['fill-opacity', 'num'], 'stroke-opacity': ['stroke-opacity', 'num'],
  markerwidth: ['markerWidth', 'num'], markerheight: ['markerHeight', 'num'], refx: ['refX', 'num'], refy: ['refY', 'num'],
  points: ['points', 'list'], d: ['d', 'list'], viewbox: ['viewBox', 'list'], transform: ['transform', 'list'],
  'stroke-dasharray': ['stroke-dasharray', 'list'],
  fill: ['fill', 'paint'], stroke: ['stroke', 'paint'],
  'text-anchor': ['text-anchor', 'word'], 'font-weight': ['font-weight', 'word'], 'font-family': ['font-family', 'word'],
  'dominant-baseline': ['dominant-baseline', 'word'], orient: ['orient', 'word'], role: ['role', 'word'],
  'stroke-linecap': ['stroke-linecap', 'word'], 'stroke-linejoin': ['stroke-linejoin', 'word'],
  preserveaspectratio: ['preserveAspectRatio', 'word'], 'aria-hidden': ['aria-hidden', 'word'],
  'marker-end': ['marker-end', 'ref'], 'marker-start': ['marker-start', 'ref'], 'marker-mid': ['marker-mid', 'ref'],
  id: ['id', 'id'], xmlns: ['xmlns', 'ns'], 'aria-label': ['aria-label', 'label'],
}

const NUM = /^[-+]?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?(?:px|em|rem|pt|%)?$/i
const LIST = /^[-+0-9a-zA-Z .,()%]{1,4000}$/
const PAINT = /^(?:#[0-9a-f]{3,8}|[a-z]{1,24}|rgba?\([0-9., %]{1,40}\))$/i
const WORD = /^[a-zA-Z0-9 ,.-]{1,80}$/
const REF = /^url\(#([a-zA-Z][\w-]{0,40})\)$/
const ID = /^[a-zA-Z][\w-]{0,40}$/
/** An id is given a prefix of ours, so a drawing can never take the name of something the page's scripts look up. */
const ownId = (id: string) => (id.startsWith('art-') ? id : `art-${id}`)

function svgValue(kind: Kind, value: string): string | null {
  const v = value.trim()
  switch (kind) {
    case 'num': return v.length <= 24 && NUM.test(v) ? v : null
    case 'list': return LIST.test(v) ? v : null
    case 'paint': { const ref = REF.exec(v); return ref ? `url(#${ownId(ref[1])})` : PAINT.test(v) ? v : null }
    case 'word': return WORD.test(v) ? v : null
    case 'ref': { const ref = REF.exec(v); return ref ? `url(#${ownId(ref[1])})` : null }
    case 'id': return ID.test(v) ? ownId(v) : null
    case 'ns': return v === 'http://www.w3.org/2000/svg' ? v : null
    case 'label': return v.slice(0, 200)
  }
}

/** Text between tags: `<` and `>` are shown, never obeyed. A character written as `&name;` stays as written. */
const escText = (s: string) => s
  .replace(/&(?!(?:[a-zA-Z][a-zA-Z0-9]{1,31}|#\d{1,7}|#[xX][0-9a-fA-F]{1,6});)/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')

/** The value of an attribute as the writer meant it (the five basic `&…;` forms read back to characters). */
const readAttr = (s: string) => s
  .replace(/&quot;/g, '"').replace(/&#0*39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
const writeAttr = (s: string) => s
  .replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/**
 * Where a link in an article may lead: a page of this site ("/training"), a place on the same page ("#part"),
 * an https address anywhere, or a mail address at gennoor.com. Never `javascript:`, `data:`, plain http, an
 * address with a sign-in name in it, or "//host" and "/\host" (another site with the scheme left off).
 * The address is read by the URL parser, the way a browser will read it, and written back out by it.
 */
export function articleHref(raw: unknown): { href: string; external: boolean } | null {
  const text = String(raw ?? '').trim()
  if (!text || text.length > 2000 || /[\u0000- \u007f\\]/.test(text)) return null
  if (text.startsWith('/')) return text.startsWith('//') ? null : { href: text, external: false }
  if (text.startsWith('#')) return /^#[\w-]{1,80}$/.test(text) ? { href: text, external: false } : null
  if (/^mailto:/i.test(text)) {
    const address = text.slice(7).toLowerCase()
    return /^[a-z0-9._-]+@gennoor\.com$/.test(address) ? { href: `mailto:${address}`, external: false } : null
  }
  let url: URL
  try { url = new URL(text) } catch { return null }
  if (url.protocol !== 'https:' || url.username || url.password || !url.hostname.includes('.')) return null
  const host = url.hostname.toLowerCase()
  return { href: url.toString(), external: !/(^|\.)gennoor\.com$/.test(host) }
}

/** `name="value"` pairs of one tag, names in lower case. The first of two with the same name wins, as in a browser. */
function attributesOf(raw: string): Map<string, string> {
  const out = new Map<string, string>()
  const pair = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g
  let m: RegExpExecArray | null
  while ((m = pair.exec(raw))) {
    const name = m[1].toLowerCase()
    if (!out.has(name)) out.set(name, readAttr(m[2] ?? m[3] ?? m[4] ?? ''))
  }
  return out
}

/** The opening tag to write for an allowed tag, or null when the tag must not be written (a link that leads nowhere allowed). */
function openTag(name: string, attrs: Map<string, string>): string | null {
  const parts: string[] = []
  const put = (attr: string, value: string) => parts.push(` ${attr}="${writeAttr(value)}"`)

  if (SVG_HOLDERS.has(name) || SVG_SHAPES.has(name)) {
    for (const [key, value] of attrs) {
      const rule = SVG_ATTRS[key]
      const clean = rule ? svgValue(rule[1], value) : null
      if (rule && clean !== null) put(rule[0], clean)
    }
    return `<${name}${parts.join('')}>`
  }

  if (name === 'a') {
    const link = articleHref(attrs.get('href'))
    if (!link) return null
    put('href', link.href)
    if (link.external) { put('target', '_blank'); put('rel', 'noopener noreferrer') }
  }
  const classes = (attrs.get('class') || '').split(/\s+/).filter((c) => CLASSES.has(c))
  if (classes.length) put('class', classes.join(' '))
  if (name === 'td' || name === 'th') {
    for (const span of ['colspan', 'rowspan']) if (/^\d{1,2}$/.test(attrs.get(span) || '')) put(span, attrs.get(span)!)
    if (name === 'th' && /^(row|col)$/.test(attrs.get('scope') || '')) put('scope', attrs.get('scope')!)
  }
  if (name === 'ol' && /^\d{1,4}$/.test(attrs.get('start') || '')) put('start', attrs.get('start')!)
  return `<${name}${parts.join('')}>`
}

/**
 * An article's body, rebuilt from the allowed tags only. Give it whatever was written; what comes back is safe to
 * put in a page as HTML. See the note at the top of this file.
 */
export function cleanArticleHtml(input: unknown, max = 200_000): string {
  const src = String(input ?? '').slice(0, max).replace(/<!--[\s\S]*?-->/g, '')
  const out: string[] = []
  const open: string[] = []
  // A tag is "<" with a letter straight after it, as in a browser: "a < b and b > c" is words, not a tag
  const tag = /<(\/?)([a-zA-Z][a-zA-Z0-9]*)([^<>]*)>/g
  let last = 0
  let skipUntil: string | null = null
  let m: RegExpExecArray | null

  while ((m = tag.exec(src))) {
    const text = src.slice(last, m.index)
    last = m.index + m[0].length
    const name = m[2].toLowerCase()
    const closing = m[1] === '/'

    if (skipUntil) { if (closing && name === skipUntil) skipUntil = null; continue }
    if (text) out.push(escText(text))
    if (DROP_WITH_CONTENT.has(name)) { if (!closing) skipUntil = name; continue }

    const known = HTML_TAGS.has(name) || SVG_HOLDERS.has(name) || SVG_SHAPES.has(name)
    if (!known) continue                                   // the tag goes, its words stay

    if (closing) {
      const i = open.lastIndexOf(name)
      if (i === -1) continue
      while (open.length > i) out.push(`</${open.pop()}>`)
      continue
    }
    const written = openTag(name, attributesOf(m[3]))
    if (written === null) continue
    if (VOID.has(name)) { out.push(written); continue }
    if (SVG_SHAPES.has(name)) { out.push(`${written}</${name}>`); continue }   // a shape holds nothing
    out.push(written)
    open.push(name)
  }
  if (!skipUntil) out.push(escText(src.slice(last)))
  while (open.length) out.push(`</${open.pop()}>`)
  return out.join('')
}

/** A single line of an article's details (a title, a summary): no line breaks or other control characters. */
export const oneLine = (value: unknown, max = 2000): string =>
  String(value ?? '').replace(/[\u0000-\u001f\u007f\u2028\u2029]+/g, ' ').replace(/ {2,}/g, ' ').trim().slice(0, max)

/** A source's address as it may be shown in an article's list of references: http or https, nothing else. */
export function referenceUrl(raw: unknown): string | null {
  const text = String(raw ?? '').trim()
  if (!text || text.length > 1000 || /[\u0000- \u007f\\]/.test(text)) return null
  try {
    const url = new URL(text)
    return (url.protocol === 'https:' || url.protocol === 'http:') && !url.username && !url.password && url.hostname.includes('.') ? url.toString() : null
  } catch { return null }
}
