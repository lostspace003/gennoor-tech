/**
 * What a search engine and a shared link read in the head of a page: the title and its length,
 * the description and its length, the page's one true address, the words and picture a shared
 * link shows, the feed, the number of main headings, and the kinds of structured data.
 *
 *   node scripts/seo-head.mjs http://localhost:3111 home training resources/blog     this machine
 *   node scripts/seo-head.mjs https://gennoor.com home ai-weekend                    the live site
 *
 * Pages are named without the leading slash, and the home page is "home" (Git Bash on Windows
 * rewrites anything that starts with a slash). The rules these lines are checked against are
 * in docs/SEO.md.
 */
const [base, ...paths] = process.argv.slice(2)
const pick = (html, re) => { const m = html.match(re); return m ? m[1].replace(/&amp;/g, '&').replace(/&#x27;/g, "'").replace(/&quot;/g, '"') : '' }
for (const p of paths) {
  const url = base + (p === 'home' ? '/' : '/' + p.replace(/^\/+/, ''))
  let res
  try { res = await fetch(url, { redirect: 'manual', headers: { 'user-agent': 'Mozilla/5.0 (compatible; site-check)' } }) } catch (e) { console.log(p, 'FAILED', e.message); continue }
  if (res.status >= 300 && res.status < 400) { console.log(`${p}\n  ${res.status} -> ${res.headers.get('location')}`); continue }
  const html = await res.text()
  const title = pick(html, /<title[^>]*>([^<]*)<\/title>/)
  const desc = pick(html, /<meta name="description" content="([^"]*)"/)
  const canon = pick(html, /<link rel="canonical" href="([^"]*)"/)
  const robots = pick(html, /<meta name="robots" content="([^"]*)"/)
  const ogImg = pick(html, /<meta property="og:image" content="([^"]*)"/)
  const ogW = pick(html, /<meta property="og:image:width" content="([^"]*)"/)
  const ogH = pick(html, /<meta property="og:image:height" content="([^"]*)"/)
  const ogTitle = pick(html, /<meta property="og:title" content="([^"]*)"/)
  const ogType = pick(html, /<meta property="og:type" content="([^"]*)"/)
  const tw = pick(html, /<meta name="twitter:image" content="([^"]*)"/)
  const rss = pick(html, /<link rel="alternate" type="application\/rss\+xml"[^>]*href="([^"]*)"/)
  const h1 = (html.match(/<h1[\s>]/g) || []).length
  const types = [...html.matchAll(/"@type":"([A-Za-z]+)"/g)].map((m) => m[1])
  const ld = [...new Set(types)].join(',')
  console.log(`${p}  [${res.status}]`)
  console.log(`  title (${title.length}): ${title}`)
  console.log(`  description (${desc.length}): ${desc.slice(0, 170)}`)
  console.log(`  canonical: ${canon || 'NONE'}${robots ? ' | robots: ' + robots : ''}`)
  console.log(`  og: ${ogType} | ${ogTitle.slice(0, 60)} | image ${ogImg ? ogImg.slice(0, 90) : 'NONE'} ${ogW}x${ogH}`)
  console.log(`  twitter image: ${tw ? tw.slice(0, 80) : 'NONE'} | rss: ${rss || 'NONE'} | h1: ${h1} | structured data: ${ld || 'NONE'}`)
}
