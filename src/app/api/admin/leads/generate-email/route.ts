import { NextResponse } from 'next/server'
import { requireCrmUser } from '@/lib/crm/access'
import { getLead } from '@/lib/crm/store'
import { aiConfigured, draftEmail } from '@/lib/crm/ai'
import { Lead } from '@/lib/crm/types'

// Honest fallback used when AI is unavailable — no invented statistics.
function fallbackDraft(lead: Lead): { subject: string; body: string } {
  const first = (lead.name || 'there').split(/\s+/)[0]
  return {
    subject: `AI enablement for ${lead.company || 'your team'} — free webinar from Gennoor Tech`,
    body: `Dear ${first},

I'm reaching out from Gennoor Tech. We help organizations adopt AI through a clear journey: we diagnose where AI fits your work, train your team (technical and non-technical tracks), build a proof of concept you can see working, develop it into a product, and stay on for 3-6 months of hand-holding.

To start, we'd love to offer ${lead.company || 'your organization'} two things, completely free:
- A 2-hour webinar tailored to your team's needs
- A 1-day online AI training for your people

These are relationship-building sessions — no strings attached. You can also see our work on enterprise AI agent development on our YouTube channel: https://www.youtube.com/@GennoorTech

Would a short call this week work to pick a topic your team would benefit from most?

Best regards,
Team Gennoor Tech
admin@gennoor.com | +91 9326352241
www.gennoor.com`,
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
      return NextResponse.json({ ...fallbackDraft(lead), source: 'template' })
    }

    try {
      const draft = await draftEmail(lead, instructions)
      return NextResponse.json({ ...draft, source: 'ai' })
    } catch (error) {
      console.error('AI draft failed, using template:', error)
      return NextResponse.json({ ...fallbackDraft(lead), source: 'template' })
    }
  } catch (error) {
    console.error('Error generating email:', error)
    return NextResponse.json({ error: 'Failed to generate email' }, { status: 500 })
  }
}
