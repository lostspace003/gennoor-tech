import { NextRequest, NextResponse } from 'next/server'
import { getEnquiries } from '@/lib/azure-storage'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  try {
    const { authorized } = await verifyAdmin(request)
    if (!authorized) return unauthorizedResponse()

    const enquiries = await getEnquiries('ClaudeCoworkRegistration', 365).catch(() => [])

    const registrations = enquiries.map((e: any) => ({
      fullName: e.fullName || e.name || '',
      email: e.email || '',
      country: e.country || '',
      timeZone: e.timeZone || e.timezone || '',
      role: e.role || '',
      company: e.company || '',
      biggestWorkflow: e.biggestWorkflow || '',
      createdAt: e.createdAt || '',
    }))

    const byCountry = Object.entries(
      registrations.reduce((acc: Record<string, number>, r) => {
        if (r.country) acc[r.country] = (acc[r.country] || 0) + 1
        return acc
      }, {})
    ).map(([name, value]) => ({ name, value }))

    const byTimezone = Object.entries(
      registrations.reduce((acc: Record<string, number>, r) => {
        if (r.timeZone) acc[r.timeZone] = (acc[r.timeZone] || 0) + 1
        return acc
      }, {})
    ).map(([name, value]) => ({ name, value }))

    return NextResponse.json({
      total: registrations.length,
      registrations,
      byCountry,
      byTimezone,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
