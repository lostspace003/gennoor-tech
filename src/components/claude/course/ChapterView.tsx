'use client'

/**
 * One chapter: the story scene on top, the notebook body (with diagrams, code players and knowledge
 * checks mounted into the authored HTML), the takeaways, then "mark complete" and the next stop.
 */
import { useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowRight, ChevronLeft, Check, GraduationCap, Sparkles } from 'lucide-react'
import type { ClaudeCert } from '@/data/claude-certifications'
import { chapterIcon } from './icons'
import { upgradeContent } from './upgradeContent'
import StoryDiagram from './widgets/StoryDiagram'
import CodePlayer from './widgets/CodePlayer'
import KnowledgeCheck from './widgets/KnowledgeCheck'
import CheatSheet from './CheatSheet'
import CourseStart from './CourseStart'
import type { Chapter, ChapterMeta, CourseData } from './types'

interface Slot { el: HTMLElement; type: 'anim' | 'player' | 'kc'; id: string }

interface Props {
  cert: ClaudeCert
  data: CourseData
  chapter: Chapter
  prev: ChapterMeta | null
  next: ChapterMeta | null
  done: Record<string, boolean>
  lastSeen: string | null
  examAnswered: number
  onToggleDone: (id: string, v: boolean) => void
  onNavigate: (id: string) => void
  onStartExam: () => void
}

function kindLabel(k: string) {
  return k === 'story' ? 'Story' : k === 'playbook' ? 'Exam prep' : k === 'exam' ? 'Practice exam' : k === 'next' ? 'What next' : k === 'refs' ? 'References' : k === 'cheatsheet' ? 'Exam prep' : 'Start here'
}

