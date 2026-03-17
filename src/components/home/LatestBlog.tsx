import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getRecentPosts } from '@/data/blog-posts'

export default function LatestBlog() {
  const posts = getRecentPosts(3)

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
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/resources/blog/${post.slug}`}
              className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="h-32 flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: post.coverColor }}>
                <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 200 100">
                  <circle cx="30" cy="30" r="3" fill="white"/><circle cx="70" cy="20" r="3" fill="white"/>
                  <circle cx="120" cy="50" r="3" fill="white"/><circle cx="170" cy="30" r="3" fill="white"/>
                  <circle cx="50" cy="70" r="3" fill="white"/><circle cx="150" cy="80" r="3" fill="white"/>
                  <line x1="30" y1="30" x2="70" y2="20" stroke="white" strokeWidth="0.5"/>
                  <line x1="70" y1="20" x2="120" y2="50" stroke="white" strokeWidth="0.5"/>
                  <line x1="120" y1="50" x2="170" y2="30" stroke="white" strokeWidth="0.5"/>
                  <line x1="50" y1="70" x2="120" y2="50" stroke="white" strokeWidth="0.5"/>
                  <line x1="150" y1="80" x2="170" y2="30" stroke="white" strokeWidth="0.5"/>
                </svg>
                <span className="text-white text-sm font-semibold px-4 text-center relative z-10 group-hover:scale-105 transition-transform duration-300">{post.title}</span>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                  <span className="px-2 py-1 bg-primary-50 text-primary-700 rounded-md text-xs font-medium">
                    {post.category}
                  </span>
                  <span>{post.readTime}</span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors leading-snug">
                  {post.title}
                </h3>

                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{post.category}</span>
                  <span className="text-primary-600 text-sm font-medium group-hover:translate-x-1 transition-transform duration-200">
                    Read &rarr;
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
