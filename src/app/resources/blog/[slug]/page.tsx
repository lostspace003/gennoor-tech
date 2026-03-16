'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { getBlogPost, getRecentPosts, type BlogPost } from '@/data/blog-posts'
import { CheckCircle } from 'lucide-react'

function ShareBar({ post }: { post: BlogPost }) {
  const [copied, setCopied] = useState(false)
  const url = typeof window !== 'undefined' ? window.location.href : ''

  const handleCopy = () => {
    navigator.clipboard.writeText(`${post.title}\n${url}\n\n${post.hashtags.join(' ')}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const channels = [
    {
      name: 'WhatsApp',
      href: `https://wa.me/?text=${encodeURIComponent(post.title + '\n\n' + url + '\n\n' + post.hashtags.join(' '))}`,
      bg: 'bg-[#25D366]',
      hover: 'hover:bg-[#1da851]',
      icon: <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
    },
    {
      name: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      bg: 'bg-[#1877F2]',
      hover: 'hover:bg-[#0d6ce8]',
      icon: <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
    },
    {
      name: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      bg: 'bg-[#0A66C2]',
      hover: 'hover:bg-[#004182]',
      icon: <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
    },
    {
      name: 'X',
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(post.title)}&hashtags=${post.hashtags.map(h => h.replace('#', '')).join(',')}`,
      bg: 'bg-black',
      hover: 'hover:bg-gray-800',
      icon: <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
    },
  ]

  return (
    <div className="flex items-center gap-1.5">
      {channels.map(ch => (
        <a
          key={ch.name}
          href={ch.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`${ch.bg} ${ch.hover} text-white p-2 rounded-lg transition-all duration-200 hover:scale-110`}
          title={`Share on ${ch.name}`}
        >
          {ch.icon}
        </a>
      ))}
      <button
        onClick={handleCopy}
        className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-lg transition-all duration-200 hover:scale-110"
        title="Copy link with hashtags"
      >
        {copied ? (
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        ) : (
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
        )}
      </button>
    </div>
  )
}

export default function BlogPostPage() {
  const params = useParams()
  const slug = params?.slug as string
  const post = getBlogPost(slug)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 200)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll when page loads (popup feel)
  useEffect(() => {
    document.body.style.overflow = 'auto'
    return () => { document.body.style.overflow = 'auto' }
  }, [])

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-5xl mb-4">📄</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Post not found</h1>
          <Link href="/resources/blog" className="text-primary-600 font-medium hover:underline">Back to Blog</Link>
        </div>
      </div>
    )
  }

  const relatedPosts = getRecentPosts(6).filter(p => p.slug !== post.slug).slice(0, 3)

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
          message: `Subscribed from blog post: ${post.title}`,
          timestamp: new Date().toISOString(),
        }),
      })
    } catch { /* show success anyway */ }
    setSubscribed(true)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ── Sticky Share + Title Bar ── */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <div className="bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <Link href="/resources/blog" className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </Link>
              <p className="text-sm font-semibold text-gray-800 truncate">{post.title}</p>
            </div>
            <ShareBar post={post} />
          </div>
        </div>
      </div>

      {/* ── Article Card (popup-style) ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 lg:py-10">
        <article className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200/60">

          {/* Header */}
          <header className={`relative bg-gradient-to-br ${post.coverGradient} px-6 sm:px-10 py-12 lg:py-16`}>
            <div className="absolute inset-0 opacity-[0.07]">
              <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
            </div>
            <div className="relative max-w-2xl">
              <Link href="/resources/blog" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-5 transition-colors">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                All Posts
              </Link>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-white/15 backdrop-blur-sm text-white text-xs font-bold rounded-full tracking-wide uppercase">{post.category}</span>
                <span className="text-white/60 text-sm">{post.readTime}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mb-5">
                {post.title}
              </h1>
              <p className="text-white/70 text-sm">By <span className="text-white font-medium">{post.author}</span></p>
            </div>
          </header>

          {/* Share Bar (inline, always visible) */}
          <div className="px-6 sm:px-10 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Share this article</span>
            <ShareBar post={post} />
          </div>

          {/* Body */}
          <div className="px-6 sm:px-10 py-10 lg:py-12">
            <div
              className="prose prose-lg prose-gray max-w-none
                prose-headings:text-gray-900 prose-headings:font-bold prose-headings:tracking-tight
                prose-h2:text-xl prose-h2:sm:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-gray-100
                prose-p:text-gray-700 prose-p:leading-[1.8]
                prose-li:text-gray-700 prose-li:leading-[1.7]
                prose-strong:text-gray-900 prose-strong:font-semibold
                prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-normal prose-code:text-primary-700
                prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          {/* Tags */}
          <div className="px-6 sm:px-10 py-6 border-t border-gray-100">
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.map(tag => (
                <span key={tag} className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full font-medium hover:bg-gray-200 transition-colors">
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {post.hashtags.map(ht => (
                <span key={ht} className="text-sm text-primary-600 font-medium">{ht}</span>
              ))}
            </div>
          </div>

          {/* Bottom Share */}
          <div className="px-6 sm:px-10 py-5 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-sm text-gray-600 font-medium">Found this insightful? Share with your network.</p>
            <ShareBar post={post} />
          </div>

        </article>

        {/* Newsletter */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-200/60 overflow-hidden">
          <div className={`bg-gradient-to-r ${post.coverGradient} px-6 sm:px-10 py-10 text-center`}>
            {subscribed ? (
              <div className="flex flex-col items-center gap-3">
                <CheckCircle className="h-10 w-10 text-white" />
                <h3 className="text-xl font-bold text-white">You&apos;re subscribed!</h3>
                <p className="text-white/80 max-w-md text-sm">
                  You&apos;ll receive the latest AI insights and happenings from across the globe directly in your inbox.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-white mb-2">Stay ahead of the curve</h3>
                <p className="text-white/80 mb-6 max-w-md mx-auto text-sm">
                  Practitioner insights on enterprise AI delivered to your inbox. No spam, just signal.
                </p>
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-sm mx-auto">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full sm:flex-1 px-4 py-2.5 rounded-lg text-sm focus:ring-2 focus:ring-white/50 focus:outline-none"
                  />
                  <button type="submit" className="shrink-0 px-5 py-2.5 bg-white text-gray-900 font-semibold text-sm rounded-lg hover:bg-gray-100 transition-colors">
                    Subscribe
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-8 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-5">Continue reading</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedPosts.map(rp => (
                <Link
                  key={rp.slug}
                  href={`/resources/blog/${rp.slug}`}
                  className="group bg-white rounded-xl border border-gray-200/60 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <div className={`h-24 bg-gradient-to-br ${rp.coverGradient} flex items-center justify-center`}>
                    <span className="text-3xl opacity-80 group-hover:scale-110 transition-transform duration-300">{rp.icon}</span>
                  </div>
                  <div className="p-4">
                    <span className="text-[11px] text-gray-500 font-medium uppercase tracking-wide">{rp.category}</span>
                    <h4 className="text-sm font-bold text-gray-900 mt-1.5 group-hover:text-primary-600 transition-colors leading-snug line-clamp-2">
                      {rp.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
