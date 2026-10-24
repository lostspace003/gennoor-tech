import { Metadata } from 'next'
import Link from 'next/link'
import { BlogIllustration } from '@/components/illustrations/Illustrations'
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
      <header className="px-8 pt-20 lg:pt-[100px] pb-12 text-center">
        <BlogIllustration className="w-[112px] h-[112px] mx-auto mb-6" />
        <h1 className="text-[clamp(40px,4.8vw,64px)] leading-[1.06] tracking-[-0.03em] font-bold text-gray-900">
          Field notes.
        </h1>
        <p className="text-[clamp(18px,1.8vw,22px)] leading-[1.45] text-[#6e6e73] max-w-[540px] mx-auto mt-5">
          Practical notes on AI, written plainly.
        </p>
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
