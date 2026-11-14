import { escapeHtml } from '@/lib/escape-html'
import { emailShell, emailTitle, emailDetails, emailButton, emailSteps, emailCallout, emailContact, textToHtml } from '@/lib/crm/email-theme'
import { WEEKEND, DAYS, KIT, FAQS, INCLUDED, timeLabel, type Cohort, DEMO_WORD } from '@/data/ai-weekend'
import type { CohortSettings } from '@/lib/weekend'

// The AI Weekend's own emails. They are separate from the CRM's email series:
// different audience (people who signed up for the workshop, or are being
// invited to it), different message. Pure functions, so each one can be
// previewed in the admin panel exactly as it will be received.

export type WeekendEmailKind = 'invite' | 'inside' | 'fit' | 'closing' | 'thanks' | 'payment' | 'reminder' | 'join' | 'kit'

export interface WeekendEmailInfo {
  kind: WeekendEmailKind
  title: string
  /** When to send it. */
  when: string
  /** Who it goes to. */
  to: string
  /**
   * 'campaign': the emails that bring people to the weekend, from "what is it" to "registration closes" to
   * "thank you". Staff can put them in another order. 'desk': the emails of the weekend itself, sent to people
   * who registered, in the order the weekend runs.
   */
  group: 'campaign' | 'desk'
  /** Goes to people staff choose (picked from the leads, or pasted), not to the people who registered. */
  outreach?: boolean
  /** Which setting it cannot be sent without. */
  needs?: keyof CohortSettings
  needsLabel?: string
}

const CHOSEN = 'People you choose: picked from the leads, or pasted'

/**
 * The campaign first (owner, 14 November 2026: "email campaign template for AI Weekend ... need 4-5 template and
 * again we can move them, creating awareness to urgency and then thanking with relevant page link"), then the
 * emails of the weekend itself. Nothing here is sent by a machine: a person chooses who gets it and presses Send.
 */
export const WEEKEND_EMAILS: WeekendEmailInfo[] = [
  { kind: 'invite', title: 'Invitation', group: 'campaign', outreach: true, when: 'About three weeks before: what the weekend is', to: CHOSEN },
  { kind: 'inside', title: 'What you will see built', group: 'campaign', outreach: true, when: 'About two weeks before: the demos, day by day', to: CHOSEN },
  { kind: 'fit', title: 'Is it for you?', group: 'campaign', outreach: true, when: 'About a week before: the questions people ask', to: CHOSEN },
  { kind: 'closing', title: 'Registration closes', group: 'campaign', outreach: true, when: 'Two or three days before registration closes', to: CHOSEN },
  { kind: 'thanks', title: 'Thank you', group: 'campaign', when: 'After people register: thanks, what comes next, the page to pass on', to: 'Everyone registered' },
  { kind: 'payment', title: 'How to pay', group: 'desk', when: 'After someone registers', to: 'Registered, not paid yet', needs: 'payment', needsLabel: 'the payment details' },
  { kind: 'reminder', title: 'Reminder', group: 'desk', when: 'Two or three days before', to: 'Everyone registered' },
  { kind: 'join', title: 'Joining link', group: 'desk', when: 'The day before', to: 'People who have paid', needs: 'joinUrl', needsLabel: 'the Teams joining link' },
  { kind: 'kit', title: 'The kit', group: 'desk', when: 'After the weekend', to: 'People who have paid', needs: 'kitUrl', needsLabel: 'the kit download link' },
]

/** The campaign's emails in the order they were written. Staff may keep another order (see the admin route). */
export const CAMPAIGN_KINDS: WeekendEmailKind[] = WEEKEND_EMAILS.filter((e) => e.group === 'campaign').map((e) => e.kind)

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

/**
 * When registration closes, in words: one day before the weekend (cohort.closesAt). The urgency of the campaign
 * is this date and nothing else: no countdown, no "only 3 seats left" that nobody counted.
 */
export function closesWords(cohort: Cohort): { day: string; full: string } {
  const at = new Date(cohort.closesAt)
  const day = at.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Asia/Kolkata' }).replace(',', '')
  const time = at.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Kolkata' })
  return { day, full: `${day} at ${time} India time` }
}

const SITE = 'https://www.gennoor.com'
const PAGE = `${SITE}/ai-weekend`
import { money } from '@/lib/money'
const p = (html: string) => `<p style="margin:0 0 16px;font-size:16px;line-height:1.65;color:#475569">${html}</p>`

