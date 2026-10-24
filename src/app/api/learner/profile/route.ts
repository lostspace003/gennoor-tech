import { NextRequest, NextResponse } from 'next/server'
import { verifyLearnerSession, createLearnerToken, learnerCookieOptions } from '@/lib/learner-auth'
import { getLearner, updateLearnerFields, claimUsername } from '@/lib/azure-storage'
import { normalizeUsername, usernameProblem, suggestUsername } from '@/lib/learner-username'
import { rateLimit, clientIp } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

/** The signed-in learner's saved profile. */
export async function GET() {
  const learner = await verifyLearnerSession()
  if (!learner) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const record = await getLearner(learner.email)
  const name = (record?.name as string) || learner.name
  const organization = (record?.organization as string) || ''
  const role = (record?.role as string) || ''
  const username = (record?.username as string) || ''
  const hasPassword = !!record?.passwordHash

  return NextResponse.json({
    email: learner.email,
    name,
    organization,
    role,
    username,
    suggestedUsername: username || suggestUsername(learner.email),
    provider: (record?.provider as string) || learner.provider,
    hasPassword,
    // Drives the compulsory setup step. Anything missing sends the learner
    // back through it before a course opens.
    profileComplete: !!(name && organization && role && username && hasPassword),
    memberSince: (record?.createdAt as string) || null,
  })
}

/** Update name / username / organization / role. A name change re-issues the session. */
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
    const rawUsername = body.username === undefined ? undefined : normalizeUsername(body.username)

    const fields: Record<string, unknown> = {}
    if (name) fields.name = name
    if (organization !== undefined) fields.organization = organization
    if (role !== undefined) fields.role = role

    // Usernames are unique, so they are claimed before anything else is
    // written — a rejected claim must not leave the rest of the edit applied.
    if (rawUsername !== undefined) {
      const record = await getLearner(learner.email)
      if (rawUsername !== ((record?.username as string) || '')) {
        const problem = usernameProblem(rawUsername)
        if (problem) return NextResponse.json({ error: problem }, { status: 400 })
        const claimed = await claimUsername(rawUsername, learner.email)
        if (!claimed) {
          return NextResponse.json({ error: 'That username is taken. Please pick another.' }, { status: 409 })
        }
        fields.username = rawUsername
      }
    }

    if (Object.keys(fields).length === 0) {
      return NextResponse.json({ error: 'Nothing to update.' }, { status: 400 })
    }

    await updateLearnerFields(learner.email, fields)

    const response = NextResponse.json({ success: true })
    if (name && name !== learner.name) {
      const token = await createLearnerToken({ email: learner.email, name, provider: learner.provider, tid: learner.tid })
      response.cookies.set(learnerCookieOptions(token, request))
    }
    return response
  } catch {
    return NextResponse.json({ error: 'Could not update profile' }, { status: 500 })
  }
}
