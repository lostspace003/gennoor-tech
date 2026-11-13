import { blogPostsMeta } from '@/data/blog-posts'
import { getEmailLogs, getEnquiries } from '@/lib/azure-storage'
import { sendEmail } from '@/lib/email-service'
import { readBlob, writeBlob } from '@/lib/social/studio'
import { unsubscribeUrl } from '@/lib/unsubscribe'
import { digestEmail } from './newsletter-email'
import { issueFor, issueTime, newsletterTick, nextIssue, postsFor, subscribed, PER_HOUR, PER_TICK, type DigestPost, type Mark, type NewsletterDeps, type NewsletterState } from './newsletter'

/**
 * The weekly email of new posts, wired to the real things: the sign-ups in the Enquiries table, the email
 * service, and a small file that remembers which issue went to whom. Server only. The rules are in
 * ./newsletter.ts; read that first.
 */

const STATE = 'newsletter/state.json'
/** The same address the "You're subscribed" email came from, so the reader already knows the sender. */
const FROM = process.env.EMAIL_FROM_INFO || 'info@gennoor.com'
/**
 * The email service allows the whole site about 100 emails an hour. When the site has already sent this many
 * in the last hour (sign-in codes, receipts, the CRM), the weekly email waits for the next heartbeat.
 */
const SITE_HOURLY_CEILING = 70

export async function loadNewsletter(): Promise<NewsletterState | null> {
  const file = await readBlob(STATE)
  if (!file) return null
  try { return JSON.parse(file.toString('utf-8')) as NewsletterState } catch { return null }
}

const marks = (rows: Array<Record<string, any>>): Mark[] => rows.map((r) => ({ email: String(r.email || ''), at: String(r.createdAt || r.subscribedAt || r.unsubscribedAt || '') }))

async function signUps() {
  const [subs, outs] = await Promise.all([getEnquiries('NewsletterSubscription', 3650), getEnquiries('Unsubscribe', 3650)])
  return { subs, outs, people: subscribed(marks(subs), marks(outs)) }
}

/** How many more emails the site as a whole can still send this hour. */
async function siteRoom(): Promise<number> {
  const since = Date.now() - 3_600_000
  const lastHour = (await getEmailLogs(1)).filter((r) => r.status === 'sent' && new Date(r.createdAt).getTime() >= since).length
  return Math.max(0, SITE_HOURLY_CEILING - lastHour)
}

async function sendIssue(email: string, issue: string, posts: DigestPost[]): Promise<boolean> {
  const link = unsubscribeUrl(email)
  const mail = digestEmail(posts, issue, link)
  // unsubscribeUrl also sets the one-click headers Gmail and Outlook expect from a sender of many emails
  const result = await sendEmail({ to: email, from: FROM, fromName: 'Gennoor Tech', subject: mail.subject, html: mail.html, unsubscribeUrl: link })
  return result.success
}

export function liveNewsletterDeps(): NewsletterDeps {
  return {
    now: () => Date.now(),
    load: loadNewsletter,
    save: (state) => writeBlob(STATE, JSON.stringify(state), 'application/json'),
    posts: () => blogPostsMeta,
    people: async () => (await signUps()).people,
    room: siteRoom,
    send: sendIssue,
  }
}

/** For the heartbeat. */
export const weeklyEmailTick = () => newsletterTick(liveNewsletterDeps())

/** Everything the admin page shows. `me` is the signed-in person: the preview carries their own unsubscribe link. */
export async function newsletterStatus(me: string, now = Date.now()) {
  const [state, { subs, outs, people }] = await Promise.all([loadNewsletter(), signUps()])
  const due = issueFor(now)
  // The email that goes next: the one going out now, else this week's if the heartbeat has not started it yet, else next Thursday's
  const upcoming = state?.current?.issue || (state && !state.history.some((h) => h.issue === due) ? due : nextIssue(now))
  const sentBefore = (state?.history || []).flatMap((h) => h.slugs)
  const posts = state?.current ? state.current.slugs.map((s) => blogPostsMeta.find((p) => p.slug === s)).filter((p): p is (typeof blogPostsMeta)[number] => !!p) : postsFor(upcoming, blogPostsMeta, sentBefore)
  const preview = posts.length ? digestEmail(posts, upcoming, unsubscribeUrl(me)) : null
  const since = new Map<string, { at: string; source: string }>()
  for (const r of subs) {
    const e = String(r.email || '').trim().toLowerCase()
    const at = String(r.createdAt || '')
    if (e && (!since.has(e) || at < since.get(e)!.at)) since.set(e, { at, source: String(r.source || '') })
  }
  return {
    people: people.map((email) => ({ email, since: since.get(email)?.at || '', source: since.get(email)?.source || '' })).reverse(),
    signedUp: since.size,
    stopped: new Set(outs.map((r) => String(r.email || '').trim().toLowerCase()).filter(Boolean)).size,
    upcoming: { issue: upcoming, goesAt: new Date(issueTime(upcoming)).toISOString(), posts: posts.map((p) => ({ slug: p.slug, title: p.title, date: p.date })) },
    current: state?.current ? { issue: state.current.issue, sent: state.current.sent.length, waiting: people.filter((e) => !state.current!.sent.some((s) => s.email === e)).length, startedAt: state.current.startedAt } : null,
    history: (state?.history || []).filter((h) => !/before the weekly email existed/.test(h.note || '')),
    preview,
    limits: { perHour: PER_HOUR, perTick: PER_TICK },
    setUp: !!state,
  }
}

/** Sends the next email, as it stands, to the person who pressed the button. To nobody else. */
export async function sendTestTo(me: string): Promise<{ ok: boolean; error?: string }> {
  const status = await newsletterStatus(me)
  if (!status.preview) return { ok: false, error: 'There is no new post for the next email yet, so there is nothing to send.' }
  const result = await sendEmail({ to: me, from: FROM, fromName: 'Gennoor Tech', subject: `[Test] ${status.preview.subject}`, html: status.preview.html })
  return result.success ? { ok: true } : { ok: false, error: result.error || 'The email service did not take it.' }
}
