import { NextResponse } from 'next/server'
import { trackEvent, trackException, initAppInsights } from '@/lib/analytics'
import { rateLimit, clientIp } from '@/lib/rate-limit'
import { askToConfirm } from '@/lib/newsletter-live'

/**
 * "Get new posts by email": the three boxes of the site (the foot of a page, the blog, every article; one box per page)
 * all send the address here.
 *
 * How signing up works (the owner, 14 November 2026: "how are we going to subscribe? You decide"):
 *   1. The visitor types an address and presses Subscribe. One field, one button.
 *   2. We send that address one email, "Confirm your email", with one button.
 *   3. Pressing it puts the address on the list (/api/newsletter-confirm).
 *   4. From then on: one email a week, on Thursday, with that week's posts (src/lib/newsletter.ts). Every one
 *      of them has a link that stops them at once (/api/unsubscribe).
 * Nobody is put on the list by someone else typing their address, and the page never asks for a code.
 *
 * Before this, the boxes asked for a code first, then saved the address and sent "You're subscribed", and
 * nothing ever followed. Earlier still they posted to the training enquiry form by mistake.
 *
 * Body: { email, source }. Answers { success, state: 'sent' | 'already' } or { success: false, message }.
 */
export async function POST(request: Request) {
  try {
    const ip = clientIp(request.headers)
    if (!rateLimit(`newsletter:${ip}`, 5, 10 * 60_000)) {
      return NextResponse.json({ success: false, message: 'Too many tries. Please wait a few minutes and try again.' }, { status: 429 })
    }
    initAppInsights()

    const body = await request.json()
    const email = String(body.email || '').trim().toLowerCase()
    const source = String(body.source || 'site').trim().slice(0, 40)
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, message: 'That does not look like an email address. Please check it.' }, { status: 400 })
    }
    // One "Confirm your email" to an address in ten minutes is enough, whoever asks
    if (!rateLimit(`newsletter-to:${email}`, 2, 10 * 60_000)) {
      return NextResponse.json({ success: true, state: 'sent' })
    }

    const state = await askToConfirm(email, source)
    trackEvent('NewsletterSubscribe', { source, state })
    if (state === 'failed') {
      return NextResponse.json({ success: false, message: 'We could not send the confirmation email just now. Please try again in a few minutes.' }, { status: 502 })
    }
    return NextResponse.json({ success: true, state })
  } catch (error) {
    console.error('Newsletter subscribe error:', error)
    trackException(error instanceof Error ? error : new Error(String(error)), { route: 'newsletter-subscribe' })
    return NextResponse.json({ success: false, message: 'That did not work. Please try again in a few minutes.' }, { status: 500 })
  }
}
