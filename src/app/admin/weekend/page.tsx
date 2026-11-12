'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import * as XLSX from 'xlsx'
import { Check, Download, ExternalLink, Loader2, Mail, RefreshCw, Send, Trash2, Users } from 'lucide-react'

type Kind = 'invite' | 'payment' | 'reminder' | 'join' | 'kit'
interface Reg { id: string; cohort: string; name: string; email: string; phone: string; company: string; role: string; at: string; payment: 'pending' | 'paid' | 'refunded'; fee: number; source: string; note?: string; emails?: Record<string, string>; paymentId?: string; paidAt?: string }
interface Settings { joinUrl: string; payment: string; kitUrl: string; invitedCount: number }
interface EmailInfo { kind: Kind; title: string; when: string; to: string; needs?: 'joinUrl' | 'payment' | 'kitUrl'; needsLabel?: string }
interface Data { current: string; seats: number; fee: number; cohorts: { id: string; label: string }[]; settings: Record<string, Settings>; emails: EmailInfo[]; inviteLimit: number; online: boolean; testMode: boolean; registrations: Reg[] }

const btn = 'inline-flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium rounded-md border border-gray-200 bg-white hover:border-gray-400 disabled:opacity-40'
const primary = 'inline-flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium bg-gray-800 text-white rounded-md hover:bg-gray-900 disabled:opacity-40'
const field = 'w-full text-sm border border-gray-200 rounded-md px-2.5 py-2 bg-white focus:outline-none focus:border-blue-500'
const PAY: Record<Reg['payment'], string> = { pending: 'Not paid yet', paid: 'Paid', refunded: 'Refunded' }
const SHORT: Record<Kind, string> = { invite: 'Invite', payment: 'Pay', reminder: 'Reminder', join: 'Link', kit: 'Kit' }
const NEED_LABEL = { joinUrl: 'Teams joining link', payment: 'How to pay', kitUrl: 'Kit download link' }
const NEED_HINT = {
  joinUrl: 'Paste the Teams meeting link (https://…). The same link is used on both days.',
  payment: 'Write how to pay, as the person should read it: a payment link, or UPI ID and bank details.',
  kitUrl: 'Paste the link where the kit can be downloaded (https://…).',
}

