'use client'

/**
 * "Start / Continue" button for a certification course.
 * Progress lives in two places: the guide's own localStorage (always), and the
 * learner progress API when the visitor is signed in. We show whichever is richer,
 * so a learner can resume exactly where they left off — signed in or not.
 */
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Props {
  guideKey: string
  guideUrl: string
  className?: string
}

interface Resume {
  percent: number
  lastChapter: string | null
}

function readLocal(guideKey: string): Resume | null {
  try {
    const done = JSON.parse(localStorage.getItem(`${guideKey}.done`) || '{}')
    const seen = JSON.parse(localStorage.getItem(`${guideKey}.seen`) || '{}')
    const seenIds = Object.keys(seen)
    if (!seenIds.length && !Object.keys(done).length) return null
    // Most recently seen chapter wins as the resume point.
    let last: string | null = null
    let ts = 0
    for (const id of seenIds) {
      if (seen[id] >= ts) { ts = seen[id]; last = id }
    }
    return { percent: -1, lastChapter: last }
  } catch {
    return null
  }
}

export default function CertResume({ guideKey, guideUrl, className }: Props) {
  const [resume, setResume] = useState<Resume | null>(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const local = readLocal(guideKey)
    if (local) setResume(local)
    setChecked(true)
    // Signed-in progress (richer: has completion percent) overrides local.
    fetch(`/api/learner/progress?courseId=claude-cert-${guideKey}`)
      .then(r => (r.ok ? r.json() : null))
      .then(j => {
        if (!j?.chapters) return
        const ids = Object.keys(j.chapters)
        if (!ids.length) return
        let last: string | null = null
        let ts = 0
        let pct = 0
        for (const id of ids) {
          const e = j.chapters[id]
          const t = Date.parse(e.timestamp || e.Timestamp || '') || 0
          if (t >= ts) { ts = t; last = id }
          pct = Math.max(pct, e.completionPercent || 0)
        }
        setResume({ percent: pct, lastChapter: last })
      })
      .catch(() => {})
  }, [guideKey])

  const started = checked && resume !== null
  const href = started && resume?.lastChapter ? `${guideUrl}#${resume.lastChapter}` : guideUrl

  return (
    <Link href={href} className={className ?? 'pill-primary'} prefetch={false}>
      {started
        ? `Continue the course${resume && resume.percent > 0 ? ` · ${resume.percent}%` : ''} ›`
        : 'Start the course ›'}
    </Link>
  )
}
