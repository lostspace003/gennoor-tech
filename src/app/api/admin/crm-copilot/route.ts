import { NextResponse } from 'next/server'
import { requireCrmUser } from '@/lib/crm/access'
import { getLeads } from '@/lib/crm/store'
import { aiConfigured, chatCompletion, GENNOOR_CONTEXT } from '@/lib/crm/ai'

// GennoorBot for the CRM: answers questions over ALL lead data.
// At current scale a compact snapshot of every lead fits the model context
// directly, which is more accurate than retrieval; when the dataset outgrows
// the context window this is the one place to swap in embedding retrieval.
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
    const { messages } = await request.json()
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'messages required' }, { status: 400 })
    }

    const leads = await getLeads()
    const snapshot = leads.map((l) => ({
      id: l.id,
      name: l.name,
      company: l.company,
      designation: l.designation,
      email: l.email ? 'yes' : 'no',
      stage: l.stage,
      status: l.status,
      process: l.processStatus,
      priority: l.priority || undefined,
      sector: l.sector || undefined,
      region: l.region || undefined,
      country: l.country || undefined,
      owner: l.owner,
      researched: Boolean(l.aiResearch),
      pitchFinalized: Boolean(l.finalizedPitch),
      emailsSent: l.emailHistory.filter((e) => e.status === 'sent').length,
      followUps: l.followUps.length,
      lastActivity: l.lastActivity?.slice(0, 10),
      created: l.createdAt?.slice(0, 10),
    }))

    const reply = await chatCompletion(
      [
        {
          role: 'system',
          content: `${GENNOOR_CONTEXT}

You are GennoorBot, the CRM copilot for the Gennoor sales team. Today is ${new Date().toISOString().slice(0, 10)}. Answer questions using ONLY the CRM data below. Be specific — name leads and companies. When asked for lists, keep them tight. If data doesn't contain the answer, say so plainly.

CRM DATA (${snapshot.length} leads):
${JSON.stringify(snapshot)}`,
        },
        ...messages.slice(-12).map((m: any) => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: String(m.content) })),
      ],
      { maxTokens: 900 }
    )

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('CRM copilot error:', error)
    return NextResponse.json({ error: 'Copilot failed. Check Azure OpenAI configuration.' }, { status: 500 })
  }
}
