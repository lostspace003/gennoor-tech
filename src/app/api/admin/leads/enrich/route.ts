import { NextRequest, NextResponse } from 'next/server'
import { requireCrmUser, canWorkLead } from '@/lib/crm/access'
import { getLeads, mutateLeads, touch } from '@/lib/crm/store'
import { aiConfigured, chatCompletion } from '@/lib/crm/ai'
import { qualificationGaps } from '@/lib/crm/lead-text'
import { COMPANY_SIZES, BUSINESS_FUNCTIONS, LEAD_INTERESTS, DECISION_ROLES } from '@/lib/crm/types'

// POST {leadIds[]} → fills BLANK qualification fields (sector, company size,
// function, interest, decision role) from what the lead row already carries:
// designation, company, website, notes, and any research.
//
// Research weighs these fields above its own inferences, so a blank row gets a
// generic profile no matter how good the prompts are. This closes that gap
// without asking the team to hand-type five dropdowns per lead.
//
// EMPTY-ONLY by design, exactly like /prioritize: a value a human set is never
// overwritten, and emptiness is re-checked at write time.

const ALLOWED: Record<string, readonly string[]> = {
  companySize: COMPANY_SIZES,
  businessFunction: BUSINESS_FUNCTIONS,
  interest: LEAD_INTERESTS,
  decisionRole: DECISION_ROLES,
}

export async function POST(req: NextRequest) {
  const user = await requireCrmUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!aiConfigured()) return NextResponse.json({ error: 'AI not configured' }, { status: 503 })

  try {
    const { leadIds } = await req.json()
    if (!Array.isArray(leadIds) || leadIds.length === 0) {
      return NextResponse.json({ error: 'leadIds required' }, { status: 400 })
    }
    const ids = new Set(leadIds.slice(0, 40).map(String))

    // Only leads this user may work, and only those with something missing
    const all = await getLeads()
    const targets = all.filter((l) => ids.has(l.id) && canWorkLead(l, user) && qualificationGaps(l).length > 0)
    if (targets.length === 0) {
      return NextResponse.json({ updated: 0, filled: {}, note: 'Nothing to fill — the selected leads you can work are already qualified.' })
    }

    const digest = targets
      .map((l) => {
        const gaps = qualificationGaps(l).map((g) => g.key).join(', ')
        return `${l.id} | name: ${l.name} | title: ${l.designation || '-'} | company: ${l.company || '-'} | website: ${l.website || '-'} | country: ${l.country || '-'} | notes: ${(l.notes || '').slice(0, 200)} | research: ${(l.aiResearch?.summary || '').slice(0, 200)} | NEEDS: ${gaps}`
      })
      .join('\n')

    const reply = await chatCompletion(
      [
        {
          role: 'system',
          content: `You qualify B2B sales leads for Gennoor Tech (AI training for organizations and automation).

For each lead, fill ONLY the fields listed in its NEEDS list, inferring from job title, company, website domain and notes. This is classification from evidence, not research — you have no web access.

Allowed values, exactly as written:
- sector: a short industry label, 1-3 words (e.g. "Retail Banking", "Healthcare", "Manufacturing", "Government")
- companySize: ${COMPANY_SIZES.join(' | ')}
- businessFunction: ${BUSINESS_FUNCTIONS.join(' | ')}
- interest: ${LEAD_INTERESTS.join(' | ')}
- decisionRole: ${DECISION_ROLES.join(' | ')}

RULES:
- Omit any field you cannot infer with reasonable confidence. A missing field is far better than a wrong one — the research pass trusts these as facts.
- decisionRole: judge from seniority (Head/Director/VP/C-level = Decision-maker; Manager/Lead = Influencer; Analyst/Engineer/Executive-level IC = End-user).
- interest: only when the notes or title actually point at one. Do not default everyone to "Training".
- companySize: infer from how well-known the organization is and its type; omit when the company is blank or unfamiliar.

Reply with ONLY a JSON object: {"<leadId>": {"sector": "...", "companySize": "...", ...}, ...}. Include only the fields you filled.`,
        },
        { role: 'user', content: digest },
      ],
      { json: true, maxTokens: 1600 }
    )

    const parsed: Record<string, Record<string, string>> = JSON.parse(reply.replace(/^```(json)?|```$/gm, '').trim())
    const filled: Record<string, string[]> = {}

    const updated = await mutateLeads((leads) => {
      let count = 0
      for (const lead of leads) {
        if (!ids.has(lead.id) || !canWorkLead(lead, user)) continue
        const suggestion = parsed[lead.id]
        if (!suggestion || typeof suggestion !== 'object') continue

        const applied: string[] = []
        for (const [key, rawValue] of Object.entries(suggestion)) {
          const value = String(rawValue || '').trim()
          if (!value) continue
          if (!(key in ALLOWED) && key !== 'sector') continue
          // Re-check emptiness at write time — someone may have typed it since
          if (String((lead as any)[key] || '').trim()) continue
          // Enum fields must match the CRM's own options, case-insensitively
          if (key in ALLOWED) {
            const match = ALLOWED[key].find((o) => o.toLowerCase() === value.toLowerCase())
            if (!match) continue
            ;(lead as any)[key] = match
          } else {
            ;(lead as any)[key] = value.slice(0, 60)
          }
          applied.push(key)
        }
        if (applied.length === 0) continue
        filled[lead.id] = applied
        touch(lead, {
          at: new Date().toISOString(),
          by: user.email,
          type: 'updated',
          description: `AI filled blank qualification: ${applied.join(', ')}`,
          stage: lead.stage,
        })
        count++
      }
      return count
    })

    return NextResponse.json({ updated, filled })
  } catch (error) {
    console.error('Enrich error:', error)
    return NextResponse.json({ error: 'AI enrichment failed' }, { status: 500 })
  }
}
