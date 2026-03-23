import { Metadata } from 'next'
import Link from 'next/link'
import { blogPosts, blogCategories } from '@/data/blog-posts'
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
  const sortedPosts = [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Masthead — server-rendered for SEO */}
      <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p className="text-xs font-bold tracking-[0.3em] uppercase mb-2" style={{ color: '#4f46e5' }}>Insights & Perspectives</p>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight" style={{ color: '#111827' }}>
            The Gennoor Tech Blog
          </h1>
          <div className="w-24 h-1 mx-auto mt-4 mb-3 rounded-full" style={{ backgroundColor: '#4f46e5' }} aria-hidden="true" />
          <p className="text-sm max-w-lg mx-auto" style={{ color: '#6b7280' }}>
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
