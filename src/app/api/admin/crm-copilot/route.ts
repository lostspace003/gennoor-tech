import { NextResponse } from 'next/server'
import { requireCrmUser } from '@/lib/crm/access'
import { getLeads } from '@/lib/crm/store'
import { aiConfigured, chatCompletion, GENNOOR_CONTEXT } from '@/lib/crm/ai'
import { foundryConfigured, webGroundedCompletion } from '@/lib/crm/foundry'

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
    const { messages, web } = await request.json()
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

    const systemPrompt = `${GENNOOR_CONTEXT}

You are GennoorBot, the CRM copilot for the Gennoor sales team. Today is ${new Date().toISOString().slice(0, 10)}. Ground answers in the CRM data below; be specific — name leads and companies. When asked for lists, keep them tight. If the data doesn't contain the answer, say so plainly.

CRM DATA (${snapshot.length} leads):
${JSON.stringify(snapshot)}`

    const history = messages.slice(-12).map((m: any) => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: String(m.content) }))

    // Web mode: same CRM grounding PLUS live web search via Foundry.
    // gpt-5 is shared with other workloads — on any failure fall back to
    // CRM-only and say so honestly.
    if (web && foundryConfigured()) {
      try {
        const transcript = history.map((m: any) => `${m.role.toUpperCase()}: ${m.content}`).join('\n')
        const result = await webGroundedCompletion(
          `${systemPrompt}\n\nYou may ALSO use web search for current, public information (companies, news, people). Cite web sources inline when used.`,
          transcript
        )
        return NextResponse.json({ reply: result.text, usedWeb: true, citations: result.citations })
      } catch (error: any) {
        console.error('Copilot web mode failed, falling back:', error?.message)
        const reply = await chatCompletion([{ role: 'system', content: systemPrompt }, ...history], { maxTokens: 900 })
        return NextResponse.json({ reply, usedWeb: false, webNote: 'Web search unavailable right now (model busy) — answered from CRM data only.' })
      }
    }

    const reply = await chatCompletion([{ role: 'system', content: systemPrompt }, ...history], { maxTokens: 900 })
    return NextResponse.json({ reply, usedWeb: false })
  } catch (error) {
    console.error('CRM copilot error:', error)
    return NextResponse.json({ error: 'Copilot failed. Check Azure OpenAI configuration.' }, { status: 500 })
  }
}
