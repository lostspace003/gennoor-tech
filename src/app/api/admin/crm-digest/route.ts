import { NextRequest, NextResponse } from 'next/server'
import { BlobServiceClient } from '@azure/storage-blob'
import { getLeads } from '@/lib/crm/store'
import { sendEmail } from '@/lib/email-service'
import { graphConfigured, listUpcomingMeetings } from '@/lib/crm/graph'
import { emailShell } from '@/lib/crm/email-theme'
import { CRM_USERS } from '@/lib/crm/access'
import { formatIstCstTime } from '@/lib/format-time'
import { QUIET_DAYS, quietDays, todayLists } from '@/lib/crm/today'
import { syncReplies } from '@/lib/crm/reply-sync'
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
    // The day's copy of the leads is taken first, before anything is changed by a machine
    await backupLeads(await getLeads()).catch((e) => console.error('Backup failed:', e))
    // Then the mailboxes are looked at, so a reply that came in overnight is in this email
    await syncReplies(true).catch(() => null)
    const leads = await getLeads()

    // The same lists as the Today page (lib/crm/today.ts), so the email and the page never disagree
    const all = todayLists(leads, '', true)
    const quietOf = (list: typeof leads) => list.filter((l) => quietDays(l) >= QUIET_DAYS)
    const pool = all.pool, toStart = all.toStart, emailsDue = all.due

    // Personal digests: each person with work waiting gets their own list
    const memberResults: Record<string, boolean> = {}
    for (const member of CRM_USERS.filter((u) => u !== ADMIN)) {
      const mine = todayLists(leads, member)
      // Replies to leads nobody holds are for whoever picks them up: they are in the admin's email, not here
      const replies = mine.replies.filter((l) => l.owner?.toLowerCase() === member)
      const quiet = quietOf(mine.talking)
      const total = replies.length + quiet.length + mine.toStart.length + mine.due.length
      if (total === 0) continue
      const li = (label: string, items: any[]) =>
        items.length ? `<li><strong>${items.length}</strong> ${label}: ${items.slice(0, 5).map((l) => escapeHtml(l.name)).join(', ')}${items.length > 5 ? '…' : ''}</li>` : ''
      const r = await sendEmail({
        to: member,
        from: FROM,
        fromName: 'Gennoor CRM',
        subject: replies.length
          ? `Your CRM today: ${replies.length} repl${replies.length === 1 ? 'y' : 'ies'} to answer${total > replies.length ? `, ${total - replies.length} more to do` : ''}`
          : `Your CRM today: ${total} lead${total === 1 ? '' : 's'} need you`,
        html: emailShell(`<h3 style="margin:0 0 10px;color:#0f172a">Good morning. Here is your list.</h3>
          <ul style="margin:0 0 16px;padding-left:18px;line-height:1.9">
            ${li('replied and waiting for your answer', replies)}${li(`in conversation, quiet for ${QUIET_DAYS} days or more`, quiet)}${li('ready for the first email', mine.toStart)}${li('next email due', mine.due)}
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
          ${row('leads replied and are waiting for an answer', all.replies, '')}
          ${row(`conversations quiet for ${QUIET_DAYS} days or more`, quietOf(all.talking), '')}
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
      subject: `CRM digest: ${all.replies.length} to answer · ${pool.length} unassigned · ${toStart.length} to start · ${emailsDue.length} emails due`,
      html,
    })

    return NextResponse.json({ success: result.success, replies: all.replies.length, pool: pool.length, toStart: toStart.length, emailsDue: emailsDue.length, memberDigests: memberResults, backedUp: true })
  } catch (error) {
    console.error('Digest error:', error)
    return NextResponse.json({ error: 'Digest failed' }, { status: 500 })
  }
}
