'use client'

import { useState } from 'react'
import { Phone, Presentation, MessageCircleQuestion, ListChecks } from 'lucide-react'
import { CALL_STEPS, BRIDGES, OBJECTIONS, AFTER_THE_CALL, SLIDES, PRESENTATION_RULES } from '@/lib/crm/playbook'
import { useCrm } from './CrmContext'
import { shortName } from '@/lib/crm/users'

type Tab = 'call' | 'objections' | 'presentation'
const TABS: Array<[Tab, string, any]> = [
  ['call', 'The call', Phone],
  ['objections', 'When they push back', MessageCircleQuestion],
  ['presentation', 'The presentation', Presentation],
]

/** The call and presentation guide: the same pitch as the email series, in the order to say it. */
export default function PlaybookView() {
  const { userEmail } = useCrm()
  const [tab, setTab] = useState<Tab>('call')
  const me = shortName(userEmail).replace(/^\w/, (c) => c.toUpperCase()) || 'your name'
  // {me} is filled in; the other placeholders stay visible so nobody reads them out by mistake
  const fill = (s: string) => s.replace(/\{me\}/g, me)
  const mark = (s: string) => fill(s).split(/(\{[^}]+\})/g).map((part, i) =>
    /^\{.+\}$/.test(part) ? <mark key={i} className="bg-amber-100 text-amber-900 rounded px-1">{part.slice(1, -1)}</mark> : part
  )

  return (
    <div className="p-3 sm:p-5 max-w-4xl space-y-4">
      <div>
        <h2 className="text-base font-semibold text-gray-900">Call guide</h2>
        <p className="text-xs text-gray-500 mt-0.5">What to say, in order. It follows the email series, so the lead hears the same thing they read. Words in yellow are for you to fill in.</p>
      </div>

      <div className="flex gap-1 border-b border-gray-200 overflow-x-auto">
        {TABS.map(([id, label, Icon]) => (
          <button key={id} onClick={() => setTab(id)} className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px flex items-center gap-1.5 whitespace-nowrap ${tab === id ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {tab === 'call' && (
        <div className="space-y-3">
          {/* The whole call in one line, so the place in it is never lost; each step jumps to its card */}
          <nav aria-label="The steps of the call" className="sticky top-0 z-10 -mx-1 px-1 py-1.5 bg-gray-50 flex gap-1.5 overflow-x-auto">
            {CALL_STEPS.map((s, i) => (
              <a key={s.title} href={`#call-step-${i + 1}`} className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-raised px-2.5 py-1 text-xs text-gray-700 hover:border-gray-400">
                <span className="inline-flex w-4 h-4 rounded-full bg-gray-900 text-white text-[10px] items-center justify-center">{i + 1}</span>{s.title}<span className="text-gray-400">{s.time}</span>
              </a>
            ))}
          </nav>
          {CALL_STEPS.map((s, i) => (
            <section key={s.title} id={`call-step-${i + 1}`} className="scroll-mt-14 bg-raised border border-gray-200 rounded-xl p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-sm font-semibold text-gray-900"><span className="inline-flex w-5 h-5 mr-2 rounded-full bg-gray-900 text-white text-[11px] items-center justify-center align-middle">{i + 1}</span>{s.title}</h3>
                <span className="text-xs text-gray-400">{s.time}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Goal: {s.goal}</p>
              <ul className="mt-2.5 space-y-2">
                {s.say.map((line) => <li key={line} className="text-sm text-gray-800 leading-relaxed border-l-2 border-primary-200 pl-3">{mark(line)}</li>)}
              </ul>
              {s.ask && (
                <ul className="mt-2.5 space-y-1.5">
                  {s.ask.map((q) => <li key={q} className="text-sm text-gray-800 flex gap-2"><span className="text-primary-600 font-semibold shrink-0">Ask</span>{q}</li>)}
                </ul>
              )}
              {i === 2 && (
                <div className="mt-3 divide-y divide-gray-100 border border-gray-100 rounded-lg">
                  {BRIDGES.map((b) => (
                    <div key={b.when} className="px-3 py-2.5 grid sm:grid-cols-[200px_1fr] gap-x-3 gap-y-1">
                      <div className="text-xs font-semibold text-gray-600">{b.when}</div>
                      <div className="text-sm text-gray-800 leading-relaxed">{b.say}</div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}
          <section className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5"><ListChecks className="w-4 h-4 text-gray-500" /> Straight after the call</h3>
            <ul className="mt-2 space-y-1.5 list-disc pl-5 text-sm text-gray-700">{AFTER_THE_CALL.map((x) => <li key={x}>{x}</li>)}</ul>
          </section>
        </div>
      )}

      {tab === 'objections' && (
        <div className="bg-raised border border-gray-200 rounded-xl divide-y divide-gray-100">
          {OBJECTIONS.map((o) => (
            <div key={o.they} className="p-4 grid sm:grid-cols-[220px_1fr] gap-x-4 gap-y-1.5">
              <div className="text-sm font-semibold text-gray-900">“{o.they}”</div>
              <div className="text-sm text-gray-700 leading-relaxed">{o.you}</div>
            </div>
          ))}
        </div>
      )}

      {tab === 'presentation' && (
        <div className="space-y-3">
          <section className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-900">Five rules</h3>
            <ul className="mt-2 space-y-1.5 list-disc pl-5 text-sm text-gray-700">{PRESENTATION_RULES.map((x) => <li key={x}>{x}</li>)}</ul>
          </section>
          {SLIDES.map((s, i) => (
            <section key={s.title} className="bg-raised border border-gray-200 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-900"><span className="text-gray-400 font-normal mr-2">Slide {i + 1}</span>{s.title}</h3>
              <dl className="mt-2 grid sm:grid-cols-[70px_1fr] gap-x-3 gap-y-1.5 text-sm">
                <dt className="text-xs font-semibold text-gray-500 sm:pt-0.5">Show</dt><dd className="text-gray-800">{s.show}</dd>
                <dt className="text-xs font-semibold text-gray-500 sm:pt-0.5">Say</dt><dd className="text-gray-800">{s.say}</dd>
                {s.ask && <><dt className="text-xs font-semibold text-primary-600 sm:pt-0.5">Ask</dt><dd className="text-gray-800">{s.ask}</dd></>}
              </dl>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
