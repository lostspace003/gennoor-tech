import { ogImageResponse } from '@/lib/og-card'
import { blogPostsMeta } from '@/data/blog-posts'
import { blogIcon } from '@/lib/blog-icon'

// The share picture of a blog post: /og/blog/<slug>. Its icon tile and colour are the ones the
// post has on the site (src/lib/blog-icon.ts), so a new post gets its picture when it is published.
export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams() {
  return blogPostsMeta.map((post) => ({ slug: post.slug }))
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = blogPostsMeta.find((p) => p.slug === slug)
  if (!post) return new Response('Not found', { status: 404 })
  const art = blogIcon(post)
  return ogImageResponse({
    kicker: post.category,
    title: post.title,
    foot: 'gennoor.com/resources/blog',
    icon: art.icon,
    tone: art.tone,
    beside: art.beside,
  })
}
