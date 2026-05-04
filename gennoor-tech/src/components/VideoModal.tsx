'use client'

import { useEffect, useRef, useState } from 'react'
import { X, Play, Pause, Volume2, VolumeX, Maximize2, Minimize2, SkipForward, Layers } from 'lucide-react'

interface VideoModalProps {
  isOpen: boolean
  onClose: () => void
  videoSrc: string
  posterSrc?: string
  enableSlidePause?: boolean
  slidePauseDuration?: number
  slideBreakpoints?: number[]
}

export default function VideoModal({
  isOpen,
  onClose,
  videoSrc,
  posterSrc,
  enableSlidePause = false,
  slidePauseDuration = 2000,
  slideBreakpoints = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60] // Default slide breakpoints in seconds
}: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [showControls, setShowControls] = useState(true)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [isPausedForSlide, setIsPausedForSlide] = useState(false)
  const [nextSlideIndex, setNextSlideIndex] = useState(0)
  const [showSlideNotification, setShowSlideNotification] = useState(false)
  const slidePauseTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isOpen && videoRef.current) {
      // Reset video state when modal opens
      videoRef.current.currentTime = 0
      setCurrentTime(0)
      setIsLoading(true)
      setNextSlideIndex(0)
      setIsPausedForSlide(false)
      setShowSlideNotification(false)

      // Start playing when modal opens
      setTimeout(() => {
        videoRef.current?.play().catch(err => {
          console.log('Playback failed:', err)
        })
      }, 100)
    } else if (!isOpen && videoRef.current) {
      // Pause and reset when modal closes
      videoRef.current.pause()
      videoRef.current.currentTime = 0
      setIsPlaying(false)
      setCurrentTime(0)
      setNextSlideIndex(0)
      setIsPausedForSlide(false)
      setShowSlideNotification(false)

      // Clear any slide pause timeouts
      if (slidePauseTimeoutRef.current) {
        clearTimeout(slidePauseTimeoutRef.current)
      }
    }
  }, [isOpen])

  useEffect(() => {
    // Hide controls after 3 seconds of no mouse movement
    const hideControls = () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
      controlsTimeoutRef.current = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false)
        }
      }, 3000)
    }

    if (showControls) {
      hideControls()
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [showControls, isPlaying])

  const handleMouseMove = () => {
    setShowControls(true)
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && modalRef.current) {
      modalRef.current.requestFullscreen()
      setIsFullscreen(true)
    } else if (document.exitFullscreen) {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime
      setCurrentTime(current)

      // Check for slide breakpoints
      if (enableSlidePause && slideBreakpoints && !isPausedForSlide) {
        const currentBreakpoint = slideBreakpoints[nextSlideIndex]

        if (currentBreakpoint && current >= currentBreakpoint && current < currentBreakpoint + 0.5) {
          // Pause at slide breakpoint
          videoRef.current.pause()
          setIsPausedForSlide(true)
          setShowSlideNotification(true)

          // Auto-resume after the pause duration
          slidePauseTimeoutRef.current = setTimeout(() => {
            if (videoRef.current) {
              videoRef.current.play()
              setIsPausedForSlide(false)
              setShowSlideNotification(false)
              setNextSlideIndex(prev => prev + 1)
            }
          }, slidePauseDuration)
        }
      }
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
      setIsLoading(false)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    if (videoRef.current) {
      videoRef.current.currentTime = time
      setCurrentTime(time)

      // Reset slide tracking when seeking
      if (enableSlidePause && slideBreakpoints) {
        const newSlideIndex = slideBreakpoints.findIndex(breakpoint => time < breakpoint)
        setNextSlideIndex(newSlideIndex === -1 ? slideBreakpoints.length : newSlideIndex)
        setIsPausedForSlide(false)
        setShowSlideNotification(false)

        // Clear any pending slide pause timeout
        if (slidePauseTimeoutRef.current) {
          clearTimeout(slidePauseTimeoutRef.current)
        }
      }
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const skipToNextSlide = () => {
    if (videoRef.current && enableSlidePause && slideBreakpoints) {
      const nextBreakpoint = slideBreakpoints[nextSlideIndex]
      if (nextBreakpoint) {
        videoRef.current.currentTime = nextBreakpoint + 0.1
        setIsPausedForSlide(false)
        setShowSlideNotification(false)
        if (slidePauseTimeoutRef.current) {
          clearTimeout(slidePauseTimeoutRef.current)
        }
      }
    }
  }

  const getCurrentSlide = () => {
    if (!enableSlidePause || !slideBreakpoints) return 0
    const currentSlide = slideBreakpoints.findIndex(breakpoint => currentTime < breakpoint)
    return currentSlide === -1 ? slideBreakpoints.length : currentSlide
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="relative w-full h-full max-w-7xl max-h-[90vh] mx-auto"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setShowControls(false)}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 z-50 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-all transform ${
            showControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
          }`}
          aria-label="Close video"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {/* Video container */}
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Loading spinner */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* Video element with sync fix */}
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            poster={posterSrc}
            muted={isMuted}
            playsInline
            preload="metadata"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onWaiting={() => setIsLoading(true)}
            onCanPlay={() => setIsLoading(false)}
          >
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Bottom-center play button overlay */}
          {!isPlaying && !isLoading && !isPausedForSlide && (
            <button
              onClick={togglePlay}
              className="absolute inset-0 flex items-end justify-center pb-24"
              aria-label="Play video"
            >
              <div className="w-32 h-32 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all transform hover:scale-110">
                <Play className="w-16 h-16 text-white ml-2" />
              </div>
            </button>
          )}

          {/* Slide transition notification */}
          {showSlideNotification && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40">
              <div className="bg-black/70 backdrop-blur-md px-8 py-4 rounded-lg animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-primary-500 rounded-full animate-bounce"></div>
                  <span className="text-white text-lg font-medium">Transitioning to next slide...</span>
                  <div className="w-3 h-3 bg-primary-500 rounded-full animate-bounce delay-100"></div>
                </div>
                <div className="mt-2 text-center text-gray-300 text-sm">
                  Slide {nextSlideIndex + 1} of {slideBreakpoints?.length || 0}
                </div>
              </div>
            </div>
          )}

          {/* Video controls */}
          <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 transition-all transform ${
            showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            {/* Progress bar */}
            <div className="mb-4">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                aria-label="Seek video progress"
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #2563EB 0%, #2563EB ${(currentTime / duration) * 100}%, #4B5563 ${(currentTime / duration) * 100}%, #4B5563 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-white mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Control buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Play/Pause */}
                <button
                  onClick={togglePlay}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 text-white" />
                  ) : (
                    <Play className="w-6 h-6 text-white" />
                  )}
                </button>

                {/* Volume */}
                <button
                  onClick={toggleMute}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? (
                    <VolumeX className="w-6 h-6 text-white" />
                  ) : (
                    <Volume2 className="w-6 h-6 text-white" />
                  )}
                </button>

                {/* Skip to next slide */}
                {enableSlidePause && nextSlideIndex < (slideBreakpoints?.length || 0) && (
                  <button
                    onClick={skipToNextSlide}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    aria-label="Skip to next slide"
                  >
                    <SkipForward className="w-6 h-6 text-white" />
                  </button>
                )}

                {/* Slide indicator */}
                {enableSlidePause && slideBreakpoints && (
                  <div className="flex items-center space-x-2 text-white">
                    <Layers className="w-5 h-5" />
                    <span className="text-sm font-medium">
                      Slide {getCurrentSlide() + 1} / {slideBreakpoints.length + 1}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4">
                {/* Fullscreen */}
                <button
                  onClick={toggleFullscreen}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-6 h-6 text-white" />
                  ) : (
                    <Maximize2 className="w-6 h-6 text-white" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          background: #2563EB;
          border-radius: 50%;
          cursor: pointer;
        }

        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: #2563EB;
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  )
}