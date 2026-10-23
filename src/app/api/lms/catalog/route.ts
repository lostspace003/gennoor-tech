import { NextResponse } from 'next/server'
import { listLmsCourses, toCard } from '@/lib/lms'

// Public catalog summary (titles + signed thumbnail links) for the Academy pages.
export async function GET() {
  const courses = (await listLmsCourses()).map(toCard)
  return NextResponse.json({ courses }, { headers: { 'Cache-Control': 'private, max-age=300' } })
}
