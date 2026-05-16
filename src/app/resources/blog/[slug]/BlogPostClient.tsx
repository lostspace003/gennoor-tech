'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { type BlogPost, type BlogPostMeta } from '@/data/blog-posts'
import EmailOTP from '@/components/EmailOTP'
import { CheckCircle } from 'lucide-react'
import AuthorByline from '@/components/blog/AuthorByline'
import KeyTakeaways from '@/components/blog/KeyTakeaways'
import PostFAQ from '@/components/blog/PostFAQ'
import References from '@/components/blog/References'
import { resolveAuthor } from '@/config/authors'

const BlogComments = dynamic(() => import('@/components/BlogComments'), { ssr: false })

/* ── Summary Modal ─────────────────────────────────────────── */

function extractSections(html: string): { heading: string; snippet: string }[] {
  const sections: { heading: string; snippet: string }[] = []
  const h2Regex = /<h2[^>]*>(.*?)<\/h2>/gi
  let match: RegExpExecArray | null
  const positions: { heading: string; index: number }[] = []

  while ((match = h2Regex.exec(html)) !== null) {
    positions.push({ heading: match[1].replace(/<[^>]+>/g, ''), index: match.index + match[0].length })
  }

  positions.forEach((pos, i) => {
    const end = i + 1 < positions.length ? html.lastIndexOf('<h2', positions[i + 1].index) : html.length
    const chunk = html.slice(pos.index, end)
    // grab first <p> text as snippet
    const pMatch = chunk.match(/<p[^>]*>(.*?)<\/p>/i)
    const snippet = pMatch ? pMatch[1].replace(/<[^>]+>/g, '').slice(0, 200) : ''
    sections.push({ heading: pos.heading, snippet: snippet + (snippet.length >= 200 ? '...' : '') })
  })

  return sections
}

