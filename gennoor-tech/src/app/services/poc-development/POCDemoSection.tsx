'use client'

import { BarChart3, Zap, Shield, Globe } from 'lucide-react'
import InlineVideoPlayer from '@/components/InlineVideoPlayer'
import { BLOB_URL } from '@/lib/site-config'

export default function POCDemoSection() {
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
          {/* Inline Video */}
          <div className="mb-10">
            <InlineVideoPlayer
              videoSrc={`${BLOB_URL}/videos/POC.mp4`}
              posterSrc={`${BLOB_URL}/videos/poc-thumbnail.png`}
              className="shadow-2xl"
              rounded="rounded-2xl"
            />
            <p className="text-center text-sm text-gray-500 mt-4">
              Full walkthrough — from data ingestion to interactive visualizations
            </p>
          </div>

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
    </section>
  )
}
