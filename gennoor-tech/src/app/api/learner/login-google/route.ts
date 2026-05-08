import { NextRequest, NextResponse } from 'next/server'
import { createRemoteJWKSet, jwtVerify } from 'jose'
import { createLearnerToken, learnerCookieOptions } from '@/lib/learner-auth'
import { saveLearner } from '@/lib/azure-storage'

const GOOGLE_JWKS = createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'))

export async function POST(request: NextRequest) {
  try {
    const { credential } = await request.json()

    if (!credential) {
      return NextResponse.json({ error: 'Google credential is required' }, { status: 400 })
    }

    const googleClientId = process.env.GOOGLE_CLIENT_ID
    if (!googleClientId) {
      return NextResponse.json({ error: 'Google sign-in not configured' }, { status: 500 })
    }

    const { payload } = await jwtVerify(credential, GOOGLE_JWKS, {
      issuer: ['https://accounts.google.com', 'accounts.google.com'],
      audience: googleClientId,
    })

    const email = payload.email as string
    const name = (payload.name as string) || email.split('@')[0]

    if (!email) {
      return NextResponse.json({ error: 'No email in Google token' }, { status: 400 })
    }

    await saveLearner({ email, name, provider: 'google' })
    const token = await createLearnerToken({ email, name, provider: 'google' })

    const response = NextResponse.json({ success: true, name, email })
    response.cookies.set(learnerCookieOptions(token))
    return response
  } catch (err) {
    return NextResponse.json({ error: 'Google authentication failed' }, { status: 401 })
  }
}
