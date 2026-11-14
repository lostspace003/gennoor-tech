import { randomInt } from 'crypto'
import { key, table, type CoursePrice } from '@/lib/lms-access'

/**
 * Coupon codes for Learning Studio courses and for the AI Weekend.
 *
 * Staff create a code on the Payments page: how much it takes off (100 leaves
 * nothing to pay), until when it works, how many people may use it, and what
 * it is good for: every course, one course, the AI Weekend, or everything.
 * A buyer types the code on the course page, or in the AI Weekend's form.
 * Each person counts once per course (or per weekend), and a use is counted
 * when the course or the seat becomes theirs (payment confirmed, or at once
 * for a code that leaves nothing to pay).
 */

/** In a coupon's `slug`: the code is for the AI Weekend. No course has this address. */
export const WEEKEND_SCOPE = 'ai-weekend'
/** In a coupon's `slug`: the code is for every course and for the AI Weekend. */
export const EVERYTHING = '*'
/** What a use of a code for one weekend is counted under, so the same person can use a code again another month. */
export const weekendUse = (cohort: string) => `${WEEKEND_SCOPE}:${cohort}`

export interface Coupon {
  code: string
  /** Percent taken off the course price, 1 to 100. 100 gives the course free. */
  percent: number
  /** The one course it works for; '' for every course; WEEKEND_SCOPE for the AI Weekend; EVERYTHING for both */
  slug: string
  /** ISO time after which it stops working, or '' for no end */
  expiresAt: string
  /** How many people may use it, or 0 for no limit */
  maxUses: number
  uses: number
  active: boolean
  note: string
  createdAt: string
  createdBy: string
}

const COUPONS = 'LmsCoupons'
const USES = 'LmsCouponUses'
const PK = 'coupon'

export const normalCode = (raw: unknown) => String(raw || '').trim().toUpperCase().replace(/\s+/g, '')
export const validCode = (code: string) => /^[A-Z0-9-]{3,24}$/.test(code)

/** A fresh code such as GEN-7KQ2MX. No letters or digits that are easy to mix up. */
export function newCode(): string {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let out = ''
  for (let i = 0; i < 6; i++) out += letters[randomInt(letters.length)]
  return `GEN-${out}`
}

function toCoupon(e: Record<string, unknown>): Coupon {
  return {
    code: String(e.rowKey), percent: Number(e.percent || 0), slug: String(e.slug || ''), expiresAt: String(e.expiresAt || ''),
    maxUses: Number(e.maxUses || 0), uses: Number(e.uses || 0), active: e.active !== false, note: String(e.note || ''),
    createdAt: String(e.createdAt || ''), createdBy: String(e.createdBy || ''),
  }
}

export async function getCoupon(code: string): Promise<Coupon | null> {
  if (!validCode(code)) return null
  try {
    return toCoupon(await (await table(COUPONS)).getEntity<Record<string, unknown>>(PK, code))
  } catch (e: any) {
    if (e?.statusCode === 404) return null
    throw e
  }
}

