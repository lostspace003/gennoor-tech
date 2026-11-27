import { NextResponse } from 'next/server'
import { requireCampaignUser } from '@/lib/crm/universities-access'
import { getUniversities, mutateUniversities, note, sentThisHour } from '@/lib/crm/universities-store'
import { applyFormAnswer, cleanUniPatch, UNI_STAGE_LABELS } from '@/lib/crm/universities-types'
import { CRM_USERS } from '@/lib/crm/access'

const idOk = (v: unknown): v is string => typeof v === 'string' && /^GEN-\d{3}$/.test(v)

export async function GET() {
  const user = await requireCampaignUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const doc = await getUniversities()
    return NextResponse.json({ universities: doc.universities, unmatched: doc.unmatched, hour: await sentThisHour(doc.universities) })
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

/**
 * "No reply needed" for a university, an answer of the general form link put on its university, and who works it:
 * anyone picks up a free university, its holder or a manager releases it, a manager gives it to someone (POST).
 */
export async function POST(request: Request) {
  const user = await requireCampaignUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { action, id, answer, assignee } = await request.json()
    if (!idOk(id) || !['handled', 'attach', 'pick', 'release', 'assign'].includes(action)) return NextResponse.json({ error: 'Not a known action' }, { status: 400 })
    if (action === 'pick' || action === 'release' || action === 'assign') {
      const to = String(assignee || '').trim().toLowerCase()
      if (action === 'assign' && (!user.isManager || !CRM_USERS.includes(to))) return NextResponse.json({ error: 'Only a manager can give a university to someone, and only to a person who works in the CRM' }, { status: 403 })
      const result = await mutateUniversities((doc) => {
        const u = doc.universities.find((x) => x.id === id)
        if (!u) return { error: 'That university is not in the list', status: 404 }
        const holder = (u.owner || '').toLowerCase()
        if (action === 'pick') {
          if (holder === user.email) return { university: u }
          if (holder && !user.isManager) return { error: `It is already picked up by ${holder.split('@')[0]}. Ask them, or a manager.`, status: 409 }
          u.owner = user.email
          note(u, user.email, 'owner', 'Picked up')
        } else if (action === 'release') {
          if (!holder) return { university: u }
          if (holder !== user.email && !user.isManager) return { error: `Only ${holder.split('@')[0]} or a manager can release it`, status: 403 }
          u.owner = ''
          note(u, user.email, 'owner', `Released (was ${holder.split('@')[0]})`)
        } else {
          u.owner = to
          note(u, user.email, 'owner', `Given to ${to.split('@')[0]}`)
        }
        return { university: u }
      })
      if ('error' in result) return NextResponse.json({ error: result.error }, { status: result.status })
      return NextResponse.json({ university: result.university })
    }
    if (action === 'attach') {
      if (typeof answer !== 'string' || !/^[a-f0-9]{16}$/.test(answer)) return NextResponse.json({ error: 'Which answer?' }, { status: 400 })
      const done = await mutateUniversities((doc) => {
        const u = doc.universities.find((x) => x.id === id)
        const a = doc.unmatched.find((x) => x.id === answer)
        if (!u || !a) return null
        doc.unmatched = doc.unmatched.filter((x) => x.id !== answer)
        applyFormAnswer(u, { ...a, uni: u.id })
        note(u, user.email, 'form', `Form answer from ${a.reps[0]?.name || a.institution} put on this university: ${a.courses.length} course${a.courses.length === 1 ? '' : 's'}`)
        return u
      })
      if (!done) return NextResponse.json({ error: 'That answer or university is no longer there' }, { status: 404 })
      return NextResponse.json({ university: done })
    }
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
