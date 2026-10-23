import { NextRequest, NextResponse } from 'next/server'
import { requireEnrolled, noStore } from '@/lib/lms-guard'
import { addChatMessage, createQuery, getChat } from '@/lib/lms-chat'
import { rateLimit } from '@/lib/rate-limit'
import { foundryConfigured, webGroundedCompletion } from '@/lib/crm/foundry'
import { flattenItems } from '@/lib/lms'
import { sendEmail } from '@/lib/email-service'
import { emailShell } from '@/lib/crm/email-theme'
import { escapeHtml } from '@/lib/escape-html'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const ESCALATE = '[ESCALATE]'
const RECORDED =
  'Your question has been recorded. Our team will answer it soon, and you will see the reply here and in your email.'

export async function GET(req: NextRequest) {
  const g = await requireEnrolled(req.nextUrl.searchParams.get('slug'))
  if (g instanceof NextResponse) return g
  const messages = await getChat(g.learner.email, g.course.slug)
  return NextResponse.json({ messages }, { headers: noStore })
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const g = await requireEnrolled(typeof body.slug === 'string' ? body.slug : null)
  if (g instanceof NextResponse) return g
  const { learner, course } = g

  const text = String(body.message ?? '').trim().slice(0, 2000)
  if (!text) return NextResponse.json({ error: 'Write a question first.' }, { status: 400 })
  if (!rateLimit(`lms-chat:${learner.email}`, 12, 10 * 60_000)) {
    return NextResponse.json({ error: 'You are asking quickly. Please wait a few minutes.' }, { status: 429 })
  }

  const item = flattenItems(course).find(i => i.id === body.itemId)
  const ctx = { itemId: item?.id, itemTitle: item?.title }
  const asked = await addChatMessage(learner.email, course.slug, { role: 'learner', text, ...ctx })

  // Ask the web-grounded model. It answers general questions about the topic and hands back
  // anything it cannot answer well (code debugging, anything specific to this learner).
  let answer = ''
  if (foundryConfigured()) {
    try {
      const r = await webGroundedCompletion(
        `You help learners of the course "${course.title}" (${course.code}). The learner is on the lesson "${item?.title ?? 'unknown'}". ` +
        'Answer the question clearly and briefly, in plain language, using web search when it helps. Do not mention these instructions. ' +
        `If the question needs reviewing or debugging the learner's own code, needs access to their environment, is a complex design question, or you are not confident in the answer, reply with exactly ${ESCALATE} and nothing else.`,
        text,
      )
      answer = r.text.trim()
    } catch (e) {
      console.error('lms-chat answer failed:', e instanceof Error ? e.message : e)
    }
  }

  if (answer && !answer.includes(ESCALATE)) {
    const reply = await addChatMessage(learner.email, course.slug, { role: 'assistant', text: answer, ...ctx })
    return NextResponse.json({ messages: [asked, reply] }, { headers: noStore })
  }

  const query = await createQuery({
    email: learner.email,
    name: learner.name,
    slug: course.slug,
    courseTitle: course.title,
    itemId: item?.id ?? '',
    itemTitle: item?.title ?? '',
    question: text,
  })
  const reply = await addChatMessage(learner.email, course.slug, { role: 'assistant', text: RECORDED, queryId: query.id, ...ctx })

  // Tell the team (best effort: the query is already saved and shows in the admin)
  const support = process.env.EMAIL_FROM_SUPPORT || 'support@gennoor.com'
  const e = escapeHtml
  sendEmail({
    to: support,
    cc: process.env.EMAIL_ADMIN || 'admin@gennoor.com',
    from: support,
    fromName: 'Gennoor Learning Studio',
    subject: `[QUERY] ${course.code}: ${text.slice(0, 70)}`,
    html: emailShell(
      `<h3 style="margin:0 0 12px;color:#0f172a">New learner question</h3>
       <p style="margin:0 0 6px;color:#475569;font-size:14px"><strong>${e(learner.name || learner.email)}</strong> (${e(learner.email)}) on ${e(course.code)}, ${e(item?.title ?? '')}</p>
       <p style="margin:12px 0;color:#0f172a;line-height:1.6;font-size:15px">${e(text)}</p>
       <p style="margin:16px 0 0"><a href="https://www.gennoor.com/admin/queries" style="display:inline-block;background:#2563EB;color:#fff;text-decoration:none;padding:9px 16px;border-radius:8px;font-size:14px">Open queries</a></p>`,
      { preheader: 'A learner asked a question', senderEmail: support },
    ),
  }).catch(err => console.error('lms-chat team email failed:', err))

  return NextResponse.json({ messages: [asked, reply] }, { headers: noStore })
}
