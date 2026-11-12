import { NextResponse } from 'next/server'
import { requireCrmUser } from '@/lib/crm/access'
import { getLead } from '@/lib/crm/store'
import { aiConfigured, draftEmail } from '@/lib/crm/ai'
import { teamMember, signOffText } from '@/lib/crm/team'
import { Lead } from '@/lib/crm/types'

// Used when the writing assistant is unavailable: a plain, honest starting point.
function fallbackDraft(lead: Lead, senderEmail: string): { subject: string; body: string } {
  const first = (lead.name || 'there').split(/\s+/)[0]
  return {
    subject: `Gennoor Tech and ${lead.company || 'your team'}`,
    body: `Dear ${first},

Thank you for your message.

[Write your reply here.]

If a short call would help, you can pick a time at https://www.gennoor.com/resources/calendar

${signOffText(teamMember(senderEmail))}`,
  }
}

export async function POST(request: Request) {
  const user = await requireCrmUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { leadId, instructions, reply } = await request.json()
    if (!leadId) return NextResponse.json({ error: 'leadId required' }, { status: 400 })

    const lead = await getLead(leadId)
    if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })

    if (!aiConfigured()) {
      return NextResponse.json({ ...fallbackDraft(lead, user.email), source: 'template' })
    }

    try {
      const draft = await draftEmail(lead, instructions, user.email, !!reply)
      return NextResponse.json({ ...draft, source: 'ai' })
    } catch (error) {
      console.error('AI draft failed, using template:', error)
      return NextResponse.json({ ...fallbackDraft(lead, user.email), source: 'template' })
    }
  } catch (error) {
    console.error('Error generating email:', error)
    return NextResponse.json({ error: 'Failed to generate email' }, { status: 500 })
  }
}
