'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { Play, Pause, Maximize2, Minimize2, Volume2, VolumeX } from 'lucide-react'

const SPEEDS = [1, 1.1, 1.2, 1.25]

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
  const progressRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isHoveringProgress, setIsHoveringProgress] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [showSpeedMenu, setShowSpeedMenu] = useState(false)
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null)
  const speedMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  useEffect(() => {
    if (!showSpeedMenu) return
    const handler = (e: MouseEvent) => {
      if (speedMenuRef.current && !speedMenuRef.current.contains(e.target as Node)) {
        setShowSpeedMenu(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showSpeedMenu])

  const startPlayback = useCallback(async () => {
    const video = videoRef.current
    if (!video) return

    if (hasStarted) {
      if (isPlaying) {
        video.pause()
      } else {
        try { await video.play() } catch (e) { console.log('Play failed:', e) }
      }
      return
    }

    setIsLoading(true)
    setHasStarted(true)

    if (!video.src) {
      video.src = videoSrc
    }

    const tryPlay = () => {
      video.play()
        .then(() => setIsLoading(false))
        .catch((e) => {
          console.log('Play failed, retrying:', e)
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
        const el = container as any
        if (el.webkitRequestFullscreen) el.webkitRequestFullscreen()
      })
    }
  }, [])

  const toggleMute = () => {
    if (!videoRef.current) return
    const newMuted = !isMuted
    videoRef.current.muted = newMuted
    setIsMuted(newMuted)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value)
    if (videoRef.current) {
      videoRef.current.volume = val
      videoRef.current.muted = val === 0
      setVolume(val)
      setIsMuted(val === 0)
    }
  }

  const handleSpeedChange = (s: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = s
    }
    setSpeed(s)
    setShowSpeedMenu(false)
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !videoRef.current || !duration) return
    const rect = progressRef.current.getBoundingClientRect()
    const pos = (e.clientX - rect.left) / rect.width
    const time = pos * duration
    videoRef.current.currentTime = time
    setCurrentTime(time)
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

  const progress = duration ? (currentTime / duration) * 100 : 0

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${rounded} ${className} ${isFullscreen ? 'bg-black' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { isPlaying && setShowControls(false); setShowSpeedMenu(false) }}
    >
      <div className={`relative ${isFullscreen ? 'h-screen flex items-center justify-center' : 'aspect-video'} ${hasStarted ? 'bg-black' : 'bg-gray-50'}`}>
        {/* Thumbnail */}
        {!hasStarted && (
          <>
            <Image
              src={posterSrc}
              alt="Video thumbnail"
              fill
              className="object-cover"
              priority
            />
            <button
              onClick={startPlayback}
              className="absolute inset-0 z-10 flex items-center justify-center group cursor-pointer"
              type="button"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg group-hover:scale-105 group-hover:shadow-xl transition-all duration-300">
                <Play className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800 ml-0.5 fill-gray-800" />
              </div>
            </button>
          </>
        )}

        {/* Loading */}
        {isLoading && hasStarted && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30">
            <div className="w-10 h-10 border-3 border-white/80 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Video */}
        <video
          ref={videoRef}
          className={`w-full h-full object-contain ${!hasStarted ? 'opacity-0 absolute inset-0 pointer-events-none' : ''}`}
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
          onEnded={() => { setIsPlaying(false); setHasStarted(false); setCurrentTime(0); setSpeed(1) }}
        >
          Your browser does not support the video tag.
        </video>

        {/* Controls */}
        {hasStarted && (
          <div
            className={`absolute bottom-0 left-0 right-0 z-20 transition-all duration-300 ${
              showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
            }`}
          >
            {/* Progress bar */}
            <div
              ref={progressRef}
              className="px-3 cursor-pointer"
              onClick={handleProgressClick}
              onMouseEnter={() => setIsHoveringProgress(true)}
              onMouseLeave={() => setIsHoveringProgress(false)}
            >
              <div className={`w-full bg-white/25 transition-all duration-200 ${isHoveringProgress ? 'h-1.5' : 'h-1'} rounded-full overflow-hidden`}>
                <div
                  className="h-full bg-white rounded-full transition-[width] duration-100 ease-linear relative"
                  style={{ width: `${progress}%` }}
                >
                  {isHoveringProgress && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-sm" />
                  )}
                </div>
              </div>
            </div>

            {/* Controls bar */}
            <div className="flex items-center justify-between px-3 py-2.5 bg-gradient-to-t from-black/60 via-black/30 to-transparent">
              <div className="flex items-center gap-1.5">
                <button onClick={startPlayback} className="p-1.5 hover:bg-white/15 rounded-full transition-colors duration-200" type="button" aria-label={isPlaying ? 'Pause' : 'Play'}>
                  {isPlaying
                    ? <Pause className="w-4 h-4 text-white fill-white" />
                    : <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                  }
                </button>

                <div className="flex items-center group/vol">
                  <button onClick={toggleMute} className="p-1.5 hover:bg-white/15 rounded-full transition-colors duration-200" type="button" aria-label={isMuted ? 'Unmute' : 'Mute'}>
                    {isMuted || volume === 0
                      ? <VolumeX className="w-4 h-4 text-white" />
                      : <Volume2 className="w-4 h-4 text-white" />
                    }
                  </button>
                  <div className="w-0 overflow-hidden group-hover/vol:w-16 transition-all duration-300">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      aria-label="Volume"
                      className="w-14 h-1 ml-1 appearance-none bg-white/30 rounded-full cursor-pointer vol-slider"
                    />
                  </div>
                </div>

                <span className="text-white/80 text-[11px] font-medium tabular-nums ml-1 select-none">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Speed selector */}
                <div className="relative" ref={speedMenuRef}>
                  <button
                    onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                    className="px-2 py-1 hover:bg-white/15 rounded transition-colors duration-200 text-[11px] font-medium text-white/90 select-none"
                    type="button"
                    aria-label="Playback speed"
                  >
                    {speed === 1 ? '1x' : `${speed}x`}
                  </button>
                  {showSpeedMenu && (
                    <div className="absolute bottom-full right-0 mb-1.5 bg-black/85 backdrop-blur-md rounded-lg py-1 min-w-[72px] shadow-xl">
                      {SPEEDS.map((s) => (
                        <button
                          key={s}
                          onClick={() => handleSpeedChange(s)}
                          className={`block w-full text-left px-3 py-1.5 text-[11px] font-medium transition-colors duration-150 ${
                            speed === s ? 'text-white bg-white/15' : 'text-white/70 hover:text-white hover:bg-white/10'
                          }`}
                          type="button"
                        >
                          {s === 1 ? '1x' : `${s}x`}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button onClick={handleFullscreen} className="p-1.5 hover:bg-white/15 rounded-full transition-colors duration-200" type="button" aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
                  {isFullscreen
                    ? <Minimize2 className="w-4 h-4 text-white" />
                    : <Maximize2 className="w-4 h-4 text-white" />
                  }
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .vol-slider::-webkit-slider-thumb {
          appearance: none;
          width: 10px;
          height: 10px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
        }
        .vol-slider::-moz-range-thumb {
          width: 10px;
          height: 10px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  )
}
