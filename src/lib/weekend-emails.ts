import { escapeHtml } from '@/lib/escape-html'
import { emailShell, emailTitle, emailDetails, emailButton, emailSteps, emailCallout, emailContact, textToHtml } from '@/lib/crm/email-theme'
import { WEEKEND, DAYS, KIT, timeLabel, type Cohort, DEMO_WORD } from '@/data/ai-weekend'
import type { CohortSettings } from '@/lib/weekend'

// The AI Weekend's own emails. They are separate from the CRM's email series:
// different audience (people who signed up for the workshop, or are being
// invited to it), different message. Pure functions, so each one can be
// previewed in the admin panel exactly as it will be received.

export type WeekendEmailKind = 'invite' | 'payment' | 'reminder' | 'join' | 'kit'

export interface WeekendEmailInfo {
  kind: WeekendEmailKind
  title: string
  /** When to send it. */
  when: string
  /** Who it goes to. */
  to: string
  /** Which setting it cannot be sent without. */
  needs?: keyof CohortSettings
  needsLabel?: string
}

/** The five emails, in the order they are used. */
export const WEEKEND_EMAILS: WeekendEmailInfo[] = [
  { kind: 'invite', title: 'Invitation', when: 'Any time before the weekend', to: 'People you want to invite (paste their emails)' },
  { kind: 'payment', title: 'How to pay', when: 'After someone registers', to: 'Registered, not paid yet', needs: 'payment', needsLabel: 'the payment details' },
  { kind: 'reminder', title: 'Reminder', when: 'Two or three days before', to: 'Everyone registered' },
  { kind: 'join', title: 'Joining link', when: 'The day before', to: 'People who have paid', needs: 'joinUrl', needsLabel: 'the Teams joining link' },
  { kind: 'kit', title: 'The kit', when: 'After the weekend', to: 'People who have paid', needs: 'kitUrl', needsLabel: 'the kit download link' },
]

const SITE = 'https://www.gennoor.com'
const PAGE = `${SITE}/ai-weekend`
const rupees = (n: number) => `₹${n.toLocaleString('en-IN')}`
const p = (html: string) => `<p style="margin:0 0 16px;font-size:16px;line-height:1.65;color:#475569">${html}</p>`

/** The two days as a compact block: day, title, what is built. */
function programme(): string {
  return DAYS.map(
    (d) => `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 12px;background:#0C1426;border-radius:12px"><tr><td style="padding:16px 18px">
      <div style="font-size:12px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:#FBBF24">${d.label}</div>
      <div style="font-size:17px;font-weight:700;line-height:1.35;color:#ffffff;margin:4px 0 8px">${d.title}</div>
      ${d.projects.map((x) => `<div style="font-size:14px;line-height:1.6;color:#CBD5E1">&#10003;&nbsp; ${x.name}</div>`).join('')}
    </td></tr></table>`
  ).join('')
}

function price(): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:6px 0 4px"><tr><td align="center" style="font-family:'Segoe UI',Arial,sans-serif">
    <span style="font-size:18px;color:#94a3b8;text-decoration:line-through">${rupees(WEEKEND.regularFee)}</span>
    <span style="font-size:30px;font-weight:800;color:#0f172a;padding-left:8px">${rupees(WEEKEND.fee)}</span>
    <span style="font-size:14px;color:#64748b;padding-left:6px">for both days</span>
  </td></tr></table>`
}

const details = (cohort: Cohort) =>
  emailDetails('The weekend', [['Dates', cohort.label], ['Time', `${timeLabel()}, both days`], ['Where', WEEKEND.mode]])

const stop = `<p style="margin:26px 0 0;padding-top:16px;border-top:1px solid #e2e8f0;font-size:13px;line-height:1.6;color:#94a3b8">Not for you? Reply with the word stop and we will not write again.</p>`

export function buildWeekendEmail(
  kind: WeekendEmailKind,
  person: { name?: string },
  cohort: Cohort,
  settings: CohortSettings = {},
  from = 'webinar@gennoor.com',
  /** The person's own link to pay online, when online payment is switched on. */
  payLink = ''
): { subject: string; html: string } {
  const first = escapeHtml((person.name || '').trim().split(/\s+/)[0] || '')
  const hello = first ? `Hello ${first},` : 'Hello,'
  const shell = (body: string, preheader: string) => emailShell(body, { preheader, senderEmail: from })

  switch (kind) {
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
            price() +
            emailButton('Reserve my seat', PAGE) +
            p(`<span style="font-size:14px;color:#64748b">Seats in each cohort are limited. No coding background is needed.</span>`) +
            stop,
          `${cohort.label}. Two live mornings, ${DEMO_WORD} demos, and the full kit. ${rupees(WEEKEND.fee)}.`
        ),
      }

    case 'payment':
      return {
        subject: `Complete your registration: ${WEEKEND.name}, ${cohort.label}`,
        html: shell(
          emailTitle(hello, `Your seat on the ${WEEKEND.name} is held. One step is left: the fee of ${rupees(WEEKEND.fee)}.`) +
            (payLink
              ? emailCallout('check', `Pay ${rupees(WEEKEND.fee)} online`, 'UPI, card or net banking. It takes about a minute, and your seat is confirmed the moment the payment goes through.') +
                emailButton(`Pay ${rupees(WEEKEND.fee)} now`, payLink) +
                (settings.payment ? `<p style="margin:18px 0 8px;font-size:14px;color:#64748b">Or pay another way:</p><div style="margin:0 0 18px;padding:14px 16px;border:1px solid #e2e8f0;border-radius:12px;font-size:14px;line-height:1.7;color:#0f172a">${textToHtml(settings.payment)}</div>` : '')
              : emailCallout('check', `Pay ${rupees(WEEKEND.fee)}`, 'Use the details below. Your seat is confirmed as soon as the payment is received.') +
                `<div style="margin:0 0 18px;padding:16px 18px;border:1px solid #e2e8f0;border-radius:12px;font-size:15px;line-height:1.7;color:#0f172a">${textToHtml(settings.payment || '[Payment details go here]')}</div>`) +
            details(cohort) +
            (payLink ? '' : p('After you pay, reply to this email with the payment reference so we can match it to you quickly.')) +
            emailContact({ email: 'admin@gennoor.com' }),
          `One step left: ${rupees(WEEKEND.fee)} to confirm your seat for ${cohort.label}.`
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
  person: { name?: string; fee: number },
  cohort: Cohort,
  paymentId: string,
  settings: CohortSettings = {},
  from = 'webinar@gennoor.com'
): { subject: string; html: string } {
  const first = escapeHtml((person.name || '').trim().split(/\s+/)[0] || '')
  return {
    subject: `Payment received: your seat is confirmed, ${WEEKEND.name}`,
    html: emailShell(
      emailTitle(first ? `You are confirmed, ${first}.` : 'You are confirmed.', `We have received your payment. Your seat on the ${WEEKEND.name} is confirmed.`) +
        emailDetails('Your receipt', [
          ['Paid', rupees(person.fee)],
          ['For', `${WEEKEND.name}, ${cohort.label}`],
          ['Payment reference', paymentId],
          ['Paid on', new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' })],
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
      { preheader: `${rupees(person.fee)} received. Your seat for ${cohort.label} is confirmed.`, senderEmail: from }
    ),
  }
}
