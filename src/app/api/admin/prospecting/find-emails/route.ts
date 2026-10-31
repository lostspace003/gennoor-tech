import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { findEmails } from '@/lib/prospecting'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

/** Finds work emails for up to 50 people per request. Uses credits on the active prospecting key. */
export async function POST(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const b = await req.json().catch(() => ({}))
  const people = (Array.isArray(b.people) ? b.people : []).slice(0, 50).map((p: any) => ({ name: String(p?.name || '').slice(0, 120), company: p?.company ? String(p.company).slice(0, 120) : undefined, linkedin: p?.linkedin ? String(p.linkedin).slice(0, 300) : undefined })).filter((p: any) => p.name || p.linkedin)
  if (!people.length) return NextResponse.json({ error: 'Add at least one person.' }, { status: 400 })
  try { return NextResponse.json(await findEmails(people)) }
  catch (e: any) { return NextResponse.json({ error: String(e?.message || e).slice(0, 200) }, { status: 502 }) }
}
