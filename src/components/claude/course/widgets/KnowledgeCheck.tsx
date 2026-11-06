'use client'

/** End-of-chapter knowledge check: answer first, then see the explanation. */
import { useState } from 'react'
import { Check, X, Eye, ListChecks } from 'lucide-react'
import type { KCItem } from '../types'

function correctLetters(a: string): number[] {
  // "B" | "B and D" | "A, C" → option indexes
  return Array.from(new Set((a.toUpperCase().match(/\b[A-H]\b/g) || []).map(l => l.charCodeAt(0) - 65)))
}

function Item({ item, index }: { item: KCItem; index: number }) {
  const [picked, setPicked] = useState<number[]>([])
  const [checked, setChecked] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const isMC = !!(item.o && item.o.length)
  const answer = isMC ? correctLetters(item.a) : []
  const multi = answer.length > 1
  const ok = isMC && checked && picked.length === answer.length && picked.every(p => answer.includes(p))

  return (
    <div className="cc-kc-item">
      <span className="cc-pill">{item.t}</span>
      <p className="q">{index + 1}. <span dangerouslySetInnerHTML={{ __html: item.q }} /></p>
      {isMC ? (
        <>
          <div className="opts">
            {item.o!.map((o, j) => {
              const sel = picked.includes(j)
              const cls = ['cc-kc-opt', sel && !checked ? 'sel' : '', checked && answer.includes(j) ? 'good' : '', checked && sel && !answer.includes(j) ? 'bad' : ''].filter(Boolean).join(' ')
              return (
                <button
                  key={j}
                  type="button"
                  className={cls}
                  disabled={checked}
                  onClick={() => setPicked(p => (multi ? (p.includes(j) ? p.filter(x => x !== j) : [...p, j]) : [j]))}
                >
                  <span className="l">{String.fromCharCode(65 + j)}</span>
                  <span dangerouslySetInnerHTML={{ __html: o }} />
                </button>
              )
            })}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            {!checked && (
              <button type="button" className="cc-btn sm pri" disabled={!picked.length} onClick={() => setChecked(true)}>
                <Check /> Check answer{multi ? ` (select ${answer.length})` : ''}
              </button>
            )}
            {checked && (
              <button type="button" className="cc-btn sm ghost" onClick={() => { setChecked(false); setPicked([]) }}>Try again</button>
            )}
          </div>
          {checked && (
            <div className={'cc-kc-ans ' + (ok ? 'ok' : 'no')}>
              <b style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>{ok ? <><Check size={15} /> Correct</> : <><X size={15} /> Not quite — the answer is {item.a}</>}</b>
              <div style={{ marginTop: 4 }} dangerouslySetInnerHTML={{ __html: item.e }} />
            </div>
          )}
        </>
      ) : (
        <>
          {!revealed ? (
            <button type="button" className="cc-btn sm" onClick={() => setRevealed(true)}><Eye /> Reveal answer</button>
          ) : (
            <div className="cc-kc-ans">
              <b dangerouslySetInnerHTML={{ __html: item.a }} />
              <div style={{ marginTop: 4 }} dangerouslySetInnerHTML={{ __html: item.e }} />
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default function KnowledgeCheck({ items }: { items: KCItem[] }) {
  if (!items || !items.length) return null
  return (
    <section className="cc-kc">
      <div className="cc-kc-head">
        <span className="cc-scene-ic" style={{ width: 30, height: 30, borderRadius: 9, background: 'var(--cc-tint)', color: 'var(--cc-blue)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><ListChecks size={16} /></span>
        <div>
          <h3>Knowledge check</h3>
          <p>Answer each one before you look. {items.length} questions.</p>
        </div>
      </div>
      {items.map((it, i) => <Item key={i} item={it} index={i} />)}
    </section>
  )
}
