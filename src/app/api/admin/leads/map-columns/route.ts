import { NextResponse } from 'next/server'
import { requireCrmUser } from '@/lib/crm/access'
import { aiConfigured, chatCompletion } from '@/lib/crm/ai'

const TEMPLATE_FIELDS = [
  'Name', 'Email', 'Phone', 'Company', 'Designation', 'LinkedIn', 'Website',
  'Priority', 'Lead Type', 'Company Size', 'Function', 'Interest', 'Decision Role',
  'Sector / Segment', 'Region', 'Country', 'City', 'Notes',
] as const

// AI column mapping for non-template spreadsheets: given the sheet's headers
// and a few sample rows, returns which source column feeds each template
// field. Mapping only — actual data never leaves the browser unparsed.
export async function POST(request: Request) {
  const user = await requireCrmUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!aiConfigured()) {
    return NextResponse.json({ error: 'AI is not configured — use the template format.' }, { status: 503 })
  }

  try {
    const { headers, samples } = await request.json()
    if (!Array.isArray(headers) || headers.length === 0) {
      return NextResponse.json({ error: 'headers required' }, { status: 400 })
    }

    const content = await chatCompletion(
      [
        {
          role: 'system',
          content: `You map spreadsheet columns to a CRM lead template. Template fields: ${TEMPLATE_FIELDS.join(', ')}.
Rules: map each template field to EXACTLY ONE source header, or null when no column fits. Never map the same source header twice (pick the best fit). "Name" means the person's full name, not the company. A column of job titles → Designation. A column with URLs containing linkedin → LinkedIn. Scores/priorities like High/Medium/Low or 1-10 → Priority. Org headcount/size bands → Company Size. Department/team names → Function. What they want to buy (training/POC/development/advisory) → Interest. Buying authority (decision maker/influencer/user) → Decision Role. Free-text remarks/tips/skills → Notes.
Return ONLY JSON: {"mapping": {"Name": "<source header or null>", ...all ${TEMPLATE_FIELDS.length} template fields...}, "confidence": "high|medium|low", "note": "one short sentence about anything ambiguous"}`,
        },
        {
          role: 'user',
          content: `Source headers: ${JSON.stringify(headers)}\nSample rows: ${JSON.stringify((samples || []).slice(0, 3)).slice(0, 3000)}`,
        },
      ],
      { json: true, maxTokens: 600 }
    )
    const parsed = JSON.parse(content)
    const mapping: Record<string, string | null> = {}
    for (const field of TEMPLATE_FIELDS) {
      const src = parsed.mapping?.[field]
      mapping[field] = typeof src === 'string' && headers.includes(src) ? src : null
    }
    return NextResponse.json({ mapping, confidence: parsed.confidence || 'medium', note: parsed.note || '' })
  } catch (error) {
    console.error('Column mapping error:', error)
    return NextResponse.json({ error: 'AI mapping failed — try the template format.' }, { status: 500 })
  }
}
