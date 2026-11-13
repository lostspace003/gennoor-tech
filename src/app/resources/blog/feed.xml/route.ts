import { blogPostsMeta } from '@/data/blog-posts'
import { siteConfig } from '@/lib/site-config'
import { FEED_PATH, metaDescription } from '@/lib/seo'

// The blog as a feed (RSS 2.0): the newest 50 posts. Feed readers, aggregators and some search
// tools find new posts here. It is made when the site is built, so a new post is in it as soon
// as it is published. The blog list and every post name this address in their head.
export const dynamic = 'force-static'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')

export function GET() {
  const posts = [...blogPostsMeta].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 50)
  const blog = `${siteConfig.url}/resources/blog`
  const items = posts
    .map((p) => {
      const link = `${blog}/${p.slug}`
      return `    <item>
      <title>${esc(p.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <category>${esc(p.category)}</category>
      <description>${esc(metaDescription(p.excerpt, 300))}</description>
    </item>`
    })
    .join('\n')
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(siteConfig.name)} blog</title>
    <link>${blog}</link>
    <description>Practical notes on AI, written plainly.</description>
    <language>en</language>
    <lastBuildDate>${posts[0] ? new Date(posts[0].date).toUTCString() : new Date(0).toUTCString()}</lastBuildDate>
    <atom:link href="${siteConfig.url}${FEED_PATH}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`
  return new Response(xml, { headers: { 'content-type': 'application/rss+xml; charset=utf-8', 'cache-control': 'public, max-age=3600' } })
}
