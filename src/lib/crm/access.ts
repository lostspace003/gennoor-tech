import { auth } from '@/lib/auth'
import { CRM_USERS, CRM_ADMIN, CRM_MANAGERS } from './users'

// The list of people lives in ./users.ts (one place for the whole site).
export { CRM_USERS, CRM_ADMIN, CRM_MANAGERS }

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

// A lead that someone holds is worked only by that person (managers exempt).
// Unassigned leads can be worked by anyone.
export function canWorkLead(lead: { owner?: string }, user: CrmSessionUser): boolean {
  const owner = (lead.owner || '').toLowerCase()
  return user.isManager || !owner || owner === user.email
}
