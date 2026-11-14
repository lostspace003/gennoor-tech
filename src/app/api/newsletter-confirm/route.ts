import { NextRequest } from 'next/server'
import { readConfirmToken } from '@/lib/unsubscribe'
import { confirmSignUp } from '@/lib/newsletter-live'
import { simplePage } from '@/lib/simple-page'

export const dynamic = 'force-dynamic'

const BLOG = { href: 'https://www.gennoor.com/resources/blog', label: 'Read the latest posts' }

/**
 * The button of the "Confirm your email" message leads here. A good link puts its address on the list for the
 * weekly email of new posts (once: pressing it again changes nothing) and says so on a small page.
 * The address is inside the signed token (src/lib/unsubscribe.ts), so a link works only for the address it
 * was sent to.
 */
export async function GET(request: NextRequest) {
  const who = readConfirmToken(request.nextUrl.searchParams.get('t') || '')
  if (!who) {
    return simplePage(
      'This link no longer works',
      'It may be more than two weeks old, or part of it was lost when it was copied. Type your email into the box "Get new posts by email" on gennoor.com and we will send a new one.',
      400
    )
  }
  try {
    const result = await confirmSignUp(who.email, who.source)
    return simplePage(
      result === 'already' ? 'You are already subscribed' : 'You are subscribed',
      'You will get one email a week, on Thursday, with the posts of that week. A week with no new post brings no email, and every email has a link to stop.',
      200,
      BLOG
    )
  } catch (error) {
    console.error('Newsletter confirm error:', error)
    return simplePage('Something went wrong', 'We could not add you just now. Please press the button in the email again in a few minutes.', 500)
  }
}
