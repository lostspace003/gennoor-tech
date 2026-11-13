/**
 * Start the email series again for every lead, from email 1.
 *
 *   npx tsx --env-file=.env.local scripts/crm-reset-series.ts            shows what would change
 *   npx tsx --env-file=.env.local scripts/crm-reset-series.ts --apply    makes the change
 *
 * Used when the emails themselves are replaced (November 2026: the series became
 * short visual briefings), so nobody is left half way through the old ones.
 *
 * What changes: the record of series emails already sent is cleared, and a lead
 * on the step "Emailed" goes back to "New".
 * What stays: every other detail, the owner, notes, the history of emails
 * actually sent, later steps (Talking, Proposal, Customer, Closed), archived
 * leads, and "stopped" for anyone who asked not to be emailed.
 * Before changing anything it saves a dated copy of the lead file beside it.
 */
import { BlobServiceClient } from '@azure/storage-blob'
import { getLeads, mutateLeads } from '@/lib/crm/store'

const apply = process.argv.includes('--apply')

async function main() {
  const before = await getLeads()
  const restart = before.filter((l) => (l.sequence?.sent?.length || 0) > 0)
  const backToNew = before.filter((l) => l.status === 'contacted')
  console.log(`${before.length} leads. ${restart.length} have series emails recorded. ${backToNew.length} are on "Emailed" and go back to "New".`)
  if (!apply) { console.log('Nothing changed. Add --apply to make the change.'); return }

  const container = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING!).getContainerClient('crm-data')
  const copy = `backups/leads-before-series-reset-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
  const body = JSON.stringify(before)
  await container.getBlockBlobClient(copy).upload(body, Buffer.byteLength(body), { blobHTTPHeaders: { blobContentType: 'application/json' } })
  console.log(`Copy saved: crm-data/${copy}`)

  const now = new Date().toISOString()
  const changed = await mutateLeads((leads) => {
    let n = 0
    for (const l of leads) {
      const hadEmails = (l.sequence?.sent?.length || 0) > 0
      const wasEmailing = l.status === 'contacted'
      if (!hadEmails && !wasEmailing) continue
      if (l.sequence) l.sequence.sent = []
      if (wasEmailing) l.status = 'new'
      l.activities.unshift({ at: now, by: 'system', type: 'status', description: 'Email series restarted: the next email is the new introduction' })
      n++
    }
    return n
  })
  console.log(`${changed} leads restarted.`)
}
main().catch((e) => { console.error(e); process.exit(1) })
