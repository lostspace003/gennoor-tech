import { ConfidentialClientApplication } from '@azure/msal-node'
import { Client } from '@microsoft/microsoft-graph-client'

// Microsoft Graph access for the CRM: reading replies in the admin mailbox
// and scheduling Teams meetings. Uses the same app credentials that already
// power Sent-Items sync in email-service.ts.
const MAILBOX = process.env.OUTLOOK_SENDER_MAILBOX || 'admin@gennoor.com'

export function graphConfigured(): boolean {
  return Boolean(
    process.env.MS_GRAPH_TENANT_ID && process.env.MS_GRAPH_CLIENT_ID && process.env.MS_GRAPH_CLIENT_SECRET
  )
}

export async function getGraphClient(): Promise<Client> {
  const tenantId = process.env.MS_GRAPH_TENANT_ID
  const clientId = process.env.MS_GRAPH_CLIENT_ID
  const clientSecret = process.env.MS_GRAPH_CLIENT_SECRET
  if (!tenantId || !clientId || !clientSecret) {
    throw new Error('Microsoft Graph is not configured (MS_GRAPH_TENANT_ID / MS_GRAPH_CLIENT_ID / MS_GRAPH_CLIENT_SECRET)')
  }
  const cca = new ConfidentialClientApplication({
    auth: { clientId, authority: `https://login.microsoftonline.com/${tenantId}`, clientSecret },
  })
  const token = await cca.acquireTokenByClientCredential({
    scopes: ['https://graph.microsoft.com/.default'],
  })
  if (!token?.accessToken) throw new Error('Failed to acquire Graph token')
  return Client.init({ authProvider: (done) => done(null, token.accessToken) })
}

export interface InboundMessage {
  id: string
  from: string
  fromName: string
  subject: string
  preview: string
  body: string
  receivedAt: string
  isRead: boolean
}

// Recent messages received by the admin mailbox, optionally filtered to one
// sender. Requires Mail.Read application permission on the Graph app.
export async function listInboundMessages(fromEmail?: string, top = 25): Promise<InboundMessage[]> {
  const client = await getGraphClient()
  let request = client
    .api(`/users/${MAILBOX}/mailFolders/inbox/messages`)
    .top(top)
    .orderby('receivedDateTime desc')
    .select('id,from,subject,bodyPreview,body,receivedDateTime,isRead')
  if (fromEmail) {
    request = client
      .api(`/users/${MAILBOX}/mailFolders/inbox/messages`)
      .filter(`from/emailAddress/address eq '${fromEmail.replace(/'/g, "''")}'`)
      .top(top)
      .select('id,from,subject,bodyPreview,body,receivedDateTime,isRead')
  }
  const result = await request.get()
  return (result.value || []).map((m: any) => ({
    id: m.id,
    from: m.from?.emailAddress?.address || '',
    fromName: m.from?.emailAddress?.name || '',
    subject: m.subject || '',
    preview: m.bodyPreview || '',
    body: m.body?.content || '',
    receivedAt: m.receivedDateTime || '',
    isRead: Boolean(m.isRead),
  }))
}

export interface MeetingRequest {
  subject: string
  attendees: Array<{ email: string; name?: string }>
  start: string // ISO datetime
  durationMinutes: number
  agenda?: string
}

// Creates a Teams meeting on the admin mailbox calendar and invites the lead
// plus any extra attendees. Requires Calendars.ReadWrite application permission.
export async function createTeamsMeeting(req: MeetingRequest): Promise<{ id: string; joinUrl?: string; webLink?: string }> {
  const client = await getGraphClient()
  const start = new Date(req.start)
  const end = new Date(start.getTime() + req.durationMinutes * 60_000)
  const event = await client.api(`/users/${MAILBOX}/events`).post({
    subject: req.subject,
    body: { contentType: 'HTML', content: req.agenda || 'Meeting scheduled via Gennoor CRM.' },
    start: { dateTime: start.toISOString(), timeZone: 'UTC' },
    end: { dateTime: end.toISOString(), timeZone: 'UTC' },
    attendees: req.attendees
      .filter((a) => a.email)
      .map((a) => ({
        emailAddress: { address: a.email, name: a.name || a.email },
        type: 'required' as const,
      })),
    isOnlineMeeting: true,
    onlineMeetingProvider: 'teamsForBusiness',
  })
  return {
    id: event.id,
    joinUrl: event.onlineMeeting?.joinUrl,
    webLink: event.webLink,
  }
}

