'use client'

import { useState } from 'react'
import Link from 'next/link'
import { blogPosts, blogCategories } from '@/data/blog-posts'
import { CheckCircle } from 'lucide-react'

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const filtered = activeCategory
    ? blogPosts.filter(p => p.category === activeCategory)
    : blogPosts

  // For newspaper layout: hero, spotlights, and rest
  const hero = filtered.find(p => p.featured === 'hero') || filtered[0]
  const spotlights = filtered.filter(p => p.featured === 'spotlight' && p.slug !== hero?.slug).slice(0, 3)
  const spotlightSlugs = new Set([hero?.slug, ...spotlights.map(s => s.slug)])
  const rest = filtered.filter(p => !spotlightSlugs.has(p.slug))

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    try {
      await fetch('/api/book-expert-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Newsletter Subscriber',
          email,
          programTitle: 'Blog Newsletter Subscription',
          message: 'Subscribed to blog newsletter',
          timestamp: new Date().toISOString(),
        }),
      })
    } catch { /* show success anyway */ }
    setSubscribed(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Masthead ── */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-primary-600 mb-2">Insights & Perspectives</p>
          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
            The Gennoor Tech Blog
          </h1>
          <div className="w-24 h-1 bg-primary-600 mx-auto mt-4 mb-3 rounded-full" />
          <p className="text-gray-500 text-sm max-w-lg mx-auto">
            Practitioner insights on enterprise AI, agentic systems, and real-world implementation strategies
          </p>
        </div>
      </header>

      {/* ── Category Filter ── */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-wrap gap-1.5 justify-center">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all ${
                !activeCategory
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              All
            </button>
            {blogCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all ${
                  activeCategory === cat
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

        {/* ── HERO: Full-width featured article ── */}
        {hero && (
          <Link
            href={`/resources/blog/${hero.slug}`}
            className="group block mb-8"
          >
            <div className={`relative bg-gradient-to-br ${hero.coverGradient} rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500`}>
              <div className="absolute inset-0 opacity-[0.06]">
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
              </div>
              <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="p-8 sm:p-10 lg:p-14 flex flex-col justify-center">
                  <span className="inline-block px-3 py-1 bg-white/15 backdrop-blur-sm text-white text-xs font-bold rounded-full tracking-wide uppercase mb-4 w-fit">
                    Featured
                  </span>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight mb-4 group-hover:translate-x-1 transition-transform duration-300" style={{ fontFamily: 'Georgia, serif' }}>
                    {hero.title}
                  </h2>
                  <p className="text-white/80 leading-relaxed mb-6 text-sm sm:text-base line-clamp-3">
                    {hero.excerpt}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-white/60 text-sm">{hero.readTime}</span>
                    <span className="text-white font-semibold text-sm group-hover:translate-x-1 transition-transform">Read article &rarr;</span>
                  </div>
                </div>
                <div className="hidden lg:flex items-center justify-center p-10">
                  <span className="text-[120px] opacity-30 group-hover:scale-110 group-hover:opacity-40 transition-all duration-500">{hero.icon}</span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* ── SPOTLIGHT ROW: 3 medium cards ── */}
        {spotlights.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            {spotlights.map(post => (
              <Link
                key={post.slug}
                href={`/resources/blog/${post.slug}`}
                className="group bg-white rounded-xl border border-gray-200/80 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`h-36 bg-gradient-to-br ${post.coverGradient} flex items-center justify-center relative`}>
                  <span className="text-5xl opacity-70 group-hover:scale-110 transition-transform duration-300">{post.icon}</span>
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/15 backdrop-blur-sm text-white text-[10px] font-bold rounded-full tracking-wide uppercase">
                    {post.category}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-base font-bold text-gray-900 leading-snug mb-2 group-hover:text-primary-600 transition-colors line-clamp-2" style={{ fontFamily: 'Georgia, serif' }}>
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{post.readTime}</span>
                    <span className="text-xs font-semibold text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity">Read &rarr;</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* ── Newsletter Banner ── */}
        <div className="mb-8 bg-gray-900 rounded-xl overflow-hidden">
          <div className="px-6 sm:px-10 py-7 flex flex-col sm:flex-row items-center justify-between gap-4">
            {subscribed ? (
              <div className="flex items-center gap-3 text-white">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <p className="text-sm font-medium">Subscribed! You&apos;ll receive the latest AI insights from across the globe.</p>
              </div>
            ) : (
              <>
                <div>
                  <h3 className="text-white font-bold text-base mb-1">Stay ahead of the curve</h3>
                  <p className="text-gray-400 text-sm">Enterprise AI insights delivered to your inbox. No spam.</p>
                </div>
                <form onSubmit={handleSubscribe} className="flex gap-2 w-full sm:w-auto">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Your email"
                    className="flex-1 sm:w-56 px-4 py-2.5 rounded-lg text-sm bg-white/10 text-white placeholder:text-gray-500 border border-white/10 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  />
                  <button type="submit" className="shrink-0 px-5 py-2.5 bg-primary-600 text-white font-semibold text-sm rounded-lg hover:bg-primary-500 transition-colors">
                    Subscribe
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        {/* ── NEWSPAPER GRID: Mixed sizes ── */}
        <div className="space-y-5">
          {/* Process rest in groups for varied layout */}
          {Array.from({ length: Math.ceil(rest.length / 5) }).map((_, groupIdx) => {
            const start = groupIdx * 5
            const group = rest.slice(start, start + 5)
            const isEven = groupIdx % 2 === 0

            // Layout A: 2 large + 3 small | Layout B: 3 small + 2 large
            if (group.length >= 5) {
              const largeCards = isEven ? group.slice(0, 2) : group.slice(3, 5)
              const smallCards = isEven ? group.slice(2, 5) : group.slice(0, 3)

              return (
                <div key={groupIdx} className={`grid grid-cols-1 lg:grid-cols-12 gap-5 ${isEven ? '' : ''}`}>
                  {/* Large cards column */}
                  <div className={`lg:col-span-7 space-y-5 ${isEven ? 'order-1' : 'order-2'}`}>
                    {largeCards.map(post => (
                      <Link
                        key={post.slug}
                        href={`/resources/blog/${post.slug}`}
                        className="group flex bg-white rounded-xl border border-gray-200/80 overflow-hidden hover:shadow-lg transition-all duration-300"
                      >
                        <div className={`w-32 sm:w-44 shrink-0 bg-gradient-to-br ${post.coverGradient} flex items-center justify-center`}>
                          <span className="text-4xl opacity-70 group-hover:scale-110 transition-transform">{post.icon}</span>
                        </div>
                        <div className="p-5 flex flex-col justify-center min-w-0">
                          <span className="text-[10px] font-bold text-primary-600 uppercase tracking-wider mb-1.5">{post.category}</span>
                          <h3 className="text-base font-bold text-gray-900 leading-snug mb-2 group-hover:text-primary-600 transition-colors line-clamp-2" style={{ fontFamily: 'Georgia, serif' }}>
                            {post.title}
                          </h3>
                          <p className="text-sm text-gray-500 line-clamp-2 hidden sm:block">{post.excerpt}</p>
                          <span className="text-xs text-gray-400 mt-2">{post.readTime}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                  {/* Small cards column */}
                  <div className={`lg:col-span-5 space-y-5 ${isEven ? 'order-2' : 'order-1'}`}>
                    {smallCards.map(post => (
                      <Link
                        key={post.slug}
                        href={`/resources/blog/${post.slug}`}
                        className="group block bg-white rounded-xl border border-gray-200/80 p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br ${post.coverGradient} flex items-center justify-center`}>
                            <span className="text-lg">{post.icon}</span>
                          </div>
                          <div className="min-w-0">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{post.category} &middot; {post.readTime}</span>
                            <h3 className="text-sm font-bold text-gray-900 leading-snug mt-1 group-hover:text-primary-600 transition-colors line-clamp-2">
                              {post.title}
                            </h3>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )
            }

            // Fallback: remaining cards in grid
            return (
              <div key={groupIdx} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {group.map(post => (
                  <Link
                    key={post.slug}
                    href={`/resources/blog/${post.slug}`}
                    className="group bg-white rounded-xl border border-gray-200/80 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <div className={`h-28 bg-gradient-to-br ${post.coverGradient} flex items-center justify-center`}>
                      <span className="text-3xl opacity-70 group-hover:scale-110 transition-transform">{post.icon}</span>
                    </div>
                    <div className="p-4">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{post.category}</span>
                      <h3 className="text-sm font-bold text-gray-900 leading-snug mt-1 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2" style={{ fontFamily: 'Georgia, serif' }}>
                        {post.title}
                      </h3>
                      <span className="text-xs text-gray-400">{post.readTime}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Bottom CTA ── */}
      <section className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Georgia, serif' }}>Want AI insights tailored to your organization?</h2>
          <p className="text-gray-500 mb-8 max-w-xl mx-auto text-sm">
            From strategy workshops to hands-on implementation, we help enterprises turn AI potential into measurable results.
          </p>
          <Link
            href="/contact"
            className="inline-flex px-6 py-3 bg-gray-900 text-white font-semibold text-sm rounded-lg hover:bg-gray-800 transition-colors"
          >
            Book a Discovery Call
          </Link>
        </div>
      </section>
    </div>
  )
}
