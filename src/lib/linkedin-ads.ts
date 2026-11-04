import { createHash } from 'crypto'
import { getLinkedInState, saveLinkedInState, redirectUri, LinkedInState } from '@/lib/linkedin'
import { mutateLeads } from '@/lib/crm/store'
import { newLead, Lead } from '@/lib/crm/types'

// LinkedIn Lead Sync API (Lead Gen Forms -> CRM) and Conversions API (CRM outcomes -> LinkedIn).
// Both run on the advertising app (LINKEDIN_ADS_CLIENT_ID/SECRET), connected once from /admin/linkedin.

export const ADS_SCOPES = 'r_ads r_ads_reporting r_marketing_leadgen_automation r_ads_leadgen_automation rw_conversions'
const API_VERSION = '202609'

export type ConversionKind = 'qualified' | 'call_booked' | 'won'
const RULES: Record<ConversionKind, { name: string; type: string }> = {
  qualified: { name: 'Gennoor - Lead qualified', type: 'QUALIFIED_LEAD' },
  call_booked: { name: 'Gennoor - Call booked', type: 'BOOK_APPOINTMENT' },
  won: { name: 'Gennoor - Enrolled / won', type: 'PURCHASE' },
}

export const adsAppConfigured = () => !!(process.env.LINKEDIN_ADS_CLIENT_ID && process.env.LINKEDIN_ADS_CLIENT_SECRET)
const accountId = (s: LinkedInState) => s.adsAccountId || process.env.LINKEDIN_ADS_ACCOUNT_ID || ''

export function adsAuthorizeUrl(origin: string, state: string) {
  const q = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.LINKEDIN_ADS_CLIENT_ID || '',
    redirect_uri: redirectUri(origin),
    state,
    scope: process.env.LINKEDIN_ADS_SCOPES || ADS_SCOPES,
  })
  return `https://www.linkedin.com/oauth/v2/authorization?${q}`
}

export async function exchangeAdsCode(code: string, origin: string): Promise<{ access_token: string; expires_in: number; scope?: string }> {
  const res = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri(origin),
      client_id: process.env.LINKEDIN_ADS_CLIENT_ID || '',
      client_secret: process.env.LINKEDIN_ADS_CLIENT_SECRET || '',
    }),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok || !json.access_token) throw new Error(json.error_description || `Token exchange failed (${res.status})`)
  return json
}

const headers = (token: string) => ({
  Authorization: `Bearer ${token}`,
  'Linkedin-Version': API_VERSION,
  'X-Restli-Protocol-Version': '2.0.0',
  'Content-Type': 'application/json',
})

export function liveAdsToken(s: LinkedInState): string | null {
  return s.adsAccessToken && s.adsExpiresAt && new Date(s.adsExpiresAt) > new Date() ? s.adsAccessToken : null
}

/** Ad accounts the connected member can see; used to confirm/pick the right account after connecting. */
export async function listAdAccounts(token: string): Promise<{ id: string; name: string; status: string }[]> {
  const res = await fetch('https://api.linkedin.com/rest/adAccounts?q=search&count=20', { headers: headers(token) })
  const j = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(j.message || `Could not list ad accounts (${res.status})`)
  return (j.elements || []).map((a: any) => ({ id: String(a.id), name: a.name || '', status: a.status || '' }))
}

// ---------- Lead Sync ----------

const FIELD_MAP: Record<string, string> = {
  FIRST_NAME: 'first', LAST_NAME: 'last', EMAIL: 'email', PHONE_NUMBER: 'phone', COMPANY_NAME: 'company', JOB_TITLE: 'designation',
  CITY: 'city', COUNTRY: 'country',
}
type QMap = Record<string, { field?: string; label: string }>

async function formQuestions(token: string, formUrn: string, cache: Map<string, QMap>): Promise<QMap> {
  if (cache.has(formUrn)) return cache.get(formUrn)!
  const map: QMap = {}
  try {
    const r = await fetch(`https://api.linkedin.com/rest/leadForms/${formUrn.split(':').pop()}`, { headers: headers(token) })
    if (r.ok) {
      const j = await r.json()
      for (const g of j.content?.questionGroups || j.questionGroups || []) {
        for (const q of g.questions || []) {
          const qid = String(q.questionId ?? q.id ?? '')
          if (qid) map[qid] = { field: q.predefinedField, label: (q.question?.localized ? (Object.values(q.question.localized)[0] as string) : q.name) || '' }
        }
      }
    }
  } catch { /* fall back to unlabeled answers */ }
  cache.set(formUrn, map)
  return map
}

