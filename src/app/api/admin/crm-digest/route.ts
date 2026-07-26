import { NextRequest, NextResponse } from 'next/server'
import { BlobServiceClient } from '@azure/storage-blob'
import { getLeads } from '@/lib/crm/store'
import { sendEmail } from '@/lib/email-service'
import { graphConfigured, listUpcomingMeetings } from '@/lib/crm/graph'
import { emailShell } from '@/lib/crm/email-theme'
import { CRM_USERS } from '@/lib/crm/access'

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

    const active = leads.filter((l) => !l.dumped && l.processStatus === 'active' && !['won', 'lost'].includes(l.status))
    const pool = active.filter((l) => !l.owner)
    const claimed = active.filter((l) => l.owner)

    const lastSent = (l: any) => l.emailHistory.find((e: any) => e.status === 'sent')?.at
    const needsResearch = claimed.filter((l) => !l.aiResearch)
    const needsEmail = claimed.filter((l) => l.finalizedPitch && !lastSent(l))
    const followUpDue = claimed.filter((l) => {
      const at = lastSent(l)
      return at && Date.now() - new Date(at).getTime() > 5 * 86_400_000
    })

    // Personal digests: each member with claimed leads gets their own queue
    const memberResults: Record<string, boolean> = {}
    for (const member of CRM_USERS.filter((u) => u !== ADMIN)) {
      const mine = (arr: typeof claimed) => arr.filter((l) => l.owner?.toLowerCase() === member)
      const mineResearch = mine(needsResearch)
      const mineEmail = mine(needsEmail)
      const mineFollow = mine(followUpDue)
      const total = mineResearch.length + mineEmail.length + mineFollow.length
      if (total === 0) continue
      const li = (label: string, items: any[]) =>
        items.length ? `<li><strong>${items.length}</strong> ${label}: ${items.slice(0, 5).map((l) => l.name).join(', ')}${items.length > 5 ? '…' : ''}</li>` : ''
      const r = await sendEmail({
        to: member,
        from: FROM,
        fromName: 'Gennoor CRM',
        subject: `Your CRM queue today: ${total} lead${total === 1 ? '' : 's'} need you`,
        html: emailShell(`<h3 style="margin:0 0 10px;color:#0f172a">Good morning — your queue</h3>
          <ul style="margin:0 0 16px;padding-left:18px;line-height:1.9">
            ${li('need research', mineResearch)}${li('ready for first email', mineEmail)}${li('quiet 5+ days — follow up', mineFollow)}
          </ul>
          <a href="https://www.gennoor.com/crm/queue" style="display:inline-block;background:#2563EB;color:#fff;text-decoration:none;padding:9px 20px;border-radius:8px;font-size:14px">Open my Work Queue</a>`),
      })
      memberResults[member] = r.success
    }

    let meetingsHtml = ''
    if (graphConfigured()) {
      try {
        const meetings = (await listUpcomingMeetings(1)).slice(0, 6)
        if (meetings.length) {
          meetingsHtml = `<h3 style="margin:18px 0 6px;font-size:14px">Today's meetings</h3><ul style="margin:0;padding-left:18px">${meetings
            .map((m) => `<li>${m.subject} — ${new Date(m.start).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' })} IST</li>`)
            .join('')}</ul>`
        }
      } catch { /* calendar optional in digest */ }
    }

    const row = (label: string, items: any[], tip: string) =>
      `<tr><td style="padding:6px 10px;border:1px solid #e2e8f0"><strong>${items.length}</strong></td><td style="padding:6px 10px;border:1px solid #e2e8f0">${label}</td><td style="padding:6px 10px;border:1px solid #e2e8f0;color:#64748b;font-size:12px">${items.slice(0, 4).map((l) => l.name).join(', ')}${items.length > 4 ? '…' : ''} ${tip}</td></tr>`

    const html = emailShell(`
        <h2 style="margin:0 0 4px;color:#0f172a">Gennoor CRM — morning digest</h2>
        <p style="margin:0 0 14px;color:#64748b;font-size:13px">${new Date().toLocaleDateString('en-IN', { dateStyle: 'full', timeZone: 'Asia/Kolkata' })}</p>
        <table style="border-collapse:collapse;font-size:14px">
          ${row('leads in the pool waiting for pickup', pool, '')}
          ${row('claimed leads still need research', needsResearch, '')}
          ${row('pitches locked, first email not sent', needsEmail, '')}
          ${row('quiet 5+ days — follow-up due', followUpDue, '')}
        </table>
        ${meetingsHtml}
        <p style="margin:18px 0 0"><a href="https://www.gennoor.com/crm/queue" style="display:inline-block;background:#2563EB;color:#fff;text-decoration:none;padding:10px 22px;border-radius:8px;font-size:14px">Open the Work Queue</a></p>`)

    const result = await sendEmail({
      to: ADMIN,
      from: FROM,
      fromName: 'Gennoor CRM',
      subject: `CRM digest: ${pool.length} in pool · ${followUpDue.length} follow-ups due · ${needsEmail.length} emails to send`,
      html,
    })

    return NextResponse.json({ success: result.success, pool: pool.length, followUpDue: followUpDue.length, memberDigests: memberResults, backedUp: true })
  } catch (error) {
    console.error('Digest error:', error)
    return NextResponse.json({ error: 'Digest failed' }, { status: 500 })
  }
}
