import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { newsletterStatus, sendTestTo } from '@/lib/newsletter-live'

export const dynamic = 'force-dynamic'

/**
 * The weekly email of new posts, for the admin centre.
 *   GET                       who is subscribed, the email that goes next (with a preview), and what has gone
 *   POST { action: 'test' }   sends that next email to the person who is signed in, and to nobody else
 * Nothing here sends to subscribers: that is the heartbeat's job, once a week (src/lib/newsletter.ts).
 */
export async function GET(request: NextRequest) {
  const admin = await verifyAdmin(request)
  if (!admin.authorized || !admin.email) return unauthorizedResponse()
  try {
    return NextResponse.json(await newsletterStatus(admin.email))
  } catch (error) {
    console.error('Newsletter status error:', error)
    return NextResponse.json({ error: 'The weekly email could not be read just now. Try again in a minute.' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const admin = await verifyAdmin(request)
  if (!admin.authorized || !admin.email) return unauthorizedResponse()
  try {
    const { action } = await request.json()
    if (action !== 'test') return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    const result = await sendTestTo(admin.email)
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 })
    return NextResponse.json({ success: true, to: admin.email })
  } catch (error) {
    console.error('Newsletter test error:', error)
    return NextResponse.json({ error: 'The test email could not be sent. Try again in a minute.' }, { status: 500 })
  }
}
