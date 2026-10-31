import { randomBytes } from 'crypto'
import { readBlob, writeBlob } from '@/lib/social/studio'
import { DAILY_READ_CAP, toolByName } from '@/lib/linkedin-catalog'

// Every call made through the hub is journalled here: it powers the daily safety limits, the Activity view and
// the cross-feature Sessions timeline. One append-only blob, trimmed to the most recent entries.
const FILE = 'linkedin-hub/activity.json'
const KEEP = 3000

export interface Activity {
  id: string; at: string; tool: string; label: string; kind: 'read' | 'action'; area: string
  summary: string; ok: boolean; cached: boolean; ms: number; error?: string
}

export async function listActivity(): Promise<Activity[]> {
  const raw = await readBlob(FILE)
  return raw ? JSON.parse(raw.toString('utf-8')) : []
}

export async function logActivity(a: Omit<Activity, 'id' | 'at'>) {
  const all = await listActivity()
  all.push({ id: randomBytes(5).toString('hex'), at: new Date().toISOString(), ...a })
  await writeBlob(FILE, JSON.stringify(all.slice(-KEEP)), 'application/json')
}

/** Today's usage against each limit (UTC day). Cached reads and failed calls do not count. */
export function usageToday(all: Activity[]) {
  const day = new Date().toISOString().slice(0, 10)
  const today = all.filter(a => a.at.startsWith(day) && a.ok && !a.cached)
  const byTool: Record<string, number> = {}
  for (const a of today) byTool[a.tool] = (byTool[a.tool] || 0) + 1
  return { reads: today.filter(a => a.kind === 'read').length, readCap: DAILY_READ_CAP, byTool }
}

export function limitFor(tool: string, all: Activity[]): string | null {
  const def = toolByName(tool)
  if (!def) return 'Unknown tool.'
  const u = usageToday(all)
  if (def.kind === 'action' && def.cap && (u.byTool[tool] || 0) >= def.cap) return `Daily limit reached for "${def.label}" (${def.cap} a day). This protects your LinkedIn account. Try again tomorrow.`
  if (def.kind === 'read' && u.reads >= u.readCap) return `Daily read limit reached (${u.readCap} lookups). This protects your LinkedIn account. Try again tomorrow.`
  return null
}

/** A short, safe description of what was asked, for the log (never message bodies in full). */
export function summarise(tool: string, args: Record<string, unknown>) {
  const pick = ['keywords', 'linkedin_username', 'company_name', 'job_id', 'thread_id'].map(k => args[k]).filter(Boolean)[0]
  const note = tool === 'send_message' ? ` (${String(args.message || '').length} chars)` : ''
  return `${pick ? String(pick).slice(0, 80) : ''}${note}`.trim()
}
