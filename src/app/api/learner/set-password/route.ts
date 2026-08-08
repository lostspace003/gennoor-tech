import { NextRequest, NextResponse } from 'next/server'
import { verifyLearnerSession } from '@/lib/learner-auth'
import { getLearner, updateLearnerFields } from '@/lib/azure-storage'
import { hashPassword, verifyPassword, passwordProblem } from '@/lib/learner-password'
import { rateLimit, clientIp } from '@/lib/rate-limit'

/**
 * Set or change the signed-in learner's password.
 * If a password already exists, the current one must be supplied.
 */
export async function POST(request: NextRequest) {
  try {
    const learner = await verifyLearnerSession()
    if (!learner) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const ip = clientIp(request.headers)
    if (!rateLimit(`learner-set-pw:${ip}`, 10, 10 * 60_000)) {
      return NextResponse.json({ error: 'Too many attempts. Try again in a few minutes.' }, { status: 429 })
    }

    const { newPassword, currentPassword } = await request.json()
    const problem = passwordProblem(newPassword)
    if (problem) return NextResponse.json({ error: problem }, { status: 400 })

    const record = await getLearner(learner.email)
    const existingHash = record?.passwordHash as string | undefined
    if (existingHash) {
      if (!currentPassword || !(await verifyPassword(currentPassword, existingHash))) {
        return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 403 })
      }
    }

    await updateLearnerFields(learner.email, {
      passwordHash: await hashPassword(newPassword),
      passwordUpdatedAt: new Date().toISOString(),
    })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Could not update password' }, { status: 500 })
  }
}
