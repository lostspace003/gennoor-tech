'use client'

import { ArrowRight, BarChart3, Shield, Zap } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import InlineVideoPlayer from '@/components/InlineVideoPlayer'
import { BLOB_URL } from '@/lib/site-config'

const features = [
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    description: 'Live data from Azure Table Storage, Blob Storage & Application Insights',
    color: 'text-primary-600 bg-primary-50',
  },
  {
    icon: Zap,
    title: 'Zero Cost Stack',
    description: 'Vercel free tier + serverless — enterprise analytics at $0/month',
    color: 'text-emerald-600 bg-emerald-50',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Password-protected with httpOnly cookies — no public data exposure',
    color: 'text-violet-600 bg-violet-50',
  },
]

export default function POCShowcase() {
  return (
    <section className="py-20 lg:py-28 relative">
      <div className="section-divider absolute top-0 left-[10%] right-[10%]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              className="inline-flex items-center rounded-full px-3 py-1 mb-4 text-xs font-semibold text-primary-600 bg-primary-50/80 border border-primary-100/60"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse" />
              Live Proof of Concept
            </motion.div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              See It in Action
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              A fully functional analytics dashboard built on Azure — real data, real insights, zero cost infrastructure.
            </p>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
            {/* Video */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="rounded-2xl overflow-hidden glass-card p-1.5">
                <InlineVideoPlayer
                  videoSrc={`${BLOB_URL}/videos/POC.mp4`}
                  posterSrc={`${BLOB_URL}/videos/poc-thumbnail.png`}
                  className="shadow-none rounded-xl"
                />
              </div>
            </motion.div>

            {/* Info */}
            <div className="lg:col-span-2 space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="flex items-start gap-3.5 p-4 rounded-xl glass-card group"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -2 }}
                >
                  <div className={`w-10 h-10 ${feature.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{feature.title}</h3>
                    <p className="text-gray-500 text-sm mt-0.5 leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="pt-2"
              >
                <Link
                  href="/services/poc-development#live-demo"
                  className="inline-flex items-center text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors group"
                >
                  View Full POC Details
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
