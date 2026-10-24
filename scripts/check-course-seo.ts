/*
 * SEO check for Learning Studio course pages. Run it for every new course.
 *
 *   node --experimental-strip-types scripts/check-course-seo.ts                  # live site, every course in the sitemap
 *   node --experimental-strip-types scripts/check-course-seo.ts ai-103 ai-500    # only these slugs
 *   BASE=http://localhost:3111 node --experimental-strip-types scripts/check-course-seo.ts
 *
 * Exits 1 when any course has a problem, so it can sit in CI or a publish checklist.
 */
const BASE = (process.env.BASE || 'https://gennoor.com').replace(/\/$/, '')

async function get(path: string) {
  const res = await fetch(`${BASE}${path}`, { headers: { 'User-Agent': 'course-seo-check' }, redirect: 'follow' })
  return { status: res.status, text: await res.text() }
}

function meta(html: string, attr: 'name' | 'property', key: string): string {
  const re = new RegExp(`<meta[^>]+${attr}=["']${key}["'][^>]*content=["']([^"']*)["']`, 'i')
  const re2 = new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]*${attr}=["']${key}["']`, 'i')
  return (html.match(re)?.[1] || html.match(re2)?.[1] || '').trim()
}

function jsonLd(html: string): Record<string, unknown>[] {
  const out: Record<string, unknown>[] = []
  for (const m of html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const v = JSON.parse(m[1])
      for (const x of Array.isArray(v) ? v : [v]) out.push(x)
    } catch {
      out.push({ '@type': '__invalid_json__' })
    }
  }
  return out
}

async function main() {
  const problems: string[] = []
  const sm = await get('/sitemap.xml')
  if (sm.status !== 200) {
    console.error(`sitemap.xml: HTTP ${sm.status}`)
    process.exit(1)
  }
  const robots = await get('/robots.txt')
  const entries = [...sm.text.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(m => ({
    loc: m[1].match(/<loc>(.*?)<\/loc>/)?.[1] || '',
    lastmod: m[1].match(/<lastmod>(.*?)<\/lastmod>/)?.[1] || '',
  }))
  const inMap = new Map(entries.map(e => [e.loc.replace(/^https?:\/\/[^/]+/, ''), e]))

  let slugs = process.argv.slice(2)
  if (slugs.length === 0) slugs = [...inMap.keys()].map(p => p.match(/^\/studio\/([^/]+)$/)?.[1] || '').filter(Boolean)
  if (slugs.length === 0) {
    console.error('No /studio/<slug> pages found in the sitemap')
    process.exit(1)
  }

  for (const slug of slugs) {
    const path = `/studio/${slug}`
    const bad: string[] = []
    const entry = inMap.get(path)
    if (!entry) bad.push('missing from sitemap.xml')
    else if (!entry.lastmod) bad.push('sitemap entry has no lastmod')
    if (/Disallow:\s*\/studio/i.test(robots.text)) bad.push('robots.txt blocks /studio')

    const page = await get(path)
    if (page.status !== 200) {
      bad.push(`page returns HTTP ${page.status}`)
    } else {
      const html = page.text
      const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() || ''
      const desc = meta(html, 'name', 'description')
      const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)?.[1] || ''
      if (!title) bad.push('no <title>')
      else if (title.length > 70) bad.push(`title is ${title.length} chars (keep under 70)`)
      if (!desc) bad.push('no meta description')
      else if (desc.length < 70 || desc.length > 320) bad.push(`meta description is ${desc.length} chars (aim 70 to 320)`)
      if (canonical !== `https://gennoor.com${path}`) bad.push(`canonical is "${canonical || 'missing'}"`)
      if (!meta(html, 'property', 'og:title')) bad.push('no og:title')
      if (!meta(html, 'property', 'og:image')) bad.push('no og:image')
      if (!meta(html, 'name', 'twitter:card')) bad.push('no twitter:card')
      if ((html.match(/<h1[\s>]/g) || []).length !== 1) bad.push('page should have exactly one <h1>')
      const ld = jsonLd(html)
      const types = ld.map(x => String(x['@type']))
      if (types.includes('__invalid_json__')) bad.push('a JSON-LD block is not valid JSON')
      const course = ld.find(x => x['@type'] === 'Course')
      if (!course) bad.push('no Course structured data')
      else {
        for (const k of ['name', 'description', 'provider', 'courseCode', 'educationalLevel', 'hasCourseInstance']) {
          if (!course[k]) bad.push(`Course schema is missing ${k}`)
        }
      }
      if (!types.includes('BreadcrumbList')) bad.push('no BreadcrumbList structured data')
      if (/Curriculum/.test(html) && !/<li[^>]*>[\s\S]*?<span[^>]*>[^<]{4,}<\/span>/.test(html)) bad.push('curriculum lessons are not in the HTML')
      if (!/Curriculum/.test(html)) bad.push('no Curriculum section in the HTML')
      const og = meta(html, 'property', 'og:image')
      if (og) {
        const img = await fetch(og.startsWith('http') ? og : `${BASE}${og}`).catch(() => null)
        if (!img || img.status !== 200 || !(img.headers.get('content-type') || '').startsWith('image/')) bad.push('og:image does not load as an image')
      }
      const hasVideo = types.includes('VideoObject')
      console.log(`  ${slug}: title ${title.length} chars, description ${desc.length} chars, schema [${types.join(', ')}]${hasVideo ? '' : ' (no preview video)'}`)
    }
    if (bad.length) {
      console.log(`✗ ${slug}`)
      for (const b of bad) console.log(`    - ${b}`)
      problems.push(...bad.map(b => `${slug}: ${b}`))
    } else {
      console.log(`✓ ${slug}`)
    }
  }
  console.log(problems.length ? `\n${problems.length} problem(s)` : `\nAll ${slugs.length} course page(s) pass`)
  process.exit(problems.length ? 1 : 0)
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
