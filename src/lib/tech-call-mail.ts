// Visitor-facing tech-call emails, shared by the admin approve action, the "ask for a different time"
// action and the visitor's reply, so the wording and the Teams button stay identical everywhere.
import { escapeHtml } from '@/lib/escape-html'
import { SLOT_MINUTES } from '@/lib/tech-call'

export const siteUrl = () => process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gennoor.com'

const wrap = (inner: string) => `<div style="font-family:Segoe UI,Arial,sans-serif;max-width:560px">${inner}<p>Gennoor Tech</p></div>`
const button = (href: string, label: string, bg: string, fg = '#fff', border = bg) =>
  `<a href="${escapeHtml(href)}" style="background:${bg};color:${fg};border:1px solid ${border};padding:10px 18px;border-radius:10px;text-decoration:none;display:inline-block;margin:0 8px 8px 0">${label}</a>`

export function confirmedEmailHtml(o: { first: string; theirs: string; joinUrl?: string; changed?: boolean }): string {
  return wrap(`
    <p>Hi ${escapeHtml(o.first)},</p>
    <p>${o.changed ? 'Thank you for confirming the new time. Your tech call is now set for' : 'Your tech call is confirmed for'} <strong>${escapeHtml(o.theirs)}</strong> (${SLOT_MINUTES} minutes).</p>
    ${o.joinUrl ? `<p>${button(o.joinUrl, 'Join on Microsoft Teams', '#0071e3')}</p>` : ''}
    <p>${o.changed ? 'An updated calendar invite' : 'A calendar invite'} from admin@gennoor.com is also in your inbox.</p>`)
}

/** We ask the visitor to move the call. `current` is the time they hold now (requested or already confirmed). */
export function proposalEmailHtml(o: { first: string; current: string; confirmed: boolean; proposed: string; message?: string; yesUrl: string; noUrl: string }): string {
  return wrap(`
    <p>Hi ${escapeHtml(o.first)},</p>
    <p>We would like to suggest a different time for your tech call.</p>
    ${o.message ? `<p style="padding:10px 14px;background:#f5f5f7;border-radius:10px;white-space:pre-wrap">${escapeHtml(o.message)}</p>` : ''}
    <table role="presentation" style="border-collapse:collapse;margin:8px 0 14px">
      <tr><td style="padding:6px 14px 6px 0;color:#6e6e73">${o.confirmed ? 'Current time' : 'You asked for'}</td><td>${escapeHtml(o.current)}</td></tr>
      <tr><td style="padding:6px 14px 6px 0;color:#6e6e73">Suggested time</td><td><strong>${escapeHtml(o.proposed)}</strong></td></tr>
    </table>
    <p>Does the suggested time work for you?</p>
    <p>${button(o.yesUrl, 'Yes, confirm the new time', '#0071e3')}${button(o.noUrl, 'No, this does not work', '#fff', '#1d1d1f', '#c7c7cc')}</p>
    <p style="color:#6e6e73;font-size:13px">Once you confirm, you receive an updated invite with the Microsoft Teams link. Until then ${o.confirmed ? 'your current time stays as it is' : 'your request stays pending'}.</p>`)
}
