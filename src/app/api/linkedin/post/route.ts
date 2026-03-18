import { NextRequest, NextResponse } from 'next/server'
import { postToCompanyPage, hasBeenPosted, markAsPosted } from '@/lib/linkedin'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { slug, title, excerpt, url, hashtags } = body

    if (!slug || !title || !url) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: slug, title, url' },
        { status: 400 }
      )
    }

    // Check for duplicate
    const alreadyPosted = await hasBeenPosted(slug)
    if (alreadyPosted) {
      return NextResponse.json(
        { success: false, message: 'This article has already been posted to LinkedIn' },
        { status: 409 }
      )
    }

    // Post to LinkedIn company page
    const result = await postToCompanyPage({
      title,
      excerpt: excerpt || '',
      url,
      hashtags: hashtags || [],
    })

    if (result.success) {
      await markAsPosted(slug, result.postUrn)
      return NextResponse.json({
        success: true,
        message: 'Posted to Gennoor Tech LinkedIn page',
        postUrn: result.postUrn,
      })
    }

    return NextResponse.json(
      { success: false, message: result.error },
      { status: 500 }
    )
  } catch (error: any) {
    console.error('LinkedIn post error:', error.message)
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}
