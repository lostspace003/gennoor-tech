'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AlertTriangle, Check, Clock, Search, Send } from 'lucide-react'
import type { EmailRecord, Lead } from '@/lib/crm/types'
import { SEQUENCE, isOpen, sequenceProgress, stepNumber } from '@/lib/crm/sequence'
import { needsAnswer } from '@/lib/crm/replies'
import { sendHint, sendState, seriesRecord, type SendState } from '@/lib/crm/delivery'
import { CAMPAIGN_OUTREACH, nextCohort } from '@/data/ai-weekend'
import { shortName } from '@/lib/crm/users'
import { useCrm } from './CrmContext'
import SendStepModal from './SendStep'
import { EmailPopup, type Item } from './EmailBoard'
import { StatusBadge, formatDateTime, timeAgo } from './shared'

/**
 * Every lead against every email, on one screen (owner, 14 November 2026: "more like a dashboard canvas feel,
 * which makes it very easy for us to track individuals, track our work for the emails that we are sending.
 * Very simple filters but very effective").
 *
 * One row is a lead; one column is an email: the nine of the series, then the AI Weekend campaign. A cell says
 * what became of that email for that lead. Pressing an email that went shows what was sent; pressing one that
 * has not gone opens the lead's board with that email ready to send. The numbers at the top are the filters.
 */

type CellState = SendState | 'due' | 'next' | 'none' | 'off'
interface Cell { id: string; state: CellState; hint: string; record?: EmailRecord; days?: number }
interface Row { lead: Lead; series: Cell[]; weekend: Cell[]; due: boolean; waiting: boolean; way: boolean; unsure: boolean; failed: boolean; last: string; sentCount: number }
type Show = 'all' | 'due' | 'way' | 'unsure' | 'failed' | 'waiting'

/** Short names for the columns. The full title is said when the pointer rests on one. */
const SHORT: Record<string, string> = { intro: 'Intro', samples: 'Samples', custom: 'Custom', time: 'Time', claude: 'Claude', projects: 'Projects', support: 'Support', platform: 'Platform', checkin: 'Check-in' }
const PAGE = 60

