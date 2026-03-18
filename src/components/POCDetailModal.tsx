'use client'

import { X, BarChart3, Shield, Zap, Globe, Play } from 'lucide-react'
import { useState } from 'react'
import VideoModal from '@/components/VideoModal'
import { BLOB_URL } from '@/lib/site-config'

interface POCDetailModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function POCDetailModal({ isOpen, onClose }: POCDetailModalProps) {
  const [videoOpen, setVideoOpen] = useState(false)

  if (!isOpen) return null

  const highlights = [
    {
      icon: <BarChart3 className="w-5 h-5" />,
      title: 'Real-Time Analytics',
      description: 'Live dashboards pulling data from Azure Table Storage, Blob Storage, and Application Insights — visualized with interactive Plotly charts.',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: 'Secure & Private',
      description: 'Password-protected with httpOnly cookie auth. No public data exposure — enterprise-grade security.',
      color: 'bg-purple-50 text-purple-600',
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: 'Zero Infrastructure Cost',
      description: 'Vercel free tier + serverless functions. Auto-refresh, CSV/PNG export, fullscreen charts — all at $0/month.',
      color: 'bg-green-50 text-green-600',
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: 'Multi-Source Integration',
      description: 'Unified view of enquiries, traffic, career sessions, and storage — aggregated from 5+ Azure services.',
      color: 'bg-amber-50 text-amber-600',
    },
  ]

  const techStack = ['Next.js 15', 'React 19', 'Azure Table Storage', 'Azure Blob Storage', 'Application Insights', 'Plotly.js', 'Tailwind CSS', 'Vercel Serverless', 'TypeScript']

  return (
    <>
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      >
        <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative shadow-2xl">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          {/* Header */}
          <div className="bg-gradient-to-br from-primary-600 to-primary-800 px-6 py-8 rounded-t-2xl">
            <div className="inline-flex items-center rounded-full px-3 py-1 mb-3 text-xs font-medium bg-white/15 text-blue-100 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-green-400 mr-2 animate-pulse" />
              Live Proof of Concept
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Enterprise Analytics Dashboard
            </h2>
            <p className="text-blue-100 text-sm">
              A complete BI dashboard transforming raw Azure data into actionable insights — at zero cost.
            </p>
          </div>

          {/* Video thumbnail */}
          <div className="px-6 -mt-4">
            <div
              className="relative rounded-xl overflow-hidden shadow-lg cursor-pointer group"
              onClick={() => setVideoOpen(true)}
            >
              <div className="relative aspect-video bg-gray-900">
                <img
                  src={`${BLOB_URL}/videos/poc-thumbnail.png`}
                  alt="POC Demo"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <Play className="w-7 h-7 text-primary-600 ml-0.5" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Highlights */}
          <div className="px-6 py-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">What This Demonstrates</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {highlights.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-gray-100">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${item.color}`}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{item.title}</p>
                    <p className="text-gray-500 text-xs leading-relaxed mt-0.5">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tech stack */}
          <div className="px-6 pb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Built With</h3>
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <span key={tech} className="px-3 py-1 bg-gray-50 rounded-full text-xs font-medium text-gray-600 border border-gray-200">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal
        isOpen={videoOpen}
        onClose={() => setVideoOpen(false)}
        videoSrc={`${BLOB_URL}/videos/POC.mp4`}
        posterSrc={`${BLOB_URL}/videos/poc-thumbnail.png`}
        enableSlidePause={false}
      />
    </>
  )
}
