'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, ChevronLeft, ChevronRight, Menu, X, ZoomIn, ZoomOut, Maximize, Minimize2, CheckCircle, PlayCircle, RotateCcw } from 'lucide-react'
import type { Chapter } from '@/config/courses'
import { courses as allCourses } from '@/config/courses'
import { saveLocalProgress, getLocalProgress } from '@/lib/progress-store'
import { useLearnerAuth } from '@/hooks/useLearnerAuth'
import CourseCompletionOverlay from './CourseCompletionOverlay'
import AudioPlayer from './AudioPlayer'
import ChapterAudioControls, { type ChapterAudioControlsHandle } from './ChapterAudioControls'

interface ChapterViewerProps {
  courseId: string
  chapter: Chapter
  prevChapter: Chapter | null
  nextChapter: Chapter | null
  allChapters: Chapter[]
}

const NEXT_CHAPTER_COUNTDOWN_SEC = 8

/**
 * Full-screen continuous course player.
 *
 * VLC-style: the whole viewport is the player; a hamburger opens the chapter
 * drawer; one timeline scrubs forward/backward (audio position is the single
 * source of truth); chapters chain in place with an "Up next" countdown.
 * No login anywhere — progress is saved on-device, and certificates are
 * claimed with an OTP-verified email at completion.
 *
 * Chapter chaining is an IN-PLACE swap + history.pushState (not router.push):
 * a route change would remount the player and browsers would then block the
 * next chapter's autoplay; swapping in place keeps one document with gesture
 * history, so continuous playback is permitted. Server chapter pages keep
 * their per-chapter URLs/metadata for SEO and direct loads.
 */
