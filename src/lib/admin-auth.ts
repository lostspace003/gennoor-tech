import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function verifyAdmin(_request: NextRequest): Promise<{ authorized: boolean; email?: string }> {
  const session = await auth()
  if (session?.user?.email) {
    return { authorized: true, email: session.user.email }
  }

  return { authorized: false }
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
