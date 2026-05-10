'use client'

import { BLOB_URL } from '@/lib/site-config'
import InlineVideoPlayer from '@/components/InlineVideoPlayer'

export default function IntroVideo() {
  return (
    <section className="py-20 lg:py-28 relative">
      <div className="section-divider absolute top-0 left-[10%] right-[10%]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Meet — Your AI & Cloud Partner
          </h2>
          <p className="text-gray-500 text-base sm:text-lg leading-relaxed">
            A quick introduction to who we are and how we help businesses transform with AI and Microsoft technologies.
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl overflow-hidden glass-card p-1.5">
            <InlineVideoPlayer
              videoSrc={`${BLOB_URL}/videos/gennoor-intro-video.mp4`}
              posterSrc={`${BLOB_URL}/images/personal-banner.png`}
              rounded="rounded-xl"
              className="shadow-none"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
