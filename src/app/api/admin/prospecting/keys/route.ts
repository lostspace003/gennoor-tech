import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { addAndCheck, keyStatuses, removeKey, setActive } from '@/lib/prospecting'

export const dynamic = 'force-dynamic'

/** Stored prospecting keys with live credit balances. Keys themselves are never returned, only their last four characters. */
export async function GET(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  return NextResponse.json({ keys: await keyStatuses() })
}

/** Add a key (it is checked first and becomes the active one), switch the active key, or remove one. */
export async function POST(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const b = await req.json().catch(() => ({}))
  try {
    if (b.action === 'add') {
      const key = String(b.key || '').trim()
      if (key.length < 8) return NextResponse.json({ error: 'Paste the full API key.' }, { status: 400 })
      await addAndCheck(String(b.label || ''), key)
    } else if (b.action === 'activate') await setActive(String(b.id || ''))
    else if (b.action === 'remove') await removeKey(String(b.id || ''))
    else return NextResponse.json({ error: 'Unknown action.' }, { status: 400 })
    return NextResponse.json({ keys: await keyStatuses() })
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message || e).slice(0, 200) }, { status: 400 })
  }
}
