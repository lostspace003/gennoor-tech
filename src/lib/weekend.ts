import { BlobServiceClient } from '@azure/storage-blob'
import { randomBytes } from 'crypto'

// Registrations for the monthly AI Weekend. Kept in their own file, apart from
// the CRM leads, so this audience can be counted and followed up on its own.
// One JSON blob next to the other site data, written with an ETag check so two
// people registering at the same moment never overwrite each other.
const CONTAINER = 'crm-data'
const BLOB = 'weekend/registrations.json'

export type PaymentState = 'pending' | 'paid' | 'refunded'

export interface WeekendRegistration {
  id: string
  /** Which weekend, e.g. "2026-11". */
  cohort: string
  name: string
  email: string
  phone: string
  company: string
  role: string
  at: string
  payment: PaymentState
  /** The fee at the time they registered, in `currency`. */
  fee: number
  /** Rupees for someone in India, dollars for everyone else. Absent on registrations made before 14 November 2026: rupees. */
  currency?: 'INR' | 'USD'
  /** Where they came from: campaign tag or referring site. */
  source: string
  note?: string
  /** Online payment (Razorpay): the order opened for them, and the payment once it succeeds. */
  orderId?: string
  paymentId?: string
  paidAt?: string
  /** The coupon code used for this seat, if any (lib/lms-coupons.ts). `fee` is then the amount with the code taken off: 0 means nothing was paid. */
  coupon?: string
  /** When each of the weekend's emails was last sent to them, by kind (see weekend-emails.ts). */
  emails?: Record<string, string>
}

/** What staff type once per weekend and every email then reuses. */
export interface CohortSettings {
  /** The Teams joining link. */
  joinUrl?: string
  /** How to pay: a payment link, or UPI / bank details, as plain text. */
  payment?: string
  /** Where the kit can be downloaded after the weekend. */
  kitUrl?: string
  /** Addresses the invitation has gone to, and when, so nobody is invited twice. */
  invited?: Record<string, string>
  /** The same for the other campaign emails that go to people staff chose: by email kind, then by address. */
  sentTo?: Record<string, Record<string, string>>
  /** Only on the entry "_all": the order staff gave the campaign emails. */
  order?: string[]
}

const SETTINGS_BLOB = 'weekend/settings.json'

export async function getSettings(): Promise<Record<string, CohortSettings>> {
  const conn = process.env.AZURE_STORAGE_CONNECTION_STRING
  if (!conn) throw new Error('AZURE_STORAGE_CONNECTION_STRING not configured')
  try {
    const buf = await BlobServiceClient.fromConnectionString(conn).getContainerClient(CONTAINER).getBlockBlobClient(SETTINGS_BLOB).downloadToBuffer()
    return JSON.parse(buf.toString('utf-8'))
  } catch (e: any) {
    if (e?.statusCode === 404) return {}
    throw e
  }
}

export async function saveSettings(cohort: string, patch: CohortSettings): Promise<CohortSettings> {
  const all = await getSettings()
  all[cohort] = { ...all[cohort], ...patch }
  const body = JSON.stringify(all)
  const conn = process.env.AZURE_STORAGE_CONNECTION_STRING!
  await BlobServiceClient.fromConnectionString(conn).getContainerClient(CONTAINER).getBlockBlobClient(SETTINGS_BLOB)
    .upload(body, Buffer.byteLength(body), { blobHTTPHeaders: { blobContentType: 'application/json' } })
  return all[cohort]
}

function blob() {
  const conn = process.env.AZURE_STORAGE_CONNECTION_STRING
  if (!conn) throw new Error('AZURE_STORAGE_CONNECTION_STRING not configured')
  return BlobServiceClient.fromConnectionString(conn).getContainerClient(CONTAINER).getBlockBlobClient(BLOB)
}

async function read(): Promise<{ rows: WeekendRegistration[]; etag?: string }> {
  try {
    const d = await blob().download()
    const chunks: Buffer[] = []
    for await (const c of d.readableStreamBody as AsyncIterable<Buffer>) chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c))
    return { rows: JSON.parse(Buffer.concat(chunks).toString('utf-8')), etag: d.etag }
  } catch (e: any) {
    if (e?.statusCode === 404) return { rows: [] }
    throw e
  }
}

export const getRegistrations = async () => (await read()).rows

export async function mutateRegistrations<T>(fn: (rows: WeekendRegistration[]) => T): Promise<T> {
  let last: unknown
  for (let i = 0; i < 4; i++) {
    const { rows, etag } = await read()
    const out = fn(rows)
    try {
      const conn = process.env.AZURE_STORAGE_CONNECTION_STRING!
      await BlobServiceClient.fromConnectionString(conn).getContainerClient(CONTAINER).createIfNotExists()
      const body = JSON.stringify(rows)
      await blob().upload(body, Buffer.byteLength(body), {
        blobHTTPHeaders: { blobContentType: 'application/json' },
        conditions: etag ? { ifMatch: etag } : { ifNoneMatch: '*' },
      })
      return out
    } catch (e: any) {
      // 412 / 409: someone else saved first. Read again and retry.
      if (e?.statusCode === 412 || e?.statusCode === 409) { last = e; continue }
      throw e
    }
  }
  throw last
}

export const newRegistrationId = () => `WK-${randomBytes(4).toString('hex').toUpperCase()}`
