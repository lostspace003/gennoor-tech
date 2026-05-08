'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, PanelLeftClose, PanelLeftOpen, X, User, LogOut, ZoomIn, ZoomOut, Maximize, Minimize2, Lock } from 'lucide-react'
import type { Chapter } from '@/config/courses'
import { saveLocalProgress, getLocalProgress, getAllLocalProgress } from '@/lib/progress-store'
import { useLearnerAuth } from '@/hooks/useLearnerAuth'
import SaveProgressModal from './SaveProgressModal'
import LearnerAuthModal from './LearnerAuthModal'
import AudioPlayer from './AudioPlayer'

interface ChapterViewerProps {
  courseId: string
  chapter: Chapter
  prevChapter: Chapter | null
  nextChapter: Chapter | null
  allChapters: Chapter[]
}

export default function ChapterViewer({ courseId, chapter, prevChapter, nextChapter, allChapters }: ChapterViewerProps) {
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
  const [zoomLevel, setZoomLevel] = useState(75)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const { session, isLoggedIn, logout, refreshSession } = useLearnerAuth()
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const requiresLogin = !chapter.isFree && !isLoggedIn

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
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [courseId, syncToServer])

  // Show save banner for non-logged-in users who have progress
  useEffect(() => {
    if (isLoggedIn || bannerDismissed) return
    const progress = getLocalProgress(courseId)
    if (!progress) return
    const chaptersWithProgress = Object.values(progress.chapters).filter(
      ch => ch.completionPercent > 0 && ch.chapterId !== 'chapter-00'
    )
    if (chaptersWithProgress.length > 0) {
      setShowSaveBanner(true)
    }
  }, [courseId, isLoggedIn, bannerDismissed, slidePercent])

  // beforeunload for non-logged-in users with progress
  useEffect(() => {
    if (isLoggedIn || bannerDismissed) return
    const progress = getLocalProgress(courseId)
    const hasProgress = progress && Object.values(progress.chapters).some(ch => ch.completionPercent > 0 && ch.chapterId !== 'chapter-00')
    if (!hasProgress) return

    const handler = (e: BeforeUnloadEvent) => { e.preventDefault() }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [courseId, isLoggedIn, bannerDismissed, slidePercent])

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
  }, [refreshSession])

  const progressChapterCount = useMemo(() => {
    const progress = getLocalProgress(courseId)
    if (!progress) return 0
    return Object.values(progress.chapters).filter(ch => ch.completionPercent > 0).length
  }, [courseId, slidePercent])

  const postToIframe = useCallback((type: string) => {
    try {
      iframeRef.current?.contentWindow?.postMessage({ type }, '*')
    } catch { /* cross-origin */ }
  }, [])

  const advanceSlideInIframe = useCallback(() => postToIframe('gennoor-advance-slide'), [postToIframe])
  const advanceStepInIframe = useCallback(() => postToIframe('gennoor-advance-step'), [postToIframe])
  const resetStepsInIframe = useCallback(() => postToIframe('gennoor-reset-steps'), [postToIframe])
  const revealAllStepsInIframe = useCallback(() => postToIframe('gennoor-reveal-all-steps'), [postToIframe])
  const nextInIframe = useCallback(() => postToIframe('gennoor-next'), [postToIframe])
  const prevInIframe = useCallback(() => postToIframe('gennoor-prev'), [postToIframe])

  // Parent-side keyboard: ArrowRight/ArrowLeft for step+slide navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === 'Space') return
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

      if (e.key === 'ArrowRight') {
        e.preventDefault()
        nextInIframe()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prevInIframe()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [nextInIframe, prevInIframe])

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
            var counter = document.getElementById('counter');
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

            if (e.data.type === 'gennoor-next') {
              if (nextBtn) nextBtn.click();
              setTimeout(function() { reportProgress(); }, 100);
            }

            if (e.data.type === 'gennoor-prev') {
              if (prevBtn) prevBtn.click();
              setTimeout(function() { reportProgress(); }, 100);
            }
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

        {/* Audio player */}
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
            <Link
              href={`/ai-academy/${courseId}/${nextChapter.slug}`}
              className="p-1.5 rounded hover:bg-white/10 transition-colors"
              title={`Next: ${nextChapter.title}`}
            >
              <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <span className="p-1.5 opacity-30"><ChevronRight className="w-4 h-4" /></span>
          )}
        </div>

        <div className="w-px h-6 bg-white/20" />

        {/* User badge or sign-in */}
        {isLoggedIn && session ? (
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
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="text-center max-w-md px-6">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary-100 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-primary-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in to continue</h2>
                <p className="text-gray-500 mb-6">
                  Create a free account to access all chapters, track your progress, and earn your certification.
                </p>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white text-sm font-bold rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <User className="w-4 h-4" />
                  Sign In / Create Account
                </button>
                <div className="mt-4">
                  <Link
                    href={`/ai-academy/${courseId}`}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Back to course overview
                  </Link>
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

      {/* Next chapter bar (at bottom when chapter is near complete) */}
      {nextChapter && slidePercent >= 90 && (
        <div className="flex-shrink-0 bg-primary-900 text-white px-4 py-3 flex items-center justify-between animate-fade-in">
          <span className="text-sm text-white/80">
            Up next: <span className="font-medium text-white">{nextChapter.title}</span>
          </span>
          <Link
            href={`/ai-academy/${courseId}/${nextChapter.slug}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-400 text-dark-900 text-sm font-bold rounded-lg hover:bg-secondary-300 transition-colors"
          >
            Next Chapter
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Save progress banner for non-logged-in users */}
      {showSaveBanner && !isLoggedIn && !bannerDismissed && (
        <SaveProgressModal
          isVisible={true}
          onDismiss={() => { setBannerDismissed(true); setShowSaveBanner(false) }}
          onLoginSuccess={handleLoginSuccess}
          completedChapters={progressChapterCount}
        />
      )}

      {/* Auth modal */}
      <LearnerAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  )
}
