import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Youtube, Play, Film } from 'lucide-react'
import { getYouTubeVideos, getYouTubePlaylists } from '@/lib/youtube'
import YouTubeGrid from '@/components/YouTubeGrid'

export const metadata: Metadata = {
  title: 'Videos',
  description: 'Watch tutorials, demos, and deep-dives on AI, Azure, and Microsoft technologies from Gennoor Tech.',
}

export const revalidate = 21600

export default async function VideosPage() {
  const [videos, playlists] = await Promise.all([
    getYouTubeVideos(50),
    getYouTubePlaylists(),
  ])

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-accent-600 text-white py-16 lg:py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-white/70 hover:text-white transition-colors duration-200 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <Play className="w-5 h-5 text-white fill-white ml-0.5" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold">Videos</h1>
          </div>
          <p className="text-lg text-blue-100 max-w-2xl mb-2">
            Tutorials, demos, and deep-dives on AI, Azure, and Microsoft technologies.
          </p>
          <p className="text-sm text-blue-200/80 mb-6">
            Auto-synced from our YouTube channel — new uploads appear here automatically.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://www.youtube.com/@GennoorTech?sub_confirmation=1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-lg"
            >
              <Youtube className="w-4 h-4" />
              Subscribe on YouTube
            </a>
            <div className="flex items-center gap-4 text-sm text-blue-100">
              <span className="flex items-center gap-1.5">
                <Film className="w-4 h-4" />
                {videos.length} videos
              </span>
              <span className="flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 fill-current" />
                {playlists.length} playlists
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Videos Grid */}
      <section className="section-padding">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {videos.length > 0 ? (
            <YouTubeGrid videos={videos} />
          ) : (
            <div className="text-center py-16">
              <Youtube className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Videos coming soon</p>
              <p className="text-gray-400 text-sm mt-1">
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
        </div>
      </section>
    </div>
  )
}
