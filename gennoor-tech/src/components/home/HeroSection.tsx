'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { siteConfig, BLOB_URL } from '@/lib/site-config'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import InlineVideoPlayer from '@/components/InlineVideoPlayer'

// Dynamically import the animated logo to avoid SSR issues
const GennoorLogo = dynamic(() => import('@/components/GennoorLogo'), {
  ssr: false,
  loading: () => <div className="h-[180px] w-[650px] animate-pulse bg-gray-200/10 rounded-lg" />
})

export default function HeroSection() {
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    // Show content after logo animation starts
    const timer = setTimeout(() => setShowContent(true), 2000)
    return () => clearTimeout(timer)
  }, [])

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

              {/* POC Link - Orange with sparkle */}
              <div
                className={`transition-all duration-700 delay-900 mt-5 ${
                  showContent ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                }`}
              >
                <Link
                  href="/services/poc-development#live-demo"
                  className="poc-sparkle-btn relative inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all group overflow-hidden"
                >
                  <span className="poc-shimmer absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0" />
                  <Sparkles className="w-4 h-4 relative poc-sparkle-icon" />
                  <span className="relative">See our latest PoC in action</span>
                  <ArrowRight className="w-4 h-4 relative group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Right Column - Video and Animated Logo */}
            <div className="flex flex-col items-center lg:items-end">
              {/* Main container - responsive video container */}
              <div className="relative">
                {/* Video container - responsive with max width */}
                <div className="w-full sm:w-[480px] lg:w-[560px] max-w-full">
                  {/* Inline Video Player */}
                  <div
                    className={`relative transition-all duration-700 delay-500 mb-6 ${
                      showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                  >
                    <div className="bg-gradient-to-br from-primary-600 to-accent-600 p-1 rounded-xl shadow-2xl">
                      <InlineVideoPlayer
                        videoSrc={`${BLOB_URL}/videos/gennoor-intro-video.mp4`}
                        posterSrc={`${BLOB_URL}/videos/video-thumbnail-bright.png`}
                        rounded="rounded-lg"
                      />
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sparkle animation styles */}
      <style jsx>{`
        .poc-shimmer {
          animation: shimmer 2.5s ease-in-out infinite;
        }
        .poc-sparkle-icon {
          animation: sparkle 1.5s ease-in-out infinite;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          50.01% { transform: translateX(-100%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes sparkle {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
          50% { transform: scale(1.2) rotate(15deg); opacity: 0.8; }
        }
      `}</style>
    </section>
  )
}
