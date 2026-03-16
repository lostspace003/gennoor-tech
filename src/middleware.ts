import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const { pathname } = request.nextUrl

  // Log page view by forwarding to our internal logging API
  // Middleware runs on edge, so we fire-and-forget to a server API
  const url = request.nextUrl.clone()
  url.pathname = '/api/log-pageview'

  const logPayload = JSON.stringify({
    page: pathname,
    url: request.url,
    referrer: request.headers.get('referer') || '',
    userAgent: request.headers.get('user-agent') || '',
    ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '',
    country: request.headers.get('x-vercel-ip-country') || '',
    city: request.headers.get('x-vercel-ip-city') || '',
    timestamp: new Date().toISOString(),
  })

  // Fire-and-forget: don't await, don't block the response
  fetch(url.toString(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: logPayload,
  }).catch(() => {
    // Silently ignore logging errors
  })

  return response
}

export const config = {
  matcher: [
    // Match all pages except static files, api routes, and _next
    '/((?!api|_next/static|_next/image|favicon.ico|logos|videos|certificates|.*\\..*).*)',
  ],
}
