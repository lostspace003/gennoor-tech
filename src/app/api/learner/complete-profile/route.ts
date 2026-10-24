import { NextRequest, NextResponse } from 'next/server'
import { verifyLearnerSession, createLearnerToken, learnerCookieOptions } from '@/lib/learner-auth'
import { getLearner, updateLearnerFields, claimUsername } from '@/lib/azure-storage'
import { hashPassword, passwordProblem } from '@/lib/learner-password'
import { normalizeUsername, usernameProblem } from '@/lib/learner-username'
import { rateLimit, clientIp } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

/**
 * The compulsory one-shot step a learner completes straight after their first
 * OTP sign-in, before any course opens: name, username, organization, role and
 * a password.
 *
 * It is deliberately atomic — everything validates before anything is written,
 * so a learner can never end up half-registered (a username claimed but no
 * password, say) and get bounced back into the same form forever.
 */
export async function POST(request: NextRequest) {
  const learner = await verifyLearnerSession()
  if (!learner) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const ip = clientIp(request.headers)
  if (!rateLimit(`learner-complete-profile:${ip}`, 15, 10 * 60_000)) {
    return NextResponse.json({ error: 'Too many attempts. Try again in a few minutes.' }, { status: 429 })
  }

  try {
    const body = await request.json()
    const trim = (v: unknown, max: number) => String(v ?? '').trim().slice(0, max)

    const name = trim(body.name, 80)
    const organization = trim(body.organization, 120)
    const role = trim(body.role, 80)
    const username = normalizeUsername(body.username)
    const password = typeof body.password === 'string' ? body.password : ''

    if (!name) return NextResponse.json({ error: 'Please enter your full name.' }, { status: 400 })
    if (!organization) return NextResponse.json({ error: 'Please enter your organization.' }, { status: 400 })
    if (!role) return NextResponse.json({ error: 'Please enter your role.' }, { status: 400 })

    const badUsername = usernameProblem(username)
    if (badUsername) return NextResponse.json({ error: badUsername }, { status: 400 })

    const record = await getLearner(learner.email)
    const alreadyHasPassword = !!record?.passwordHash

    // A learner who already set a password isn't asked for it again — this
    // route doubles as the "finish your profile" prompt for older accounts.
    let passwordHash: string | undefined
    if (password || !alreadyHasPassword) {
      const badPassword = passwordProblem(password)
      if (badPassword) return NextResponse.json({ error: badPassword }, { status: 400 })
      passwordHash = await hashPassword(password)
    }

    const claimed = await claimUsername(username, learner.email)
    if (!claimed) {
      return NextResponse.json({ error: 'That username is taken. Please pick another.' }, { status: 409 })
    }

    await updateLearnerFields(learner.email, {
      name,
      organization,
      role,
      username,
      profileCompletedAt: new Date().toISOString(),
      ...(passwordHash ? { passwordHash, passwordUpdatedAt: new Date().toISOString() } : {}),
    })

    // The display name lives in the session token, so re-issue it.
    const response = NextResponse.json({ success: true, name, username })
    const token = await createLearnerToken({
      email: learner.email,
      name,
      provider: learner.provider,
      tid: learner.tid,
    })
    response.cookies.set(learnerCookieOptions(token))
    return response
  } catch {
    return NextResponse.json({ error: 'Could not save your profile. Please try again.' }, { status: 500 })
  }
}
