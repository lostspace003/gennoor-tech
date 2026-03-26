import { NextRequest, NextResponse } from 'next/server'
import { getCommentsBySlug, saveComment, updateCommentStatus } from '@/lib/azure-storage'
import { blogPostsMeta } from '@/data/blog-posts'

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(email: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(email)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(email, { count: 1, resetAt: now + 3600000 }) // 1 hour window
    return false
  }
  if (entry.count >= 5) return true
  entry.count++
  return false
}

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug')
  if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 })

  try {
    const comments = await getCommentsBySlug(slug)
    // Strip emails from public response
    const safe = comments.map(({ authorEmail, ...c }) => c)
    return NextResponse.json(safe)
  } catch (error) {
    console.error('Failed to fetch comments:', error)
    return NextResponse.json({ error: 'Failed to load comments' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { slug, parentId, authorName, authorEmail, content } = await req.json()

    // Validate
    if (!slug || !authorName?.trim() || !authorEmail?.trim() || !content?.trim()) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }
    if (!blogPostsMeta.find(p => p.slug === slug)) {
      return NextResponse.json({ error: 'Invalid blog post' }, { status: 400 })
    }
    if (content.length > 2000) {
      return NextResponse.json({ error: 'Comment too long (max 2000 characters)' }, { status: 400 })
    }

    // Rate limit
    if (isRateLimited(authorEmail)) {
      return NextResponse.json({ error: 'Too many comments. Please try again later.' }, { status: 429 })
    }

    // Strip HTML tags for XSS prevention
    const cleanContent = content.replace(/<[^>]*>/g, '')
    const cleanName = authorName.replace(/<[^>]*>/g, '').trim().slice(0, 100)

    const comment = await saveComment({
      slug,
      parentId,
      authorName: cleanName,
      authorEmail: authorEmail.trim(),
      content: cleanContent,
    })

    // Strip email from response
    const { authorEmail: _, ...safe } = comment
    return NextResponse.json(safe, { status: 201 })
  } catch (error) {
    console.error('Failed to save comment:', error)
    return NextResponse.json({ error: 'Failed to save comment' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { slug, rowKey, adminSecret } = await req.json()
    if (adminSecret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    await updateCommentStatus(slug, rowKey, 'hidden')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete comment:', error)
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 })
  }
}
