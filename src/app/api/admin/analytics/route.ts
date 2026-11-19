import { NextRequest, NextResponse } from 'next/server'
import { getPageViews, getAllComments, getEnquiries, getEvents, getVisitorFirstSeen } from '@/lib/azure-storage'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  try {
    const { authorized } = await verifyAdmin(request)
    if (!authorized) return unauthorizedResponse()

    const { days = 7 } = await request.json()

    const [rawPageViews, comments, enquiriesRaw, events, firstSeen] = await Promise.all([
      getPageViews(days).catch((err) => { console.error('Failed to fetch page views:', err); return [] }),
      getAllComments().catch((err) => { console.error('Failed to fetch comments:', err); return [] }),
      getEnquiries(undefined, days + 1).catch((err) => { console.error('Failed to fetch enquiries:', err); return [] }),
      getEvents(days).catch((err) => { console.error('Failed to fetch events:', err); return [] }),
      getVisitorFirstSeen().catch((err) => { console.error('Failed to fetch visitors:', err); return new Map<string, string>() }),
    ])

    // WHERE is_internal IS FALSE: developer / admin traffic never reaches a public KPI or chart
    const pageViews = rawPageViews.filter((v) => !v.isInternal)

    // Range start as a YYYY-MM-DD partition (UTC), same cut getPageViews uses
    const rangeStart = new Date(Date.now() - days * 86_400_000).toISOString().slice(0, 10)
    // The same cut for enquiries: with "Today" (days = 0) asking for the last 0 days returned none at all
    const enquiries = enquiriesRaw.filter((e) => String(e.createdAt || '').slice(0, 10) >= rangeStart)
    // Rows written before visitor ids existed are keyed by IP so history still counts
    const visitorOf = (v: { visitorId?: string; ip?: string }) => v.visitorId || `ip:${v.ip || 'unknown'}`

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

    // Group page views per visitor across the whole range (a 30-minute gap starts a new session,
    // mirroring the client's rolling session id). Grouping per visitor, not per IP+day, stops one
    // long-lived tab or a shared office IP from becoming a single 3000s "session".
    const byVisitor: Record<string, Array<{ page: string; ts: number; date: string }>> = {}
    const hourlyBuckets: number[] = new Array(24).fill(0)

    for (const v of pageViews) {
      const page = v.page || v.url || 'unknown'
      const ts = v.timestamp ? new Date(v.timestamp).getTime() : 0
      const key = visitorOf(v)
      if (!byVisitor[key]) byVisitor[key] = []
      byVisitor[key].push({ page, ts, date: v.date || 'unknown' })

      // Hourly traffic
      if (v.timestamp) {
        const hour = new Date(v.timestamp).getUTCHours() // chart is labelled UTC
        hourlyBuckets[hour]++
      }
    }

    // Build sessions
    type Session = Array<{ page: string; ts: number }>
    const allSessions: Session[] = []
    const sessionsByDate: Record<string, number> = {}

    // Distinct visitor_ids per funnel step, all over the selected range
    const allVisitors = new Set<string>()
    const servicesVisitors = new Set<string>()
    const calendarVisitors = new Set<string>()
    let newVisitors = 0
    let returningVisitors = 0

    for (const [key, views] of Object.entries(byVisitor)) {
      allVisitors.add(key)

      for (const v of views) {
        if (v.page.startsWith('/services')) servicesVisitors.add(key)
        if (v.page === '/resources/calendar') calendarVisitors.add(key)
      }

      // New = first ever visit falls inside the range; Returning = active in range, first visit before it.
      // Only visitors with a profile can be classified; legacy IP-keyed rows have no first-seen date.
      const first = firstSeen.get(key)
      if (first) {
        if (first.slice(0, 10) >= rangeStart) newVisitors++
        else returningVisitors++
      }

      views.sort((a, b) => a.ts - b.ts)

      let sessionStart = 0
      for (let i = 1; i < views.length; i++) {
        if (views[i].ts - views[i - 1].ts > SESSION_GAP_MS) {
          allSessions.push(views.slice(sessionStart, i))
          sessionsByDate[views[sessionStart].date] = (sessionsByDate[views[sessionStart].date] || 0) + 1
          sessionStart = i
        }
      }
      allSessions.push(views.slice(sessionStart))
      sessionsByDate[views[sessionStart].date] = (sessionsByDate[views[sessionStart].date] || 0) + 1
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

    // Conversion funnel: distinct visitors over the range. An enquiry counts by its stitched visitor_id,
    // or by email for older enquiries that predate stitching.
    const enquirers = new Set<string>(
      enquiries
        .map((e: any) => e.visitorId || (e.email ? `email:${String(e.email).toLowerCase()}` : ''))
        .filter(Boolean),
    )
    const conversionFunnel = [
      { step: 'All Visitors', users: allVisitors.size },
      { step: 'Viewed Services', users: servicesVisitors.size },
      { step: 'Viewed Calendar', users: calendarVisitors.size },
      { step: 'Submitted Enquiry', users: Math.min(enquirers.size, allVisitors.size) },
    ]

    // Behaviour events (internal ones are never stored)
    const ctaClicks: Record<string, number> = {}
    const scrollReach: Record<string, Set<string>> = { '25': new Set(), '50': new Set(), '75': new Set(), '100': new Set() }
    const abandonedFields: Record<string, number> = {}
    for (const ev of events) {
      if (ev.type === 'cta_click') {
        const label = String(ev.meta.label || 'unknown')
        ctaClicks[label] = (ctaClicks[label] || 0) + 1
      } else if (ev.type === 'scroll_depth') {
        scrollReach[String(ev.meta.depth)]?.add(`${ev.visitorId}|${ev.page}`)
      } else if (ev.type === 'form_abandon') {
        const field = String(ev.meta.last_field || 'unknown')
        abandonedFields[field] = (abandonedFields[field] || 0) + 1
      }
    }
    const top = (o: Record<string, number>) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, 10)
    const behavior = {
      topCtas: top(ctaClicks),
      scrollDepth: Object.entries(scrollReach).map(([depth, s]) => ({ depth: Number(depth), readers: s.size })),
      abandonedFields: top(abandonedFields),
    }

    // Acquisition channel of every visitor seen in range (first touch)
    const channels: Record<string, number> = {}
    const seenForChannel = new Set<string>()
    for (const v of pageViews) {
      const k = visitorOf(v)
      if (seenForChannel.has(k)) continue
      seenForChannel.add(k)
      const ch = v.firstSource || 'direct / organic'
      channels[ch] = (channels[ch] || 0) + 1
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
      behavior,
      channels: top(channels),
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
