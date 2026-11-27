import { randomBytes } from 'crypto'
import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob'
import { UNIVERSITY_SEED, MASTER_EMAIL } from '@/data/university-partnership'
import { CAMPAIGNS, campaignByKey, type Campaign, type CampaignKey } from '@/data/partnership-campaigns'
import { getLeads } from './store'
import { HOURLY_SEND_LIMIT, sentInLastHour } from './replies'
import { FORM_KEY, draftFromMaster, shortDraft, universityFromSeed, type UniActivity, type UniDoc, type University } from './universities-types'

// The University Partnership campaign lives in one file of the storage account, apart from the leads
// (docs/CRM.md, section 15). The same pattern as ./store.ts: one JSON file, saved with the ETag guard so two
// people saving at once cannot drop each other's changes. The first time it is read, the toolkit's 27 universities
// and 55 contacts are put in; after that the file is the truth and the seed is never applied again.
const CONTAINER = 'crm-data'
/** The first campaign keeps its first file name; each of the others has a file of its own (docs/CRM.md, section 15). */
const blobOf = (c: CampaignKey) => (c === 'universities' ? 'universities.json' : `partnerships-${c}.json`)

function clientOf(c: CampaignKey): BlockBlobClient {
  const conn = process.env.AZURE_STORAGE_CONNECTION_STRING
  if (!conn) throw new Error('AZURE_STORAGE_CONNECTION_STRING not configured')
  return BlobServiceClient.fromConnectionString(conn).getContainerClient(CONTAINER).getBlockBlobClient(blobOf(c))
}

/** The seed of a campaign: its organisations and its master email. Loaded when needed, so the others are not read. */
async function seedOf(campaign: Campaign) {
  if (campaign.key === 'universities') return { seed: UNIVERSITY_SEED, master: MASTER_EMAIL }
  const m = await { 'india-universities': () => import('@/data/partnerships/india-universities'), 'mumbai-colleges': () => import('@/data/partnerships/mumbai-colleges'), 'pune-colleges': () => import('@/data/partnerships/pune-colleges'),
    'mid-size-corporates': () => import('@/data/partnerships/mid-size-corporates'), 'government-skilling': () => import('@/data/partnerships/government-skilling') }[campaign.key]()
  return { seed: m.SEED, master: m.MASTER }
}

async function seedDoc(c: CampaignKey): Promise<UniDoc> {
  const campaign = campaignByKey(c) as Campaign
  const { seed, master } = await seedOf(campaign)
  return { version: 2, universities: seed.map((s) => ({ ...universityFromSeed(s, master, new Date().toISOString(), campaign.audience), formKey: newFormKey() })), unmatched: [] }
}

async function readAll(c: CampaignKey): Promise<{ doc: UniDoc; etag?: string; fresh: boolean }> {
  const blob = clientOf(c)
  try {
    const download = await blob.download()
    const chunks: Buffer[] = []
    for await (const chunk of download.readableStreamBody as AsyncIterable<Buffer>) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    const doc = JSON.parse(Buffer.concat(chunks).toString('utf-8')) as UniDoc
    doc.universities = Array.isArray(doc.universities) ? doc.universities : []
    doc.unmatched = Array.isArray(doc.unmatched) ? doc.unmatched : []
    delete (doc as { settings?: unknown }).settings
    return { doc, etag: download.etag, fresh: false }
  } catch (error: any) {
    if (error?.statusCode === 404) return { doc: await seedDoc(c), fresh: true }
    throw error
  }
}

async function writeAll(c: CampaignKey, doc: UniDoc, etag?: string) {
  await BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING || '').getContainerClient(CONTAINER).createIfNotExists()
  const body = JSON.stringify(doc)
  await clientOf(c).upload(body, Buffer.byteLength(body), {
    blobHTTPHeaders: { blobContentType: 'application/json' },
    // A brand-new file may only be created if nobody else created it first
    conditions: etag ? { ifMatch: etag } : { ifNoneMatch: '*' },
  })
}

/** A university's key to its own form link: 96 random bits, so a link cannot be guessed from another. */
export const newFormKey = () => randomBytes(12).toString('hex')

