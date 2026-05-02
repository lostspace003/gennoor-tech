import { NextRequest, NextResponse } from 'next/server'
import {
  runQuery, getRequestsOverTime, getResponseTime,
  getFailedRequests, getAvailability, QUERIES, isAppInsightsConfigured,
} from '@/lib/app-insights'

export async function POST(request: NextRequest) {
  try {
    const { secret, metric, timespan = 'P7D' } = await request.json()
    if (secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!isAppInsightsConfigured()) {
      return NextResponse.json({ error: 'App Insights not configured' }, { status: 400 })
    }

    switch (metric) {
      case 'requests':
        return NextResponse.json(await getRequestsOverTime(timespan))
      case 'response-time':
        return NextResponse.json(await getResponseTime(timespan))
      case 'failed':
        return NextResponse.json(await getFailedRequests(timespan))
      case 'availability':
        return NextResponse.json(await getAvailability(timespan))
      case 'top-pages':
        return NextResponse.json(await runQuery(QUERIES.topPages, timespan))
      case 'browsers':
        return NextResponse.json(await runQuery(QUERIES.browserStats, timespan))
      case 'countries':
        return NextResponse.json(await runQuery(QUERIES.countryStats, timespan))
      case 'errors':
        return NextResponse.json(await runQuery(QUERIES.errorsByType, timespan))
      case 'daily-users':
        return NextResponse.json(await runQuery(QUERIES.dailyUsers, timespan))
      case 'response-trend':
        return NextResponse.json(await runQuery(QUERIES.responseTimeTrend, timespan))
      case 'all': {
        // Fetch all key metrics in one call
        const [requests, responseTime, failed, availability] = await Promise.all([
          getRequestsOverTime(timespan).catch(() => null),
          getResponseTime(timespan).catch(() => null),
          getFailedRequests(timespan).catch(() => null),
          getAvailability(timespan).catch(() => null),
        ])

        const [dailyUsers, responseTimeTrend, topPages, browsers, countries, errors,
          sessionStats, eventsSummary, peakHours, deviceTypes, operatingSystems,
          slowestPages, failedUrls, userRetention] = await Promise.all([
          runQuery(QUERIES.dailyUsers, timespan).catch(() => null),
          runQuery(QUERIES.responseTimeTrend, timespan).catch(() => null),
          runQuery(QUERIES.topPages, timespan).catch(() => null),
          runQuery(QUERIES.browserStats, timespan).catch(() => null),
          runQuery(QUERIES.countryStats, timespan).catch(() => null),
          runQuery(QUERIES.errorsByType, timespan).catch(() => null),
          runQuery(QUERIES.sessionStats, timespan).catch(() => null),
          runQuery(QUERIES.eventsSummary, timespan).catch(() => null),
          runQuery(QUERIES.peakHours, timespan).catch(() => null),
          runQuery(QUERIES.deviceTypes, timespan).catch(() => null),
          runQuery(QUERIES.operatingSystems, timespan).catch(() => null),
          runQuery(QUERIES.slowestPages, timespan).catch(() => null),
          runQuery(QUERIES.failedUrls, timespan).catch(() => null),
          runQuery(QUERIES.userRetention, timespan).catch(() => null),
        ])

        return NextResponse.json({
          requests, responseTime, failed, availability,
          dailyUsers, responseTimeTrend, topPages, browsers, countries, errors,
          sessionStats, eventsSummary, peakHours, deviceTypes, operatingSystems,
          slowestPages, failedUrls, userRetention,
        })
      }
      default:
        return NextResponse.json({ error: 'Invalid metric' }, { status: 400 })
    }
  } catch (error) {
    console.error('Insights error:', error)
    return NextResponse.json({ error: 'Failed to fetch insights' }, { status: 500 })
  }
}
