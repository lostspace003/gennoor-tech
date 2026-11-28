'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import CourseChat from './CourseChat'
import ReviewPrompt from './ReviewPrompt'
import { useRouter } from 'next/navigation'
import {
  Award, CheckCircle2, ChevronDown, ChevronRight, Download, FileText, Info, ListVideo, Loader2, Maximize, Maximize2, Minimize, Minimize2,
  Pause, Play, RotateCcw, RotateCw, Subtitles, X, ZoomIn, ZoomOut,
} from 'lucide-react'
import type { LmsCourse, LmsItem, LmsProgressEntry } from '@/lib/lms'
import { KIND_COLOR, kindOf } from '@/lib/lms-kind'
import { CourseStrip, longestLesson } from './CourseStrip'
import { useBoostedVolume } from '@/hooks/useBoostedVolume'
import VolumeControl from '@/components/media/VolumeControl'
import { RichInline, RichText, paragraphize } from './RichText'

type Lecture = Extract<LmsItem, { type: 'lecture' }>
interface VideoCtl { pause: () => boolean; resume: () => void }

const SAVE_EVERY_MS = 15_000
const SPEEDS = [0.75, 1, 1.25, 1.5, 1.75, 2]

export function fmt(sec: number): string {
  if (!isFinite(sec) || sec < 0) sec = 0
  const s = Math.floor(sec)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const r = s % 60
  return h ? `${h}:${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}` : `${m}:${String(r).padStart(2, '0')}`
}

function fmtTotal(sec: number): string {
  const h = Math.floor(sec / 3600)
  const m = Math.round((sec % 3600) / 60)
  return h ? `${h}h ${m}m` : `${m}m`
}

