import { NextRequest, NextResponse } from 'next/server'
import { getEnquiries } from '@/lib/azure-storage'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  try {
    const { authorized } = await verifyAdmin(request)
    if (!authorized) return unauthorizedResponse()

    const registrations = await getEnquiries('ClaudeCoworkRegistration', 365)

    const sorted = registrations.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    const byCountry: Record<string, number> = {}
    const byTimezone: Record<string, number> = {}
    for (const r of sorted) {
      const country = r.country || 'Unknown'
      const tz = r.timeZone || 'Unknown'
      byCountry[country] = (byCountry[country] || 0) + 1
      byTimezone[tz] = (byTimezone[tz] || 0) + 1
    }

    return NextResponse.json({
      total: sorted.length,
      registrations: sorted.map(r => ({
        fullName: r.fullName,
        email: r.email,
        country: r.country,
        timeZone: r.timeZone,
        role: r.role || '',
        company: r.company || '',
        biggestWorkflow: r.biggestWorkflow || '',
        createdAt: r.createdAt,
      })),
      byCountry: Object.entries(byCountry).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value),
      byTimezone: Object.entries(byTimezone).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value),
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch registrations' }, { status: 500 })
  }
}
