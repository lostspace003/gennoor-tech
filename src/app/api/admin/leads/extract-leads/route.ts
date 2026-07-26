import { NextResponse } from 'next/server'
import { requireCrmUser } from '@/lib/crm/access'
import { aiConfigured, chatCompletion } from '@/lib/crm/ai'

const CHUNK = 11_000

// AI lead extraction from unstructured text (meeting notes, markdown lists,
// reports). Strict rule: only what the text states — nothing invented.
export async function POST(request: Request) {
  const user = await requireCrmUser()
  if (!user?.isManager) return NextResponse.json({ error: 'Only managers can import leads' }, { status: 403 })
  if (!aiConfigured()) return NextResponse.json({ error: 'AI is not configured.' }, { status: 503 })

  try {
    const { text } = await request.json()
    if (!text || typeof text !== 'string') return NextResponse.json({ error: 'text required' }, { status: 400 })

    const chunks: string[] = []
    for (let i = 0; i < Math.min(text.length, 44_000); i += CHUNK) chunks.push(text.slice(i, i + CHUNK))

    const all: any[] = []
    for (const chunk of chunks) {
      const content = await chatCompletion(
        [
          {
            role: 'system',
            content: 'Extract every person/company contact in the text as CRM leads. Fields: name (required — the PERSON\'s name; if only a company is mentioned use the company name and note it), email, phone, company, designation, linkedin, website, country, city, notes (short context from the text, e.g. what they want). ONLY include what the text states — never invent emails, numbers or facts. Return JSON {"leads":[...]} — empty array if none.',
          },
          { role: 'user', content: chunk },
        ],
        { json: true, maxTokens: 1600 }
      )
      const parsed = JSON.parse(content)
      if (Array.isArray(parsed.leads)) all.push(...parsed.leads)
    }

    // De-dupe within the extraction (chunk overlap safety)
    const seen = new Set<string>()
    const leads = all.filter((l) => {
      if (!l?.name) return false
      const key = `${String(l.name).toLowerCase()}|${String(l.company || '').toLowerCase()}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })

    return NextResponse.json({ leads, truncated: text.length > 44_000 })
  } catch (error) {
    console.error('Extract leads error:', error)
    return NextResponse.json({ error: 'AI extraction failed' }, { status: 500 })
  }
}
