import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { sendEmail } from '@/lib/email-service'
import { markdownToHtml } from '@/lib/linkedin-hub-format'

export const dynamic = 'force-dynamic'

/** Emails one hub result, already formatted as clean text, to the address the admin types. */
export async function POST(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const b = await req.json().catch(() => ({}))
  const to = String(b.to || '').trim()
  const text = String(b.text || '').trim().slice(0, 60_000)
  if (!/^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+$/.test(to)) return NextResponse.json({ error: 'Enter one valid email address.' }, { status: 400 })
  if (!text) return NextResponse.json({ error: 'Nothing to send.' }, { status: 400 })
  const subject = String(b.subject || 'LinkedIn search results').replace(/[\r\n]+/g, ' ').slice(0, 150)
  try {
    await sendEmail({ from: process.env.EMAIL_FROM_INFO || 'info@gennoor.com', to, subject, html: markdownToHtml(text), text })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message || e).slice(0, 200) }, { status: 502 })
  }
}
