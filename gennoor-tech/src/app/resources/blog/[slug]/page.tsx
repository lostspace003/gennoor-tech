import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getBlogPostContent, getRecentPostsMeta, blogPostsMeta, type BlogPost } from '@/data/blog-posts'
import { siteConfig, BLOB_URL } from '@/lib/site-config'
import { ArticleJsonLd, BreadcrumbJsonLd, FAQJsonLd } from '@/components/JsonLd'
import BlogPostClient from './BlogPostClient'
import { resolveAuthor } from '@/config/authors'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostContent(slug)
  if (!post) return {}

  const articleUrl = `${siteConfig.url}/resources/blog/${slug}`

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    authors: [{ name: resolveAuthor(post.author).name }],
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      url: articleUrl,
      siteName: siteConfig.name,
      images: [
        {
          url: `${BLOB_URL}/logos/gennoor-tech-banner-linkedin-1584x396.png`,
          width: 1584,
          height: 396,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [`${BLOB_URL}/logos/gennoor-tech-banner-twitter-1500x500.png`],
    },
    alternates: {
      canonical: articleUrl,
    },
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

  const relatedPosts = getRecentPostsMeta(6).filter(p => p.slug !== post.slug).slice(0, 3)

  const articleUrl = `${siteConfig.url}/resources/blog/${slug}`
  const author = resolveAuthor(post.author)

  return (
    <>
      <ArticleJsonLd
        title={post.title}
        description={post.excerpt}
        url={articleUrl}
        datePublished={post.date}
        authorName={author.name}
        image={`${BLOB_URL}/logos/gennoor-tech-banner-linkedin-1584x396.png`}
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
