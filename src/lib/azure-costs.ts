import { AzureCliCredential, ChainedTokenCredential, ClientSecretCredential, ManagedIdentityCredential, type TokenCredential } from '@azure/identity'

// Whole-subscription Azure cost, read from the Cost Management Query API and bucketed to the Visual Studio
// subscription's billing cycle (default: the 13th to the 12th) so "month" and "quarter" match the invoice.
// Auth: AZURE_COST_CLIENT_ID/SECRET/TENANT_ID if set, else the App Service managed identity (or `az login`
// locally). Either needs the "Cost Management Reader" role on the subscription.
const SUB = process.env.AZURE_COST_SUBSCRIPTION_ID || '2f55ca6d-7f38-4220-919c-591a66eb1a2b'
export const CYCLE_DAY = Math.min(28, Math.max(1, Number(process.env.AZURE_BILLING_CYCLE_DAY || 13)))
const USD_PER_INR = 1 / Number(process.env.AZURE_COST_USD_INR || 88)

export type Granularity = 'day' | 'week' | 'month' | 'cycle' | 'quarter'
export type GroupBy = 'ServiceName' | 'ResourceGroupName' | 'ResourceType' | 'ResourceLocation'
export const GROUPS: GroupBy[] = ['ServiceName', 'ResourceGroupName', 'ResourceType', 'ResourceLocation']

export interface Bucket { key: string; label: string; start: string; end: string; total: number; byGroup: Record<string, number> }
export interface CostReport {
  currency: string; usdPerInr: number; cycleDay: number; from: string; to: string
  total: number; buckets: Bucket[]; groups: { name: string; total: number }[]; fetchedAt: string
}

let cred: TokenCredential | undefined
export function credential() {
  if (cred) return cred
  const { AZURE_COST_CLIENT_ID: id, AZURE_COST_CLIENT_SECRET: secret, AZURE_COST_TENANT_ID: tenant } = process.env
  cred = id && secret && tenant ? new ClientSecretCredential(tenant, id, secret) : new ChainedTokenCredential(new ManagedIdentityCredential(), new AzureCliCredential({ subscription: SUB }))
  return cred
}

const iso = (d: Date) => d.toISOString().slice(0, 10)
const addDays = (s: string, n: number) => { const d = new Date(`${s}T00:00:00Z`); d.setUTCDate(d.getUTCDate() + n); return iso(d) }
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const fmt = (s: string) => `${Number(s.slice(8))} ${MONTHS[Number(s.slice(5, 7)) - 1]}`
const fmtY = (s: string) => `${fmt(s)} ${s.slice(0, 4)}`

/** Start (inclusive) of the billing cycle that contains the date. */
export function cycleStart(date: string): string {
  const y = Number(date.slice(0, 4)), m = Number(date.slice(5, 7)), d = Number(date.slice(8))
  const dt = d >= CYCLE_DAY ? new Date(Date.UTC(y, m - 1, CYCLE_DAY)) : new Date(Date.UTC(y, m - 2, CYCLE_DAY))
  return iso(dt)
}
const nextCycle = (start: string) => { const d = new Date(`${start}T00:00:00Z`); return iso(new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, CYCLE_DAY))) }
/** Billing quarter: three cycles starting in Jan, Apr, Jul or Oct on the cycle day. */
function quarterStart(date: string): string {
  const c = cycleStart(date)
  const m = Number(c.slice(5, 7)) - 1
  return iso(new Date(Date.UTC(Number(c.slice(0, 4)), m - (m % 3), CYCLE_DAY)))
}
const nextQuarter = (start: string) => { const d = new Date(`${start}T00:00:00Z`); return iso(new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 3, CYCLE_DAY))) }

