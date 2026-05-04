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
      <section className="bg-gradient-to-br from-primary-50 to-accent-50 py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Play className="w-5 h-5 text-primary-600 fill-primary-600 ml-0.5" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-gray-900">Videos</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mb-2">
            Tutorials, demos, and deep-dives on AI, Azure, and Microsoft technologies.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Auto-synced from our YouTube channel — new uploads appear here automatically.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://www.youtube.com/@GennoorTech?sub_confirmation=1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-lg"
            >
              <Youtube className="w-4 h-4" />
              Subscribe on YouTube
            </a>
            <div className="flex items-center gap-4 text-sm text-gray-500">
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
      <section className="py-6">
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