/** Pulls new Lead Gen Form responses into the CRM. Deduped by LinkedIn response id and email; safe to run repeatedly. */
export async function syncLeadGenLeads(): Promise<{ imported: number; scanned: number }> {
  const s = await getLinkedInState()
  const token = liveAdsToken(s)
  const acct = accountId(s)
  if (!token || !acct) throw new Error('Connect the LinkedIn ads app and set the ad account first.')

  const owner = `(sponsoredAccount:${encodeURIComponent(`urn:li:sponsoredAccount:${acct}`)})`
  const since = s.adsLastLeadAt ? Math.max(0, s.adsLastLeadAt - 3_600_000) : 0
  const range = since ? `&submittedAtTimeRange=(start:${since})` : ''
  const res = await fetch(`https://api.linkedin.com/rest/leadFormResponses?q=owner&owner=${owner}&leadType=(leadType:SPONSORED)&limit=100${range}`, { headers: headers(token) })
  const j = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(j.message || `Lead Sync failed (${res.status}). Check the Lead Gen Forms role on the ad account.`)

  const forms = new Map<string, QMap>()
  const incoming: Lead[] = []
  let newest = s.adsLastLeadAt || 0
  for (const el of j.elements || []) {
    const responseId = String(el.id || '')
    if (!responseId) continue
    newest = Math.max(newest, Number(el.submittedAt) || 0)
    const questions = el.form ? await formQuestions(token, String(el.form), forms) : {}
    const f: Record<string, string> = {}
    const extras: string[] = []
    for (const a of el.formResponse?.answers || []) {
      const value = String(a.answerDetails?.textQuestionAnswer?.answer ?? a.answerDetails?.multipleChoiceAnswer?.options?.join(', ') ?? '').trim()
      if (!value) continue
      const q = questions[String(a.questionId)]
      const mapped = q?.field ? FIELD_MAP[q.field] : undefined
      if (mapped) f[mapped] = value
      else extras.push(`${q?.label || `Q${a.questionId}`}: ${value}`)
    }
    const name = [f.first, f.last].filter(Boolean).join(' ') || f.email || `LinkedIn lead ${responseId.slice(0, 8)}`
    const lead = newLead({
      name, email: (f.email || '').toLowerCase(), phone: f.phone || '', company: f.company || '', designation: f.designation || '',
      city: f.city || '', country: f.country || '',
      source: 'LinkedIn Lead Gen', priority: 'High', tags: ['linkedin-leadgen'],
      notes: `LinkedIn Lead Gen Form response ${responseId}. ${extras.join(' | ')}`.trim(),
    }, 'linkedin-leadgen')
    lead.id = `LI-${responseId}`
    incoming.push(lead)
  }

  const imported = await mutateLeads((leads) => {
    let n = 0
    for (const lead of incoming) {
      if (leads.some((l) => l.id === lead.id || (lead.email && l.email.toLowerCase() === lead.email))) continue
      lead.activities.unshift({ at: new Date().toISOString(), by: 'linkedin-leadgen', type: 'imported', description: 'Imported from a LinkedIn Lead Gen Form' })
      leads.unshift(lead)
      n++
    }
    return n
  })

  const fresh = await getLinkedInState()
  await saveLinkedInState({ ...fresh, adsLastLeadAt: newest, adsLastSyncAt: new Date().toISOString(), adsLeadsImported: (fresh.adsLeadsImported || 0) + imported })
  return { imported, scanned: (j.elements || []).length }
}

// ---------- Conversions ----------

/** Creates the three conversion rules once on the ad account and remembers their URNs. */
export async function ensureConversionRules(): Promise<Record<string, string>> {
  const s = await getLinkedInState()
  const token = liveAdsToken(s)
  const acct = accountId(s)
  if (!token || !acct) throw new Error('Connect the LinkedIn ads app and set the ad account first.')
  const rules = { ...(s.adsConversions || {}) }
  for (const kind of Object.keys(RULES) as ConversionKind[]) {
    if (rules[kind]) continue
    const res = await fetch('https://api.linkedin.com/rest/conversions', {
      method: 'POST',
      headers: headers(token),
      body: JSON.stringify({
        name: RULES[kind].name,
        account: `urn:li:sponsoredAccount:${acct}`,
        conversionMethod: 'CONVERSIONS_API',
        type: RULES[kind].type,
        attributionType: 'LAST_TOUCH_BY_CAMPAIGN',
        postClickAttributionWindowSize: 30,
        viewThroughAttributionWindowSize: 7,
      }),
    })
    const body = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(`${RULES[kind].name}: ${body.message || res.status}`)
    const id = String(body.id || res.headers.get('x-restli-id') || '')
    if (!id) throw new Error(`${RULES[kind].name}: LinkedIn returned no id`)
    rules[kind] = id.startsWith('urn:') ? id : `urn:lla:llaPartnerConversion:${id}`
  }
  await saveLinkedInState({ ...(await getLinkedInState()), adsConversions: rules })
  return rules
}

/** Sends one CRM outcome to LinkedIn. Never throws: a failure here must not break saving a lead. */
export async function sendLeadConversion(lead: Pick<Lead, 'id' | 'email'>, kind: ConversionKind): Promise<void> {
  try {
    if (!adsAppConfigured() || !lead.email) return
    let s = await getLinkedInState()
    if (!liveAdsToken(s)) return
    if (!s.adsConversions?.[kind]) { await ensureConversionRules(); s = await getLinkedInState() }
    const conversion = s.adsConversions?.[kind]
    if (!conversion) return
    const res = await fetch('https://api.linkedin.com/rest/conversionEvents', {
      method: 'POST',
      headers: headers(liveAdsToken(s)!),
      body: JSON.stringify({
        conversion,
        conversionHappenedAt: Date.now(),
        user: { userIds: [{ idType: 'SHA256_EMAIL', idValue: createHash('sha256').update(lead.email.trim().toLowerCase()).digest('hex') }] },
        eventId: `${lead.id}-${kind}`,
      }),
    })
    if (!res.ok) console.error('[linkedin-conversions]', kind, res.status, await res.text().catch(() => ''))
  } catch (e) {
    console.error('[linkedin-conversions] failed', e)
  }
}