function SummaryModal({ post, onClose }: { post: BlogPost; onClose: () => void }) {
  const sections = useMemo(() => extractSections(post.content), [post.content])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleEsc)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', handleEsc) }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 modal-backdrop" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }} />

      {/* Modal */}
      <div
        className="relative w-full h-full sm:w-[90vw] sm:h-[90vh] sm:max-w-3xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-slideUp"
        style={{ backgroundColor: '#ffffff' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="shrink-0 px-6 sm:px-8 py-5 flex items-start justify-between gap-4" style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: '#fafafa' }}>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#2563eb' }}>Quick Summary</p>
            <h2 className="text-lg sm:text-xl font-bold leading-snug" style={{ color: '#111827' }}>{post.title}</h2>
          </div>
          <button onClick={onClose} className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full transition-colors hover:bg-gray-200" style={{ color: '#6b7280' }}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-6">
          {/* Excerpt */}
          <div className="p-4 rounded-xl" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <p className="text-sm font-medium leading-relaxed" style={{ color: '#374151' }}>{post.excerpt}</p>
          </div>

          {/* Key Takeaway */}
          {post.tldr && (
            <div className="p-4 rounded-xl border-l-4" style={{ backgroundColor: '#f0fdf9', borderColor: '#0d9488' }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: '#0d9488' }}>Key Takeaway</p>
              <p className="text-sm leading-relaxed" style={{ color: '#374151' }}>{post.tldr}</p>
            </div>
          )}

          {/* Sections outline */}
          {sections.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#6b7280' }}>What this article covers</p>
              <div className="space-y-3">
                {sections.map((sec, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>{i + 1}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold" style={{ color: '#111827' }}>{sec.heading}</p>
                      {sec.snippet && <p className="text-xs mt-0.5 leading-relaxed" style={{ color: '#6b7280' }}>{sec.snippet}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Meta */}
          <div className="flex flex-wrap gap-3 pt-2" style={{ borderTop: '1px solid #f3f4f6' }}>
            <span className="px-3 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: '#f3f4f6', color: '#374151' }}>{post.readTime}</span>
            <span className="px-3 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: '#f3f4f6', color: '#374151' }}>{post.category}</span>
            {post.tags.map(t => (
              <span key={t} className="px-3 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: '#f0fdf9', color: '#0d9488' }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 px-6 sm:px-8 py-4 flex justify-end" style={{ borderTop: '1px solid #e5e7eb', backgroundColor: '#fafafa' }}>
          <button onClick={onClose} className="px-5 py-2 text-sm font-semibold rounded-lg transition-colors"
            style={{ background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)', color: '#ffffff' }}>
            Read Full Article
          </button>
        </div>
      </div>
    </div>
  )
}

function SummarizeButton({ onClick }: { onClick: () => void }) {
  return (
    <>
      <button
        onClick={onClick}
        className="poc-sparkle-btn relative inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all group overflow-hidden"
      >
        <span className="poc-shimmer absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0" />
        <svg className="poc-sparkle-icon h-3.5 w-3.5 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <span className="relative">Summarize</span>
      </button>
      <style jsx>{`
        .poc-shimmer { animation: shimmer 2.5s ease-in-out infinite; }
        .poc-sparkle-icon { animation: sparkle 1.5s ease-in-out infinite; }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          50.01%, 100% { transform: translateX(-100%); }
        }
        @keyframes sparkle {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
          50% { transform: scale(1.2) rotate(15deg); opacity: 0.8; }
        }
      `}</style>
    </>
  )
}

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
  relatedPosts: BlogPostMeta[]
}) {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [emailVerified, setEmailVerified] = useState(false)
  const [showSummary, setShowSummary] = useState(false)

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
      await fetch('/api/newsletter-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source: `blog-post:${slug}`,
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
              <AuthorByline
                author={resolveAuthor(post.author)}
                date={post.date}
                readTime={post.readTime}
              />
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
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium uppercase tracking-wider hidden sm:inline" style={{ color: '#6b7280' }}>Share</span>
              <SummarizeButton onClick={() => setShowSummary(true)} />
              <a href="#discussion" className="text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
                style={{ color: '#4f46e5', backgroundColor: '#eef2ff', border: '1px solid #e0e7ff' }}>
                Join Discussion
              </a>
            </div>
            <ShareBar post={post} slug={slug} />
          </div>

          {/* Key Takeaways — AEO/featured-snippet optimized */}
          <KeyTakeaways takeaways={post.keyTakeaways} tldr={post.tldr} />

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

          {/* FAQ section — paired with FAQJsonLd in server page */}
          <PostFAQ faqs={post.faqs} />

          {/* References — authoritative outbound links for E-E-A-T */}
          <References references={post.references} />

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

          {/* Author Bio — long form, paired with compact AuthorByline in hero */}
          {(() => {
            const author = resolveAuthor(post.author)
            return (
              <div className="px-6 sm:px-10 py-8" style={{ borderTop: '1px solid #f3f4f6', backgroundColor: '#f9fafb' }}>
                <div className="flex items-start gap-4">
                  {author.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={author.photoUrl}
                      alt={author.name}
                      width={56}
                      height={56}
                      className="w-14 h-14 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-14 h-14 shrink-0 rounded-full bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center">
                      <span className="text-lg font-black text-white">{author.initials}</span>
                    </div>
                  )}
                  <div>
                    <h4 className="text-base font-bold text-gray-900">{author.name}</h4>
                    <p className="text-sm font-medium text-primary-600 mb-2">{author.credentials} · {author.role}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{author.bio}</p>
                    <div className="flex items-center gap-3 mt-3 flex-wrap">
                      {author.links.linkedin && (
                        <a href={author.links.linkedin} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-primary-600 hover:underline">LinkedIn</a>
                      )}
                      {author.links.about && (
                        <>
                          <span className="text-gray-300">·</span>
                          <a href={author.links.about} className="text-xs font-medium text-primary-600 hover:underline">Full Bio</a>
                        </>
                      )}
                      {author.links.certifications && (
                        <>
                          <span className="text-gray-300">·</span>
                          <a href={author.links.certifications} className="text-xs font-medium text-primary-600 hover:underline">Certifications</a>
                        </>
                      )}
                      {author.links.microsoftLearn && (
                        <>
                          <span className="text-gray-300">·</span>
                          <a href={author.links.microsoftLearn} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-primary-600 hover:underline">Microsoft Learn</a>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })()}

          {/* Bottom Share */}
          <div className="px-6 sm:px-10 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            style={{ backgroundColor: '#f9fafb', borderTop: '1px solid #f3f4f6' }}>
            <p className="text-sm font-medium" style={{ color: '#4b5563' }}>Found this insightful? Share with your network.</p>
            <ShareBar post={post} slug={slug} />
          </div>
        </article>

        <div id="discussion">
          <BlogComments slug={slug} />
        </div>

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

      {/* Summary Modal */}
      {showSummary && <SummaryModal post={post} onClose={() => setShowSummary(false)} />}
    </div>
  )
}
