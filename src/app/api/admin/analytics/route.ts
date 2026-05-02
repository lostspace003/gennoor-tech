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

    // --- Session-based metrics ---
    const SESSION_GAP_MS = 30 * 60 * 1000 // 30 minutes

    // Group page views by IP+date
    const ipDateGroups: Record<string, Array<{ page: string; ts: number }>> = {}
    const ipDates: Record<string, Set<string>> = {} // IP -> set of dates (for new vs returning)
    const hourlyBuckets: number[] = new Array(24).fill(0)

    for (const v of pageViews) {
      const page = v.page || v.url || 'unknown'
      const ts = v.timestamp ? new Date(v.timestamp).getTime() : 0
      const ip = v.ip || 'unknown'
      const date = v.date || 'unknown'

      // Group by IP+date for session building
      const key = `${ip}|${date}`
      if (!ipDateGroups[key]) ipDateGroups[key] = []
      ipDateGroups[key].push({ page, ts })

      // Track IP -> dates for new vs returning
      if (!ipDates[ip]) ipDates[ip] = new Set()
      ipDates[ip].add(date)

      // Hourly traffic
      if (v.timestamp) {
        const hour = new Date(v.timestamp).getHours()
        hourlyBuckets[hour]++
      }
    }

    // Build sessions from IP+date groups
    type Session = Array<{ page: string; ts: number }>
    const allSessions: Session[] = []
    const sessionsByDate: Record<string, number> = {}

    // Sets for conversion funnel unique IPs
    const allVisitorIPs = new Set<string>()
    const servicesIPs = new Set<string>()
    const calendarIPs = new Set<string>()

    for (const [key, views] of Object.entries(ipDateGroups)) {
      const ip = key.split('|')[0]
      const date = key.split('|')[1]

      allVisitorIPs.add(ip)

      // Check funnel pages for this IP
      for (const v of views) {
        if (v.page.startsWith('/services')) servicesIPs.add(ip)
        if (v.page === '/resources/calendar') calendarIPs.add(ip)
      }

      // Sort by timestamp within group
      views.sort((a, b) => a.ts - b.ts)

      // Split into sessions by 30-min gap
      let sessionStart = 0
      for (let i = 1; i < views.length; i++) {
        if (views[i].ts - views[i - 1].ts > SESSION_GAP_MS) {
          allSessions.push(views.slice(sessionStart, i))
          sessionsByDate[date] = (sessionsByDate[date] || 0) + 1
          sessionStart = i
        }
      }
      // Push last session
      allSessions.push(views.slice(sessionStart))
      sessionsByDate[date] = (sessionsByDate[date] || 0) + 1
    }

    const totalSessions = allSessions.length

    // Avg pages per session
    const avgPagesPerSession = totalSessions > 0
      ? Math.round((pageViews.length / totalSessions) * 10) / 10
      : 0

    // Avg session duration & bounce rate
    let totalDuration = 0
    let sessionsWithDuration = 0
    let bounceSessions = 0

    // Landing pages, exit pages, page time-on-page data
    const landingPageCounts: Record<string, number> = {}
    const exitPageCounts: Record<string, number> = {}
    const pageTimeData: Record<string, { totalTime: number; count: number }> = {}

    for (const session of allSessions) {
      if (session.length === 1) {
        bounceSessions++
      }

      // Landing page (first page of session)
      const landingPage = session[0].page
      landingPageCounts[landingPage] = (landingPageCounts[landingPage] || 0) + 1

      // Exit page (last page of session)
      const exitPage = session[session.length - 1].page
      exitPageCounts[exitPage] = (exitPageCounts[exitPage] || 0) + 1

      // Session duration
      if (session.length > 1) {
        const duration = (session[session.length - 1].ts - session[0].ts) / 1000
        if (duration > 0) {
          totalDuration += duration
          sessionsWithDuration++
        }
      }

      // Time on page: time between consecutive views in same session
      for (let i = 0; i < session.length - 1; i++) {
        const timeOnPage = (session[i + 1].ts - session[i].ts) / 1000
        if (timeOnPage > 0 && timeOnPage < 1800) { // Cap at 30 min to avoid outliers
          const pg = session[i].page
          if (!pageTimeData[pg]) pageTimeData[pg] = { totalTime: 0, count: 0 }
          pageTimeData[pg].totalTime += timeOnPage
          pageTimeData[pg].count++
        }
      }
    }

    const avgSessionDuration = sessionsWithDuration > 0
      ? Math.round(totalDuration / sessionsWithDuration)
      : 0

    const bounceRate = totalSessions > 0
      ? Math.round((bounceSessions / totalSessions) * 1000) / 10
      : 0

    // Top landing pages (top 10)
    const topLandingPages = Object.entries(landingPageCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)

    // Top exit pages (top 10)
    const topExitPages = Object.entries(exitPageCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)

    // Hourly traffic distribution
    const hourlyTraffic = hourlyBuckets.map((views, hour) => ({ hour, views }))

    // Page performance (top 20 by views, with avg time on page)
    const pagePerformance = Object.entries(viewsByPage)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([page, views]) => ({
        page,
        views,
        avgTime: pageTimeData[page] && pageTimeData[page].count > 0
          ? Math.round(pageTimeData[page].totalTime / pageTimeData[page].count)
          : 0,
      }))

    // Conversion funnel — use unique emails for enquiries to match IP-based visitor counts
    const uniqueEnquiryEmails = new Set(enquiries.map((e: any) => e.email).filter(Boolean))
    const enquiryCount = Math.min(uniqueEnquiryEmails.size, allVisitorIPs.size)
    const conversionFunnel = [
      { step: 'All Visitors', users: allVisitorIPs.size },
      { step: 'Viewed Services', users: servicesIPs.size },
      { step: 'Viewed Calendar', users: calendarIPs.size },
      { step: 'Submitted Enquiry', users: enquiryCount },
    ]

    // New vs returning visitors
    let newVisitors = 0
    let returningVisitors = 0
    for (const dates of Object.values(ipDates)) {
      if (dates.size > 1) returningVisitors++
      else newVisitors++
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
      // Session-based metrics
      totalSessions,
      avgPagesPerSession,
      avgSessionDuration,
      bounceRate,
      topLandingPages,
      topExitPages,
      hourlyTraffic,
      pagePerformance,
      conversionFunnel,
      sessionsByDate,
      newVisitors,
      returningVisitors,
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
