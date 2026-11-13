/**
 * Turns a course description (as written for the landing page: bold or short
 * heading lines, "- " bullets, plain paragraphs) into structured blocks the
 * course page can lay out properly. Pure text in, plain data out.
 *
 * A bullet may carry points of its own, written as bullets set in under it:
 *
 *   What you build
 *   - Module 1, Generative AI apps: A Python chat app on Microsoft Foundry.
 *     - Choose, deploy and evaluate models
 *     - Call the Responses API
 *
 * That is how "What you build" should be written for every new course: a name, one line
 * that says what gets built, then three to five short points. A single long sentence with
 * commas is drawn as a paragraph, and reads like one.
 */
export type AboutItem = { label?: string; text: string; points?: string[] }
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
  const rows = source
    .replace(/\r/g, '')
    .split('\n')
    .map(raw => ({ indent: raw.match(/^[ \t]*/)![0].replace(/\t/g, '  ').length, line: raw.trim() }))
    .filter(r => r.line && !/^[-=]{4,}$/.test(r.line))

  const blocks: AboutBlock[] = []
  // How far in the bullets of the list in hand start, so a bullet set in further is a point of the one above it
  let listIndent = 0
  for (const { indent, line } of rows) {
    if (line.startsWith('- ')) {
      const last = blocks[blocks.length - 1]
      if (last && last.t === 'ul' && indent > listIndent) {
        const item = last.items[last.items.length - 1]
        ;(item.points ||= []).push(clean(line.replace(/^-\s+/, '')))
        continue
      }
      const item = parseItem(line)
      if (last && last.t === 'ul') last.items.push(item)
      else { blocks.push({ t: 'ul', items: [item] }); listIndent = indent }
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

const capital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

/**
 * The first sentence of an item, and whatever follows it. The first sentence is what gets
 * built; it is shown as the line that stands out. One sentence only: it is all "lead".
 */
export function leadAndRest(text: string): { lead: string; rest: string } {
  const t = text.trim()
  const m = t.match(/^([\s\S]+?[.!?])\s+(?=[A-Z0-9"'(])([\s\S]*)$/)
  return m ? { lead: capital(m[1]), rest: m[2].trim() } : { lead: capital(t), rest: '' }
}

/** "Module 3, Natural language" is module 3, named "Natural language". Anything else is just a name. */
export function moduleLabel(label: string): { number: string; name: string } {
  const m = label.match(/^(?:Module|Part|Chapter|Section|Week|Day)\s+(\d+)\s*[,:.-]\s*(.+)$/i)
  return m ? { number: m[1], name: capital(m[2].trim()) } : { number: '', name: label }
}
