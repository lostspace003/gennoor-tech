import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getBlogPost, getRecentPosts, blogPosts } from '@/data/blog-posts'
import { siteConfig, BLOB_URL } from '@/lib/site-config'
import BlogPostClient from './BlogPostClient'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) return {}

  const articleUrl = `${siteConfig.url}/resources/blog/${slug}`

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    authors: [{ name: post.author }],
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
  return blogPosts.map(post => ({ slug: post.slug }))
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getBlogPost(slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = getRecentPosts(6).filter(p => p.slug !== post.slug).slice(0, 3)

  return <BlogPostClient post={post} slug={slug} relatedPosts={relatedPosts} />
}
