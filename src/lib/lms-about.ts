/**
 * Turns a course description (as written for the landing page: bold or short
 * heading lines, "- " bullets, plain paragraphs) into structured blocks the
 * course page can lay out properly. Pure text in, plain data out.
 */
export type AboutItem = { label?: string; text: string }
export type AboutBlock =
  | { t: 'lead'; text: string }
  | { t: 'h'; text: string }
  | { t: 'p'; text: string }
  | { t: 'ul'; items: AboutItem[] }

const clean = (s: string) => s.replace(/\*\*/g, '').trim()

function parseItem(raw: string): AboutItem {
  const text = raw.replace(/^-\s+/, '').trim()
  // "**Design:** stateful loops ..."  or  "Module 1, Generative AI apps: a Python chat app ..."
  const m = text.match(/^\*\*([^*]+?):?\*\*:?\s*(.+)$/) || text.match(/^([^:]{3,60}):\s+(.+)$/)
  if (m && !/^\d/.test(m[1])) return { label: clean(m[1]), text: clean(m[2]) }
  return { text: clean(text) }
}

export function parseAbout(source: string): AboutBlock[] {
  const lines = source
    .replace(/\r/g, '')
    .split('\n')
    .map(l => l.trim())
    .filter(l => l && !/^[-=]{4,}$/.test(l))

  const blocks: AboutBlock[] = []
  for (const line of lines) {
    if (line.startsWith('- ')) {
      const last = blocks[blocks.length - 1]
      const item = parseItem(line)
      if (last && last.t === 'ul') last.items.push(item)
      else blocks.push({ t: 'ul', items: [item] })
      continue
    }
    const bold = line.match(/^\*\*(.+)\*\*$/)
    if (bold) {
      // A bold first line is the course promise, not a heading.
      blocks.push(blocks.length === 0 ? { t: 'lead', text: clean(bold[1]) } : { t: 'h', text: clean(bold[1]) })
      continue
    }
    const text = clean(line)
    if (text.length <= 60 && !/[.!?:]$/.test(text)) {
      blocks.push({ t: 'h', text })
      continue
    }
    blocks.push({ t: 'p', text })
  }
  return blocks
}
