/*
 * Keyword brief for a course, built from real Search Console queries.
 *
 *   GSC_OAUTH_CLIENT_ID=... GSC_OAUTH_CLIENT_SECRET=... GSC_OAUTH_REFRESH_TOKEN=... \
 *     node --experimental-strip-types scripts/keyword-brief.ts ai-103
 *
 * Prints the matching real queries (clicks, impressions, position, striking distance) and a suggested
 * title, description and H2 set. Suggestions only: a person decides what goes on the page.
 * Without credentials it says so and prints nothing else.
 */
import { buildBrief, matchCourseQueries, toKeywordRows, type GscRow } from '../src/lib/gsc-keywords-core.ts'

const SITE = 'sc-domain:gennoor.com'
const BASE = (process.env.BASE || 'https://gennoor.com').replace(/\/$/, '')

async function token(): Promise<string | null> {
  const { GSC_OAUTH_CLIENT_ID, GSC_OAUTH_CLIENT_SECRET, GSC_OAUTH_REFRESH_TOKEN } = process.env
  if (!GSC_OAUTH_CLIENT_ID || !GSC_OAUTH_CLIENT_SECRET || !GSC_OAUTH_REFRESH_TOKEN) return null
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: GSC_OAUTH_CLIENT_ID, client_secret: GSC_OAUTH_CLIENT_SECRET, refresh_token: GSC_OAUTH_REFRESH_TOKEN, grant_type: 'refresh_token' }),
  })
  if (!res.ok) throw new Error(`OAuth refresh failed: HTTP ${res.status}`)
  return ((await res.json()) as { access_token: string }).access_token
}

async function main() {
  const slug = process.argv[2]
  if (!slug) {
    console.error('Usage: node --experimental-strip-types scripts/keyword-brief.ts <course-slug>')
    process.exit(1)
  }
  const cat = (await (await fetch(`${BASE}/api/lms/catalog`)).json()) as { courses: { slug: string; title: string; subtitle: string; topics: string[]; vendor: string }[] }
  const course = cat.courses.find(c => c.slug === slug)
  if (!course) {
    console.error(`No published course "${slug}" at ${BASE}`)
    process.exit(1)
  }
  const t = await token()
  if (!t) {
    console.log('No Search Console credentials in the environment (GSC_OAUTH_CLIENT_ID, GSC_OAUTH_CLIENT_SECRET, GSC_OAUTH_REFRESH_TOKEN).')
    console.log('Nothing to pull. Set them (same values as the SEO Re-index workflow) and run again.')
    return
  }
  const day = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString().slice(0, 10)
  const res = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ startDate: day(90), endDate: day(1), dimensions: ['query', 'page'], rowLimit: 5000 }),
  })
  if (!res.ok) throw new Error(`Search Console HTTP ${res.status}`)
  const rows = toKeywordRows(((await res.json()) as { rows?: GscRow[] }).rows || [])
  const topics = [...course.topics, course.vendor].filter(Boolean)
  const matches = matchCourseQueries(rows, slug, course.title, topics)
  console.log(`\n${course.title} (${slug}), last 90 days\n`)
  if (matches.length === 0) {
    console.log('No matching queries yet. The page may be new: check again in a few weeks.')
    return
  }
  console.log('query'.padEnd(46), 'clicks', 'impr.', 'pos.', '')
  for (const q of matches.slice(0, 25)) {
    console.log(q.query.slice(0, 44).padEnd(46), String(Math.round(q.clicks)).padStart(6), String(Math.round(q.impressions)).padStart(5), q.position.toFixed(1).padStart(5), q.strikingDistance ? ' striking distance' : '')
  }
  const brief = buildBrief(course.title, course.subtitle, matches)
  console.log('\nSuggested title      :', brief.suggestedTitle)
  console.log('Suggested description:', brief.suggestedDescription)
  console.log('Suggested H2s        :')
  for (const h of brief.h2) console.log('  -', h)
  if (brief.striking.length) console.log('\nWork on these first (position 8 to 20):', brief.striking.slice(0, 5).map(q => q.query).join(' | '))
}

main().catch(e => {
  console.error(e instanceof Error ? e.message : e)
  process.exit(1)
})
