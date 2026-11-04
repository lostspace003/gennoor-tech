import { BlobServiceClient } from '@azure/storage-blob'
import { randomBytes } from 'crypto'
import { sendEmail } from '@/lib/email-service'
import { escapeHtml } from '@/lib/escape-html'
import { siteUrl } from '@/lib/tech-call-mail'

// Events created from the admin: public registration page -> Teams join link by email -> LinkedIn event + post.
// Stored as one JSON blob next to the CRM data (same pattern as the rest of the site).
const CONTAINER = 'crm-data'
const BLOB = 'events.json'

export type EventKind = 'webinar' | 'workshop' | 'live-session' | 'networking'
export const EVENT_KINDS: { id: EventKind; label: string; hint: string }[] = [
  { id: 'webinar', label: 'Webinar', hint: 'One-to-many talk with Q&A' },
  { id: 'workshop', label: 'Workshop', hint: 'Hands-on, smaller group' },
  { id: 'live-session', label: 'Live session', hint: 'Walkthrough or demo' },
  { id: 'networking', label: 'Networking', hint: 'Community meetup' },
]

export interface Registration { name: string; email: string; company?: string; at: string }
export interface SiteEvent {
  id: string
  kind: EventKind
  title: string
  description: string
  startsAt: string // ISO
  durationMinutes: number
  capacity?: number
  teamsJoinUrl?: string
  teamsEventId?: string
  linkedinEventId?: string
  linkedinPostUrn?: string
  cancelled?: boolean
  /** An editor-uploaded cover image is stored at assets key events/<id>. */
  hasImage?: boolean
  createdAt: string
  registrations: Registration[]
}

function blob() {
  const conn = process.env.AZURE_STORAGE_CONNECTION_STRING
  if (!conn) throw new Error('AZURE_STORAGE_CONNECTION_STRING not configured')
  return BlobServiceClient.fromConnectionString(conn).getContainerClient(CONTAINER).getBlockBlobClient(BLOB)
}

async function read(): Promise<{ events: SiteEvent[]; etag?: string }> {
  try {
    const d = await blob().download()
    const chunks: Buffer[] = []
    for await (const c of d.readableStreamBody as AsyncIterable<Buffer>) chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c))
    return { events: JSON.parse(Buffer.concat(chunks).toString('utf-8')), etag: d.etag }
  } catch (e: any) {
    if (e?.statusCode === 404) return { events: [] }
    throw e
  }
}

export const getEvents = async () => (await read()).events
export const getEvent = async (id: string) => (await read()).events.find((e) => e.id === id) || null

/** Read-modify-write with ETag retry so two registrations at once never drop each other. */
export async function mutateEvents<T>(fn: (events: SiteEvent[]) => T): Promise<T> {
  let last: unknown
  for (let i = 0; i < 4; i++) {
    const { events, etag } = await read()
    const out = fn(events)
    try {
      const conn = process.env.AZURE_STORAGE_CONNECTION_STRING!
      await BlobServiceClient.fromConnectionString(conn).getContainerClient(CONTAINER).createIfNotExists()
      const body = JSON.stringify(events)
      await blob().upload(body, Buffer.byteLength(body), {
        blobHTTPHeaders: { blobContentType: 'application/json' },
        conditions: etag ? { ifMatch: etag } : undefined,
      })
      return out
    } catch (e: any) {
      if (e?.statusCode === 412 || e?.statusCode === 409) { last = e; continue }
      throw e
    }
  }
  throw last
}

export const newEventId = (title: string) =>
  `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'event'}-${randomBytes(3).toString('hex')}`

/** What a visitor may see: never the Teams link, other people's registrations, or ids of LinkedIn objects. */
export const publicView = (e: SiteEvent) => ({
  id: e.id, kind: e.kind, title: e.title, description: e.description, startsAt: e.startsAt, durationMinutes: e.durationMinutes,
  full: !!e.capacity && e.registrations.length >= e.capacity, cancelled: !!e.cancelled, hasImage: !!e.hasImage,
})

export const eventUrl = (e: Pick<SiteEvent, 'id'>) => `${siteUrl()}/events/${e.id}`

const icsDate = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
const icsText = (s: string) => s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/[,;]/g, (m) => `\\${m}`)

export function buildIcs(e: SiteEvent): string {
  const start = new Date(e.startsAt)
  const end = new Date(start.getTime() + e.durationMinutes * 60_000)
  return [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Gennoor Tech//Events//EN', 'METHOD:PUBLISH', 'BEGIN:VEVENT',
    `UID:${e.id}@gennoor.com`, `DTSTAMP:${icsDate(new Date())}`, `DTSTART:${icsDate(start)}`, `DTEND:${icsDate(end)}`,
    `SUMMARY:${icsText(e.title)}`,
    `DESCRIPTION:${icsText(`${e.description}\n\nJoin on Microsoft Teams: ${e.teamsJoinUrl || eventUrl(e)}`)}`,
    `LOCATION:${icsText(e.teamsJoinUrl || 'Online (Microsoft Teams)')}`, `URL:${e.teamsJoinUrl || eventUrl(e)}`,
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n')
}

/** Confirmation to the attendee: Teams join link, calendar file and a one-click Google Calendar link. */
export async function sendRegistrationEmail(e: SiteEvent, r: Registration) {
  const start = new Date(e.startsAt)
  const when = start.toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short', timeZone: 'Asia/Kolkata' }) + ' IST'
  const gcal = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(e.title)}&dates=${icsDate(start)}/${icsDate(new Date(start.getTime() + e.durationMinutes * 60_000))}&details=${encodeURIComponent(`Join: ${e.teamsJoinUrl || eventUrl(e)}`)}`
  const join = e.teamsJoinUrl
    ? `<p style="margin:0 0 18px"><a href="${escapeHtml(e.teamsJoinUrl)}" style="background:#0071e3;color:#fff;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:600">Join on Microsoft Teams</a></p>`
    : '<p style="margin:0 0 18px;color:#6e6e73">The Teams link will be sent to you before the session.</p>'
  await sendEmail({
    to: r.email,
    from: process.env.EMAIL_FROM_WEBINAR || 'webinar@gennoor.com',
    fromName: 'Gennoor Tech Events',
    subject: `You're registered: ${e.title}`,
    html: `<div style="font-family:system-ui,'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;color:#1d1d1f">
      <h2 style="margin:0 0 12px">You're registered</h2>
      <p>Hi ${escapeHtml(r.name.split(' ')[0])}, you're confirmed for <strong>${escapeHtml(e.title)}</strong>.</p>
      <p style="color:#6e6e73">${escapeHtml(when)} &middot; ${e.durationMinutes} minutes</p>
      ${join}
      <p><a href="${gcal}" style="color:#0071e3">Add to Google Calendar</a> &middot; the attached file works with Outlook and Apple Calendar.</p>
      <p style="color:#6e6e73;font-size:13px">Questions? Reply to this email. &mdash; The Gennoor Team</p></div>`,
    attachments: [{ filename: 'event.ics', content: buildIcs(e), contentType: 'text/calendar' }],
  })
}
