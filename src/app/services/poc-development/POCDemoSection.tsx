'use client'

import { useState } from 'react'
import { Play, BarChart3, Zap, Shield, Globe } from 'lucide-react'
import VideoModal from '@/components/VideoModal'
import { BLOB_URL } from '@/lib/site-config'

export default function POCDemoSection() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const highlights = [
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Real-Time Analytics',
      description: 'Live dashboards pulling data from Azure Table Storage, Blob Storage, and Application Insights — all visualized with interactive Plotly charts.',
      color: 'bg-primary-50 text-primary-600',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Secure & Private',
      description: 'Password-protected access with httpOnly cookie authentication. No public data exposure — enterprise-grade security on a zero-cost stack.',
      color: 'bg-purple-50 text-purple-600',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Zero Infrastructure Cost',
      description: 'Runs entirely on Vercel free tier with serverless functions. Auto-refresh, CSV/PNG export, and fullscreen charts — all at $0/month.',
      color: 'bg-green-50 text-green-600',
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Multi-Source Integration',
      description: 'Unified view of enquiries, page traffic, career sessions, and file storage — aggregated from 5+ Azure services into a single pane of glass.',
      color: 'bg-amber-50 text-amber-600',
    },
  ]

  return (
    <section id="live-demo" className="py-16 lg:py-20 bg-gray-50">
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

        <div className="max-w-5xl mx-auto">
          {/* Video */}
          <div
            className="relative rounded-2xl overflow-hidden shadow-2xl cursor-pointer group mb-10"
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
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-2xl group-hover:bg-white transition-colors">
                    <Play className="w-8 h-8 sm:w-10 sm:h-10 text-primary-600 ml-1" />
                  </div>
                </div>
              </div>
              <div className={`absolute bottom-5 left-0 right-0 text-center transition-all duration-300 ${
                isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}>
                <span className="text-white font-medium bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
                  Watch Full Demo
                </span>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 -mt-6 mb-10">
            Full walkthrough — from data ingestion to interactive visualizations
          </p>

          {/* Highlight cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {highlights.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-primary-100 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 ${item.color}`}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tech stack pills */}
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500 mb-3">Built with</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['Next.js 15', 'React 19', 'Azure Table Storage', 'Azure Blob Storage', 'Application Insights', 'Plotly.js', 'Tailwind CSS', 'Vercel Serverless', 'TypeScript'].map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 bg-white rounded-full text-xs font-medium text-gray-600 border border-gray-200"
                >
                  {tech}
                </span>
              ))}
            </div>
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
