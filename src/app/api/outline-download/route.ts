import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email-service'
import { saveEnquiry } from '@/lib/azure-storage'
import { trackEvent, trackException, initAppInsights } from '@/lib/analytics'
import { rateLimit, clientIp } from '@/lib/rate-limit'
import { escapeHtml } from '@/lib/escape-html'
import { getTocCourse, tocPdfUrl, TOC_CONTAINER } from '@/lib/toc-courses'
import { signBlobUrl } from '@/lib/lms'

export const dynamic = 'force-dynamic'

const clip = (v: unknown, n: number) => String(v ?? '').trim().slice(0, n)

/** Course outline PDF: the visitor leaves name, email and phone, we keep it as a lead, and a short-lived download link comes back. */
export async function POST(request: Request) {
  try {
    if (!rateLimit(`outline-download:${clientIp(request.headers)}`, 8, 10 * 60_000)) {
      return NextResponse.json({ error: 'Too many requests. Please try again in a few minutes.' }, { status: 429 })
    }
    initAppInsights()
    const b = await request.json().catch(() => ({}))
    const course = getTocCourse(clip(b.slug, 120))
    const name = clip(b.name, 120)
    const email = clip(b.email, 200).toLowerCase()
    const phone = clip(b.phone, 40)
    if (!course || !name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || phone.replace(/\D/g, '').length < 7) {
      return NextResponse.json({ error: 'Please enter your name, a valid email and a phone number.' }, { status: 400 })
    }
    await saveEnquiry('OutlineDownload', { name, email, phone, course: course.title, courseSlug: course.slug })
    trackEvent('OutlineDownload', { course: course.title })
    // the lead is saved first; a failed notification must not block the download
    sendEmail({
      to: process.env.EMAIL_ADMIN || 'admin@gennoor.com',
      from: process.env.EMAIL_FROM_INFO || 'info@gennoor.com',
      fromName: 'Gennoor Tech Website',
      subject: `[OUTLINE DOWNLOAD] ${name}: ${course.title}`,
      html: `<p>Someone downloaded a course outline.</p><p><strong>Course:</strong> ${escapeHtml(course.title)}<br><strong>Name:</strong> ${escapeHtml(name)}<br><strong>Email:</strong> ${escapeHtml(email)}<br><strong>Phone:</strong> ${escapeHtml(phone)}</p>`,
    }).catch(() => {})
    // the visitor gets the PDF by email too; a failure here must not block the on-screen download
    let emailed = false
    try {
      const pdf = await fetch(signBlobUrl(TOC_CONTAINER, course.outlinePdf, 5), { cache: 'no-store' })
      if (pdf.ok) {
        await sendEmail({
          to: email,
          from: process.env.EMAIL_FROM_INFO || 'info@gennoor.com',
          fromName: 'Gennoor Tech',
          subject: `${course.title}: your course outline`,
          html: `<p>Hello ${escapeHtml(name)},</p><p>Thank you for your interest in <strong>${escapeHtml(course.title)}</strong>. The course outline is attached as a PDF.</p><p>To talk about dates, a private batch or training at your site, reply to this email or book a call at <a href="https://gennoor.com/claude/courses/${course.slug}">gennoor.com</a>.</p><p>Gennoor Tech</p>`,
          attachments: [{ filename: `${course.title} - Course Outline.pdf`, content: Buffer.from(await pdf.arrayBuffer()), contentType: 'application/pdf' }],
        })
        emailed = true
      }
    } catch (e) { console.error('outline email failed', e) }
    return NextResponse.json({ url: tocPdfUrl(course), emailed })
  } catch (e) {
    console.error('outline-download failed', e)
    trackException(e instanceof Error ? e : new Error(String(e)), { route: 'outline-download' })
    return NextResponse.json({ error: 'Could not prepare the download. Please try again.' }, { status: 500 })
  }
}