export async function listCoupons(): Promise<Coupon[]> {
  const out: Coupon[] = []
  for await (const e of (await table(COUPONS)).listEntities<Record<string, unknown>>()) out.push(toCoupon(e))
  return out.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

/** Create a coupon. Returns false when the code is already taken. */
export async function createCoupon(c: Omit<Coupon, 'uses' | 'active' | 'createdAt'>): Promise<boolean> {
  try {
    await (await table(COUPONS)).createEntity({ partitionKey: PK, rowKey: c.code, ...c, uses: 0, active: true, createdAt: new Date().toISOString() })
    return true
  } catch (e: any) {
    if (e?.statusCode === 409) return false
    throw e
  }
}

export async function setCouponActive(code: string, active: boolean): Promise<void> {
  await (await table(COUPONS)).updateEntity({ partitionKey: PK, rowKey: code, active }, 'Merge')
}

export async function deleteCoupon(code: string): Promise<void> {
  await (await table(COUPONS)).deleteEntity(PK, code).catch((e: any) => { if (e?.statusCode !== 404) throw e })
  // Its record of who used it goes too, so the same code can be made again from zero
  const uses = await table(USES)
  const filter = `PartitionKey eq '${code.replace(/'/g, "''")}'`
  for await (const e of uses.listEntities({ queryOptions: { filter } })) await uses.deleteEntity(code, String(e.rowKey)).catch(() => {})
}

/** Why a coupon cannot be used right now, or null when it can. */
export function couponProblem(c: Coupon | null, slug: string): string | null {
  if (!c || !c.active) return 'That code is not valid.'
  if (c.expiresAt && Date.parse(c.expiresAt) <= Date.now()) return 'That code has expired.'
  // `slug` is the course being bought, or WEEKEND_SCOPE for a seat on the AI Weekend
  const weekend = slug === WEEKEND_SCOPE
  if (c.slug !== EVERYTHING) {
    if (weekend && c.slug !== WEEKEND_SCOPE) return 'That code is for a course, not for the AI Weekend.'
    if (!weekend && c.slug === WEEKEND_SCOPE) return 'That code is for the AI Weekend, not for a course.'
    if (!weekend && c.slug && c.slug !== slug) return 'That code is for a different course.'
  }
  if (c.maxUses > 0 && c.uses >= c.maxUses) return 'That code has already been used the maximum number of times.'
  return null
}

/** What a course costs with a percent taken off. Zero means free. */
export function couponPrice(price: CoursePrice, percent: number): CoursePrice {
  if (percent >= 100) return { usd: 0, inr: 0 }
  // Razorpay will not take a payment smaller than these
  return {
    usd: Math.max(0.5, Math.round(price.usd * (100 - percent)) / 100),
    inr: Math.max(1, Math.round((price.inr * (100 - percent)) / 100)),
  }
}

/** What the AI Weekend costs with a percent taken off, in one currency. Zero means nothing to pay. */
export function couponAmount(fee: number, currency: 'INR' | 'USD', percent: number): number {
  if (percent >= 100) return 0
  // Razorpay will not take a payment smaller than these
  return currency === 'INR' ? Math.max(1, Math.round((fee * (100 - percent)) / 100)) : Math.max(0.5, Math.round(fee * (100 - percent)) / 100)
}

/**
 * Count one use of a coupon by this person for this course. Counting the same
 * person and course twice does nothing.
 *
 * `strict` is for free codes, where the use is the whole transaction: it returns
 * false, counting nothing, when the limit was reached in the meantime. A paid
 * order is always counted, because the buyer has already paid the reduced price.
 */
export async function redeemCoupon(code: string, email: string, slug: string, strict: boolean): Promise<boolean> {
  const uses = await table(USES)
  const row = Buffer.from(`${key(email)}|${slug}`).toString('hex')
  try {
    await uses.createEntity({ partitionKey: code, rowKey: row, email: key(email), slug, at: new Date().toISOString() })
  } catch (e: any) {
    if (e?.statusCode === 409) return true
    throw e
  }
  const undo = () => uses.deleteEntity(code, row).catch(() => {})
  const coupons = await table(COUPONS)
  for (let attempt = 0; attempt < 8; attempt++) {
    let e: Record<string, unknown> & { etag?: string }
    try {
      e = await coupons.getEntity<Record<string, unknown>>(PK, code)
    } catch (err: any) {
      if (err?.statusCode !== 404) throw err
      if (strict) await undo()
      return !strict
    }
    const used = Number(e.uses || 0), max = Number(e.maxUses || 0)
    if (strict && max > 0 && used >= max) { await undo(); return false }
    try {
      await coupons.updateEntity({ partitionKey: PK, rowKey: code, uses: used + 1 }, 'Merge', { etag: e.etag })
      return true
    } catch (err: any) {
      // Someone else used the code at the same moment: read the count again
      if (err?.statusCode !== 412) throw err
    }
  }
  if (strict) await undo()
  return !strict
}
