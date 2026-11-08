'use client'

/**
 * The practice exam, one question at a time in a modal: arrows (and ← → keys) move between questions,
 * "Check answer" grades the question in place and shows why, with the concept tested and a link to the
 * chapter that teaches it, and a discussion thread sits under every question. No timer.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, X, Check, CircleCheck, CircleX, BookOpen, LayoutGrid, RotateCcw, Flag } from 'lucide-react'
import QuestionDiscussion from './QuestionDiscussion'
import { store } from './useLearner'
import type { Auth, ChapterMeta, Question } from './types'

export interface ExamState {
  i: number
  picks: Record<string, number[]>
  checked: Record<string, boolean>
  finished: boolean
}

interface Props {
  open: boolean
  courseKey: string
  questions: Question[]
  chapters: ChapterMeta[]
  auth: Auth
  onClose: () => void
  onSignIn: () => void
  onReview: (chapterId: string) => void
}

export function examStateKey(courseKey: string) { return courseKey + '.exam' }
export function emptyExam(): ExamState { return { i: 0, picks: {}, checked: {}, finished: false } }
export function loadExam(courseKey: string): ExamState {
  const s = store<ExamState>(examStateKey(courseKey))
  return s && typeof s === 'object' && s.picks ? { ...emptyExam(), ...s } : emptyExam()
}

export function isCorrect(q: Question, pick: number[] | undefined): boolean {
  if (!pick || !pick.length) return false
  const want = (Array.isArray(q.a) ? q.a : [q.a]).slice().sort((a, b) => a - b)
  const got = pick.slice().sort((a, b) => a - b)
  return want.length === got.length && want.every((v, i) => v === got[i])
}

export default function ExamPlayer({ open, courseKey, questions, chapters, auth, onClose, onSignIn, onReview }: Props) {
  const [st, setSt] = useState<ExamState>(() => loadExam(courseKey))
  const [grid, setGrid] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)
  const total = questions.length

  // persist
  useEffect(() => { store(examStateKey(courseKey), st) }, [st, courseKey])
  // reload when (re)opened
  useEffect(() => { if (open) setSt(loadExam(courseKey)) }, [open, courseKey])

  const q = questions[Math.min(st.i, total - 1)]
  const multi = Array.isArray(q?.a)
  const pick = q ? st.picks[q.id] || [] : []
  const checked = q ? !!st.checked[q.id] : false
  const correct = q ? isCorrect(q, pick) : false
  const reviewChapter = q?.ch ? chapters.find(c => c.id === q.ch) : null

  const go = useCallback((i: number) => {
    setSt(s => ({ ...s, i: Math.max(0, Math.min(total - 1, i)), finished: false }))
    setGrid(false)
    requestAnimationFrame(() => { bodyRef.current?.scrollTo({ top: 0 }) })
  }, [total])

  const toggle = (j: number) => {
    if (checked) return
    setSt(s => {
      const cur = s.picks[q.id] || []
      const next = multi ? (cur.includes(j) ? cur.filter(x => x !== j) : [...cur, j]) : [j]
      return { ...s, picks: { ...s.picks, [q.id]: next } }
    })
  }
  const check = () => { if (pick.length) setSt(s => ({ ...s, checked: { ...s.checked, [q.id]: true } })) }
  const finish = () => { setSt(s => ({ ...s, finished: true })); requestAnimationFrame(() => bodyRef.current?.scrollTo({ top: 0 })) }
  const retake = () => { setSt(emptyExam()); setGrid(false) }

  // keyboard
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'TEXTAREA' || tag === 'INPUT') return
      if (e.key === 'Escape') onClose()
      if (st.finished) return
      if (e.key === 'ArrowRight') go(st.i + 1)
      if (e.key === 'ArrowLeft') go(st.i - 1)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, st.i, st.finished, go, onClose])

  // lock page scroll while open
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])

  const results = useMemo(() => {
    const byTopic: Record<string, { n: number; ok: number }> = {}
    let ok = 0, answered = 0
    const wrong: Question[] = []
    questions.forEach(x => {
      const b = byTopic[x.t] || (byTopic[x.t] = { n: 0, ok: 0 })
      b.n++
      if (st.checked[x.id]) {
        answered++
        if (isCorrect(x, st.picks[x.id])) { ok++; b.ok++ } else wrong.push(x)
      } else wrong.push(x)
    })
    return { ok, answered, wrong, byTopic }
  }, [questions, st.checked, st.picks])

  if (!open || !q) return null
  const answeredCount = Object.keys(st.checked).length

  return (
    <div className="cc-exam-bd" role="dialog" aria-modal="true" aria-label="Practice exam" onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="cc-exam">
        <div className="cc-exam-h">
          <span className="t">
            {st.finished ? <b>Your results</b> : <><b>Question {st.i + 1}</b> of {total}</>}
            <span style={{ marginLeft: 10 }}>{answeredCount} answered</span>
          </span>
          {!st.finished && <span className="cc-pill acc" title="Concept this question tests">{q.k}</span>}
          <button type="button" className="x" aria-label="Close the exam (your progress is saved)" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="cc-exam-prog"><i style={{ width: `${(100 * answeredCount) / total}%` }} /></div>

        <div className="cc-exam-b" ref={bodyRef}>
          {st.finished ? (
            <div className="cc-exam-res">
              <div className="cc-exam-score">
                <div className="big">{results.answered ? Math.round((100 * results.ok) / results.answered) : 0}<small>%</small></div>
                <div>
                  <b>{results.ok} of {results.answered} answered correctly</b>
                  <p>{total - results.answered > 0 ? `${total - results.answered} question${total - results.answered === 1 ? '' : 's'} not attempted. ` : ''}Review the concepts you missed below, then retake whenever you like.</p>
                </div>
              </div>
              <div>
                <div className="cn-k" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--cc-quiet)', marginBottom: 8 }}>By topic</div>
                <div className="cc-exam-bytopic">
                  {Object.keys(results.byTopic).sort().map(t => {
                    const b = results.byTopic[t]
                    const pct = Math.round((100 * b.ok) / b.n)
                    return (
                      <div key={t} className="row">
                        <div><div>{t} <span style={{ color: 'var(--cc-quiet)', fontSize: 12 }}>{b.ok}/{b.n}</span></div><div className="bar"><i style={{ width: pct + '%' }} /></div></div>
                        <div className="pct">{pct}%</div>
                      </div>
                    )
                  })}
                </div>
              </div>
              {results.wrong.length > 0 && (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--cc-quiet)', marginBottom: 8 }}>To review ({results.wrong.length})</div>
                  <div className="cc-exam-wrong">
                    {results.wrong.map(x => (
                      <button key={x.id} type="button" onClick={() => go(x.n - 1)}>
                        <span className="k">{x.k}</span>
                        <span className="s">{x.q}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="cc-exam-meta">
                <span className="cc-pill">{q.t}</span>
                <span className="cc-pill">{q.d}</span>
                <span className="cc-pill">{q.c}</span>
                {multi && <span className="cc-pill warn">Select {(q.a as number[]).length}</span>}
              </div>
              <p className="cc-exam-q" dangerouslySetInnerHTML={{ __html: q.q }} />
              <div className="cc-exam-opts">
                {q.o.map((o, j) => {
                  const sel = pick.includes(j)
                  const isAns = (Array.isArray(q.a) ? q.a : [q.a]).includes(j)
                  const cls = ['cc-exam-opt', multi ? 'multi' : '', sel && !checked ? 'sel' : '', checked && isAns ? 'good' : '', checked && sel && !isAns ? 'bad' : ''].filter(Boolean).join(' ')
                  return (
                    <button key={j} type="button" className={cls} disabled={checked} onClick={() => toggle(j)} aria-pressed={sel}>
                      <span className="l">{String.fromCharCode(65 + j)}</span>
                      <span dangerouslySetInnerHTML={{ __html: o }} />
                    </button>
                  )
                })}
              </div>

              {!checked ? (
                <div style={{ marginTop: 14, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                  <button type="button" className="cc-btn pri" disabled={!pick.length} onClick={check}><Check /> Check answer</button>
                  <span style={{ fontSize: 12.5, color: 'var(--cc-quiet)' }}>{multi ? 'Pick all that apply, then check.' : 'Pick one, then check. Use ← → to move between questions.'}</span>
                </div>
              ) : (
                <div className="cc-exam-fb">
                  <div className={'vt ' + (correct ? 'ok' : 'no')}>
                    {correct ? <><CircleCheck /> Correct</> : <><CircleX /> Not quite — the correct answer is {(Array.isArray(q.a) ? q.a : [q.a]).map(i => String.fromCharCode(65 + i)).join(' and ')}</>}
                  </div>
                  <div className="body">
                    <div><b>Why</b><div className="cc-fb-text" dangerouslySetInnerHTML={{ __html: q.w }} /></div>
                    {q.x && <div><b>Why not the others</b><div className="cc-fb-text" dangerouslySetInnerHTML={{ __html: q.x }} /></div>}
                    <div>
                      <b>Concept tested</b>
                      <p style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
                        <span className="cc-pill acc">{q.k}</span>
                        {reviewChapter && (
                          <button type="button" className="rev" onClick={() => onReview(reviewChapter.id)}>
                            <BookOpen size={14} /> Review in “{reviewChapter.title}”
                          </button>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <QuestionDiscussion topic={q.id} auth={auth} onSignIn={onSignIn} />
            </>
          )}
        </div>

        {grid && !st.finished && (
          <div className="cc-exam-grid" role="navigation" aria-label="Jump to a question">
            {questions.map((x, i) => {
              const c = st.checked[x.id] ? (isCorrect(x, st.picks[x.id]) ? 'ok' : 'no') : st.picks[x.id]?.length ? 'ans' : ''
              return <button key={x.id} type="button" className={[c, i === st.i ? 'cur' : ''].filter(Boolean).join(' ')} onClick={() => go(i)} title={x.k}>{i + 1}</button>
            })}
          </div>
        )}

        <div className="cc-exam-f">
          {st.finished ? (
            <>
              <button type="button" className="cc-btn" onClick={retake}><RotateCcw /> Retake</button>
              <div className="mid" />
              <button type="button" className="cc-btn" onClick={() => go(0)}>Review the questions</button>
              <button type="button" className="cc-btn pri" onClick={onClose}>Back to the course</button>
            </>
          ) : (
            <>
              <button type="button" className="cc-btn" disabled={st.i === 0} onClick={() => go(st.i - 1)}><ChevronLeft /> Previous</button>
              <div className="mid">
                <button type="button" className="cc-btn ghost sm" onClick={() => setGrid(g => !g)} aria-expanded={grid}><LayoutGrid /> {st.i + 1} / {total}</button>
              </div>
              {st.i < total - 1 ? (
                <button type="button" className="cc-btn pri" onClick={() => go(st.i + 1)}>Next <ChevronRight /></button>
              ) : (
                <button type="button" className="cc-btn pri" onClick={finish}><Flag /> Finish exam</button>
              )}
              {answeredCount > 0 && st.i < total - 1 && (
                <button type="button" className="cc-btn ghost sm" onClick={finish} title="See your score so far">Finish</button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
