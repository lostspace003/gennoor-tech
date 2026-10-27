import { NextRequest, NextResponse } from 'next/server'
import { saveEvent } from '@/lib/azure-storage'
import { rateLimit, clientIp } from '@/lib/rate-limit'
import { auth } from '@/lib/auth'

// Behaviour events from BehaviorTracker: scroll_depth, cta_click, form_abandon.
// Whitelisted types and metadata keys only; internal traffic is dropped, never stored.
const TYPES = new Set(['scroll_depth', 'cta_click', 'form_abandon'])
const META_KEYS: Record<string, string[]> = {
  scroll_depth: ['depth'],
  cta_click: ['label', 'target_url'],
  form_abandon: ['last_field', 'form'],
}
const ID_RE = /^[a-zA-Z0-9-]{8,64}$/

export async function POST(request: NextRequest) {
  try {
    if (!rateLimit(`track-event:${clientIp(request.headers)}`, 120, 60_000)) {
      return NextResponse.json({ ok: false }, { status: 429 })
    }
    const body = await request.json()
    const type = String(body.type)
    const page = String(body.page ?? '').slice(0, 300)
    if (!TYPES.has(type) || !ID_RE.test(String(body.visitorId))) return NextResponse.json({ ok: false }, { status: 400 })

    const host = (request.headers.get('host') || '').split(':')[0]
    if (host === 'localhost' || host === '127.0.0.1' || page.startsWith('/admin') || page.startsWith('/studio')) {
      return NextResponse.json({ ok: true, skipped: 'internal' })
    }
    if ((await auth().catch(() => null))?.user?.email) return NextResponse.json({ ok: true, skipped: 'internal' })

    const meta: Record<string, unknown> = {}
    for (const k of META_KEYS[type]) {
      const v = body.meta?.[k]
      if (typeof v === 'number') meta[k] = v
      else if (typeof v === 'string') meta[k] = v.slice(0, 300)
    }

    await saveEvent({ type, page, visitorId: String(body.visitorId), sessionId: ID_RE.test(String(body.sessionId)) ? String(body.sessionId) : '', meta })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('track-event error:', error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
