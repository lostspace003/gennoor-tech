'use client'

import { useState } from 'react'
import { ArrowLeft, Play, BarChart3, Shield, Zap, Globe } from 'lucide-react'
import Link from 'next/link'
import VideoModal from '@/components/VideoModal'
import { BLOB_URL } from '@/lib/site-config'

export default function POCPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const highlights = [
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Real-Time Analytics',
      description: 'Live dashboards pulling data from Azure Table Storage, Blob Storage, and Application Insights — all visualized with interactive Plotly charts.',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Secure & Private',
      description: 'Password-protected access with httpOnly cookie authentication. No public data exposure — enterprise-grade security on a zero-cost stack.',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Zero Infrastructure Cost',
      description: 'Runs entirely on Vercel free tier with serverless functions. Auto-refresh, CSV/PNG export, and fullscreen charts — all at $0/month.',
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Multi-Source Integration',
      description: 'Unified view of enquiries, page traffic, career sessions, and file storage — aggregated from 5+ Azure services into a single pane of glass.',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent-400 rounded-full blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-blue-200 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <div className="max-w-4xl">
            <div className="inline-flex items-center rounded-full px-4 py-1.5 mb-6 text-xs font-medium bg-white/10 text-blue-100 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-green-400 mr-2 animate-pulse" />
              Proof of Concept — Live Build
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Enterprise Analytics Dashboard
              <span className="block text-blue-200 text-2xl sm:text-3xl mt-2">
                Built on Azure + Vercel — Zero Cost
              </span>
            </h1>

            <p className="text-lg text-blue-100 max-w-2xl mb-8">
              A complete business intelligence dashboard that transforms raw Azure data into actionable insights —
              proving that enterprise-grade analytics doesn't require enterprise-grade budgets.
            </p>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="relative -mt-8 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            {/* Video Card */}
            <div
              className="relative rounded-2xl overflow-hidden shadow-2xl cursor-pointer group"
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

                {/* Overlay */}
                <div className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${
                  isHovered ? 'opacity-100' : 'opacity-40'
                }`} />

                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`transform transition-all duration-300 ${
                    isHovered ? 'scale-110' : 'scale-100'
                  }`}>
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-2xl group-hover:bg-white transition-colors">
                      <Play className="w-8 h-8 sm:w-10 sm:h-10 text-primary-600 ml-1" />
                    </div>
                  </div>
                </div>

                {/* Watch label */}
                <div className={`absolute bottom-6 left-0 right-0 text-center transition-all duration-300 ${
                  isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}>
                  <span className="text-white font-medium bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
                    Watch Full Demo
                  </span>
                </div>
              </div>
            </div>

            {/* Caption */}
            <p className="text-center text-sm text-gray-500 mt-4">
              Full walkthrough of the analytics dashboard — from data ingestion to interactive visualizations
            </p>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              What This POC Demonstrates
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              End-to-end capability — from cloud infrastructure to interactive front-end — delivered as a working product, not a slide deck.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
            {highlights.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-primary-100 transition-all"
              >
                <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600 mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Tech Stack</h2>
            <p className="text-gray-600">Production-grade tools, zero-cost deployment</p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {['Next.js 15', 'React 19', 'Azure Table Storage', 'Azure Blob Storage', 'Application Insights', 'Plotly.js', 'Tailwind CSS', 'Vercel Serverless', 'TypeScript'].map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 border border-gray-200 shadow-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Want Something Like This for Your Organization?
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto mb-8">
            From proof of concept to production — I build AI-powered solutions that deliver real business value.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/resources/calendar"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
            >
              Book a Discovery Call
            </Link>
            <Link
              href="/portfolio"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-md text-primary-600 bg-white border-2 border-primary-600 hover:bg-primary-50 transition-colors"
            >
              View Portfolio
            </Link>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      <VideoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        videoSrc={`${BLOB_URL}/videos/POC.mp4`}
        posterSrc={`${BLOB_URL}/videos/poc-thumbnail.png`}
        enableSlidePause={false}
      />
    </div>
  )
}
