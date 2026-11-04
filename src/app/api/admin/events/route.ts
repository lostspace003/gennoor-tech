import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { EVENT_KINDS, eventUrl, getEvents, mutateEvents, newEventId, type EventKind, type SiteEvent } from '@/lib/events'
import { createTeamsMeeting, graphConfigured } from '@/lib/crm/graph'
import { announceEvent, publishEventToLinkedIn, recordPosted, schedule, ai, NO_I } from '@/lib/linkedin-queue'

export const dynamic = 'force-dynamic'
export const maxDuration = 90

export async function GET(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const events = (await getEvents()).sort((a, b) => b.startsAt.localeCompare(a.startsAt))
  return NextResponse.json({ kinds: EVENT_KINDS, graph: graphConfigured(), events: events.map((e) => ({ ...e, url: eventUrl(e) })) })
}

/** { action: 'draft' | 'create' | 'linkedin' | 'announce' | 'cancel' | 'delete', ... } */
export async function POST(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const b = await req.json().catch(() => ({}))
  try {
    if (b.action === 'draft') {
      const idea = String(b.idea || '').trim()
      if (!idea) return NextResponse.json({ error: 'Describe the event in a line or two.' }, { status: 400 })
      const raw = await ai(
        `You write event listings for Gennoor Tech, an enterprise AI and Microsoft training company in India. ${NO_I} Reply as JSON only: {"title": string (max 90 chars), "description": string (60-120 words: who it is for, what attendees will learn, 3 short bullet lines starting with "- ")}`,
        `Event type: ${b.kind || 'webinar'}\nIdea: ${idea}`,
      )
      const j = JSON.parse(raw.slice(raw.indexOf('{'), raw.lastIndexOf('}') + 1))
      return NextResponse.json({ title: String(j.title || ''), description: String(j.description || '') })
    }

    if (b.action === 'create') {
      const title = String(b.title || '').trim().slice(0, 120)
      const startsAt = new Date(String(b.startsAt || ''))
      const duration = Math.min(480, Math.max(15, Number(b.durationMinutes) || 60))
      if (!title || isNaN(startsAt.getTime()) || startsAt.getTime() < Date.now()) {
        return NextResponse.json({ error: 'A title and a start time in the future are required.' }, { status: 400 })
      }
      const kind: EventKind = EVENT_KINDS.some((k) => k.id === b.kind) ? b.kind : 'webinar'
      const ev: SiteEvent = {
        id: newEventId(title), kind, title, description: String(b.description || '').slice(0, 3000),
        startsAt: startsAt.toISOString(), durationMinutes: duration,
        ...(Number(b.capacity) > 0 ? { capacity: Math.floor(Number(b.capacity)) } : {}),
        createdAt: new Date().toISOString(), registrations: [],
      }
      let teamsNote = ''
      if (b.teams !== false && graphConfigured()) {
        try {
          const m = await createTeamsMeeting({ subject: title, attendees: [], start: ev.startsAt, durationMinutes: duration, agenda: ev.description.replace(/\n/g, '<br>') })
          ev.teamsJoinUrl = m.joinUrl
          ev.teamsEventId = m.id
        } catch (e: any) { teamsNote = `Event saved, but the Teams link could not be created: ${e?.message || 'Graph error'}` }
      } else if (b.teams !== false) teamsNote = 'Event saved, but Microsoft Graph is not configured so no Teams link was created.'
      await mutateEvents((events) => { events.push(ev) })
      return NextResponse.json({ ok: true, event: { ...ev, url: eventUrl(ev) }, note: teamsNote })
    }

    const find = async () => (await getEvents()).find((e) => e.id === String(b.id))
    const ev = await find()
    if (!ev) return NextResponse.json({ error: 'Event not found.' }, { status: 404 })

    const as = b.as === 'member' ? 'member' : 'organization'
    if (b.action === 'linkedin') {
      if (b.at) { const job = await schedule('event-linkedin', 'organization', ev.title, { eventId: ev.id }, b.at); return NextResponse.json({ ok: true, scheduled: job.at }) }
      const r = await publishEventToLinkedIn(ev)
      await recordPosted('event-linkedin', 'organization', ev.title, r.postUrn, { eventId: ev.id })
      return NextResponse.json({ ok: true, ...r })
    }

    if (b.action === 'announce') {
      if (b.at) { const job = await schedule('event-announce', as, ev.title, { eventId: ev.id }, b.at); return NextResponse.json({ ok: true, scheduled: job.at }) }
      const r = await announceEvent(ev, as)
      await recordPosted('event-announce', as, ev.title, r.urn, { eventId: ev.id })
      return NextResponse.json({ ok: true, ...r })
    }

    if (b.action === 'cancel' || b.action === 'delete') {
      await mutateEvents((events) => {
        if (b.action === 'delete') { const i = events.findIndex((x) => x.id === ev.id); if (i >= 0) events.splice(i, 1) }
        else { const e = events.find((x) => x.id === ev.id); if (e) e.cancelled = true }
      })
      return NextResponse.json({ ok: true })
    }
    return NextResponse.json({ error: 'Unknown action.' }, { status: 400 })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed.' }, { status: 502 })
  }
}
