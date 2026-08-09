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

    const allLeads = await getLeads()

    // Scale: small CRMs go in whole (most accurate); large ones use
    // embedding retrieval to select the leads relevant to the question.
    let leads = allLeads
    let scopeNote = ''
    if (allLeads.length > 150) {
      const question = String([...messages].reverse().find((m: any) => m.role === 'user')?.content || '')
      try {
        // FAISS semantic retrieval over the `leads` namespace. The index is
        // kept current by /api/admin/leads/vector-sync; ids map back to leads.
        const { searchVectors, vectorServiceConfigured } = await import('@/lib/crm/vector-service')
        if (!vectorServiceConfigured()) throw new Error('vector service not configured')
        const hits = await searchVectors('leads', question, 30)
        const byId = new Map(allLeads.map((l) => [l.id, l]))
        const found = hits.map((h) => byId.get(h.id)).filter(Boolean) as typeof allLeads
        if (found.length === 0) throw new Error('index empty — run the vector sync')
        leads = found
        scopeNote = ` (retrieved the ${leads.length} most relevant of ${allLeads.length} leads for this question)`
      } catch (error: any) {
        // Legacy blob-embedding path, then the full snapshot. Never let
        // retrieval trouble turn into "the copilot is down".
        console.error('FAISS retrieval failed, falling back:', error?.message)
        try {
          const { retrieveRelevantLeads } = await import('@/lib/crm/embeddings')
          leads = await retrieveRelevantLeads(allLeads, question, 30)
          scopeNote = ` (retrieved ${leads.length} of ${allLeads.length} leads — fallback retrieval)`
        } catch (fallbackError: any) {
          console.error('Legacy retrieval failed too, using full snapshot:', fallbackError?.message)
        }
      }
    }

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

LEAD LINKS — whenever you name a lead, write it as [[lead:<id>|<name>]] using that lead's exact id from the data. The team clicks these to open the lead. Example: [[lead:LEAD-2026-07-02-A1B2C3|Helal Ismail]] at Alfan. Use the marker on the FIRST mention in each list item; plain text is fine after that.

FORMATTING — this renders in a narrow chat panel:
- Markdown works: **bold**, "- " bullets, "1." numbered lists. Use them.
- Keep list items to one or two lines. No tables, no headings, no code blocks.
- Lead with the answer. Don't restate the question or explain your reasoning unless asked.

CRM DATA (${snapshot.length} leads${scopeNote}):
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
