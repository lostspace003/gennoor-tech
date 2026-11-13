import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { isAdminUser } from '@/lib/crm/users'

/**
 * The check at the top of every address of the admin centre (/api/admin/..., except the CRM's own,
 * which use requireCrmUser). Signed in is not enough: the person must be on ADMIN_USERS
 * (src/lib/crm/users.ts). Someone who has the CRM only is refused here.
 */
export async function verifyAdmin(_request: NextRequest): Promise<{ authorized: boolean; email?: string }> {
  const session = await auth()
  const email = session?.user?.email?.toLowerCase()
  if (email && isAdminUser(email)) {
    return { authorized: true, email }
  }

  return { authorized: false }
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
