const APP_ID = process.env.APPINSIGHTS_APP_ID
const API_KEY = process.env.APPINSIGHTS_API_KEY
const BASE_URL = `https://api.applicationinsights.io/v1/apps/${APP_ID}`

async function queryAppInsights(endpoint: string): Promise<unknown> {
  if (!APP_ID || !API_KEY) {
    throw new Error('APPINSIGHTS_APP_ID and APPINSIGHTS_API_KEY must be set')
  }
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { 'x-api-key': API_KEY },
  })
  if (!res.ok) throw new Error(`App Insights API error: ${res.status} ${res.statusText}`)
  return res.json()
}

export async function getRequestsOverTime(timespan: string = 'P7D') {
  return queryAppInsights(`/metrics/requests/count?timespan=${timespan}`)
}

export async function getResponseTime(timespan: string = 'P7D') {
  return queryAppInsights(`/metrics/requests/duration?timespan=${timespan}&aggregation=avg`)
}

export async function getFailedRequests(timespan: string = 'P7D') {
  return queryAppInsights(`/metrics/requests/failed?timespan=${timespan}`)
}

export async function getAvailability(timespan: string = 'P7D') {
  return queryAppInsights(`/metrics/availabilityResults/availabilityPercentage?timespan=${timespan}`)
}

export async function runQuery(query: string, timespan: string = 'P7D') {
  if (!APP_ID || !API_KEY) {
    throw new Error('APPINSIGHTS_APP_ID and APPINSIGHTS_API_KEY must be set')
  }
  const res = await fetch(`${BASE_URL}/query`, {
    method: 'POST',
    headers: { 'x-api-key': API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, timespan }),
  })
  if (!res.ok) throw new Error(`App Insights query error: ${res.status}`)
  return res.json()
}

export const QUERIES = {
  topPages: `pageViews | summarize count() by name | top 10 by count_ | order by count_ desc`,
  browserStats: `pageViews | summarize count() by client_Browser | top 5 by count_`,
  countryStats: `pageViews | summarize count() by client_CountryOrRegion | top 10 by count_ | order by count_ desc`,
  errorsByType: `exceptions | summarize count() by type | top 10 by count_`,
  responseTimeTrend: `requests | summarize avg(duration) by bin(timestamp, 1h) | order by timestamp asc`,
  dailyUsers: `pageViews | summarize dcount(client_IP) by bin(timestamp, 1d) | order by timestamp asc`,
  sessionStats: `customEvents | union pageViews | summarize sessions=dcount(session_Id), avgDuration=avg(todouble(duration)/1000), totalPageViews=count() | project sessions, avgDuration, pagesPerSession=todouble(totalPageViews)/todouble(sessions)`,
  eventsSummary: `customEvents | summarize count() by name | order by count_ desc`,
  peakHours: `pageViews | extend hour=hourofday(timestamp) | summarize count() by hour | order by hour asc`,
  deviceTypes: `pageViews | extend device = case(client_Browser has "Mobile" or client_Browser has "Android", "Mobile", client_Browser has "iPad" or client_Browser has "Tablet", "Tablet", "Desktop") | summarize count() by device`,
  operatingSystems: `pageViews | summarize count() by client_OS | top 5 by count_`,
  slowestPages: `requests | where success == true | summarize avgDuration=avg(duration), count=count() by name | where count > 2 | top 10 by avgDuration | project name, avgDuration, count`,
  failedUrls: `requests | where success == false | summarize count() by name | top 10 by count_`,
  userRetention: `pageViews | summarize days=dcount(bin(timestamp, 1d)) by client_IP | summarize returning=countif(days > 1), total=count()`,
}

export function isAppInsightsConfigured(): boolean {
  return !!(APP_ID && API_KEY)
}
