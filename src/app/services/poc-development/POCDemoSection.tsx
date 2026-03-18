'use client'

import { useState } from 'react'
import { Play, BarChart3, Zap, Shield } from 'lucide-react'
import Link from 'next/link'
import VideoModal from '@/components/VideoModal'
import { BLOB_URL } from '@/lib/site-config'

export default function POCDemoSection() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <section className="py-16 lg:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center rounded-full px-4 py-1.5 mb-4 text-xs font-medium bg-green-50 text-green-700">
            <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse" />
            Live Example
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            See a Real PoC in Action
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            This analytics dashboard was built as a working proof of concept — pulling live data from Azure into interactive visualizations, running at zero infrastructure cost.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Video */}
          <div
            className="relative rounded-xl overflow-hidden shadow-xl cursor-pointer group mb-8"
            onClick={() => setIsModalOpen(true)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="relative aspect-video bg-gray-900">
              <img
                src={`${BLOB_URL}/videos/poc-thumbnail.png`}
                alt="Analytics Dashboard POC Demo"
                className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${
                isHovered ? 'opacity-100' : 'opacity-40'
              }`} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`transform transition-all duration-300 ${
                  isHovered ? 'scale-110' : 'scale-100'
                }`}>
                  <div className="w-20 h-20 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-2xl group-hover:bg-white transition-colors">
                    <Play className="w-9 h-9 text-primary-600 ml-1" />
                  </div>
                </div>
              </div>
              <div className={`absolute bottom-4 left-0 right-0 text-center transition-all duration-300 ${
                isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}>
                <span className="text-white font-medium bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
                  Watch Full Demo
                </span>
              </div>
            </div>
          </div>

          {/* Quick highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 bg-white rounded-lg p-4 shadow-sm">
              <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600 flex-shrink-0">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Real-Time Analytics</p>
                <p className="text-gray-500 text-xs">Azure + Plotly visualizations</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white rounded-lg p-4 shadow-sm">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600 flex-shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">$0/month</p>
                <p className="text-gray-500 text-xs">Vercel free tier deployment</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white rounded-lg p-4 shadow-sm">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 flex-shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Secure Access</p>
                <p className="text-gray-500 text-xs">Password-protected dashboard</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link
              href="/poc"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors text-sm"
            >
              View Full POC Details
            </Link>
          </div>
        </div>
      </div>

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
