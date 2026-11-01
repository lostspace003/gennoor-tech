import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { getLinkedInState, publishPost, updatePostText } from '@/lib/linkedin'
import { parseScheduleAt } from '@/lib/scheduled-publish'
import { getDraft, getImage, getMotion, mutateDraft, prepareForPublish } from '@/lib/social/studio'

export const dynamic = 'force-dynamic'
export const maxDuration = 120

/** Pushes an approved draft (text + image) to LinkedIn as the member and/or the company page. */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const { id } = await params
  const b = await req.json().catch(() => ({}))
  if (b.cancelSchedule === true) {
    const x = await mutateDraft(id, d => { d.scheduled = undefined })
    return x ? NextResponse.json({ cancelled: true }) : NextResponse.json({ error: 'Not found.' }, { status: 404 })
  }
  const targets: ('member' | 'organization')[] = (Array.isArray(b.as) ? b.as : []).filter((x: string) => x === 'member' || x === 'organization')
  if (!targets.length) return NextResponse.json({ error: 'Choose where to post.' }, { status: 400 })

  const d = await getDraft(id)
  if (!d) return NextResponse.json({ error: 'Not found.' }, { status: 404 })
  if (d.status === 'draft') return NextResponse.json({ error: 'Approve the draft before publishing.' }, { status: 409 })
  if (d.kind === 'poll' && (!d.poll?.question.trim() || (d.poll?.options.length ?? 0) < 2)) {
    return NextResponse.json({ error: 'A poll needs a question and at least 2 options.' }, { status: 400 })
  }
  if (!d.text.trim()) return NextResponse.json({ error: 'The post is empty.' }, { status: 400 })

  if (b.scheduleAt) {
    let at: Date
    try { at = parseScheduleAt(b.scheduleAt) } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 400 }) }
    if (b.mode === 'update') return NextResponse.json({ error: 'Updating a live post cannot be scheduled.' }, { status: 400 })
    const media: 'gif' | 'still' = b.media === 'still' ? 'still' : d.motion ? 'gif' : 'still'
    const text = await prepareForPublish(d.text, id)
    await mutateDraft(id, x => { x.text = text; x.scheduled = { at: at.toISOString(), as: targets, media, state: 'pending', tries: 0 } })
    return NextResponse.json({ scheduled: { at: at.toISOString(), as: targets } })
  }
  const s = await getLinkedInState()
  if (!s.accessToken || !s.expiresAt || new Date(s.expiresAt) < new Date()) {
    return NextResponse.json({ error: 'LinkedIn is not connected or the token expired. Reconnect on the LinkedIn page.' }, { status: 409 })
  }
  // media: 'gif' (default for motion graphics) | 'still' (the AI image, or nothing).
  const media: 'gif' | 'still' = b.media === 'still' ? 'still' : d.motion ? 'gif' : 'still'
  const still = d.kind !== 'poll' && d.hasImage ? (await getImage(id)) || undefined : undefined
  const image = d.kind === 'poll' ? undefined : media === 'gif' && d.motion ? (await getMotion(id)) || undefined : still

  // Whatever was typed or generated, what goes to LinkedIn is tidied the same way (and given hashtags if it has none).
  const text = await prepareForPublish(d.text, id)
  if (text !== d.text) await mutateDraft(id, x => { x.text = text })
  const mode: 'new' | 'update' = b.mode === 'update' ? 'update' : 'new'
  const republish = b.republish === true
  const updated: ('member' | 'organization')[] = []
  const done: { as: 'member' | 'organization'; urn: string; at: string }[] = []
  const errors: string[] = []
  for (const t of targets) {
    const author = t === 'member' ? s.memberUrn : s.orgUrn
    const token = t === 'member' ? s.accessToken : (s.orgAccessToken && s.orgExpiresAt && new Date(s.orgExpiresAt) > new Date() ? s.orgAccessToken : '')
    if (!author || !token) { errors.push(`${t}: not available with this connection`); continue }
    const live = [...d.published].reverse().find(p => p.as === t)
    if (mode === 'update') {
      if (!live) { errors.push(`${t}: nothing to update yet, post it first`); continue }
      try {
        await updatePostText(token, live.urn, text)
        updated.push(t)
      } catch (e: any) {
        errors.push(`${t}: ${e?.message || 'failed'}`)
      }
      continue
    }
    if (live && !republish) { errors.push(`${t}: already posted`); continue }
    try {
      const urn = await publishPost({ token, author, commentary: text, image, altText: d.topic, poll: d.kind === 'poll' ? d.poll : undefined })
      done.push({ as: t, urn, at: new Date().toISOString() })
    } catch (e: any) {
      errors.push(`${t}: ${e?.message || 'failed'}`)
    }
  }
  if (done.length || updated.length) await mutateDraft(id, x => { x.published.push(...done); x.status = 'published'; x.publishedText = x.text })
  return NextResponse.json({ done: done.map(x => x.as), updated, errors }, { status: done.length || updated.length ? 200 : 502 })
}
