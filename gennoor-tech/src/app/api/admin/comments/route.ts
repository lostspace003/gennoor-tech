import { NextRequest, NextResponse } from 'next/server'
import { getAllComments, updateCommentStatus } from '@/lib/azure-storage'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'

export async function GET(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()

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
    const { authorized } = await verifyAdmin(req)
    if (!authorized) return unauthorizedResponse()
    const { slug, rowKey, status } = await req.json()
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
