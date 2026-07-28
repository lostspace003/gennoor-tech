import { NextRequest, NextResponse } from 'next/server'
import { requireCrmUser, visibleLeads } from '@/lib/crm/access'
import { getLeads } from '@/lib/crm/store'
import { graphConfigured, listInboundMessages } from '@/lib/crm/graph'

// Inbound email for the CRM: reads the admin mailbox via Microsoft Graph and
// matches senders to leads. ?leadId= filters to one lead's thread.
export async function GET(req: NextRequest) {
  const user = await requireCrmUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!graphConfigured()) {
    return NextResponse.json({
      configured: false,
      messages: [],
      note: 'Microsoft Graph is not configured — inbound email unavailable.',
    })
  }

  try {
    const leadId = req.nextUrl.searchParams.get('leadId')
    const leads = visibleLeads(await getLeads(), user)

    if (leadId) {
      const lead = leads.find((l) => l.id === leadId)
      if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
      // Match replies from the primary address AND any saved alternates
      const addresses = [lead.email, ...(lead.altEmails || [])].filter(Boolean)
      if (addresses.length === 0) return NextResponse.json({ configured: true, messages: [] })
      const batches = await Promise.all(addresses.map((a) => listInboundMessages(a, 25).catch(() => [])))
      const messages = batches.flat().sort((a, b) => b.receivedAt.localeCompare(a.receivedAt)).slice(0, 25)
      return NextResponse.json({ configured: true, messages })
    }

    // Whole-CRM inbox: recent messages from any known lead address (incl. alternates)
    const byEmail = new Map<string, (typeof leads)[number]>()
    for (const l of leads) {
      for (const a of [l.email, ...(l.altEmails || [])]) {
        if (a) byEmail.set(a.toLowerCase(), l)
      }
    }
    const recent = await listInboundMessages(undefined, 50)
    const matched = recent
      .filter((m) => byEmail.has(m.from.toLowerCase()))
      .map((m) => {
        const lead = byEmail.get(m.from.toLowerCase())!
        return { ...m, leadId: lead.id, leadName: lead.name, leadCompany: lead.company }
      })
    return NextResponse.json({ configured: true, messages: matched })
  } catch (error: any) {
    console.error('Inbox error:', error)
    const detail = String(error?.message || '')
    const permissionIssue = /Access.*denied|Authorization|Forbidden|ErrorAccessDenied/i.test(detail)
    return NextResponse.json({
      configured: true,
      messages: [],
      error: permissionIssue
        ? 'Graph app lacks Mail.Read permission on the mailbox. Grant Mail.Read (application) to the Graph app in Entra ID.'
        : 'Failed to read inbox.',
    })
  }
}
