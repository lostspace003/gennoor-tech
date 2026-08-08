import { NextRequest, NextResponse } from 'next/server'
import { saveEnquiry } from '@/lib/azure-storage'
import { verifyUnsubscribeToken } from '@/lib/unsubscribe'

/**
 * Unsubscribe endpoint for marketing email.
 *
 * GET  — the link in the email footer; records the opt-out and renders a
 *        confirmation page.
 * POST — RFC 8058 one-click, called by Gmail/Outlook without user interaction.
 *        Must succeed silently and return 200.
 *
 * Opt-outs land in Table Storage under `Unsubscribe` so the sending side can
 * honour them and there is an auditable record of when it happened.
 */

async function recordOptOut(email: string, source: string) {
  await saveEnquiry('Unsubscribe', {
    email,
    source,
    unsubscribedAt: new Date().toISOString(),
  })
}

function page(title: string, message: string, status: number) {
  return new NextResponse(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"/>
     <meta name="viewport" content="width=device-width,initial-scale=1"/>
     <meta name="robots" content="noindex"/>
     <title>${title} — Gennoor Tech</title></head>
     <body style="margin:0;background:#f5f5f7;font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif">
       <div style="max-width:520px;margin:12vh auto;background:#fff;border:1px solid #e8e8ed;border-radius:18px;padding:40px 36px;text-align:center">
         <h1 style="margin:0 0 12px;font-size:22px;letter-spacing:-0.01em;color:#1d1d1f">${title}</h1>
         <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#6e6e73">${message}</p>
         <a href="https://www.gennoor.com" style="display:inline-block;background:#0071e3;color:#fff;text-decoration:none;padding:10px 22px;border-radius:999px;font-size:14px;font-weight:600">Back to gennoor.com</a>
       </div>
     </body></html>`,
    { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  )
}

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email') || ''
  const token = req.nextUrl.searchParams.get('token') || ''

  if (!email || !verifyUnsubscribeToken(email, token)) {
    return page(
      'Link not recognised',
      'This unsubscribe link is invalid or has expired. Email admin@gennoor.com and we will remove you straight away.',
      400
    )
  }

  try {
    await recordOptOut(email, 'link')
  } catch (error) {
    console.error('Unsubscribe record failed:', error)
    return page(
      'Something went wrong',
      'We could not record your request just now. Please email admin@gennoor.com and we will remove you manually.',
      500
    )
  }

  return page(
    'You have been unsubscribed',
    `We have removed <strong>${email.replace(/[<>&"]/g, '')}</strong> from our mailing list. You will still receive messages you specifically ask for, such as verification codes and certificates.`,
    200
  )
}

export async function POST(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email') || ''
  const token = req.nextUrl.searchParams.get('token') || ''

  // One-click callers expect 200 regardless; never leak whether the address exists.
  if (email && verifyUnsubscribeToken(email, token)) {
    try {
      await recordOptOut(email, 'one-click')
    } catch (error) {
      console.error('One-click unsubscribe record failed:', error)
    }
  }

  return NextResponse.json({ success: true })
}
