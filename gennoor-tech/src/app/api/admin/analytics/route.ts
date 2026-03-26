import { NextRequest, NextResponse } from 'next/server'
import { getPageViews, getAllComments, getEnquiries } from '@/lib/azure-storage'

export async function POST(request: NextRequest) {
  try {
    const { secret, days = 7 } = await request.json()

    if (secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [pageViews, comments, enquiries] = await Promise.all([
      getPageViews(days).catch(() => []),
      getAllComments().catch(() => []),
      getEnquiries(undefined, days).catch(() => []),
    ])

    // Aggregate page views by date
    const viewsByDate: Record<string, number> = {}
    const viewsByPage: Record<string, number> = {}
    const viewsByCountry: Record<string, number> = {}
    const viewsByCity: Record<string, number> = {}
    const referrers: Record<string, number> = {}

    for (const v of pageViews) {
      // By date
      viewsByDate[v.date] = (viewsByDate[v.date] || 0) + 1

      // By page
      const page = v.page || v.url || 'unknown'
      viewsByPage[page] = (viewsByPage[page] || 0) + 1

      // By country
      if (v.country) {
        viewsByCountry[v.country] = (viewsByCountry[v.country] || 0) + 1
      }

      // By city
      if (v.city) {
        viewsByCity[v.city] = (viewsByCity[v.city] || 0) + 1
      }

      // Referrers
      if (v.referrer) {
        try {
          const host = new URL(v.referrer).hostname || v.referrer
          referrers[host] = (referrers[host] || 0) + 1
        } catch {
          referrers[v.referrer] = (referrers[v.referrer] || 0) + 1
        }
      }
    }

    // Sort pages by views (top 20)
    const topPages = Object.entries(viewsByPage)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)

    const topCountries = Object.entries(viewsByCountry)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)

    const topCities = Object.entries(viewsByCity)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)

    const topReferrers = Object.entries(referrers)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)

    // Enquiry breakdown
    const enquiryByType: Record<string, number> = {}
    for (const e of enquiries) {
      const type = e.type || e.partitionKey || 'other'
      enquiryByType[type] = (enquiryByType[type] || 0) + 1
    }

    return NextResponse.json({
      totalViews: pageViews.length,
      totalComments: comments.length,
      totalEnquiries: enquiries.length,
      activeComments: comments.filter(c => c.status !== 'hidden').length,
      viewsByDate,
      topPages,
      topCountries,
      topCities,
      topReferrers,
      enquiryByType,
      recentEnquiries: enquiries
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 20)
        .map(e => ({
          type: e.type,
          name: e.name || e.authorName || '',
          email: e.email || e.authorEmail || '',
          createdAt: e.createdAt,
          course: e.course || e.program || '',
        })),
      recentComments: comments
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 20),
    })
  } catch (error) {
    console.error('Admin analytics error:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
