import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { exchangeAdsCode, listAdAccounts } from '@/lib/linkedin-ads'
import { siteUrl } from '@/lib/tech-call-mail'
import { pageAppConfigured, oauthOrigin, exchangeCode, fetchAdminOrg, fetchMember, getLinkedInState, saveLinkedInState } from '@/lib/linkedin'

export const dynamic = 'force-dynamic'

/** OAuth redirect target registered on the LinkedIn app. Stores the token and who it posts as. */
export async function GET(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()

  const back = (q: string) => NextResponse.redirect(`${oauthOrigin(req, siteUrl())}/admin/linkedin?${q}`)
  const p = req.nextUrl.searchParams
  if (p.get('error')) return back(`error=${encodeURIComponent(p.get('error_description') || p.get('error') || 'denied')}`)

  const state = p.get('state')
  const code = p.get('code')
  if (!code || !state || state !== req.cookies.get('li_state')?.value) return back('error=State+mismatch,+please+try+connecting+again')

  if (state.endsWith('.ads')) {
    try {
      const token = await exchangeAdsCode(code, oauthOrigin(req, siteUrl()))
      const prev = await getLinkedInState()
      let accountId = prev.adsAccountId || process.env.LINKEDIN_ADS_ACCOUNT_ID
      if (!accountId) accountId = (await listAdAccounts(token.access_token).catch(() => []))[0]?.id
      await saveLinkedInState({
        ...prev,
        adsAccessToken: token.access_token,
        adsExpiresAt: new Date(Date.now() + token.expires_in * 1000).toISOString(),
        adsScope: token.scope,
        adsAccountId: accountId,
      })
      const res = back('connected=1&ads=1')
      res.cookies.delete({ name: 'li_state', path: '/api/linkedin' })
      return res
    } catch (e: any) {
      return back(`error=${encodeURIComponent(e?.message || 'Connection failed')}`)
    }
  }

  try {
    const forPage = state.endsWith('.org') && pageAppConfigured()
    const token = await exchangeCode(code, oauthOrigin(req, siteUrl()), forPage)
    const prev = await getLinkedInState()
    const expiresAt = new Date(Date.now() + token.expires_in * 1000).toISOString()
    if (forPage) {
      // Page app: keep the member connection as is, add the page token and page.
      const org = await fetchAdminOrg(token.access_token)
      await saveLinkedInState({ ...prev, orgAccessToken: token.access_token, orgExpiresAt: expiresAt, orgUrn: org?.urn || prev.orgUrn, orgName: org?.name || prev.orgName })
    } else {
      const member = await fetchMember(token.access_token)
      const org = (token.scope || '').includes('w_organization_social') ? await fetchAdminOrg(token.access_token) : null
      await saveLinkedInState({
        ...prev,
        accessToken: token.access_token,
        expiresAt,
        scope: token.scope,
        memberUrn: member.urn,
        memberName: member.name,
        ...(org ? { orgUrn: org.urn, orgName: org.name, orgAccessToken: token.access_token, orgExpiresAt: expiresAt } : {}),
        connectedAt: new Date().toISOString(),
      })
    }
    const res = back('connected=1')
    res.cookies.delete({ name: 'li_state', path: '/api/linkedin' })
    return res
  } catch (e: any) {
    return back(`error=${encodeURIComponent(e?.message || 'Connection failed')}`)
  }
}
