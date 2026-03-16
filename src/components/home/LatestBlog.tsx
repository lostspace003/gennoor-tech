import Link from 'next/link'
import { Calendar, Clock, ArrowRight } from 'lucide-react'

const blogPosts = [
  {
    title: 'Building Multi-Agent Systems with LangGraph and CrewAI',
    excerpt: 'A comprehensive guide to orchestrating AI agents for enterprise applications, including practical examples from banking sector implementations.',
    date: '2026-03-10',
    readTime: '8 min read',
    category: 'Agentic AI',
    slug: 'multi-agent-systems-langgraph-crewai',
  },
  {
    title: 'Copilot Studio MCP Integration: A Step-by-Step Guide',
    excerpt: 'Learn how to build custom MCP servers for Microsoft Copilot Studio with 12 practical tools for database interaction.',
    date: '2026-03-08',
    readTime: '6 min read',
    category: 'Microsoft AI',
    slug: 'copilot-studio-mcp-integration',
  },
  {
    title: 'AI Strategy for C-Suite: Lessons from Saudi Arabia',
    excerpt: 'Key insights from training 50+ executives at MCIT on AI transformation, governance, and ROI modeling aligned with Vision 2030.',
    date: '2026-03-05',
    readTime: '10 min read',
    category: 'AI Strategy',
    slug: 'ai-strategy-c-suite-saudi',
  },
]

export default function LatestBlog() {
  return (
    <section className="section-padding">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Latest Insights
            </h2>
            <p className="text-lg text-gray-600">
              Practical AI implementation strategies and technical deep-dives
            </p>
          </div>
          <Link
            href="/resources/blog"
            className="hidden md:flex items-center text-primary-600 font-medium hover:underline"
          >
            View all posts
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/resources/blog/${post.slug}`}
              className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              {/* Category Badge */}
              <div className="h-1 bg-gradient-primary" />

              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <span className="px-2 py-1 bg-primary-100 bg-primary-900/30 text-primary-700 text-primary-300 rounded-md text-xs font-medium">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary-600 group-hover:text-primary-400 transition-colors">
                  {post.title}
                </h3>

                <p className="text-gray-600 line-clamp-3 mb-4">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(post.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>

                  <span className="text-primary-600 text-sm font-medium group-hover:underline">
                    Read more →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/resources/blog"
            className="inline-flex items-center text-primary-600 font-medium hover:underline"
          >
            View all posts
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}