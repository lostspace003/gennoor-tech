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

// Button and badge words LinkedIn's page puts between results; they are noise once the result is on our screen.
const NOISE = /^(connect|follow|following|message|save|pending|subscribe|view full profile|promoted|status is (online|offline)|•|1st|2nd|3rd\+?|… more|\.\.\. more|see more|load more|next|previous|\d{1,2})$/i
const DEGREE = /^•\s*(1st|2nd|3rd\+?)$/i
const NAME_DEGREE = /^(.+?)\s*•\s*(1st|2nd|3rd\+?)$/i

/** LinkedIn page text, minus invisible characters and the page furniture after the last result (feedback prompt, page numbers). */
export function cleanPageText(text: string): string {
  let t = text.replace(/\r/g, '').replace(/[​‌‍⁠﻿]/g, '').replace(/ /g, ' ')
  const cut = t.search(/\n\s*Are these results helpful\?/)
  if (cut >= 0) t = t.slice(0, cut)
  t = t.replace(/^About [\d,]+ results\s*\n/, '')
  return t.split('\n').map(l => l.trim()).join('\n').replace(/\n{3,}/g, '\n\n').trim()
}

/** The page text of a search result, wherever the connector put it. */
export function searchText(data: any): string | null {
  if (typeof data?.text === 'string') return data.text
  const s = data?.sections
  if (s && typeof s === 'object') { const v = s.search_results ?? Object.values(s).find(x => typeof x === 'string'); if (typeof v === 'string') return v }
  return null
}

/** One result, whatever the search: a title, a few facts, optional body, and the facets the filter bar offers. */
export interface Card { title: string; badge?: string; sub?: string; meta: string[]; body?: string; url?: string; tags?: string[]; facets: Record<string, string>; person?: PersonRow }

const refList = (data: any): { kind?: string; url: string; text?: string }[] => collectRefs(data?.references ?? (Array.isArray(data) ? data : undefined))
const AGE = /^(\d+\s?(s|m|h|d|w|mo|yr|y)|now)\b(\s*•.*)?$/i

