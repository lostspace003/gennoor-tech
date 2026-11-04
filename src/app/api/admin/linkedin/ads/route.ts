import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { getLinkedInState, saveLinkedInState } from '@/lib/linkedin'
import { adsAppConfigured, ensureConversionRules, liveAdsToken, syncLeadGenLeads } from '@/lib/linkedin-ads'

export const dynamic = 'force-dynamic'

/** Status of the LinkedIn advertising connection (Lead Sync + Conversions). Never returns tokens. */
export async function GET(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const s = await getLinkedInState()
  return NextResponse.json({
    configured: adsAppConfigured(),
    connected: !!liveAdsToken(s),
    expired: !!s.adsAccessToken && !liveAdsToken(s),
    expiresAt: s.adsExpiresAt || null,
    accountId: s.adsAccountId || process.env.LINKEDIN_ADS_ACCOUNT_ID || '',
    conversions: Object.keys(s.adsConversions || {}),
    lastSyncAt: s.adsLastSyncAt || null,
    leadsImported: s.adsLeadsImported || 0,
  })
}

/** { action: 'sync' | 'rules' | 'account', accountId? } */
export async function POST(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const b = await req.json().catch(() => ({}))
  try {
    if (b.action === 'account') {
      const id = String(b.accountId || '').replace(/\D/g, '')
      if (!id) return NextResponse.json({ error: 'Enter the numeric ad account id.' }, { status: 400 })
      await saveLinkedInState({ ...(await getLinkedInState()), adsAccountId: id, adsConversions: {} })
      return NextResponse.json({ ok: true })
    }
    if (b.action === 'rules') return NextResponse.json({ ok: true, rules: Object.keys(await ensureConversionRules()) })
    if (b.action === 'sync') return NextResponse.json({ ok: true, ...(await syncLeadGenLeads()) })
    return NextResponse.json({ error: 'Unknown action.' }, { status: 400 })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed.' }, { status: 502 })
  }
}
