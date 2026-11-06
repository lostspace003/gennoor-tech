'use client'

/** The one-page exam reference: blueprint, "if you see X, choose Y" decision matrix, reference code. */
import { useMemo, useState } from 'react'
import { ArrowRight, Copy, Check } from 'lucide-react'
import { plainHighlight } from '@/lib/pyhl'
import type { CheatSheet as CheatSheetData } from './types'

type Tab = 'blueprint' | 'matrix' | 'code'

function CodeCard({ c }: { c: CheatSheetData['code'][number] }) {
  const [copied, setCopied] = useState(false)
  const html = useMemo(() => plainHighlight(c.code, c.lang), [c.code, c.lang])
  return (
    <div className="cc-code-card">
      <div className="h">
        <b>{c.title}</b>
        <p>{c.description}</p>
        <div>
          <span className="cc-pill">{c.tag}</span>
          {c.concepts.map(k => <span key={k} className="cc-pill acc">{k}</span>)}
        </div>
      </div>
      <div className="cc-prose" style={{ position: 'relative' }}>
        <pre style={{ paddingTop: 36 }}><code dangerouslySetInnerHTML={{ __html: html }} /></pre>
        <button
          type="button"
          className="cp"
          onClick={() => { navigator.clipboard?.writeText(c.code).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500) }) }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
        >
          {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
        </button>
      </div>
    </div>
  )
}

export default function CheatSheet({ data }: { data: CheatSheetData }) {
  const [tab, setTab] = useState<Tab>('blueprint')
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('ALL')
  const cats = useMemo(() => Array.from(new Set(data.matrix.map(m => m.category))).sort(), [data.matrix])
  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return data.matrix.filter(m => (cat === 'ALL' || m.category === cat) && (!needle || (m.trigger + ' ' + m.action + ' ' + m.category).toLowerCase().includes(needle)))
  }, [data.matrix, q, cat])

  return (
    <div>
      <div className="cc-tabs" role="tablist">
        {([['blueprint', 'Exam blueprint'], ['matrix', 'Decision matrix'], ['code', 'Code patterns']] as [Tab, string][]).map(([k, l]) => (
          <button key={k} type="button" role="tab" aria-selected={tab === k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>

      {tab === 'blueprint' && (
        <div>
          <p style={{ color: 'var(--cc-soft)', margin: '0 0 12px', fontSize: 14 }}>{data.summary}</p>
          <div className="cc-facts" style={{ marginTop: 0 }}>
            {data.stats.map(s => <div key={s.label} className="cc-fact"><small>{s.label}</small><b>{s.value}</b></div>)}
          </div>
          <div style={{ marginTop: 14 }}>
            {data.domains.map(d => (
              <div key={d.title} className="cc-dom">
                <div className="h">
                  <b>{d.title}</b>
                  <span className="w">{d.weight}</span>
                  <span className="wb"><i style={{ width: d.weight }} /></span>
                </div>
                <ul>{d.points.map((p, i) => <li key={i} dangerouslySetInnerHTML={{ __html: p }} />)}</ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'matrix' && (
        <div>
          <p style={{ color: 'var(--cc-soft)', margin: '0 0 10px', fontSize: 14 }}>When the question says the thing on the left, the answer is the thing on the right. {data.matrix.length} rules.</p>
          <div className="cc-mx-tools">
            <input type="search" placeholder="Search the matrix…" value={q} onChange={e => setQ(e.target.value)} aria-label="Search decision rules" />
            <select value={cat} onChange={e => setCat(e.target.value)} aria-label="Category">
              <option value="ALL">All categories</option>
              {cats.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="cc-mx">
            {rows.map((m, i) => (
              <div key={i} className="cc-mx-row">
                <div className="tr"><small>{m.category}</small><span dangerouslySetInnerHTML={{ __html: m.trigger }} /></div>
                <div className="ar"><ArrowRight size={16} /></div>
                <div className="ac" dangerouslySetInnerHTML={{ __html: m.action }} />
              </div>
            ))}
            {!rows.length && <div className="cc-disc-empty">No rule matches that search.</div>}
          </div>
        </div>
      )}

      {tab === 'code' && (
        <div>
          <p style={{ color: 'var(--cc-soft)', margin: '0 0 10px', fontSize: 14 }}>Reference implementations of the patterns the exam expects you to recognise.</p>
          {data.code.map((c, i) => <CodeCard key={i} c={c} />)}
        </div>
      )}
    </div>
  )
}
