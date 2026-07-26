import { NextResponse } from 'next/server'
import { requireCrmUser } from '@/lib/crm/access'
import { mutateLeads, getLead, touch } from '@/lib/crm/store'
import { aiConfigured, chatCompletion, leadContext, GENNOOR_CONTEXT } from '@/lib/crm/ai'

// Suggests LIKELY email addresses for a lead that has none, from the company
// domain and common corporate patterns. These are educated guesses, clearly
// labeled — the user picks which to save, and delivery confirms validity.
export async function POST(request: Request) {
  const user = await requireCrmUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!aiConfigured()) {
    return NextResponse.json({ error: 'AI is not configured.' }, { status: 503 })
  }

  try {
    const { leadId, save } = await request.json()
    if (!leadId) return NextResponse.json({ error: 'leadId required' }, { status: 400 })

    const lead = await getLead(leadId)
    if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })

    // Save mode: persist the address(es) the user selected
    if (Array.isArray(save) && save.length > 0) {
      const emails = save.map((e: string) => e.trim().toLowerCase()).filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))
      if (emails.length === 0) return NextResponse.json({ error: 'No valid email selected' }, { status: 400 })
      await mutateLeads((leads) => {
        const l = leads.find((x) => x.id === leadId)
        if (!l) return
        if (!l.email) l.email = emails[0]
        const extra = emails.filter((e) => e !== l.email)
        l.altEmails = [...new Set([...(l.altEmails || []), ...extra])]
        touch(l, { at: new Date().toISOString(), by: user.email, type: 'updated', description: `Email saved from AI suggestions: ${emails.join(', ')}` })
      })
      return NextResponse.json({ success: true, saved: emails })
    }

    const domain = (lead.website || '').replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]
    const content = await chatCompletion(
      [
        {
          role: 'system',
          content: `${GENNOOR_CONTEXT}

Suggest likely corporate email addresses for this person. Use their name and the company domain${domain ? ` (${domain})` : ''} with common patterns (first.last@, first@, flast@, first_last@, info@/hr@ as last resorts). These are GUESSES — do not claim they are verified. Return JSON: {"candidates": [{"email": "...", "confidence": "high|medium|low", "reason": "one short phrase"}], "note": "one honest sentence about reliability"} with at most 6 candidates ordered by likelihood. If there is no usable domain, derive one cautiously from the company name and say so in the note.`,
        },
        { role: 'user', content: leadContext(lead) },
      ],
      { json: true }
    )
    const parsed = JSON.parse(content)
    return NextResponse.json({
      candidates: Array.isArray(parsed.candidates) ? parsed.candidates.slice(0, 6) : [],
      note: parsed.note || 'These are pattern-based guesses — delivery is the only real verification.',
    })
  } catch (error) {
    console.error('Find email error:', error)
    return NextResponse.json({ error: 'Email finder failed.' }, { status: 500 })
  }
}
