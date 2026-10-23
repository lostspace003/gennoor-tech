import { NextResponse } from 'next/server'
import { requireCrmUser } from '@/lib/crm/access'
import { getLead } from '@/lib/crm/store'
import { aiConfigured, draftEmail } from '@/lib/crm/ai'
import { teamMember, signOffText } from '@/lib/crm/team'
import { Lead } from '@/lib/crm/types'

// Honest fallback used when AI is unavailable — no invented statistics.
// Signed by the team member drafting it, same as the AI path.
function fallbackDraft(lead: Lead, senderEmail: string): { subject: string; body: string } {
  const first = (lead.name || 'there').split(/\s+/)[0]
  return {
    subject: `AI training for ${lead.company || 'your team'}: free webinar from Gennoor Tech`,
    body: `Dear ${first},

I'm reaching out from Gennoor Tech. We train teams to work with AI and Claude, built around the work they do, and we automate processes one at a time.

To start, we'd love to offer ${lead.company || 'your organization'} two things, completely free:
- A 2-hour webinar tailored to your team's needs
- A 1-day online AI training for your people

These are relationship-building sessions — no strings attached. You can also see our work on AI agent development on our YouTube channel: https://www.youtube.com/@GennoorTech

Would a short call this week work to pick a topic your team would benefit from most?

${signOffText(teamMember(senderEmail))}`,
  }
}

export async function POST(request: Request) {
  const user = await requireCrmUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { leadId, instructions } = await request.json()
    if (!leadId) return NextResponse.json({ error: 'leadId required' }, { status: 400 })

    const lead = await getLead(leadId)
    if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })

    if (!aiConfigured()) {
      return NextResponse.json({ ...fallbackDraft(lead, user.email), source: 'template' })
    }

    try {
      const draft = await draftEmail(lead, instructions, user.email)
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