export default function ChapterViewer({ courseId, chapter: initialChapter, allChapters }: ChapterViewerProps) {
  const router = useRouter()
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [activeChapter, setActiveChapter] = useState(initialChapter)
  const chapter = activeChapter

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [stageReady, setStageReady] = useState(false)
  const [slideInfo, setSlideInfo] = useState('')
  const [slidePercent, setSlidePercent] = useState(0)
  const [currentSlideNum, setCurrentSlideNum] = useState(1)
  const [totalSlidesNum, setTotalSlidesNum] = useState(0)
  const [stepsInSlide, setStepsInSlide] = useState(0)
  const [currentStepInSlide, setCurrentStepInSlide] = useState(0)
  const [zoomLevel, setZoomLevel] = useState(100)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [controlsIdle, setControlsIdle] = useState(false)
  const [showEndOverlay, setShowEndOverlay] = useState(false)
  const [countdown, setCountdown] = useState(NEXT_CHAPTER_COUNTDOWN_SEC)
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationCertId, setCelebrationCertId] = useState<string | null>(null)
  const [celebrationLoading, setCelebrationLoading] = useState(false)
  const [celebrationError, setCelebrationError] = useState<string | null>(null)
  const { session, isLoggedIn } = useLearnerAuth()
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const celebrationTriggeredRef = useRef(false)
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Prev/next derived from the live chapter (props only describe the
  // initially-loaded one).
  const chapterIndex = useMemo(
    () => allChapters.findIndex(ch => ch.id === chapter.id),
    [allChapters, chapter.id],
  )
  const prevChapter = chapterIndex > 0 ? allChapters[chapterIndex - 1] : null
  const nextChapter = chapterIndex >= 0 && chapterIndex < allChapters.length - 1 ? allChapters[chapterIndex + 1] : null

  const course = useMemo(() => allCourses.find(c => c.id === courseId), [courseId])
  const theme = course?.theme

  // The next course in the catalog order — powers course-to-course movement
  // from the player drawer without leaving the learning flow.
  const nextCourse = useMemo(() => {
    const idx = allCourses.findIndex(c => c.id === courseId)
    return idx >= 0 && idx < allCourses.length - 1 ? allCourses[idx + 1] : null
  }, [courseId])

  const isNewAudioPattern = !!chapter.chapterAudio

  // ── In-place chapter swap ────────────────────────────────────────────────
  const swapChapter = useCallback((target: Chapter, pushUrl = true) => {
    setShowEndOverlay(false)
    setDrawerOpen(false)
    setStageReady(false)
    setSlideInfo('')
    setSlidePercent(0)
    setCurrentSlideNum(1)
    setTotalSlidesNum(0)
    setActiveChapter(target)
    if (pushUrl && typeof window !== 'undefined') {
      window.history.pushState(null, '', `/ai-academy/${courseId}/${target.slug}`)
      document.title = `${target.title} — ${course?.shortTitle ?? 'Gennoor Academy'}`
    }
  }, [courseId, course?.shortTitle])

  // Browser back/forward inside the player maps the URL back to a chapter.
  useEffect(() => {
    const onPop = () => {
      const slug = window.location.pathname.split('/').filter(Boolean).pop()
      const target = allChapters.find(ch => ch.slug === slug)
      if (target && target.id !== activeChapter.id) {
        swapChapter(target, false)
      } else if (!target) {
        // URL no longer points at a chapter (e.g. course page) — let the
        // server render it.
        window.location.reload()
      }
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [allChapters, activeChapter.id, swapChapter])

  // ── Progress ─────────────────────────────────────────────────────────────
  // Server sync is silent and only when a legacy session cookie exists —
  // login is never required or prompted.
  const syncToServer = useCallback((chapterId: string, percent: number, currentSlide: number, totalSlides: number) => {
    if (!isLoggedIn) return
    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current)
    syncTimeoutRef.current = setTimeout(async () => {
      try {
        await fetch('/api/learner/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            courseId,
            chapterId,
            currentSlide,
            totalSlides,
            completionPercent: percent,
            completed: percent >= 95,
          }),
        })
      } catch { /* silent */ }
    }, 5000)
  }, [courseId, isLoggedIn])

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'gennoor-slide-progress') {
        const percent = event.data.percent || 0
        const info = event.data.slideInfo || ''
        setSlideInfo(info)
        setSlidePercent(percent)

        const match = info.match(/(\d+)\s*\/\s*(\d+)/)
        const currentSlide = match ? parseInt(match[1]) : 0
        const totalSlides = match ? parseInt(match[2]) : 0

        if (currentSlide > 0) setCurrentSlideNum(currentSlide)
        if (totalSlides > 0) setTotalSlidesNum(totalSlides)
        if (event.data.totalSteps !== undefined) setStepsInSlide(event.data.totalSteps)
        if (event.data.currentStep !== undefined) setCurrentStepInSlide(event.data.currentStep)

        saveLocalProgress(courseId, event.data.chapterId, {
          completionPercent: percent,
          currentSlide,
          totalSlides,
        })
        syncToServer(event.data.chapterId, percent, currentSlide, totalSlides)
      } else if (event.data?.type === 'gennoor-academy:advance') {
        // Intro screen (chapter-00) — mark seen and advance to next chapter.
        saveLocalProgress(courseId, chapter.id, {
          completionPercent: 100,
          currentSlide: 1,
          totalSlides: 1,
          completed: true,
        })
        if (isLoggedIn) {
          fetch('/api/learner/progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              courseId,
              chapterId: chapter.id,
              currentSlide: 1,
              totalSlides: 1,
              completionPercent: 100,
              completed: true,
            }),
          }).catch(() => { /* silent */ })
        }
        if (nextChapter) swapChapter(nextChapter)
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [courseId, syncToServer, chapter.id, nextChapter, isLoggedIn, swapChapter])

  // ── Course completion / certificate ──────────────────────────────────────
  const isLastRegularChapter = useMemo(() => {
    if (!course) return false
    const regulars = course.chapters.filter(ch => !ch.isMockExam && ch.id !== 'chapter-00')
    return regulars.length > 0 && regulars[regulars.length - 1].id === chapter.id
  }, [course, chapter.id])

  const allPriorChaptersCompleted = useMemo(() => {
    if (!course) return false
    const gated = course.chapters.filter(ch => !ch.isMockExam && ch.id !== 'chapter-00')
    const local = getLocalProgress(courseId)
    if (!local) return false
    return gated.every(ch => {
      if (ch.id === chapter.id) return true // current chapter completion is detected via slidePercent
      return local.chapters[ch.id]?.completed === true
    })
  }, [course, courseId, chapter.id])

  const celebrationStorageKey = `gennoor-celebrated:${courseId}`

  useEffect(() => {
    if (!isLastRegularChapter) return
    if (slidePercent < 99) return
    if (!allPriorChaptersCompleted) return
    if (celebrationTriggeredRef.current) return
    if (typeof window !== 'undefined' && window.localStorage.getItem(celebrationStorageKey)) {
      // Already celebrated this course on this device.
      celebrationTriggeredRef.current = true
      const stored = window.localStorage.getItem(celebrationStorageKey)
      if (stored && stored !== 'true') setCelebrationCertId(stored)
      else if (isLoggedIn) {
        fetch(`/api/learner/courses/${courseId}/issue-cert`)
          .then(r => (r.ok ? r.json() : null))
          .then(data => {
            if (data?.cert?.certId) setCelebrationCertId(data.cert.certId)
          })
          .catch(() => { /* silent */ })
      }
      return
    }

    celebrationTriggeredRef.current = true
    setShowCelebration(true)
    setCelebrationError(null)

    if (!isLoggedIn) {
      // No account: the overlay hosts the OTP certificate-claim form.
      setCelebrationLoading(false)
      return
    }

    // Logged-in flow (legacy sessions): silent issuance, unchanged.
    setCelebrationLoading(true)
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current)
      syncTimeoutRef.current = null
    }

    const issuanceFlow = async () => {
      try {
        await fetch('/api/learner/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            courseId,
            chapterId: chapter.id,
            currentSlide: currentSlideNum,
            totalSlides: totalSlidesNum,
            completionPercent: 100,
            completed: true,
          }),
        })

        const res = await fetch(`/api/learner/courses/${courseId}/issue-cert`, { method: 'POST' })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error || `Issue failed (${res.status})`)
        }
        const data = await res.json()
        if (data?.cert?.certId) {
          setCelebrationCertId(data.cert.certId)
          if (typeof window !== 'undefined') {
            window.localStorage.setItem(celebrationStorageKey, data.cert.certId)
          }
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Could not issue certificate.'
        setCelebrationError(`${message} Your completion is saved — refresh the page in a moment to retry.`)
      } finally {
        setCelebrationLoading(false)
      }
    }

    void issuanceFlow()
  }, [isLoggedIn, isLastRegularChapter, slidePercent, courseId, celebrationStorageKey, chapter.id, currentSlideNum, totalSlidesNum, allPriorChaptersCompleted])

  const handleCertClaimed = useCallback((certId: string) => {
    setCelebrationCertId(certId)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(celebrationStorageKey, certId)
    }
  }, [celebrationStorageKey])

  // ── Audio / slide navigation plumbing ────────────────────────────────────
  const audioControlsRef = useRef<ChapterAudioControlsHandle | null>(null)

  const postToIframe = useCallback((type: string) => {
    try {
      iframeRef.current?.contentWindow?.postMessage({ type }, '*')
    } catch { /* cross-origin */ }
  }, [])

  const advanceSlideInIframe = useCallback(() => {
    if (isNewAudioPattern && audioControlsRef.current) {
      audioControlsRef.current.step('next-slide')
    } else {
      postToIframe('gennoor-advance-slide')
    }
  }, [isNewAudioPattern, postToIframe])

  const advanceStepInIframe = useCallback(() => {
    if (isNewAudioPattern && audioControlsRef.current) {
      audioControlsRef.current.step('next-step')
    } else {
      postToIframe('gennoor-advance-step')
    }
  }, [isNewAudioPattern, postToIframe])

  const resetStepsInIframe = useCallback(() => postToIframe('gennoor-reset-steps'), [postToIframe])
  const revealAllStepsInIframe = useCallback(() => postToIframe('gennoor-reveal-all-steps'), [postToIframe])

  const retreatSlideInIframe = useCallback(() => {
    if (isNewAudioPattern && audioControlsRef.current) {
      audioControlsRef.current.step('prev-slide')
    } else {
      postToIframe('gennoor-retreat-slide')
    }
  }, [isNewAudioPattern, postToIframe])

  // Nav events posted UP from the iframe's in-slide controls.
  useEffect(() => {
    if (!isNewAudioPattern) return
    const handler = (e: MessageEvent) => {
      if (!e || !e.data || e.data.type !== 'gennoor-academy:nav') return
      const slide = e.data.slide
      const step = e.data.step
      if (typeof slide !== 'number') return
      audioControlsRef.current?.seekToCue(slide, step)
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [isNewAudioPattern])

  // Arrow-key intent forwarded from inside the iframe.
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (!e || !e.data || e.data.type !== 'gennoor-academy:nav-request') return
      if (e.data.dir === 'next') advanceSlideInIframe()
      else if (e.data.dir === 'prev') retreatSlideInIframe()
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [advanceSlideInIframe, retreatSlideInIframe])

  // Parent-side keyboard: Space play/pause, arrows slide nav, J/L ±10s,
  // F fullscreen. Esc closes drawer/overlays (native fullscreen-Esc is
  // handled by the browser).
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

      if (e.code === 'Space') {
        if (!isNewAudioPattern) return
        e.preventDefault()
        audioControlsRef.current?.togglePlay()
        return
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        advanceSlideInIframe()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        retreatSlideInIframe()
      } else if (e.key === 'j' || e.key === 'J') {
        audioControlsRef.current?.seekBy(-10)
      } else if (e.key === 'l' || e.key === 'L') {
        audioControlsRef.current?.seekBy(10)
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen()
      } else if (e.key === 'Escape') {
        setDrawerOpen(false)
        setShowEndOverlay(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [advanceSlideInIframe, retreatSlideInIframe, isNewAudioPattern])

  // Space pressed INSIDE the iframe.
  useEffect(() => {
    if (!isNewAudioPattern) return
    const handler = (e: MessageEvent) => {
      if (!e || !e.data || e.data.type !== 'gennoor-academy:play-toggle') return
      audioControlsRef.current?.togglePlay()
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [isNewAudioPattern])

  // ── Zoom / fullscreen ────────────────────────────────────────────────────
  const applyZoom = useCallback((level: number) => {
    try {
      const iframeDoc = iframeRef.current?.contentDocument
      if (!iframeDoc) return
      const scale = level / 100
      iframeDoc.documentElement.style.cssText = `transform: scale(${scale}); transform-origin: top left; width: ${100 / scale}%; height: ${100 / scale}%;`
    } catch { /* cross-origin */ }
  }, [])

  const handleZoomChange = useCallback((level: number) => {
    const clamped = Math.max(50, Math.min(125, level))
    setZoomLevel(clamped)
    applyZoom(clamped)
  }, [applyZoom])

  const toggleFullscreen = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    type FsElement = HTMLElement & { webkitRequestFullscreen?: () => Promise<void> | void }
    type FsDocument = Document & { webkitExitFullscreen?: () => Promise<void> | void; webkitFullscreenElement?: Element | null }
    const doc = document as FsDocument
    const fsEl = doc.fullscreenElement ?? doc.webkitFullscreenElement
    if (fsEl) {
      const exit = doc.exitFullscreen?.bind(doc) ?? doc.webkitExitFullscreen?.bind(doc)
      try { void Promise.resolve(exit?.()).catch(() => {}) } catch { /* ignore */ }
    } else {
      const target = el as FsElement
      const request = target.requestFullscreen?.bind(target) ?? target.webkitRequestFullscreen?.bind(target)
      try {
        void Promise.resolve(request?.())
          .then(() => {
            // Phones/tablets: rotate the lesson into landscape like a video
            // app. Only attempt on touch-first devices; silently ignored on
            // platforms that don't allow orientation lock (e.g. iOS Safari).
            const touchFirst = window.matchMedia('(pointer: coarse)').matches
            if (!touchFirst) return
            const orientation = screen.orientation as ScreenOrientation & {
              lock?: (o: string) => Promise<void>
            }
            orientation?.lock?.('landscape').catch(() => {})
          })
          .catch(() => {})
      } catch { /* ignore */ }
    }
  }, [])

  useEffect(() => {
    const handler = () => {
      const fs = !!document.fullscreenElement
      setIsFullscreen(fs)
      // Leaving fullscreen: release any landscape lock we took on entry.
      if (!fs) {
        const orientation = screen.orientation as ScreenOrientation & { unlock?: () => void }
        try { orientation?.unlock?.() } catch { /* ignore */ }
      }
    }
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  // Player hotkeys pressed INSIDE the iframe (F fullscreen, J/L seek).
  // Without this, fullscreen and seek keys silently stop working the moment
  // the learner clicks the slide content (focus moves into the iframe).
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (!e || !e.data) return
      if (e.data.type === 'gennoor-academy:fullscreen-toggle') {
        toggleFullscreen()
      } else if (e.data.type === 'gennoor-academy:seek-by' && typeof e.data.seconds === 'number') {
        audioControlsRef.current?.seekBy(e.data.seconds)
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [toggleFullscreen])

  // Auto-hide the control bars in fullscreen after 3s idle (VLC behaviour).
  const pokeControls = useCallback(() => {
    setControlsIdle(false)
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    idleTimerRef.current = setTimeout(() => setControlsIdle(true), 3000)
  }, [])

  useEffect(() => {
    if (!isFullscreen) {
      setControlsIdle(false)
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
      return
    }
    pokeControls()
    return () => { if (idleTimerRef.current) clearTimeout(idleTimerRef.current) }
  }, [isFullscreen, pokeControls])

  // Mouse/touch activity INSIDE the chapter iframe. In fullscreen the iframe
  // covers essentially the whole screen, so the parent container's own
  // onMouseMove never fires — without this, the control bars hide after 3s
  // and hovering the content can never bring them back.
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (!e || !e.data || e.data.type !== 'gennoor-academy:activity') return
      if (document.fullscreenElement) pokeControls()
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [pokeControls])

  const barsHidden = isFullscreen && controlsIdle && !drawerOpen && !showEndOverlay && !showCelebration

  // ── Iframe injection (progress tracking + authoritative deck state) ──────
  const handleIframeLoad = useCallback(() => {
    try {
      const iframeDoc = iframeRef.current?.contentDocument
      if (!iframeDoc) return

      // Apply zoom
      const scale = zoomLevel / 100
      iframeDoc.documentElement.style.cssText = `transform: scale(${scale}); transform-origin: top left; width: ${100 / scale}%; height: ${100 / scale}%;`

      const script = iframeDoc.createElement('script')
      script.textContent = `
        (function() {
          function reportProgress() {
            var progressFill = document.getElementById('progressFill');
            // 'counter' is the legacy per-slide-MP3 chapter ID; 'counterTop'
            // is the new chapterAudio pattern ID (used in courses shipped
            // from May 2026 onwards). Read whichever exists.
            var counter = document.getElementById('counter') || document.getElementById('counterTop');
            var percent = 0;
            var text = '';
            if (progressFill) {
              percent = parseFloat(progressFill.style.width) || 0;
            }
            if (counter) {
              text = counter.textContent || '';
            }
            var slide = document.querySelector('.slide.active');
            var totalSteps = 0;
            var currentStep = 0;
            if (slide) {
              totalSteps = slide.querySelectorAll('[data-step]').length;
              currentStep = slide.querySelectorAll('[data-step].revealed').length;
            }
            window.parent.postMessage({
              type: 'gennoor-slide-progress',
              percent: percent,
              slideInfo: text,
              chapterId: '${chapter.id}',
              totalSteps: totalSteps,
              currentStep: currentStep
            }, '*');
          }

          // Authoritative deck state — timeline position is the single source
          // of truth. For target slide S / step K: earlier slides are inactive
          // and fully revealed, slide S is active with steps <= K revealed,
          // later slides are fully reset. Idempotent, so forward playback is
          // unaffected; fixes wrong state when seeking/stepping BACKWARD
          // (the chapter's built-in cue adapter only ever reveals forward).
          // K semantics: null = slide start (no steps), 9999 = fully revealed.
          function applyAuthoritativeState(S, K) {
            var slides = document.querySelectorAll('.slide');
            if (!slides.length) return;
            slides.forEach(function(sl, i) {
              var n = i + 1;
              var steps = sl.querySelectorAll('[data-step]');
              if (n < S) {
                sl.classList.remove('active');
                steps.forEach(function(s) { s.classList.add('revealed'); });
              } else if (n === S) {
                sl.classList.add('active');
                steps.forEach(function(s, j) {
                  var v = parseInt(s.getAttribute('data-step'), 10);
                  var ord = isNaN(v) ? j + 1 : v;
                  if (K != null && ord <= K) s.classList.add('revealed');
                  else s.classList.remove('revealed');
                });
              } else {
                sl.classList.remove('active');
                steps.forEach(function(s) { s.classList.remove('revealed'); });
              }
            });
            var fill = document.getElementById('progressFill');
            if (fill) fill.style.width = (S / slides.length * 100) + '%';
            var ctr = document.getElementById('counter') || document.getElementById('counterTop');
            if (ctr) ctr.textContent = S + ' / ' + slides.length;
            reportProgress();
          }

          window.addEventListener('message', function(e) {
            if (!e || !e.data || e.data.type !== 'gennoor-academy:apply-state') return;
            var S = e.data.slide;
            var K = (e.data.step == null ? null : e.data.step);
            // Defer so the built-in adapter's handling of the preceding cue has
            // already run — this handler then corrects any forward-only residue.
            setTimeout(function() { applyAuthoritativeState(S, K); }, 0);
          });

          var progressFill = document.getElementById('progressFill');
          if (progressFill) {
            var observer = new MutationObserver(function() { reportProgress(); });
            observer.observe(progressFill, { attributes: true, attributeFilter: ['style'] });
          }

          // Report progress on user clicks (next/prev buttons)
          document.addEventListener('click', function() {
            setTimeout(function() { reportProgress(); }, 150);
          });

          // Report progress on user keyboard (ArrowRight/ArrowLeft steps)
          document.addEventListener('keydown', function() {
            setTimeout(function() { reportProgress(); }, 150);
          });

          // Forward pointer activity to the parent (throttled) so its
          // fullscreen idle-hide timer resets while the mouse moves over the
          // chapter content — the iframe swallows these events otherwise.
          var lastActivityAt = 0;
          function reportActivity() {
            var now = Date.now();
            if (now - lastActivityAt < 300) return;
            lastActivityAt = now;
            try { window.parent.postMessage({ type: 'gennoor-academy:activity' }, '*'); } catch (err) {}
          }
          document.addEventListener('mousemove', reportActivity, true);
          document.addEventListener('pointerdown', reportActivity, true);
          document.addEventListener('touchstart', reportActivity, { passive: true, capture: true });

          var nextBtn = document.getElementById('nextBtn');
          var prevBtn = document.getElementById('prevBtn');

          window.addEventListener('message', function(e) {
            if (!e.data || !e.data.type) return;

            if (e.data.type === 'gennoor-advance-step') {
              if (nextBtn) nextBtn.click();
              setTimeout(function() { reportProgress(); }, 100);
            }

            if (e.data.type === 'gennoor-reset-steps') {
              var slide = document.querySelector('.slide.active');
              if (slide) {
                slide.querySelectorAll('[data-step].revealed').forEach(function(s) { s.classList.remove('revealed'); });
              }
              reportProgress();
            }

            if (e.data.type === 'gennoor-reveal-all-steps') {
              var slide = document.querySelector('.slide.active');
              if (slide) {
                slide.querySelectorAll('[data-step]:not(.revealed)').forEach(function(s) { s.classList.add('revealed'); });
              }
              reportProgress();
            }

            if (e.data.type === 'gennoor-advance-slide') {
              var slide = document.querySelector('.slide.active');
              if (!slide) return;
              slide.querySelectorAll('[data-step]:not(.revealed)').forEach(function(s) { s.classList.add('revealed'); });
              setTimeout(function() {
                if (nextBtn) nextBtn.click();
                setTimeout(function() { reportProgress(); }, 150);
              }, 50);
            }

            if (e.data.type === 'gennoor-retreat-slide') {
              if (prevBtn) prevBtn.click();
              // Land on the previous slide fully revealed, later slides reset.
              setTimeout(function() {
                var all = document.querySelectorAll('.slide');
                var act = document.querySelector('.slide.active');
                var idx = Array.prototype.indexOf.call(all, act);
                if (idx >= 0) applyAuthoritativeState(idx + 1, 9999);
                else reportProgress();
              }, 100);
            }

            if (e.data.type === 'gennoor-next') {
              if (nextBtn) nextBtn.click();
              setTimeout(function() { reportProgress(); }, 100);
            }

            if (e.data.type === 'gennoor-prev') {
              if (prevBtn) prevBtn.click();
              setTimeout(function() { reportProgress(); }, 100);
            }
          });

          // Hide iframe's built-in nav — slide nav is in the parent toolbar
          var controlsTop = document.querySelector('.controls-top');
          if (controlsTop) controlsTop.style.display = 'none';
          var stepInd = document.getElementById('stepIndicator');
          if (stepInd) stepInd.style.display = 'none';

          // Intercept arrow keys in capture phase so the iframe's own
          // PLAYER_JS handler does NOT fire (its audio is muted, so the
          // user would see a visual change with no narration — and only
          // the slide heading, since the iframe applies cues with
          // fillSlide=false). Instead, route the intent up to the parent
          // and let the parent's audio controls drive the seek + replay
          // and post a userDriven=true cue back so we fully reveal.
          document.addEventListener('keydown', function(e) {
            var isNav = e.key === 'ArrowRight' || e.key === 'ArrowLeft' ||
                        e.key === 'PageDown' || e.key === 'PageUp';
            var isSpace = e.code === 'Space' || e.key === ' ';
            var isFull = e.key === 'f' || e.key === 'F';
            var isSeekBack = e.key === 'j' || e.key === 'J';
            var isSeekFwd = e.key === 'l' || e.key === 'L';
            if (!isNav && !isSpace && !isFull && !isSeekBack && !isSeekFwd) return;
            var tag = (e.target && e.target.tagName) || '';
            if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
            // Space inside a button/anchor should still activate it.
            if (isSpace && (tag === 'BUTTON' || tag === 'A')) return;
            e.stopImmediatePropagation();
            e.preventDefault();
            try {
              if (isSpace) {
                window.parent.postMessage({ type: 'gennoor-academy:play-toggle' }, '*');
              } else if (isFull) {
                window.parent.postMessage({ type: 'gennoor-academy:fullscreen-toggle' }, '*');
              } else if (isSeekBack || isSeekFwd) {
                window.parent.postMessage({ type: 'gennoor-academy:seek-by', seconds: isSeekBack ? -10 : 10 }, '*');
              } else {
                var dir = (e.key === 'ArrowRight' || e.key === 'PageDown') ? 'next' : 'prev';
                window.parent.postMessage({ type: 'gennoor-academy:nav-request', dir: dir }, '*');
              }
            } catch (err) {}
          }, true);

          // After the iframe's own message handler applies a cue, run again
          // and fully reveal the active slide when the cue is user-driven.
          window.addEventListener('message', function(e) {
            if (!e || !e.data) return;
            if (e.data.type !== 'gennoor-academy:cue') return;
            if (!e.data.userDriven) return;
            setTimeout(function() {
              var slide = document.querySelector('.slide.active');
              if (!slide) return;
              slide.querySelectorAll('[data-step]:not(.revealed)').forEach(function(s) {
                s.classList.add('revealed');
              });
            }, 0);
          });

          setTimeout(function() { reportProgress(); }, 500);
        })();
      `
      iframeDoc.body.appendChild(script)

      // A freshly (re)loaded deck starts at slide 1 regardless of where the
      // narration is (resume seek, chapter swap mid-seek, dev reloads).
      // Ask the audio engine to re-post the authoritative state for its
      // current position once the deck has initialised.
      if (isNewAudioPattern) {
        setTimeout(() => { audioControlsRef.current?.resync() }, 350)
      }
    } catch {
      // Cross-origin or sandboxing may prevent access — fail silently
    }
    setStageReady(true)
  }, [chapter.id, zoomLevel, isNewAudioPattern])

  // ── End-of-chapter overlay + autoplay countdown ──────────────────────────
  const handleAudioEnded = useCallback(() => {
    if (isLastRegularChapter) return // celebration handles the finale
    if (!nextChapter) return
    setCountdown(NEXT_CHAPTER_COUNTDOWN_SEC)
    setShowEndOverlay(true)
  }, [isLastRegularChapter, nextChapter])

  // Legacy chapters have no single audio end — raise the overlay at 99%.
  useEffect(() => {
    if (isNewAudioPattern || chapter.isMockExam) return
    if (isLastRegularChapter || !nextChapter) return
    if (slidePercent >= 99 && !showEndOverlay) {
      setCountdown(NEXT_CHAPTER_COUNTDOWN_SEC)
      setShowEndOverlay(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slidePercent, isNewAudioPattern, chapter.isMockExam, isLastRegularChapter, nextChapter])

  useEffect(() => {
    if (!showEndOverlay || !nextChapter) return
    if (countdown <= 0) {
      swapChapter(nextChapter)
      return
    }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [showEndOverlay, countdown, nextChapter, swapChapter])

  const regularChapters = allChapters.filter(ch => !ch.isMockExam)
  const mockExam = allChapters.find(ch => ch.isMockExam)
  const localProgress = getLocalProgress(courseId)

  const chapterTick = (ch: Chapter) => {
    const p = localProgress?.chapters[ch.id]
    if (p?.completed || (p?.completionPercent ?? 0) >= 95) return 'done'
    if ((p?.completionPercent ?? 0) > 0) return 'partial'
    return 'none'
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[60] bg-gray-950 flex flex-col"
      onMouseMove={isFullscreen ? pokeControls : undefined}
    >
      {/* Top bar — minimal: hamburger · title · close.
          In fullscreen it overlays the stage (video-player style) and slides
          away when idle instead of collapsing the layout. */}
      <div
        className={`bg-gray-900 text-white flex items-center h-12 px-3 gap-3 z-20 transition-all duration-300 ${
          isFullscreen ? 'absolute top-0 left-0 right-0' : 'flex-shrink-0'
        } ${barsHidden ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0'}`}
      >
        <button
          onClick={() => setDrawerOpen(o => !o)}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
          title="Chapters"
          aria-label="Open chapter list"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex-1 min-w-0 flex items-center justify-center gap-2">
          <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase flex-shrink-0">
            {chapter.isMockExam ? 'EXAM' : `CH ${String(chapter.number).padStart(2, '0')}`}
          </span>
          <span className="text-sm font-medium truncate">{chapter.title}</span>
          {slideInfo && (
            <span className="hidden sm:inline text-xs text-white/40 flex-shrink-0">{slideInfo}</span>
          )}
        </div>

        <button
          onClick={() => router.push(`/ai-academy/${courseId}`)}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
          title="Close player"
          aria-label="Close player"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Stage */}
      <div className="flex-1 min-h-0 relative">
        <iframe
          key={chapter.id}
          ref={iframeRef}
          src={`/api/content${chapter.htmlFile}`}
          className={`w-full h-full border-0 bg-gray-100 transition-opacity duration-300 ${
            stageReady ? 'opacity-100' : 'opacity-0'
          }`}
          sandbox="allow-scripts allow-same-origin"
          title={chapter.title}
          onLoad={handleIframeLoad}
        />

        {/* Chapter drawer */}
        {drawerOpen && (
          <>
            <div
              className="absolute inset-0 bg-black/50 z-30 animate-fade-in"
              onClick={() => setDrawerOpen(false)}
              aria-hidden="true"
            />
            <aside className="absolute left-0 top-0 bottom-0 z-40 w-80 max-w-[85vw] bg-gray-900 text-white overflow-y-auto shadow-2xl animate-fade-in">
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xs font-bold tracking-widest text-white/40 uppercase">
                    {course?.shortTitle ?? 'Course'}
                  </h3>
                  <button onClick={() => setDrawerOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg">
                    <X className="w-4 h-4 text-white/60" />
                  </button>
                </div>
                <p className="text-sm font-semibold mb-4 text-white/90">Chapters</p>
                <nav className="space-y-0.5">
                  {regularChapters.map(ch => {
                    const isActive = ch.id === chapter.id
                    const tick = chapterTick(ch)
                    return (
                      <button
                        key={ch.id}
                        onClick={() => swapChapter(ch)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition-colors ${
                          isActive
                            ? 'bg-white/10 text-white font-medium'
                            : 'text-white/60 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${
                          tick === 'done'
                            ? 'bg-green-500/20 text-green-400'
                            : isActive ? 'bg-primary-500/30 text-primary-300' : 'bg-white/10 text-white/50'
                        }`}>
                          {tick === 'done' ? <CheckCircle className="w-4 h-4" /> : String(ch.number).padStart(2, '0')}
                        </span>
                        <span className="truncate flex-1">{ch.title}</span>
                        {ch.estimatedMinutes ? (
                          <span className="text-[10px] text-white/30 flex-shrink-0 tabular-nums">{ch.estimatedMinutes}m</span>
                        ) : null}
                      </button>
                    )
                  })}
                  {mockExam && (
                    <div className="pt-2 mt-2 border-t border-white/10">
                      <button
                        onClick={() => swapChapter(mockExam)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition-colors ${
                          mockExam.id === chapter.id
                            ? 'bg-white/10 text-white font-medium'
                            : 'text-white/60 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-[11px] font-bold flex-shrink-0">
                          EX
                        </span>
                        <span className="truncate">{mockExam.title}</span>
                      </button>
                    </div>
                  )}
                </nav>

                {/* Course-to-course movement — always one tap away */}
                <div className="pt-3 mt-3 border-t border-white/10 space-y-0.5">
                  {nextCourse && (
                    <Link
                      href={`/ai-academy/${nextCourse.id}`}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-white/80 hover:bg-white/5 hover:text-white transition-colors"
                    >
                      <span className="min-w-0">
                        <span className="block text-[10px] font-bold tracking-widest text-white/40 uppercase">
                          Next course
                        </span>
                        <span className="block truncate">{nextCourse.shortTitle || nextCourse.title}</span>
                      </span>
                      <ArrowRight className="w-4 h-4 flex-shrink-0 text-white/40" />
                    </Link>
                  )}
                  <Link
                    href={`/ai-academy/${courseId}`}
                    className="block px-3 py-2 rounded-xl text-[13px] text-white/60 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    Course home
                  </Link>
                  <Link
                    href="/academy"
                    className="block px-3 py-2 rounded-xl text-[13px] text-white/60 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    All Academy courses
                  </Link>
                  <Link
                    href="/academy/dashboard"
                    className="block px-3 py-2 rounded-xl text-[13px] text-white/60 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    My dashboard
                  </Link>
                </div>
              </div>
            </aside>
          </>
        )}

        {/* End-of-chapter "Up next" overlay */}
        {showEndOverlay && nextChapter && (
          <div className="absolute inset-0 z-40 bg-black/75 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
            <div className="max-w-md w-full text-center text-white">
              <div className="inline-flex items-center gap-2 text-green-400 text-sm font-semibold mb-4">
                <CheckCircle className="w-5 h-5" />
                Chapter complete
              </div>
              <p className="text-xs font-bold tracking-widest text-white/40 uppercase mb-2">Up next</p>
              <h3 className="font-heading text-2xl font-bold mb-6">{nextChapter.title}</h3>

              <button
                onClick={() => nextChapter && swapChapter(nextChapter)}
                className="relative inline-flex items-center gap-3 px-8 py-4 bg-white text-gray-900 font-bold rounded-2xl hover:bg-gray-100 transition-colors mb-4"
              >
                <PlayCircle className="w-5 h-5" />
                Play now
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary-600 text-white text-xs font-bold flex items-center justify-center tabular-nums">
                  {countdown}
                </span>
              </button>

              <div className="flex items-center justify-center gap-4 text-sm">
                <button
                  onClick={() => { setShowEndOverlay(false); audioControlsRef.current?.seekToCue(1) }}
                  className="inline-flex items-center gap-1.5 text-white/60 hover:text-white transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Replay chapter
                </button>
                <span className="text-white/20">·</span>
                <button
                  onClick={() => setShowEndOverlay(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  Stay here
                </button>
                <span className="text-white/20">·</span>
                <Link href={`/ai-academy/${courseId}`} className="text-white/60 hover:text-white transition-colors">
                  Back to course
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hover hot-zones — while the bars are hidden in fullscreen, the top
          and bottom screen edges wake them even though the iframe owns the
          rest of the pointer events. */}
      {barsHidden && (
        <>
          <div
            className="absolute top-0 left-0 right-0 h-12 z-10"
            onMouseEnter={pokeControls}
            onMouseMove={pokeControls}
            aria-hidden="true"
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-20 z-10"
            onMouseEnter={pokeControls}
            onMouseMove={pokeControls}
            aria-hidden="true"
          />
        </>
      )}

      {/* Bottom control bar — VLC-style. Overlays + slides in fullscreen. */}
      <div
        className={`bg-gray-900 text-white flex items-center h-14 px-2 sm:px-3 gap-1.5 sm:gap-2 z-20 transition-all duration-300 ${
          isFullscreen ? 'absolute bottom-0 left-0 right-0' : 'flex-shrink-0'
        } ${barsHidden ? 'translate-y-full opacity-0 pointer-events-none' : 'translate-y-0'}`}
      >
        {chapter.isMockExam ? (
          <>
            {/* Exam mode: slide nav + finish */}
            <button onClick={retreatSlideInIframe} className="p-2 rounded-lg hover:bg-white/10 transition-colors" title="Previous (←)">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-white/50 tabular-nums w-14 text-center">
              {currentSlideNum}/{totalSlidesNum || '—'}
            </span>
            <button onClick={advanceSlideInIframe} className="p-2 rounded-lg hover:bg-white/10 transition-colors" title="Next (→)">
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="flex-1" />
          </>
        ) : isNewAudioPattern ? (
          <>
            <ChapterAudioControls
              key={chapter.id}
              ref={audioControlsRef}
              chapterAudio={chapter.chapterAudio!}
              chapterCues={chapter.chapterCues}
              iframeRef={iframeRef}
              totalSlides={totalSlidesNum}
              resumeKey={`${courseId}:${chapter.id}`}
              onEnded={handleAudioEnded}
            />
            <div className="w-px h-6 bg-white/15 flex-shrink-0 hidden sm:block" />
            {/* Slide nav stays visible on phones — touch users have no arrow keys */}
            <div className="flex items-center flex-shrink-0">
              <button onClick={retreatSlideInIframe} className="p-1.5 rounded hover:bg-white/10 transition-colors" title="Previous slide (←)" aria-label="Previous slide">
                <ChevronLeft className="w-4 h-4 text-white/70" />
              </button>
              <span className="text-[11px] text-white/50 tabular-nums w-10 sm:w-12 text-center">
                {currentSlideNum}/{totalSlidesNum || '—'}
              </span>
              <button onClick={advanceSlideInIframe} className="p-1.5 rounded hover:bg-white/10 transition-colors" title="Next slide (→)" aria-label="Next slide">
                <ChevronRight className="w-4 h-4 text-white/70" />
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Legacy per-slide audio */}
            <button onClick={retreatSlideInIframe} className="p-2 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0" title="Previous slide (←)">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-white/50 tabular-nums w-14 text-center flex-shrink-0">
              {currentSlideNum}/{totalSlidesNum || '—'}
            </span>
            <button onClick={advanceSlideInIframe} className="p-2 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0" title="Next slide (→)">
              <ChevronRight className="w-4 h-4" />
            </button>
            {chapter.audioDir && (
              <AudioPlayer
                audioDir={chapter.audioDir}
                currentSlide={currentSlideNum}
                totalSlides={totalSlidesNum}
                stepsInSlide={stepsInSlide}
                currentStepInSlide={currentStepInSlide}
                onSlideAudioEnd={advanceSlideInIframe}
                onAdvanceStep={advanceStepInIframe}
                onResetSteps={resetStepsInIframe}
                onRevealAllSteps={revealAllStepsInIframe}
              />
            )}
            {/* Chapter progress bar (legacy has no continuous timeline) */}
            <div className="relative flex-1 min-w-[60px] h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-primary-600 rounded-full transition-all duration-300"
                style={{ width: `${slidePercent}%` }}
              />
            </div>
          </>
        )}

        {/* Zoom */}
        <div className="hidden md:flex items-center gap-0.5 flex-shrink-0">
          <button
            onClick={() => handleZoomChange(zoomLevel - 5)}
            className="p-1.5 rounded hover:bg-white/10 transition-colors disabled:opacity-30"
            title="Zoom out"
            disabled={zoomLevel <= 50}
          >
            <ZoomOut className="w-3.5 h-3.5 text-white/60" />
          </button>
          <span className="text-[10px] text-white/40 w-8 text-center tabular-nums">{zoomLevel}%</span>
          <button
            onClick={() => handleZoomChange(zoomLevel + 5)}
            className="p-1.5 rounded hover:bg-white/10 transition-colors disabled:opacity-30"
            title="Zoom in"
            disabled={zoomLevel >= 125}
          >
            <ZoomIn className="w-3.5 h-3.5 text-white/60" />
          </button>
        </div>

        {/* Fullscreen */}
        <button
          onClick={toggleFullscreen}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 transition-colors flex-shrink-0"
          title={isFullscreen ? 'Exit full screen (F)' : 'Full screen (F)'}
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
          <span className="hidden lg:inline">{isFullscreen ? 'Exit' : 'Maximize'}</span>
        </button>

        {/* Next chapter */}
        {nextChapter && (
          <button
            onClick={() => swapChapter(nextChapter)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-primary-600 transition-all flex-shrink-0"
            title={`Next: ${nextChapter.title}`}
          >
            <span className="hidden sm:inline">Next</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
        {!nextChapter && prevChapter && (
          <button
            onClick={() => swapChapter(prevChapter)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
            title={`Previous: ${prevChapter.title}`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Course-complete celebration overlay (hosts the OTP certificate
          claim form when there is no legacy session) */}
      {showCelebration && (
        <CourseCompletionOverlay
          course={course}
          learnerName={session?.name}
          loading={celebrationLoading}
          certId={celebrationCertId}
          error={celebrationError}
          onClose={() => setShowCelebration(false)}
          claimCourseId={!isLoggedIn ? courseId : undefined}
          onCertClaimed={handleCertClaimed}
        />
      )}
    </div>
  )
}
