'use client'

import { useState } from 'react'
import { ArrowRight, BarChart3, Shield, Zap } from 'lucide-react'
import InlineVideoPlayer from '@/components/InlineVideoPlayer'
import POCDetailModal from '@/components/POCDetailModal'
import { BLOB_URL } from '@/lib/site-config'

export default function POCShowcase() {
  const [detailOpen, setDetailOpen] = useState(false)

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
              <InlineVideoPlayer
                videoSrc={`${BLOB_URL}/videos/POC.mp4`}
                posterSrc={`${BLOB_URL}/videos/poc-thumbnail.png`}
                className="shadow-xl"
              />
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

              <button
                onClick={() => setDetailOpen(true)}
                className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors group mt-2"
              >
                View Full POC Details
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* POC Detail Modal */}
      <POCDetailModal isOpen={detailOpen} onClose={() => setDetailOpen(false)} />
    </section>
  )
}
