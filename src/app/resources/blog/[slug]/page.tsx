import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react'
import { blogPosts, getBlogPost, getRelatedPosts } from '@/data/blog-posts'
import AuthorBio from '@/components/blog/AuthorBio'
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) return { title: 'Post Not Found' }

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    authors: [{ name: post.author }],
    alternates: { canonical: `https://gennoor.com/resources/blog/${post.slug}` },
    openGraph: {
      title: `${post.title} | Gennoor Tech`,
      description: post.excerpt,
      url: `https://gennoor.com/resources/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
  }
}

function renderMarkdown(content: string) {
  // Simple markdown-to-HTML for blog content
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let inCodeBlock = false
  let codeContent = ''
  let codeLanguage = ''

  lines.forEach((line, i) => {
    // Code blocks
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <pre key={`code-${i}`} className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto my-6 text-sm">
            <code>{codeContent.trim()}</code>
          </pre>
        )
        codeContent = ''
        inCodeBlock = false
      } else {
        inCodeBlock = true
        codeLanguage = line.slice(3).trim()
      }
      return
    }

    if (inCodeBlock) {
      codeContent += line + '\n'
      return
    }

    // Headings
    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} className="text-2xl font-bold text-gray-900 mt-10 mb-4">
          {line.slice(3)}
        </h2>
      )
      return
    }
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={i} className="text-xl font-semibold text-gray-900 mt-8 mb-3">
          {line.slice(4)}
        </h3>
      )
      return
    }

    // Bold and links inline
    const processInline = (text: string): React.ReactNode => {
      // Handle links [text](url)
      const parts: React.ReactNode[] = []
      let remaining = text
      let key = 0

      while (remaining.length > 0) {
        const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/)
        const boldMatch = remaining.match(/\*\*([^*]+)\*\*/)

        if (linkMatch && (!boldMatch || remaining.indexOf(linkMatch[0]) <= remaining.indexOf(boldMatch[0]))) {
          const idx = remaining.indexOf(linkMatch[0])
          if (idx > 0) parts.push(remaining.slice(0, idx))
          parts.push(
            <Link key={`link-${key++}`} href={linkMatch[2]} className="text-primary-600 hover:underline">
              {linkMatch[1]}
            </Link>
          )
          remaining = remaining.slice(idx + linkMatch[0].length)
        } else if (boldMatch) {
          const idx = remaining.indexOf(boldMatch[0])
          if (idx > 0) parts.push(remaining.slice(0, idx))
          parts.push(<strong key={`bold-${key++}`} className="font-semibold text-gray-900">{boldMatch[1]}</strong>)
          remaining = remaining.slice(idx + boldMatch[0].length)
        } else {
          parts.push(remaining)
          remaining = ''
        }
      }
      return parts.length === 1 ? parts[0] : <>{parts}</>
    }

    // Bullet points
    if (line.startsWith('- **') || line.startsWith('- ')) {
      elements.push(
        <li key={i} className="ml-6 mb-2 text-gray-700 list-disc">
          {processInline(line.slice(2))}
        </li>
      )
      return
    }

    // Numbered lists
    const numberedMatch = line.match(/^(\d+)\.\s(.+)/)
    if (numberedMatch) {
      elements.push(
        <li key={i} className="ml-6 mb-2 text-gray-700 list-decimal">
          {processInline(numberedMatch[2])}
        </li>
      )
      return
    }

    // Empty lines
    if (line.trim() === '') {
      return
    }

    // Regular paragraphs
    elements.push(
      <p key={i} className="text-gray-700 leading-relaxed mb-4">
        {processInline(line)}
      </p>
    )
  })

  return elements
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) notFound()

  const relatedPosts = getRelatedPosts(slug, post.category)

  return (
    <>
      <article className="min-h-screen pt-20">
        {/* Header */}
        <section className="bg-gradient-to-br from-primary-50 to-white py-12 lg:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <Link
                href="/resources/blog"
                className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>

              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                  {post.category}
                </span>
                <span className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  {post.readTime}
                </span>
                <span className="flex items-center gap-1 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {post.title}
              </h1>

              <p className="text-lg text-gray-600">{post.excerpt}</p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <div className="prose-custom">
                {renderMarkdown(post.content)}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-gray-200">
                <Tag className="w-4 h-4 text-gray-400 mt-1" />
                {post.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Author Bio */}
              <div className="mt-10">
                <AuthorBio />
              </div>

              {/* CTA */}
              <div className="mt-10 bg-primary-50 rounded-xl p-6 text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to bring AI to your organization?</h3>
                <p className="text-gray-600 mb-4">Book a free 30-minute discovery call to discuss your AI goals.</p>
                <Link
                  href="/contact#book"
                  className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Book a Discovery Call
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-5xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map((related) => (
                    <Link
                      key={related.slug}
                      href={`/resources/blog/${related.slug}`}
                      className="group bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                    >
                      <span className="text-xs font-medium text-primary-600">{related.category}</span>
                      <h3 className="text-lg font-semibold text-gray-900 mt-2 mb-2 group-hover:text-primary-600 transition-colors">
                        {related.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{related.excerpt}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </article>

      <ArticleJsonLd
        title={post.title}
        description={post.excerpt}
        url={`https://gennoor.com/resources/blog/${post.slug}`}
        datePublished={post.date}
        authorName={post.author}
      />
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://gennoor.com' },
        { name: 'Blog', url: 'https://gennoor.com/resources/blog' },
        { name: post.title, url: `https://gennoor.com/resources/blog/${post.slug}` },
      ]} />
    </>
  )
}
