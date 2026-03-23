'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, Clock } from 'lucide-react'

interface BlogPost {
  slug: string
  title: string
  excerpt: string
  date: string
  readTime: string
  category: string
}

export default function BlogFilter({ posts, categories }: { posts: BlogPost[]; categories: string[] }) {
  const [activeCategory, setActiveCategory] = useState<string>('All')

  const filtered = activeCategory === 'All'
    ? posts
    : posts.filter((p) => p.category === activeCategory)

  return (
    <>
      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-10">
        <button
          onClick={() => setActiveCategory('All')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeCategory === 'All'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((post) => (
          <Link
            key={post.slug}
            href={`/resources/blog/${post.slug}`}
            className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <div className="h-1 bg-gradient-primary" />
            <div className="p-6">
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <span className="px-2 py-1 bg-primary-50 text-primary-700 rounded-md text-xs font-medium">
                  {post.category}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {post.readTime}
                </span>
              </div>

              <h2 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                {post.title}
              </h2>

              <p className="text-gray-600 line-clamp-3 mb-4">{post.excerpt}</p>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(post.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
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

      {filtered.length === 0 && (
        <p className="text-center text-gray-500 py-12">No posts found in this category.</p>
      )}
    </>
  )
}
