import { NextRequest, NextResponse } from 'next/server'
import { requireCrmUser } from '@/lib/crm/access'
import { getLeads } from '@/lib/crm/store'
import { leadIndexText } from '@/lib/crm/lead-text'
import { upsertVectors, indexedKeys, removeVectors, vectorHealth, vectorServiceConfigured } from '@/lib/crm/vector-service'

// Keeps the FAISS `leads` namespace in step with leads.json.
//   GET            → index health and drift (how many leads aren't indexed)
//   POST           → incremental: upsert everything, drop vectors for deleted leads
//   POST ?full=1   → rebuild from scratch (use after a model/dimension change)
//
// Leads are the source of truth; the index is disposable and can always be
// rebuilt, so this never writes back to the store.

export async function GET() {
  const user = await requireCrmUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!vectorServiceConfigured()) {
    return NextResponse.json({ configured: false, error: 'VECTOR_SERVICE_URL / VECTOR_API_KEY not set' })
  }
  try {
    const [health, keys, leads] = await Promise.all([vectorHealth(), indexedKeys('leads'), getLeads()])
    const indexed = new Set(keys)
    return NextResponse.json({
      configured: true,
      health,
      leads: leads.length,
      indexed: keys.length,
      missing: leads.filter((l) => !indexed.has(l.id)).length,
      orphaned: keys.filter((k) => !leads.some((l) => l.id === k)).length,
    })
  } catch (error: any) {
    return NextResponse.json({ configured: true, error: error.message }, { status: 502 })
  }
}

export async function POST(req: NextRequest) {
  const user = await requireCrmUser()
  if (!user?.isManager) return NextResponse.json({ error: 'Managers only' }, { status: 403 })
  if (!vectorServiceConfigured()) {
    return NextResponse.json({ error: 'Vector service not configured' }, { status: 503 })
  }

  const full = req.nextUrl.searchParams.get('full') === '1'
  const started = Date.now()
  try {
    const leads = await getLeads()
    // Dumped leads are parked by definition — keeping them out of retrieval
    // stops the copilot resurfacing rejects, and keeps the index smaller.
    const active = leads.filter((l) => !l.dumped)

    const { upserted, total } = await upsertVectors(
      'leads',
      active.map((l) => ({
        id: l.id,
        text: leadIndexText(l),
        meta: {
          name: l.name,
          company: l.company,
          owner: l.owner || 'pool',
          stage: l.stage,
          status: l.status,
        },
      })),
      { replaceAll: full }
    )

    // Incremental runs must also evict leads that were deleted or dumped
    // since the last sync; a full rebuild already dropped them.
    let removed = 0
    if (!full) {
      const keep = new Set(active.map((l) => l.id))
      const stale = (await indexedKeys('leads')).filter((k) => !keep.has(k))
      removed = await removeVectors('leads', stale)
    }

    return NextResponse.json({
      mode: full ? 'full rebuild' : 'incremental',
      upserted,
      removed,
      total,
      skippedDumped: leads.length - active.length,
      seconds: Number(((Date.now() - started) / 1000).toFixed(1)),
    })
  } catch (error: any) {
    console.error('Vector sync failed:', error)
    return NextResponse.json({ error: error.message || 'Vector sync failed' }, { status: 500 })
  }
}
