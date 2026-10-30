import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { authorizeUrl, linkedInConfigured } from '@/lib/linkedin'
import { siteUrl } from '@/lib/tech-call-mail'

export const dynamic = 'force-dynamic'

/** Starts the LinkedIn OAuth flow. `?org=1` also asks for the company-page scopes. */
export async function GET(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  if (!linkedInConfigured()) {
    return NextResponse.json({ error: 'LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET are not set.' }, { status: 503 })
  }
  const state = randomBytes(16).toString('hex')
  const res = NextResponse.redirect(authorizeUrl(siteUrl(), state, req.nextUrl.searchParams.get('org') === '1'))
  res.cookies.set('li_state', state, { httpOnly: true, secure: true, sameSite: 'lax', path: '/api/linkedin', maxAge: 600 })
  return res
}
