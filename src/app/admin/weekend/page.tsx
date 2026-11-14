'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as XLSX from 'xlsx'
import { Check, ChevronDown, ChevronUp, Download, ExternalLink, GripVertical, Loader2, Mail, RefreshCw, Send, Trash2, UserPlus, Users, X } from 'lucide-react'

type Kind = 'invite' | 'inside' | 'fit' | 'closing' | 'thanks' | 'payment' | 'reminder' | 'join' | 'kit'
interface Reg { id: string; cohort: string; name: string; email: string; phone: string; company: string; role: string; at: string; payment: 'pending' | 'paid' | 'refunded'; fee: number; currency?: 'INR' | 'USD'; source: string; note?: string; emails?: Record<string, string>; paymentId?: string; paidAt?: string }
interface Settings { joinUrl: string; payment: string; kitUrl: string; invitedCount: number; sent?: Record<string, number> }
interface EmailInfo { kind: Kind; title: string; when: string; to: string; group: 'campaign' | 'desk'; outreach?: boolean; needs?: 'joinUrl' | 'payment' | 'kitUrl'; needsLabel?: string }
/** A lead, as far as choosing who gets a campaign email needs it. */
interface LeadRow { id: string; name: string; email: string; company: string; dumped?: unknown; sequence?: { stopped?: unknown }; reply?: { kind?: string } }
interface Data { order: Kind[]; current: string; seats: number; fee: number; cohorts: { id: string; label: string }[]; settings: Record<string, Settings>; emails: EmailInfo[]; inviteLimit: number; online: boolean; testMode: boolean; registrations: Reg[] }

