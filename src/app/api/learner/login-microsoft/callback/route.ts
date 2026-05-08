import { NextRequest, NextResponse } from 'next/server'
import { createLearnerToken, learnerCookieOptions } from '@/lib/learner-auth'
import { saveLearner } from '@/lib/azure-storage'

export async function GET(request: NextRequest) {
  try {
    const code = request.nextUrl.searchParams.get('code')
    const returnTo = request.nextUrl.searchParams.get('state') || '/ai-academy'

    if (!code) {
      return NextResponse.redirect(new URL('/ai-academy?error=no_code', request.url))
    }

    const clientId = process.env.LEARNER_AZURE_AD_CLIENT_ID || process.env.AZURE_AD_CLIENT_ID
    const clientSecret = process.env.LEARNER_AZURE_AD_CLIENT_SECRET || process.env.AZURE_AD_CLIENT_SECRET
    const redirectUri = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/learner/login-microsoft/callback`

    if (!clientId || !clientSecret) {
      return NextResponse.redirect(new URL('/ai-academy?error=not_configured', request.url))
    }

    // Exchange code for tokens
    const tokenRes = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
        scope: 'openid profile email',
      }),
    })

    if (!tokenRes.ok) {
      return NextResponse.redirect(new URL('/ai-academy?error=token_exchange', request.url))
    }

    const tokens = await tokenRes.json()

    // Decode the ID token to get user info (no verification needed — we trust Microsoft's token endpoint)
    const idTokenParts = tokens.id_token?.split('.')
    if (!idTokenParts || idTokenParts.length !== 3) {
      return NextResponse.redirect(new URL('/ai-academy?error=invalid_token', request.url))
    }

    const payload = JSON.parse(Buffer.from(idTokenParts[1], 'base64').toString())
    const email = payload.preferred_username || payload.email || payload.upn
    const name = payload.name || email?.split('@')[0] || 'Learner'

    if (!email) {
      return NextResponse.redirect(new URL('/ai-academy?error=no_email', request.url))
    }

    await saveLearner({ email, name, provider: 'microsoft' })
    const token = await createLearnerToken({ email, name, provider: 'microsoft' })

    const response = NextResponse.redirect(new URL(returnTo, request.url))
    response.cookies.set(learnerCookieOptions(token))
    return response
  } catch {
    return NextResponse.redirect(new URL('/ai-academy?error=auth_failed', request.url))
  }
}