/** The campaign as it stands. The first read puts the toolkit's data in; a university without a form key is given one. */
export async function getUniversities(c: CampaignKey = 'universities'): Promise<UniDoc> {
  const { doc, fresh } = await readAll(c)
  if (fresh) {
    try { await writeAll(c, doc) } catch (e: any) { if (e?.statusCode !== 409 && e?.statusCode !== 412) throw e; return (await readAll(c)).doc }
  }
  if (doc.version !== 2 || doc.universities.some((u) => !u.formKey || !FORM_KEY.test(u.formKey))) {
    return mutateUniversities((d) => {
      for (const u of d.universities) if (!u.formKey || !FORM_KEY.test(u.formKey)) u.formKey = newFormKey()
      if (d.version !== 2) { if (c === 'universities') shortenUnsentDrafts(d); d.version = 2 }
      return d
    }, c)
  }
  return doc
}

/**
 * Once (version 2, 27 November 2026): a first email that has not gone and still reads as the toolkit wrote it is
 * replaced by its short form. An email someone has rewritten, or one that has gone, is left as it is.
 */
function shortenUnsentDrafts(d: UniDoc) {
  for (const u of d.universities) {
    const seed = UNIVERSITY_SEED.find((s) => s.id === u.id)
    if (!seed || u.emails.length) continue
    const asWritten = seed.draft ? seed.draft.body : draftFromMaster(seed, MASTER_EMAIL).body
    if (u.draft.body.replace(/\r\n?/g, '\n').trim() === asWritten.replace(/\r\n?/g, '\n').trim()) u.draft = { ...u.draft, body: shortDraft(seed, MASTER_EMAIL).body }
  }
}

/** The university whose form link carries this key, or null. The key is checked before anything is looked up. */
export async function universityByFormKey(key: string): Promise<(University & { campaign: CampaignKey }) | null> {
  if (!FORM_KEY.test(key)) return null
  for (const c of CAMPAIGNS) {
    const doc = await getUniversities(c.key).catch(() => null)
    const u = doc?.universities.find((x) => x.formKey === key)
    if (u) return { ...u, campaign: c.key }
  }
  return null
}

/** Read, change, save: tried again when someone else saved in between. Returns what `mutate` returns. */
export async function mutateUniversities<T>(mutate: (doc: UniDoc) => T, c: CampaignKey = 'universities'): Promise<T> {
  let lastError: unknown
  for (let attempt = 0; attempt < 4; attempt++) {
    const { doc, etag } = await readAll(c)
    const result = mutate(doc)
    try {
      await writeAll(c, doc, etag)
      return result
    } catch (error: any) {
      if (error?.statusCode === 412 || error?.statusCode === 409) { lastError = error; continue }
      throw error
    }
  }
  throw lastError
}

/** Writes a line of what happened on the university, newest first, and marks it as changed. */
export function note(u: University, by: string, type: string, description: string, now = new Date().toISOString()): void {
  const line: UniActivity = { at: now, by, type, description: description.slice(0, 300) }
  u.activities.unshift(line)
  if (u.activities.length > 200) u.activities.length = 200
  u.updatedAt = now
}

/** The emails of a campaign that has already been opened. One that never was has none, and is not made by asking. */
async function emailsOfOpened(c: CampaignKey): Promise<Array<Pick<University, 'emails'>>> {
  try {
    const download = await clientOf(c).download()
    const chunks: Buffer[] = []
    for await (const chunk of download.readableStreamBody as AsyncIterable<Buffer>) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    const doc = JSON.parse(Buffer.concat(chunks).toString('utf-8')) as UniDoc
    return Array.isArray(doc.universities) ? doc.universities : []
  } catch { return [] }
}

/**
 * How many emails the CRM has sent this hour, leads and every partnership campaign together: the whole site shares
 * one allowance. `universities` is the campaign the caller has just read; the others are read as they stand.
 */
export async function sentThisHour(universities: Array<Pick<University, 'emails'>>, current: CampaignKey = 'universities') {
  const leads = await getLeads().catch(() => [])
  const fromLeads = sentInLastHour(leads).count
  const since = new Date(Date.now() - 3_600_000).toISOString()
  const others = (await Promise.all(CAMPAIGNS.filter((c) => c.key !== current).map((c) => emailsOfOpened(c.key)))).flat()
  const fromUniversities = [...universities, ...others].reduce((n, u) => n + u.emails.filter((e) => e.status === 'sent' && e.at > since).length, 0)
  return { used: fromLeads + fromUniversities, limit: HOURLY_SEND_LIMIT }
}
