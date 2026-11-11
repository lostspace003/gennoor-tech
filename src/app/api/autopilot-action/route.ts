import { NextRequest, NextResponse } from 'next/server'
import { applyAction } from '@/lib/autopilot/engine'
import { actionLabel, verifyAction } from '@/lib/autopilot/email-actions'
import { loadState, saveState } from '@/lib/autopilot/live'
import { getDraft } from '@/lib/social/studio'

// The buttons in autopilot emails land here. GET only shows the post and a confirm button (so mail scanners that
// open links never act); POST, with the same signed parameters, applies the action. See email-actions.ts.
export const dynamic = 'force-dynamic'

const esc = (s: string) => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!)

function page(title: string, body: string, status = 200) {
  return new NextResponse(`<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><meta name="robots" content="noindex"/><title>${esc(title)} · Gennoor autopilot</title>
<style>body{font-family:-apple-system,Segoe UI,Arial,sans-serif;background:#f5f5f7;color:#1d1d1f;margin:0;padding:24px 16px}main{max-width:640px;margin:0 auto;background:#fff;border-radius:12px;padding:24px;box-shadow:0 1px 3px rgba(0,0,0,.08)}h1{font-size:20px;margin:0 0 12px}pre{white-space:pre-wrap;font-family:inherit;background:#f6f6f6;padding:12px;border-radius:8px;font-size:14px;line-height:1.5}button{padding:10px 20px;border:0;border-radius:8px;color:#fff;font-weight:600;font-size:15px;cursor:pointer}a{color:#0066cc}</style></head>
<body><main>${body}</main></body></html>`, { status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' } })
}

const params = (p: URLSearchParams | FormData) => ({ s: String(p.get('s') || ''), a: String(p.get('a') || ''), e: String(p.get('e') || ''), t: String(p.get('t') || '') })
const findSlot = async (id: string) => Object.values((await loadState()).days).flatMap(d => d.slots).find(x => x.id === id)

export async function GET(req: NextRequest) {
  const q = params(req.nextUrl.searchParams)
  const v = verifyAction(q.s, q.a, q.e, q.t)
  if (!v.ok) return page('Link not valid', `<h1>That link did not work</h1><p>${esc(v.why)}</p><p><a href="/admin/autopilot">Open the Autopilot page</a></p>`, 400)
  const slot = await findSlot(q.s)
  if (!slot) return page('Not found', '<h1>That post is no longer in the queue</h1><p><a href="/admin/autopilot">Open the Autopilot page</a></p>', 404)
  const draft = slot.draftId ? await getDraft(slot.draftId) : null
  const when = new Date(slot.at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' })
  const verb = v.action === 'skip' ? 'Skip this post' : v.action === 'approve' ? 'Approve this post' : 'Approve and post'
  const effect = v.action === 'skip' ? 'It will not be posted.' : v.action === 'release' ? 'It will be posted within about 15 minutes (or skipped if its posting window has already closed).' : `It will go out at its scheduled time (${esc(when)} IST), or right away if that time has just passed.`
  const color = v.action === 'skip' ? '#8a1c1c' : '#0f7b3f'
  return page(verb, `<h1>${verb}?</h1><p><b>${esc(slot.topic?.title || slot.id)}</b> · ${esc(when)} IST · now ${esc(slot.status)}</p>
${draft?.text ? `<pre>${esc(draft.text)}</pre>` : '<p><i>No draft has been written yet.</i></p>'}
<p>${effect}</p>
<form method="post"><input type="hidden" name="s" value="${esc(q.s)}"/><input type="hidden" name="a" value="${esc(q.a)}"/><input type="hidden" name="e" value="${esc(q.e)}"/><input type="hidden" name="t" value="${esc(q.t)}"/>
<button type="submit" style="background:${color}">${esc(actionLabel(v.action))}</button></form>
<p style="margin-top:16px;font-size:13px">Want to edit it first? <a href="/admin/autopilot">Open the Autopilot page</a>.</p>`)
}

export async function POST(req: NextRequest) {
  const q = params(await req.formData().catch(() => new FormData()))
  const v = verifyAction(q.s, q.a, q.e, q.t)
  if (!v.ok) return page('Link not valid', `<h1>That did not work</h1><p>${esc(v.why)}</p>`, 400)
  try {
    const s = await loadState()
    const status = applyAction(s, q.s, v.action, new Date())
    await saveState(s)
    const done = v.action === 'skip' ? 'Skipped. It will not be posted.' : v.action === 'release' ? 'Approved. It will be posted within about 15 minutes.' : 'Approved. It will be posted at its scheduled time.'
    return page('Done', `<h1>${done}</h1><p>Status now: ${esc(status)}.</p><p><a href="/admin/autopilot">Open the Autopilot page</a></p>`)
  } catch (e: any) {
    return page('Could not apply', `<h1>Could not do that</h1><p>${esc(e?.message || 'Failed.')}</p><p><a href="/admin/autopilot">Open the Autopilot page</a></p>`, 400)
  }
}
