import { NextRequest, NextResponse } from 'next/server'
import { requireCrmUser, canWorkLead } from '@/lib/crm/access'
import { mutateLeads, getLead, touch } from '@/lib/crm/store'
import { aiConfigured, generatePitchDoc } from '@/lib/crm/ai'
import { buildPitchDocx, buildPitchPdf, pitchDocName } from '@/lib/crm/pitch-docx'
import { uploadDocument } from '@/lib/crm/documents'
import { PitchVersion } from '@/lib/crm/types'
import { formatIstCst } from '@/lib/format-time'

// One-page client-facing pitch document, version-controlled per lead.
// POST {action:'generate'}                 → AI writes v1 (or the next version) from research + copilot chat
// POST {action:'refine', v, instruction}   → copilot revises version v into a new version
// POST {action:'lock', v}                  → freeze v as THE pitch (powers the email draft)
// GET  ?leadId&v&format=docx|pdf           → download that version
// Every generated version is also saved to the document library (pitches/…)
// so admins can view pitches from the Documents panel. Nothing is auto-attached
// to emails — attaching stays a deliberate choice in the composer.

const footerLine = (v: number, by: string, at: string) =>
  `Gennoor Tech · www.gennoor.com · v${v} · prepared by ${by.split('@')[0]} · ${formatIstCst(at)}`

async function saveToLibrary(leadName: string, company: string, ver: PitchVersion): Promise<string | null> {
  try {
    const footer = footerLine(ver.v, ver.by, ver.at)
    const [docx, pdf] = await Promise.all([buildPitchDocx(ver.content, footer), buildPitchPdf(ver.content, footer)])
    await Promise.all([
      uploadDocument(pitchDocName(leadName, company, ver.v, 'docx'), docx, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'),
      uploadDocument(pitchDocName(leadName, company, ver.v, 'pdf'), pdf, 'application/pdf'),
    ])
    return null
  } catch (e: any) {
    console.error('Pitch doc library save failed:', e)
    return 'Version saved, but the file copy to the Documents library failed.'
  }
}

export async function POST(request: Request) {
  const user = await requireCrmUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!aiConfigured()) {
    return NextResponse.json({ error: 'AI is not configured. Set AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_KEY.' }, { status: 503 })
  }

  try {
    const { leadId, action, v, instruction } = await request.json()
    if (!leadId) return NextResponse.json({ error: 'leadId required' }, { status: 400 })

    const lead = await getLead(leadId)
    if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    if (!canWorkLead(lead, user)) {
      return NextResponse.json({ error: `Lead is owned by ${lead.owner.split('@')[0]} — claim it or ask them/a manager.` }, { status: 403 })
    }

    const versions = lead.pitchVersions || []

    if (action === 'lock') {
      const target = versions.find((x) => x.v === Number(v))
      if (!target) return NextResponse.json({ error: `Version v${v} not found` }, { status: 404 })
      await mutateLeads((leads) => {
        const l = leads.find((x) => x.id === leadId)
        if (!l) return
        l.pitchLockedV = target.v
        l.finalizedPitch = target.content
        touch(l, { at: new Date().toISOString(), by: user.email, type: 'chat', description: `Pitch doc v${target.v} locked as final`, stage: l.stage })
      })
      return NextResponse.json({ lockedV: target.v })
    }

    if (action === 'generate' || action === 'refine') {
      let base: PitchVersion | undefined
      if (action === 'refine') {
        base = versions.find((x) => x.v === Number(v)) || versions[versions.length - 1]
        if (!base) return NextResponse.json({ error: 'Nothing to refine yet — generate the pitch doc first' }, { status: 400 })
        if (!instruction || typeof instruction !== 'string') {
          return NextResponse.json({ error: 'instruction required for refine' }, { status: 400 })
        }
      }

      const content = await generatePitchDoc(lead, lead.researchChat, base?.content, instruction)
      if (!content.trim()) return NextResponse.json({ error: 'AI returned an empty document — try again' }, { status: 502 })

      const saved = await mutateLeads<PitchVersion | null>((leads) => {
        const l = leads.find((x) => x.id === leadId)
        if (!l) return null
        const nextV = (l.pitchVersions || []).reduce((max, p) => Math.max(max, p.v), 0) + 1
        const ver: PitchVersion = {
          v: nextV,
          at: new Date().toISOString(),
          by: user.email,
          content,
          instruction: action === 'refine' ? String(instruction).slice(0, 300) : undefined,
        }
        l.pitchVersions = [...(l.pitchVersions || []), ver].slice(-25)
        touch(l, {
          at: ver.at, by: user.email, type: 'chat',
          description: action === 'refine' ? `Pitch doc v${nextV} — refined (“${ver.instruction!.slice(0, 60)}”)` : `Pitch doc v${nextV} generated`,
          stage: l.stage,
        })
        return ver
      })
      if (!saved) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })

      const warning = await saveToLibrary(lead.name, lead.company, saved)
      return NextResponse.json({ version: saved, warning })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (error) {
    console.error('Pitch doc error:', error)
    return NextResponse.json({ error: 'Pitch doc failed. Check Azure OpenAI configuration.' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const user = await requireCrmUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const leadId = req.nextUrl.searchParams.get('leadId') || ''
    const v = Number(req.nextUrl.searchParams.get('v'))
    const format = req.nextUrl.searchParams.get('format') === 'pdf' ? 'pdf' : 'docx'

    const lead = await getLead(leadId)
    if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    const versions = lead.pitchVersions || []
    const ver = versions.find((x) => x.v === v) || versions[versions.length - 1]
    if (!ver) return NextResponse.json({ error: 'No pitch versions yet' }, { status: 404 })

    const footer = footerLine(ver.v, ver.by, ver.at)
    const buffer = format === 'pdf' ? await buildPitchPdf(ver.content, footer) : await buildPitchDocx(ver.content, footer)
    const filename = pitchDocName(lead.name, lead.company, ver.v, format).replace('pitches/', '')

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('Pitch doc download error:', error)
    return NextResponse.json({ error: 'Download failed' }, { status: 500 })
  }
}
