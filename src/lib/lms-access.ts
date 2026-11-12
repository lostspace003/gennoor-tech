import { TableClient } from '@azure/data-tables'
import { getLmsCourse, getStorage, isEnrolled, listLmsCourses, type LmsCourse, type LmsLecture } from '@/lib/lms'
import { readBlob, writeBlob } from '@/lib/social/studio'

/**
 * Who can watch what in the Learning Studio.
 *
 *  - A few lessons of every course are PREVIEWS: anyone can watch them, signed in or not.
 *  - The rest of a paid course opens once the learner has BOUGHT it.
 *  - A course with no price is free: signing in and enrolling opens all of it, as before.
 *
 * Prices are per course, in US dollars with a rupee price beside it for buyers in India
 * (Razorpay can only take UPI and net banking in rupees).
 */

// ---------------------------------------------------------------- previews

/** How many lessons of every course are free previews. */
export const PREVIEW_MAX = 6

const lectures = (course: LmsCourse): LmsLecture[] =>
  course.sections.flatMap((s) => s.items).filter((i): i is LmsLecture => i.type === 'lecture')

/** A fixed number from a piece of text (FNV-1a). The same text always gives the same number. */
function hash(text: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

/**
 * The ids of the lessons anyone may watch, in course order.
 *
 * Nobody has to choose them. If the course file marks previews, those are used.
 * Otherwise six are picked for the course: its first lesson (the introduction),
 * and five drawn from across the rest. The draw is random-looking but fixed for
 * each course, so every visitor sees the same six and reloading the page cannot
 * be used to watch the whole course. It changes only if lessons are added or removed.
 */
export function previewIds(course: LmsCourse): string[] {
  const all = lectures(course)
  const marked = all.filter((l) => l.preview)
  if (marked.length) return marked.slice(0, PREVIEW_MAX).map((l) => l.id)
  if (all.length <= PREVIEW_MAX) return all.map((l) => l.id)
  const [first, ...rest] = all
  const drawn = rest
    .map((l) => ({ id: l.id, rank: hash(`${course.slug}:${l.id}`) }))
    .sort((a, b) => a.rank - b.rank)
    .slice(0, PREVIEW_MAX - 1)
    .map((x) => x.id)
  const chosen = new Set([first.id, ...drawn])
  return all.filter((l) => chosen.has(l.id)).map((l) => l.id)
}

export const isPreview = (course: LmsCourse, itemId: string) => previewIds(course).includes(itemId)

// ---------------------------------------------------------------- prices

export interface CoursePrice { usd: number; inr: number }

/** What every published course costs unless it has its own price. */
export const DEFAULT_PRICE: CoursePrice = { usd: 9.99, inr: 849 }

/** Stored per course: a price, or `free: true` to keep that course open. */
export type PriceSetting = { usd: number; inr: number; free?: false } | { free: true }

const PRICES_BLOB = 'lms/prices.json'
let priceCache: { at: number; prices: Record<string, PriceSetting> } | null = null

export async function getPriceSettings(force = false): Promise<Record<string, PriceSetting>> {
  if (!force && priceCache && Date.now() - priceCache.at < 60_000) return priceCache.prices
  let prices: Record<string, PriceSetting> = {}
  try {
    const raw = await readBlob(PRICES_BLOB)
    if (raw) prices = JSON.parse(raw.toString('utf-8'))
  } catch {
    // storage unreachable: fall back to the default price rather than giving courses away
  }
  priceCache = { at: Date.now(), prices }
  return prices
}

export async function savePriceSetting(slug: string, setting: PriceSetting | null): Promise<void> {
  const prices = { ...(await getPriceSettings(true)) }
  if (setting) prices[slug] = setting
  else delete prices[slug]
  await writeBlob(PRICES_BLOB, JSON.stringify(prices), 'application/json')
  priceCache = { at: Date.now(), prices }
}

/** The price of a course, or null when it is free. */
export async function priceOf(slug: string): Promise<CoursePrice | null> {
  const s = (await getPriceSettings())[slug]
  if (!s) return DEFAULT_PRICE
  if (s.free) return null
  return { usd: s.usd, inr: s.inr }
}

export const formatUsd = (n: number) => `$${n.toFixed(2)}`
export const formatInr = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`

// ---------------------------------------------------------------- purchases

const tables = new Map<string, TableClient>()
const ready = new Set<string>()
async function table(name: string): Promise<TableClient> {
  let t = tables.get(name)
  if (!t) {
    t = TableClient.fromConnectionString(getStorage().conn, name)
    tables.set(name, t)
  }
  if (!ready.has(name)) {
    try { await t.createTable() } catch (e: any) { if (e?.statusCode !== 409) throw e }
    ready.add(name)
  }
  return t
}
const key = (email: string) => email.trim().toLowerCase()

export interface Purchase {
  email: string
  name: string
  slug: string
  courseTitle: string
  /** In the currency's main unit: 9.99 or 849 */
  amount: number
  currency: 'USD' | 'INR'
  orderId: string
  paymentId: string
  at: string
}

export async function hasPurchased(email: string, slug: string): Promise<boolean> {
  try {
    await (await table('LmsPurchases')).getEntity(key(email), slug)
    return true
  } catch (e: any) {
    if (e?.statusCode === 404) return false
    throw e
  }
}

export async function listPurchases(): Promise<Purchase[]> {
  const out: Purchase[] = []
  for await (const e of (await table('LmsPurchases')).listEntities<Record<string, unknown>>()) {
    out.push({
      email: String(e.partitionKey), slug: String(e.rowKey), name: String(e.name || ''), courseTitle: String(e.courseTitle || ''),
      amount: Number(e.amount || 0), currency: e.currency === 'INR' ? 'INR' : 'USD',
      orderId: String(e.orderId || ''), paymentId: String(e.paymentId || ''), at: String(e.at || ''),
    })
  }
  return out.sort((a, b) => b.at.localeCompare(a.at))
}

/** The courses one learner has bought. */
export async function purchasedSlugs(email: string): Promise<string[]> {
  const out: string[] = []
  const filter = `PartitionKey eq '${key(email).replace(/'/g, "''")}'`
  for await (const e of (await table('LmsPurchases')).listEntities({ queryOptions: { filter } })) out.push(String(e.rowKey))
  return out
}

