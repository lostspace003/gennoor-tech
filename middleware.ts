import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Single middleware for protected app surfaces. NOTE: a second middleware at
// src/middleware.ts was silently shadowed by this file for months — keep ONE
// middleware, here at the repo root.
const AUTHORIZED_EMAILS = [
  'admin@gennoor.com',
  'jalalkhan@gennoor.com',
  'yusufchaudhary@gennoor.com',
  'contact@gennoor.com',
  'contacts@gennoor.com',
]

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Canonical host for app surfaces: auth cookies live on www.gennoor.com —
  // logging in on the bare domain would create a second, separate session.
  // Behind Azure's proxy the real host is in the header, not nextUrl.
  const host = (request.headers.get('host') || '').toLowerCase()
  if (host === 'gennoor.com') {
    return NextResponse.redirect(`https://www.gennoor.com${path}${request.nextUrl.search}`, 301)
  }

  // The login page itself must stay reachable
  if (path.startsWith('/admin/login')) return NextResponse.next()

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET })

  if (!token) {
    const loginUrl = new URL('/admin/login', request.url)
    loginUrl.searchParams.set('callbackUrl', path)
    return NextResponse.redirect(loginUrl)
  }

  if (!AUTHORIZED_EMAILS.includes((token.email as string || '').toLowerCase())) {
    const loginUrl = new URL('/admin/login', request.url)
    loginUrl.searchParams.set('error', 'AccessDenied')
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/crm/:path*'],
}
