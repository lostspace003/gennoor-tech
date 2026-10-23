import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { addChatMessage, getChat, getQuery, listQueries, resolveQuery } from '@/lib/lms-chat'
import { sendEmail } from '@/lib/email-service'
import { emailShell } from '@/lib/crm/email-theme'
import { escapeHtml } from '@/lib/escape-html'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const MAX_FILE = 10 * 1024 * 1024
const MAX_FILES = 5

/** GET: the list, or one query with the learner's whole chat for that course (?id=). */
export async function GET(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ queries: await listQueries() })
  const query = await getQuery(id)
  if (!query) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ query, messages: await getChat(query.email, query.slug) })
}

/** POST (form data): id, reply, resolve ("1" to close without or along with the reply), files. */
export async function POST(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()

  const form = await req.formData()
  const id = String(form.get('id') ?? '')
  const reply = String(form.get('reply') ?? '').trim().slice(0, 8000)
  const query = await getQuery(id)
  if (!query) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const files = form.getAll('files').filter((f): f is File => f instanceof File && f.size > 0)
  if (files.length > MAX_FILES) return NextResponse.json({ error: `Attach up to ${MAX_FILES} files.` }, { status: 400 })
  if (files.some(f => f.size > MAX_FILE)) return NextResponse.json({ error: 'Each file must be 10 MB or smaller.' }, { status: 400 })

  if (reply) {
    const attachments = await Promise.all(files.map(async f => ({
      filename: f.name.replace(/[\\/:*?"<>|]/g, '_').slice(0, 120) || 'file',
      content: Buffer.from(await f.arrayBuffer()),
      contentType: f.type || 'application/octet-stream',
    })))

    await addChatMessage(query.email, query.slug, {
      role: 'team', text: reply, itemId: query.itemId, itemTitle: query.itemTitle, queryId: query.id,
      attachments: attachments.map(a => a.filename),
    })

    const support = process.env.EMAIL_FROM_SUPPORT || 'support@gennoor.com'
    const e = escapeHtml
    const note = attachments.length ? `<p style="margin:12px 0 0;color:#64748b;font-size:13px">${attachments.length} file${attachments.length > 1 ? 's' : ''} attached.</p>` : ''
    await sendEmail({
      to: query.email,
      cc: process.env.EMAIL_ADMIN || 'admin@gennoor.com',
      from: support,
      fromName: 'Gennoor Learning Studio',
      subject: `Answer to your question on ${query.courseTitle}`,
      attachments: attachments.length ? attachments : undefined,
      html: emailShell(
        `<h3 style="margin:0 0 12px;color:#0f172a">Hi ${e(query.name || 'there')},</h3>
         <p style="margin:0 0 8px;color:#64748b;font-size:14px">Your question: ${e(query.question)}</p>
         <div style="margin:16px 0;padding:14px 16px;background:#f5f5f7;border-radius:10px;color:#0f172a;line-height:1.7;font-size:15px;white-space:pre-wrap">${e(reply)}</div>
         ${note}
         <p style="margin:16px 0 0"><a href="https://www.gennoor.com/studio/${encodeURIComponent(query.slug)}/learn" style="display:inline-block;background:#2563EB;color:#fff;text-decoration:none;padding:9px 16px;border-radius:8px;font-size:14px">Back to the course</a></p>`,
        { preheader: 'We answered your question', senderEmail: support },
      ),
    })
  }

  if (reply || form.get('resolve') === '1') await resolveQuery(query.id)
  return NextResponse.json({ ok: true, query: await getQuery(query.id), messages: await getChat(query.email, query.slug) })
}
