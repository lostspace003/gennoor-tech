'use client'

/**
 * The chapter's animated flow: a short looping MP4 rendered from the flow spec (see claude-thing/flows).
 * Plays while on screen, pauses off screen, honours reduced-motion (poster + play button).
 * View only: no download link, no native download / picture-in-picture, no right-click save.
 */
import { useEffect, useRef, useState } from 'react'
import { Pause, Play, RotateCcw } from 'lucide-react'
import { BLOB_URL } from '@/lib/site-config'
import type { FlowRef } from './types'

export function flowUrls(id: string) {
  const base = `${BLOB_URL}/cert-flows/${id}`
  return { mp4: base + '.mp4', poster: base + '.jpg' }
}

export default function FlowVideo({ flow, className, eager }: { flow: FlowRef; className?: string; eager?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [reduced, setReduced] = useState(false)
  const urls = flowUrls(flow.id)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const v = ref.current
    if (!v || mq.matches) return
    let io: IntersectionObserver | null = null
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting && e.intersectionRatio >= 0.35) v.play().catch(() => {})
          else v.pause()
        })
      }, { threshold: [0, 0.35] })
      io.observe(v)
    } else if (eager) v.play().catch(() => {})
    return () => io?.disconnect()
  }, [eager])

  const toggle = () => { const v = ref.current; if (!v) return; if (v.paused) v.play().catch(() => {}); else v.pause() }
  const replay = () => { const v = ref.current; if (!v) return; v.currentTime = 0; v.play().catch(() => {}) }

  return (
    <figure className={'cc-flow' + (className ? ' ' + className : '')} onContextMenu={e => e.preventDefault()}>
      <div className="cc-flow-frame">
        <video
          ref={ref}
          muted
          loop
          playsInline
          controlsList="nodownload noplaybackrate noremoteplayback"
          disablePictureInPicture
          disableRemotePlayback
          draggable={false}
          preload={eager ? 'auto' : 'metadata'}
          poster={urls.poster}
          aria-label={flow.title}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        >
          <source src={urls.mp4} type="video/mp4" />
        </video>
        {reduced && !playing && (
          <button type="button" className="cc-flow-big" onClick={toggle} aria-label="Play the flow"><Play /></button>
        )}
        <div className="cc-flow-ctl">
          <button type="button" onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}>{playing ? <Pause /> : <Play />}</button>
          <button type="button" onClick={replay} aria-label="Replay"><RotateCcw /></button>
        </div>
      </div>
      <figcaption>
        <span>Flow · {Math.round(flow.duration / 1000)}s · {flow.steps} steps</span>
      </figcaption>
    </figure>
  )
}
