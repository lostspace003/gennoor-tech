import { NextResponse } from 'next/server'
import { requireCrmUser } from '@/lib/crm/access'
import { mutateLeads, getLead, touch } from '@/lib/crm/store'
import { aiConfigured, researchChat, finalizePitch } from '@/lib/crm/ai'
import { ChatMessage } from '@/lib/crm/types'

// Chat with the copilot about a lead; mode "finalize" locks the discussion
// into final pitch content stored on the lead.
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

    return NextResponse.json({ reply, chat: updatedChat })
  } catch (error) {
    console.error('Research chat error:', error)
    return NextResponse.json({ error: 'Chat failed. Check Azure OpenAI configuration.' }, { status: 500 })
  }
}
