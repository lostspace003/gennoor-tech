'use client'

import { useRef, useState } from 'react'
import { Play, Pause, Maximize2, Volume2, VolumeX } from 'lucide-react'

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
  const [showControls, setShowControls] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null)

  const handlePlay = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
      setHasStarted(true)
    }
  }

  const handleFullscreen = () => {
    if (!containerRef.current) return
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      containerRef.current.requestFullscreen()
    }
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

  const formatTime = (t: number) => {
    const m = Math.floor(t / 60)
    const s = Math.floor(t % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${rounded} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <div className="relative aspect-video bg-gray-900">
        {/* Thumbnail (shown before video starts) */}
        {!hasStarted && (
          <>
            <img
              src={posterSrc}
              alt="Video thumbnail"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30" />
            <button
              onClick={handlePlay}
              className="absolute inset-0 flex items-center justify-center group cursor-pointer"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-white transition-all">
                <Play className="w-7 h-7 sm:w-8 sm:h-8 text-primary-600 ml-0.5" />
              </div>
            </button>
          </>
        )}

        {/* Video element */}
        <video
          ref={videoRef}
          className={`w-full h-full object-contain ${!hasStarted ? 'opacity-0 absolute inset-0' : ''}`}
          poster={posterSrc}
          playsInline
          preload="metadata"
          muted={isMuted}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={() => videoRef.current && setCurrentTime(videoRef.current.currentTime)}
          onLoadedMetadata={() => videoRef.current && setDuration(videoRef.current.duration)}
          onEnded={() => { setIsPlaying(false); setHasStarted(false) }}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>

        {/* Center play/pause overlay when paused after starting */}
        {hasStarted && !isPlaying && (
          <button
            onClick={handlePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/20"
          >
            <div className="w-16 h-16 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl">
              <Play className="w-7 h-7 text-primary-600 ml-0.5" />
            </div>
          </button>
        )}

        {/* Controls bar */}
        {hasStarted && (
          <div
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-3 pb-3 pt-8 transition-opacity duration-300 ${
              showControls ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Progress bar */}
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-white/30 rounded-full appearance-none cursor-pointer mb-2"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.3) ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.3) 100%)`
              }}
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button onClick={handlePlay} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                  {isPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white" />}
                </button>
                <button onClick={toggleMute} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                  {isMuted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
                </button>
                <span className="text-white text-xs ml-1">{formatTime(currentTime)} / {formatTime(duration)}</span>
              </div>
              <button onClick={handleFullscreen} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                <Maximize2 className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
        }
        input[type="range"]::-moz-range-thumb {
          width: 12px;
          height: 12px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  )
}
