import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Youtube } from 'lucide-react'
import { getYouTubeVideos } from '@/lib/youtube'
import YouTubeGrid from '@/components/YouTubeGrid'

export const metadata: Metadata = {
  title: 'Videos',
  description: 'Watch tutorials, demos, and deep-dives on AI, Azure, and Microsoft technologies from Gennoor Tech.',
}

export const revalidate = 21600

export default async function VideosPage() {
  const videos = await getYouTubeVideos(50)

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors duration-200 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <Youtube className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold">Videos</h1>
          </div>
          <p className="text-lg text-gray-300 max-w-2xl">
            Tutorials, demos, and deep-dives on AI, Azure, and Microsoft technologies.
            New videos auto-sync from our YouTube channel.
          </p>
          <div className="mt-4">
            <a
              href="https://www.youtube.com/@GennoorTech?sub_confirmation=1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-lg"
            >
              <Youtube className="w-4 h-4" />
              Subscribe on YouTube
            </a>
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
                  className="text-red-600 hover:underline"
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
