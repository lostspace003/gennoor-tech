import { NextResponse } from 'next/server'
import { requireCampaignUser } from '@/lib/crm/universities-access'
import { getUniversities, mutateUniversities, note, sentThisHour } from '@/lib/crm/universities-store'
import { cleanUniPatch, safeFormUrl, UNI_STAGE_LABELS } from '@/lib/crm/universities-types'

const idOk = (v: unknown): v is string => typeof v === 'string' && /^GEN-\d{3}$/.test(v)

export async function GET() {
  const user = await requireCampaignUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const doc = await getUniversities()
    return NextResponse.json({ settings: doc.settings, universities: doc.universities, hour: await sentThisHour(doc.universities) })
  } catch (error) {
    console.error('Universities read error:', error)
    return NextResponse.json({ error: 'The universities could not be read' }, { status: 500 })
  }
}

/** Change one university: only the fields `cleanUniPatch` names. */
export async function PATCH(request: Request) {
  const user = await requireCampaignUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id, patch } = await request.json()
    if (!idOk(id)) return NextResponse.json({ error: 'Which university?' }, { status: 400 })
    const clean = cleanUniPatch(patch)
    if (!clean.ok) return NextResponse.json({ error: clean.error }, { status: 400 })
    const p = clean.patch
    const found = await mutateUniversities((doc) => {
      const u = doc.universities.find((x) => x.id === id)
      if (!u) return null
      if (p.stage && p.stage !== u.stage) { note(u, user.email, 'stage', `Moved from ${UNI_STAGE_LABELS[u.stage]} to ${UNI_STAGE_LABELS[p.stage]}`); u.stage = p.stage }
      if (p.draft) { u.draft = { ...u.draft, ...p.draft }; note(u, user.email, 'draft', 'The email was edited') }
      if (p.evaluation !== undefined) {
        u.evaluation = p.evaluation
        note(u, user.email, 'evaluation', p.evaluation ? `Evaluation: ${p.evaluation.courses.length} course${p.evaluation.courses.length === 1 ? '' : 's'}${p.evaluation.grantedAt ? ', access given' : p.evaluation.requestedAt ? ', requested' : ''}` : 'Evaluation cleared')
      }
      if (p.callOn !== undefined) { u.callOn = p.callOn; note(u, user.email, 'call', p.callOn ? `Call set for ${p.callOn}` : 'Call date cleared') }
      if (p.notes !== undefined) { u.notes = p.notes; note(u, user.email, 'note', 'Notes updated') }
      if (p.closedReason !== undefined) u.closedReason = p.closedReason
      u.updatedAt = new Date().toISOString()
      return u
    })
    if (!found) return NextResponse.json({ error: 'That university is not in the list' }, { status: 404 })
    return NextResponse.json({ university: found })
  } catch (error) {
    console.error('Universities save error:', error)
    return NextResponse.json({ error: 'That could not be saved' }, { status: 500 })
  }
}

/** The evaluation form's link (PUT), and "No reply needed" for a university (POST). */
export async function PUT(request: Request) {
  const user = await requireCampaignUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { formUrl } = await request.json()
    const text = String(formUrl ?? '').trim()
    const clean = safeFormUrl(text)
    if (text && !clean) return NextResponse.json({ error: 'That is not the address of a Google or Microsoft form (it must start with https://)' }, { status: 400 })
    await mutateUniversities((doc) => { doc.settings.formUrl = clean })
    return NextResponse.json({ formUrl: clean })
  } catch (error) {
    console.error('Universities settings error:', error)
    return NextResponse.json({ error: 'That could not be saved' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const user = await requireCampaignUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { action, id } = await request.json()
    if (action !== 'handled' || !idOk(id)) return NextResponse.json({ error: 'Not a known action' }, { status: 400 })
    const found = await mutateUniversities((doc) => {
      const u = doc.universities.find((x) => x.id === id)
      if (!u) return null
      for (const r of u.replies) r.handled = true
      note(u, user.email, 'reply', 'Marked: no reply needed')
      return u
    })
    if (!found) return NextResponse.json({ error: 'That university is not in the list' }, { status: 404 })
    return NextResponse.json({ university: found })
  } catch (error) {
    console.error('Universities action error:', error)
    return NextResponse.json({ error: 'That could not be saved' }, { status: 500 })
  }
}
