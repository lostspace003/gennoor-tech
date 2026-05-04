'use client'

import { useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import { Play, Pause, Maximize2, Minimize2, Volume2, VolumeX } from 'lucide-react'

interface InlineVideoPlayerProps {
  videoSrc: string
  posterSrc: string
  className?: string
  rounded?: string
}

export default function InlineVideoPlayer({
  videoSrc,
  posterSrc,
  className = '',
  rounded = 'rounded-xl',
}: InlineVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null)

  const startPlayback = useCallback(async () => {
    const video = videoRef.current
    if (!video) return

    // If already loaded, just toggle
    if (hasStarted) {
      if (isPlaying) {
        video.pause()
      } else {
        try { await video.play() } catch (e) { console.log('Play failed:', e) }
      }
      return
    }

    // First play — load and start
    setIsLoading(true)
    setHasStarted(true)

    // Set src if not already set (lazy load)
    if (!video.src) {
      video.src = videoSrc
    }

    const tryPlay = () => {
      video.play()
        .then(() => setIsLoading(false))
        .catch((e) => {
          console.log('Play failed, retrying:', e)
          // Retry once after a small delay
          setTimeout(() => {
            video.play()
              .then(() => setIsLoading(false))
              .catch(() => setIsLoading(false))
          }, 300)
        })
    }

    if (video.readyState >= 2) {
      tryPlay()
    } else {
      video.addEventListener('canplay', tryPlay, { once: true })
      video.load()
    }
  }, [videoSrc, hasStarted, isPlaying])

  const handleFullscreen = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      container.requestFullscreen().catch(() => {
        // Fallback for Safari
        const el = container as any
        if (el.webkitRequestFullscreen) el.webkitRequestFullscreen()
      })
    }
  }, [])

  // Listen for fullscreen changes
  const handleFullscreenChange = useCallback(() => {
    setIsFullscreen(!!document.fullscreenElement)
  }, [])

  // Attach fullscreen listener
  if (typeof document !== 'undefined') {
    document.removeEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('fullscreenchange', handleFullscreenChange)
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    if (videoRef.current) {
      videoRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const handleMouseMove = () => {
    setShowControls(true)
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current)
    controlsTimeout.current = setTimeout(() => {
      if (isPlaying) setShowControls(false)
    }, 3000)
  }

  const handleVideoClick = () => {
    if (hasStarted) startPlayback()
  }

  const formatTime = (t: number) => {
    const m = Math.floor(t / 60)
    const s = Math.floor(t % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${rounded} ${className} ${isFullscreen ? 'bg-black' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <div className={`relative ${isFullscreen ? 'h-screen flex items-center justify-center' : 'aspect-video'} ${hasStarted ? 'bg-black' : 'bg-gray-100'}`}>
        {/* Thumbnail (shown before video starts) */}
        {!hasStarted && (
          <>
            <Image
              src={posterSrc}
              alt="Gennoor Tech introduction video thumbnail"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/10" />
            <button
              onClick={startPlayback}
              className="absolute inset-0 z-10 flex items-end justify-center pb-8 group cursor-pointer"
              type="button"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-white transition-all">
                <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-600 ml-0.5" />
              </div>
            </button>
          </>
        )}

        {/* Loading spinner */}
        {isLoading && hasStarted && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Video element */}
        <video
          ref={videoRef}
          className={`${isFullscreen ? 'w-full h-full object-contain' : 'w-full h-full object-contain'} ${!hasStarted ? 'opacity-0 absolute inset-0 pointer-events-none' : ''}`}
          poster={posterSrc}
          playsInline
          preload="none"
          muted={isMuted}
          onClick={handleVideoClick}
          onPlay={() => { setIsPlaying(true); setIsLoading(false) }}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={() => videoRef.current && setCurrentTime(videoRef.current.currentTime)}
          onLoadedMetadata={() => videoRef.current && setDuration(videoRef.current.duration)}
          onWaiting={() => setIsLoading(true)}
          onCanPlay={() => setIsLoading(false)}
          onEnded={() => { setIsPlaying(false); setHasStarted(false); setCurrentTime(0) }}
        >
          Your browser does not support the video tag.
        </video>

        {/* Center play overlay when paused after starting */}
        {hasStarted && !isPlaying && !isLoading && (
          <button
            onClick={startPlayback}
            className="absolute inset-0 z-10 flex items-end justify-center pb-8 bg-black/20"
            type="button"
          >
            <div className="w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
              <Play className="w-3.5 h-3.5 text-primary-600 ml-0.5" />
            </div>
          </button>
        )}

        {/* Controls bar */}
        {hasStarted && (
          <div
            className={`absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 to-transparent px-3 pb-3 pt-8 transition-opacity duration-300 ${
              showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Progress bar */}
            <input
              type="range"
              min="0"
              max={duration || 100}
              step="0.1"
              value={currentTime}
              onChange={handleSeek}
              aria-label="Seek video progress"
              className="w-full h-1.5 bg-white/30 rounded-full appearance-none cursor-pointer mb-2 video-seek"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.3) ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.3) 100%)`
              }}
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button onClick={startPlayback} className="p-1.5 hover:bg-white/20 rounded-full transition-colors" type="button" aria-label={isPlaying ? 'Pause video' : 'Play video'}>
                  {isPlaying ? <Pause className="w-4 h-4 text-white" aria-hidden="true" /> : <Play className="w-4 h-4 text-white" aria-hidden="true" />}
                </button>
                <button onClick={toggleMute} className="p-1.5 hover:bg-white/20 rounded-full transition-colors" type="button" aria-label={isMuted ? 'Unmute video' : 'Mute video'}>
                  {isMuted ? <VolumeX className="w-4 h-4 text-white" aria-hidden="true" /> : <Volume2 className="w-4 h-4 text-white" aria-hidden="true" />}
                </button>
                <span className="text-white text-xs ml-1">{formatTime(currentTime)} / {formatTime(duration)}</span>
              </div>
              <button onClick={handleFullscreen} className="p-1.5 hover:bg-white/20 rounded-full transition-colors" type="button" aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}>
                {isFullscreen ? <Minimize2 className="w-4 h-4 text-white" aria-hidden="true" /> : <Maximize2 className="w-4 h-4 text-white" aria-hidden="true" />}
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .video-seek::-webkit-slider-thumb {
          appearance: none;
          width: 14px;
          height: 14px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }
        .video-seek::-moz-range-thumb {
          width: 14px;
          height: 14px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }
      `}</style>
    </div>
  )
}
