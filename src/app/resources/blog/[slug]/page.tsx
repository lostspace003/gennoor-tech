import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getBlogPostContent, getRelatedPostsMeta, blogPostsMeta } from '@/data/blog-posts'
import { siteConfig } from '@/lib/site-config'
import { ArticleJsonLd, BreadcrumbJsonLd, FAQJsonLd } from '@/components/JsonLd'
import BlogPostClient from './BlogPostClient'
import { resolveAuthor, DEFAULT_AUTHOR_ID } from '@/config/authors'
import { pageMeta, metaDescription } from '@/lib/seo'

type Props = {
  params: Promise<{ slug: string }>
}

/**
 * What a search engine and a shared link read about a post. Nothing here is written per post:
 * it all comes from the post's own title, summary, date, category and tags, so a post the
 * writing agent publishes tomorrow has the full set without anyone touching this file.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostContent(slug)
  if (!post) return {}
  const author = resolveAuthor(post.author)

  return {
    ...pageMeta({
      title: post.title,
      // Most titles are longer than a search result shows. The site's name is left off those; the words are never cut.
      absoluteTitle: post.title.length > 55,
      // A summary can run to several sentences; a search result shows about 160 characters.
      description: metaDescription(post.excerpt),
      keywords: post.tags,
      path: `/resources/blog/${slug}`,
      // Its own share picture: the post's icon tile and title (src/app/og/blog/[slug])
      image: `/og/blog/${slug}`,
      feed: true,
      article: { published: post.date, authors: [author.name], section: post.category, tags: post.tags },
    }),
    authors: [{ name: author.name }],
  }
}

export function generateStaticParams() {
  return blogPostsMeta.map(post => ({ slug: post.slug }))
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getBlogPostContent(slug)

  if (!post) {
    notFound()
  }

  // What to read next: posts on the same subject, not just the newest three.
  const relatedPosts = getRelatedPostsMeta(post.slug, 3)

  const articleUrl = `${siteConfig.url}/resources/blog/${slug}`
  const author = resolveAuthor(post.author)
  const words = post.content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length

  return (
    <>
      <ArticleJsonLd
        title={post.title}
        description={metaDescription(post.excerpt, 300)}
        url={articleUrl}
        datePublished={post.date}
        authorName={author.name}
        authorIsTeam={author.id === DEFAULT_AUTHOR_ID}
        image={`${siteConfig.url}/og/blog/${slug}`}
        section={post.category}
        keywords={post.tags}
        wordCount={words}
      />
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://gennoor.com' },
        { name: 'Blog', url: 'https://gennoor.com/resources/blog' },
        { name: post.title, url: articleUrl },
      ]} />
      {post.faqs && post.faqs.length > 0 && (
        <FAQJsonLd faqs={post.faqs} />
      )}
      <BlogPostClient post={post} slug={slug} relatedPosts={relatedPosts} />
    </>
  )
}
