'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CalendarDays, ClipboardCheck, Mail, MessageSquareReply, Timer, Trophy } from 'lucide-react'
import { campaignStats } from '@/lib/crm/universities-stats'
import { UNI_STAGES, UNI_STAGE_LABELS, type University } from '@/lib/crm/universities-types'
import { STAGE_DOT } from './university-shared'
import { api } from './shared'

/**
 * How the whole campaign is moving, on one page: the funnel from the first email to the partnership, who needs a
 * person today, the emails by day, the waves and the regions. Everything is counted from the universities
 * themselves by `campaignStats` (lib/crm/universities-stats.ts), so the numbers here and the list cannot disagree.
 * Charts: one blue, one axis, and the same numbers written beside every bar.
 */

const dayWord = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' })

export default function UniversityDashboard({ unis, unmatched }: { unis: University[]; unmatched: number }) {
  const s = useMemo(() => campaignStats(unis, Date.now(), unmatched), [unis, unmatched])
  const top = Math.max(1, s.funnel[0].count)
  const maxDay = Math.max(1, ...s.perDay.map((d) => d.sent))
  const totalLast14 = s.perDay.reduce((n, d) => n + d.sent, 0)

  const tiles = [
    { Icon: Mail, label: 'emails sent', value: s.emailsSent, note: s.failed ? `${s.failed} did not go` : `${s.readyToSend} ready to send` },
    { Icon: MessageSquareReply, label: 'reply rate', value: `${s.replyRate}%`, note: `${s.replied} of ${s.funnel[1].count} emailed` },
    { Icon: ClipboardCheck, label: 'form answers', value: s.formAnswers, note: s.unmatched ? `${s.unmatched} to put on a university` : 'courses chosen in the form' },
    { Icon: Timer, label: 'days to a first reply', value: s.medianReplyDays === null ? '–' : String(s.medianReplyDays), note: s.medianReplyDays === null ? 'no reply yet' : 'the middle one' },
    { Icon: CalendarDays, label: 'calls booked', value: s.funnel[4].count, note: s.upcomingCalls.length ? `${s.upcomingCalls.length} still to come` : 'none coming up' },
    { Icon: Trophy, label: 'partners', value: s.stages.partner, note: `${s.stages.closed} closed` },
  ]

  return (
    <div className="mt-4 space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        {tiles.map(({ Icon, label, value, note }) => (
          <div key={label} className="rounded-xl border border-gray-200 bg-surface px-4 py-3">
            <Icon className="w-4 h-4 text-primary-600" />
            <div className="mt-1.5 text-2xl font-bold text-gray-900 tabular-nums">{value}</div>
            <div className="text-xs text-gray-500">{label}</div>
            <div className="text-[11px] text-gray-400">{note}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <section className="lg:col-span-2 rounded-xl border border-gray-200 bg-surface p-4">
          <h2 className="text-sm font-semibold text-gray-900">From the first email to a partnership</h2>
          <p className="text-xs text-gray-500">How far each university has ever got, whatever it is doing now.</p>
          <ol className="mt-3 space-y-2">
            {s.funnel.map((f, i) => {
              const prev = i > 0 ? s.funnel[i - 1].count : 0
              return (
                <li key={f.key} className="grid grid-cols-[7.5rem_1fr_5.5rem] sm:grid-cols-[9rem_1fr_6.5rem] items-center gap-3 text-sm">
                  <span className="text-gray-700">{f.label}</span>
                  <span className="h-5 rounded bg-gray-100 overflow-hidden" role="img" aria-label={`${f.label}: ${f.count} of ${top}`}>
                    <span className="block h-full rounded bg-primary-500" style={{ width: `${Math.max(f.count ? 2 : 0, (f.count / top) * 100)}%` }} />
                  </span>
                  <span className="text-right tabular-nums text-gray-900 font-medium">{f.count}<span className="ml-1.5 text-xs font-normal text-gray-500">{i > 1 && prev ? `${Math.round((f.count / prev) * 100)}%` : ''}</span></span>
                </li>
              )
            })}
          </ol>
        </section>

        <section className="rounded-xl border border-gray-200 bg-surface p-4">
          <h2 className="text-sm font-semibold text-gray-900">Where they stand</h2>
          <ul className="mt-3 space-y-1.5">
            {UNI_STAGES.map((st) => (
              <li key={st} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-gray-700"><span className={`w-2 h-2 rounded-full ${STAGE_DOT[st]}`} />{UNI_STAGE_LABELS[st]}</span>
                <span className="tabular-nums font-medium text-gray-900">{s.stages[st]}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <section className="rounded-xl border border-gray-200 bg-surface p-4">
          <h2 className="text-sm font-semibold text-gray-900">Needs a person now</h2>
          {s.attention.length === 0 && <p className="mt-2 text-sm text-gray-500">Nothing is waiting on you.</p>}
          <ul className="mt-2 divide-y divide-gray-100">
            {s.attention.slice(0, 10).map((a) => (
              <li key={a.id}>
                <Link href={`/crm/universities/${a.id}?tab=${a.tab}`} className="flex items-start justify-between gap-3 py-2 group">
                  <span className="min-w-0"><span className="block text-sm font-medium text-gray-900 truncate">{a.name}</span><span className="block text-xs text-gray-600">{a.text}</span></span>
                  <ArrowRight className="w-4 h-4 mt-1 shrink-0 text-gray-400 group-hover:text-primary-600" />
                </Link>
              </li>
            ))}
          </ul>
          {s.attention.length > 10 && <p className="mt-1 text-xs text-gray-500">and {s.attention.length - 10} more.</p>}
        </section>

        <section className="rounded-xl border border-gray-200 bg-surface p-4">
          <h2 className="text-sm font-semibold text-gray-900">Emails sent, the last 14 days</h2>
          <p className="text-xs text-gray-500">{totalLast14} in all.</p>
          <div className="mt-3 flex items-end gap-1 h-28" role="list" aria-label="Emails sent each day">
            {s.perDay.map((d) => (
              <div key={d.day} role="listitem" tabIndex={0} aria-label={`${dayWord(d.day)}: ${d.sent}`} title={`${dayWord(d.day)}: ${d.sent}`} className="flex-1 h-full flex flex-col justify-end items-center outline-none focus-visible:ring-2 focus-visible:ring-primary-400 rounded">
                <span className="text-[10px] text-gray-500 tabular-nums h-3.5">{d.sent || ''}</span>
                <span className="w-full rounded-t bg-primary-500" style={{ height: `${d.sent ? Math.max(4, (d.sent / maxDay) * 80) : 2}px`, opacity: d.sent ? 1 : 0.25 }} />
              </div>
            ))}
          </div>
          <div className="mt-1 flex justify-between text-[10px] text-gray-500"><span>{dayWord(s.perDay[0].day)}</span><span>{dayWord(s.perDay[s.perDay.length - 1].day)}</span></div>
        </section>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <section className="rounded-xl border border-gray-200 bg-surface p-4 overflow-x-auto">
          <h2 className="text-sm font-semibold text-gray-900">By wave and by region</h2>
          <table className="mt-2 w-full text-sm">
            <thead><tr className="text-left text-xs text-gray-500 border-b border-gray-200"><th className="py-1.5 font-medium">&nbsp;</th><th className="py-1.5 font-medium text-right">In</th><th className="py-1.5 font-medium text-right">Emailed</th><th className="py-1.5 font-medium text-right">Replied</th><th className="py-1.5 font-medium text-right">Evaluating</th><th className="py-1.5 font-medium text-right">Partner</th></tr></thead>
            <tbody>
              {s.byWave.map((g) => (
                <tr key={g.wave} className="border-b border-gray-100 font-medium"><td className="py-1.5 text-gray-900">Wave {g.wave}{g.wave === 1 ? ' · high priority' : ''}</td><Cells g={g} /></tr>
              ))}
              {s.byRegion.map((g) => (
                <tr key={g.region} className="border-b border-gray-100 last:border-0"><td className="py-1.5 text-gray-700">{g.region}</td><Cells g={g} /></tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="rounded-xl border border-gray-200 bg-surface p-4">
          <h2 className="text-sm font-semibold text-gray-900">Calls to come</h2>
          {s.upcomingCalls.length === 0 && <p className="mt-2 text-sm text-gray-500">No call is booked.</p>}
          <ul className="mt-2 divide-y divide-gray-100">
            {s.upcomingCalls.map((c) => (
              <li key={c.id}><Link href={`/crm/universities/${c.id}?tab=overview`} className="flex justify-between gap-3 py-2 text-sm hover:text-primary-700"><span className="text-gray-900 truncate">{c.name}</span><span className="text-gray-500 whitespace-nowrap">{dayWord(c.on)}</span></Link></li>
            ))}
          </ul>
          <h2 className="mt-5 text-sm font-semibold text-gray-900">Courses they chose to evaluate</h2>
          {s.coursesChosen.length === 0 && <p className="mt-2 text-sm text-gray-500">None chosen yet.</p>}
          <ul className="mt-2 space-y-1">
            {s.coursesChosen.map((c) => (<li key={c.id} className="flex justify-between gap-3 text-sm"><span className="text-gray-700 truncate">{c.title}</span><span className="tabular-nums font-medium text-gray-900">{c.count}</span></li>))}
          </ul>
        </section>
      </div>
      <EvaluationCodes />
    </div>
  )
}

function Cells({ g }: { g: { total: number; emailed: number; replied: number; evaluating: number; partner: number } }) {
  return (
    <>
      {[g.total, g.emailed, g.replied, g.evaluating, g.partner].map((n, i) => <td key={i} className="py-1.5 text-right tabular-nums text-gray-900">{n}</td>)}
    </>
  )
}

interface CodeRow { code: string; institution: string; uni: string; createdAt: string; expiresAt: string; active: boolean; learners: Array<{ email: string; course: string; since: string; done: number; total: number; percent: number }> }
interface CodeData { codes: CodeRow[]; totals: { issued: number; used: number; enrolments: number; started: number; completed: number } }

/** The evaluation codes: how many were given, used, and how far the people who used them have got. */
function EvaluationCodes() {
  const [d, setD] = useState<CodeData | null>(null)
  const [error, setError] = useState('')
  useEffect(() => { api<CodeData>('/api/admin/universities/coupons', { cache: 'no-store' }).then(setD).catch((e) => setError(e.message)) }, [])
  const tiles = d ? [['codes given', d.totals.issued], ['codes used', d.totals.used], ['course enrolments', d.totals.enrolments], ['started', d.totals.started], ['completed', d.totals.completed]] as const : []
  return (
    <section className="rounded-xl border border-gray-200 bg-surface p-4">
      <h2 className="text-sm font-semibold text-gray-900">Evaluation codes and learners</h2>
      <p className="text-xs text-gray-500">Two codes are made when a university submits the form, and sent with "Access is ready". Progress is read from the Learning Studio.</p>
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
      {!d && !error && <p className="mt-3 text-sm text-gray-500">Reading the codes…</p>}
      {d && (
        <>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-5 gap-2">
            {tiles.map(([label, n]) => <div key={label} className="rounded-lg border border-gray-200 px-3 py-2"><div className="text-xl font-bold text-gray-900 tabular-nums">{n}</div><div className="text-xs text-gray-500">{label}</div></div>)}
          </div>
          {d.codes.length === 0 ? <p className="mt-3 text-sm text-gray-600">No code has been made yet. The first comes with the first form answer.</p> : (
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-left text-xs text-gray-500 border-b border-gray-200"><th className="py-2 pr-3 font-medium">Code</th><th className="py-2 pr-3 font-medium">University</th><th className="py-2 pr-3 font-medium">Who used it</th><th className="py-2 font-medium">Progress</th></tr></thead>
                <tbody>
                  {d.codes.map((c) => (c.learners.length ? c.learners : [null]).map((l, i) => (
                    <tr key={`${c.code}-${i}`} className="border-b border-gray-100 last:border-0 align-top">
                      <td className="py-2 pr-3 font-mono text-xs text-gray-900">{i === 0 ? c.code : ''}</td>
                      <td className="py-2 pr-3 text-gray-900">{i === 0 ? (c.uni ? <Link href={`/crm/universities/${c.uni}`} className="hover:text-primary-700">{c.institution}</Link> : c.institution) : ''}</td>
                      <td className="py-2 pr-3 text-gray-700">{l ? <>{l.email}<span className="block text-xs text-gray-500">{l.course}</span></> : <span className="text-gray-500">Not used yet</span>}</td>
                      <td className="py-2 min-w-[140px]">{l && <><span className="block h-2 rounded bg-gray-100 overflow-hidden"><span className="block h-full bg-primary-500" style={{ width: `${l.percent}%` }} /></span><span className="text-xs text-gray-500">{l.done} of {l.total || '?'} lessons · {l.percent}%</span></>}</td>
                    </tr>
                  )))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </section>
  )
}