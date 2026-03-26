import { NextRequest, NextResponse } from 'next/server'
import { getStorageOverview, getRecentBlobs } from '@/lib/azure-blobs'

export async function POST(request: NextRequest) {
  try {
    const { secret } = await request.json()
    if (secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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