/** Search posts: one card per "Feed post" with author, their headline, age, the post text, hashtags and the post link. */
export function parsePosts(text: string, data?: any): Card[] | null {
  const parts = cleanPageText(text).split(/^Feed post$/m).map(p => p.trim()).filter(Boolean)
  if (parts.length < 1 || !/^Feed post$/m.test(text)) return null
  const links = refList(data).filter(r => r.kind === 'feed_post' || /\/posts\/|\/feed\/update\//.test(r.url)).map(r => abs(r.url))
  const cards: Card[] = []
  parts.forEach((p, i) => {
    const lines = p.split('\n').map(l => l.trim()).filter(l => l && !NOISE.test(l) && !DEGREE.test(l))
    if (!lines.length) return
    const author = lines[0].replace(NAME_DEGREE, '$1')
    const ageAt = lines.findIndex(l => AGE.test(l))
    const headline = ageAt > 1 ? lines.slice(1, ageAt).join(' · ') : ''
    const age = ageAt >= 0 ? lines[ageAt].replace(/\s*•\s*/, ' · ') : ''
    const body = (ageAt >= 0 ? lines.slice(ageAt + 1) : lines.slice(1)).join('\n')
    const tags = Array.from(new Set((body.match(/#[\p{L}\p{N}_]+/gu) || []).map(x => x.toLowerCase())))
    const prose = body.replace(/(^|\s)#[\p{L}\p{N}_]+/gu, '').replace(/\n{2,}/g, '\n').trim()
    cards.push({ title: author, sub: headline, meta: [age].filter(Boolean), body: prose, url: links[i], tags, facets: { Author: author, Posted: age.split(' · ')[0] } })
  })
  return cards.length ? cards : null
}

/** Search companies: name, industry, place, blurb and followers. A result ends at its followers line. */
export function parseCompanies(text: string, data?: any): Card[] | null {
  const lines = cleanPageText(text).split('\n').filter(Boolean)
  if (lines.filter(l => /followers$/i.test(l)).length < 2) return null
  const refs = refList(data).filter(r => r.kind === 'company' || r.kind === 'school')
  const cards: Card[] = []
  let cur: string[] = []
  for (const l of lines) {
    cur.push(l)
    if (!/followers$/i.test(l)) continue
    const head: string[] = []
    let i = 0
    for (; i < cur.length && !/^follow(ing)?$/i.test(cur[i]); i++) if (!/^Page by /i.test(cur[i]) && !/(your local time)|online event/i.test(cur[i])) head.push(cur[i])
    if (head.length > 3) head.splice(0, head.length - 3)
    const blurb = cur.slice(i + 1, -1).filter(x => !NOISE.test(x)).join(' ')
    const [name = '', industry = '', place = ''] = head
    const [social, followers] = l.includes(' · ') ? [l.slice(0, l.lastIndexOf(' · ')), l.slice(l.lastIndexOf(' · ') + 3)] : ['', l]
    const ref = refs.find(r => r.text && (r.text.trim() === name || r.text.includes(name)))
    if (name) cards.push({ title: name, sub: industry, meta: [place, followers, social].filter(Boolean), body: blurb, url: ref ? abs(ref.url) : undefined, facets: { Industry: industry, Location: place } })
    cur = []
  }
  return cards.length ? cards : null
}

/** People rows as cards, so all three searches share one filterable view. */
export function peopleCards(rows: PersonRow[]): Card[] {
  return rows.map(p => ({ person: p, title: p.name, badge: p.degree, sub: p.title + (p.company ? ` at ${p.company}` : ''), meta: [p.location, p.mutual].filter(Boolean), url: p.linkedin, facets: { Location: p.location, Company: p.company, Connection: p.degree, ...(p.group ? { Searched: p.group } : {}) } }))
}

/** Structured results for any search the hub knows how to read; null means show the plain text instead. */
export function resultCards(data: any): Card[] | null {
  const text = searchText(data)
  if (!text) return null
  if (/^Feed post$/m.test(text)) return parsePosts(text, data)
  const rows = parsePeople(text)
  if (rows) {
    const norm = (x: string) => x.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
    const prof = refList(data).filter(x => /\/in\//.test(x.url))
    return peopleCards(rows.map(p => { const hit = prof.find(x => x.text && norm(x.text).startsWith(norm(p.name))); return { ...p, linkedin: hit ? abs(hit.url).split('?')[0] : undefined } }))
  }
  return parseCompanies(text, data)
}

export function cardsToMarkdown(cards: Card[]): string {
  return cards.map(c => [`#### ${c.title}${c.badge ? ` · ${c.badge}` : ''}`, c.sub && `- ${c.sub}`, ...c.meta.map(m => `- ${m}`), c.body && `- ${c.body.replace(/\n/g, ' ').slice(0, 400)}`, c.tags?.length ? `- ${c.tags.join(' ')}` : '', c.url && `  ${c.url}`].filter(Boolean).join('\n')).join('\n\n')
}

export interface PersonRow { name: string; degree: string; title: string; company: string; location: string; current: string; mutual: string; linkedin?: string; group?: string }

/** The page text of a people search is one line per fact; this reads it into one record per person (with the place heading it sat under). */
export function parsePeople(text: string): PersonRow[] | null {
  // "Name • 2nd" can arrive on one line or two; split it so the degree always sits on its own line.
  const lines = cleanPageText(text).split('\n').flatMap(l => { const m = l.match(NAME_DEGREE); return m && !l.startsWith('•') ? [m[1].trim(), `• ${m[2]}`] : [l] }).filter(Boolean)
  if (lines.filter(l => DEGREE.test(l)).length < 2) return null
  const blocks: { name: string; deg: string; rest: string[]; group?: string }[] = []
  let group: string | undefined
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i]
    if (DEGREE.test(l) && i > 0) {
      // The name is the line just before the degree badge; it was filed under the previous block, so take it back.
      const cur = blocks[blocks.length - 1]
      const name = cur && cur.rest.length ? cur.rest.pop()! : lines[i - 1]
      blocks.push({ name, deg: l.replace('•', '').trim(), rest: [], group })
    } else if (l.startsWith('## ')) { group = l.slice(3).trim(); blocks.push({ name: '', deg: '', rest: [], group }) }
    else if (blocks.length && !NOISE.test(l)) blocks[blocks.length - 1].rest.push(l)
  }
  const out: PersonRow[] = []
  for (const bl of blocks) {
    if (!bl.name) continue
    const [headline = '', place = '', ...more] = bl.rest
    const current = more.find(m => /^(Current|Past):/i.test(m))?.replace(/^Current:\s*/i, '') || ''
    const mutual = more.find(m => /mutual connection/i.test(m)) || ''
    const src = current || headline
    const at = src.match(/^(.*?)\s+(?:at|@)\s+(.+)$/i)
    out.push({ name: bl.name, degree: bl.deg, title: at ? at[1] : headline, company: at ? at[2].trim() : '', location: place, current, mutual, group: bl.group })
  }
  return out.length ? out : null
}

function groupPeople(text: string): string | null {
  const rows = parsePeople(text)
  if (!rows) return null
  const out: string[] = []
  let g: string | undefined
  for (const p of rows) {
    if (p.group !== g && p.group) { out.push(`## ${p.group}`); g = p.group }
    out.push(`#### ${p.name} · ${p.degree}`)
    out.push([p.title || '', p.company ? `at ${p.company}` : p.current && `Current: ${p.current}`, p.location && `Based in ${p.location}`, p.mutual].filter(Boolean).map(x => `- ${x}`).join('\n'))
  }
  return out.join('\n')
}

/** Markdown-lite: `# title`, `## section`, `- bullet`, paragraphs. */
export function resultToMarkdown(title: string, args: Record<string, any>, data: any): string {
  const out: string[] = [`# ${title}`]
  const asked = Object.entries(args).filter(([, v]) => v !== '' && v != null && v !== false).map(([k, v]) => `${pretty(k)}: ${v === true ? 'yes' : v}`).join(' · ')
  if (asked) out.push(`_${asked}_`)
  if (typeof data === 'string') return tidy([...out, data].join('\n\n'))
  const cards = resultCards(data)
  if (cards) return tidy([...out, `## Results (${cards.length})`, cardsToMarkdown(cards)].join('\n\n'))
  if (data?.text) return tidy([...out, groupPeople(String(data.text)) ?? cleanPageText(String(data.text))].join('\n\n'))
  const sections: Record<string, string> = data && typeof data.sections === 'object' && !Array.isArray(data.sections) ? data.sections : {}
  const refs = collectRefs(data?.references ?? (Array.isArray(data) ? data : undefined))
  const scalars = data && typeof data === 'object' && !Array.isArray(data) ? Object.entries(data).filter(([k, v]) => !['sections', 'references'].includes(k) && ['string', 'number', 'boolean'].includes(typeof v)) : []
  if (scalars.length) out.push(scalars.map(([k, v]) => `- ${pretty(k)}: ${v}`).join('\n'))
  for (const [k, text] of Object.entries(sections)) if (text) out.push(`## ${pretty(k)}\n${cleanPageText(String(text))}`)
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
