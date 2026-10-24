// Pure helpers for Search Console keyword rows. No imports, so scripts can use them too.
export interface GscRow {
  keys: string[] // [query, page]
  clicks: number
  impressions: number
  ctr: number
  position: number
}

export interface KeywordRow {
  query: string
  page: string
  clicks: number
  impressions: number
  ctr: number
  position: number
  /** ranks on page 1 to 2 with real demand: the cheapest wins */
  strikingDistance: boolean
}

export const STRIKING = { minPosition: 8, maxPosition: 20, minImpressions: 20 }

export function toKeywordRows(rows: GscRow[]): KeywordRow[] {
  return rows.map(r => ({
    query: r.keys[0] || '',
    page: r.keys[1] || '',
    clicks: r.clicks,
    impressions: r.impressions,
    ctr: r.ctr,
    position: r.position,
    strikingDistance: r.position >= STRIKING.minPosition && r.position <= STRIKING.maxPosition && r.impressions >= STRIKING.minImpressions,
  }))
}

/** Top queries per page, best first, with striking-distance ones flagged. */
export function groupByPage(rows: KeywordRow[], perPage = 8): { page: string; clicks: number; impressions: number; queries: KeywordRow[] }[] {
  const map = new Map<string, KeywordRow[]>()
  for (const r of rows) {
    if (!map.has(r.page)) map.set(r.page, [])
    map.get(r.page)!.push(r)
  }
  return [...map.entries()]
    .map(([page, qs]) => {
      qs.sort((a, b) => b.impressions - a.impressions)
      return {
        page,
        clicks: qs.reduce((n, q) => n + q.clicks, 0),
        impressions: qs.reduce((n, q) => n + q.impressions, 0),
        queries: qs.slice(0, perPage),
      }
    })
    .sort((a, b) => b.impressions - a.impressions)
}

const STOP = new Set(['the', 'a', 'an', 'and', 'or', 'of', 'to', 'for', 'in', 'on', 'with', 'how', 'what', 'is', 'are', 'your', 'you', 'build', 'ship', 'course'])

export function tokens(text: string): string[] {
  return text.toLowerCase().replace(/[^a-z0-9+#. -]/g, ' ').split(/\s+/).filter(t => t.length > 1 && !STOP.has(t))
}

/** Queries that belong to a course: on its page, or sharing words with its title and topics. */
export function matchCourseQueries(rows: KeywordRow[], slug: string, title: string, topics: string[]): KeywordRow[] {
  const words = new Set([...tokens(title), ...topics.flatMap(tokens)])
  const seen = new Map<string, KeywordRow>()
  for (const r of rows) {
    const onPage = r.page.includes(`/studio/${slug}`)
    const overlap = tokens(r.query).filter(t => words.has(t)).length
    if (!onPage && overlap < 1) continue
    const cur = seen.get(r.query)
    if (!cur || r.impressions > cur.impressions) seen.set(r.query, r)
  }
  return [...seen.values()].sort((a, b) => b.impressions - a.impressions)
}

function titleCase(q: string) {
  return q.replace(/\b([a-z])/g, m => m.toUpperCase()).replace(/\bAi\b/g, 'AI')
}

/** A title, description and H2 set built from real queries. Suggestions only; a person decides. */
export function buildBrief(title: string, subtitle: string, queries: KeywordRow[]) {
  const top = queries.slice(0, 12)
  const striking = top.filter(q => q.strikingDistance)
  const lead = (striking[0] || top[0])?.query
  const words = [...new Set(top.flatMap(q => tokens(q.query)))].slice(0, 8)
  // Keep it under about 60 characters, cut at a word, never mid-word.
  const fit = (s: string, max: number) => (s.length <= max ? s : s.slice(0, max).replace(/\s+\S*$/, '').replace(/[\s:|,-]+$/, ''))
  const shortTitle = title.replace(/^([A-Z]{1,4}-?\d{2,4}):.*$/, '$1')
  const suggestedTitle = lead ? fit(`${shortTitle}: ${titleCase(lead)}`, 60) : fit(title, 60)
  const suggestedDescription = `${subtitle} Covers ${words.slice(0, 5).join(', ')}. Learn on Gennoor Learning Studio.`.slice(0, 300)
  const h2 = top
    .filter(q => q.query.split(' ').length >= 2)
    .slice(0, 6)
    .map(q => titleCase(q.query))
  return { suggestedTitle, suggestedDescription, h2, striking }
}
