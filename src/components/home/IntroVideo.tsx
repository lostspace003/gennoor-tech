'use client'

import { BLOB_URL } from '@/lib/site-config'
import InlineVideoPlayer from '@/components/InlineVideoPlayer'

export default function IntroVideo() {
  return (
    <section className="py-16 lg:py-20 bg-gradient-to-b from-white via-blue-50/30 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Meet — Your AI & Cloud Partner
          </h2>
          <p className="text-gray-600 text-base sm:text-lg">
            A quick introduction to who we are and how we help businesses transform with AI and Microsoft technologies.
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          <InlineVideoPlayer
            videoSrc={`${BLOB_URL}/videos/gennoor-intro-video.mp4`}
            posterSrc={`${BLOB_URL}/images/personal-banner.png`}
            rounded="rounded-2xl"
            className="shadow-lg ring-1 ring-gray-200/60"
          />
        </div>
      </div>
    </section>
  )
}
