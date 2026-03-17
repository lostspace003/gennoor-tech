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
          name: 'Newsletter Subscriber', email,
          programTitle: 'Blog Newsletter Subscription',
          message: 'Subscribed to blog newsletter',
          timestamp: new Date().toISOString(),
        }),
      })
    } catch { /* show success */ }
    setSubscribed(true)
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Masthead */}
      <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p className="text-xs font-bold tracking-[0.3em] uppercase mb-2" style={{ color: '#4f46e5' }}>Insights & Perspectives</p>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight" style={{ fontFamily: 'Georgia, serif', color: '#111827' }}>
            The Gennoor Tech Blog
          </h1>
          <div className="w-24 h-1 mx-auto mt-4 mb-3 rounded-full" style={{ backgroundColor: '#4f46e5' }} />
          <p className="text-sm max-w-lg mx-auto" style={{ color: '#6b7280' }}>
            Practitioner insights on enterprise AI, agentic systems, and real-world implementation strategies
          </p>
        </div>
      </header>

      {/* Category Filter */}
      <div className="sticky top-0 z-40" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #f3f4f6' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-wrap gap-1.5 justify-center">
            <button
              onClick={() => setActiveCategory(null)}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all"
              style={!activeCategory ? { backgroundColor: '#111827', color: '#ffffff' } : { color: '#6b7280' }}
            >
              All
            </button>
            {blogCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all hover:bg-gray-100"
                style={activeCategory === cat ? { backgroundColor: '#111827', color: '#ffffff' } : { color: '#6b7280' }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

        {/* HERO CARD */}
        {hero && (
          <Link href={`/resources/blog/${hero.slug}`} className="group block mb-8">
            <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
              style={{ backgroundColor: hero.coverColor }}>
              <div className="relative grid grid-cols-1 lg:grid-cols-5 gap-0">
                <div className="lg:col-span-3 p-8 sm:p-10 lg:p-14 flex flex-col justify-center">
                  <span className="inline-block px-3 py-1 text-xs font-bold rounded-full tracking-wide uppercase mb-4 w-fit"
                    style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#ffffff' }}>
                    Featured
                  </span>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight mb-4 group-hover:translate-x-1 transition-transform duration-300"
                    style={{ fontFamily: 'Georgia, serif', color: '#ffffff' }}>
                    {hero.title}
                  </h2>
                  <p className="leading-relaxed mb-6 text-sm sm:text-base line-clamp-3" style={{ color: 'rgba(255,255,255,0.85)' }}>
                    {hero.excerpt}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{hero.readTime}</span>
                    <span className="text-sm font-semibold group-hover:translate-x-1 transition-transform" style={{ color: '#ffffff' }}>Read article &rarr;</span>
                  </div>
                </div>
                <div className="hidden lg:flex lg:col-span-2 items-center justify-center p-8">
                  {/* Decorative nodes */}
                  <svg className="w-48 h-48 group-hover:scale-105 transition-transform duration-500" viewBox="0 0 200 200" fill="none">
                    <circle cx="100" cy="100" r="60" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
                    <circle cx="100" cy="100" r="30" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"/>
                    <circle cx="100" cy="100" r="6" fill="rgba(255,255,255,0.4)"/>
                    <circle cx="100" cy="40" r="4" fill="rgba(255,255,255,0.3)"/>
                    <circle cx="100" cy="160" r="4" fill="rgba(255,255,255,0.3)"/>
                    <circle cx="40" cy="100" r="4" fill="rgba(255,255,255,0.3)"/>
                    <circle cx="160" cy="100" r="4" fill="rgba(255,255,255,0.3)"/>
                    <line x1="100" y1="40" x2="100" y2="70" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
                    <line x1="100" y1="130" x2="100" y2="160" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
                    <line x1="40" y1="100" x2="70" y2="100" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
                    <line x1="130" y1="100" x2="160" y2="100" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* SPOTLIGHT ROW */}
        {spotlights.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            {spotlights.map(post => (
              <Link
                key={post.slug}
                href={`/resources/blog/${post.slug}`}
                className="group rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}
              >
                <div className="relative h-44 flex flex-col justify-end p-5" style={{ backgroundColor: post.coverColor }}>
                  <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold rounded-full tracking-wide uppercase"
                    style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#ffffff' }}>
                    {post.category}
                  </span>
                  <h3 className="text-lg font-bold leading-snug line-clamp-2 group-hover:translate-x-0.5 transition-transform"
                    style={{ fontFamily: 'Georgia, serif', color: '#ffffff' }}>
                    {post.title}
                  </h3>
                </div>
                <div className="p-5">
                  <p className="text-sm line-clamp-2 mb-3" style={{ color: '#6b7280' }}>{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: '#9ca3af' }}>{post.readTime}</span>
                    <span className="text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#4f46e5' }}>Read &rarr;</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Newsletter Banner */}
        <div className="mb-8 rounded-xl overflow-hidden" style={{ backgroundColor: '#1e293b' }}>
          <div className="px-6 sm:px-10 py-7 flex flex-col sm:flex-row items-center justify-between gap-4">
            {subscribed ? (
              <div className="flex items-center gap-3" style={{ color: '#ffffff' }}>
                <CheckCircle className="h-5 w-5" style={{ color: '#4ade80' }} />
                <p className="text-sm font-medium">Subscribed! You&apos;ll receive the latest AI insights from across the globe.</p>
              </div>
            ) : (
              <>
                <div>
                  <h3 className="font-bold text-base mb-1" style={{ color: '#ffffff' }}>Stay ahead of the curve</h3>
                  <p className="text-sm" style={{ color: '#94a3b8' }}>Enterprise AI insights delivered to your inbox. No spam.</p>
                </div>
                <form onSubmit={handleSubscribe} className="flex gap-2 w-full sm:w-auto">
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email"
                    className="flex-1 sm:w-56 px-4 py-2.5 rounded-lg text-sm focus:outline-none"
                    style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.1)' }} />
                  <button type="submit" className="shrink-0 px-5 py-2.5 font-semibold text-sm rounded-lg transition-colors"
                    style={{ backgroundColor: '#4f46e5', color: '#ffffff' }}>
                    Subscribe
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        {/* NEWSPAPER GRID */}
        <div className="space-y-5">
          {Array.from({ length: Math.ceil(rest.length / 5) }).map((_, groupIdx) => {
            const start = groupIdx * 5
            const group = rest.slice(start, start + 5)
            const isEven = groupIdx % 2 === 0

            if (group.length >= 5) {
              const largeCards = isEven ? group.slice(0, 2) : group.slice(3, 5)
              const smallCards = isEven ? group.slice(2, 5) : group.slice(0, 3)
              return (
                <div key={groupIdx} className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  {/* Large horizontal cards */}
                  <div className={`lg:col-span-7 space-y-5 ${isEven ? 'order-1' : 'order-2'}`}>
                    {largeCards.map(post => (
                      <Link key={post.slug} href={`/resources/blog/${post.slug}`}
                        className="group flex rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
                        style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
                        <div className="relative w-36 sm:w-48 shrink-0 flex flex-col justify-end p-4"
                          style={{ backgroundColor: post.coverColor }}>
                          <span className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>{post.category}</span>
                          <h4 className="text-sm font-bold leading-snug line-clamp-3" style={{ color: '#ffffff' }}>
                            {post.title}
                          </h4>
                        </div>
                        <div className="p-5 flex flex-col justify-center min-w-0">
                          <p className="text-sm line-clamp-3 mb-2" style={{ color: '#6b7280' }}>{post.excerpt}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs" style={{ color: '#9ca3af' }}>{post.readTime}</span>
                            <span className="text-xs font-semibold group-hover:translate-x-0.5 transition-transform" style={{ color: post.coverColor }}>Read &rarr;</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  {/* Compact cards */}
                  <div className={`lg:col-span-5 space-y-5 ${isEven ? 'order-2' : 'order-1'}`}>
                    {smallCards.map(post => (
                      <Link key={post.slug} href={`/resources/blog/${post.slug}`}
                        className="group block rounded-xl p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                        style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 shrink-0 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: post.coverColor }}>
                            <span className="text-xs font-black" style={{ color: '#ffffff' }}>
                              {post.category.split(' ').map(w => w[0]).join('')}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: post.coverColor }}>
                              {post.category} &middot; {post.readTime}
                            </span>
                            <h3 className="text-sm font-bold leading-snug mt-1 line-clamp-2 group-hover:text-primary-600 transition-colors"
                              style={{ color: '#111827' }}>
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

            // Remainder cards
            return (
              <div key={groupIdx} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {group.map(post => (
                  <Link key={post.slug} href={`/resources/blog/${post.slug}`}
                    className="group rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                    style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
                    <div className="relative h-32 flex flex-col justify-end p-4" style={{ backgroundColor: post.coverColor }}>
                      <span className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>{post.category}</span>
                      <h3 className="text-sm font-bold leading-snug line-clamp-2" style={{ color: '#ffffff', fontFamily: 'Georgia, serif' }}>
                        {post.title}
                      </h3>
                    </div>
                    <div className="p-4">
                      <p className="text-sm line-clamp-2 mb-2" style={{ color: '#6b7280' }}>{post.excerpt}</p>
                      <span className="text-xs" style={{ color: '#9ca3af' }}>{post.readTime}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )
          })}
        </div>
      </div>

      {/* Bottom CTA */}
      <section style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e5e7eb' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
          <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Georgia, serif', color: '#111827' }}>
            Want AI insights tailored to your organization?
          </h2>
          <p className="mb-8 max-w-xl mx-auto text-sm" style={{ color: '#6b7280' }}>
            From strategy workshops to hands-on implementation, we help enterprises turn AI potential into measurable results.
          </p>
          <Link href="/contact" className="inline-flex px-6 py-3 font-semibold text-sm rounded-lg transition-colors hover:opacity-90"
            style={{ backgroundColor: '#111827', color: '#ffffff' }}>
            Book a Discovery Call
          </Link>
        </div>
      </section>
    </div>
  )
}
