import { NextRequest, NextResponse } from 'next/server'
import { saveEnquiry } from '@/lib/azure-storage'
import { verifyUnsubscribeToken } from '@/lib/unsubscribe'
import { simplePage } from '@/lib/simple-page'

/**
 * Unsubscribe endpoint for marketing email.
 *
 * GET  — the link in the email footer; records the opt-out and renders a
 *        confirmation page.
 * POST — RFC 8058 one-click, called by Gmail/Outlook without user interaction.
 *        Must succeed silently and return 200.
 *
 * Opt-outs land in Table Storage under `Unsubscribe` so the sending side can
 * honour them and there is an auditable record of when it happened.
 */

async function recordOptOut(email: string, source: string) {
  await saveEnquiry('Unsubscribe', {
    email,
    source,
    unsubscribedAt: new Date().toISOString(),
  })
}

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email') || ''
  const token = req.nextUrl.searchParams.get('token') || ''

  if (!email || !verifyUnsubscribeToken(email, token)) {
    return simplePage(
      'Link not recognised',
      'This unsubscribe link is invalid or has expired. Email admin@gennoor.com and we will remove you straight away.',
      400
    )
  }

  try {
    await recordOptOut(email, 'link')
  } catch (error) {
    console.error('Unsubscribe record failed:', error)
    return simplePage(
      'Something went wrong',
      'We could not record your request just now. Please email admin@gennoor.com and we will remove you manually.',
      500
    )
  }

  return simplePage(
    'You have been unsubscribed',
    `We have removed <strong>${email.replace(/[<>&"]/g, '')}</strong> from the list. No more weekly emails will come. You will still receive messages you ask for yourself, such as sign-in codes and certificates.`,
    200
  )
}

export async function POST(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email') || ''
  const token = req.nextUrl.searchParams.get('token') || ''

  // One-click callers expect 200 regardless; never leak whether the address exists.
  if (email && verifyUnsubscribeToken(email, token)) {
    try {
      await recordOptOut(email, 'one-click')
    } catch (error) {
      console.error('One-click unsubscribe record failed:', error)
    }
  }

  return NextResponse.json({ success: true })
}
