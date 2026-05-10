import { NextRequest, NextResponse } from 'next/server'
import {
  runQuery, getRequestsOverTime, getResponseTime,
  getFailedRequests, getAvailability, QUERIES, isAppInsightsConfigured,
} from '@/lib/app-insights'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  try {
    const { authorized } = await verifyAdmin(request)
    if (!authorized) return unauthorizedResponse()
    const { metric, timespan = 'P7D' } = await request.json()

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
        const logFail = (name: string) => (err: unknown) => { console.error(`Insights metric "${name}" failed:`, err); return null }

        const [requests, responseTime, failed, availability] = await Promise.all([
          getRequestsOverTime(timespan).catch(logFail('requests')),
          getResponseTime(timespan).catch(logFail('response-time')),
          getFailedRequests(timespan).catch(logFail('failed')),
          getAvailability(timespan).catch(logFail('availability')),
        ])

        const [dailyUsers, responseTimeTrend, topPages, browsers, countries, errors,
          sessionStats, eventsSummary, peakHours, deviceTypes, operatingSystems,
          slowestPages, failedUrls, userRetention] = await Promise.all([
          runQuery(QUERIES.dailyUsers, timespan).catch(logFail('dailyUsers')),
          runQuery(QUERIES.responseTimeTrend, timespan).catch(logFail('responseTimeTrend')),
          runQuery(QUERIES.topPages, timespan).catch(logFail('topPages')),
          runQuery(QUERIES.browserStats, timespan).catch(logFail('browsers')),
          runQuery(QUERIES.countryStats, timespan).catch(logFail('countries')),
          runQuery(QUERIES.errorsByType, timespan).catch(logFail('errors')),
          runQuery(QUERIES.sessionStats, timespan).catch(logFail('sessionStats')),
          runQuery(QUERIES.eventsSummary, timespan).catch(logFail('eventsSummary')),
          runQuery(QUERIES.peakHours, timespan).catch(logFail('peakHours')),
          runQuery(QUERIES.deviceTypes, timespan).catch(logFail('deviceTypes')),
          runQuery(QUERIES.operatingSystems, timespan).catch(logFail('operatingSystems')),
          runQuery(QUERIES.slowestPages, timespan).catch(logFail('slowestPages')),
          runQuery(QUERIES.failedUrls, timespan).catch(logFail('failedUrls')),
          runQuery(QUERIES.userRetention, timespan).catch(logFail('userRetention')),
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
