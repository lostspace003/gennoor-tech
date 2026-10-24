import React from 'react'
import ChatMarkdown, { renderInline } from './ChatMarkdown'

/**
 * Lesson and quiz text, written as plain markdown in the course package: paragraphs, bullet and
 * numbered lists, **bold**, `inline code`, ```fenced code blocks``` and links. Nothing is passed to
 * the page as HTML.
 */
export function RichText({ text, className = '' }: { text: string; className?: string }) {
  return (
    <div className={className}>
      <ChatMarkdown text={text} />
    </div>
  )
}

/** One line of rich text with no block around it, for short answers and labels. */
export function RichInline({ text }: { text: string }) {
  return <>{renderInline(text, 'ri')}</>
}

const ABBREVIATION = /(?:\be\.g|\bi\.e|\bvs|\betc|\bDr|\bMr|\bMrs|\bNo|\bFig)\.$/i

/**
 * Descriptions written before packages carried structure arrive as one long paragraph. Give them
 * paragraph breaks every couple of sentences so they read like text. Text that already has line
 * breaks (lists, headings, several paragraphs) is left exactly as written.
 */
export function paragraphize(text: string, maxChars = 300): string {
  const t = (text || '').trim()
  if (!t || t.includes('\n') || t.length < maxChars + 40) return t

  const sentences: string[] = []
  let start = 0
  const re = /[.!?]["')\]]?\s+(?=["'(A-Z0-9])/g
  let m: RegExpExecArray | null
  while ((m = re.exec(t))) {
    const end = m.index + m[0].trimEnd().length
    if (ABBREVIATION.test(t.slice(Math.max(0, end - 8), end))) continue
    sentences.push(t.slice(start, end))
    start = m.index + m[0].length
  }
  sentences.push(t.slice(start))
  if (sentences.length < 3) return t

  const paragraphs: string[] = []
  let cur = ''
  for (const s of sentences) {
    if (cur && cur.length + 1 + s.length > maxChars) { paragraphs.push(cur); cur = s }
    else cur = cur ? `${cur} ${s}` : s
  }
  if (cur) paragraphs.push(cur)
  return paragraphs.join('\n\n')
}
