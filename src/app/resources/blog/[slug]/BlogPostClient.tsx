'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { type BlogPost } from '@/data/blog-posts'
import EmailOTP from '@/components/EmailOTP'
import { CheckCircle } from 'lucide-react'

function ShareBar({ post, slug }: { post: BlogPost; slug: string }) {
  const [copied, setCopied] = useState(false)
  const url = `https://gennoor.com/resources/blog/${slug}`

  const handleCopy = () => {
    navigator.clipboard.writeText(`${post.title}\n${url}\n\n${post.hashtags.join(' ')}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const channels = [
    {
      name: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      bg: '#0A66C2',
      icon: <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
    },
    {
      name: 'WhatsApp',
      href: `https://wa.me/?text=${encodeURIComponent(post.title + '\n\n' + url + '\n\n' + post.hashtags.join(' '))}`,
      bg: '#25D366',
      icon: <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
    },
    {
      name: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      bg: '#1877F2',
      icon: <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
    },
    {
      name: 'X',
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(post.title)}&hashtags=${post.hashtags.map(h => h.replace('#', '')).join(',')}`,
      bg: '#111827',
      icon: <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
    },
  ]

  return (
    <div className="flex items-center gap-1.5 relative">
      {channels.map(ch => (
        <a key={ch.name} href={ch.href} target="_blank" rel="noopener noreferrer"
          className="p-2 rounded-lg transition-all duration-200 hover:scale-110 hover:opacity-90"
          style={{ backgroundColor: ch.bg, color: '#ffffff' }}
          title={`Share on ${ch.name}`}>
          {ch.icon}
        </a>
      ))}

      <button onClick={handleCopy}
        className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
        style={{ backgroundColor: '#4b5563', color: '#ffffff' }}
        title="Copy link with hashtags">
        {copied ? (
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        ) : (
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
        )}
      </button>
    </div>
  )
}

export default function BlogPostClient({ post, slug, relatedPosts }: {
  post: BlogPost
  slug: string
  relatedPosts: BlogPost[]
}) {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [emailVerified, setEmailVerified] = useState(false)

  useEffect(() => {
    setEmailVerified(false)
  }, [email])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 200)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
          message: `Subscribed from: ${post.title}`,
          timestamp: new Date().toISOString(),
        }),
      })
    } catch { /* show success */ }
    setSubscribed(true)
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f3f4f6' }}>
      {/* Sticky Share Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{ transform: scrolled ? 'translateY(0)' : 'translateY(-100%)', opacity: scrolled ? 1 : 0 }}>
        <div style={{ backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #e5e7eb' }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <Link href="/resources/blog" className="shrink-0 transition-colors" style={{ color: '#9ca3af' }}>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </Link>
              <p className="text-sm font-semibold truncate" style={{ color: '#1f2937' }}>{post.title}</p>
            </div>
            <ShareBar post={post} slug={slug} />
          </div>
        </div>
      </div>

      {/* Article Card */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 lg:py-10">
        <article className="rounded-2xl shadow-xl overflow-hidden" style={{ backgroundColor: '#ffffff', border: '1px solid rgba(229,231,235,0.6)' }}>

          {/* Header */}
          <header className="relative overflow-hidden px-6 sm:px-10 py-12 lg:py-16" style={{ backgroundColor: post.coverColor }}>
            <div className="relative max-w-2xl" style={{ zIndex: 1 }}>
              <Link href="/resources/blog" className="inline-flex items-center gap-1.5 text-sm mb-5 transition-colors"
                style={{ color: 'rgba(255,255,255,0.7)' }}>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                All Posts
              </Link>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 text-xs font-bold rounded-full tracking-wide uppercase"
                  style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#ffffff' }}>{post.category}</span>
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>{post.readTime}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-5" style={{ color: '#ffffff' }}>
                {post.title}
              </h1>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
                By <span className="font-medium" style={{ color: '#ffffff' }}>{post.author}</span>
                <span className="mx-2" style={{ color: 'rgba(255,255,255,0.4)' }}>·</span>
                {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <svg className="absolute right-6 lg:right-12 top-1/2 -translate-y-1/2 w-28 h-28 lg:w-40 lg:h-40" viewBox="0 0 200 200" fill="none" style={{ opacity: 0.08 }} aria-hidden="true">
              <circle cx="100" cy="100" r="80" stroke="white" strokeWidth="2"/>
              <circle cx="100" cy="100" r="40" stroke="white" strokeWidth="2"/>
              <circle cx="100" cy="100" r="10" fill="white"/>
            </svg>
          </header>

          {/* Share Bar */}
          <div className="px-6 sm:px-10 py-4 flex items-center justify-between"
            style={{ borderBottom: '1px solid #f3f4f6', backgroundColor: '#fafafa' }}>
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: '#6b7280' }}>Share this article</span>
            <ShareBar post={post} slug={slug} />
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
          <div className="px-6 sm:px-10 py-6" style={{ borderTop: '1px solid #f3f4f6' }}>
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.map(tag => (
                <span key={tag} className="px-3 py-1.5 text-sm rounded-full font-medium" style={{ backgroundColor: '#f3f4f6', color: '#374151' }}>{tag}</span>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {post.hashtags.map(ht => (
                <span key={ht} className="text-sm font-medium" style={{ color: '#4f46e5' }}>{ht}</span>
              ))}
            </div>
          </div>

          {/* Author Bio */}
          <div className="px-6 sm:px-10 py-8" style={{ borderTop: '1px solid #f3f4f6', backgroundColor: '#f9fafb' }}>
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 shrink-0 rounded-full bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center">
                <span className="text-lg font-black text-white">JK</span>
              </div>
              <div>
                <h4 className="text-base font-bold text-gray-900">Jalal Ahmed Khan</h4>
                <p className="text-sm font-medium text-primary-600 mb-2">Microsoft Certified Trainer (MCT) · Founder, Gennoor Tech</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  14+ years in enterprise AI and cloud technologies. Delivered AI transformation programs for Fortune 500 companies across 6 countries including Boeing, Aramco, HDFC Bank, and Siemens. Holds 16 active Microsoft certifications including Azure AI Engineer and Power BI Analyst.
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <a href="https://www.linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-primary-600 hover:underline">LinkedIn</a>
                  <span className="text-gray-300">·</span>
                  <a href="/about" className="text-xs font-medium text-primary-600 hover:underline">Full Bio</a>
                  <span className="text-gray-300">·</span>
                  <a href="/about/certifications" className="text-xs font-medium text-primary-600 hover:underline">Certifications</a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Share */}
          <div className="px-6 sm:px-10 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            style={{ backgroundColor: '#f9fafb', borderTop: '1px solid #f3f4f6' }}>
            <p className="text-sm font-medium" style={{ color: '#4b5563' }}>Found this insightful? Share with your network.</p>
            <ShareBar post={post} slug={slug} />
          </div>
        </article>

        {/* Newsletter */}
        <div className="mt-8 rounded-2xl shadow-lg overflow-hidden" style={{ backgroundColor: '#1e293b' }}>
          <div className="px-6 sm:px-10 py-10 text-center">
            {subscribed ? (
              <div className="flex flex-col items-center gap-3">
                <CheckCircle className="h-10 w-10" style={{ color: '#4ade80' }} />
                <h3 className="text-xl font-bold" style={{ color: '#ffffff' }}>You&apos;re subscribed!</h3>
                <p className="max-w-md text-sm" style={{ color: '#94a3b8' }}>
                  You&apos;ll receive the latest AI insights from across the globe directly in your inbox.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#ffffff' }}>Stay ahead of the curve</h3>
                <p className="mb-6 max-w-md mx-auto text-sm" style={{ color: '#94a3b8' }}>
                  Practitioner insights on enterprise AI delivered to your inbox. No spam, just signal.
                </p>
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-sm mx-auto">
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email"
                    aria-label="Email address for newsletter"
                    className="w-full sm:flex-1 px-4 py-2.5 rounded-lg text-sm focus:outline-none"
                    style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.15)' }} />
                  <EmailOTP email={email} onVerified={() => setEmailVerified(true)} verified={emailVerified} compact />
                  <button type="submit" disabled={!emailVerified} className="shrink-0 px-5 py-2.5 font-semibold text-sm rounded-lg transition-colors hover:opacity-90"
                    style={{ backgroundColor: '#4f46e5', color: '#ffffff', opacity: !emailVerified ? 0.5 : 1 }}>
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
            <h3 className="text-lg font-bold mb-5" style={{ color: '#111827' }}>Continue reading</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedPosts.map(rp => (
                <Link key={rp.slug} href={`/resources/blog/${rp.slug}`}
                  className="group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                  style={{ backgroundColor: '#ffffff', border: '1px solid rgba(229,231,235,0.6)' }}>
                  <div className="h-28 flex flex-col justify-end p-4" style={{ backgroundColor: rp.coverColor }}>
                    <span className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>
                      {rp.category}
                    </span>
                    <h4 className="text-sm font-bold leading-snug line-clamp-2" style={{ color: '#ffffff' }}>
                      {rp.title}
                    </h4>
                  </div>
                  <div className="p-4">
                    <p className="text-xs line-clamp-2" style={{ color: '#6b7280' }}>{rp.excerpt}</p>
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
