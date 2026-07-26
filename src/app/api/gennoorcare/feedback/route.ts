import { NextRequest, NextResponse } from 'next/server'
import { appendLog } from '@/lib/bot/store'

// PUBLIC, write-only: visitor's skippable end-of-chat feedback → the log
// that feeds the weekly business report.
const dayHits = new Map<string, { date: string; n: number }>()

export async function POST(req: NextRequest) {
  try {
    const ip = (req.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim()
    const today = new Date().toISOString().slice(0, 10)
    const day = dayHits.get(ip)
    if (day?.date === today && day.n >= 5) return NextResponse.json({ success: true })
    dayHits.set(ip, { date: today, n: (day?.date === today ? day.n : 0) + 1 })

    const { sessionId, helpful, comment } = await req.json()
    await appendLog({
      at: new Date().toISOString(),
      sessionId: String(sessionId || 'anon').slice(0, 40),
      q: '[feedback]',
      a: `${helpful ? '👍 helpful' : '👎 not helpful'}${comment ? ` — ${String(comment).slice(0, 240)}` : ''}`,
      links: [],
    })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: true }) // feedback must never error at the visitor
  }
}
