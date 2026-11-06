import { NextRequest, NextResponse } from 'next/server'
import { getCommentsBySlug, saveComment } from '@/lib/azure-storage'
import { verifyLearnerSession } from '@/lib/learner-auth'

/**
 * Discussion threads for the Claude certification guides and prep hub.
 * Reading is open; posting requires a signed-in learner (the same
 * learner-session account used everywhere else on the site).
 * Comments are stored in the BlogComments table under a 'cert/' partition
 * prefix so they never mix with blog post slugs.
 */

// topic examples: ccarf/ch3, ccasf/ch12, prep-hub/ccdv-f, prep-hub/general
const TOPIC_RE = /^(ccasf|ccdvf|ccarf|ccarp|prep-hub)\/[a-z0-9-]{1,40}$/

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
function isRateLimited(email: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(email)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(email, { count: 1, resetAt: now + 3600000 })
    return false
  }
  if (entry.count >= 10) return true
  entry.count++
  return false
}

export async function GET(req: NextRequest) {
  const topic = req.nextUrl.searchParams.get('topic')
  if (!topic || !TOPIC_RE.test(topic)) {
    return NextResponse.json({ error: 'Invalid topic' }, { status: 400 })
  }
  try {
    const comments = await getCommentsBySlug(`cert/${topic}`)
    const safe = comments
      .map(({ authorEmail, ...c }) => c)
      .sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)))
    return NextResponse.json(safe)
  } catch (error) {
    console.error('Failed to fetch cert comments:', error)
    return NextResponse.json({ error: 'Failed to load comments' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const learner = await verifyLearnerSession()
  if (!learner) {
    return NextResponse.json({ error: 'Sign in to join the discussion.' }, { status: 401 })
  }
  try {
    const { topic, content, parentId } = await req.json()
    if (!topic || !TOPIC_RE.test(topic)) {
      return NextResponse.json({ error: 'Invalid topic' }, { status: 400 })
    }
    const text = String(content || '').trim()
    if (!text) return NextResponse.json({ error: 'Comment is empty' }, { status: 400 })
    if (text.length > 2000) {
      return NextResponse.json({ error: 'Comment too long (max 2000 characters)' }, { status: 400 })
    }
    if (isRateLimited(learner.email)) {
      return NextResponse.json({ error: 'Too many comments. Please try again later.' }, { status: 429 })
    }

    const cleanContent = text.replace(/<[^>]*>/g, '')
    const comment = await saveComment({
      slug: `cert/${topic}`,
      parentId: parentId ? String(parentId).slice(0, 64) : undefined,
      authorName: (learner.name || learner.email.split('@')[0]).slice(0, 100),
      authorEmail: learner.email,
      content: cleanContent,
    })
    const { authorEmail: _omit, ...safe } = comment as Record<string, any>
    return NextResponse.json(safe, { status: 201 })
  } catch (error) {
    console.error('Failed to save cert comment:', error)
    return NextResponse.json({ error: 'Failed to save comment' }, { status: 500 })
  }
}