export default function EmailTracker() {
  const { leads, userEmail, notify, reload, loading } = useCrm()
  const router = useRouter()
  const [q, setQ] = useState('')
  const [everyone, setEveryone] = useState(false)
  const [show, setShow] = useState<Show>('all')
  const [shownRows, setShownRows] = useState(PAGE)
  const [open, setOpen] = useState<{ item: Item; lead: Lead } | null>(null)
  const [sending, setSending] = useState<Lead[] | null>(null)
  const cohort = useMemo(() => nextCohort(), [])

  const rows: Row[] = useMemo(() => {
    const me = userEmail.toLowerCase()
    return leads
      .filter((l) => !l.dumped && (everyone || !l.owner || l.owner.toLowerCase() === me))
      .map((lead): Row => {
        const p = sequenceProgress(lead)
        const waiting = needsAnswer(lead)
        const canGo = isOpen(lead) && !!lead.email && !p.stopped
        const series = SEQUENCE.map((s): Cell => {
          const name = `Email ${stepNumber(s.id)} · ${s.title}`
          const sent = lead.sequence?.sent.find((x) => x.step === s.id)
          const record = seriesRecord(lead, s.id) || undefined
          if (sent) {
            const state = record ? sendState(record) : 'sent'
            return { id: s.id, state, record, hint: `${name}: ${record ? sendHint({ at: record.at, state, error: record.error }) : `sent ${formatDateTime(sent.at)}.`} Sent by ${shortName(sent.by)}. Press to see what was sent.` }
          }
          if (record?.status === 'failed') return { id: s.id, state: 'failed', record, hint: `${name}: did not go${record.error ? ` (${record.error})` : ''}. Press to open the lead and send it again.` }
          if (!canGo) return { id: s.id, state: 'off', hint: `${name}: not sent. ${p.stopped ? 'The emails for this lead were stopped.' : !lead.email ? 'This lead has no email address.' : 'This lead is closed.'}` }
          if (p.next?.id === s.id) return p.due ? { id: s.id, state: 'due', hint: `${name}: due now. Press to put it on the lead's board and send it.` } : { id: s.id, state: 'next', days: p.daysUntil, hint: `${name}: next, due in ${p.daysUntil} day${p.daysUntil === 1 ? '' : 's'}. Press to put it on the lead's board.` }
          return { id: s.id, state: 'none', hint: `${name}: not sent yet. Press to put it on the lead's board.` }
        })
        const weekend = CAMPAIGN_OUTREACH.map((e): Cell => {
          const name = `AI Weekend · ${e.title}`
          const record = (lead.emailHistory || []).find((r) => r.weekend?.kind === e.kind && r.weekend.cohort === cohort.id)
          if (record) { const state = sendState(record); return { id: e.kind, state, record, hint: `${name}: ${sendHint({ at: record.at, state, error: record.error })} Press to see what was sent.` } }
          if (!canGo) return { id: e.kind, state: 'off', hint: `${name}: not sent.` }
          return { id: e.kind, state: 'none', hint: `${name}: not sent for the weekend of ${cohort.label}. Press to put it on the lead's board.` }
        })
        const all = [...series, ...weekend]
        const last = (lead.emailHistory || []).find((e) => e.status === 'sent')?.at || ''
        return {
          lead, series, weekend, waiting, last,
          due: !waiting && series.some((c) => c.state === 'due'),
          way: all.some((c) => c.state === 'onItsWay'),
          unsure: all.some((c) => c.state === 'unconfirmed'),
          failed: all.some((c) => c.state === 'failed'),
          sentCount: all.filter((c) => c.state === 'sent').length,
        }
      })
      // What needs a person first, then the most recent work
      .sort((a, b) => Number(b.waiting) - Number(a.waiting) || Number(b.failed || b.unsure) - Number(a.failed || a.unsure) || Number(b.due) - Number(a.due) || b.last.localeCompare(a.last))
  }, [leads, everyone, userEmail, cohort])

  const counts: Record<Show, number> = {
    all: rows.length,
    due: rows.filter((r) => r.due).length,
    way: rows.filter((r) => r.way).length,
    unsure: rows.filter((r) => r.unsure).length,
    failed: rows.filter((r) => r.failed).length,
    waiting: rows.filter((r) => r.waiting).length,
  }
  const match = (r: Row) => (show === 'all' ? true : show === 'due' ? r.due : show === 'way' ? r.way : show === 'unsure' ? r.unsure : show === 'failed' ? r.failed : r.waiting)
  const n = q.trim().toLowerCase()
  const visible = rows.filter((r) => match(r) && (!n || `${r.lead.name} ${r.lead.company} ${r.lead.email}`.toLowerCase().includes(n)))
  const dueLeads = visible.filter((r) => r.due).map((r) => r.lead)

  const press = (r: Row, c: Cell, campaign: 'series' | 'weekend') => {
    if (c.record && c.state !== 'failed') {
      const title = campaign === 'series' ? `Email ${stepNumber(c.id)} · ${SEQUENCE.find((s) => s.id === c.id)?.title}` : `AI Weekend · ${CAMPAIGN_OUTREACH.find((e) => e.kind === c.id)?.title}`
      setOpen({ lead: r.lead, item: { key: `${r.lead.id}-${c.id}`, kind: campaign, at: c.record.at, title, subject: c.record.subject, state: c.state as SendState, record: c.record } })
      return
    }
    if (c.state === 'off') { router.push(`/crm/leads/${r.lead.id}?tab=emails`); return }
    router.push(`/crm/leads/${r.lead.id}?tab=emails&stage=${campaign === 'weekend' ? `weekend:${c.id}` : c.id}`)
  }

  const TILES: Array<[Show, string, string]> = [
    ['all', 'Leads', 'everyone on this screen'],
    ['due', 'Due now', 'their next email can go'],
    ['waiting', 'Replied', 'waiting for your answer'],
    ['way', 'On its way', 'taken, not confirmed yet'],
    ['unsure', 'Not confirmed', 'a day without an answer'],
    ['failed', 'Did not go', 'to send again'],
  ]

  return (
    <div className="p-3 sm:p-4 space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Who has had which email</h2>
          <p className="text-xs text-gray-500 mt-0.5">One row is a lead, one column is an email. Press an email that went to see what was sent; press one that has not gone to send it from the lead&apos;s board.</p>
        </div>
        <label className="text-xs text-gray-600 inline-flex items-center gap-1.5 cursor-pointer"><input type="checkbox" className="rounded" checked={everyone} onChange={(e) => { setEveryone(e.target.checked); setShownRows(PAGE) }} />Show everyone&apos;s leads</label>
      </div>

      {/* The numbers are the filters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {TILES.map(([id, label, sub]) => (
          <button key={id} onClick={() => { setShow(id); setShownRows(PAGE) }} aria-pressed={show === id}
            className={`text-left rounded-xl border bg-raised px-3 py-2 ${show === id ? 'border-gray-800' : 'border-gray-200 hover:border-gray-400'}`}>
            <div className="text-[11px] text-gray-500">{label}</div>
            <div className={`text-xl font-semibold tracking-tight ${counts[id] && (id === 'failed' || id === 'waiting') ? 'text-red-700' : counts[id] && id === 'unsure' ? 'text-amber-700' : 'text-gray-900'}`}>{counts[id]}</div>
            <div className="text-[11px] text-gray-400 truncate">{sub}</div>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input value={q} onChange={(e) => { setQ(e.target.value); setShownRows(PAGE) }} placeholder="Search name, organization or email" aria-label="Search the leads" className="text-sm border border-gray-200 rounded-lg pl-8 pr-3 py-2 w-72 max-w-full bg-raised" />
        </div>
        <span className="text-xs text-gray-500">{visible.length} lead{visible.length === 1 ? '' : 's'}</span>
        {dueLeads.length > 0 && (
          <button onClick={() => setSending(dueLeads.slice(0, 50))} className="ml-auto px-3.5 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 flex items-center gap-1.5">
            <Send className="w-4 h-4" /> Review and send the {Math.min(dueLeads.length, 50)} due
          </button>
        )}
      </div>

      <div className="rounded-xl border border-gray-200 bg-raised overflow-auto">
        <table className="w-full text-[13px] min-w-[1020px]">
          <thead className="bg-gray-50 text-gray-500">
            <tr className="text-[11px]">
              <th className="sticky left-0 z-10 bg-gray-50 text-left px-3 pt-2 font-medium" rowSpan={2}>Lead</th>
              <th className="px-1 pt-2 font-semibold text-gray-700 text-center border-l border-gray-200" colSpan={SEQUENCE.length}>Email series</th>
              <th className="px-1 pt-2 font-semibold text-gray-700 text-center border-l border-gray-200" colSpan={CAMPAIGN_OUTREACH.length} title={`For the weekend of ${cohort.label}`}>AI Weekend · {cohort.monthName}</th>
              <th className="text-left px-3 pt-2 font-medium border-l border-gray-200" rowSpan={2}>Last email</th>
            </tr>
            <tr className="text-[10.5px]">
              {SEQUENCE.map((s, i) => <th key={s.id} title={`Email ${i + 1}: ${s.title}`} className={`px-1 pb-1.5 font-medium text-center ${i === 0 ? 'border-l border-gray-200' : ''}`}><span className="block text-gray-700">{i + 1}</span>{SHORT[s.id] || s.id}</th>)}
              {CAMPAIGN_OUTREACH.map((e, i) => <th key={e.kind} title={e.title} className={`px-1 pb-1.5 font-medium text-center ${i === 0 ? 'border-l border-gray-200' : ''}`}><span className="block text-gray-700">{i + 1}</span>{e.short}</th>)}
            </tr>
          </thead>
          <tbody>
            {visible.slice(0, shownRows).map((r) => (
              <tr key={r.lead.id} className="border-t border-gray-100 hover:bg-gray-50/60">
                <td className="sticky left-0 z-10 bg-raised px-3 py-1.5 max-w-[260px]">
                  <Link href={`/crm/leads/${r.lead.id}?tab=emails`} className="block min-w-0 group">
                    <span className="flex items-center gap-1.5 min-w-0">
                      <span className="font-medium text-gray-900 truncate group-hover:text-primary-600">{r.lead.name || r.lead.email}</span>
                      {r.waiting && <span className="shrink-0 text-[10.5px] font-medium px-1.5 py-px rounded-full bg-red-50 text-red-700">{r.lead.reply?.kind === 'stop' ? 'asked to stop' : 'replied'}</span>}
                    </span>
                    <span className="block text-[11px] text-gray-500 truncate">{r.lead.company || 'no organization yet'}</span>
                  </Link>
                </td>
                {r.series.map((c, i) => <td key={c.id} className={`px-1 py-1.5 text-center ${i === 0 ? 'border-l border-gray-100' : ''}`}><CellButton cell={c} onClick={() => press(r, c, 'series')} /></td>)}
                {r.weekend.map((c, i) => <td key={c.id} className={`px-1 py-1.5 text-center ${i === 0 ? 'border-l border-gray-100' : ''}`}><CellButton cell={c} onClick={() => press(r, c, 'weekend')} /></td>)}
                <td className="px-3 py-1.5 border-l border-gray-100 whitespace-nowrap">
                  <span className="flex items-center gap-2"><StatusBadge status={r.lead.status} /><span className="text-[11px] text-gray-500">{r.last ? timeAgo(r.last) : 'none yet'}</span></span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {visible.length === 0 && <div className="p-8 text-sm text-gray-500 text-center">{loading ? 'Loading…' : rows.length ? 'No lead matches. Press "Leads" above to see them all.' : 'No leads yet.'}</div>}
      </div>
      {visible.length > shownRows && <button onClick={() => setShownRows((x) => x + PAGE)} className="text-sm text-primary-600 hover:underline">Show {Math.min(PAGE, visible.length - shownRows)} more of {visible.length}</button>}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-gray-500">
        {([['sent', 'sent'], ['onItsWay', 'on its way'], ['unconfirmed', 'not confirmed'], ['failed', 'did not go'], ['due', 'due now'], ['next', 'next, in so many days'], ['none', 'not sent yet']] as const).map(([state, word]) => (
          <span key={state} className="inline-flex items-center gap-1.5"><Mark state={state} days={3} />{word}</span>
        ))}
      </div>

      {open && <EmailPopup item={open.item} lead={open.lead} canWork onClose={() => setOpen(null)} onAgain={() => { const id = open.lead.id; setOpen(null); router.push(`/crm/leads/${id}?tab=emails`) }} onReply={() => setOpen(null)} />}
      {sending && <SendStepModal leads={sending} notify={notify} onClose={() => setSending(null)} onSent={async () => { setSending(null); await reload() }} />}
    </div>
  )
}

/** The mark of one state: the same in a cell and in the key under the grid. */
function Mark({ state, days }: { state: CellState; days?: number }) {
  const box = 'inline-flex items-center justify-center w-6 h-6 rounded-full'
  return state === 'sent' ? <span className={`${box} bg-green-50`}><Check className="w-3.5 h-3.5 text-green-700" /></span>
    : state === 'onItsWay' ? <span className={`${box} bg-gray-100`}><Clock className="w-3.5 h-3.5 text-gray-600" /></span>
    : state === 'unconfirmed' ? <span className={`${box} bg-amber-50`}><AlertTriangle className="w-3.5 h-3.5 text-amber-700" /></span>
    : state === 'failed' ? <span className={`${box} bg-red-50`}><AlertTriangle className="w-3.5 h-3.5 text-red-700" /></span>
    : state === 'due' ? <span className={`${box} bg-primary-600`}><Send className="w-3 h-3 text-white" /></span>
    : state === 'next' ? <span className={`${box} border border-primary-600 text-[10px] font-semibold text-primary-700`}>{days}d</span>
    : <span className={box}><span className={`w-1.5 h-1.5 rounded-full ${state === 'off' ? 'bg-gray-200' : 'bg-gray-300'}`} /></span>
}

function CellButton({ cell, onClick }: { cell: Cell; onClick: () => void }) {
  return (
    <button onClick={onClick} title={cell.hint} aria-label={cell.hint} className="rounded-full hover:ring-2 hover:ring-gray-300 focus-visible:ring-2 focus-visible:ring-primary-600">
      <Mark state={cell.state} days={cell.days} />
    </button>
  )
}
