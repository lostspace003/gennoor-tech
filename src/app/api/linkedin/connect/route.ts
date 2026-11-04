import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { authorizeUrl, linkedInConfigured, oauthOrigin } from '@/lib/linkedin'
import { adsAppConfigured, adsAuthorizeUrl } from '@/lib/linkedin-ads'
import { siteUrl } from '@/lib/tech-call-mail'

export const dynamic = 'force-dynamic'

/** Starts the LinkedIn OAuth flow. `?org=1` also asks for the company-page scopes. */
export async function GET(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  if (req.nextUrl.searchParams.get('ads') === '1') {
    if (!adsAppConfigured()) return NextResponse.json({ error: 'LINKEDIN_ADS_CLIENT_ID and LINKEDIN_ADS_CLIENT_SECRET are not set.' }, { status: 503 })
    const adsState = `${randomBytes(16).toString('hex')}.ads`
    const r = NextResponse.redirect(adsAuthorizeUrl(oauthOrigin(req, siteUrl()), adsState))
    r.cookies.set('li_state', adsState, { httpOnly: true, secure: true, sameSite: 'lax', path: '/api/linkedin', maxAge: 600 })
    return r
  }
  if (!linkedInConfigured()) {
    return NextResponse.json({ error: 'LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET are not set.' }, { status: 503 })
  }
  const withOrg = req.nextUrl.searchParams.get('org') === '1'
  const state = `${randomBytes(16).toString('hex')}${withOrg ? '.org' : ''}`
  const res = NextResponse.redirect(authorizeUrl(oauthOrigin(req, siteUrl()), state, withOrg))
  res.cookies.set('li_state', state, { httpOnly: true, secure: true, sameSite: 'lax', path: '/api/linkedin', maxAge: 600 })
  return res
}
