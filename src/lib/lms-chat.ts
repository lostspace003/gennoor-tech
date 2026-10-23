import { TableClient } from '@azure/data-tables'

/**
 * Course chat: one thread per learner per course, every message kept, and a "query" record
 * whenever the assistant cannot answer, so the team can reply from the admin.
 */
const CHAT = 'LmsChat'
const QUERIES = 'LmsQueries'

export type ChatRole = 'learner' | 'assistant' | 'team'

export interface ChatMessage {
  id: string
  role: ChatRole
  text: string
  at: string
  itemId?: string
  itemTitle?: string
  queryId?: string
  /** Names of files sent with a team reply. */
  attachments?: string[]
}

export interface LmsQuery {
  id: string
  email: string
  name: string
  slug: string
  courseTitle: string
  itemId: string
  itemTitle: string
  question: string
  status: 'open' | 'resolved'
  createdAt: string
  resolvedAt?: string
}

function client(name: string): TableClient {
  const conn = process.env.AZURE_STORAGE_CONNECTION_STRING
  if (!conn) throw new Error('AZURE_STORAGE_CONNECTION_STRING not configured')
  return TableClient.fromConnectionString(conn, name)
}

const ready = new Set<string>()
async function table(name: string): Promise<TableClient> {
  const c = client(name)
  if (!ready.has(name)) {
    try { await c.createTable() } catch (e) { if ((e as { statusCode?: number })?.statusCode !== 409) throw e }
    ready.add(name)
  }
  return c
}

const pk = (email: string, slug: string) => `${email.toLowerCase()}|${slug}`
const newId = () => `${Date.now().toString().padStart(14, '0')}-${Math.random().toString(36).slice(2, 7)}`

export async function addChatMessage(email: string, slug: string, m: Omit<ChatMessage, 'id' | 'at'>): Promise<ChatMessage> {
  const t = await table(CHAT)
  const id = newId()
  const at = new Date().toISOString()
  await t.createEntity({
    partitionKey: pk(email, slug),
    rowKey: id,
    role: m.role,
    text: m.text.slice(0, 8000),
    at,
    itemId: m.itemId ?? '',
    itemTitle: m.itemTitle ?? '',
    queryId: m.queryId ?? '',
    attachments: m.attachments?.length ? JSON.stringify(m.attachments) : '',
  })
  return { id, at, ...m }
}

export async function getChat(email: string, slug: string, limit = 200): Promise<ChatMessage[]> {
  const t = await table(CHAT)
  const out: ChatMessage[] = []
  for await (const e of t.listEntities({ queryOptions: { filter: `PartitionKey eq '${pk(email, slug).replace(/'/g, "''")}'` } })) {
    out.push({
      id: String(e.rowKey),
      role: e.role as ChatRole,
      text: String(e.text ?? ''),
      at: String(e.at ?? ''),
      itemId: String(e.itemId ?? '') || undefined,
      itemTitle: String(e.itemTitle ?? '') || undefined,
      queryId: String(e.queryId ?? '') || undefined,
      attachments: e.attachments ? JSON.parse(String(e.attachments)) : undefined,
    })
  }
  out.sort((a, b) => a.id.localeCompare(b.id))
  return out.slice(-limit)
}

function toQuery(e: Record<string, unknown>): LmsQuery {
  return {
    id: String(e.rowKey),
    email: String(e.email ?? ''),
    name: String(e.name ?? ''),
    slug: String(e.slug ?? ''),
    courseTitle: String(e.courseTitle ?? ''),
    itemId: String(e.itemId ?? ''),
    itemTitle: String(e.itemTitle ?? ''),
    question: String(e.question ?? ''),
    status: e.status === 'resolved' ? 'resolved' : 'open',
    createdAt: String(e.createdAt ?? ''),
    resolvedAt: e.resolvedAt ? String(e.resolvedAt) : undefined,
  }
}

export async function createQuery(q: Omit<LmsQuery, 'id' | 'status' | 'createdAt'>): Promise<LmsQuery> {
  const t = await table(QUERIES)
  const id = newId()
  const createdAt = new Date().toISOString()
  await t.createEntity({ partitionKey: 'q', rowKey: id, ...q, status: 'open', createdAt })
  return { ...q, id, status: 'open', createdAt }
}

export async function listQueries(): Promise<LmsQuery[]> {
  const t = await table(QUERIES)
  const out: LmsQuery[] = []
  for await (const e of t.listEntities()) out.push(toQuery(e as Record<string, unknown>))
  return out.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function getQuery(id: string): Promise<LmsQuery | null> {
  const t = await table(QUERIES)
  try { return toQuery((await t.getEntity('q', id)) as Record<string, unknown>) } catch { return null }
}

export async function resolveQuery(id: string): Promise<void> {
  const t = await table(QUERIES)
  await t.updateEntity({ partitionKey: 'q', rowKey: id, status: 'resolved', resolvedAt: new Date().toISOString() }, 'Merge')
}
