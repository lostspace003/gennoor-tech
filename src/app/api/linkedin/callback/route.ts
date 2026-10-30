import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { siteUrl } from '@/lib/tech-call-mail'
import { exchangeCode, fetchAdminOrg, fetchMember, getLinkedInState, saveLinkedInState } from '@/lib/linkedin'

export const dynamic = 'force-dynamic'

/** OAuth redirect target registered on the LinkedIn app. Stores the token and who it posts as. */
export async function GET(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()

  const back = (q: string) => NextResponse.redirect(`${siteUrl()}/admin/linkedin?${q}`)
  const p = req.nextUrl.searchParams
  if (p.get('error')) return back(`error=${encodeURIComponent(p.get('error_description') || p.get('error') || 'denied')}`)

  const state = p.get('state')
  const code = p.get('code')
  if (!code || !state || state !== req.cookies.get('li_state')?.value) return back('error=State+mismatch,+please+try+connecting+again')

  try {
    const token = await exchangeCode(code, siteUrl())
    const member = await fetchMember(token.access_token)
    const org = (token.scope || '').includes('w_organization_social') ? await fetchAdminOrg(token.access_token) : null
    const prev = await getLinkedInState()
    await saveLinkedInState({
      shares: prev.shares,
      accessToken: token.access_token,
      expiresAt: new Date(Date.now() + token.expires_in * 1000).toISOString(),
      scope: token.scope,
      memberUrn: member.urn,
      memberName: member.name,
      orgUrn: org?.urn,
      orgName: org?.name,
      connectedAt: new Date().toISOString(),
    })
    const res = back('connected=1')
    res.cookies.delete({ name: 'li_state', path: '/api/linkedin' })
    return res
  } catch (e: any) {
    return back(`error=${encodeURIComponent(e?.message || 'Connection failed')}`)
  }
}
