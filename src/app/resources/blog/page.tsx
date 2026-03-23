import { Metadata } from 'next'
import { blogPosts, getAllCategories } from '@/data/blog-posts'
import BlogFilter from '@/components/blog/BlogFilter'
import { BreadcrumbJsonLd } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Blog — AI Training & Enterprise AI Insights',
  description: 'Practical insights on enterprise AI, Microsoft Copilot Studio, Azure AI, agentic AI systems, and AI strategy. Written by Jalal Ahmed Khan, Microsoft Certified Trainer.',
  keywords: ['AI blog', 'enterprise AI insights', 'Copilot Studio guide', 'Azure AI tutorials', 'AI strategy articles'],
  alternates: { canonical: 'https://gennoor.com/resources/blog' },
  openGraph: {
    title: 'Blog — AI Training & Enterprise AI Insights | Gennoor Tech',
    description: 'Practical AI insights from a Microsoft Certified Trainer with Fortune 500 experience.',
    url: 'https://gennoor.com/resources/blog',
  },
}

export default function BlogPage() {
  const categories = getAllCategories()
  const postsForFilter = blogPosts.map(({ slug, title, excerpt, date, readTime, category }) => ({
    slug, title, excerpt, date, readTime, category,
  }))

  return (
    <>
      <section className="bg-gradient-to-br from-primary-50 to-accent-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Blog</h1>
            <p className="text-xl text-gray-600">
              Practical AI implementation strategies, technical deep-dives, and enterprise insights
              from 14+ years of Fortune 500 experience.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <BlogFilter posts={postsForFilter} categories={categories} />
        </div>
      </section>

      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://gennoor.com' },
        { name: 'Resources', url: 'https://gennoor.com/resources' },
        { name: 'Blog', url: 'https://gennoor.com/resources/blog' },
      ]} />
    </>
  )
}
