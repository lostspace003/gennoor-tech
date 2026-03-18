'use client'

import Link from 'next/link'
import { ArrowRight, Play, Volume2, VolumeX, Sparkles } from 'lucide-react'
import { siteConfig, BLOB_URL } from '@/lib/site-config'
import { useEffect, useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import VideoModal from '@/components/VideoModal'

// Dynamically import the animated logo to avoid SSR issues
const GennoorLogo = dynamic(() => import('@/components/GennoorLogo'), {
  ssr: false,
  loading: () => <div className="h-[180px] w-[650px] animate-pulse bg-gray-200/10 rounded-lg" />
})

export default function HeroSection() {
  const [showContent, setShowContent] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    // Show content after logo animation starts
    const timer = setTimeout(() => setShowContent(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  const openVideoModal = () => {
    setIsModalOpen(true)
  }

  const closeVideoModal = () => {
    setIsModalOpen(false)
  }

  return (
    <section className="relative overflow-hidden min-h-screen flex items-center">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-teal-50" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500 opacity-10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-500 opacity-10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto">
          {/* Two column layout: Text left, Logo right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

            {/* Left Column - Text Content */}
            <div className="text-left">
              {/* Badge - Appears after logo animation */}
              <div
                className={`inline-flex items-center rounded-full px-3 py-1 mb-4 text-xs font-medium bg-primary-100 text-primary-700 transition-all duration-700 ${
                  showContent ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                }`}
              >
                <span className="flex h-1.5 w-1.5 rounded-full bg-primary-600 mr-2" />
                Microsoft Certified Trainer • 14+ Years Experience
              </div>

              {/* Main Headline */}
              <h1
                className={`text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 mb-4 transition-all duration-700 delay-300 ${
                  showContent ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                }`}
              >
                {siteConfig.hero.headline.split('—').map((part, index) => (
                  <span key={index}>
                    {index === 0 ? (
                      <>
                        {part.split('AI').map((text, i) => (
                          <span key={i}>
                            {text}
                            {i === 0 && <span className="gradient-text">AI</span>}
                          </span>
                        ))}
                      </>
                    ) : (
                      <>
                        <span className="block mt-1 text-xl sm:text-2xl lg:text-3xl text-gray-700">
                          — {part}
                        </span>
                      </>
                    )}
                  </span>
                ))}
              </h1>

              {/* Subheadline */}
              <p
                className={`text-base sm:text-lg text-gray-600 mb-6 max-w-2xl transition-all duration-700 delay-500 ${
                  showContent ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                }`}
              >
                {siteConfig.hero.subheadline}
              </p>

              {/* CTAs */}
              <div
                className={`flex flex-col sm:flex-row gap-3 transition-all duration-700 delay-700 ${
                  showContent ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                }`}
              >
                <Link
                  href={siteConfig.hero.cta1.href}
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors group"
                >
                  {siteConfig.hero.cta1.text}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href={siteConfig.hero.cta2.href}
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-md text-primary-600 bg-white border-2 border-primary-600 hover:bg-primary-50 transition-colors"
                >
                  {siteConfig.hero.cta2.text}
                </Link>
              </div>
            </div>

            {/* Right Column - Video and Animated Logo */}
            <div className="flex flex-col items-center lg:items-end">
              {/* Main container - responsive video container */}
              <div className="relative">
                {/* Video container - responsive with max width */}
                <div className="w-full sm:w-[480px] lg:w-[560px] max-w-full">
                  {/* Video Preview Thumbnail - 25% larger (640px × 360px) */}
                  <div
                    className={`relative transition-all duration-700 delay-500 mb-6 ${
                      showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                  >
                    {/* Video thumbnail with gradient border */}
                    <div
                      className="relative rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary-600 to-accent-600 p-1 cursor-pointer group"
                      onClick={openVideoModal}
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                    >
                      <div className="relative w-full h-full bg-gray-900 rounded-lg overflow-hidden">
                        {/* Video thumbnail image */}
                        <div className="relative aspect-video">
                          <img
                            src={`${BLOB_URL}/videos/intro-video-poster.jpg`}
                            alt="Gennoor Tech Introduction Video"
                            className="w-full h-full object-cover"
                          />

                          {/* Dark overlay on hover */}
                          <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
                            isHovered ? 'opacity-100' : 'opacity-0'
                          }`} />

                          {/* Play button overlay */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className={`transform transition-all duration-300 ${
                              isHovered ? 'scale-110' : 'scale-100'
                            }`}>
                              <div className="w-16 sm:w-20 h-16 sm:h-20 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-2xl group-hover:bg-white transition-colors">
                                <Play className="w-6 sm:w-8 h-6 sm:h-8 text-gray-900 ml-0.5 sm:ml-1" />
                              </div>
                            </div>
                          </div>

                          {/* "Click to Watch" text */}
                          <div className={`absolute bottom-4 left-0 right-0 text-center transition-all duration-300 ${
                            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                          }`}>
                            <span className="text-white font-medium text-sm sm:text-base bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-sm">
                              Click to Watch Full Video
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* POC Link */}
                  <div
                    className={`transition-all duration-700 delay-700 mb-4 ${
                      showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                  >
                    <Link
                      href="/services/poc-development#live-demo"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 border border-primary-200 transition-colors group"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>See our latest PoC in action</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>

                  {/* Animated Logo - Aligned to video's left edge */}
                  <div className="relative h-[180px]">
                    {/* Logo positioned to align with video's left edge */}
                    <div className="absolute left-0 top-0 w-[650px]">
                      {/* Shift logo left by 30px to align first dot with video edge */}
                      <div className="relative -translate-x-[30px] scale-90">
                        {/* Glow effect centered on the dots */}
                        <div className="absolute left-[25px] top-[35px] w-[100px] h-[100px] bg-primary-600/20 rounded-full blur-3xl"></div>
                        {/* Extended glow across the logo */}
                        <div className="absolute left-[100px] top-[15px] w-[500px] h-[150px] bg-gradient-to-r from-primary-500/10 via-secondary-500/8 to-transparent blur-2xl"></div>
                        {/* The animated logo */}
                        <GennoorLogo
                          variant="horizontal"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal
        isOpen={isModalOpen}
        onClose={closeVideoModal}
        videoSrc={`${BLOB_URL}/videos/gennoor-intro-video.mp4`}
        posterSrc={`${BLOB_URL}/videos/intro-video-poster.jpg`}
        enableSlidePause={false}
      />
    </section>
  )
}