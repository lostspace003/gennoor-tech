import React from 'react'

/**
 * Renders the assistant's answer the way it was written: headings, bold, lists, inline code,
 * code blocks and links. Nothing is passed to the page as HTML, so it is safe for any text.
 */

export function renderInline(text: string, keyBase: string): React.ReactNode[] {
  const out: React.ReactNode[] = []
  // [label](https://url), **bold**, `code`
  const re = /(\[([^\]]+)\]\((https?:\/\/[^\s)]+)\))|(\*\*([^*]+)\*\*)|(`([^`]+)`)/g
  let last = 0
  let m: RegExpExecArray | null
  let i = 0
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index))
    const key = `${keyBase}-${i++}`
    if (m[1]) out.push(<a key={key} href={m[3]} target="_blank" rel="noopener noreferrer" className="text-primary-600 underline underline-offset-2 break-words">{m[2]}</a>)
    else if (m[4]) out.push(<strong key={key} className="font-semibold">{m[5]}</strong>)
    else out.push(<code key={key} className="px-1 py-0.5 rounded bg-black/[0.06] text-[0.92em] font-mono">{m[7]}</code>)
    last = m.index + m[0].length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

function blocks(text: string, keyBase: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = []
  const lines = text.split('\n')
  let i = 0
  let n = 0
  while (i < lines.length) {
    const line = lines[i]
    if (!line.trim()) { i++; continue }
    const key = `${keyBase}-b${n++}`
    const h = /^(#{1,4})\s+(.*)$/.exec(line)
    if (h) { nodes.push(<p key={key} className="font-semibold text-gray-900 mt-3 first:mt-0">{renderInline(h[2], key)}</p>); i++; continue }
    if (/^\s*([-*•])\s+/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\s*([-*•])\s+/.test(lines[i])) { items.push(lines[i].replace(/^\s*([-*•])\s+/, '')); i++ }
      nodes.push(<ul key={key} className="list-disc pl-5 space-y-1 my-2">{items.map((t, k) => <li key={k}>{renderInline(t, `${key}-${k}`)}</li>)}</ul>)
      continue
    }
    if (/^\s*\d+[.)]\s+/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) { items.push(lines[i].replace(/^\s*\d+[.)]\s+/, '')); i++ }
      nodes.push(<ol key={key} className="list-decimal pl-5 space-y-1 my-2">{items.map((t, k) => <li key={k}>{renderInline(t, `${key}-${k}`)}</li>)}</ol>)
      continue
    }
    const para: string[] = []
    while (i < lines.length && lines[i].trim() && !/^(#{1,4})\s+/.test(lines[i]) && !/^\s*([-*•])\s+/.test(lines[i]) && !/^\s*\d+[.)]\s+/.test(lines[i])) { para.push(lines[i]); i++ }
    nodes.push(<p key={key} className="my-2 first:mt-0 last:mb-0">{renderInline(para.join(' '), key)}</p>)
  }
  return nodes
}

export default function ChatMarkdown({ text }: { text: string }) {
  const parts = text.split(/```(?:[a-zA-Z0-9_+-]*)\n?/)
  return (
    <div className="space-y-0">
      {parts.map((part, idx) =>
        idx % 2 === 1 ? (
          <pre key={idx} className="my-2 overflow-x-auto rounded-lg bg-[#0f1824] text-[#e6edf7] text-[12.5px] leading-relaxed p-3 font-mono whitespace-pre">{part.replace(/\n$/, '')}</pre>
        ) : (
          <React.Fragment key={idx}>{blocks(part, `p${idx}`)}</React.Fragment>
        ),
      )}
    </div>
  )
}
