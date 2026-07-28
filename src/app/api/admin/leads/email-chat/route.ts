import { NextResponse } from 'next/server'
import { requireCrmUser, canWorkLead } from '@/lib/crm/access'
import { getLead } from '@/lib/crm/store'
import { aiConfigured, chatCompletion, leadContext, GENNOOR_CONTEXT, ensureYouTubeLink } from '@/lib/crm/ai'

// Interactive email copilot: iterate on a draft via chat, then "finalize"
// returns the polished final copy for review before sending.
export async function POST(request: Request) {
  const user = await requireCrmUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!aiConfigured()) {
    return NextResponse.json(
      { error: 'AI is not configured. Set AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_KEY.' },
      { status: 503 }
    )
  }

  try {
    const { leadId, subject, body, message, mode, replyTo } = await request.json()
    if (!leadId) return NextResponse.json({ error: 'leadId required' }, { status: 400 })

    const lead = await getLead(leadId)
    if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    if (!canWorkLead(lead, user)) {
      return NextResponse.json({ error: `Lead is owned by ${lead.owner.split('@')[0]} — claim it or ask them/a manager.` }, { status: 403 })
    }

    const replyContext = replyTo
      ? `\n\nThe team is REPLYING to this inbound email from the lead:\n---\n${String(replyTo).slice(0, 3000)}\n---`
      : ''

    if (mode === 'finalize') {
      const content = await chatCompletion(
        [
          {
            role: 'system',
            content: `${GENNOOR_CONTEXT}

Polish this outreach email into its FINAL version. Fix tone, tighten wording, keep it honest (no invented numbers), keep the free webinar / 1-day training offer clear if present. Return JSON: {"subject": "...", "body": "..."} with body as plain text.${replyContext}

Lead data:
${leadContext(lead)}`,
          },
          { role: 'user', content: `Current draft:\nSubject: ${subject}\n\n${body}` },
        ],
        { json: true }
      )
      const parsed = JSON.parse(content)
      return NextResponse.json({ subject: parsed.subject || subject, body: ensureYouTubeLink(parsed.body || body), final: true })
    }

    if (!message) return NextResponse.json({ error: 'message required' }, { status: 400 })

    const content = await chatCompletion(
      [
        {
          role: 'system',
          content: `${GENNOOR_CONTEXT}

You are the email copilot. The team gives you an instruction; you revise the draft accordingly and briefly say what you changed. Never invent statistics. Return JSON: {"reply": "one sentence on what you changed", "subject": "...", "body": "..."} with body as plain text.${replyContext}

Lead data:
${leadContext(lead)}`,
        },
        { role: 'user', content: `Current draft:\nSubject: ${subject}\n\n${body}\n\nInstruction: ${message}` },
      ],
      { json: true }
    )
    const parsed = JSON.parse(content)
    return NextResponse.json({
      reply: parsed.reply || 'Draft updated.',
      subject: parsed.subject || subject,
      body: ensureYouTubeLink(parsed.body || body),
    })
  } catch (error) {
    console.error('Email chat error:', error)
    return NextResponse.json({ error: 'Email copilot failed. Check Azure OpenAI configuration.' }, { status: 500 })
  }
}
