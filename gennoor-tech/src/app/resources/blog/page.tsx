import { Metadata } from 'next'
import Link from 'next/link'
import { blogPostsMeta, blogCategories } from '@/data/blog-posts'
import { siteConfig, BLOB_URL } from '@/lib/site-config'
import BlogListClient from './BlogListClient'

export const metadata: Metadata = {
  title: 'Blog — AI Insights & Enterprise Implementation Strategies',
  description: 'Practitioner insights on enterprise AI, agentic systems, Microsoft Copilot, Azure AI, and real-world implementation strategies from an MCT with 14+ years experience.',
  keywords: ['AI blog', 'enterprise AI', 'agentic AI', 'Microsoft Copilot', 'Azure AI', 'AI training insights', 'AI implementation'],
  openGraph: {
    type: 'website',
    title: 'Blog — AI Insights & Enterprise Implementation Strategies | Gennoor Tech',
    description: 'Practitioner insights on enterprise AI, agentic systems, and real-world implementation strategies.',
    url: `${siteConfig.url}/resources/blog`,
    siteName: siteConfig.name,
    images: [
      {
        url: `${BLOB_URL}/logos/gennoor-tech-banner-linkedin-1584x396.png`,
        width: 1584,
        height: 396,
        alt: 'Gennoor Tech Blog',
      },
    ],
  },
  alternates: {
    canonical: `${siteConfig.url}/resources/blog`,
  },
}

export default function BlogPage() {
  // Sort posts for SSR — Google sees the full list in correct order
  const sortedPosts = [...blogPostsMeta].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <div className="min-h-screen bg-white">
      {/* Masthead — server-rendered for SEO */}
      <header className="relative py-14 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-white" />
        <div className="absolute inset-0 bg-gradient-mesh" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center rounded-full px-3 py-1 mb-5 text-xs font-semibold text-primary-600 bg-primary-50/80 border border-primary-100/60">
            Insights &amp; Perspectives
          </span>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-gray-900">
            The Gennoor Tech Blog
          </h1>
          <div className="section-divider w-24 mx-auto mt-6 mb-4" aria-hidden="true" />
          <p className="text-sm max-w-lg mx-auto text-gray-500">
            Practitioner insights on enterprise AI, agentic systems, and real-world implementation strategies
          </p>
        </div>
      </header>

      {/* Interactive content — client component for filters/sort */}
      <BlogListClient posts={sortedPosts} categories={blogCategories} />

      {/* Hidden SEO content — full article list for crawlers */}
      <noscript>
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-6">All Articles</h2>
          <ul>
            {sortedPosts.map(post => (
              <li key={post.slug} className="mb-4">
                <Link href={`/resources/blog/${post.slug}`} className="text-primary-600 hover:underline">
                  <strong>{post.title}</strong>
                </Link>
                <p className="text-sm text-gray-600">{post.excerpt}</p>
                <span className="text-xs text-gray-400">{post.category} · {post.readTime} · {post.date}</span>
              </li>
            ))}
          </ul>
        </div>
      </noscript>
    </div>
  )
}
