// Who signs the outreach. Mail always LEAVES as sales@gennoor.com (delivery
// rule), but the person working the lead is the one the lead should reply to
// and call — so every email carries their name, direct number and their own
// gennoor.com address. Keep this in sync with CRM_USERS in ./access.ts.
//
// Client-safe: no server-only imports (the CRM UI reads it too).

/** Office line — carried as the second number on every sales signature. */
export const GENNOOR_OFFICE_PHONE = '+91-9326353341'

export interface TeamMember {
  email: string
  /** Name as it should appear in a signature. */
  name: string
  /** Numbers in signature order: own direct line first, office line second. */
  phones: string[]
}

// The office signature. Jalal and admin both sign with this one — no personal
// direct line, office number only.
const ADMIN_SIGNATURE: Omit<TeamMember, 'email'> = {
  name: 'Team Gennoor Tech',
  phones: [GENNOOR_OFFICE_PHONE],
}

// Sales team: own number first, office line second.
const SALES: Array<{ email: string; name: string; phone: string }> = [
  { email: 'deepanshu@gennoor.com', name: 'Deepanshu', phone: '+91-95715 72343' },
  { email: 'aditya@gennoor.com', name: 'Aditya', phone: '+91-93890 06543' },
  { email: 'yusufchaudhary@gennoor.com', name: 'Yusuf Chaudhary', phone: '+91-9930804666' },
  { email: 'zaid@gennoor.com', name: 'Zaid', phone: '+91-7208353380' },
]

const DIRECTORY: TeamMember[] = [
  ...SALES.map((m) => ({ email: m.email, name: m.name, phones: [m.phone, GENNOOR_OFFICE_PHONE] })),
  // Jalal and the shared mailboxes all sign as the office
  { email: 'jalalkhan@gennoor.com', ...ADMIN_SIGNATURE },
  { email: 'admin@gennoor.com', ...ADMIN_SIGNATURE },
  { email: 'sales@gennoor.com', ...ADMIN_SIGNATURE },
]

// Addresses that sign as the office rather than as themselves — their
// signature carries admin@gennoor.com, not their own mailbox.
const OFFICE_SIGNERS = ['jalalkhan@gennoor.com', 'admin@gennoor.com', 'sales@gennoor.com']
const ADMIN_EMAIL = 'admin@gennoor.com'

/** Title-cases the mailbox part so unknown addresses still sign sensibly. */
function nameFromEmail(email: string): string {
  const local = (email.split('@')[0] || 'Gennoor Tech').replace(/[._-]+/g, ' ')
  return local.replace(/\b[a-z]/g, (c) => c.toUpperCase())
}

/**
 * The signing identity for a CRM user. Never throws — an unknown address signs
 * with its own name on the office line. Office signers get admin@ as the
 * contact address so replies land in the shared mailbox.
 */
export function teamMember(email: string | undefined): TeamMember {
  const key = (email || '').trim().toLowerCase()
  const found = DIRECTORY.find((m) => m.email === key)
  if (found) {
    return OFFICE_SIGNERS.includes(key) ? { ...found, email: ADMIN_EMAIL } : found
  }
  return {
    email: key || ADMIN_EMAIL,
    name: key ? nameFromEmail(key) : 'Team Gennoor Tech',
    phones: [GENNOOR_OFFICE_PHONE],
  }
}

/** tel: target — digits and a leading + only. */
export function telHref(phone: string): string {
  const digits = phone.replace(/[^\d]/g, '')
  return digits ? `tel:+${digits}` : ''
}

/**
 * Plain-text sign-off the AI must end every draft with. Kept identical between
 * the AI prompt and the template fallback so the two never disagree.
 */
export function signOffText(member: TeamMember): string {
  return [
    'Best regards,',
    member.name,
    'Gennoor Tech',
    [member.phones.join(' / '), member.email].filter(Boolean).join(' | '),
    'www.gennoor.com',
  ].join('\n')
}
