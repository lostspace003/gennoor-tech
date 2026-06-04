'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, SkipBack, SkipForward, PanelLeftClose, PanelLeftOpen, X, User, LogOut, ZoomIn, ZoomOut, Maximize, Minimize2, Lock, CheckCircle } from 'lucide-react'
import type { Chapter } from '@/config/courses'
import { courses as allCourses } from '@/config/courses'
import { saveLocalProgress, getLocalProgress, getAllLocalProgress } from '@/lib/progress-store'
import { useLearnerAuth } from '@/hooks/useLearnerAuth'
import SaveProgressModal from './SaveProgressModal'
import LearnerAuthModal from './LearnerAuthModal'
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

export default function ChapterViewer({ courseId, chapter, prevChapter, nextChapter, allChapters }: ChapterViewerProps) {
  const router = useRouter()
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [slideInfo, setSlideInfo] = useState('')
  const [slidePercent, setSlidePercent] = useState(0)
  const [currentSlideNum, setCurrentSlideNum] = useState(1)
  const [totalSlidesNum, setTotalSlidesNum] = useState(0)
  const [stepsInSlide, setStepsInSlide] = useState(0)
  const [currentStepInSlide, setCurrentStepInSlide] = useState(0)
  const [showSaveBanner, setShowSaveBanner] = useState(false)
  const [bannerDismissed, setBannerDismissed] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(100)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showWelcomeToast, setShowWelcomeToast] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationCertId, setCelebrationCertId] = useState<string | null>(null)
  const [celebrationLoading, setCelebrationLoading] = useState(false)
  const [celebrationError, setCelebrationError] = useState<string | null>(null)
  const { session, isLoggedIn, loading: authLoading, logout, refreshSession } = useLearnerAuth()
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const celebrationTriggeredRef = useRef(false)

  const requiresLogin = !chapter.isFree && !isLoggedIn && !authLoading

  // Look up the course (for theme + chapter-count context in onboarding)
  const course = useMemo(() => allCourses.find(c => c.id === courseId), [courseId])
  const theme = course?.theme
  const totalChapterCount = course?.chapters.length ?? allChapters.length
  const freeChapterCount = course?.chapters.filter(c => c.isFree).length ?? 0

  // Inline themed style helpers (theme may be undefined for AB-100)
  const themedBg = theme ? { background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryDeep} 100%)` } : undefined
  const themedAccentText = theme ? { color: theme.primaryDeep } : undefined
  const themedTint = theme ? { backgroundColor: theme.tint } : undefined

  // Debounced server sync for logged-in users
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

  // Listen for postMessage from injected tracking script in iframe
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
        if (nextChapter) {
          router.push(`/ai-academy/${courseId}/${nextChapter.slug}`)
        }
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [courseId, syncToServer, chapter.id, nextChapter, isLoggedIn, router])

  // Show save banner for non-logged-in users who have progress.
  // Wait for auth check to resolve — otherwise the banner flashes for
  // signed-in users during the initial /api/learner/session round-trip.
  useEffect(() => {
    if (authLoading || isLoggedIn || bannerDismissed) return
    const progress = getLocalProgress(courseId)
    if (!progress) return
    const chaptersWithProgress = Object.values(progress.chapters).filter(
      ch => ch.completionPercent > 0 && ch.chapterId !== 'chapter-00'
    )
    if (chaptersWithProgress.length > 0) {
      setShowSaveBanner(true)
    }
  }, [courseId, authLoading, isLoggedIn, bannerDismissed, slidePercent])

  // beforeunload for non-logged-in users with progress
  useEffect(() => {
    if (authLoading || isLoggedIn || bannerDismissed) return
    const progress = getLocalProgress(courseId)
    const hasProgress = progress && Object.values(progress.chapters).some(ch => ch.completionPercent > 0 && ch.chapterId !== 'chapter-00')
    if (!hasProgress) return

    const handler = (e: BeforeUnloadEvent) => { e.preventDefault() }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [courseId, authLoading, isLoggedIn, bannerDismissed, slidePercent])

  // Detect course completion — last regular (non-mock-exam) chapter at 99%+
  // for a logged-in user. Triggers cert issuance + celebration overlay once
  // per course (localStorage flag prevents re-firing on revisit).
  const isLastRegularChapter = useMemo(() => {
    if (!course) return false
    const regulars = course.chapters.filter(ch => !ch.isMockExam && ch.id !== 'chapter-00')
    return regulars.length > 0 && regulars[regulars.length - 1].id === chapter.id
  }, [course, chapter.id])

  // Mirror the server-side gate: every non-mock, non-intro chapter must be
  // completed before the celebration overlay can fire. Prevents the overlay
  // opening, calling issue-cert, and showing a 403 error to learners who
  // jumped to the last chapter.
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
    if (!isLoggedIn || !isLastRegularChapter) return
    if (slidePercent < 99) return
    if (!allPriorChaptersCompleted) return
    if (celebrationTriggeredRef.current) return
    if (typeof window !== 'undefined' && window.localStorage.getItem(celebrationStorageKey)) {
      // Already celebrated this course on this device — try to fetch existing cert silently
      celebrationTriggeredRef.current = true
      fetch(`/api/learner/courses/${courseId}/issue-cert`)
        .then(r => (r.ok ? r.json() : null))
        .then(data => {
          if (data?.cert?.certId) setCelebrationCertId(data.cert.certId)
        })
        .catch(() => { /* silent */ })
      return
    }

    celebrationTriggeredRef.current = true
    setShowCelebration(true)
    setCelebrationLoading(true)
    setCelebrationError(null)

    // Force-flush the progress sync first. The 5s syncToServer debounce can
    // mean the server hasn't yet seen completed:true on this chapter, which
    // would make the issue-cert API's completion gate reject the request.
    // Cancel any pending debounced sync and POST the final completion state
    // synchronously, then call issue-cert.
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current)
      syncTimeoutRef.current = null
    }

    const issuanceFlow = async () => {
      try {
        // 1. Synchronously confirm completion to the server.
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

        // 2. Now request cert issuance — server gate will see completion.
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
  }, [isLoggedIn, isLastRegularChapter, slidePercent, courseId, celebrationStorageKey, chapter.id, currentSlideNum, totalSlidesNum])

  const handleLoginSuccess = useCallback(async () => {
    await refreshSession()
    // Sync localStorage to server
    const allProgress = getAllLocalProgress()
    if (Object.keys(allProgress).length > 0) {
      try {
        await fetch('/api/learner/progress/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ progress: allProgress }),
        })
      } catch { /* silent */ }
    }
    setShowSaveBanner(false)
    setShowAuthModal(false)
    // Show post-login welcome toast — auto-dismiss after ~5s
    setShowWelcomeToast(true)
    setTimeout(() => setShowWelcomeToast(false), 5000)
  }, [refreshSession])

  const progressChapterCount = useMemo(() => {
    const progress = getLocalProgress(courseId)
    if (!progress) return 0
    return Object.values(progress.chapters).filter(ch => ch.completionPercent > 0).length
  }, [courseId, slidePercent])

  // Ref to the parent-level audio player — used so any nav button (parent
  // toolbar OR in-iframe step controls) can seek the audio to the matching
  // cue. Bidirectional sync.
  const audioControlsRef = useRef<ChapterAudioControlsHandle | null>(null)

  const postToIframe = useCallback((type: string) => {
    try {
      iframeRef.current?.contentWindow?.postMessage({ type }, '*')
    } catch { /* cross-origin */ }
  }, [])

  // Slide / step nav — branches on whether this chapter uses the new
  // chapterAudio pattern. New chapters: drive everything through the audio
  // (audio is single source of truth). Legacy chapters: existing per-slide
  // MP3 message protocol.
  const isNewAudioPattern = !!chapter.chapterAudio

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

  const retreatStepInIframe = useCallback(() => {
    if (isNewAudioPattern && audioControlsRef.current) {
      audioControlsRef.current.step('prev-step')
    }
  }, [isNewAudioPattern])

  // Listen for nav events posted UP from the iframe (its in-iframe step
  // controls). These come with the slide+step the iframe just navigated to —
  // the parent's job is to seek the audio so it follows.
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

  // Arrow-key intent forwarded from inside the iframe (the iframe's own
  // ArrowRight/ArrowLeft handler would otherwise update only the muted
  // iframe-internal audio, leaving the parent's audio stuck on slide 1).
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (!e || !e.data || e.data.type !== 'gennoor-academy:nav-request') return
      if (e.data.dir === 'next') advanceSlideInIframe()
      else if (e.data.dir === 'prev') retreatSlideInIframe()
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [advanceSlideInIframe, retreatSlideInIframe])

  // Parent-side keyboard: ArrowRight/ArrowLeft for slide-level navigation,
  // Space for play/pause (new audio pattern only — legacy AudioPlayer has its
  // own Space handler).
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
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [advanceSlideInIframe, retreatSlideInIframe, isNewAudioPattern])

  // Space pressed INSIDE the iframe — iframe's injected handler posts a
  // play-toggle message up; parent calls togglePlay so audio responds.
  useEffect(() => {
    if (!isNewAudioPattern) return
    const handler = (e: MessageEvent) => {
      if (!e || !e.data || e.data.type !== 'gennoor-academy:play-toggle') return
      audioControlsRef.current?.togglePlay()
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [isNewAudioPattern])

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
    if (!containerRef.current) return
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      containerRef.current.requestFullscreen()
    }
  }, [])

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  // Inject tracking script + zoom into iframe on load
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
              var slide = document.querySelector('.slide.active');
              if (slide) {
                slide.querySelectorAll('[data-step].revealed').forEach(function(s) { s.classList.remove('revealed'); });
              }
              if (prevBtn) prevBtn.click();
              setTimeout(function() { reportProgress(); }, 150);
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
            if (!isNav && !isSpace) return;
            var tag = (e.target && e.target.tagName) || '';
            if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
            // Space inside a button/anchor should still activate it.
            if (isSpace && (tag === 'BUTTON' || tag === 'A')) return;
            e.stopImmediatePropagation();
            e.preventDefault();
            if (isSpace) {
              try {
                window.parent.postMessage({ type: 'gennoor-academy:play-toggle' }, '*');
              } catch (err) {}
              return;
            }
            var dir = (e.key === 'ArrowRight' || e.key === 'PageDown') ? 'next' : 'prev';
            try {
              window.parent.postMessage(
                { type: 'gennoor-academy:nav-request', dir: dir },
                '*'
              );
            } catch (err) {}
          }, true);

          // After the iframe's own message handler applies a cue, run again
          // and fully reveal the active slide when the cue is user-driven.
          // Iframe's applyCue with fillSlide=false strips reveals on slide
          // change; for manual navigation we want the whole slide visible
          // immediately so the user does not stare at a bare heading.
          window.addEventListener('message', function(e) {
            if (!e || !e.data) return;
            if (e.data.type !== 'gennoor-academy:cue') return;
            if (!e.data.userDriven) return;
            // Defer so the iframe's PLAYER_JS handler (which switches the
            // .active slide) has already run by the time we reveal.
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
    } catch {
      // Cross-origin or sandboxing may prevent access — fail silently
    }
  }, [chapter.id, zoomLevel])

  const regularChapters = allChapters.filter(ch => !ch.isMockExam)
  const mockExam = allChapters.find(ch => ch.isMockExam)

  return (
    <div ref={containerRef} className="fixed inset-0 z-40 bg-gray-100 flex flex-col" style={{ top: isFullscreen ? 0 : '80px' }}>
      {/* Top navigation bar */}
      <div className="flex-shrink-0 h-14 bg-[#0C1426] text-white flex items-center px-4 gap-3 z-10">
        {/* Back */}
        <Link
          href={`/ai-academy/${courseId}`}
          className="flex items-center gap-1 text-sm text-white/70 hover:text-white transition-colors flex-shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Course</span>
        </Link>

        <div className="w-px h-6 bg-white/20" />

        {/* Sidebar toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded hover:bg-white/10 transition-colors flex-shrink-0"
          title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
        </button>

        {/* Chapter title */}
        <div className="flex-1 min-w-0 text-center">
          <span className="text-xs text-white/50 mr-2">
            {chapter.isMockExam ? 'EXAM' : `CH ${String(chapter.number).padStart(2, '0')}`}
          </span>
          <span className="text-sm font-medium truncate">{chapter.title}</span>
          {slideInfo && (
            <span className="ml-3 text-xs text-white/40">{slideInfo}</span>
          )}
        </div>

        {/* Slide navigation */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={retreatSlideInIframe}
            className="p-1.5 rounded hover:bg-white/10 transition-colors"
            title="Previous slide (←)"
            disabled={currentSlideNum <= 1}
          >
            <SkipBack className={`w-4 h-4 ${currentSlideNum <= 1 ? 'text-white/20' : 'text-white/70'}`} />
          </button>
          <span className="text-xs text-white/50 w-12 text-center tabular-nums">
            {currentSlideNum}/{totalSlidesNum || '—'}
          </span>
          <button
            onClick={advanceSlideInIframe}
            className="p-1.5 rounded hover:bg-white/10 transition-colors"
            title="Next slide (→)"
            disabled={currentSlideNum >= totalSlidesNum}
          >
            <SkipForward className={`w-4 h-4 ${currentSlideNum >= totalSlidesNum ? 'text-white/20' : 'text-white/70'}`} />
          </button>
        </div>

        {/* Audio player — legacy per-slide MP3 pattern */}
        {chapter.audioDir && !chapter.chapterAudio && (
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

        {/* Audio player — new timestamp-fire pattern (one MP3 + cues per chapter) */}
        {chapter.chapterAudio && (
          <ChapterAudioControls
            ref={audioControlsRef}
            chapterAudio={chapter.chapterAudio}
            chapterCues={chapter.chapterCues}
            iframeRef={iframeRef}
            totalSlides={totalSlidesNum}
            resumeKey={`${courseId}:${chapter.id}`}
          />
        )}

        {/* F11 tip */}
        {!isFullscreen && (
          <span className="text-[10px] text-white/40 hidden lg:inline flex-shrink-0">
            Press <kbd className="px-1 py-0.5 bg-white/10 rounded text-[9px] font-bold text-white/60">F11</kbd> for Full Screen
          </span>
        )}

        {/* Zoom controls */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => handleZoomChange(zoomLevel - 5)}
            className="p-1 rounded hover:bg-white/10 transition-colors"
            title="Zoom out"
            disabled={zoomLevel <= 50}
          >
            <ZoomOut className="w-3.5 h-3.5 text-white/60" />
          </button>
          <input
            type="range"
            min={50}
            max={125}
            step={5}
            value={zoomLevel}
            onChange={(e) => handleZoomChange(Number(e.target.value))}
            className="w-16 h-1 accent-accent-400 cursor-pointer"
            title={`Zoom: ${zoomLevel}%`}
          />
          <button
            onClick={() => handleZoomChange(zoomLevel + 5)}
            className="p-1 rounded hover:bg-white/10 transition-colors"
            title="Zoom in"
            disabled={zoomLevel >= 125}
          >
            <ZoomIn className="w-3.5 h-3.5 text-white/60" />
          </button>
          <span className="text-[10px] text-white/40 w-8 text-center">{zoomLevel}%</span>
        </div>

        {/* Fullscreen toggle */}
        <button
          onClick={toggleFullscreen}
          className="p-1.5 rounded hover:bg-white/10 transition-colors flex-shrink-0"
          title={isFullscreen ? 'Exit fullscreen (Esc)' : 'Enter fullscreen'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4 text-white/70" /> : <Maximize className="w-4 h-4 text-white/70" />}
        </button>

        {/* Prev / Next */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {prevChapter ? (
            <Link
              href={`/ai-academy/${courseId}/${prevChapter.slug}`}
              className="p-1.5 rounded hover:bg-white/10 transition-colors"
              title={`Previous: ${prevChapter.title}`}
            >
              <ChevronLeft className="w-4 h-4" />
            </Link>
          ) : (
            <span className="p-1.5 opacity-30"><ChevronLeft className="w-4 h-4" /></span>
          )}
          {nextChapter ? (
            chapter.isFree && !authLoading && !isLoggedIn && !nextChapter.isFree ? (
              <button
                onClick={() => setShowAuthModal(true)}
                className="p-1.5 rounded hover:bg-white/10 transition-colors"
                title="Sign in to access next chapter"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <Link
                href={`/ai-academy/${courseId}/${nextChapter.slug}`}
                className="p-1.5 rounded hover:bg-white/10 transition-colors"
                title={`Next: ${nextChapter.title}`}
              >
                <ChevronRight className="w-4 h-4" />
              </Link>
            )
          ) : (
            <span className="p-1.5 opacity-30"><ChevronRight className="w-4 h-4" /></span>
          )}
        </div>

        <div className="w-px h-6 bg-white/20" />

        {/* User badge or sign-in. Render a skeleton while the session
            check is in flight — otherwise the Sign In button flashes for
            users who are already signed in. */}
        {authLoading ? (
          <div className="flex items-center gap-2 flex-shrink-0" aria-hidden>
            <div className="w-7 h-7 rounded-full bg-white/10 animate-pulse" />
          </div>
        ) : isLoggedIn && session ? (
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-7 h-7 rounded-full bg-accent-600 flex items-center justify-center text-xs font-bold">
              {session.name.charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:inline text-xs text-white/70 max-w-[100px] truncate">{session.name}</span>
            <button onClick={logout} className="p-1 rounded hover:bg-white/10" title="Sign out">
              <LogOut className="w-3.5 h-3.5 text-white/50" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAuthModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white/10 hover:bg-white/20 rounded-full transition-colors flex-shrink-0"
          >
            <User className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign In</span>
          </button>
        )}
      </div>

      {/* Slide progress bar */}
      <div className="flex-shrink-0 h-1 bg-gray-200 group hover:h-1.5 transition-all">
        <div
          className="h-full bg-primary-500 transition-all duration-300"
          style={{ width: `${slidePercent}%` }}
        />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && (
          <>
            {/* Mobile overlay */}
            <div
              className="lg:hidden fixed inset-0 bg-black/40 z-20"
              style={{ top: 'calc(80px + 56px + 4px)' }}
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="absolute lg:relative z-30 w-72 h-full bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0 shadow-lg lg:shadow-none">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Chapters</h3>
                  <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 hover:bg-gray-100 rounded">
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
                <nav className="space-y-1">
                  {regularChapters.map(ch => {
                    const isActive = ch.id === chapter.id
                    return (
                      <Link
                        key={ch.id}
                        href={`/ai-academy/${courseId}/${ch.slug}`}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                          isActive
                            ? 'bg-primary-50 text-primary-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                          isActive ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {String(ch.number).padStart(2, '0')}
                        </span>
                        <span className="truncate">{ch.title}</span>
                      </Link>
                    )
                  })}
                  {mockExam && (
                    <>
                      <div className="pt-2 mt-2 border-t border-gray-100">
                        <Link
                          href={`/ai-academy/${courseId}/${mockExam.slug}`}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                            mockExam.id === chapter.id
                              ? 'bg-secondary-50 text-secondary-700 font-medium'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          <span className="w-7 h-7 rounded-lg bg-secondary-100 text-secondary-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                            EX
                          </span>
                          <span className="truncate">{mockExam.title}</span>
                        </Link>
                      </div>
                    </>
                  )}
                </nav>
              </div>
            </aside>
          </>
        )}

        {/* iframe or login gate */}
        <div className="flex-1 min-w-0 relative">
          {requiresLogin ? (
            <div className="absolute inset-0 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="min-h-full flex items-center justify-center py-12 px-6">
                <div className="max-w-lg w-full">
                  {/* Themed lock badge */}
                  <div
                    className="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center shadow-lg"
                    style={themedBg}
                  >
                    <Lock className="w-8 h-8 text-white" />
                  </div>

                  {/* Course context */}
                  {course && (
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 text-center mb-2">
                      {course.shortTitle} · Chapter {chapter.number} of {totalChapterCount}
                    </p>
                  )}

                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-3 font-heading">
                    You&apos;ve finished the free chapters
                  </h2>
                  <p className="text-gray-500 text-center mb-6 leading-relaxed">
                    {freeChapterCount > 0
                      ? `The first ${freeChapterCount} chapter${freeChapterCount > 1 ? 's are' : ' is'} free — sign in (10 seconds) to unlock the rest and continue from where you left off.`
                      : 'Sign in (takes 10 seconds) to unlock all chapters and track progress across devices.'}
                  </p>

                  {/* Value stack — three concrete items */}
                  <div className="bg-white rounded-xl ring-1 ring-gray-200 p-5 mb-6 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={themedTint}>
                        <CheckCircle className="w-4 h-4" style={themedAccentText} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Unlock all {totalChapterCount} chapters</p>
                        <p className="text-xs text-gray-500 mt-0.5">Including the capstone — your one-page roadmap or production-grade artifact.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={themedTint}>
                        <CheckCircle className="w-4 h-4" style={themedAccentText} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Progress synced across devices</p>
                        <p className="text-xs text-gray-500 mt-0.5">Resume from this exact slide on your phone, laptop, or tablet.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={themedTint}>
                        <CheckCircle className="w-4 h-4" style={themedAccentText} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Free forever · no credit card</p>
                        <p className="text-xs text-gray-500 mt-0.5">All courses stay free. No upsells. We don&apos;t share your email.</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
                    style={themedBg}
                  >
                    <User className="w-4 h-4" />
                    Sign in to continue
                  </button>
                  <p className="text-xs text-gray-400 text-center mt-3">
                    Google · Microsoft · or email — pick any.
                  </p>

                  <div className="mt-5 text-center">
                    <Link
                      href={`/ai-academy/${courseId}`}
                      className="text-sm text-gray-500 hover:text-gray-700 font-medium"
                    >
                      ← Back to course overview
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <iframe
              ref={iframeRef}
              src={`/api/content${chapter.htmlFile}`}
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin"
              title={chapter.title}
              onLoad={handleIframeLoad}
            />
          )}
        </div>
      </div>

      {/* Chapter complete / next chapter bar */}
      {nextChapter && slidePercent >= 90 && (
        <div
          className={`flex-shrink-0 text-white px-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in ${
            slidePercent >= 99 ? 'py-4' : 'py-3'
          } ${theme ? '' : (slidePercent >= 99 ? 'bg-gradient-to-r from-primary-800 to-primary-900' : 'bg-primary-900')}`}
          style={theme ? (slidePercent >= 99 ? { background: `linear-gradient(90deg, ${theme.primaryDeep} 0%, ${theme.navy} 100%)` } : { backgroundColor: theme.navy }) : undefined}
        >
          {slidePercent >= 99 ? (
            <>
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-secondary-400 flex-shrink-0" />
                  <span className="text-sm font-medium truncate">
                    Chapter complete! Up next: <span className="text-secondary-300">{nextChapter.title}</span>
                  </span>
                </div>
                {chapter.isFree && !authLoading && !isLoggedIn && !nextChapter.isFree && (
                  <p className="text-xs text-white/60 pl-8">
                    Sign in (10s) to unlock chapter {nextChapter.number} and {totalChapterCount - (nextChapter.number - 1)} more · free forever · no card
                  </p>
                )}
              </div>
              {chapter.isFree && !authLoading && !isLoggedIn && !nextChapter.isFree ? (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-secondary-400 text-dark-900 text-sm font-bold rounded-lg hover:bg-secondary-300 transition-colors flex-shrink-0"
                >
                  <User className="w-4 h-4" />
                  Sign in to continue
                </button>
              ) : (
                <Link
                  href={`/ai-academy/${courseId}/${nextChapter.slug}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-secondary-400 text-dark-900 text-sm font-bold rounded-lg hover:bg-secondary-300 transition-colors flex-shrink-0"
                >
                  Next chapter
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </>
          ) : (
            <>
              <span className="text-sm text-white/80">
                Up next: <span className="font-medium text-white">{nextChapter.title}</span>
              </span>
              <Link
                href={`/ai-academy/${courseId}/${nextChapter.slug}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-400 text-dark-900 text-sm font-bold rounded-lg hover:bg-secondary-300 transition-colors flex-shrink-0"
              >
                Next chapter
                <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          )}
        </div>
      )}

      {/* Save progress banner for non-logged-in users. Suppressed while auth check is in flight. */}
      {showSaveBanner && !authLoading && !isLoggedIn && !bannerDismissed && (
        <SaveProgressModal
          isVisible={true}
          onDismiss={() => { setBannerDismissed(true); setShowSaveBanner(false) }}
          onLoginSuccess={handleLoginSuccess}
          completedChapters={progressChapterCount}
        />
      )}

      {/* Auth modal — contextual title/subtitle when triggered from paywall */}
      <LearnerAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={handleLoginSuccess}
        title={requiresLogin ? `Unlock the rest of ${course?.shortTitle ?? 'the course'}` : undefined}
        subtitle={requiresLogin ? 'Sign in to continue from chapter ' + chapter.number + ' and sync your progress across devices.' : undefined}
      />

      {/* Course-complete celebration overlay */}
      {showCelebration && (
        <CourseCompletionOverlay
          course={course}
          learnerName={session?.name}
          loading={celebrationLoading}
          certId={celebrationCertId}
          error={celebrationError}
          onClose={() => setShowCelebration(false)}
        />
      )}

      {/* Post-login welcome toast — themed, auto-dismiss */}
      {showWelcomeToast && session && (
        <div className="fixed bottom-6 right-6 z-[70] max-w-sm animate-slide-up">
          <div
            className="bg-white rounded-xl shadow-2xl ring-1 ring-gray-200 p-4 flex items-start gap-3"
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={themedBg}
            >
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900">Welcome, {session.name.split(' ')[0]}.</p>
              <p className="text-xs text-gray-500 mt-0.5">Your progress is now synced across devices.</p>
            </div>
            <button
              onClick={() => setShowWelcomeToast(false)}
              className="text-gray-300 hover:text-gray-500 flex-shrink-0"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
