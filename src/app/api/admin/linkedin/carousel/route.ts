import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { publishCarousel, publishUploadedPdf, recordPosted, schedule, scheduleUploadedPdf } from '@/lib/linkedin-queue'
import { readUpload } from '@/lib/assets'
import { planCarousel, renderCarouselPdf, type CarouselPlan } from '@/lib/social/carousel'
import { addUrlRef, withReferences } from '@/lib/social/references'

export const dynamic = 'force-dynamic'
export const maxDuration = 120

/**
 * { action: 'plan', topic, url? }  -> { plan }            the agent writes the cards and caption
 * { action: 'pdf', plan }          -> { pdf: base64 }     preview / download
 * { action: 'publish', plan, as }  -> { urn }             uploads the PDF and posts it ('organization' | 'member')
 */
export async function POST(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  // Your own carousel: multipart form with the PDF, a title, the caption, who posts, and an optional time.
  if ((req.headers.get('content-type') || '').includes('multipart/form-data')) {
    try {
      const form = await req.formData()
      const up = await readUpload(form, 'file', ['application/pdf'], 25)
      const title = String(form.get('title') || up.name.replace(/\.pdf$/i, '')).trim().slice(0, 100) || 'Carousel'
      const caption = String(form.get('caption') || '').trim() || title
      const as = form.get('as') === 'organization' ? 'organization' : 'member'
      const at = String(form.get('at') || '')
      if (at) { const job = await scheduleUploadedPdf(up.data, title, caption, as, at); return NextResponse.json({ ok: true, scheduled: job.at }) }
      const urn = await publishUploadedPdf(up.data, title, caption, as)
      await recordPosted('carousel', as, title, urn)
      return NextResponse.json({ ok: true, urn })
    } catch (e: any) {
      return NextResponse.json({ error: e?.message || 'Upload failed.' }, { status: 400 })
    }
  }
  const b = await req.json().catch(() => ({}))
  try {
    if (b.action === 'plan') {
      const topic = String(b.topic || '').trim()
      if (!topic && !b.url) return NextResponse.json({ error: 'Give a topic or a link.' }, { status: 400 })
      const refs = b.url ? [await addUrlRef(String(b.url))] : []
      const material = await withReferences(`Topic: ${topic || 'Summarise the linked page'}`, refs)
      return NextResponse.json({ plan: await planCarousel(typeof material === 'string' ? material : JSON.stringify(material)) })
    }
    const plan = b.plan as CarouselPlan
    if (!plan?.slides?.length) return NextResponse.json({ error: 'No carousel to use.' }, { status: 400 })
    if (b.action === 'pdf') return NextResponse.json({ pdf: (await renderCarouselPdf(plan)).toString('base64') })
    if (b.action === 'publish') {
      const as = b.as === 'organization' ? 'organization' : 'member'
      if (b.at) { const job = await schedule('carousel', as, plan.title, { plan }, b.at); return NextResponse.json({ ok: true, scheduled: job.at }) }
      const urn = await publishCarousel(plan, as)
      await recordPosted('carousel', as, plan.title, urn)
      return NextResponse.json({ ok: true, urn })
    }
    return NextResponse.json({ error: 'Unknown action.' }, { status: 400 })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed.' }, { status: 502 })
  }
}
