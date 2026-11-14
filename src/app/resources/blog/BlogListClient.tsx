'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { type BlogPostMeta } from '@/data/blog-posts'
import { CheckCircle } from 'lucide-react'
import { useSubscribe } from '@/hooks/useSubscribe'
import { FilterBar, Pagination, usePage } from '@/components/academy/CatalogControls'
import BlogArt from '@/components/blog/BlogArt'

/**
 * Blog list in the Apple idiom, per the redesign handoff: dark featured
 * card, pill filter chips on the grey band, uniform white post cards.
 * Every feature survives — category/sort/time filters, the OTP-verified
 * newsletter subscription, and all post links.
 */

type SortOrder = 'newest' | 'oldest'
type TimeFilter = 'all' | 'week' | 'month'

interface BlogListClientProps {
  posts: BlogPostMeta[]
  categories: string[]
}

export default function BlogListClient({ posts, categories }: BlogListClientProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest')
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all')
  // One field and one button; the address is confirmed from the email we send (src/hooks/useSubscribe.ts)
  const sub = useSubscribe('blog-list')

  const filtered = useMemo(() => {
    let result = [...posts]

    // Category filter
    if (activeCategory) {
      result = result.filter(p => p.category === activeCategory)
    }

    // Time filter
    if (timeFilter !== 'all') {
      const now = new Date()
      const cutoff = new Date()
      if (timeFilter === 'week') {
        cutoff.setDate(now.getDate() - 7)
      } else if (timeFilter === 'month') {
        cutoff.setMonth(now.getMonth() - 1)
      }
      result = result.filter(p => new Date(p.date) >= cutoff)
    }

    // Sort
    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB
    })

    return result
  }, [posts, activeCategory, sortOrder, timeFilter])

  const hero = filtered.find(p => p.featured === 'hero') || filtered[0]
  const rest = filtered.filter(p => p.slug !== hero?.slug)
  const pg = usePage(`${activeCategory}|${sortOrder}|${timeFilter}`, rest.length, 9)
  const activeFilters = (activeCategory ? 1 : 0) + (timeFilter !== 'all' ? 1 : 0)

  return (
    <>
      {/* ===== Featured post — dark card on white ===== */}
      {hero && (
        <section className="px-8 pt-6 pb-10">
          <Link href={`/resources/blog/${hero.slug}`} className="group block max-w-[1080px] mx-auto">
            <article className="st-night grid grid-cols-1 lg:grid-cols-2 bg-gray-900 rounded-3xl overflow-hidden">
              <div className="p-9 lg:px-12 lg:py-[52px]">
                <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-gray-400 mb-3.5">
                  Featured · {hero.category}
                </div>
                <h2 className="text-[clamp(24px,2.6vw,32px)] font-bold tracking-[-0.02em] leading-[1.2] text-white">
                  {hero.title}
                </h2>
                <p className="text-[15px] leading-[1.55] text-gray-400 mt-3 line-clamp-3">
                  {hero.excerpt}
                </p>
                <div className="text-[13px] text-gray-400 mt-5">
                  {new Date(hero.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} · {hero.readTime} · Gennoor Technical Team
                </div>
              </div>
              {/* Real cover image when the post has one; brand orbital otherwise. */}
              {hero.coverImage ? (
                <div className="hidden lg:block relative min-h-[280px] overflow-hidden">
                  <img
                    src={hero.coverImage}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ) : (
                <BlogArt post={hero} main={84} className="min-h-[200px] lg:min-h-[280px]" />
              )}
            </article>
          </Link>
        </section>
      )}

      {/* ===== Post list — grey band ===== */}
      <section className="bg-gray-50 px-8 pt-10 pb-14">
        <div className="max-w-[1080px] mx-auto">
          <div id="catalog-top" />
          <FilterBar
            quickKey="category"
            activeCount={activeFilters}
            onReset={() => { setActiveCategory(null); setTimeFilter('all'); setSortOrder('newest') }}
            sort="date"
            desc={sortOrder === 'newest'}
            onDirection={() => setSortOrder(o => (o === 'newest' ? 'oldest' : 'newest'))}
            groups={[
              { key: 'category', label: 'Category', allLabel: 'All', value: activeCategory ?? 'all', onChange: id => setActiveCategory(id === 'all' ? null : id), options: categories.map(c => ({ id: c, label: c })) },
              { key: 'time', label: 'Time range', allLabel: 'All time', value: timeFilter, onChange: id => setTimeFilter(id as TimeFilter), options: [{ id: 'week', label: 'This week' }, { id: 'month', label: 'This month' }] },
            ]}
          />
          <p className="text-[13px] text-gray-400 mb-5 -mt-4" aria-live="polite">
            {filtered.length} {filtered.length === 1 ? 'article' : 'articles'}
          </p>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg font-semibold text-gray-900 mb-2">No articles found</p>
              <p className="text-sm text-gray-500 mb-6">
                Try adjusting your filters or selecting a different time range.
              </p>
              <button
                onClick={() => { setActiveCategory(null); setTimeFilter('all'); setSortOrder('newest') }}
                className="pill-secondary"
              >
                Reset filters
              </button>
            </div>
          )}

          {/* Post grid */}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rest.slice(pg.start, pg.end).map(post => (
                <Link
                  key={post.slug}
                  href={`/resources/blog/${post.slug}`}
                  className="group bg-raised border border-gray-200 hover:border-gray-300 rounded-[18px] overflow-hidden flex flex-col text-gray-900 transition-colors"
                >
                  {/* The picture of the post: its icon tile, in the colour of what it is about */}
                  <BlogArt post={post} main={44} className="h-[108px] shrink-0 border-b border-gray-200" />
                  <article className="flex flex-col flex-1 px-6 pt-5 pb-6">
                    <div className="text-[10.5px] font-semibold tracking-[0.12em] uppercase text-primary-600 mb-2.5">
                      {post.category}
                    </div>
                    <h3 className="text-[16.5px] font-bold leading-[1.3] tracking-[-0.01em] mb-2">
                      {post.title}
                    </h3>
                    <p className="text-[13px] leading-normal text-gray-500 mb-3.5 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="text-xs text-gray-400 mt-auto">
                      {new Date(post.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} · {post.readTime}
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
          <Pagination page={pg.page} pages={pg.pages} onPage={pg.setPage} />

          {/* Newsletter — preserved feature, quiet dark panel */}
          <div className="st-night mt-10 bg-gray-900 rounded-3xl px-7 sm:px-10 py-7">
            {sub.done ? (
              <div className="flex items-center gap-3 text-white" role="status">
                <CheckCircle className="h-5 w-5 shrink-0 text-green-400" aria-hidden="true" />
                <p className="text-sm font-medium">{sub.said}</p>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-[15px] font-bold text-white mb-0.5">Get new posts by email</h3>
                  <p className="text-[13px] text-gray-400">One email a week, on Thursday, with that week&apos;s posts. No spam.</p>
                </div>
                <form onSubmit={sub.submit} className="flex flex-wrap gap-2 w-full sm:w-auto">
                  <input
                    type="email"
                    required
                    value={sub.email}
                    onChange={e => sub.setEmail(e.target.value)}
                    placeholder="Your email"
                    aria-label="Email address for new posts by email"
                    className="flex-1 sm:w-56 px-4 py-2.5 rounded-full text-sm bg-white/10 text-white placeholder:text-gray-500 border border-white/10 focus:outline-none focus:border-primary-600"
                  />
                  <button
                    type="submit"
                    disabled={sub.state === 'sending'}
                    className="shrink-0 px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white font-semibold text-sm rounded-full transition-colors disabled:opacity-50"
                  >
                    {sub.state === 'sending' ? 'Sending' : 'Subscribe'}
                  </button>
                  {sub.state === 'error' && <p className="basis-full text-[13px] text-red-300" role="alert">{sub.said}</p>}
                </form>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== Bottom CTA ===== */}
      <section className="bg-surface px-8 py-10 lg:py-12 text-center">
        <h2 className="display-card mb-3">Want insights tailored to your organization?</h2>
        <p className="text-[17px] text-gray-500 max-w-[520px] mx-auto mb-7">
          From strategy workshops to hands-on implementation, we help
          enterprises turn AI potential into measurable results.
        </p>
        <Link href="/contact" className="pill-primary-sm">
          Book a discovery call
        </Link>
      </section>
    </>
  )
}
