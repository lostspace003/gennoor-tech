import { NextResponse } from 'next/server'
import { LEARNER_COOKIE_NAME } from '@/lib/learner-auth'

export async function POST() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete(LEARNER_COOKIE_NAME)
  return response
}
