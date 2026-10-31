import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto'
import { readBlob, writeBlob } from '@/lib/social/studio'

// Prospecting (Vibe Prospecting / Explorium) keys. Several can be stored; the active one is used first and the next
// one takes over automatically when a key runs out of credits. Keys are encrypted at rest (AES-256-GCM, derived from
// the site secret) and never sent back to the browser: only the last four characters are shown.
const FILE = 'prospecting/keys.json'
const BASE = 'https://api.explorium.ai'

interface Stored { id: string; label: string; enc: string; last4: string; addedAt: string }
interface Store { keys: Stored[]; activeId?: string }

const secret = () => createHash('sha256').update(process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || '').digest()
function seal(plain: string) {
  const iv = randomBytes(12), c = createCipheriv('aes-256-gcm', secret(), iv)
  const body = Buffer.concat([c.update(plain, 'utf8'), c.final()])
  return Buffer.concat([iv, c.getAuthTag(), body]).toString('base64')
}
function open(enc: string) {
  const b = Buffer.from(enc, 'base64'), d = createDecipheriv('aes-256-gcm', secret(), b.subarray(0, 12))
  d.setAuthTag(b.subarray(12, 28))
  return Buffer.concat([d.update(b.subarray(28)), d.final()]).toString('utf8')
}

async function load(): Promise<Store> { const raw = await readBlob(FILE); return raw ? JSON.parse(raw.toString('utf-8')) : { keys: [] } }
const save = (s: Store) => writeBlob(FILE, JSON.stringify(s), 'application/json')

// A key set as the PROSPECTING_API_KEY app setting is offered as "Server default", so there is always one that works
// without pasting anything. Keys added in the hub sit alongside it and can be switched between.
const ENV_ID = 'env'
const envKey = () => (process.env.PROSPECTING_API_KEY || '').trim()
const activeOf = (s: Store) => s.activeId || s.keys[0]?.id || (envKey() ? ENV_ID : undefined)

export async function listKeys() {
  const s = await load()
  const act = activeOf(s)
  const own = s.keys.map(k => ({ id: k.id, label: k.label, last4: k.last4, addedAt: k.addedAt, active: k.id === act, fixed: false }))
  return envKey() ? [...own, { id: ENV_ID, label: 'Server default', last4: envKey().slice(-4), addedAt: '', active: act === ENV_ID, fixed: true }] : own
}

export async function addKey(label: string, key: string) {
  const s = await load()
  const k: Stored = { id: randomBytes(5).toString('hex'), label: label.trim().slice(0, 40) || `Key ${s.keys.length + 1}`, enc: seal(key.trim()), last4: key.trim().slice(-4), addedAt: new Date().toISOString() }
  s.keys.push(k)
  s.activeId = k.id // the newest key becomes the one in use
  await save(s)
  return k.id
}

export async function removeKey(id: string) {
  if (id === ENV_ID) throw new Error('The server default is set in the site settings and cannot be removed here. Add another key and switch to it instead.')
  const s = await load()
  s.keys = s.keys.filter(k => k.id !== id)
  if (s.activeId === id) s.activeId = s.keys[0]?.id
  await save(s)
}

export async function setActive(id: string) {
  const s = await load()
  if (s.keys.some(k => k.id === id) || (id === ENV_ID && envKey())) { s.activeId = id; await save(s) }
}

/** Decrypted keys, the active one first. */
async function ordered() {
  const s = await load()
  const act = activeOf(s)
  const all = s.keys.map(k => ({ id: k.id, label: k.label, key: open(k.enc) }))
  if (envKey() && !all.some(k => k.key === envKey())) all.push({ id: ENV_ID, label: 'Server default', key: envKey() })
  return all.sort((a, b) => (a.id === act ? -1 : b.id === act ? 1 : 0))
}

async function call(key: string, path: string, init?: { body?: unknown }) {
  const res = await fetch(`${BASE}${path}`, { method: init ? 'POST' : 'GET', headers: { api_key: key, 'Content-Type': 'application/json' }, ...(init ? { body: JSON.stringify(init.body) } : {}), signal: AbortSignal.timeout(45_000) })
  const j = await res.json().catch(() => ({}))
  return { status: res.status, ok: res.ok, j }
}

