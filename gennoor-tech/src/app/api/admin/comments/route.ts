import { NextRequest, NextResponse } from 'next/server'
import { getAllComments, updateCommentStatus } from '@/lib/azure-storage'

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const comments = await getAllComments()
    return NextResponse.json(comments)
  } catch (error) {
    console.error('Failed to fetch all comments:', error)
    return NextResponse.json({ error: 'Failed to load comments' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { slug, rowKey, status, secret } = await req.json()
    if (secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (!slug || !rowKey || !status) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }
    await updateCommentStatus(slug, rowKey, status)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to update comment:', error)
    return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 })
  }
}
