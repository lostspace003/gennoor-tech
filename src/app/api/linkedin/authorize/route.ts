import { NextResponse } from 'next/server'
import { getAuthorizationUrl } from '@/lib/linkedin'
import crypto from 'crypto'

export async function GET() {
  try {
    const state = crypto.randomBytes(16).toString('hex')
    const url = getAuthorizationUrl(state)
    return NextResponse.redirect(url)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
