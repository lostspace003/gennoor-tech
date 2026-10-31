// Turns a LinkedIn hub result into clean, readable text (shown on screen, copied, or emailed) and back into tidy HTML.
// Pure and shared by the browser and the server so what you see is what you copy and what arrives in the email.

const pretty = (k: string) => k.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase())
const tidy = (s: string) => s.replace(/\r/g, '').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim()
const abs = (u: string) => (u.startsWith('http') ? u : `https://www.linkedin.com${u.startsWith('/') ? '' : '/'}${u}`)

/** Accepts what people naturally paste (a profile link, @name, a company URL) and returns just the id the tool needs. */
export function normalizeArg(name: string, v: any): any {
  if (typeof v !== 'string') return v
  let s = v.trim()
  if (name === 'linkedin_username') { const m = s.match(/\/in\/([^/?#\s]+)/); s = (m ? decodeURIComponent(m[1]) : s).replace(/^@/, '') }
  if (name === 'company_name') { const m = s.match(/\/company\/([^/?#\s]+)/); if (m) s = decodeURIComponent(m[1]) }
  if (name === 'job_id') { const m = s.match(/(?:\/jobs\/view\/|currentJobId=)(\d+)/); if (m) s = m[1] }
  if (name === 'thread_id') { const m = s.match(/\/messaging\/thread\/([^/?#\s]+)/); if (m) s = decodeURIComponent(m[1]) }
  return s
}

function collectRefs(v: any, out: { url: string; text?: string; context?: string }[] = []) {
  if (!v) return out
  if (Array.isArray(v)) v.forEach(x => (x && typeof x === 'object' && typeof x.url === 'string' ? out.push(x) : collectRefs(x, out)))
  else if (typeof v === 'object') Object.values(v).forEach(x => collectRefs(x, out))
  return out
}

function plainValue(v: any, depth = 0): string {
  if (v == null) return ''
  if (typeof v !== 'object') return String(v)
  if (Array.isArray(v)) return v.map(x => (typeof x === 'object' ? plainValue(x, depth + 1) : `- ${x}`)).filter(Boolean).join('\n')
  return Object.entries(v).filter(([, x]) => x != null && x !== '').map(([k, x]) => (typeof x === 'object' ? `${'#'.repeat(Math.min(4, depth + 3))} ${pretty(k)}\n${plainValue(x, depth + 1)}` : `${pretty(k)}: ${x}`)).join('\n')
}

/** Markdown-lite: `# title`, `## section`, `- bullet`, paragraphs. */
export function resultToMarkdown(title: string, args: Record<string, any>, data: any): string {
  const out: string[] = [`# ${title}`]
  const asked = Object.entries(args).filter(([, v]) => v !== '' && v != null && v !== false).map(([k, v]) => `${pretty(k)}: ${v === true ? 'yes' : v}`).join(' · ')
  if (asked) out.push(`_${asked}_`)
  if (typeof data === 'string') return tidy([...out, data].join('\n\n'))
  if (data?.text) return tidy([...out, String(data.text)].join('\n\n'))
  const sections: Record<string, string> = data && typeof data.sections === 'object' && !Array.isArray(data.sections) ? data.sections : {}
  const refs = collectRefs(data?.references ?? (Array.isArray(data) ? data : undefined))
  const scalars = data && typeof data === 'object' && !Array.isArray(data) ? Object.entries(data).filter(([k, v]) => !['sections', 'references'].includes(k) && ['string', 'number', 'boolean'].includes(typeof v)) : []
  if (scalars.length) out.push(scalars.map(([k, v]) => `- ${pretty(k)}: ${v}`).join('\n'))
  for (const [k, text] of Object.entries(sections)) if (text) out.push(`## ${pretty(k)}\n${tidy(String(text))}`)
  if (refs.length) {
    out.push(`## Links (${refs.length})\n${refs.slice(0, 120).map(r => `- ${(r.text || r.url).replace(/\s+/g, ' ').trim()}${r.context ? ` — ${r.context.replace(/\s+/g, ' ').trim().slice(0, 160)}` : ''}\n  ${abs(r.url)}`).join('\n')}`)
  }
  if (!Object.keys(sections).length && !refs.length && !scalars.length) out.push(plainValue(data))
  return tidy(out.join('\n\n'))
}

const esc = (s: string) => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!)
const inline = (s: string) => esc(s).replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" style="color:#1d4ed8">$1</a>').replace(/^_(.+)_$/, '<span style="color:#6b7280">$1</span>')

export function markdownToHtml(md: string): string {
  const parts: string[] = []
  let list: string[] = []
  const flush = () => { if (list.length) { parts.push(`<ul style="margin:6px 0 14px;padding-left:20px">${list.join('')}</ul>`); list = [] } }
  for (const raw of md.split('\n')) {
    const line = raw.trimEnd()
    if (!line.trim()) { flush(); continue }
    if (line.startsWith('# ')) { flush(); parts.push(`<h2 style="font-size:20px;margin:0 0 6px;color:#111827">${inline(line.slice(2))}</h2>`) }
    else if (line.startsWith('## ')) { flush(); parts.push(`<h3 style="font-size:15px;margin:18px 0 6px;padding-bottom:4px;border-bottom:1px solid #e5e7eb;color:#111827">${inline(line.slice(3))}</h3>`) }
    else if (/^#{3,4} /.test(line)) { flush(); parts.push(`<h4 style="font-size:13px;margin:12px 0 4px;color:#374151">${inline(line.replace(/^#+ /, ''))}</h4>`) }
    else if (line.startsWith('- ')) list.push(`<li style="margin:3px 0">${inline(line.slice(2))}</li>`)
    else if (line.startsWith('  ') && list.length) list[list.length - 1] = list[list.length - 1].replace('</li>', `<br>${inline(line.trim())}</li>`)
    else { flush(); parts.push(`<p style="margin:6px 0;line-height:1.55">${inline(line)}</p>`) }
  }
  flush()
  return `<div style="font-family:Arial,sans-serif;font-size:14px;color:#1f2937;max-width:680px">${parts.join('')}<p style="color:#9ca3af;font-size:12px;margin-top:22px">Sent from the Gennoor admin centre, LinkedIn hub.</p></div>`
}
