import { NextResponse } from 'next/server'
import { verifyLearnerSession } from '@/lib/learner-auth'

export async function GET() {
  const learner = await verifyLearnerSession()
  if (!learner) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
  return NextResponse.json({
    authenticated: true,
    email: learner.email,
    name: learner.name,
    provider: learner.provider,
  })
}