export default function LmsPlayer({
  course,
  learnerEmail,
  initialItem,
  initialProgress,
  resumeSaved = false,
  congratsUrl,
}: {
  course: LmsCourse
  learnerEmail: string
  initialItem: string
  initialProgress: Record<string, LmsProgressEntry>
  /** Open the first lesson at the spot the learner stopped (the Resume button). Every other way in starts at 0:00. */
  resumeSaved?: boolean
  congratsUrl?: string | null
}) {
  const router = useRouter()
  const items = useMemo(() => course.sections.flatMap(s => s.items), [course])
  const [itemId, setItemId] = useState(initialItem)
  const [progress, setProgress] = useState(initialProgress)
  const [open, setOpen] = useState<Record<number, boolean>>(() => {
    const si = course.sections.findIndex(s => s.items.some(i => i.id === initialItem))
    return { [Math.max(si, 0)]: true }
  })
  const [tab, setTab] = useState<'details' | 'content'>('details')
  const [pdf, setPdf] = useState<{ name: string; url: string } | null>(null)
  const [docBusy, setDocBusy] = useState('')
  const [pdfMax, setPdfMax] = useState(false)
  const [showCongrats, setShowCongrats] = useState(false)
  const [sideW, setSideW] = useState(425)
  // Lessons open paused. Once the learner has pressed play in this visit, the next lesson they pick plays by itself.
  const [played, setPlayed] = useState(false)
  const [resumeId, setResumeId] = useState<string | null>(resumeSaved ? initialItem : null)
  const [infoOpen, setInfoOpen] = useState(true)
  const ctl = useRef<VideoCtl | null>(null)
  const resumeAfterMax = useRef(false)
  const item = items.find(i => i.id === itemId) ?? items[0]
  const idx = items.findIndex(i => i.id === item.id)
  const next = items[idx + 1]
  const listRef = useRef<HTMLDivElement>(null)

  const select = useCallback(
    (id: string) => {
      setItemId(id)
      setResumeId(null)
      setPdf(null)
      setPdfMax(false)
      resumeAfterMax.current = false
      const si = course.sections.findIndex(s => s.items.some(i => i.id === id))
      setOpen(o => (o[si] ? o : { ...o, [si]: true }))
      // Keep the URL in step without a navigation, so a refresh or a new device lands here too.
      window.history.replaceState(null, '', `/studio/${course.slug}/learn?item=${id}`)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [course],
  )

  // router is only needed for sign-out redirects from the player
  void router

  const mark = useCallback(
    (id: string, patch: Partial<LmsProgressEntry>) => {
      setProgress(p => ({ ...p, [id]: { ...(p[id] ?? { done: false, positionSec: 0, updatedAt: '' }), ...patch, updatedAt: new Date().toISOString() } }))
      fetch('/api/lms/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: course.slug, item: id, ...patch }),
        keepalive: true,
      }).catch(() => {})
    },
    [course.slug],
  )

  // Bring the lesson you are on into view in the course list, smoothly.
  useEffect(() => {
    if (tab !== 'content') return
    const el = listRef.current?.querySelector(`[data-item="${item.id}"]`)
    el?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [tab, item.id])

  const openDoc = async (name: string) => {
    setDocBusy(name)
    try {
      const r = await fetch(`/api/lms/resource?slug=${course.slug}&item=${item.id}&name=${encodeURIComponent(name)}`, { cache: 'no-store' })
      if (!r.ok) return
      const d = await r.json()
      if (d.download) window.location.href = d.url
      else { setPdf({ name, url: d.url }); setPdfMax(false); setTab('details') }
    } finally {
      setDocBusy('')
    }
  }

  // The one zip with every file of the course, attached to a lecture as "<CODE> - Complete course files.zip".
  const bundle = (() => {
    for (const sec of course.sections) for (const it of sec.items) {
      if (it.type !== 'lecture') continue
      const r = it.resources.find(x => /(complete course files|all course materials)\.zip$/i.test(x.name))
      if (r) return { itemId: it.id, name: r.name }
    }
    return null
  })()
  const downloadBundle = async () => {
    if (!bundle) return
    setDocBusy(bundle.name)
    try {
      const r = await fetch(`/api/lms/resource?slug=${course.slug}&item=${bundle.itemId}&name=${encodeURIComponent(bundle.name)}`, { cache: 'no-store' })
      if (!r.ok) return
      window.location.href = (await r.json()).url
    } finally {
      setDocBusy('')
    }
  }

  const downloadDoc = async (name: string) => {
    const r = await fetch(`/api/lms/resource?slug=${course.slug}&item=${item.id}&name=${encodeURIComponent(name)}&download=1`, { cache: 'no-store' })
    if (!r.ok) return
    const a = document.createElement('a')
    a.href = (await r.json()).url
    a.download = name
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  // Full-screen reading pauses the video; coming back (minimise or close) resumes it.
  const maximizePdf = () => {
    resumeAfterMax.current = ctl.current?.pause() ?? false
    setPdfMax(true)
  }
  const resumeIfPaused = () => {
    if (resumeAfterMax.current) ctl.current?.resume()
    resumeAfterMax.current = false
  }
  const minimizePdf = () => { setPdfMax(false); resumeIfPaused() }
  const closePdf = () => { setPdf(null); setPdfMax(false); resumeIfPaused() }

  // Drag the left edge of the side panel to make it wider or narrower.
  useEffect(() => {
    try { const w = Number(localStorage.getItem('gnr-side-w')); if (w >= 320) setSideW(w); if (localStorage.getItem('gnr-info-open') === '0') setInfoOpen(false) } catch { /* private mode */ }
  }, [])
  const toggleInfo = (v: boolean) => { setInfoOpen(v); try { localStorage.setItem('gnr-info-open', v ? '1' : '0') } catch { /* ignore */ } }
  const startResize = (e: React.PointerEvent) => {
    e.preventDefault()
    const startX = e.clientX
    const startW = sideW
    const move = (ev: PointerEvent) => setSideW(Math.max(320, Math.min(startW + (startX - ev.clientX), Math.min(960, window.innerWidth - 460))))
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      document.body.style.userSelect = ''
      setSideW(w => { try { localStorage.setItem('gnr-side-w', String(w)) } catch { /* ignore */ } return w })
    }
    document.body.style.userSelect = 'none'
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  const doneMap = useMemo(() => Object.fromEntries(items.map(i => [i.id, !!progress[i.id]?.done])), [items, progress])
  const doneCount = items.filter(i => doneMap[i.id]).length
  const allDone = doneCount === items.length

  // Finishing the last lesson opens the congratulations video, once per course per browser session.
  useEffect(() => {
    if (!allDone || !congratsUrl) return
    try {
      const key = `gnr-congrats-${course.slug}`
      if (sessionStorage.getItem(key)) return
      sessionStorage.setItem(key, '1')
    } catch { /* private mode: show it anyway */ }
    ctl.current?.pause()
    setShowCongrats(true)
  }, [allDone, congratsUrl, course.slug])
  const pct = Math.round((doneCount / items.length) * 100)
  const totalSec = items.reduce((a, i) => a + (i.type === 'lecture' ? i.durationSec || 0 : 0), 0)
  const resources = item.type === 'lecture' ? item.resources.filter(r => /\.pdf$/i.test(r.name) || /(lab files|student files)\.zip$/i.test(r.name)) : []

  return (
    <div className="bg-gray-100 min-h-screen">
      <ReviewPrompt course={course} progress={progress} />
      <style>{`
        @keyframes lms-fade { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: none } }
        .lms-fade { animation: lms-fade .28s cubic-bezier(.2,.7,.2,1) both }
        .lms-sec { content-visibility: auto; contain-intrinsic-size: auto 96px }
        @media (prefers-reduced-motion: reduce) { .lms-fade { animation: none } }
      `}</style>
      <div className="bg-[#0f1824] text-white px-4 sm:px-6 py-3 flex items-center gap-3 text-sm">
        <Link href={`/studio/${course.slug}`} className="inline-flex items-center gap-1 text-[#c3cddc] hover:text-white shrink-0 transition-colors" aria-label={`Back to ${course.code}`}>
          <span aria-hidden>‹</span> Back
        </Link>
        <span className="text-[#4b5a70]">/</span>
        <span className="text-[#8d9bb0] shrink-0">{course.code}</span>
        <span className="text-[#4b5a70]">/</span>
        <span className="truncate font-medium">{item.title}</span>
        <FullScreenInfo />
        <Link href={`/studio/${course.slug}/discussion`} className="ml-auto text-[13px] text-[#c3cddc] hover:text-white shrink-0 transition-colors">Discussion</Link>
        <span className="text-[12px] text-[#8d9bb0] tabular-nums shrink-0 hidden sm:block">{pct}% complete</span>
      </div>

      <div className="lg:pl-[var(--chat-w,0px)] transition-[padding] duration-200">
      <div className="max-w-[1880px] mx-auto flex flex-col lg:flex-row gap-6 p-4 sm:p-6">
        <div className="flex-1 min-w-0">
          {item.type === 'lecture' ? (
            <LecturePane
              key={item.id}
              slug={course.slug}
              lecture={item}
              email={learnerEmail}
              savedPosition={item.id === resumeId ? progress[item.id]?.positionSec ?? 0 : 0}
              autoStart={played}
              onPlayed={() => setPlayed(true)}
              done={!!progress[item.id]?.done}
              onPosition={s => mark(item.id, { positionSec: s })}
              onDone={() => mark(item.id, { done: true })}
              hasNext={!!next}
              onNext={() => next && select(next.id)}
              ctlRef={ctl}
            />
          ) : (
            <QuizPane
              key={item.id}
              slug={course.slug}
              quizId={item.id}
              title={item.title}
              onResult={(score, passed) => setProgress(p => ({ ...p, [item.id]: { ...(p[item.id] ?? { positionSec: 0, updatedAt: '' }), done: passed, score, passed } }))}
              next={next}
              onNext={() => next && select(next.id)}
            />
          )}
          <CourseChat slug={course.slug} itemId={item.id} courseTitle={course.title} />
        </div>

        {infoOpen && <aside style={{ ['--sw' as string]: `${sideW}px` }} className="relative lg:w-[var(--sw)] lg:shrink-0 bg-raised rounded-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[80vh] lg:max-h-none lg:h-[calc(100vh-8.5rem)] lg:sticky lg:top-[5.5rem]">
          <div
            onPointerDown={startResize}
            title="Drag to resize"
            className="hidden lg:block absolute left-0 top-0 bottom-0 w-1.5 z-10 cursor-col-resize hover:bg-primary-400/40 active:bg-primary-500/50 transition-colors"
          />
          <button type="button" onClick={() => toggleInfo(false)} aria-label="Hide lecture details" title="Hide this panel" className="flex absolute top-2.5 right-2.5 z-10 w-8 h-8 lg:w-7 lg:h-7 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100">
            <X className="w-4 h-4" />
          </button>
          <div className="flex border-b border-gray-200 text-[14px] font-semibold shrink-0 pr-11" role="tablist">
            {([['details', 'Lecture details'], ['content', 'Course content']] as const).map(([k, label]) => (
              <button
                key={k}
                role="tab"
                aria-selected={tab === k}
                type="button"
                onClick={() => { if (pdf) closePdf(); setTab(k) }}
                className={`flex-1 py-3.5 transition-colors duration-200 ${tab === k ? 'text-primary-600 shadow-[inset_0_-2px_0_#0071e3]' : 'text-gray-500 hover:text-gray-900'}`}
              >
                {label}
                {k === 'details' && resources.length > 0 && (
                  <span className="ml-2 text-[11px] font-semibold bg-primary-50 text-primary-600 rounded-full px-2 py-0.5">{resources.length}</span>
                )}
              </button>
            ))}
          </div>

          {pdf && !pdfMax ? (
            <PdfPane name={pdf.name} url={pdf.url} onMax={maximizePdf} onClose={closePdf} onDownload={() => downloadDoc(pdf.name)} />
          ) : (
          <div ref={listRef} className="flex-1 overflow-y-auto overscroll-contain scroll-smooth">
            {tab === 'details' ? (
              <div key={`d-${item.id}`} className="p-5 space-y-6 lms-fade">
                <div>
                  <h2 className="font-heading text-[17px] font-bold text-gray-900 leading-snug">{item.title}</h2>
                  <p className="text-[13px] text-gray-500 mt-1.5 tabular-nums">
                    {item.type === 'lecture' && item.durationSec ? `${fmt(item.durationSec)} · ` : ''}
                    {item.type === 'quiz' ? `Quiz, ${item.questionCount} questions` : kindOf(item) === 'lab' ? 'Lab video' : kindOf(item) === 'demo' ? 'Demo' : 'Lecture'}
                  </p>
                  {item.type === 'lecture' && (
                    <button
                      type="button"
                      onClick={() => mark(item.id, { done: !progress[item.id]?.done })}
                      className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-semibold border transition-colors duration-200 ${
                        progress[item.id]?.done ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'border-gray-300 text-gray-800 hover:border-gray-900'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" /> {progress[item.id]?.done ? 'Completed' : 'Mark as complete'}
                    </button>
                  )}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {next && (
                      <button type="button" onClick={() => select(next.id)} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold bg-primary-600 hover:bg-primary-500 text-white transition-colors">
                        Next lesson <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                    <button type="button" onClick={() => setTab('content')} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold border border-gray-300 text-gray-800 hover:border-gray-900 transition-colors">
                      <ListVideo className="w-4 h-4" /> Show in course content
                    </button>
                  </div>
                </div>

                {item.description && <RichText text={paragraphize(item.description)} className="text-[14px] leading-[1.65] text-gray-700" />}

                {resources.length > 0 && (
                <div>
                  <h3 className="text-[13px] font-semibold text-gray-900 mb-2.5">Attached documents</h3>
                  {(
                    <ul className="space-y-2">
                      {resources.map(r => {
                        const zip = /\.zip$/i.test(r.name)
                        return (
                          <li key={r.name}>
                            <button
                              type="button"
                              onClick={() => openDoc(r.name)}
                              className="w-full flex items-center gap-3 text-left px-3.5 py-3 rounded-xl border border-gray-200 hover:border-primary-400 hover:bg-primary-50/40 active:scale-[.99] transition duration-200"
                            >
                              <span className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${zip ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-500'}`}>
                                {zip ? <Download className="w-[18px] h-[18px]" /> : <FileText className="w-[18px] h-[18px]" />}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block text-[13.5px] font-medium text-gray-900 leading-snug break-words">{r.name.replace(/\.(pdf|zip)$/i, '')}</span>
                                <span className="block text-[12px] text-gray-400 mt-0.5">{zip ? 'Lab starter files, download' : 'PDF, opens here'}</span>
                              </span>
                              {docBusy === r.name && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
                )}
              </div>
            ) : (
              <div className="lms-fade">
                <div className="px-5 py-4 border-b border-gray-100">
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-bold tracking-tight text-gray-900 tabular-nums">{pct}%</span>
                    <span className="text-xs text-gray-500 tabular-nums">{doneCount} of {items.length} done{totalSec ? `, ${fmtTotal(totalSec)} of video` : ''}</span>
                  </div>
                  <div className="mt-3"><CourseStrip sections={course.sections} done={doneMap} height={14} /></div>
                  {allDone && <div className="mt-4"><CertificateCard slug={course.slug} /></div>}
                  {allDone && congratsUrl && (
                    <button type="button" onClick={() => setShowCongrats(true)} className="mt-3 text-[13px] font-semibold text-primary-600 hover:underline">Watch your congratulations video</button>
                  )}
                </div>
                {bundle && (
                  <div className="px-5 py-4 border-b border-gray-100">
                    <button
                      type="button"
                      onClick={downloadBundle}
                      className="w-full flex items-center gap-3 text-left px-3.5 py-3 rounded-xl border border-gray-200 hover:border-primary-400 hover:bg-primary-50/40 active:scale-[.99] transition duration-200"
                    >
                      <span className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-amber-50 text-amber-600"><Download className="w-[18px] h-[18px]" /></span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13.5px] font-semibold text-gray-900 leading-snug">Download all course files</span>
                        <span className="block text-[12px] text-gray-400 mt-0.5">One zip with every guide, document and starter file</span>
                      </span>
                      {docBusy === bundle.name && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
                    </button>
                  </div>
                )}
                {course.sections.map((s, si) => {
                  const sectionDone = s.items.filter(i => doneMap[i.id]).length
                  const secTime = s.items.reduce((a, i) => a + (i.type === 'lecture' ? i.durationSec || 0 : 0), 0)
                  return (
                    <div key={si} className="border-b border-gray-100 lms-sec">
                      <button
                        type="button"
                        onClick={() => setOpen(o => ({ ...o, [si]: !o[si] }))}
                        className="w-full flex items-start gap-2 px-5 py-3.5 text-left hover:bg-gray-50 transition-colors"
                      >
                        {open[si] ? <ChevronDown className="w-4 h-4 mt-0.5 shrink-0 text-gray-400" /> : <ChevronRight className="w-4 h-4 mt-0.5 shrink-0 text-gray-400" />}
                        <span className="flex-1 min-w-0">
                          <span className="block text-[13.5px] font-semibold text-gray-900 leading-snug">{s.title}</span>
                          <span className="block text-[12px] text-gray-400 mt-1 tabular-nums">{sectionDone}/{s.items.length}{secTime ? `, ${fmtTotal(secTime)}` : ''}</span>
                          <span className="block mt-2 pr-2"><CourseStrip sections={[s]} done={doneMap} height={5} maxSeconds={longestLesson(course.sections)} /></span>
                        </span>
                      </button>
                      {open[si] && (
                        <ul className="pb-2">
                          {s.items.map(i => (
                            <li key={i.id} data-item={i.id}>
                              <button
                                type="button"
                                onClick={() => select(i.id)}
                                className={`w-full flex items-start gap-3 pl-9 pr-5 py-2.5 text-left text-[13px] leading-snug transition-colors duration-150 ${
                                  i.id === item.id ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                {doneMap[i.id] ? (
                                  <CheckCircle2 className="w-4 h-4 mt-px shrink-0 text-emerald-600" />
                                ) : (
                                  <span className="w-1.5 h-4 mt-px ml-[5px] mr-[5px] rounded-[1px] shrink-0" style={{ background: KIND_COLOR[kindOf(i)] }} />
                                )}
                                <span className="flex-1">{i.title}</span>
                                {i.type === 'lecture' && i.durationSec ? <span className="text-[12px] text-gray-400 tabular-nums shrink-0 mt-px">{fmt(i.durationSec)}</span> : null}
                              </button>
                              {i.id === item.id && (
                                <div className="mx-5 mb-2 ml-9 lms-fade">
                                  <button type="button" onClick={() => setTab('details')} className="text-[12.5px] font-semibold text-primary-600 hover:underline">Lecture details ›</button>
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
          )}
        </aside>}
      </div>
      </div>
      {!infoOpen && (
        <button type="button" onClick={() => toggleInfo(true)} aria-label="Show lecture details and course content" title="Lecture details and course content"
          className="fixed z-40 right-0 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 bg-[#0f1824] text-white pr-2 pl-2.5 py-3.5 rounded-l-2xl shadow-lg hover:bg-[#1b2a3f] transition-colors">
          <Info className="w-5 h-5" />
          <span className="text-[11px] font-semibold [writing-mode:vertical-rl]">Details</span>
        </button>
      )}

      {showCongrats && congratsUrl && (
        <div className="fixed inset-0 z-[110] bg-black/85 flex flex-col items-center justify-center p-4 lms-fade" onContextMenu={e => e.preventDefault()}>
          <button type="button" onClick={() => setShowCongrats(false)} aria-label="Close" className="absolute right-5 top-5 p-2 rounded-full text-white/80 hover:bg-white/10 transition-colors">
            <X className="w-6 h-6" />
          </button>
          <div className="w-full max-w-5xl aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl">
            <video src={congratsUrl} autoPlay playsInline controls controlsList="nodownload noremoteplayback" disablePictureInPicture className="w-full h-full" />
          </div>
          <p className="mt-5 text-white/80 text-[15px]">You finished {course.code}. Well done.</p>
          <div className="mt-4 w-full max-w-md"><CertificateCard slug={course.slug} dark /></div>
        </div>
      )}

      {pdf && pdfMax && (
        <PdfPane max name={pdf.name} url={pdf.url} onMax={minimizePdf} onClose={closePdf} onDownload={() => downloadDoc(pdf.name)} />
      )}
    </div>
  )
}

function LecturePane({
  slug,
  lecture,
  email,
  savedPosition,
  autoStart,
  onPlayed,
  done,
  onPosition,
  onDone,
  hasNext,
  onNext,
  ctlRef,
}: {
  slug: string
  lecture: Lecture
  email: string
  savedPosition: number
  autoStart: boolean
  onPlayed: () => void
  done: boolean
  onPosition: (s: number) => void
  onDone: () => void
  hasNext: boolean
  onNext: () => void
  ctlRef: React.MutableRefObject<VideoCtl | null>
}) {
  const stageRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const lastSave = useRef(0)
  const resumeAt = useRef(savedPosition)
  const wasPlaying = useRef(autoStart)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [src, setSrc] = useState<string | null>(null)
  const [hlsUrl, setHlsUrl] = useState<string | null>(null)
  const hlsRetries = useRef(0)
  const [captionUrl, setCaptionUrl] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [playing, setPlaying] = useState(false)
  const [buffering, setBuffering] = useState(true)
  const [ready, setReady] = useState(false)
  const [cur, setCur] = useState(0)
  const [dur, setDur] = useState(lecture.durationSec || 0)
  const [buffered, setBuffered] = useState(0)
  const loud = useBoostedVolume(videoRef)
  const [muted, setMuted] = useState(false)
  // The sound button, the M key and the slider all go through this one switch
  useEffect(() => { const v = videoRef.current; if (v) v.muted = muted }, [muted])
  const [rate, setRate] = useState(1)
  const [rateOpen, setRateOpen] = useState(false)
  const [cc, setCc] = useState(true)
  const [full, setFull] = useState(false)
  const [showUi, setShowUi] = useState(true)
  const [ended, setEnded] = useState(false)

  // Get a fresh short-lived link. Called on mount and again before it expires.
  const load = useCallback(async () => {
    const res = await fetch(`/api/lms/play?slug=${slug}&item=${lecture.id}`, { cache: 'no-store' })
    if (!res.ok) {
      setError(res.status === 401 ? 'Your session expired. Sign in again to keep watching.' : 'This lecture could not be loaded. Try again in a moment.')
      return null
    }
    const d = await res.json()
    setError('')
    setCaptionUrl(d.captionUrl)
    // Protected courses stream encrypted HLS; older ones still use a signed MP4 link.
    setHlsUrl(d.hlsUrl ?? null)
    setSrc(d.hlsUrl ? null : d.videoUrl)
    return d.hlsUrl ? null : (d.expiresInSec as number)
  }, [slug, lecture.id])

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    const cycle = async () => {
      const ttl = await load()
      if (!ttl) return
      timer = setTimeout(() => {
        const v = videoRef.current
        if (v) {
          resumeAt.current = v.currentTime
          wasPlaying.current = !v.paused
        }
        cycle()
      }, (ttl - 180) * 1000)
    }
    cycle()
    return () => clearTimeout(timer)
  }, [load])

  // Encrypted HLS: hls.js everywhere it works, the browser's own player where it does not (older iPhones).
  useEffect(() => {
    if (!hlsUrl) return
    let hls: { destroy: () => void; recoverMediaError: () => void } | null = null
    let cancelled = false
    ;(async () => {
      const v = videoRef.current
      if (!v) return
      const { default: Hls } = await import('hls.js')
      if (cancelled) return
      if (Hls.isSupported()) {
        const h = new Hls({ maxBufferLength: 40, enableWorker: true })
        hls = h
        h.on(Hls.Events.ERROR, (_e, data) => {
          if (!data.fatal) return
          if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
            h.recoverMediaError()
            return
          }
          // Links expired or the connection dropped: ask for fresh ones and carry on from the same second.
          if (hlsRetries.current < 3) {
            hlsRetries.current += 1
            resumeAt.current = videoRef.current?.currentTime ?? 0
            wasPlaying.current = !(videoRef.current?.paused ?? false)
            load()
          } else setError('The video could not be loaded. Check your connection and refresh the page.')
        })
        h.on(Hls.Events.MANIFEST_PARSED, () => { hlsRetries.current = 0 })
        h.loadSource(hlsUrl)
        h.attachMedia(v)
      } else if (v.canPlayType('application/vnd.apple.mpegurl')) {
        // The browser's own HLS player may fetch the playlist more than once: ask for a link that allows it.
        const r = await fetch(`/api/lms/play?slug=${slug}&item=${lecture.id}&native=1`, { cache: 'no-store' })
        v.src = r.ok ? (await r.json()).hlsUrl : hlsUrl
      } else {
        setError('This browser cannot play the course video. Please use a recent Chrome, Edge, Safari or Firefox.')
      }
    })()
    return () => {
      cancelled = true
      hls?.destroy()
    }
  }, [hlsUrl, load, slug, lecture.id])

  // `onPosition` is a new function on every render of the parent. Keeping it in a ref keeps `save` stable:
  // a changing `save` re-ran the page-hide effect below, whose cleanup saves again - an endless render loop.
  const onPositionRef = useRef(onPosition)
  onPositionRef.current = onPosition
  const save = useCallback((force = false) => {
    const v = videoRef.current
    if (!v || !v.duration) return
    const now = Date.now()
    if (!force && now - lastSave.current < SAVE_EVERY_MS) return
    lastSave.current = now
    onPositionRef.current(v.currentTime >= v.duration - 5 ? 0 : v.currentTime)
  }, [])

  // Closing the tab, switching apps or locking the phone: save where you are.
  useEffect(() => {
    const flush = () => save(true)
    const onVis = () => { if (document.visibilityState === 'hidden') flush() }
    window.addEventListener('pagehide', flush)
    document.addEventListener('visibilitychange', onVis)
    return () => {
      flush()
      window.removeEventListener('pagehide', flush)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [save])

  useEffect(() => {
    ctlRef.current = {
      pause: () => {
        const v = videoRef.current
        if (!v || v.paused) return false
        v.pause()
        return true
      },
      resume: () => { videoRef.current?.play().catch(() => {}) },
    }
    return () => { ctlRef.current = null }
  }, [ctlRef])

  const toggle = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) v.play().catch(() => {})
    else v.pause()
  }, [])

  const skip = (s: number) => {
    const v = videoRef.current
    if (v) v.currentTime = Math.max(0, Math.min((v.duration || 1e9) - 0.1, v.currentTime + s))
  }

  const poke = () => {
    setShowUi(true)
    if (hideTimer.current) clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => setShowUi(false), 2600)
  }

  useEffect(() => {
    const onFs = () => setFull(document.fullscreenElement === stageRef.current)
    document.addEventListener('fullscreenchange', onFs)
    return () => document.removeEventListener('fullscreenchange', onFs)
  }, [])

  // Captions follow the CC toggle (the track loads after the element mounts).
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const apply = () => { for (const t of Array.from(v.textTracks)) t.mode = cc ? 'showing' : 'hidden' }
    apply()
    v.textTracks.addEventListener('addtrack', apply)
    return () => v.textTracks.removeEventListener('addtrack', apply)
  }, [cc, captionUrl, src, hlsUrl])

  const toggleFull = () => {
    if (document.fullscreenElement) document.exitFullscreen()
    else stageRef.current?.requestFullscreen?.().catch(() => {})
  }

  const onKey = (e: React.KeyboardEvent) => {
    const k = e.key.toLowerCase()
    if (k === ' ' || k === 'k') { e.preventDefault(); toggle() }
    else if (k === 'arrowright' || k === 'l') { e.preventDefault(); skip(10) }
    else if (k === 'arrowleft' || k === 'j') { e.preventDefault(); skip(-10) }
    else if (k === 'f') { e.preventDefault(); toggleFull() }
    else if (k === 'm') { e.preventDefault(); setMuted(m => !m) }
    else if (k === 'c') { e.preventDefault(); setCc(c => !c) }
    else return
    poke()
  }

  const pctPlayed = dur ? (cur / dur) * 100 : 0
  const pctBuf = dur ? (buffered / dur) * 100 : 0

  return (
    <div className="lms-fade">
      <style>{`
        @keyframes gnr-float {
          0%   { transform: translate(0, 0) rotate(-8deg) }
          25%  { transform: translate(34vw, 10%) rotate(-3deg) }
          50%  { transform: translate(8vw, 44%) rotate(-10deg) }
          75%  { transform: translate(38vw, 62%) rotate(-4deg) }
          100% { transform: translate(0, 0) rotate(-8deg) }
        }
        .gnr-mark { animation: gnr-float 38s ease-in-out infinite; will-change: transform }
        .gnr-stage:fullscreen .gnr-mark { font-size: 3.2vw }
        .gnr-stage:fullscreen { border-radius: 0 }
        @media (prefers-reduced-motion: reduce) { .gnr-mark { animation: none; transform: translate(30%, 40%) rotate(-8deg) } }
        .gnr-range { -webkit-appearance: none; appearance: none; background: transparent; width: 100%; height: 18px; cursor: pointer; margin: 0 }
        .gnr-range::-webkit-slider-runnable-track { height: 4px; background: transparent }
        .gnr-range::-moz-range-track { height: 4px; background: transparent }
        .gnr-range::-webkit-slider-thumb { -webkit-appearance: none; width: 13px; height: 13px; border-radius: 50%; background: #fff; margin-top: -4.5px; box-shadow: 0 0 0 3px rgba(0,113,227,.5) }
        .gnr-range::-moz-range-thumb { width: 13px; height: 13px; border-radius: 50%; background: #fff; border: 0; box-shadow: 0 0 0 3px rgba(0,113,227,.5) }
      `}</style>

      <div
        ref={stageRef}
        tabIndex={0}
        onKeyDown={onKey}
        onMouseMove={poke}
        onMouseLeave={() => playing && setShowUi(false)}
        onContextMenu={e => e.preventDefault()}
        className="gnr-stage relative bg-black rounded-2xl overflow-hidden aspect-video select-none outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
        style={{ cursor: showUi || !playing ? 'default' : 'none' }}
      >
        {(src || hlsUrl) && (
          <video
            ref={videoRef}
            src={hlsUrl ? undefined : (src ?? undefined)}
            autoPlay={autoStart}
            playsInline
            preload="auto"
            controlsList="nodownload noremoteplayback noplaybackrate"
            disablePictureInPicture
            disableRemotePlayback
            onClick={toggle}
            onDoubleClick={toggleFull}
            className={`absolute inset-0 w-full h-full bg-black transition-opacity duration-500 ${ready ? 'opacity-100' : 'opacity-0'}`}
            onLoadedMetadata={e => {
              const v = e.currentTarget
              setDur(v.duration)
              v.playbackRate = rate
              v.muted = muted
              if (resumeAt.current > 5 && resumeAt.current < v.duration - 10) v.currentTime = resumeAt.current
              if (!wasPlaying.current) v.pause()
            }}
            onDurationChange={e => { if (isFinite(e.currentTarget.duration)) setDur(e.currentTarget.duration) }}
            onLoadedData={() => setReady(true)}
            onPlay={() => { onPlayed(); setPlaying(true); setEnded(false); poke() }}
            onPause={() => { setPlaying(false); setShowUi(true); save(true) }}
            onWaiting={() => setBuffering(true)}
            onCanPlay={() => setBuffering(false)}
            onPlaying={() => setBuffering(false)}
            onProgress={e => {
              const v = e.currentTarget
              if (v.buffered.length) setBuffered(v.buffered.end(v.buffered.length - 1))
            }}
            onTimeUpdate={e => {
              const v = e.currentTarget
              setCur(v.currentTime)
              save()
              if (!done && v.duration && v.currentTime / v.duration > 0.9) onDone()
            }}
            onEnded={() => { setEnded(true); onDone(); onPosition(0) }}
            onError={() => { if (!hlsUrl) setError('The video stopped loading. Refreshing the link…') }}
          >
            {captionUrl && <track kind="captions" src={captionUrl} srcLang="en" label="English" default />}
          </video>
        )}

        {/* Floating watermark: moves for the whole clip and survives full screen */}
        <div className="gnr-mark pointer-events-none absolute left-[3%] top-[6%] font-heading font-semibold tracking-wide text-[clamp(20px,3vw,40px)]" style={{ color: 'rgba(255,170,200,0.13)' }}>
          Gennoor Academy
        </div>
        <div className="pointer-events-none absolute right-4 bottom-16 text-[11px] sm:text-xs font-medium" style={{ color: 'rgba(255,170,200,0.11)' }}>
          {email}
        </div>

        {(!(src || hlsUrl) || buffering) && !error && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><Loader2 className="w-9 h-9 animate-spin text-white/80" /></div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center text-white/80 text-sm px-8 text-center bg-black/60">{error}</div>
        )}

        {(src || hlsUrl) && !playing && !buffering && !error && !ended && (
          <button type="button" onClick={toggle} aria-label="Play" className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-white/15 backdrop-blur flex items-center justify-center hover:bg-white/25 hover:scale-105 transition duration-200">
            <Play className="w-9 h-9 text-white fill-white ml-1" />
          </button>
        )}

        {ended && hasNext && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 lms-fade">
            <button type="button" onClick={onNext} className="px-7 py-3 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-full transition-colors">Next lesson</button>
          </div>
        )}

        {/* Controls */}
        <div className={`absolute inset-x-0 bottom-0 px-4 pb-3 pt-14 bg-gradient-to-t from-black/85 via-black/40 to-transparent transition-opacity duration-300 ${showUi || !playing ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="relative h-[18px]">
            <div className="absolute left-0 right-0 top-[7px] h-1 rounded-full bg-white/25 overflow-hidden">
              <div className="absolute inset-y-0 left-0 bg-white/30" style={{ width: `${pctBuf}%` }} />
              <div className="absolute inset-y-0 left-0 bg-[#2f8bff]" style={{ width: `${pctPlayed}%` }} />
            </div>
            <input
              type="range"
              className="gnr-range absolute inset-0"
              min={0}
              max={dur || 1}
              step={0.1}
              value={Math.min(cur, dur || 1)}
              aria-label="Seek"
              onChange={e => { const v = videoRef.current; if (v) { v.currentTime = Number(e.target.value); setCur(v.currentTime) } }}
            />
          </div>
          <div className="flex items-center gap-1 sm:gap-2 text-white mt-1">
            <CtlBtn label={playing ? 'Pause' : 'Play'} onClick={toggle}>{playing ? <Pause className="w-[22px] h-[22px] fill-white" /> : <Play className="w-[22px] h-[22px] fill-white" />}</CtlBtn>
            <CtlBtn label="Back 10 seconds" onClick={() => skip(-10)}><RotateCcw className="w-5 h-5" /></CtlBtn>
            <CtlBtn label="Forward 10 seconds" onClick={() => skip(10)}><RotateCw className="w-5 h-5" /></CtlBtn>
            <span className="text-[13px] tabular-nums px-1 whitespace-nowrap">{fmt(cur)} <span className="text-white/60">/ {fmt(dur)}</span></span>
            <span className="flex-1" />
            <VolumeControl
              level={loud.level} max={loud.max} muted={muted}
              onLevel={loud.setLevel}
              onMuted={(off) => { setMuted(off); if (!off) loud.prime() }}
              align="right"
              buttonClassName="w-9 h-9 rounded-md flex items-center justify-center hover:bg-white/15 transition-colors"
            />
            <div className="relative">
              <button type="button" onClick={() => setRateOpen(o => !o)} className="px-2 h-9 rounded-md text-[13px] font-semibold tabular-nums hover:bg-white/15 transition-colors" aria-label="Playback speed">{rate}x</button>
              {rateOpen && (
                <ul className="absolute bottom-11 right-0 bg-[#0f1824]/95 backdrop-blur rounded-xl py-1.5 min-w-[84px] shadow-xl lms-fade">
                  {SPEEDS.map(s => (
                    <li key={s}>
                      <button type="button" onClick={() => { setRate(s); setRateOpen(false); if (videoRef.current) videoRef.current.playbackRate = s }} className={`w-full text-left px-4 py-1.5 text-[13px] tabular-nums hover:bg-white/10 ${s === rate ? 'text-[#2f8bff] font-semibold' : ''}`}>{s}x</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {captionUrl && (
              <CtlBtn label={cc ? 'Hide captions' : 'Show captions'} onClick={() => setCc(c => !c)} active={cc}><Subtitles className="w-5 h-5" /></CtlBtn>
            )}
            <CtlBtn label={full ? 'Exit full screen' : 'Full screen'} onClick={toggleFull}>{full ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}</CtlBtn>
          </div>
        </div>
      </div>

      <div className="flex items-start justify-between gap-4 mt-5">
        <div className="min-w-0">
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-gray-900 leading-snug tracking-[-0.01em]">{lecture.title}</h1>
          <p className="text-[13px] text-gray-500 mt-1.5 tabular-nums">
            {lecture.durationSec ? `${fmt(lecture.durationSec)} · ` : ''}
            {done ? 'Completed' : 'Space plays or pauses, arrows skip 10 seconds, f opens full screen'}
          </p>
        </div>
        {hasNext && (
          <button type="button" onClick={onNext} className="shrink-0 px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold rounded-full transition-colors">
            Next lesson
          </button>
        )}
      </div>
    </div>
  )
}

const ZOOMS = [50, 75, 100, 125, 150, 200, 300]

/** Gennoor Tech certificate of completion, available once the whole course is done. */
/**
 * An "i" in the top bar. It opens by itself when the lesson screen opens, when you scroll
 * down and when you open the chat, then fades away. Click it any time to see it again.
 * Hidden once the browser is already full screen.
 */
export function FullScreenInfo() {
  const [open, setOpen] = useState(false)
  const [full, setFull] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const scrolled = useRef(false)

  const isFull = () => !!document.fullscreenElement || window.innerHeight >= screen.height - 4
  const flash = useCallback(() => {
    if (isFull()) return
    setOpen(true)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setOpen(false), 6500)
  }, [])

  useEffect(() => {
    const check = () => setFull(isFull())
    check()
    const first = setTimeout(flash, 1200)
    const onScroll = () => { if (!scrolled.current && window.scrollY > 160) { scrolled.current = true; flash() } }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('gennoor:chat-open', flash)
    window.addEventListener('resize', check)
    document.addEventListener('fullscreenchange', check)
    return () => {
      clearTimeout(first)
      if (timer.current) clearTimeout(timer.current)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('gennoor:chat-open', flash)
      window.removeEventListener('resize', check)
      document.removeEventListener('fullscreenchange', check)
    }
  }, [flash])

  if (full) return null
  return (
    <span className="relative shrink-0">
      <button
        type="button"
        aria-label="Tip: use full screen"
        aria-expanded={open}
        onClick={() => { if (timer.current) clearTimeout(timer.current); setOpen(o => !o) }}
        className="w-6 h-6 rounded-full border border-[#4b5a70] text-[12px] font-semibold italic text-[#c3cddc] hover:text-white hover:border-white transition-colors flex items-center justify-center"
      >
        i
      </button>
      <span
        role="status"
        className={`absolute left-full top-0 ml-3 w-[min(480px,calc(100vw-5rem))] rounded-xl bg-raised text-gray-900 shadow-xl border border-gray-200 px-4 py-3 text-[13px] leading-snug z-50 transition-all duration-300 ${open ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-1 pointer-events-none'}`}
      >
        <span className="font-semibold">Press F11 for the best view.</span> Full screen shows the video and chat properly.
        <span className="block text-gray-500 mt-1">Windows and Linux: F11 (Fn+F11 on some laptops). Mac: Ctrl+Cmd+F.</span>
      </span>
    </span>
  )
}

function CertificateCard({ slug, dark = false }: { slug: string; dark?: boolean }) {
  const [cert, setCert] = useState<{ verifyUrl: string; pdfUrl: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/lms/certificate?slug=${slug}`, { cache: 'no-store' })
      .then(r => (r.ok ? r.json() : null))
      .then(d => { if (d?.issued) setCert(d) })
      .catch(() => {})
  }, [slug])

  const get = async () => {
    setBusy(true)
    setError('')
    try {
      const r = await fetch('/api/lms/certificate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug }) })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'Could not issue the certificate')
      setCert(d)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not issue the certificate')
    } finally {
      setBusy(false)
    }
  }

  const base = dark ? 'bg-white/10 text-white' : 'bg-primary-50 text-gray-900'
  return (
    <div className={`rounded-xl px-4 py-3.5 ${base}`}>
      <div className="flex items-center gap-2 text-[14px] font-semibold"><Award className="w-[18px] h-[18px]" /> Certificate of completion</div>
      {cert ? (
        <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2 text-[13px] font-semibold">
          <a href={cert.verifyUrl} target="_blank" rel="noopener" className={dark ? 'text-primary-300 hover:underline' : 'text-primary-600 hover:underline'}>View certificate</a>
          <a href={cert.pdfUrl} className={dark ? 'text-primary-300 hover:underline' : 'text-primary-600 hover:underline'}>Download PDF</a>
        </div>
      ) : (
        <>
          <p className={`text-[13px] mt-1 ${dark ? 'text-white/70' : 'text-gray-500'}`}>Issued by Gennoor Tech for finishing this course.</p>
          <button type="button" onClick={get} disabled={busy} className="mt-3 px-4 py-2 rounded-full bg-primary-600 hover:bg-primary-500 text-white text-[13px] font-semibold disabled:opacity-60 transition-colors">
            {busy ? 'Issuing…' : 'Get my certificate'}
          </button>
          {error && <p className="mt-2 text-[12.5px] text-red-500">{error}</p>}
        </>
      )}
    </div>
  )
}

function PdfPane({ name, url, max, onMax, onClose, onDownload }: { name: string; url: string; max?: boolean; onMax: () => void; onClose: () => void; onDownload: () => void }) {
  // null = fit to width; otherwise a percentage
  const [zoom, setZoom] = useState<number | null>(null)
  const step = (dir: 1 | -1) => {
    const cur = zoom ?? 100
    const next = dir > 0 ? ZOOMS.find(z => z > cur) : [...ZOOMS].reverse().find(z => z < cur)
    if (next) setZoom(next)
  }
  const bar = (
    <div className={`flex items-center gap-1 px-4 py-2.5 shrink-0 ${max ? 'bg-[#0f1824] text-white' : 'bg-gray-50 text-gray-900 border-b border-gray-200'}`}>
      <FileText className="w-4 h-4 shrink-0 opacity-70" />
      <span className="flex-1 truncate text-[13.5px] font-medium px-2">{name.replace(/\.pdf$/i, '')}</span>
      <PdfBtn label="Zoom out" onClick={() => step(-1)} dark={max}><ZoomOut className="w-[18px] h-[18px]" /></PdfBtn>
      <button type="button" onClick={() => setZoom(null)} title="Fit to width" className={`min-w-[52px] h-9 rounded-md text-[12.5px] font-semibold tabular-nums ${max ? 'hover:bg-white/15' : 'hover:bg-black/5'}`}>{zoom ? `${zoom}%` : 'Fit'}</button>
      <PdfBtn label="Zoom in" onClick={() => step(1)} dark={max}><ZoomIn className="w-[18px] h-[18px]" /></PdfBtn>
      <PdfBtn label="Download PDF" onClick={onDownload} dark={max}><Download className="w-[18px] h-[18px]" /></PdfBtn>
      <PdfBtn label={max ? 'Minimise' : 'Maximise'} onClick={onMax} dark={max}>{max ? <Minimize2 className="w-[18px] h-[18px]" /> : <Maximize2 className="w-[18px] h-[18px]" />}</PdfBtn>
      <PdfBtn label="Close" onClick={onClose} dark={max}><X className="w-5 h-5" /></PdfBtn>
    </div>
  )
  const frame = <iframe key={zoom ?? 'fit'} title={name} src={`${url}#toolbar=0&navpanes=0&${zoom ? `zoom=${zoom}` : 'view=FitH'}`} className="flex-1 w-full bg-[#525659] border-0" />
  if (max) {
    return (
      <div className="fixed inset-0 z-[100] bg-black/80 flex flex-col lms-fade" onContextMenu={e => e.preventDefault()}>
        {bar}
        {frame}
      </div>
    )
  }
  return <div className="flex-1 min-h-0 flex flex-col lms-fade">{bar}{frame}</div>
}

function PdfBtn({ children, label, onClick, dark }: { children: React.ReactNode; label: string; onClick: () => void; dark?: boolean }) {
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} className={`w-9 h-9 rounded-md flex items-center justify-center active:scale-95 transition ${dark ? 'hover:bg-white/15' : 'hover:bg-black/5'}`}>
      {children}
    </button>
  )
}

function CtlBtn({ children, label, onClick, active }: { children: React.ReactNode; label: string; onClick: () => void; active?: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`w-9 h-9 rounded-md flex items-center justify-center hover:bg-white/15 active:scale-95 transition duration-150 ${active ? 'text-[#2f8bff]' : ''}`}
    >
      {children}
    </button>
  )
}

interface QuizData { title: string; passPercent: number; questions: { question: string; answers: string[] }[] }
interface QuizResult { score: number; passed: boolean; passPercent: number; results: { correct: boolean; correctIndex: number; explanation: string }[] }

function QuizPane({
  slug,
  quizId,
  title,
  onResult,
  next,
  onNext,
}: {
  slug: string
  quizId: string
  title: string
  onResult: (score: number, passed: boolean) => void
  next?: LmsItem
  onNext: () => void
}) {
  const [quiz, setQuiz] = useState<QuizData | null>(null)
  const [picks, setPicks] = useState<number[]>([])
  const [result, setResult] = useState<QuizResult | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    fetch(`/api/lms/quiz?slug=${slug}&item=${quizId}`, { cache: 'no-store' })
      .then(r => (r.ok ? r.json() : null))
      .then(setQuiz)
      .catch(() => {})
  }, [slug, quizId])

  const submit = async () => {
    setBusy(true)
    try {
      const res = await fetch('/api/lms/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, item: quizId, answers: picks }),
      })
      if (res.ok) {
        const r: QuizResult = await res.json()
        setResult(r)
        onResult(r.score, r.passed)
      }
    } finally {
      setBusy(false)
    }
  }

  if (!quiz) return <div className="p-16 flex justify-center"><Loader2 className="w-7 h-7 animate-spin text-gray-400" /></div>

  return (
    <div className="bg-raised rounded-2xl border border-gray-200 px-5 sm:px-10 py-8 lms-fade">
      <h1 className="font-heading text-2xl font-bold text-gray-900 mb-1">{title}</h1>
      <p className="text-sm text-gray-500 mb-6">{quiz.questions.length} questions. Pass mark {quiz.passPercent}%.</p>

      {result && (
        <div className={`rounded-xl px-5 py-4 mb-6 text-[15px] lms-fade ${result.passed ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'}`}>
          You scored <strong>{result.score}%</strong>. {result.passed ? 'Passed.' : `You need ${result.passPercent}% to pass. Read the explanations and try again.`}
        </div>
      )}

      <ol className="space-y-8">
        {quiz.questions.map((q, qi) => (
          <li key={qi}>
            <div className="flex gap-2 font-medium text-gray-900 mb-3 leading-snug">
              <span className="shrink-0 tabular-nums">{qi + 1}.</span>
              <RichText text={q.question} className="min-w-0 flex-1 [&_p]:my-0 [&_p+pre]:mt-3 [&_pre+p]:mt-3 [&_pre]:font-normal" />
            </div>
            <div className="space-y-2">
              {q.answers.map((a, ai) => {
                const r = result?.results[qi]
                const chosen = picks[qi] === ai
                const tone = r
                  ? ai === r.correctIndex
                    ? 'border-emerald-500 bg-emerald-50'
                    : chosen
                      ? 'border-red-400 bg-red-50'
                      : 'border-gray-200'
                  : chosen
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                return (
                  <button
                    key={ai}
                    type="button"
                    disabled={!!result}
                    onClick={() => setPicks(p => { const n = [...p]; n[qi] = ai; return n })}
                    className={`w-full text-left px-4 py-2.5 rounded-lg border text-[14px] text-gray-800 transition-colors duration-150 ${tone}`}
                  >
                    {a.includes('\n') ? <RichText text={a} className="[&_p]:my-0 [&_pre]:text-[12px]" /> : <RichInline text={a} />}
                  </button>
                )
              })}
            </div>
            {result?.results[qi] && <RichText text={result.results[qi].explanation} className="mt-2 text-[13px] text-gray-500" />}
          </li>
        ))}
      </ol>

      <div className="mt-8 flex gap-3">
        {!result ? (
          <button type="button" onClick={submit} disabled={busy || picks.filter(p => p !== undefined).length < quiz.questions.length} className="px-6 py-2.5 bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold rounded-full disabled:opacity-50 transition-colors">
            {busy ? 'Checking…' : 'Submit answers'}
          </button>
        ) : (
          <>
            {!result.passed && <button type="button" onClick={() => { setResult(null); setPicks([]) }} className="px-6 py-2.5 bg-raised border border-gray-300 text-sm font-semibold rounded-full">Try again</button>}
            {next && <button type="button" onClick={onNext} className="px-6 py-2.5 bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold rounded-full transition-colors">Next lesson</button>}
          </>
        )}
      </div>
    </div>
  )
}
