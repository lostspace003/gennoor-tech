import * as appInsights from 'applicationinsights'

let isInitialized = false

export function initAppInsights() {
  if (isInitialized || !process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) return

  appInsights.setup(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING)
    .setAutoCollectRequests(true)
    .setAutoCollectPerformance(true, true)
    .setAutoCollectExceptions(true)
    .setAutoCollectDependencies(true)
    .setAutoCollectConsole(true, true)
    .setUseDiskRetryCaching(true)
    .start()

  isInitialized = true
}

function getClient(): appInsights.TelemetryClient | null {
  if (!isInitialized) initAppInsights()
  return appInsights.defaultClient || null
}

// Track page views (called from middleware)
export function trackPageView(name: string, url: string, properties?: Record<string, string>) {
  const client = getClient()
  if (!client) return
  client.trackPageView({
    name,
    url,
    id: `${name}-${Date.now()}`,
    properties: {
      ...properties,
      timestamp: new Date().toISOString(),
    },
  })
}

// Track custom events (enquiries, bookings, etc.)
export function trackEvent(name: string, properties?: Record<string, string>, measurements?: Record<string, number>) {
  const client = getClient()
  if (!client) return
  client.trackEvent({
    name,
    properties: {
      ...properties,
      timestamp: new Date().toISOString(),
    },
    measurements,
  })
}

// Track exceptions
export function trackException(error: Error, properties?: Record<string, string>) {
  const client = getClient()
  if (!client) return
  client.trackException({
    exception: error,
    properties,
  })
}

// Flush all pending telemetry
export function flushTelemetry() {
  const client = getClient()
  if (!client) return
  client.flush()
}
