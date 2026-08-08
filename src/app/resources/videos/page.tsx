import type { Metadata } from 'next'
import { getYouTubeVideos, getYouTubePlaylists, getAIin45SecondsVideos } from '@/lib/youtube'
import YouTubeGrid from '@/components/YouTubeGrid'
import ShortsStrip from '@/components/ShortsStrip'
import InlineVideoPlayer from '@/components/InlineVideoPlayer'
import { BLOB_URL } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Videos',
  description: 'Watch tutorials, demos, and deep-dives on AI, Azure, and Microsoft technologies from Gennoor Tech.',
}

export const revalidate = 21600

/**
 * Videos page in the Apple idiom, per the redesign handoff: "Watch us
 * work." display hero, then the live YouTube-synced grid, shorts strip,
 * and featured platform walkthrough — all data flows unchanged.
 */

export default async function VideosPage() {
  const [videos, playlists, shorts] = await Promise.all([
    getYouTubeVideos(50),
    getYouTubePlaylists(),
    getAIin45SecondsVideos(12),
  ])

  return (
    <main className="min-h-screen bg-white">
      {/* ===== Hero ===== */}
      <section className="px-8 pt-20 lg:pt-[100px] pb-12 text-center">
        <div className="kicker mb-5">Resources · Videos</div>
        <h1 className="text-[clamp(40px,4.8vw,64px)] leading-[1.06] tracking-[-0.03em] font-bold text-gray-900">
          Watch us work.
        </h1>
        <p className="text-[clamp(18px,1.8vw,22px)] leading-[1.45] text-[#6e6e73] max-w-[540px] mx-auto mt-5">
          Training excerpts, tool walkthroughs, and 45-second answers to real
          questions.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-5 mt-7">
          <a
            href="https://www.youtube.com/@GennoorTech?sub_confirmation=1"
            target="_blank"
            rel="noopener noreferrer"
            className="pill-primary-sm"
          >
            Subscribe on YouTube
          </a>
          <span className="text-[13px] text-[#86868b]">
            {videos.length} videos · {playlists.length} playlists · auto-synced from our channel
          </span>
        </div>
      </section>

      {/* ===== Featured: the Gennoor platform, built with AI ===== */}
      <section className="px-8 pb-16">
        <div className="max-w-[1080px] mx-auto bg-[#1d1d1f] rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
          <div className="p-9 lg:p-12 flex flex-col justify-center">
            <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#86868b] mb-3.5">
              Featured
            </div>
            <h2 className="text-[clamp(24px,2.6vw,32px)] font-bold tracking-[-0.02em] leading-[1.2] text-white">
              We built our entire platform with AI — here&rsquo;s the proof.
            </h2>
            <p className="text-[15px] leading-[1.55] text-[#a1a1a6] mt-3">
              A full walkthrough of how the Gennoor platform — a 40+ page
              website, smart booking system, automated emails, admin dashboard,
              and analytics — was built end-to-end with Claude Code by a single
              founder. Everything you see is live and serving real customers.
            </p>
            <p className="text-[13px] text-[#86868b] mt-4">
              10× faster to market · $0 developer cost · production-ready from day one · 7.5 min
            </p>
          </div>
          <div className="p-4 lg:p-6 flex items-center">
            <div className="w-full rounded-2xl overflow-hidden">
              <InlineVideoPlayer
                videoSrc="/media/videos/gennoor-presentation.mp4"
                posterSrc={`${BLOB_URL}/videos/video-thumbnail-bright.png`}
                rounded="rounded-2xl"
                className="shadow-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== Shorts + video grid — one continuous grey band ===== */}
      <section className="bg-[#f5f5f7] px-8 py-16">
        <div className="max-w-[1080px] mx-auto">
          {shorts.length > 0 && (
            <div className="mb-14">
              <div className="flex justify-between items-end mb-1.5">
                <h2 className="text-[22px] font-bold tracking-[-0.01em] text-gray-900">
                  AI in 45 seconds
                </h2>
                <a
                  href="https://www.youtube.com/@AIin45Seconds-gennoor?sub_confirmation=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline text-[13px] font-medium text-primary-600 hover:text-[#0077ed]"
                >
                  Subscribe ›
                </a>
              </div>
              <p className="text-sm text-[#6e6e73] mb-5">
                One question, one straight answer. New shorts weekly.
              </p>
              <ShortsStrip videos={shorts} />
            </div>
          )}

          <h2 className="text-[22px] font-bold tracking-[-0.01em] text-gray-900 mb-5">
            Latest videos
          </h2>
          {videos.length > 0 ? (
            <YouTubeGrid videos={videos} />
          ) : (
            <div className="bg-white border border-[#e8e8ed] rounded-[18px] text-center py-16 px-6 max-w-md mx-auto">
              <p className="text-[#6e6e73] text-lg">Videos coming soon</p>
              <p className="text-[#86868b] text-sm mt-1">
                Subscribe to our{' '}
                <a
                  href="https://www.youtube.com/@GennoorTech?sub_confirmation=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:underline"
                >
                  YouTube channel
                </a>{' '}
                to get notified
              </p>
            </div>
          )}

          <div className="text-center mt-10">
            <a
              href="https://www.youtube.com/@GennoorTech?sub_confirmation=1"
              target="_blank"
              rel="noopener noreferrer"
              className="link-arrow !text-[15px]"
            >
              Subscribe on YouTube ›
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
