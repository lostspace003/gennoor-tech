// The partnership campaigns of the CRM, under one tab (Partnerships). Each is the same engine (src/lib/crm/universities-*):
// a list of organisations and their people, the first email, the evaluation form, the call, the partnership.
// This file holds no seed data, so the browser can import it; the seeds are loaded on the server (universities-store.ts).

export type CampaignKey = 'universities' | 'india-universities' | 'mumbai-colleges' | 'pune-colleges' | 'enterprise' | 'mid-size-corporates' | 'government-skilling'
/** 'academic' speaks of faculty and students; 'business' of teams and staff. */
export type Audience = 'academic' | 'business'

export interface Campaign {
  key: CampaignKey
  /** The label of its sub-tab. */
  label: string
  /** The three letters at the start of every id of this campaign (GEN-001). They tell the campaigns apart. */
  prefix: string
  audience: Audience
  /** What one entry is called, in the lower case. */
  one: string
  many: string
  /** Where the first read of the store puts the data from. '' for the first campaign, whose seed is older. */
  blurb: string
}

export const CAMPAIGNS: Campaign[] = [
  { key: 'universities', label: 'Global universities', prefix: 'GEN', audience: 'academic', one: 'university', many: 'universities', blurb: '27 universities in 21 countries, from the first email to the partnership.' },
  { key: 'india-universities', label: 'India universities', prefix: 'IND', audience: 'academic', one: 'university', many: 'universities', blurb: 'Universities across north, west, south and east India.' },
  { key: 'mumbai-colleges', label: 'Mumbai colleges', prefix: 'MUM', audience: 'academic', one: 'college', many: 'colleges', blurb: 'Colleges in Mumbai and the Mumbai Metropolitan Region.' },
  { key: 'pune-colleges', label: 'Pune colleges', prefix: 'PUN', audience: 'academic', one: 'college', many: 'colleges', blurb: 'Engineering and technology colleges in Pune and PCMC.' },
  { key: 'enterprise', label: 'Enterprise', prefix: 'ENT', audience: 'business', one: 'company', many: 'companies', blurb: 'Large enterprises and the big players: IT services, consulting and finance technology.' },
  { key: 'mid-size-corporates', label: 'Mid-size corporates', prefix: 'MID', audience: 'business', one: 'company', many: 'companies', blurb: 'Fast-growing Indian Microsoft, data, AI and digital companies.' },
  { key: 'government-skilling', label: 'Government skilling', prefix: 'GOV', audience: 'business', one: 'programme', many: 'programmes', blurb: 'State IT academies, skill missions and ministry programmes.' },
]

export const CAMPAIGN_KEYS: string[] = CAMPAIGNS.map((c) => c.key)
/** An id as every campaign writes it: three capital letters, a dash, three digits. */
export const ENTRY_ID = /^[A-Z]{3}-\d{3}$/

/** A campaign by its key, or null. The only way a key that arrived from outside is let in. */
export function campaignByKey(v: unknown): Campaign | null {
  return typeof v === 'string' ? CAMPAIGNS.find((c) => c.key === v) || null : null
}
/** The campaign an id belongs to, from its three letters. */
export function campaignOfId(id: unknown): Campaign | null {
  return typeof id === 'string' && ENTRY_ID.test(id) ? CAMPAIGNS.find((c) => c.prefix === id.slice(0, 3)) || null : null
}
/** The page of one entry in the CRM. */
export const entryPath = (id: string): string => `/crm/partnerships/${campaignOfId(id)?.key || 'universities'}/${id}`
