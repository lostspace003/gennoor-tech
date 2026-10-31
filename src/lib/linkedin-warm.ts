import { credential } from '@/lib/azure-costs'
import { readBlob, writeBlob } from '@/lib/social/studio'

// The LinkedIn connector and the studio service in front of it sleep when idle (scale to zero), which makes the first
// lookup slow. This keeps both awake for a chosen number of hours and puts them back to sleep afterwards, so it only
// costs money while you are working. The site's managed identity has Contributor on just these two container apps.
const SUB = process.env.AZURE_COST_SUBSCRIPTION_ID || '2f55ca6d-7f38-4220-919c-591a66eb1a2b'
const RG = process.env.AZURE_RESOURCE_GROUP || 'rg-gennoor-tech'
export const WARM_APPS = ['ca-gennoor-studio', 'ca-gennoor-linkedin-mcp']
export const WARM_HOURS = [2, 4, 8] as const
const API = '2024-03-01'
const FILE = 'linkedin-hub/warm.json'
const MAX_AHEAD_MS = 7 * 86_400_000

export interface WarmState { on: boolean; until?: string; startAt?: string; note?: string }

async function arm(method: 'GET' | 'PATCH', app: string, body?: unknown) {
  const token = (await credential().getToken('https://management.azure.com/.default'))?.token
  if (!token) throw new Error('Could not sign in to Azure.')
  const res = await fetch(`https://management.azure.com/subscriptions/${SUB}/resourceGroups/${RG}/providers/Microsoft.App/containerApps/${app}?api-version=${API}`, {
    method, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined, signal: AbortSignal.timeout(60_000),
  })
  const j = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(j?.error?.message || `Azure answered ${res.status} for ${app}`)
  return j
}

/** Minimum replicas now set on each app (1 = kept awake, 0 = may sleep). */
export async function liveMin(): Promise<Record<string, number>> {
  const out: Record<string, number> = {}
  for (const a of WARM_APPS) out[a] = (await arm('GET', a))?.properties?.template?.scale?.minReplicas ?? 0
  return out
}

async function setMin(n: 0 | 1) {
  for (const a of WARM_APPS) {
    const cur = await arm('GET', a)
    const max = Math.max(1, cur?.properties?.template?.scale?.maxReplicas ?? 1)
    await arm('PATCH', a, { properties: { template: { scale: { minReplicas: n, maxReplicas: max } } } })
  }
}

export async function loadWarm(): Promise<WarmState> {
  const raw = await readBlob(FILE)
  return raw ? JSON.parse(raw.toString('utf-8')) : { on: false }
}
const saveWarm = (s: WarmState) => writeBlob(FILE, JSON.stringify(s), 'application/json')

/** Keep it awake from now (or from `startAt`) for 2, 4 or 8 hours. */
export async function startWarm(hours: number, startAt?: string, now = new Date()): Promise<WarmState> {
  if (!(WARM_HOURS as readonly number[]).includes(hours)) throw new Error('Choose 2, 4 or 8 hours.')
  const start = startAt ? Date.parse(startAt) : NaN
  if (startAt && !Number.isFinite(start)) throw new Error('That start time is not valid.')
  if (startAt && start > now.getTime() + 60_000) {
    if (start > now.getTime() + MAX_AHEAD_MS) throw new Error('Pick a start time within the next 7 days.')
    const s: WarmState = { on: false, startAt: new Date(start).toISOString(), until: new Date(start + hours * 3_600_000).toISOString() }
    await saveWarm(s); return s
  }
  await setMin(1)
  const s: WarmState = { on: true, until: new Date(now.getTime() + hours * 3_600_000).toISOString() }
  await saveWarm(s); return s
}

export async function stopWarm(): Promise<WarmState> {
  await setMin(0)
  const s: WarmState = { on: false }
  await saveWarm(s); return s
}

/** Heartbeat: start a scheduled warm-up when its time comes, and put everything back to sleep when time is up. */
export async function warmTick(now = new Date()): Promise<string[]> {
  const s = await loadWarm()
  const t = now.getTime()
  if (s.on && s.until && t >= Date.parse(s.until)) { await stopWarm(); return ['warm-up ended, connector may sleep'] }
  if (!s.on && s.startAt && s.until) {
    if (t >= Date.parse(s.until)) { await saveWarm({ on: false }); return ['scheduled warm-up was missed'] }
    if (t >= Date.parse(s.startAt)) { await setMin(1); await saveWarm({ on: true, until: s.until }); return ['warm-up started'] }
  }
  return ['nothing to do']
}
