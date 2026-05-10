import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getRecentPosts } from '@/data/blog-posts'

export default function LatestBlog() {
  const posts = getRecentPosts(3)

  return (
    <section className="py-20 lg:py-28 relative">
      <div className="section-divider absolute top-0 left-[10%] right-[10%]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-14">
          <div>
            <div className="inline-flex items-center rounded-full px-3 py-1 mb-4 text-xs font-semibold text-primary-600 bg-primary-50/80 border border-primary-100/60">
              Blog
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              Latest Insights
            </h2>
            <p className="text-lg text-gray-500">
              Practical AI implementation strategies and technical deep-dives
            </p>
          </div>
          <Link
            href="/resources/blog"
            className="hidden md:flex items-center text-primary-600 font-semibold text-sm hover:text-primary-700 transition-colors"
          >
            View all posts
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/resources/blog/${post.slug}`}
              className="group rounded-2xl overflow-hidden transition-all duration-500 ease-spring glass-card glow-border"
            >
              <div
                className="h-36 flex flex-col justify-end p-5 relative overflow-hidden"
                style={{ backgroundColor: post.coverColor }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <span className="relative text-[10px] font-bold uppercase tracking-wider mb-1 text-white/70">
                  {post.category}
                </span>
                <span className="relative text-sm font-bold leading-snug line-clamp-2 text-white group-hover:translate-x-0.5 transition-transform duration-300">
                  {post.title}
                </span>
              </div>

              <div className="p-6">
                <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{post.readTime}</span>
                  <span className="text-primary-600 text-sm font-semibold group-hover:translate-x-1 transition-transform duration-300">
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
            className="inline-flex items-center text-primary-600 font-semibold text-sm"
          >
            View all posts
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
