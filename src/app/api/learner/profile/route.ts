import { NextRequest, NextResponse } from 'next/server'
import { verifyLearnerSession, createLearnerToken, learnerCookieOptions } from '@/lib/learner-auth'
import { getLearner, updateLearnerFields } from '@/lib/azure-storage'
import { rateLimit, clientIp } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

/** The signed-in learner's saved profile. */
export async function GET() {
  const learner = await verifyLearnerSession()
  if (!learner) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const record = await getLearner(learner.email)
  return NextResponse.json({
    email: learner.email,
    name: (record?.name as string) || learner.name,
    organization: (record?.organization as string) || '',
    role: (record?.role as string) || '',
    provider: (record?.provider as string) || learner.provider,
    hasPassword: !!record?.passwordHash,
    memberSince: (record?.createdAt as string) || null,
  })
}

/** Update name / organization / role. A name change re-issues the session. */
export async function PUT(request: NextRequest) {
  const learner = await verifyLearnerSession()
  if (!learner) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const ip = clientIp(request.headers)
  if (!rateLimit(`learner-profile:${ip}`, 20, 10 * 60_000)) {
    return NextResponse.json({ error: 'Too many updates. Try again shortly.' }, { status: 429 })
  }

  try {
    const body = await request.json()
    const clean = (v: unknown, max: number) =>
      typeof v === 'string' ? v.trim().slice(0, max) : undefined

    const name = clean(body.name, 80)
    const organization = clean(body.organization, 120)
    const role = clean(body.role, 80)

    const fields: Record<string, unknown> = {}
    if (name) fields.name = name
    if (organization !== undefined) fields.organization = organization
    if (role !== undefined) fields.role = role
    if (Object.keys(fields).length === 0) {
      return NextResponse.json({ error: 'Nothing to update.' }, { status: 400 })
    }

    await updateLearnerFields(learner.email, fields)

    const response = NextResponse.json({ success: true })
    if (name && name !== learner.name) {
      const token = await createLearnerToken({ email: learner.email, name, provider: learner.provider })
      response.cookies.set(learnerCookieOptions(token))
    }
    return response
  } catch {
    return NextResponse.json({ error: 'Could not update profile' }, { status: 500 })
  }
}
