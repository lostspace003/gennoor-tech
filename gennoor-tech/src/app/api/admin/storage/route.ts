import { NextRequest, NextResponse } from 'next/server'
import { getStorageOverview, getRecentBlobs } from '@/lib/azure-blobs'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  try {
    const { authorized } = await verifyAdmin(request)
    if (!authorized) return unauthorizedResponse()

    const [containers, recentBlobs] = await Promise.all([
      getStorageOverview(),
      getRecentBlobs(20),
    ])

    return NextResponse.json({ containers, recentBlobs })
  } catch (error) {
    console.error('Storage error:', error)
    return NextResponse.json({ error: 'Failed to fetch storage data' }, { status: 500 })
  }
}
