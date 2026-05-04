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
              className="group rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out"
              style={{ backgroundColor: '#ffffff', border: '1px solid #f3f4f6' }}
            >
              <div className="h-36 flex flex-col justify-end p-5 relative overflow-hidden" style={{ backgroundColor: post.coverColor }}>
                <span className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  {post.category}
                </span>
                <span className="text-sm font-bold leading-snug line-clamp-2 group-hover:translate-x-0.5 transition-transform duration-300" style={{ color: '#ffffff' }}>
                  {post.title}
                </span>
              </div>

              <div className="p-6">
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{post.readTime}</span>
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
