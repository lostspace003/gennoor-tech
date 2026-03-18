'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Play, ArrowRight, BarChart3, Shield, Zap } from 'lucide-react'
import VideoModal from '@/components/VideoModal'
import { BLOB_URL } from '@/lib/site-config'

export default function POCShowcase() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <section className="section-padding bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center rounded-full px-4 py-1.5 mb-4 text-xs font-medium bg-primary-50 text-primary-700">
              <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse" />
              Live Proof of Concept
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              See It in Action
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A fully functional analytics dashboard built on Azure — real data, real insights, zero cost infrastructure.
            </p>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
            {/* Video - takes 3 cols */}
            <div className="lg:col-span-3">
              <div
                className="relative rounded-xl overflow-hidden shadow-xl cursor-pointer group"
                onClick={() => setIsModalOpen(true)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <div className="relative aspect-video bg-gray-900">
                  <img
                    src={`${BLOB_URL}/videos/poc-thumbnail.png`}
                    alt="Analytics Dashboard POC"
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${
                    isHovered ? 'opacity-100' : 'opacity-40'
                  }`} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`transform transition-all duration-300 ${
                      isHovered ? 'scale-110' : 'scale-100'
                    }`}>
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-2xl group-hover:bg-white transition-colors">
                        <Play className="w-7 h-7 sm:w-8 sm:h-8 text-primary-600 ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <div className={`absolute bottom-4 left-0 right-0 text-center transition-all duration-300 ${
                    isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}>
                    <span className="text-white font-medium text-sm bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-sm">
                      Watch Demo
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Info - takes 2 cols */}
            <div className="lg:col-span-2 space-y-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600 flex-shrink-0">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">Real-Time Analytics</h3>
                  <p className="text-gray-600 text-sm">Live data from Azure Table Storage, Blob Storage & Application Insights</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600 flex-shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">Zero Cost Stack</h3>
                  <p className="text-gray-600 text-sm">Vercel free tier + serverless — enterprise analytics at $0/month</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 flex-shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">Secure & Private</h3>
                  <p className="text-gray-600 text-sm">Password-protected with httpOnly cookies — no public data exposure</p>
                </div>
              </div>

              <Link
                href="/services/poc-development#live-demo"
                className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors group mt-2"
              >
                View Full POC Details
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        videoSrc={`${BLOB_URL}/videos/POC.mp4`}
        posterSrc={`${BLOB_URL}/videos/poc-thumbnail.png`}
        enableSlidePause={false}
      />
    </section>
  )
}
