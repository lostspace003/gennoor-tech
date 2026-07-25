import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Protected routes
  const protectedPaths = ['/admin', '/crm']
  const isProtectedPath = protectedPaths.some(p => path.startsWith(p))

  if (isProtectedPath) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    })

    if (!token) {
      // Redirect to login if not authenticated
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('callbackUrl', path)
      return NextResponse.redirect(loginUrl)
    }

    // Check if user is authorized
    const authorizedEmails = [
      'admin@gennoor.com',
      'jalalkhan@gennoor.com',
      'yusufchaudhary@gennoor.com',
      'contact@gennoor.com',
      'contacts@gennoor.com'
    ]

    if (!authorizedEmails.includes(token.email as string)) {
      // Redirect to login with error
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('error', 'AccessDenied')
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/crm/:path*', '/crm/dashboard/:path*']
}