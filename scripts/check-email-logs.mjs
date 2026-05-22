import dotenv from 'dotenv'
import path from 'node:path'
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { TableClient } from '@azure/data-tables'

const connStr = process.env.AZURE_STORAGE_CONNECTION_STRING
if (!connStr) { console.error('No AZURE_STORAGE_CONNECTION_STRING'); process.exit(1) }

const client = TableClient.fromConnectionString(connStr, 'EmailLogs')
const logs = []
for await (const entity of client.listEntities()) {
  logs.push(entity)
}

logs.sort((a, b) => new Date(b.sentAt || b.timestamp).getTime() - new Date(a.sentAt || a.timestamp).getTime())

console.log(`Total email log entries: ${logs.length}`)
console.log()

const recent = logs.slice(0, 25)
const failed = logs.filter(l => l.status === 'failed')
const sent = logs.filter(l => l.status === 'sent')

console.log(`Sent:   ${sent.length}`)
console.log(`Failed: ${failed.length}`)
console.log()
console.log('==== Last 25 entries ====')
for (const l of recent) {
  const when = l.sentAt || l.timestamp
  const status = l.status || '?'
  const to = (l.to || '').slice(0, 40)
  const from = l.from || '?'
  const subject = (l.subject || '').slice(0, 50)
  console.log(`[${status.padEnd(7)}] ${when}`)
  console.log(`  from:    ${from}`)
  console.log(`  to:      ${to}`)
  console.log(`  subject: ${subject}`)
  if (l.error) console.log(`  error:   ${l.error}`)
  console.log()
}

console.log('==== Recent FAILED ====')
for (const l of failed.slice(0, 10)) {
  console.log(`${l.sentAt || l.timestamp}  from=${l.from}  to=${(l.to || '').slice(0, 30)}  err=${(l.error || '').slice(0, 120)}`)
}
