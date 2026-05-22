import dotenv from 'dotenv'
import path from 'node:path'
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const { EmailClient } = await import('@azure/communication-email')

const connStr = process.env.AZURE_COMMUNICATION_CONNECTION_STRING
if (!connStr) { console.error('No AZURE_COMMUNICATION_CONNECTION_STRING'); process.exit(1) }

const client = new EmailClient(connStr)

const from = process.env.EMAIL_FROM_SCHEDULE || 'schedule@gennoor.com'
const adminEmail = process.env.EMAIL_ADMIN || 'admin@gennoor.com'

console.log(`From: ${from}`)
console.log(`To:   ${adminEmail}`)
console.log()
console.log('Sending test booking notification via ACS...')

try {
  const poller = await client.beginSend({
    senderAddress: from,
    content: {
      subject: '[TEST] Booking email path verification ' + new Date().toISOString(),
      html: `<p>This is a one-shot test from <code>scripts/test-booking-email.mjs</code> to verify that the booking from-address <strong>${from}</strong> can deliver to <strong>${adminEmail}</strong> via Azure Communication Services.</p><p>If you see this in admin@gennoor.com inbox, the booking email path is fully wired.</p><p>Sent at ${new Date().toISOString()}.</p>`,
    },
    recipients: { to: [{ address: adminEmail }] },
  })
  const result = await poller.pollUntilDone()
  console.log('Status:', result.status)
  console.log('ID:    ', result.id)
  if (result.status !== 'Succeeded') {
    console.error('Error:', JSON.stringify(result.error, null, 2))
    process.exit(1)
  }
  console.log()
  console.log('[OK] Email sent. Check admin@gennoor.com inbox (and Junk folder) — arrives within ~30s.')
} catch (err) {
  console.error('[FAIL]', err?.message || err)
  if (err?.details) console.error('details:', err.details)
  process.exit(1)
}
