// LinkedIn has no formatting buttons, so structure comes from Unicode: bold letters for the hook and key phrases,
// quiet bullet marks, a few professional symbols, short paragraphs and one tidy hashtag line. Used for every LinkedIn post
// the admin centre produces (hand-written, AI-written, the autopilot and blog shares). Pure and idempotent: running it
// twice gives the same result.

/**
 * The only emoji we allow: the light bulb for the one key insight, and two plain, grey ones. Everything else
 * pictographic is removed. Quiet typographic marks (→ ▪ ◆ ✓ ↳) are not emoji and always stay.
 */
export const ALLOWED_EMOJI = ['💡', '⚙', '🔒']
const MAX_EMOJI = 2
const MAX_HASHTAGS = 5
const LIMIT = 3000

// Mathematical Sans-Serif Bold: A-Z, a-z, 0-9. These are real characters, so they survive copy and paste on LinkedIn.
const BOLD_UP = 0x1d5d4, BOLD_LOW = 0x1d5ee, BOLD_DIGIT = 0x1d7ec

export function toBold(s: string): string {
  let out = ''
  for (const ch of s) {
    const c = ch.codePointAt(0)!
    if (c >= 65 && c <= 90) out += String.fromCodePoint(BOLD_UP + c - 65)
    else if (c >= 97 && c <= 122) out += String.fromCodePoint(BOLD_LOW + c - 97)
    else if (c >= 48 && c <= 57) out += String.fromCodePoint(BOLD_DIGIT + c - 48)
    else out += ch
  }
  return out
}

/** Back to plain letters, so keyword screens and length checks see ordinary text. */
export function toPlain(s: string): string {
  let out = ''
  for (const ch of s) {
    const c = ch.codePointAt(0)!
    if (c >= BOLD_UP && c < BOLD_UP + 26) out += String.fromCharCode(65 + c - BOLD_UP)
    else if (c >= BOLD_LOW && c < BOLD_LOW + 26) out += String.fromCharCode(97 + c - BOLD_LOW)
    else if (c >= BOLD_DIGIT && c < BOLD_DIGIT + 10) out += String.fromCharCode(48 + c - BOLD_DIGIT)
    else out += ch
  }
  return out
}

const camel = (tag: string) => {
  // "azure ai" -> #AzureAi; a word the writer already capitalised (#AIAgents) is kept as written.
  const words = tag.replace(/^#/, '').split(/[^A-Za-z0-9]+/).filter(Boolean)
  const body = words.map(w => (/[A-Z]/.test(w) ? w : w.charAt(0).toUpperCase() + w.slice(1))).join('')
  return `#${/^[A-Za-z]/.test(body) ? body : `Tag${body}`}`
}

export function extractHashtags(text: string): string[] {
  const seen = new Set<string>(), out: string[] = []
  for (const m of text.matchAll(/(^|[\s(])#([A-Za-z][A-Za-z0-9_]{1,40})/g)) {
    const t = camel(`#${m[2]}`)
    if (!seen.has(t.toLowerCase())) { seen.add(t.toLowerCase()); out.push(t) }
  }
  return out
}

export interface FormatOptions {
  /** Hashtags to add when the post has none (for example from the article's tags). */
  fallbackHashtags?: string[]
}

export function formatForLinkedIn(raw: string, opts: FormatOptions = {}): string {
  let t = (raw || '').replace(/\r\n?/g, '\n')

  // **bold** -> Unicode bold. The markers are what the AI writers and the editor type.
  t = t.replace(/\*\*([^*\n][^*]*?)\*\*/g, (_m, s: string) => toBold(s))

  // Hashtags move to one final line, de-duplicated and capped.
  const tags = extractHashtags(t)
  t = t.replace(/(^|[\s(])#[A-Za-z][A-Za-z0-9_]{1,40}/g, (_m, pre: string) => pre).replace(/[ \t]+\n/g, '\n')
  const finalTags = (tags.length ? tags : (opts.fallbackHashtags || []).map(camel)).slice(0, MAX_HASHTAGS)

  // Bullets: hyphen, asterisk and dot bullets become one quiet mark.
  t = t.replace(/^[ \t]*[-*•▪▸][ \t]+/gm, '▪ ')

  // Only the professional symbols stay, and no more than a few of them.
  let kept = 0
  t = t.replace(/\p{Extended_Pictographic}️?/gu, m => {
    const base = m.replace(/️/g, '')
    if (base === '▪' || base === '▸' || base === '•') return m // our own bullet marks are not emojis
    if (ALLOWED_EMOJI.includes(base) && kept < MAX_EMOJI) { kept++; return m }
    return ''
  })

  // Tidy spacing: no trailing spaces, at most one blank line between paragraphs, no stray leading blank lines.
  t = t.replace(/[ \t]+$/gm, '').replace(/\n{3,}/g, '\n\n').replace(/[ \t]{2,}/g, ' ').trim()
  // A lone "Read the full article:" style line keeps its link on the same line; nothing else to do for URLs.

  const tagLine = finalTags.join(' ')
  let out = tagLine ? `${t}\n\n${tagLine}` : t
  if ([...out].length > LIMIT) {
    // Trim the body, never the hashtags.
    const room = LIMIT - [...tagLine].length - 3
    out = `${[...t].slice(0, room).join('').replace(/\s+\S*$/, '')}…${tagLine ? `\n\n${tagLine}` : ''}`
  }
  return out
}

/** The instructions given to every model that writes a LinkedIn post, so drafts arrive in the same shape. */
export const LINKEDIN_STYLE_GUIDE = `Format for LinkedIn, which has no rich text:
- First line is the hook, wrapped in **double asterisks** so it becomes bold.
- Short paragraphs of one or two sentences with a blank line between them.
- Use lines starting with "- " for lists; they become tidy bullet marks. Wrap a key phrase or label in **double asterisks** at most three times.
- Keep it sober. Use the light bulb 💡 at most once, for the single key insight. For structure prefer plain typographic marks: → for a takeaway, ◆ for a short section label, ✓ for a checklist item. Never any other emoji: no faces, flames, rockets, hands, charts or coloured boxes.
- Finish with one line of 3 to 5 relevant hashtags in CamelCase (for example #AIAgents #AzureAI).`
