import { NextResponse } from 'next/server'
import { clearLearnerCookies } from '@/lib/learner-auth'

export async function POST() {
  const response = NextResponse.json({ success: true })
  clearLearnerCookies(response)
  return response
}
