import { NextRequest, NextResponse } from 'next/server'
import { getTokenExchangeParams, saveLinkedInTokens } from '@/lib/linkedin'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  if (error) {
    return NextResponse.json(
      { error, description: errorDescription },
      { status: 400 }
    )
  }

  if (!code) {
    return NextResponse.json(
      { error: 'No authorization code received' },
      { status: 400 }
    )
  }

  try {
    const params = getTokenExchangeParams(code)

    const res = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(params),
    })

    if (!res.ok) {
      const errText = await res.text()
      return NextResponse.json(
        { error: 'Token exchange failed', details: errText },
        { status: 500 }
      )
    }

    const data = await res.json()

    await saveLinkedInTokens({
      accessToken: data.access_token,
      refreshToken: data.refresh_token || '',
      expiresIn: data.expires_in,
      refreshTokenExpiresIn: data.refresh_token_expires_in,
    })

    // Redirect to homepage with success message
    return NextResponse.redirect(new URL('/?linkedin=authorized', request.url))
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to process callback', details: error.message },
      { status: 500 }
    )
  }
}