// An order is opened when someone presses Buy and is settled when Razorpay confirms the payment.
export interface CourseOrder { orderId: string; email: string; name: string; slug: string; amount: number; currency: 'USD' | 'INR'; status: 'open' | 'paid'; at: string }

export async function saveOrder(o: CourseOrder): Promise<void> {
  await (await table('LmsOrders')).upsertEntity({ partitionKey: 'order', rowKey: o.orderId, ...o }, 'Replace')
}

export async function getOrder(orderId: string): Promise<CourseOrder | null> {
  try {
    const e = await (await table('LmsOrders')).getEntity<Record<string, unknown>>('order', orderId)
    return {
      orderId, email: String(e.email), name: String(e.name || ''), slug: String(e.slug), amount: Number(e.amount),
      currency: e.currency === 'INR' ? 'INR' : 'USD', status: e.status === 'paid' ? 'paid' : 'open', at: String(e.at || ''),
    }
  } catch (e: any) {
    if (e?.statusCode === 404) return null
    throw e
  }
}

/**
 * Settle an order: record the purchase. Returns the purchase when this call is the one
 * that settled it, null when it was already settled (browser and webhook both report a
 * payment) or the order is not one of ours.
 */
export async function settleOrder(orderId: string, paymentId: string): Promise<Purchase | null> {
  const order = await getOrder(orderId)
  if (!order || order.status === 'paid') return null
  const course = await getLmsCourse(order.slug)
  const purchase: Purchase = {
    email: key(order.email), name: order.name, slug: order.slug, courseTitle: course?.title || order.slug,
    amount: order.amount, currency: order.currency, orderId, paymentId, at: new Date().toISOString(),
  }
  await (await table('LmsPurchases')).upsertEntity({ partitionKey: purchase.email, rowKey: purchase.slug, ...purchase }, 'Replace')
  await saveOrder({ ...order, status: 'paid' })
  return purchase
}

// ---------------------------------------------------------------- the rule

/** True when this learner may open every lesson, lab and quiz of the course. */
export async function hasFullAccess(email: string, slug: string): Promise<boolean> {
  const price = await priceOf(slug)
  return price ? hasPurchased(email, slug) : isEnrolled(email, slug)
}

/** Every published course with its price, for the staff page. */
export async function coursePriceList(): Promise<Array<{ slug: string; code: string; title: string; price: CoursePrice | null; custom: boolean; previews: number }>> {
  const settings = await getPriceSettings(true)
  const courses = await listLmsCourses()
  return Promise.all(courses.map(async (c) => ({
    slug: c.slug, code: c.code, title: c.title, price: await priceOf(c.slug), custom: !!settings[c.slug], previews: previewIds(c).length,
  })))
}