function bucketOf(date: string, g: Granularity): { key: string; label: string; start: string; end: string } {
  if (g === 'day') return { key: date, label: fmt(date), start: date, end: date }
  if (g === 'week') {
    const dow = (new Date(`${date}T00:00:00Z`).getUTCDay() + 6) % 7
    const s = addDays(date, -dow)
    return { key: s, label: `${fmt(s)} – ${fmt(addDays(s, 6))}`, start: s, end: addDays(s, 6) }
  }
  if (g === 'month') {
    const s = `${date.slice(0, 7)}-01`
    const e = iso(new Date(Date.UTC(Number(date.slice(0, 4)), Number(date.slice(5, 7)), 0)))
    return { key: s, label: `${MONTHS[Number(date.slice(5, 7)) - 1]} ${date.slice(0, 4)}`, start: s, end: e }
  }
  if (g === 'cycle') {
    const s = cycleStart(date), e = addDays(nextCycle(s), -1)
    return { key: s, label: `${fmt(s)} – ${fmtY(e)}`, start: s, end: e }
  }
  const s = quarterStart(date), e = addDays(nextQuarter(s), -1)
  return { key: s, label: `${fmt(s)} – ${fmtY(e)}`, start: s, end: e }
}

const cache = new Map<string, { at: number; report: CostReport }>()
const TTL = 15 * 60 * 1000

export async function costReport(from: string, to: string, granularity: Granularity, groupBy: GroupBy): Promise<CostReport> {
  const days = (Date.parse(to) - Date.parse(from)) / 86_400_000
  if (!(days >= 0) || days > 365) throw new Error('Choose a range of up to 12 months.')
  // Fetch daily once per range+grouping; bucketing happens locally so granularity changes are instant.
  const ck = `${from}|${to}|${groupBy}`
  let daily = cache.get(ck)
  if (!daily || Date.now() - daily.at > TTL) {
    const token = (await credential().getToken('https://management.azure.com/.default'))?.token
    if (!token) throw new Error('Could not get an Azure token for Cost Management.')
    const rows: Record<string, unknown>[] = []
    let url: string | null = `https://management.azure.com/subscriptions/${SUB}/providers/Microsoft.CostManagement/query?api-version=2023-11-01`
    const body = JSON.stringify({
      type: 'ActualCost', timeframe: 'Custom', timePeriod: { from, to },
      dataset: { granularity: 'Daily', aggregation: { totalCost: { name: 'Cost', function: 'Sum' } }, grouping: [{ type: 'Dimension', name: groupBy }] },
    })
    for (let page = 0; url && page < 20; page++) {
      let res: Response = await fetch(url, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body })
      if (res.status === 429) {
        await new Promise(r => setTimeout(r, Math.min(15, Number(res.headers.get('retry-after') || 5)) * 1000))
        res = await fetch(url, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body })
      }
      const j: any = await res.json().catch(() => ({}))
      if (!res.ok) {
        const msg = j?.error?.message || `Cost Management returned ${res.status}`
        throw new Error(res.status === 403 ? `${msg} The identity needs the Cost Management Reader role on the subscription.` : msg)
      }
      const cols: string[] = (j.properties?.columns || []).map((c: { name: string }) => c.name)
      for (const r of j.properties?.rows || []) rows.push(Object.fromEntries(cols.map((c, i) => [c, r[i]])))
      url = j.properties?.nextLink || null
    }
    const entries = rows.map(r => {
      const d = String(r.UsageDate)
      return { date: `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`, group: String(r[groupBy] || 'Other') || 'Other', cost: Number(r.Cost) || 0, currency: String(r.Currency || 'INR') }
    })
    daily = { at: Date.now(), report: { entries, currency: entries[0]?.currency || 'INR' } as unknown as CostReport }
    cache.set(ck, daily)
  }
  const { entries, currency } = daily.report as unknown as { entries: { date: string; group: string; cost: number }[]; currency: string }

  const buckets = new Map<string, Bucket>()
  const groups = new Map<string, number>()
  let total = 0
  for (const e of entries) {
    const b = bucketOf(e.date, granularity)
    const cur = buckets.get(b.key) || { ...b, total: 0, byGroup: {} }
    cur.total += e.cost
    cur.byGroup[e.group] = (cur.byGroup[e.group] || 0) + e.cost
    buckets.set(b.key, cur)
    groups.set(e.group, (groups.get(e.group) || 0) + e.cost)
    total += e.cost
  }
  return {
    currency, usdPerInr: USD_PER_INR, cycleDay: CYCLE_DAY, from, to, total,
    buckets: [...buckets.values()].sort((a, b) => a.key.localeCompare(b.key)),
    groups: [...groups.entries()].map(([name, t]) => ({ name, total: t })).sort((a, b) => b.total - a.total),
    fetchedAt: new Date().toISOString(),
  }
}
