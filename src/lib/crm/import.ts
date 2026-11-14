import { PROFILE_LABELS, readProfile, type Lead } from './types'

// The lead sheet: nine columns, only Name required. Used by the template
// download, the import and the export, so the three can never drift apart.
// Safe to import in the browser.
// Type is "Technical professional" or "Business professional" (readProfile in ./types.ts reads shorter spellings too).

export const LEAD_COLUMNS = ['Name', 'Email', 'Phone', 'Organization', 'Designation', 'Type', 'Country', 'LinkedIn', 'Notes'] as const
export type LeadColumn = (typeof LEAD_COLUMNS)[number]

/** Other headings people commonly use for each column. Matched without regard to case or spacing. */
const ALIASES: Record<LeadColumn, string[]> = {
  Name: ['name', 'full name', 'contact', 'contact name', 'person', 'lead name'],
  Email: ['email', 'email address', 'e-mail', 'mail', 'work email'],
  Phone: ['phone', 'phone number', 'mobile', 'contact number', 'whatsapp', 'tel'],
  Organization: ['organization', 'organisation', 'company', 'company name', 'company / org', 'org', 'employer', 'account'],
  Designation: ['designation', 'title', 'job title', 'role', 'position'],
  // Not "profile": that heading means the LinkedIn profile
  Type: ['type', 'lead type', 'professional type', 'type of professional', 'audience', 'persona', 'technical or business', 'technical business'],
  Country: ['country', 'location', 'region'],
  LinkedIn: ['linkedin', 'linkedin url', 'linkedin profile', 'profile'],
  Notes: ['notes', 'note', 'comments', 'remarks', 'requirement', 'interest'],
}

const FIELD: Record<LeadColumn, keyof Lead> = {
  Name: 'name', Email: 'email', Phone: 'phone', Organization: 'company',
  Designation: 'designation', Type: 'profile', Country: 'country', LinkedIn: 'linkedin', Notes: 'notes',
}

const norm = (s: unknown) => String(s ?? '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()

/** Which sheet heading feeds which of our columns. Unknown headings are ignored. */
export function mapHeaders(headers: string[]): Partial<Record<LeadColumn, string>> {
  const out: Partial<Record<LeadColumn, string>> = {}
  for (const col of LEAD_COLUMNS) {
    const names = ALIASES[col].map(norm)
    const hit = headers.find((h) => names.includes(norm(h)))
    if (hit) out[col] = hit
  }
  // "First name" + "Last name" sheets: handled in rowToLead
  return out
}

/** One spreadsheet row -> a lead, or null when the row has no name. */
export function rowToLead(row: Record<string, unknown>, map: Partial<Record<LeadColumn, string>>): Partial<Lead> | null {
  const cell = (heading?: string) => {
    if (!heading) return ''
    const v = String(row[heading] ?? '').trim()
    return /^(na|n\/a|-|none|null)$/i.test(v) ? '' : v
  }
  let name = cell(map.Name)
  if (!name) {
    // sheets that split the name in two
    const keys = Object.keys(row)
    const firstKey = keys.find((k) => ['first name', 'firstname', 'first'].includes(norm(k)))
    const lastKey = keys.find((k) => ['last name', 'lastname', 'last', 'surname'].includes(norm(k)))
    name = [cell(firstKey), cell(lastKey)].filter(Boolean).join(' ')
  }
  if (!name) return null
  const lead: Partial<Lead> = { name }
  for (const col of LEAD_COLUMNS) {
    if (col === 'Name') continue
    let v = cell(map[col])
    // A type that is neither of the two is left blank (the import says so), never guessed
    if (col === 'Type') v = readProfile(v)
    if (v) (lead as any)[FIELD[col]] = col === 'Email' ? v.toLowerCase() : v
  }
  return lead
}

export const looksLikeEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)

/** A lead as one row of the sheet (for export). */
export function leadToRow(l: Lead): Record<LeadColumn, string> {
  return {
    Name: l.name, Email: l.email, Phone: l.phone, Organization: l.company,
    Designation: l.designation, Type: l.profile ? PROFILE_LABELS[l.profile] : '', Country: l.country, LinkedIn: l.linkedin, Notes: l.notes,
  }
}
