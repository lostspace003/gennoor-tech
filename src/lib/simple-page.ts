import { NextResponse } from 'next/server'

/**
 * One small page for a link pressed in an email (confirm a sign-up, unsubscribe): a title, a sentence and a way
 * back to the site. It is its own little document, so it works whatever state the site's own pages are in,
 * and it is light, like the emails it is reached from. `message` may hold simple HTML; the caller makes any
 * outside text safe first.
 */
export function simplePage(title: string, message: string, status = 200, link: { href: string; label: string } = { href: 'https://www.gennoor.com', label: 'Back to gennoor.com' }) {
  return new NextResponse(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"/>
     <meta name="viewport" content="width=device-width,initial-scale=1"/>
     <meta name="robots" content="noindex"/>
     <title>${title} | Gennoor Tech</title></head>
     <body style="margin:0;background:#eef2f8;font-family:'Segoe UI',system-ui,-apple-system,Roboto,Arial,sans-serif">
       <div style="max-width:520px;margin:10vh auto;padding:0 16px">
         <div style="background:#fff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;text-align:center">
           <img src="https://www.gennoor.com/email/header.png" alt="Gennoor Tech" width="520" style="display:block;width:100%;height:auto;border:0"/>
           <div style="padding:30px 30px 34px">
             <h1 style="margin:0 0 10px;font-size:22px;line-height:1.3;color:#0f172a">${title}</h1>
             <p style="margin:0 0 24px;font-size:15px;line-height:1.65;color:#475569">${message}</p>
             <a href="${link.href}" style="display:inline-block;background:#2563EB;color:#fff;text-decoration:none;padding:11px 26px;border-radius:10px;font-size:14.5px;font-weight:700">${link.label}</a>
           </div>
         </div>
       </div>
     </body></html>`,
    { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  )
}
