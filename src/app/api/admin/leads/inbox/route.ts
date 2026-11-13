import { NextRequest, NextResponse } from 'next/server'
import { requireCrmUser, canWorkLead } from '@/lib/crm/access'
import { getLeads, mutateLeads, touch } from '@/lib/crm/store'
import { graphConfigured, listInboundMessages } from '@/lib/crm/graph'
import { mailProblem, syncReplies } from '@/lib/crm/reply-sync'

/**
 * Mail from leads, read from the team's mailboxes.
 *   GET                 every recent message from a lead's address, each marked: a reply, a request to stop, or
 *                       automatic; and whether the lead is waiting for an answer. Reading it also brings the
 *                       leads in step (a reply moves a lead to Talking; see lib/crm/replies.ts).
 *   GET ?leadId=        one lead's messages, with their full text, for the conversation on the lead page.
 *   POST { leadIds, action: 'handled' | 'unhandled' }   "no reply needed", or put it back on the list.
 */
export async function GET(req: NextRequest) {
  const user = await requireCrmUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!graphConfigured()) {
    return NextResponse.json({ configured: false, messages: [], note: 'Reading replies is not set up on this site yet.' })
  }

  try {
    const leadId = req.nextUrl.searchParams.get('leadId')
    if (leadId) {
      const lead = (await getLeads()).find((l) => l.id === leadId)
      if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
      // Match replies from the primary address AND any saved alternates
      const addresses = [lead.email, ...(lead.altEmails || [])].filter(Boolean)
      if (addresses.length === 0) return NextResponse.json({ configured: true, messages: [] })
      const batches = await Promise.all(addresses.map((a) => listInboundMessages(a, 25).catch(() => [])))
      const messages = batches.flat().sort((a, b) => b.receivedAt.localeCompare(a.receivedAt)).slice(0, 25)
      return NextResponse.json({ configured: true, messages })
    }

    const result = await syncReplies(req.nextUrl.searchParams.get('fresh') === '1')
    return NextResponse.json({ configured: true, messages: result.messages, changed: result.changes.length, ...(result.error ? { error: result.error } : {}), ...(result.note ? { note: result.note } : {}) })
  } catch (error) {
    console.error('Inbox error:', error)
    return NextResponse.json({ configured: true, messages: [], error: mailProblem(error) })
  }
}

export async function POST(request: Request) {
  const user = await requireCrmUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { leadIds, action } = await request.json()
    if (!Array.isArray(leadIds) || !['handled', 'unhandled'].includes(action)) return NextResponse.json({ error: 'leadIds and action required' }, { status: 400 })
    const now = new Date().toISOString()
    const done = await mutateLeads((leads) => {
      let n = 0
      for (const lead of leads) {
        if (!leadIds.includes(lead.id) || !lead.reply || !canWorkLead(lead, user)) continue
        if (action === 'handled') {
          lead.reply.handledAt = now
          lead.reply.handledBy = user.email
          touch(lead, { at: now, by: user.email, type: 'email', description: 'Their reply needs no answer' })
        } else {
          delete lead.reply.handledAt
          delete lead.reply.handledBy
          touch(lead, { at: now, by: user.email, type: 'email', description: 'Their reply is waiting for an answer again' })
        }
        n++
      }
      return n
    })
    return NextResponse.json({ success: true, done })
  } catch (error) {
    console.error('Inbox update error:', error)
    return NextResponse.json({ error: 'That could not be saved. Try again.' }, { status: 500 })
  }
}