/** The AI Weekend desk: who registered, and the weekend's own emails. Kept apart from the CRM. */
export default function WeekendAdminPage() {
  const [data, setData] = useState<Data | null>(null)
  const [cohort, setCohort] = useState('')
  const [tab, setTab] = useState<'people' | 'emails'>('people')
  const [q, setQ] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState('')
  // Emails tab
  const [kind, setKind] = useState<Kind>('payment')
  const [draft, setDraft] = useState<Settings>({ joinUrl: '', payment: '', kitUrl: '', invitedCount: 0 })
  const [recipients, setRecipients] = useState('')
  const [again, setAgain] = useState(false)
  const [preview, setPreview] = useState<{ subject: string; html: string } | null>(null)
  const [stamp, setStamp] = useState(0)

  const load = useCallback(async () => {
    const r = await fetch('/api/admin/weekend').catch(() => null)
    const j = r ? await r.json().catch(() => ({})) : {}
    if (!r?.ok) { setError(j.error || `Could not load (${r?.status ?? 'offline'})`); return }
    setData(j)
    setCohort((c) => c || j.current)
  }, [])
  useEffect(() => { load() }, [load])

  const saved = data?.settings?.[cohort]
  useEffect(() => { if (saved) setDraft(saved) }, [cohort, saved?.joinUrl, saved?.payment, saved?.kitUrl]) // eslint-disable-line react-hooks/exhaustive-deps

  // The preview is the real email, built with what is saved for this weekend
  useEffect(() => {
    if (tab !== 'emails' || !cohort) return
    let off = false
    fetch(`/api/admin/weekend?preview=${kind}&cohort=${cohort}`).then((r) => r.json()).then((j) => { if (!off && j.html) setPreview(j) }).catch(() => {})
    return () => { off = true }
  }, [tab, kind, cohort, stamp])

  const all = useMemo(() => (data?.registrations || []).filter((r) => r.cohort === cohort), [data, cohort])
  const live = all.filter((r) => r.payment !== 'refunded')
  const paid = all.filter((r) => r.payment === 'paid')
  const pending = all.filter((r) => r.payment === 'pending')
  const rows = useMemo(() => {
    const n = q.trim().toLowerCase()
    return n ? all.filter((r) => `${r.name} ${r.email} ${r.company} ${r.phone}`.toLowerCase().includes(n)) : all
  }, [all, q])

  const info = data?.emails.find((e) => e.kind === kind)
  const audience = kind === 'payment' ? pending : kind === 'reminder' ? live : paid
  const notYet = audience.filter((r) => !r.emails?.[kind])
  const pasted = recipients.split(/[\n;]+/).filter((l) => /@/.test(l)).length
  const count = kind === 'invite' ? pasted : again ? audience.length : notYet.length
  // With online payment on, the payment email carries a Pay now button and needs nothing typed
  const missing = info?.needs && !saved?.[info.needs] && !(kind === 'payment' && data?.online)
  const dirty = !!saved && (draft.joinUrl !== saved.joinUrl || draft.payment !== saved.payment || draft.kitUrl !== saved.kitUrl)

  async function call(method: string, body: unknown, key: string) {
    setBusy(key); setError(''); setNotice('')
    const r = await fetch('/api/admin/weekend', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).catch(() => null)
    const j = r ? await r.json().catch(() => ({})) : {}
    setBusy('')
    if (!r?.ok) { setError(j.error || 'That did not work. Please try again.'); return null }
    return j
  }

  async function saveSetting() {
    const j = await call('PUT', { cohort, joinUrl: draft.joinUrl, payment: draft.payment, kitUrl: draft.kitUrl }, 'save')
    if (j) { setNotice('Saved'); await load(); setStamp((s) => s + 1) }
  }

  async function send() {
    if (!info) return
    if (!confirm(`Send "${info.title}" to ${count} ${count === 1 ? 'person' : 'people'}?`)) return
    const j = await call('POST', { cohort, kind, onlyNew: !again, recipients }, 'send')
    if (!j) return
    setNotice(`Sent to ${j.sent}${j.skipped ? `. ${j.skipped} skipped (already had it, or already registered)` : ''}${j.failed?.length ? `. Failed: ${j.failed.join(', ')}` : ''}`)
    if (kind === 'invite') setRecipients('')
    await load()
  }

  async function setPayment(id: string, payment: Reg['payment']) {
    await call('PATCH', { id, payment }, id)
    await load()
  }

  async function remove(reg: Reg) {
    if (!confirm(`Remove ${reg.name} from this weekend? This cannot be undone.`)) return
    setBusy(reg.id)
    const r = await fetch(`/api/admin/weekend?id=${encodeURIComponent(reg.id)}`, { method: 'DELETE' })
    if (!r.ok) setError((await r.json().catch(() => ({}))).error || 'Could not remove it')
    setBusy('')
    await load()
  }

  function excel() {
    const sheet = XLSX.utils.json_to_sheet(rows.map((r) => ({
      Name: r.name, Email: r.email, Phone: r.phone, Company: r.company, Role: r.role,
      Payment: PAY[r.payment], 'Fee (INR)': r.fee, 'Came from': r.source, 'Registered on': r.at.slice(0, 10),
      'Emails sent': Object.keys(r.emails || {}).join(', '), 'Payment reference': r.paymentId || '',
    })))
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, sheet, 'Registrations')
    XLSX.writeFile(wb, `ai-weekend-${cohort}.xlsx`)
  }

  return (
    <div className="w-full p-4 lg:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-xl font-semibold tracking-tight">AI Weekend</h1>
          {data && (
            <select value={cohort} onChange={(e) => setCohort(e.target.value)} className="text-sm border border-gray-200 rounded-md px-2.5 py-1.5 bg-white" aria-label="Which weekend">
              {data.cohorts.map((c) => <option key={c.id} value={c.id}>{c.label}{c.id === data.current ? ' (open now)' : ''}</option>)}
            </select>
          )}
        </div>
        <div className="flex items-center gap-2">
          <a href="/ai-weekend" target="_blank" rel="noreferrer" className={btn}><ExternalLink className="w-3.5 h-3.5" />Public page</a>
          <button onClick={load} className={btn}><RefreshCw className="w-3.5 h-3.5" />Refresh</button>
        </div>
      </div>

      {data && (data.online
        ? data.testMode && <div className="mb-3 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-sm px-3 py-2">Online payment is in <b>test mode</b>. No real money moves. Switch to the live Razorpay keys when you are ready to take payments.</div>
        : <div className="mb-3 rounded-md bg-gray-50 border border-gray-200 text-gray-700 text-sm px-3 py-2">Online payment is off because the Razorpay keys are not set. People reserve a seat and you mark them Paid by hand.</div>)}
      {error && <div className="mb-3 rounded-md bg-red-50 border border-red-200 text-red-800 text-sm px-3 py-2">{error}</div>}
      {notice && <div className="mb-3 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm px-3 py-2">{notice}</div>}

      {!data ? <Loader2 className="w-5 h-5 animate-spin text-gray-400" /> : (
        <>
          {/* The weekend in four numbers */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mb-4">
            {[
              [`${live.length}`, `of ${data.seats} seats taken`],
              [`${paid.length}`, 'have paid'],
              [`${pending.length}`, 'still to pay'],
              [`₹${paid.reduce((n, r) => n + r.fee, 0).toLocaleString('en-IN')}`, 'received'],
            ].map(([big, small]) => (
              <div key={small} className="rounded-xl border border-gray-200 bg-white px-4 py-3">
                <div className="text-2xl font-semibold tracking-tight">{big}</div>
                <div className="text-xs text-gray-500">{small}</div>
              </div>
            ))}
          </div>

          <div className="flex gap-1 border-b border-gray-200 mb-4 text-sm">
            {([['people', 'People', Users], ['emails', 'Emails', Mail]] as const).map(([id, label, Icon]) => (
              <button key={id} onClick={() => { setTab(id); setNotice('') }} className={`inline-flex items-center gap-1.5 px-3 py-2 -mb-px border-b-2 ${tab === id ? 'border-gray-800 font-medium' : 'border-transparent text-gray-500 hover:text-gray-800'}`}><Icon className="w-4 h-4" />{label}</button>
            ))}
          </div>

          {tab === 'people' ? (
            <>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email, company" className="text-sm border border-gray-200 rounded-md px-2.5 py-2 w-64" />
                <span className="text-xs text-gray-500">{data.online ? 'Online payments are marked Paid by themselves. Change it by hand only for money received another way.' : 'Change Payment to Paid when the fee arrives.'}</span>
                <button onClick={excel} disabled={!rows.length} className={`${btn} ml-auto`}><Download className="w-3.5 h-3.5" />Download Excel</button>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white overflow-auto">
                <table className="w-full text-[13px] min-w-[820px]">
                  <thead className="bg-gray-50 text-xs text-gray-500">
                    <tr>{['Person', 'Company', 'Phone', 'Came from', 'Registered', 'Payment', 'Emails sent', ''].map((h) => <th key={h} className="text-left px-3 py-2 font-medium">{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.id} className="border-t border-gray-100 align-top">
                        <td className="px-3 py-2"><div className="font-medium text-gray-900">{r.name}</div><a href={`mailto:${r.email}`} className="text-blue-700 hover:underline break-all">{r.email}</a></td>
                        <td className="px-3 py-2 text-gray-700">{r.company || <span className="text-gray-300">not given</span>}{r.role && <div className="text-xs text-gray-500">{r.role}</div>}</td>
                        <td className="px-3 py-2 whitespace-nowrap"><a href={`tel:${r.phone.replace(/[^\d+]/g, '')}`} className="text-gray-700 hover:underline">{r.phone}</a></td>
                        <td className="px-3 py-2 text-gray-600 break-words max-w-[170px]">{r.source || 'direct'}</td>
                        <td className="px-3 py-2 text-gray-500 whitespace-nowrap">{new Date(r.at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                        <td className="px-3 py-2">
                          <select value={r.payment} disabled={busy === r.id} onChange={(e) => setPayment(r.id, e.target.value as Reg['payment'])} aria-label={`Payment for ${r.name}`}
                            className={`text-xs rounded-md border px-2 py-1.5 ${r.payment === 'paid' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : r.payment === 'refunded' ? 'border-gray-200 bg-gray-50 text-gray-600' : 'border-amber-200 bg-amber-50 text-amber-800'}`}>
                            {(Object.keys(PAY) as Reg['payment'][]).map((k) => <option key={k} value={k}>{PAY[k]}</option>)}
                          </select>
                          {r.paymentId && <div className="mt-1 text-[11px] text-gray-400" title={r.paidAt ? `Paid online ${new Date(r.paidAt).toLocaleString('en-IN')}` : undefined}>online · {r.paymentId}</div>}
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex flex-wrap gap-1">
                            {(['payment', 'reminder', 'join', 'kit'] as Kind[]).map((k) => r.emails?.[k]
                              ? <span key={k} title={`Sent ${new Date(r.emails[k]).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}`} className="inline-flex items-center gap-0.5 text-[11px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700"><Check className="w-3 h-3" />{SHORT[k]}</span>
                              : null)}
                            {!Object.keys(r.emails || {}).length && <span className="text-xs text-gray-300">none yet</span>}
                          </div>
                        </td>
                        <td className="px-2 py-2 text-right"><button onClick={() => remove(r)} disabled={busy === r.id} title="Remove this registration" aria-label={`Remove ${r.name}`} className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600 disabled:opacity-40"><Trash2 className="w-3.5 h-3.5" /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {rows.length === 0 && <div className="p-8 text-sm text-gray-500 text-center">{all.length ? 'Nobody matches that search.' : 'Nobody has registered for this weekend yet. Send the invitation from the Emails tab to start filling it.'}</div>}
              </div>
            </>
          ) : (
            <div className="grid lg:grid-cols-[300px_1fr] gap-4">
              {/* The five emails, in the order they are used */}
              <div className="space-y-1.5">
                {data.emails.map((e, i) => {
                  const sentTo = e.kind === 'invite' ? (saved?.invitedCount || 0) : live.filter((r) => r.emails?.[e.kind]).length
                  const on = kind === e.kind
                  return (
                    <button key={e.kind} onClick={() => { setKind(e.kind); setAgain(false); setNotice('') }} className={`w-full text-left rounded-xl border px-3 py-2.5 ${on ? 'border-gray-800 bg-white' : 'border-gray-200 bg-white hover:border-gray-400'}`}>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold"><span className="text-gray-400 font-normal mr-1.5">{i + 1}</span>{e.title}</span>
                        <span className="text-[11px] text-gray-500">sent to {sentTo}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">{e.when}</div>
                    </button>
                  )
                })}
                <p className="text-xs text-gray-400 px-1 pt-1">These are the weekend&apos;s own emails. The CRM email series is separate and is not sent to these people.</p>
              </div>

              {info && (
                <div className="space-y-3 min-w-0">
                  <div className="rounded-xl border border-gray-200 bg-white p-3.5 space-y-3">
                    <div className="text-xs text-gray-500">Goes to: <span className="text-gray-800 font-medium">{info.to}</span></div>

                    {info.needs && (
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">{NEED_LABEL[info.needs]}{kind === 'payment' && data.online ? ' (optional: another way to pay, shown under the Pay now button)' : ''}</label>
                        {info.needs === 'payment'
                          ? <textarea rows={4} value={draft.payment} onChange={(e) => setDraft({ ...draft, payment: e.target.value })} placeholder={`For example:\nPay ₹${data.fee} by UPI to gennoor@upi\nor use this link: https://…`} className={field} />
                          : <input value={draft[info.needs]} onChange={(e) => setDraft({ ...draft, [info.needs!]: e.target.value })} placeholder="https://…" className={field} />}
                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                          <button onClick={saveSetting} disabled={!dirty || busy === 'save'} className={btn}>{busy === 'save' ? 'Saving…' : 'Save'}</button>
                          <span className="text-xs text-gray-400">{NEED_HINT[info.needs]}</span>
                        </div>
                      </div>
                    )}

                    {kind === 'invite' && (
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Who to invite</label>
                        <textarea rows={5} value={recipients} onChange={(e) => setRecipients(e.target.value)} placeholder={'One per line. A name is optional.\npriya@example.com\nRahul Mehta, rahul@example.com'} className={`${field} font-mono text-[13px]`} />
                        <p className="text-xs text-gray-400 mt-1">Up to {data.inviteLimit} at a time. People already registered or already invited for this weekend are skipped. Invite only people who would expect to hear from you.</p>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-3">
                      <button onClick={send} disabled={busy === 'send' || !count || !!missing || dirty} className={primary}>
                        {busy === 'send' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}Send to {count} {count === 1 ? 'person' : 'people'}
                      </button>
                      {kind !== 'invite' && audience.length > notYet.length && (
                        <label className="text-xs text-gray-600 inline-flex items-center gap-1.5"><input type="checkbox" checked={again} onChange={(e) => setAgain(e.target.checked)} />Also send again to the {audience.length - notYet.length} who already had it</label>
                      )}
                      {missing && <span className="text-xs text-amber-700">Add {info.needsLabel} above and save first.</span>}
                      {dirty && <span className="text-xs text-amber-700">Save your change before sending.</span>}
                      {!missing && !dirty && !count && kind !== 'invite' && <span className="text-xs text-gray-400">{audience.length ? 'Everyone has had this one.' : 'Nobody to send to yet.'}</span>}
                    </div>
                  </div>

                  <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                    <div className="px-3.5 py-2 border-b border-gray-100">
                      <div className="text-[11px] text-gray-400">Preview, shown with a sample name</div>
                      <div className="text-sm font-medium truncate">{preview?.subject || '…'}</div>
                    </div>
                    {preview && <iframe title="Email preview" srcDoc={preview.html} sandbox="" className="w-full h-[640px] border-0 bg-gray-100" />}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