export default function ChapterView({ cert, data, chapter, prev, next, done, lastSeen, examAnswered, onToggleDone, onNavigate, onStartExam }: Props) {
  const bodyRef = useRef<HTMLDivElement>(null)
  const [slots, setSlots] = useState<Slot[]>([])
  const Icon = chapterIcon(chapter.icon, chapter.kind)
  const isBody = chapter.kind !== 'intro' && chapter.kind !== 'cheatsheet'

  useLayoutEffect(() => {
    const el = bodyRef.current
    if (!el || !isBody) return
    setSlots([])
    el.innerHTML = chapter.html
    upgradeContent(el)
    const found: Slot[] = []
    el.querySelectorAll<HTMLElement>('[data-anim]').forEach(n => found.push({ el: n, type: 'anim', id: n.getAttribute('data-anim') || '' }))
    el.querySelectorAll<HTMLElement>('[data-player]').forEach(n => found.push({ el: n, type: 'player', id: n.getAttribute('data-player') || '' }))
    el.querySelectorAll<HTMLElement>('[data-kc]').forEach(n => found.push({ el: n, type: 'kc', id: n.getAttribute('data-kc') || '' }))
    setSlots(found)
  }, [chapter.id, chapter.html, isBody])

  const isDone = !!done[chapter.id]

  return (
    <article className="cc-body" key={chapter.id}>
      {chapter.kind === 'intro' ? (
        <CourseStart cert={cert} chapters={data.chapters} done={done} lastSeen={lastSeen} introHtml={chapter.html} questionCount={data.questions.length} onGo={onNavigate} />
      ) : (
        <header className="cc-scene">
          <span className="tile" aria-hidden><Icon /></span>
          <div>
            <span className="kick">{chapter.scene?.kicker || (chapter.n ? `Chapter ${chapter.n} · ${kindLabel(chapter.kind)}` : kindLabel(chapter.kind))}</span>
            <h1>{chapter.scene?.cut ? chapter.scene.title : chapter.title}</h1>
            {chapter.scene?.cut && chapter.scene.html && (
              <div className="story" dangerouslySetInnerHTML={{ __html: chapter.scene.html }} />
            )}
            {chapter.scene?.cut && chapter.scene.title !== chapter.title && (
              <div style={{ marginTop: 8, fontSize: 12.5, color: 'var(--cc-quiet)' }}>Chapter {chapter.n} · {chapter.title}</div>
            )}
          </div>
          {prev && prev.teaser && (prev.kind === 'story' || prev.kind === 'intro') && chapter.kind === 'story' && (
            <div className="prev"><b>Previously</b><span>{prev.teaser}</span></div>
          )}
        </header>
      )}

      {chapter.kind === 'cheatsheet' && data.cheat && (
        <div style={{ marginTop: 16 }}><CheatSheet data={data.cheat} /></div>
      )}

      {chapter.kind === 'exam' && (
        <div className="cc-exam-intro" style={{ marginTop: 16 }}>
          <div className="stats">
            <div className="stat"><small>Questions</small><b>{data.questions.length}</b></div>
            <div className="stat"><small>Timer</small><b>None — go at your pace</b></div>
            <div className="stat"><small>Answered so far</small><b>{examAnswered} / {data.questions.length}</b></div>
          </div>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--cc-soft)' }}>
            One question at a time. Check each answer as you go: you get the reasoning, the concept it tests, a link back to the chapter that teaches it, and a discussion thread where you can ask or help others.
          </p>
          <div>
            <button type="button" className="cc-btn pri" onClick={onStartExam}><GraduationCap /> {examAnswered ? 'Continue the practice exam' : 'Start the practice exam'} <ArrowRight /></button>
          </div>
        </div>
      )}

      {isBody && (
        <>
          <div ref={bodyRef} className="cc-prose" style={{ marginTop: 18 }} />
          {slots.map(s => createPortal(
            s.type === 'anim' ? (data.anims[s.id] ? <StoryDiagram spec={data.anims[s.id]} /> : null)
              : s.type === 'player' ? (data.ex[s.id] ? <CodePlayer name={s.id} example={data.ex[s.id]} annotation={data.ann[s.id]} outnotes={data.outnotes[s.id]} /> : null)
              : <KnowledgeCheck items={data.kc[s.id] || []} />,
            s.el,
            s.type + ':' + s.id,
          ))}
          {chapter.takeaways.length > 0 && (
            <aside className="cc-take">
              <div className="cn-k" style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase' }}><Sparkles size={14} style={{ color: 'var(--cc-accent)' }} /> Remember</div>
              <ul>{chapter.takeaways.map((t, i) => <li key={i}><Check size={16} strokeWidth={3} />{t}</li>)}</ul>
            </aside>
          )}
        </>
      )}

      <footer className="cc-pager">
        <div style={{ display: 'grid', gap: 8 }}>
          {!chapter.nocheck && (
            <div className={'cc-done' + (isDone ? ' on' : '')}>
              <input id={'done-' + chapter.id} type="checkbox" checked={isDone} onChange={e => onToggleDone(chapter.id, e.target.checked)} />
              <label htmlFor={'done-' + chapter.id}>{isDone ? 'Chapter complete' : 'Mark this chapter complete'}<small>{isDone ? 'Saved to your progress.' : 'Tracks your progress across the course.'}</small></label>
            </div>
          )}
          {prev && (
            <button type="button" className="cc-btn ghost sm" style={{ justifySelf: 'start' }} onClick={() => onNavigate(prev.id)}><ChevronLeft /> {prev.title}</button>
          )}
        </div>
        {next ? (
          <button type="button" className="cc-next" onClick={() => onNavigate(next.id)}>
            <span className="ic" aria-hidden>{(() => { const I = chapterIcon(next.icon, next.kind); return <I /> })()}</span>
            <span className="t">
              <small>Up next{next.n ? ` · chapter ${next.n}` : ''}</small>
              <b>{next.title}</b>
              {next.teaser && <span>{next.teaser}</span>}
            </span>
            <ArrowRight className="ar" size={18} />
          </button>
        ) : (
          <div />
        )}
      </footer>
    </article>
  )
}
