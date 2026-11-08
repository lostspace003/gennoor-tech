'use client'

/**
 * The chapter's animated flow, played like a short video: an MP4 rendered from the flow spec (see claude-thing/flows).
 * Plays while on screen, pauses off screen, honours reduced-motion (poster + play button).
 * Back / forward move by section (one step of the flow), not by seconds. Narrated flows carry a voice-over track that
 * starts muted; the voice button turns it on and replays the current section from its start. Full screen on request.
 * View only: no download link, no native download / picture-in-picture, no right-click save.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import { Maximize, Minimize, Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react'
import { BLOB_URL } from '@/lib/site-config'
import type { FlowRef } from './types'

export function flowUrls(id: string, v?: string | null) {
  const base = `${BLOB_URL}/cert-flows/${id}`
  const q = v ? `?v=${v}` : ''
  return { mp4: base + '.mp4' + q, poster: base + '.jpg' + q }
}

type FsDoc = Document & { webkitFullscreenElement?: Element | null; webkitExitFullscreen?: () => void }
type FsEl = HTMLElement & { webkitRequestFullscreen?: () => void }
type IosVideo = HTMLVideoElement & { webkitEnterFullscreen?: () => void }

export default function FlowVideo({ flow, className, eager }: { flow: FlowRef; className?: string; eager?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null)
  const box = useRef<HTMLElement>(null)
  const [playing, setPlaying] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [voice, setVoice] = useState(false)
  const [full, setFull] = useState(false)
  const [cur, setCur] = useState(0)
  const urls = flowUrls(flow.id, flow.v)
  const sections = flow.sections && flow.sections.length ? flow.sections : null
  const total = sections ? sections.length : flow.steps

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

  useEffect(() => {
    const on = () => { const d = document as FsDoc; setFull((d.fullscreenElement || d.webkitFullscreenElement) === box.current) }
    document.addEventListener('fullscreenchange', on)
    document.addEventListener('webkitfullscreenchange', on)
    return () => { document.removeEventListener('fullscreenchange', on); document.removeEventListener('webkitfullscreenchange', on) }
  }, [])

  const sectionAt = useCallback((ms: number) => {
    if (!sections) return 0
    let i = 0
    while (i + 1 < sections.length && sections[i + 1] <= ms + 30) i++
    return i
  }, [sections])

  const seekSection = (i: number) => {
    const v = ref.current; if (!v || !sections) return
    const k = Math.max(0, Math.min(sections.length - 1, i))
    v.currentTime = sections[k] / 1000
    setCur(k)
    v.play().catch(() => {})
  }
  const back = () => {
    const v = ref.current; if (!v || !sections) return
    const ms = v.currentTime * 1000, i = sectionAt(ms)
    seekSection(ms - sections[i] > 1500 ? i : i - 1)
  }
  const forward = () => {
    const v = ref.current; if (!v || !sections) return
    const i = sectionAt(v.currentTime * 1000)
    if (i + 1 < sections.length) seekSection(i + 1)
  }
  const toggle = () => { const v = ref.current; if (!v) return; if (v.paused) v.play().catch(() => {}); else v.pause() }
  const toggleVoice = () => {
    const v = ref.current; if (!v) return
    const on = !voice
    v.muted = !on
    setVoice(on)
    // hearing the voice from mid-sentence is confusing: restart the section it is in
    if (on && sections) seekSection(sectionAt(v.currentTime * 1000))
    else if (on) v.play().catch(() => {})
  }
  const toggleFull = () => {
    const d = document as FsDoc, el = box.current as FsEl | null
    if (!el) return
    if (d.fullscreenElement || d.webkitFullscreenElement) { (d.exitFullscreen ? d.exitFullscreen() : d.webkitExitFullscreen?.()); return }
    if (el.requestFullscreen) el.requestFullscreen().catch(() => {})
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen()
    else (ref.current as IosVideo | null)?.webkitEnterFullscreen?.()
  }
  const onKey = (e: React.KeyboardEvent) => {
    const k = e.key
    if (k === 'ArrowLeft') back()
    else if (k === 'ArrowRight') forward()
    else if (k === ' ' || k === 'k') toggle()
    else if (k === 'm' && flow.narrated) toggleVoice()
    else if (k === 'f') toggleFull()
    else return
    e.preventDefault(); e.stopPropagation()
  }

  return (
    <figure
      ref={box}
      className={'cc-flow' + (full ? ' is-full' : '') + (className ? ' ' + className : '')}
      onContextMenu={e => e.preventDefault()}
      onKeyDown={onKey}
    >
      <div className="cc-flow-frame">
        <video
          ref={ref}
          muted
          loop={!voice}
          playsInline
          controlsList="nodownload noplaybackrate noremoteplayback"
          disablePictureInPicture
          disableRemotePlayback
          draggable={false}
          preload={eager ? 'auto' : 'metadata'}
          poster={urls.poster}
          aria-label={flow.title}
          onClick={toggle}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onTimeUpdate={e => { const i = sectionAt(e.currentTarget.currentTime * 1000); if (i !== cur) setCur(i) }}
          onEnded={() => setCur(0)}
        >
          <source src={urls.mp4} type="video/mp4" />
        </video>
        {reduced && !playing && (
          <button type="button" className="cc-flow-big" onClick={toggle} aria-label="Play the flow"><Play /></button>
        )}
      </div>
      <figcaption className="cc-flow-bar">
        <div className="cc-flow-ctl">
          {sections && <button type="button" onClick={back} aria-label="Previous section" title="Previous section (←)"><SkipBack /></button>}
          <button type="button" className="main" onClick={toggle} aria-label={playing ? 'Pause' : 'Play'} title={playing ? 'Pause' : 'Play'}>{playing ? <Pause /> : <Play />}</button>
          {sections && <button type="button" onClick={forward} aria-label="Next section" title="Next section (→)"><SkipForward /></button>}
          <span className="cc-flow-pos">{sections ? `Section ${cur + 1} of ${total}` : `Flow · ${Math.round(flow.duration / 1000)}s · ${total} steps`}</span>
        </div>
        <div className="cc-flow-ctl">
          {flow.narrated && (
            <button type="button" className={'voice' + (voice ? ' on' : '')} onClick={toggleVoice} aria-pressed={voice} aria-label={voice ? 'Turn the voice-over off' : 'Turn the voice-over on'} title={voice ? 'Voice-over on (M)' : 'Voice-over off (M)'}>
              {voice ? <Volume2 /> : <VolumeX />}<span>Voice</span>
            </button>
          )}
          <button type="button" onClick={toggleFull} aria-label={full ? 'Exit full screen' : 'Full screen'} title={full ? 'Exit full screen (F)' : 'Full screen (F)'}>{full ? <Minimize /> : <Maximize />}</button>
        </div>
      </figcaption>
    </figure>
  )
}
