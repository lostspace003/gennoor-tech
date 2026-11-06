'use client'

/**
 * The horizontal chapter lane: every chapter is one chip on a single scrollable line at the top,
 * grouped Story → Exam prep → After. The current chip is filled with the course accent, finished
 * chapters show a tick, chapters behind the sign-in gate show a lock.
 */
import { useEffect, useRef } from 'react'
import { Check, ChevronLeft, ChevronRight, Lock } from 'lucide-react'
import { chapterIcon } from './icons'
import type { ChapterMeta } from './types'

interface Props {
  chapters: ChapterMeta[]
  current: string
  done: Record<string, boolean>
  isLocked: (index: number) => boolean
  onSelect: (id: string) => void
}

function groupOf(kind: string): string {
  if (kind === 'intro' || kind === 'story') return 'Story'
  if (kind === 'playbook' || kind === 'cheatsheet' || kind === 'exam') return 'Exam prep'
  return 'After'
}

export default function ChapterLane({ chapters, current, done, isLocked, onSelect }: Props) {
  const scroller = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scroller.current?.querySelector<HTMLElement>('[data-on="1"]')
    if (el && scroller.current) {
      const box = scroller.current.getBoundingClientRect()
      const r = el.getBoundingClientRect()
      if (r.left < box.left + 40 || r.right > box.right - 40) {
        scroller.current.scrollTo({ left: el.offsetLeft - box.width / 2 + r.width / 2, behavior: 'smooth' })
      }
    }
  }, [current])

  const scrollBy = (dx: number) => scroller.current?.scrollBy({ left: dx, behavior: 'smooth' })

  let lastGroup = ''
  return (
    <nav className="cc-lane" aria-label="Chapters">
      <div className="cc-lane-inner">
        <button type="button" className="cc-lane-arrow" aria-label="Scroll chapters left" onClick={() => scrollBy(-360)}><ChevronLeft size={15} /></button>
        <div className="cc-lane-scroll" ref={scroller}>
          <ol className="cc-lane-list">
            {chapters.map((ch, i) => {
              const g = groupOf(ch.kind)
              const showGroup = g !== lastGroup
              lastGroup = g
              const on = ch.id === current
              const locked = isLocked(i)
              const isDone = !!done[ch.id]
              const Icon = chapterIcon(ch.icon, ch.kind)
              const useIcon = ch.kind === 'cheatsheet' || ch.kind === 'exam' || ch.kind === 'next' || ch.kind === 'refs' || ch.kind === 'intro'
              return (
                <li key={ch.id} style={{ display: 'contents' }}>
                  {showGroup && <span className="cc-lane-group" aria-hidden>{g}</span>}
                  <button
                    type="button"
                    className={['cc-chip', on ? 'on' : '', isDone ? 'done' : '', locked ? 'locked' : ''].filter(Boolean).join(' ')}
                    data-on={on ? '1' : undefined}
                    aria-current={on ? 'page' : undefined}
                    title={ch.title + (locked ? ' · sign in to open' : '')}
                    onClick={() => onSelect(ch.id)}
                  >
                    <span className="n" aria-hidden>
                      {isDone && !on ? <Check size={13} strokeWidth={3} /> : locked && !on ? <Lock size={11} /> : useIcon ? <Icon /> : ch.n}
                    </span>
                    {ch.short}
                  </button>
                </li>
              )
            })}
          </ol>
        </div>
        <button type="button" className="cc-lane-arrow" aria-label="Scroll chapters right" onClick={() => scrollBy(360)}><ChevronRight size={15} /></button>
      </div>
    </nav>
  )
}
