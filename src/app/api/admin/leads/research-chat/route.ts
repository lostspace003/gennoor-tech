import { NextResponse } from 'next/server'
import { requireCrmUser, canWorkLead } from '@/lib/crm/access'
import { mutateLeads, getLead, touch } from '@/lib/crm/store'
import { aiConfigured, researchChat, finalizePitch, suggestQuestions } from '@/lib/crm/ai'
import { ChatMessage } from '@/lib/crm/types'

// Chat with the copilot about a lead.
//   mode "finalize" — locks the discussion into final pitch content
//   mode "suggest"  — returns research-grounded next questions for the chips
// Every reply also carries fresh suggestions so the chips follow the
// conversation instead of repeating the research.
export async function POST(request: Request) {
  const user = await requireCrmUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!aiConfigured()) {
    return NextResponse.json(
      { error: 'AI chat is not configured. Set AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_KEY.' },
      { status: 503 }
    )
  }

  try {
    const { leadId, message, mode } = await request.json()
    if (!leadId) return NextResponse.json({ error: 'leadId required' }, { status: 400 })

    const lead = await getLead(leadId)
    if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    if (!canWorkLead(lead, user)) {
      return NextResponse.json({ error: `Lead is owned by ${lead.owner.split('@')[0]} — claim it or ask them/a manager.` }, { status: 403 })
    }

    if (mode === 'finalize') {
      const pitch = await finalizePitch(lead, lead.researchChat)
      await mutateLeads((leads) => {
        const l = leads.find((x) => x.id === leadId)
        if (!l) return
        l.finalizedPitch = pitch
        touch(l, { at: new Date().toISOString(), by: user.email, type: 'chat', description: 'Pitch content finalized' })
      })
      return NextResponse.json({ pitch })
    }

    // Chips only — asked when the tab opens, before anything is typed
    if (mode === 'suggest') {
      try {
        return NextResponse.json({ suggestions: await suggestQuestions(lead, lead.researchChat) })
      } catch (error: any) {
        console.error('Suggestion generation failed:', error?.message)
        return NextResponse.json({ suggestions: [] })
      }
    }

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'message required' }, { status: 400 })
    }

    const history: ChatMessage[] = [...lead.researchChat, { role: 'user', content: message }]
    const reply = await researchChat(lead, history)
    const updatedChat: ChatMessage[] = [...history, { role: 'assistant', content: reply }]

    await mutateLeads((leads) => {
      const l = leads.find((x) => x.id === leadId)
      if (!l) return
      // Keep the last 40 messages so the blob stays small
      l.researchChat = updatedChat.slice(-40)
      touch(l)
    })

    // Follow-ups for what was just discussed. Best-effort: a failure here must
    // never cost the user their reply.
    let suggestions: string[] = []
    try {
      suggestions = await suggestQuestions(lead, updatedChat)
    } catch (error: any) {
      console.error('Suggestion generation failed:', error?.message)
    }

    return NextResponse.json({ reply, chat: updatedChat, suggestions })
  } catch (error) {
    console.error('Research chat error:', error)
    return NextResponse.json({ error: 'Chat failed. Check Azure OpenAI configuration.' }, { status: 500 })
  }
}