/** Checks a key and reads its remaining credits. */
export async function credits(key: string): Promise<{ ok: boolean; remaining?: number; allocated?: number; plan?: string; error?: string }> {
  try {
    const r = await call(key, '/v1/credits')
    if (r.ok) return { ok: true, remaining: r.j.remaining_credits, allocated: r.j.allocated_credits, plan: r.j.account_type }
    return { ok: false, error: r.status === 401 || r.status === 403 ? 'This key was not accepted.' : `Service answered ${r.status}.` }
  } catch (e: any) { return { ok: false, error: e?.message || 'No answer from the service.' } }
}

export async function keyStatuses() {
  const all = await ordered()
  const list = await listKeys()
  return Promise.all(list.map(async k => ({ ...k, ...(await credits(all.find(a => a.id === k.id)!.key)) })))
}

export async function addAndCheck(label: string, key: string) {
  const c = await credits(key.trim())
  if (!c.ok) throw new Error(c.error || 'This key was not accepted.')
  return addKey(label, key)
}

export interface PersonIn { name: string; company?: string; linkedin?: string }
export interface PersonOut extends PersonIn { email?: string; emailStatus?: string; note?: string }

const pickEmail = (d: any): { email?: string; status?: string } => {
  const data = Array.isArray(d) ? d[0] : d
  if (!data) return {}
  const first = Array.isArray(data.emails) ? data.emails.map((e: any) => (typeof e === 'string' ? e : e?.email || Object.values(e || {}).find(v => typeof v === 'string' && String(v).includes('@')))).find(Boolean) : undefined
  return { email: data.professions_email || data.professional_email || first || undefined, status: data.professional_email_status }
}

/**
 * Finds a work email for each person. Matches by LinkedIn link when we have one, otherwise by name and company, then asks
 * for the email (2 credits each). If a key is out of credits or refused, the next stored key takes over.
 */
export async function findEmails(people: PersonIn[]): Promise<{ rows: PersonOut[]; keyUsed?: string; error?: string }> {
  const keys = await ordered()
  if (!keys.length) return { rows: [], error: 'Add a prospecting API key first.' }
  const rows: PersonOut[] = people.map(p => ({ ...p }))
  const dead = new Set<string>()
  let used: string | undefined
  let lastErr: string | undefined
  // Run a request on the first working key; a refused or empty key is skipped for the rest of this run.
  const withKey = async (path: string, body: unknown) => {
    for (const k of keys) {
      if (dead.has(k.id)) continue
      const r = await call(k.key, path, { body })
      if (r.status === 401 || r.status === 403) { dead.add(k.id); lastErr = r.status === 403 ? `"${k.label}" is out of credits.` : `"${k.label}" was not accepted.`; continue }
      used = k.label
      return r
    }
    return null
  }

  const idx = rows.map((p, i) => (p.linkedin || (p.name && p.company) ? i : -1)).filter(i => i >= 0)
  rows.forEach((p, i) => { if (!idx.includes(i)) p.note = 'Needs a company or a LinkedIn link to match.' })
  const ids: Record<number, string> = {}
  for (let s = 0; s < idx.length; s += 50) {
    const chunk = idx.slice(s, s + 50)
    const r = await withKey('/v1/prospects/match', { prospects_to_match: chunk.map(i => (rows[i].linkedin ? { linkedin: rows[i].linkedin } : { full_name: rows[i].name, company_name: rows[i].company })) })
    if (!r) return { rows, keyUsed: used, error: lastErr || 'No prospecting key could be used.' }
    const m: any[] = r.j.matched_prospects || []
    chunk.forEach((i, n) => { const id = m[n]?.prospect_id; if (id) ids[i] = id; else rows[i].note = 'No match found.' })
  }
  for (const i of Object.keys(ids).map(Number)) {
    const r = await withKey('/v1/prospects/contacts_information/enrich', { prospect_id: ids[i], parameters: { contact_types: ['email'] } })
    if (!r) { rows[i].note = lastErr || 'Stopped: no key with credits left.'; break }
    if (!r.ok) { rows[i].note = `Lookup failed (${r.status}).`; continue }
    const { email, status } = pickEmail(r.j.data)
    if (email) { rows[i].email = email; rows[i].emailStatus = status } else rows[i].note = 'Matched, but no email on file.'
  }
  return { rows, keyUsed: used, ...(lastErr && rows.some(r => r.note?.startsWith('Stopped')) ? { error: lastErr } : {}) }
}
