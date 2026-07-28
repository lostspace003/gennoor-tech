import { NextResponse } from 'next/server'
import { requireCrmUser } from '@/lib/crm/access'
import { getLeads } from '@/lib/crm/store'
import { searchConfigured, searchLeads, syncSearchIndex, IndexMissingError } from '@/lib/crm/search'

// Semantic lead search over the Azure AI Search index (free tier).
// GET ?q=...  → leads ranked by hybrid keyword+vector relevance.
// POST        → full reindex (managers only).
// Self-healing: a search against a missing index builds it once, then retries.
export async function GET(request: Request) {
  const user = await requireCrmUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!searchConfigured()) {
    return NextResponse.json(
      { error: 'Search is not configured. Set AZURE_SEARCH_ENDPOINT and AZURE_SEARCH_ADMIN_KEY.' },
      { status: 503 }
    )
  }

  const { searchParams } = new URL(request.url)
  const q = (searchParams.get('q') || '').trim()
  if (!q) return NextResponse.json({ error: 'q required' }, { status: 400 })
  const top = Math.min(Number(searchParams.get('top')) || 20, 50)

  try {
    const leads = await getLeads()
    let hits
    try {
      hits = await searchLeads(q, top)
    } catch (error) {
      if (!(error instanceof IndexMissingError)) throw error
      await syncSearchIndex(leads)
      hits = await searchLeads(q, top)
    }
    const byId = new Map(leads.map((l) => [l.id, l]))
    const results = hits
      .filter((h) => byId.has(h.id))
      .map((h) => ({ score: h.score, lead: byId.get(h.id) }))
    return NextResponse.json({ query: q, results })
  } catch (error: any) {
    console.error('CRM search failed:', error?.message)
    return NextResponse.json({ error: `Search failed: ${error?.message}` }, { status: 500 })
  }
}

export async function POST() {
  const user = await requireCrmUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!user.isManager) return NextResponse.json({ error: 'Managers only' }, { status: 403 })

  if (!searchConfigured()) {
    return NextResponse.json(
      { error: 'Search is not configured. Set AZURE_SEARCH_ENDPOINT and AZURE_SEARCH_ADMIN_KEY.' },
      { status: 503 }
    )
  }

  try {
    const leads = await getLeads()
    const indexed = await syncSearchIndex(leads)
    return NextResponse.json({ indexed })
  } catch (error: any) {
    console.error('CRM search reindex failed:', error?.message)
    return NextResponse.json({ error: `Reindex failed: ${error?.message}` }, { status: 500 })
  }
}
