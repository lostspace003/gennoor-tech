import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const clientId = process.env.LEARNER_AZURE_AD_CLIENT_ID || process.env.AZURE_AD_CLIENT_ID
  if (!clientId) {
    return NextResponse.json({ error: 'Microsoft sign-in not configured' }, { status: 500 })
  }

  const redirectUri = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/learner/login-microsoft/callback`
  const returnTo = request.nextUrl.searchParams.get('returnTo') || '/ai-academy'

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    scope: 'openid profile email',
    response_mode: 'query',
    state: returnTo,
  })

  const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${params}`
  return NextResponse.redirect(authUrl)
}
