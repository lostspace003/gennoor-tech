import { auth } from '@/lib/auth'

// Single source of truth for CRM access. middleware.ts and auth.ts keep their
// own copies because they run in the edge runtime; update all three together.
export const CRM_USERS = [
  'admin@gennoor.com',
  'jalalkhan@gennoor.com',
  'yusufchaudhary@gennoor.com',
  'contact@gennoor.com',
  'contacts@gennoor.com',
]

export const CRM_ADMIN = 'admin@gennoor.com'

// Managers can upload/delete leads and see the whole team's activity.
// Everyone else can work leads (research, email, stages) but not manage data.
export const CRM_MANAGERS = [
  'admin@gennoor.com',
  'jalalkhan@gennoor.com',
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
