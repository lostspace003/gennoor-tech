import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const session = await auth()

    // Only admin can bulk upload
    if (session?.user?.email !== 'admin@gennoor.com') {
      return NextResponse.json(
        { error: 'Only admin@gennoor.com can upload leads' },
        { status: 403 }
      )
    }

    const { leads } = await request.json()

    // Here you would save to database
    // For now, we'll simulate success
    console.log(`Uploading ${leads.length} leads to database...`)

    // Simulate database save
    await new Promise(resolve => setTimeout(resolve, 500))

    return NextResponse.json({
      success: true,
      message: `Successfully uploaded ${leads.length} leads`,
      leadsCount: leads.length
    })
  } catch (error) {
    console.error('Error uploading leads:', error)
    return NextResponse.json(
      { error: 'Failed to upload leads' },
      { status: 500 }
    )
  }
}