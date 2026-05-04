import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function verifyAdmin(request: NextRequest): Promise<{ authorized: boolean; email?: string }> {
  const session = await auth()
  if (session?.user?.email) {
    return { authorized: true, email: session.user.email }
  }

  try {
    const body = await request.clone().json()
    if (body.secret && body.secret === process.env.ADMIN_SECRET) {
      return { authorized: true, email: 'secret-auth' }
    }
  } catch {}

  return { authorized: false }
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
