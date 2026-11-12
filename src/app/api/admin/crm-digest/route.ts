import { NextRequest, NextResponse } from 'next/server'
import { BlobServiceClient } from '@azure/storage-blob'
import { getLeads } from '@/lib/crm/store'
import { sendEmail } from '@/lib/email-service'
import { graphConfigured, listUpcomingMeetings } from '@/lib/crm/graph'
import { emailShell } from '@/lib/crm/email-theme'
import { CRM_USERS } from '@/lib/crm/access'
import { formatIstCstTime } from '@/lib/format-time'
import { isOpen, sequenceProgress } from '@/lib/crm/sequence'
import { escapeHtml } from '@/lib/escape-html'

const ADMIN = process.env.EMAIL_ADMIN || 'admin@gennoor.com'
const FROM = process.env.EMAIL_FROM_INFO || 'info@gennoor.com'

// Daily point-in-time backup of the lead store (kept 30 days). Runs with the
// digest so backups happen without extra infrastructure.
async function backupLeads(leads: unknown[]) {
  const conn = process.env.AZURE_STORAGE_CONNECTION_STRING
  if (!conn) return
  const container = BlobServiceClient.fromConnectionString(conn).getContainerClient('crm-data')
  await container.createIfNotExists()
  const stamp = new Date().toISOString().slice(0, 10)
  const body = JSON.stringify(leads)
  await container.getBlockBlobClient(`backups/leads-${stamp}.json`).upload(body, Buffer.byteLength(body), {
    blobHTTPHeaders: { blobContentType: 'application/json' },
  })
  // prune backups older than 30 days
  const cutoff = new Date(Date.now() - 30 * 86_400_000).toISOString().slice(0, 10)
  for await (const blob of container.listBlobsFlat({ prefix: 'backups/leads-' })) {
    const date = blob.name.slice('backups/leads-'.length, 'backups/leads-'.length + 10)
    if (date < cutoff) await container.deleteBlob(blob.name).catch(() => {})
  }
}

// Morning digest for the sales team — triggered by the GitHub Actions cron
// (secured by CRM_CRON_SECRET), never by browser users.
export async function POST(req: NextRequest) {
  const secret = process.env.CRM_CRON_SECRET
  if (!secret || req.headers.get('x-cron-secret') !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const leads = await getLeads()
    await backupLeads(leads).catch((e) => console.error('Backup failed:', e))

    // Same rules as the Today page: what is unassigned, what has not started,
    // and which email of the series is due now.
    const open = leads.filter(isOpen)
    const pool = open.filter((l) => !l.owner)
    const held = open.filter((l) => l.owner)
    const toStart = held.filter((l) => l.email && !l.sequence?.sent.length && !l.sequence?.stopped)
    const emailsDue = held.filter((l) => {
      const p = sequenceProgress(l)
      return !!l.email && p.sentIds.length > 0 && p.due
    })

    // Personal digests: each person with work waiting gets their own list
    const memberResults: Record<string, boolean> = {}
    for (const member of CRM_USERS.filter((u) => u !== ADMIN)) {
      const mine = (arr: typeof held) => arr.filter((l) => l.owner?.toLowerCase() === member)
      const mineStart = mine(toStart)
      const mineDue = mine(emailsDue)
      const total = mineStart.length + mineDue.length
      if (total === 0) continue
      const li = (label: string, items: any[]) =>
        items.length ? `<li><strong>${items.length}</strong> ${label}: ${items.slice(0, 5).map((l) => escapeHtml(l.name)).join(', ')}${items.length > 5 ? '…' : ''}</li>` : ''
      const r = await sendEmail({
        to: member,
        from: FROM,
        fromName: 'Gennoor CRM',
        subject: `Your CRM today: ${total} lead${total === 1 ? '' : 's'} to email`,
        html: emailShell(`<h3 style="margin:0 0 10px;color:#0f172a">Good morning. Here is your list.</h3>
          <ul style="margin:0 0 16px;padding-left:18px;line-height:1.9">
            ${li('ready for the first email', mineStart)}${li('next email due', mineDue)}
          </ul>
          <a href="https://www.gennoor.com/crm/queue" style="display:inline-block;background:#2563EB;color:#fff;text-decoration:none;padding:9px 20px;border-radius:8px;font-size:14px">Open Today</a>`),
      })
      memberResults[member] = r.success
    }

    let meetingsHtml = ''
    if (graphConfigured()) {
      try {
        const meetings = (await listUpcomingMeetings(1)).slice(0, 6)
        if (meetings.length) {
          meetingsHtml = `<h3 style="margin:18px 0 6px;font-size:14px">Today's meetings</h3><ul style="margin:0;padding-left:18px">${meetings
            .map((m) => `<li>${m.subject} — ${formatIstCstTime(m.start)}</li>`)
            .join('')}</ul>`
        }
      } catch { /* calendar optional in digest */ }
    }

    const row = (label: string, items: any[], tip: string) =>
      `<tr><td style="padding:6px 10px;border:1px solid #e2e8f0"><strong>${items.length}</strong></td><td style="padding:6px 10px;border:1px solid #e2e8f0">${label}</td><td style="padding:6px 10px;border:1px solid #e2e8f0;color:#64748b;font-size:12px">${items.slice(0, 4).map((l) => escapeHtml(l.name)).join(', ')}${items.length > 4 ? '…' : ''} ${tip}</td></tr>`

    const html = emailShell(`
        <h2 style="margin:0 0 4px;color:#0f172a">Gennoor CRM — morning digest</h2>
        <p style="margin:0 0 14px;color:#64748b;font-size:13px">${new Date().toLocaleDateString('en-IN', { dateStyle: 'full', timeZone: 'Asia/Kolkata' })}</p>
        <table style="border-collapse:collapse;font-size:14px">
          ${row('unassigned leads waiting to be picked up', pool, '')}
          ${row('leads ready for the first email', toStart, '')}
          ${row('leads with the next email due', emailsDue, '')}
        </table>
        ${meetingsHtml}
        <p style="margin:18px 0 0"><a href="https://www.gennoor.com/crm/queue" style="display:inline-block;background:#2563EB;color:#fff;text-decoration:none;padding:10px 22px;border-radius:8px;font-size:14px">Open Today</a></p>`)

    const result = await sendEmail({
      to: ADMIN,
      from: FROM,
      fromName: 'Gennoor CRM',
      subject: `CRM digest: ${pool.length} unassigned · ${toStart.length} to start · ${emailsDue.length} emails due`,
      html,
    })

    return NextResponse.json({ success: result.success, pool: pool.length, toStart: toStart.length, emailsDue: emailsDue.length, memberDigests: memberResults, backedUp: true })
  } catch (error) {
    console.error('Digest error:', error)
    return NextResponse.json({ error: 'Digest failed' }, { status: 500 })
  }
}
