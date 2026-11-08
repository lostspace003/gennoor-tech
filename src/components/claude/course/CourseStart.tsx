'use client'

/** The first view of a course: what it is, the storyline, the journey map (one stop per chapter),
 *  the exam at a glance, and the one action that matters: start or continue. */
import { ArrowRight, Check, Map as MapIcon, GraduationCap } from 'lucide-react'
import type { ClaudeCert } from '@/data/claude-certifications'
import { chapterIcon } from './icons'
import RichHtml from './RichHtml'
import FlowVideo from './FlowVideo'
import type { ChapterMeta, FlowRef } from './types'

interface Props {
  cert: ClaudeCert
  chapters: ChapterMeta[]
  done: Record<string, boolean>
  lastSeen: string | null
  introHtml: string
  questionCount: number
  trailer?: FlowRef | null
  onGo: (id: string) => void
}

export default function CourseStart({ cert, chapters, done, lastSeen, introHtml, questionCount, trailer, onGo }: Props) {
  const stories = chapters.filter(c => c.kind === 'story')
  const prep = chapters.filter(c => c.kind === 'playbook' || c.kind === 'cheatsheet' || c.kind === 'exam')
  const exam = chapters.find(c => c.kind === 'exam')
  const first = stories[0]
  const resume = lastSeen && lastSeen !== chapters[0]?.id ? chapters.find(c => c.id === lastSeen) : null
  const doneCount = stories.filter(c => done[c.id]).length

  return (
    <div>
      <div className="cc-hero">
        <div>
          <span className="kicker" style={{ color: 'var(--cc-accent)' }}>{cert.code} · {cert.level}</span>
          <h1>{cert.name}</h1>
          <p className="lede">{cert.tagline}</p>
          <p className="who">{cert.whoItsFor}</p>
          <div className="acts">
            {resume ? (
              <button type="button" className="cc-btn pri" onClick={() => onGo(resume.id)}>Continue · {resume.title} <ArrowRight /></button>
            ) : (
              first && <button type="button" className="cc-btn pri" onClick={() => onGo(first.id)}>Start the story <ArrowRight /></button>
            )}
            {exam && <button type="button" className="cc-btn" onClick={() => onGo(exam.id)}><GraduationCap /> Practice exam · {questionCount} questions</button>}
          </div>
          <p className="free">The first chapters are free to read. One free sign-in (email code, no password) opens the rest, saves your progress and scores, and lets you join the discussion under every exam question.</p>
        </div>
        <div>
          {trailer && <FlowVideo flow={trailer} eager className="cc-flow-hero" />}
          <div className="cc-storycard">
          <span className="kick">The storyline</span>
          <b>{cert.storyline.protagonist}</b>
          <p>{cert.storyline.arc}</p>
          </div>
        </div>
      </div>

      <div className="cc-map">
        <h2><MapIcon size={16} style={{ color: 'var(--cc-accent)' }} /> The journey, chapter by chapter {doneCount > 0 && <span className="cc-pill" style={{ marginLeft: 4 }}>{doneCount}/{stories.length} done</span>}</h2>
        <ol>
          {stories.map(ch => {
            const Icon = chapterIcon(ch.icon, ch.kind)
            return (
              <li key={ch.id}>
                <button type="button" className={'cc-map-stop' + (done[ch.id] ? ' done' : '')} onClick={() => onGo(ch.id)}>
                  <span className="ic">{done[ch.id] ? <Check size={15} strokeWidth={3} /> : <Icon />}<span className="n">{ch.n}</span></span>
                  <span className="t"><b>{ch.title}</b><span>{ch.teaser}</span></span>
                </button>
              </li>
            )
          })}
        </ol>
        {prep.length > 0 && (
          <>
            <h2 style={{ marginTop: 16 }}><GraduationCap size={16} style={{ color: 'var(--cc-accent)' }} /> Then, exam prep</h2>
            <ol>
              {prep.map(ch => {
                const Icon = chapterIcon(ch.icon, ch.kind)
                return (
                  <li key={ch.id}>
                    <button type="button" className={'cc-map-stop' + (done[ch.id] ? ' done' : '')} onClick={() => onGo(ch.id)}>
                      <span className="ic"><Icon /></span>
                      <span className="t"><b>{ch.title}</b><span>{ch.teaser}</span></span>
                    </button>
                  </li>
                )
              })}
            </ol>
          </>
        )}
      </div>

      <div className="cc-facts">
        <div className="cc-fact"><small>Practice questions</small><b>{questionCount}</b></div>
        <div className="cc-fact"><small>Formats</small><b>{cert.examFacts.formats}</b></div>
        <div className="cc-fact"><small>What it tests</small><b>{cert.examFacts.passingStyle}</b></div>
        <div className="cc-fact"><small>Sitting time</small><b>{cert.examFacts.time}</b></div>
      </div>
      <div className="cc-domains">
        {cert.domains.map(d => (
          <div key={d.title} className="row">
            <span>{d.title}</span>
            <span className="w">{d.weight}</span>
            <span className="wb"><i style={{ width: d.weight }} /></span>
          </div>
        ))}
      </div>

      {introHtml && (
        <details className="cc-prose" style={{ marginTop: 18, border: '1px solid var(--cc-line)', borderRadius: 12 }}>
          <summary>More about this certification and the exam format</summary>
          <div><RichHtml html={introHtml} /></div>
        </details>
      )}
    </div>
  )
}