/** The two days as a compact block: day, title, what is built. */
function programme(): string {
  return DAYS.map(
    (d) => `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#f4f7fd" style="margin:0 0 12px;background:#f4f7fd;border:1px solid #dbe6ff;border-radius:12px"><tr><td style="padding:16px 18px">
      <div style="font-size:12px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:#b45309">${d.label}</div>
      <div style="font-size:17px;font-weight:700;line-height:1.35;color:#0f172a;margin:4px 0 8px">${d.title}</div>
      ${d.projects.map((x) => `<div style="font-size:14px;line-height:1.6;color:#475569"><span style="color:#16a34a">&#10003;</span>&nbsp; ${x.name}</div>`).join('')}
    </td></tr></table>`
  ).join('')
}

const details = (cohort: Cohort) =>
  emailDetails('The weekend', [['Dates', cohort.label], ['Time', `${timeLabel()}, both days`], ['Where', WEEKEND.mode]])

const stop = `<p style="margin:26px 0 0;padding-top:16px;border-top:1px solid #e2e8f0;font-size:13px;line-height:1.6;color:#94a3b8">Not for you? Reply with the word stop and we will not write again.</p>`

export function buildWeekendEmail(
  kind: WeekendEmailKind,
  /** `fee` and `currency` are the person's own (rupees in India, dollars elsewhere); without them, the rupee fee. */
  person: { name?: string; fee?: number; currency?: 'INR' | 'USD' },
  cohort: Cohort,
  settings: CohortSettings = {},
  from = 'webinar@gennoor.com',
  /** The person's own link to pay online, when online payment is switched on. */
  payLink = ''
): { subject: string; html: string } {
  const due = money(person.fee ?? WEEKEND.fee, person.currency || 'INR')
  const ways = (person.currency || 'INR') === 'INR' ? 'UPI, card or net banking' : 'Card'
  const first = escapeHtml((person.name || '').trim().split(/\s+/)[0] || '')
  const hello = first ? `Hello ${first},` : 'Hello,'
  const shell = (body: string, preheader: string) => emailShell(body, { preheader, senderEmail: from })
  const closes = closesWords(cohort)

  switch (kind) {
    // ---- The campaign, after the invitation. No amount in any of them: they go to people in India and abroad,
    // and the page shows each reader the one fee that applies to them.
    case 'inside':
      return {
        subject: `${cap(DEMO_WORD)} demos, built live in front of you: ${cohort.label}`,
        html: shell(
          emailTitle(hello, `Most talks about AI show slides. On the ${WEEKEND.name} you watch the work being done, from an empty screen, and you take home everything you need to repeat it.`) +
            programme() +
            emailCallout('file', 'You keep the kit', `${cap(KIT.join(', ').toLowerCase())}. It is sent after the weekend to everyone who attended.`) +
            details(cohort) +
            emailButton('See the two days', PAGE) +
            stop,
          `${cohort.label}. What is built on each of the two mornings.`
        ),
      }

    case 'fit': {
      // The questions people really ask, from the page itself; the one about the fee is left to the page
      const answers = FAQS.filter((f) => !/fee|price/i.test(f.q + f.a)).slice(0, 4)
      return {
        subject: `Is the ${WEEKEND.name} for you?`,
        html: shell(
          emailTitle(hello, 'Two mornings is a real commitment. Here are the questions people ask us before they decide.') +
            answers
              .map(
                (f) => `<p style="margin:0 0 6px;font-size:16px;line-height:1.45;font-weight:700;color:#0f172a">${escapeHtml(f.q)}</p>
                <p style="margin:0 0 20px;font-size:15px;line-height:1.65;color:#475569">${escapeHtml(f.a)}</p>`
              )
              .join('') +
            details(cohort) +
            emailButton('Reserve my seat', PAGE) +
            stop,
          'No coding is needed. You watch each demo built live, then repeat it with the kit.'
        ),
      }
    }

    case 'closing':
      return {
        subject: `Registration closes on ${closes.day}: ${WEEKEND.name}`,
        html: shell(
          emailTitle(hello, `Registration for this month's ${WEEKEND.name} closes on ${closes.full}. Anyone who registers after that joins next month's weekend instead.`) +
            details(cohort) +
            emailSteps(INCLUDED.map((x) => ({ title: x })), 'What you get') +
            emailButton('Reserve my seat', PAGE) +
            p(`<span style="font-size:14px;color:#64748b">Seats in each cohort are limited. No coding background is needed.</span>`) +
            stop,
          `${cohort.label}. Registration closes on ${closes.day}.`
        ),
      }

    case 'thanks':
      return {
        subject: `Thank you for joining the ${WEEKEND.name}`,
        html: shell(
          emailTitle(first ? `Thank you, ${first}.` : 'Thank you.', `You have a seat on the ${WEEKEND.name}. Here is what comes next, and the page to pass on if someone you work with would enjoy it too.`) +
            details(cohort) +
            emailSteps(
              [
                { title: 'Before the weekend', body: 'A few days before, we send what to expect. The joining link follows the day before, once your fee is received.' },
                { title: 'On the two mornings', body: 'Each demo is built live, step by step. Ask questions as it happens.' },
                { title: 'After the weekend', body: `You receive the full kit: ${KIT.join(', ').toLowerCase()}.` },
              ],
              'What comes next'
            ) +
            p(`Know someone who would enjoy it? Send them this page: <a href="${PAGE}" style="color:#2563EB;font-weight:600">gennoor.com/ai-weekend</a>. Registration for this weekend closes on ${closes.day}.`) +
            emailButton('See the full programme', PAGE) +
            emailContact({ email: 'admin@gennoor.com' }),
          `Your seat for ${cohort.label} is held. What comes next, and the page to pass on.`
        ),
      }

    case 'invite':
      return {
        subject: `${WEEKEND.tagline}: ${cohort.label}`,
        html: shell(
          emailTitle(hello, `On the last weekend of every month we run the ${WEEKEND.name}: two live mornings where you watch real work being done with AI, step by step.`) +
            programme() +
            emailSteps(
              [
                { title: 'Watch it built live', body: 'Each demo starts from an empty screen. Ask questions as it happens.' },
                { title: 'Receive the full kit', body: `After the weekend: ${KIT.join(', ').toLowerCase()}.` },
                { title: 'Do it for yourself', body: 'Follow the kit at your own pace, then apply it to your own tasks.' },
              ],
              'How it works'
            ) +
            details(cohort) +
            // No amount here: an invitation goes to people in India and abroad, and each pays in their own
            // money. The page shows the one fee that applies to whoever opens it.
            emailButton('Reserve my seat', PAGE) +
            p(`<span style="font-size:14px;color:#64748b">Seats in each cohort are limited. No coding background is needed.</span>`) +
            stop,
          `${cohort.label}. Two live mornings, ${DEMO_WORD} demos, and the full kit.`
        ),
      }

    case 'payment':
      return {
        subject: `Complete your registration: ${WEEKEND.name}, ${cohort.label}`,
        html: shell(
          emailTitle(hello, `Your seat on the ${WEEKEND.name} is held. One step is left: the fee of ${due}.`) +
            (payLink
              ? emailCallout('check', `Pay ${due} online`, `${ways}. It takes about a minute, and your seat is confirmed the moment the payment goes through.`) +
                emailButton(`Pay ${due} now`, payLink) +
                (settings.payment ? `<p style="margin:18px 0 8px;font-size:14px;color:#64748b">Or pay another way:</p><div style="margin:0 0 18px;padding:14px 16px;border:1px solid #e2e8f0;border-radius:12px;font-size:14px;line-height:1.7;color:#0f172a">${textToHtml(settings.payment)}</div>` : '')
              : emailCallout('check', `Pay ${due}`, 'Use the details below. Your seat is confirmed as soon as the payment is received.') +
                `<div style="margin:0 0 18px;padding:16px 18px;border:1px solid #e2e8f0;border-radius:12px;font-size:15px;line-height:1.7;color:#0f172a">${textToHtml(settings.payment || '[Payment details go here]')}</div>`) +
            details(cohort) +
            (payLink ? '' : p('After you pay, reply to this email with the payment reference so we can match it to you quickly.')) +
            emailContact({ email: 'admin@gennoor.com' }),
          `One step left: ${due} to confirm your seat for ${cohort.label}.`
        ),
      }

    case 'reminder':
      return {
        subject: `This weekend: ${WEEKEND.name}, ${cohort.label}`,
        html: shell(
          emailTitle(first ? `Nearly there, ${first}.` : 'Nearly there.', `The ${WEEKEND.name} is this weekend. Here is what to expect.`) +
            details(cohort) +
            programme() +
            emailSteps(
              [
                { title: 'Keep both mornings free', body: `${timeLabel()} on Saturday and on Sunday.` },
                { title: 'Watch for the joining link', body: 'It arrives by email the day before, once your fee is received.' },
                { title: 'Bring your questions', body: 'Think of one task you repeat every week. It makes the demos more useful to you.' },
              ],
              'Before Saturday'
            ) +
            emailContact({ email: 'admin@gennoor.com' }),
          `${cohort.label}, ${timeLabel()}. What to expect, and what to do before Saturday.`
        ),
      }

    case 'join':
      return {
        subject: `Your joining link: ${WEEKEND.name}, ${cohort.label}`,
        html: shell(
          emailTitle(first ? `See you on Saturday, ${first}.` : 'See you on Saturday.', `Here is your link for the ${WEEKEND.name}. The same link works on both days.`) +
            details(cohort) +
            emailButton('Join the session', settings.joinUrl || PAGE) +
            emailSteps(
              [
                { title: 'Join five minutes early', body: 'So sound and screen are sorted before we begin.' },
                { title: 'Watch each demo built live', body: 'Ask questions as they come up.' },
                { title: 'Receive the full kit', body: 'After the weekend we send everything you need to repeat every demo yourself.' },
              ],
              'How the weekend runs'
            ) +
            `<p style="margin:18px 0 0;font-size:13px;color:#64748b;word-break:break-all">If the button does not work, copy this link: ${escapeHtml(settings.joinUrl || '')}</p>` +
            emailContact({ email: 'admin@gennoor.com' }),
          `${cohort.label}, ${timeLabel()}. Your joining link is inside.`
        ),
      }

    case 'kit':
    default:
      return {
        subject: `Your kit: ${WEEKEND.name}`,
        html: shell(
          emailTitle(first ? `Thank you, ${first}.` : 'Thank you.', `Here is the full kit from the ${WEEKEND.name}. Everything you watched being built is in it, so you can now do it yourself.`) +
            emailCallout('file', 'What is inside', `${KIT.join(', ')}.`) +
            emailButton('Download the kit', settings.kitUrl || PAGE) +
            emailSteps(
              [
                { title: 'Start with the setup checklist', body: 'It gets your own machine ready in a few minutes.' },
                { title: 'Repeat one demo at a time', body: 'Follow the step-by-step guide, using the same prompts and files.' },
                { title: 'Apply it to your own work', body: 'Swap in a task you repeat every week.' },
              ],
              'How to use it'
            ) +
            p(`Want this for your whole team, built around your own processes? Reply to this email and we will set up a call. The next ${WEEKEND.name} is on the last weekend of next month: ${`<a href="${PAGE}" style="color:#2563EB;font-weight:600;text-decoration:none">see the dates</a>`}.`) +
            emailContact({ email: 'admin@gennoor.com' }),
          'Notes, prompts, files and guides to repeat every demo yourself.'
        ),
      }
  }
}

/** The receipt, sent the moment an online payment succeeds. */
export function buildPaidEmail(
  person: { name?: string; fee: number; currency?: 'INR' | 'USD'; coupon?: string },
  cohort: Cohort,
  paymentId: string,
  settings: CohortSettings = {},
  from = 'webinar@gennoor.com'
): { subject: string; html: string } {
  const first = escapeHtml((person.name || '').trim().split(/\s+/)[0] || '')
  // A coupon code that took the whole fee off: nothing was paid, so nothing is called a payment
  const covered = !!person.coupon && person.fee === 0
  const paid = money(person.fee, person.currency || 'INR')
  return {
    subject: covered ? `Your seat is confirmed: ${WEEKEND.name}` : `Payment received: your seat is confirmed, ${WEEKEND.name}`,
    html: emailShell(
      emailTitle(first ? `You are confirmed, ${first}.` : 'You are confirmed.', `${covered ? 'Your code is accepted' : 'We have received your payment'}. Your seat on the ${WEEKEND.name} is confirmed.`) +
        emailDetails(covered ? 'Your seat' : 'Your receipt', [
          ['Paid', covered ? `Nothing to pay, with code ${person.coupon}` : person.coupon ? `${paid} with code ${person.coupon}` : paid],
          ['For', `${WEEKEND.name}, ${cohort.label}`],
          ...(paymentId ? [['Payment reference', paymentId] as [string, string]] : []),
          [covered ? 'Confirmed on' : 'Paid on', new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' })],
        ]) +
        details(cohort) +
        (settings.joinUrl ? emailButton('Join the session', settings.joinUrl) : '') +
        emailSteps(
          [
            { title: settings.joinUrl ? 'Keep this email' : 'Watch for the joining link', body: settings.joinUrl ? 'The button above is your joining link. The same link works on both days.' : 'It arrives by email the day before the weekend.' },
            { title: 'Watch each demo built live', body: 'Ask questions as they come up.' },
            { title: 'Receive the full kit', body: 'After the weekend we send everything you need to repeat every demo yourself.' },
          ],
          'What happens next'
        ) +
        emailContact({ email: 'admin@gennoor.com' }),
      { preheader: `${covered ? 'Your code is accepted' : `${paid} received`}. Your seat for ${cohort.label} is confirmed.`, senderEmail: from }
    ),
  }
}
