import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

// TEMPORARY diagnostic for the login loop. Reveals no secrets — only which
// cookie NAMES arrived, env presence booleans, and whether auth() decodes.
// Remove once auth is confirmed stable.
export async function GET(req: NextRequest) {
  let session: any = null
  let authError = ''
  try {
    session = await auth()
  } catch (e: any) {
    authError = String(e?.message || e).slice(0, 200)
  }

  return NextResponse.json({
    host: req.headers.get('host'),
    proto: req.headers.get('x-forwarded-proto'),
    cookieNames: req.cookies.getAll().map((c) => c.name),
    env: {
      NEXTAUTH_SECRET: Boolean(process.env.NEXTAUTH_SECRET),
      AUTH_SECRET: Boolean(process.env.AUTH_SECRET),
      secretsMatch: Boolean(process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET === process.env.AUTH_SECRET),
      AUTH_URL: process.env.AUTH_URL || null,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || null,
      AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST || null,
      AZURE_AD_CLIENT_ID: Boolean(process.env.AZURE_AD_CLIENT_ID),
      AZURE_AD_CLIENT_SECRET: Boolean(process.env.AZURE_AD_CLIENT_SECRET),
      AZURE_AD_TENANT_ID: Boolean(process.env.AZURE_AD_TENANT_ID),
    },
    sessionUser: session?.user?.email || null,
    authError: authError || undefined,
  })
}
