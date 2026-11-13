import { escapeHtml } from '@/lib/escape-html'
import { emailShell, emailButton } from '@/lib/crm/email-theme'
import type { DigestPost } from './newsletter'

/**
 * The weekly email itself: the week's posts, newest first. Fixed words and the posts' own titles and
 * summaries; no model writes anything here, so what goes out is exactly what is on the blog.
 *
 * It is a light email in the site's one frame (emailShell): the newest post with its picture, the others
 * as short rows, one button, and a working "Unsubscribe" at the foot. Email apps remove SVG and scripts, so the
 * picture is the post's own share picture (a PNG the site already draws at /og/blog/<slug>).
 * Rules that hold here as everywhere: nothing is called "free", no prices, no customer names.
 */

const SITE = 'https://www.gennoor.com'
const postUrl = (slug: string) => `${SITE}/resources/blog/${slug}`

/** Cuts a summary at a word, so a line never ends in half a word. */
export function brief(text: string, max = 170): string {
  const flat = (text || '').replace(/\s+/g, ' ').trim()
  if (flat.length <= max) return flat
  const cut = flat.slice(0, max)
  return `${cut.slice(0, Math.max(cut.lastIndexOf(' '), max - 30)).replace(/[\s,;:.]+$/, '')}…`
}

/** "13 to 19 November 2026", from the issue's Thursday back over its seven days. */
export function weekWords(issue: string): string {
  const end = new Date(`${issue}T00:00:00Z`), start = new Date(end.getTime() - 6 * 86_400_000)
  const month = (d: Date) => d.toLocaleDateString('en-GB', { month: 'long', timeZone: 'UTC' })
  const sameMonth = start.getUTCMonth() === end.getUTCMonth()
  return `${start.getUTCDate()}${sameMonth ? '' : ` ${month(start)}`} to ${end.getUTCDate()} ${month(end)} ${end.getUTCFullYear()}`
}

export function digestSubject(posts: DigestPost[]): string {
  const title = posts[0]?.title || 'New posts'
  const more = posts.length - 1
  return more > 0 ? `${brief(title, 78)} (and ${more} more this week)` : brief(title, 100)
}

const label = (p: DigestPost) => `${escapeHtml(p.category)} &middot; ${escapeHtml(p.readTime)}`

/** The whole email for one reader. `unsubscribeUrl` is their own link (see src/lib/unsubscribe.ts). */
export function digestEmail(posts: DigestPost[], issue: string, unsubscribeUrl: string): { subject: string; html: string } {
  const [lead, ...rest] = posts
  const count = posts.length === 1 ? 'One new post' : `${posts.length} new posts`
  const body = `
    <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:1.6px;color:#b45309;text-transform:uppercase">This week on the blog</p>
    <h1 style="margin:0 0 8px;font-size:24px;line-height:1.25;color:#0f172a;font-weight:800;letter-spacing:-0.01em">${count}, ${weekWords(issue)}</h1>
    <p style="margin:0 0 22px;font-size:15px;line-height:1.6;color:#475569">Each one is written for a manager, not a specialist, and takes a few minutes to read.</p>

    <a href="${postUrl(lead.slug)}" style="display:block;text-decoration:none"><img src="${SITE}/og/blog/${lead.slug}" alt="${escapeHtml(lead.title)}" width="560" style="display:block;border:0;width:100%;max-width:100%;height:auto;border-radius:12px"/></a>
    <p style="margin:14px 0 4px;font-size:11.5px;font-weight:700;letter-spacing:1.2px;color:#64748b;text-transform:uppercase">${label(lead)}</p>
    <a href="${postUrl(lead.slug)}" style="display:block;margin:0 0 6px;font-size:20px;line-height:1.3;font-weight:800;color:#0f172a;text-decoration:none">${escapeHtml(lead.title)}</a>
    <p style="margin:0 0 6px;font-size:15px;line-height:1.6;color:#475569">${escapeHtml(brief(lead.excerpt, 230))}</p>
    <p style="margin:0 0 4px"><a href="${postUrl(lead.slug)}" style="font-size:14.5px;font-weight:700;color:#2563EB;text-decoration:none">Read the post &rarr;</a></p>
    ${rest.length ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:22px 0 0">${rest
      .map(
        (p) => `<tr><td style="padding:16px 0;border-top:1px solid #e2e8f0">
        <p style="margin:0 0 4px;font-size:11.5px;font-weight:700;letter-spacing:1.2px;color:#64748b;text-transform:uppercase">${label(p)}</p>
        <a href="${postUrl(p.slug)}" style="display:block;margin:0 0 4px;font-size:16.5px;line-height:1.35;font-weight:700;color:#0f172a;text-decoration:none">${escapeHtml(p.title)}</a>
        <p style="margin:0;font-size:14.5px;line-height:1.55;color:#475569">${escapeHtml(brief(p.excerpt, 150))} <a href="${postUrl(p.slug)}" style="font-weight:700;color:#2563EB;text-decoration:none;white-space:nowrap">Read &rarr;</a></p>
      </td></tr>`
      )
      .join('')}</table>` : ''}
    ${emailButton('See all posts', `${SITE}/resources/blog`)}
    <p style="margin:18px 0 0;padding-top:16px;border-top:1px solid #e2e8f0;font-size:13px;line-height:1.6;color:#64748b">You get this once a week, on Thursday, because you asked for new posts by email on gennoor.com.</p>`
  return {
    subject: digestSubject(posts),
    html: emailShell(body, { preheader: rest.length ? `Also this week: ${brief(rest[0].title, 90)}` : brief(lead.excerpt, 110), senderEmail: 'info@gennoor.com', unsubscribeUrl }),
  }
}