const btn = 'inline-flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium rounded-md border border-gray-200 bg-raised hover:border-gray-400 disabled:opacity-40'
const primary = 'inline-flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium bg-gray-800 text-white rounded-md hover:bg-gray-900 disabled:opacity-40'
const field = 'w-full text-sm border border-gray-200 rounded-md px-2.5 py-2 bg-raised focus:outline-none focus:border-blue-500'
const PAY: Record<Reg['payment'], string> = { pending: 'Not paid yet', paid: 'Paid', refunded: 'Refunded' }
const SHORT: Record<Kind, string> = { invite: 'Invite', inside: 'Demos', fit: 'For you', closing: 'Closing', thanks: 'Thanks', payment: 'Pay', reminder: 'Reminder', join: 'Link', kit: 'Kit' }
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
  // The campaign emails in the order staff gave them, the one being dragged, and the list of leads to choose from
  const [order, setOrder] = useState<Kind[]>([])
  const [dragged, setDragged] = useState<Kind | null>(null)
  // The same, readable at once by the row it is dropped on (the state above only dims the row being dragged)
  const dragging = useRef<Kind | null>(null)
  const [picking, setPicking] = useState(false)

  const load = useCallback(async () => {
    const r = await fetch('/api/admin/weekend').catch(() => null)
    const j = r ? await r.json().catch(() => ({})) : {}
    if (!r?.ok) { setError(j.error || `Could not load (${r?.status ?? 'offline'})`); return }
    setData(j)
    setOrder(j.order || [])
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
  // A campaign email that goes to people you choose (the leads, or pasted), not to the people who registered
  const outreach = !!info?.outreach
  const audience = kind === 'payment' ? pending : kind === 'reminder' || kind === 'thanks' ? live : paid
  const notYet = audience.filter((r) => !r.emails?.[kind])
  const pasted = recipients.split(/[\n;]+/).filter((l) => /@/.test(l)).length
  const count = outreach ? pasted : again ? audience.length : notYet.length
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
    setNotice(`Sent to ${j.sent}${j.skipped ? `. ${j.skipped} skipped (already had it, or already registered)` : ''}${j.stopped ? `. ${j.stopped} left out because they asked us to stop` : ''}${j.failed?.length ? `. Failed: ${j.failed.join(', ')}` : ''}`)
    if (outreach) setRecipients('')
    await load()
  }

  /** Put one campaign email where another stands, and keep the new order for everyone. */
  async function moveEmail(from: Kind, to: Kind) {
    if (from === to) return
    const next = order.filter((k) => k !== from)
    const at = next.indexOf(to)
    next.splice(order.indexOf(from) < order.indexOf(to) ? at + 1 : at, 0, from)
    const before = order
    setOrder(next)
    const j = await call('PUT', { order: next }, 'order')
    if (j?.order) setOrder(j.order)
    else setOrder(before)
  }

  /** People chosen from the leads are added to the list as "Name, address", each address once. */
  function addPeople(lines: string[]) {
    const have = new Set(recipients.split(/[\n;]+/).map((l) => (l.match(/[^\s,<>]+@[^\s,<>]+/)?.[0] || '').toLowerCase()).filter(Boolean))
    const fresh = lines.filter((l) => !have.has((l.match(/[^\s,<>]+@[^\s,<>]+/)?.[0] || '').toLowerCase()))
    setRecipients([recipients.trim(), ...fresh].filter(Boolean).join('\n'))
    setPicking(false)
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
      Payment: PAY[r.payment], Fee: r.fee, 'Paid in': r.currency || 'INR', 'Came from': r.source, 'Registered on': r.at.slice(0, 10),
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
            <select value={cohort} onChange={(e) => setCohort(e.target.value)} className="text-sm border border-gray-200 rounded-md px-2.5 py-1.5 bg-raised" aria-label="Which weekend">
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
              [[`₹${paid.filter((r) => (r.currency || 'INR') === 'INR').reduce((n, r) => n + r.fee, 0).toLocaleString('en-IN')}`, ...(paid.some((r) => r.currency === 'USD') ? [`$${paid.filter((r) => r.currency === 'USD').reduce((n, r) => n + r.fee, 0).toFixed(2)}`] : [])].join(' + '), 'received'],
            ].map(([big, small]) => (
              <div key={small} className="rounded-xl border border-gray-200 bg-raised px-4 py-3">
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
              <div className="rounded-xl border border-gray-200 bg-raised overflow-auto">
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
                            {(['thanks', 'payment', 'reminder', 'join', 'kit'] as Kind[]).map((k) => r.emails?.[k]
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
              {/* Two lists: the campaign that brings people in (its order can be changed), then the emails of the weekend itself */}
              <div className="space-y-1.5">
                <div className="px-1 text-xs font-semibold text-gray-700">The campaign</div>
                <p className="px-1 pb-0.5 text-xs text-gray-400">From &quot;what is it&quot; to &quot;registration closes&quot; to &quot;thank you&quot;. Drag an email, or use its arrows, to change the order.</p>
                {order.map((k, i) => {
                  const e = data.emails.find((x) => x.kind === k)
                  if (!e) return null
                  const sentTo = e.outreach ? (saved?.sent?.[e.kind] ?? (e.kind === 'invite' ? saved?.invitedCount || 0 : 0)) : live.filter((r) => r.emails?.[e.kind]).length
                  const on = kind === e.kind
                  return (
                    <div key={e.kind} draggable onDragStart={() => { dragging.current = e.kind; setDragged(e.kind) }} onDragEnd={() => { dragging.current = null; setDragged(null) }} onDragOver={(ev) => ev.preventDefault()}
                      onDrop={(ev) => { ev.preventDefault(); const from = dragging.current; dragging.current = null; setDragged(null); if (from) moveEmail(from, e.kind) }}
                      className={`flex items-stretch rounded-xl border bg-raised ${on ? 'border-gray-800' : 'border-gray-200 hover:border-gray-400'} ${dragged === e.kind ? 'opacity-50' : ''}`}>
                      <span className="flex items-center pl-1.5 text-gray-300 cursor-grab" aria-hidden="true"><GripVertical className="w-4 h-4" /></span>
                      <button onClick={() => { setKind(e.kind); setAgain(false); setNotice(''); setPicking(false) }} className="min-w-0 flex-1 text-left px-2 py-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold"><span className="text-gray-400 font-normal mr-1.5">{i + 1}</span>{e.title}</span>
                          <span className="text-[11px] text-gray-500 whitespace-nowrap">sent to {sentTo}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">{e.when}</div>
                      </button>
                      <span className="flex flex-col justify-center pr-1">
                        <button onClick={() => moveEmail(e.kind, order[i - 1])} disabled={i === 0 || busy === 'order'} aria-label={`Move "${e.title}" up`} title="Move up" className="p-0.5 rounded text-gray-400 hover:text-gray-900 disabled:opacity-25"><ChevronUp className="w-4 h-4" /></button>
                        <button onClick={() => moveEmail(e.kind, order[i + 1])} disabled={i === order.length - 1 || busy === 'order'} aria-label={`Move "${e.title}" down`} title="Move down" className="p-0.5 rounded text-gray-400 hover:text-gray-900 disabled:opacity-25"><ChevronDown className="w-4 h-4" /></button>
                      </span>
                    </div>
                  )
                })}

                <div className="px-1 pt-3 text-xs font-semibold text-gray-700">After someone registers</div>
                {data.emails.filter((e) => e.group === 'desk').map((e, i) => {
                  const sentTo = live.filter((r) => r.emails?.[e.kind]).length
                  const on = kind === e.kind
                  return (
                    <button key={e.kind} onClick={() => { setKind(e.kind); setAgain(false); setNotice(''); setPicking(false) }} className={`w-full text-left rounded-xl border px-3 py-2.5 ${on ? 'border-gray-800 bg-raised' : 'border-gray-200 bg-raised hover:border-gray-400'}`}>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold"><span className="text-gray-400 font-normal mr-1.5">{i + 1}</span>{e.title}</span>
                        <span className="text-[11px] text-gray-500 whitespace-nowrap">sent to {sentTo}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">{e.when}</div>
                    </button>
                  )
                })}
                <p className="text-xs text-gray-400 px-1 pt-1">Nothing here goes by itself: you choose who gets an email and press Send. The CRM email series is separate.</p>
              </div>

              {info && (
                <div className="space-y-3 min-w-0">
                  <div className="rounded-xl border border-gray-200 bg-raised p-3.5 space-y-3">
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

                    {outreach && (
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                          <label className="block text-xs font-medium text-gray-700">Who gets it</label>
                          <button onClick={() => setPicking((v) => !v)} className={btn}><UserPlus className="w-3.5 h-3.5" />Choose from the leads</button>
                        </div>
                        {picking && <LeadPicker onAdd={addPeople} onClose={() => setPicking(false)} />}
                        <textarea rows={5} value={recipients} onChange={(e) => setRecipients(e.target.value)} placeholder={'One per line. A name is optional.\npriya@example.com\nRahul Mehta, rahul@example.com'} className={`${field} font-mono text-[13px]`} />
                        <p className="text-xs text-gray-400 mt-1">Up to {data.inviteLimit} at a time (the email service allows the whole site about 100 an hour). Left out by themselves: people already registered for this weekend, people who already had this email, and anyone who asked us to stop. Write only to people who would expect to hear from you.</p>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-3">
                      <button onClick={send} disabled={busy === 'send' || !count || !!missing || dirty} className={primary}>
                        {busy === 'send' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}Send to {count} {count === 1 ? 'person' : 'people'}
                      </button>
                      {!outreach && audience.length > notYet.length && (
                        <label className="text-xs text-gray-600 inline-flex items-center gap-1.5"><input type="checkbox" checked={again} onChange={(e) => setAgain(e.target.checked)} />Also send again to the {audience.length - notYet.length} who already had it</label>
                      )}
                      {missing && <span className="text-xs text-amber-700">Add {info.needsLabel} above and save first.</span>}
                      {dirty && <span className="text-xs text-amber-700">Save your change before sending.</span>}
                      {!missing && !dirty && !count && !outreach && <span className="text-xs text-gray-400">{audience.length ? 'Everyone has had this one.' : 'Nobody to send to yet.'}</span>}
                    </div>
                  </div>

                  <div className="rounded-xl border border-gray-200 bg-raised overflow-hidden">
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

/**
 * Choose who gets a campaign email from the CRM's leads: search, tick, add. Archived leads and anyone whose
 * emails were stopped are not offered (the server leaves them out as well, whatever is typed).
 */
function LeadPicker({ onAdd, onClose }: { onAdd: (lines: string[]) => void; onClose: () => void }) {
  const [leads, setLeads] = useState<LeadRow[] | null>(null)
  const [failed, setFailed] = useState(false)
  const [find, setFind] = useState('')
  const [picked, setPicked] = useState<Set<string>>(new Set())
  useEffect(() => {
    fetch('/api/admin/leads').then((r) => (r.ok ? r.json() : Promise.reject())).then((j) => setLeads(j.leads || [])).catch(() => setFailed(true))
  }, [])
  const usable = useMemo(() => (leads || []).filter((l) => /@/.test(l.email || '') && !l.dumped && !l.sequence?.stopped && l.reply?.kind !== 'stop'), [leads])
  const shown = useMemo(() => {
    const n = find.trim().toLowerCase()
    return n ? usable.filter((l) => `${l.name} ${l.email} ${l.company}`.toLowerCase().includes(n)) : usable
  }, [usable, find])
  const toggle = (id: string) => setPicked((s) => { const next = new Set(s); if (next.has(id)) next.delete(id); else next.add(id); return next })
  const leftOut = (leads?.length || 0) - usable.length
  return (
    <div className="mb-2 rounded-lg border border-gray-200 bg-gray-50 p-2.5 space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <input value={find} onChange={(e) => setFind(e.target.value)} placeholder="Search name, company, email" aria-label="Search the leads" className="text-sm border border-gray-200 rounded-md px-2.5 py-1.5 bg-raised flex-1 min-w-[180px]" />
        <button onClick={() => setPicked(new Set([...picked, ...shown.map((l) => l.id)]))} disabled={!shown.length} className={btn}>Tick the {shown.length} shown</button>
        <button onClick={() => setPicked(new Set())} disabled={!picked.size} className={btn}>Untick all</button>
        <button onClick={onClose} aria-label="Close the list of leads" className="p-1.5 rounded text-gray-400 hover:text-gray-900"><X className="w-4 h-4" /></button>
      </div>
      {failed ? <div className="text-sm text-red-700 px-1">Could not load the leads. Close this and try again.</div>
        : !leads ? <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
        : (
          <div className="max-h-64 overflow-auto rounded-md border border-gray-200 bg-raised divide-y divide-gray-100">
            {shown.slice(0, 400).map((l) => (
              <label key={l.id} className="flex items-start gap-2 px-2.5 py-1.5 text-[13px] cursor-pointer hover:bg-gray-50">
                <input type="checkbox" className="mt-0.5" checked={picked.has(l.id)} onChange={() => toggle(l.id)} />
                <span className="min-w-0"><span className="font-medium text-gray-900">{l.name || l.email}</span>{l.company && <span className="text-gray-500"> · {l.company}</span>}<span className="block text-xs text-gray-500 break-all">{l.email}</span></span>
              </label>
            ))}
            {!shown.length && <div className="p-4 text-sm text-gray-500 text-center">{usable.length ? 'No lead matches that search.' : 'There is no lead to choose yet.'}</div>}
          </div>
        )}
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={() => onAdd(usable.filter((l) => picked.has(l.id)).map((l) => `${(l.name || '').replace(/[,;<>\n]/g, ' ').trim()}, ${l.email.trim()}`))} disabled={!picked.size} className={primary}>Add {picked.size} to the list</button>
        <span className="text-xs text-gray-400">{shown.length > 400 ? `Showing the first 400 of ${shown.length}: search to narrow it. ` : ''}{leftOut > 0 ? `${leftOut} not offered: archived, no email address, or their emails were stopped.` : ''}</span>
      </div>
    </div>
  )
}
