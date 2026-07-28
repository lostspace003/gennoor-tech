import { auth } from '@/lib/auth'

// Single source of truth for CRM access. middleware.ts and auth.ts keep their
// own copies because they run in the edge runtime; update all three together.
export const CRM_USERS = [
  'admin@gennoor.com',
  'jalalkhan@gennoor.com',
  'yusufchaudhary@gennoor.com',
  'aditya@gennoor.com',
  'deepanshu@gennoor.com',
  'zaid@gennoor.com',
  'sales@gennoor.com',
]

export const CRM_ADMIN = 'admin@gennoor.com'

// Managers can upload/delete leads and see the whole team's activity.
// Everyone else can work leads (research, email, stages) but not manage data.
export const CRM_MANAGERS = [
  'admin@gennoor.com',
  'yusufchaudhary@gennoor.com',
]

export interface CrmSessionUser {
  email: string
  isAdmin: boolean
  isManager: boolean
}

// Returns the authenticated CRM user, or null when unauthenticated/unauthorized.
export async function requireCrmUser(): Promise<CrmSessionUser | null> {
  const session = await auth()
  const email = session?.user?.email?.toLowerCase() || ''
  if (!CRM_USERS.includes(email)) return null
  return { email, isAdmin: email === CRM_ADMIN, isManager: CRM_MANAGERS.includes(email) }
}

// Read scope: managers see the whole book; everyone else sees the pool
// (unclaimed leads) plus the leads they own. Enforced server-side in every
// endpoint that returns lead data — the UI tabs only slice within this.
export function visibleLeads<T extends { owner?: string }>(leads: T[], user: CrmSessionUser): T[] {
  if (user.isManager) return leads
  return leads.filter((l) => !l.owner || l.owner.toLowerCase() === user.email)
}

// Pool rule: a claimed lead is worked only by its owner (managers exempt).
// Unclaimed leads can be worked by anyone — but working actions in the UI
// nudge users to claim first.
export function canWorkLead(lead: { owner?: string }, user: CrmSessionUser): boolean {
  const owner = (lead.owner || '').toLowerCase()
  return user.isManager || !owner || owner === user.email
}
