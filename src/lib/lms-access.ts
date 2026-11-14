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
 * Prices are per course: a dollar price, and a rupee price for buyers in India (Razorpay can only take
 * UPI and net banking in rupees). A visitor is shown one of the two, never both: src/lib/money.ts.
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
export const DEFAULT_PRICE: CoursePrice = { usd: 19.99, inr: 849 }

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

// ---------------------------------------------------------------- offers

/**
 * An offer shows a course as discounted: the price people pay stays the course's
 * price, and a higher regular price is shown struck through beside it.
 *
 * Each course's offer is switched on or off on the staff Payments page. Until
 * someone does, certification and project courses carry an offer of 30, 40 or
 * 50 percent (fixed per course, so it does not change between visits) and
 * every other course carries none.
 */
export interface OfferSetting { on: boolean; percent: number }
export interface CourseOffer { percent: number; regular: CoursePrice }

const OFFER_CHOICES = [30, 40, 50]
const OFFERS_BLOB = 'lms/offers.json'
let offerCache: { at: number; offers: Record<string, OfferSetting> } | null = null

export async function getOfferSettings(force = false): Promise<Record<string, OfferSetting>> {
  if (!force && offerCache && Date.now() - offerCache.at < 60_000) return offerCache.offers
  let offers: Record<string, OfferSetting> = {}
  try {
    const raw = await readBlob(OFFERS_BLOB)
    if (raw) offers = JSON.parse(raw.toString('utf-8'))
  } catch {
    // storage unreachable: the standard offers apply
  }
  offerCache = { at: Date.now(), offers }
  return offers
}

export async function saveOfferSetting(slug: string, setting: OfferSetting): Promise<void> {
  const offers = { ...(await getOfferSettings(true)), [slug]: setting }
  await writeBlob(OFFERS_BLOB, JSON.stringify(offers), 'application/json')
  offerCache = { at: Date.now(), offers }
}

/** The offer setting of a course: what staff chose, or the standard one for its kind. */
export async function offerSettingOf(course: Pick<LmsCourse, 'slug' | 'kind'>): Promise<OfferSetting> {
  const s = (await getOfferSettings())[course.slug]
  if (s) return { on: !!s.on, percent: s.percent }
  return {
    on: course.kind === 'certification' || course.kind === 'project',
    percent: OFFER_CHOICES[hash(`${course.slug}:offer`) % OFFER_CHOICES.length],
  }
}

/** The regular price that goes with a price and a percent off. */
export function regularPrice(price: CoursePrice, percent: number): CoursePrice {
  const keep = 1 - percent / 100
  return { usd: Math.round((price.usd / keep) * 100) / 100, inr: Math.round(price.inr / keep) }
}

/** The offer to show on a course, or null when it has none (or is free). */
export async function offerOf(course: Pick<LmsCourse, 'slug' | 'kind'>, price?: CoursePrice | null): Promise<CourseOffer | null> {
  const p = price === undefined ? await priceOf(course.slug) : price
  if (!p) return null
  const s = await offerSettingOf(course)
  if (!s.on || !(s.percent >= 5 && s.percent <= 90)) return null
  return { percent: s.percent, regular: regularPrice(p, s.percent) }
}

// ---------------------------------------------------------------- purchases

const tables = new Map<string, TableClient>()
const ready = new Set<string>()
export async function table(name: string): Promise<TableClient> {
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
export const key = (email: string) => email.trim().toLowerCase()

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
  /** The coupon code used, when there was one */
  coupon?: string
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
      coupon: e.coupon ? String(e.coupon) : undefined,
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
export interface CourseOrder { orderId: string; email: string; name: string; slug: string; amount: number; currency: 'USD' | 'INR'; status: 'open' | 'paid'; at: string; coupon?: string }

export async function saveOrder(o: CourseOrder): Promise<void> {
  await (await table('LmsOrders')).upsertEntity({ partitionKey: 'order', rowKey: o.orderId, ...o }, 'Replace')
}

export async function getOrder(orderId: string): Promise<CourseOrder | null> {
  try {
    const e = await (await table('LmsOrders')).getEntity<Record<string, unknown>>('order', orderId)
    return {
      orderId, email: String(e.email), name: String(e.name || ''), slug: String(e.slug), amount: Number(e.amount),
      currency: e.currency === 'INR' ? 'INR' : 'USD', status: e.status === 'paid' ? 'paid' : 'open', at: String(e.at || ''),
      coupon: e.coupon ? String(e.coupon) : undefined,
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
    ...(order.coupon ? { coupon: order.coupon } : {}),
  }
  await recordPurchase(purchase)
  await saveOrder({ ...order, status: 'paid' })
  return purchase
}

/** Write a purchase: from here on the learner owns the course. */
export async function recordPurchase(purchase: Purchase): Promise<void> {
  await (await table('LmsPurchases')).upsertEntity({ partitionKey: key(purchase.email), rowKey: purchase.slug, ...purchase, email: key(purchase.email) }, 'Replace')
}

// ---------------------------------------------------------------- the rule

/** True when this learner may open every lesson, lab and quiz of the course. */
export async function hasFullAccess(email: string, slug: string): Promise<boolean> {
  const price = await priceOf(slug)
  return price ? hasPurchased(email, slug) : isEnrolled(email, slug)
}

/** Every published course with its price, for the staff page. */
export async function coursePriceList(): Promise<Array<{ slug: string; code: string; title: string; kind: string; price: CoursePrice | null; custom: boolean; previews: number; offer: OfferSetting; regular: CoursePrice | null }>> {
  const settings = await getPriceSettings(true)
  await getOfferSettings(true)
  const courses = await listLmsCourses()
  return Promise.all(courses.map(async (c) => {
    const price = await priceOf(c.slug)
    const offer = await offerSettingOf(c)
    return {
      slug: c.slug, code: c.code, title: c.title, kind: c.kind || 'course', price, custom: !!settings[c.slug], previews: previewIds(c).length,
      offer, regular: price && offer.on ? regularPrice(price, offer.percent) : null,
    }
  }))
}