// Single event lookup — used for permission checks before update/cancel
export async function getMeeting(eventId: string): Promise<{ id: string; subject: string; attendees: string[]; body: string } | null> {
  const client = await getGraphClient()
  try {
    const e = await client.api(`/users/${MAILBOX}/events/${eventId}`).select('id,subject,attendees,body').get()
    return {
      id: e.id,
      subject: e.subject || '',
      attendees: (e.attendees || []).map((a: any) => a.emailAddress?.address).filter(Boolean),
      body: e.body?.content || '',
    }
  } catch {
    return null
  }
}

// Reschedule/edit a meeting. Attendees automatically receive the updated
// invite by email — so the change lands in the lead's thread too.
export async function updateMeeting(eventId: string, changes: { start?: string; durationMinutes?: number; subject?: string; comment?: string }): Promise<void> {
  const client = await getGraphClient()
  const patch: Record<string, unknown> = {}
  if (changes.subject) patch.subject = changes.subject
  if (changes.start) {
    const start = new Date(changes.start)
    const end = new Date(start.getTime() + (changes.durationMinutes || 30) * 60_000)
    patch.start = { dateTime: start.toISOString(), timeZone: 'UTC' }
    patch.end = { dateTime: end.toISOString(), timeZone: 'UTC' }
  }
  if (changes.comment) {
    // Prepend the comment so the original agenda stays in the invite
    const existing = await getMeeting(eventId)
    patch.body = { contentType: 'HTML', content: `<p><strong>Update:</strong> ${changes.comment}</p>${existing?.body || ''}` }
  }
  if (Object.keys(patch).length === 0) return
  await client.api(`/users/${MAILBOX}/events/${eventId}`).patch(patch)
}

// Cancel a meeting with an optional message — attendees get the cancellation email.
export async function cancelMeeting(eventId: string, comment?: string): Promise<void> {
  const client = await getGraphClient()
  await client.api(`/users/${MAILBOX}/events/${eventId}/cancel`).post({ comment: comment || 'Cancelled via Gennoor CRM.' })
}

export interface UpcomingMeeting {
  id: string
  subject: string
  start: string
  end: string
  attendees: string[]
  joinUrl?: string
  webLink?: string
}

// Upcoming calendar events on the admin mailbox — the CRM scheduler view.
export async function listUpcomingMeetings(days = 30): Promise<UpcomingMeeting[]> {
  const client = await getGraphClient()
  const now = new Date().toISOString()
  const until = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString()
  const result = await client
    .api(`/users/${MAILBOX}/calendarView`)
    .query({ startDateTime: now, endDateTime: until })
    .top(50)
    .orderby('start/dateTime')
    .select('id,subject,start,end,attendees,onlineMeeting,webLink')
    .get()
  return (result.value || []).map((e: any) => ({
    id: e.id,
    subject: e.subject || '',
    start: e.start?.dateTime ? `${e.start.dateTime}Z`.replace(/Z+$/, 'Z') : '',
    end: e.end?.dateTime ? `${e.end.dateTime}Z`.replace(/Z+$/, 'Z') : '',
    attendees: (e.attendees || []).map((a: any) => a.emailAddress?.address).filter(Boolean),
    joinUrl: e.onlineMeeting?.joinUrl,
    webLink: e.webLink,
  }))
}
