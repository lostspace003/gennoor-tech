import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getYouTubeVideos } from '@/lib/youtube'
import { VideoCard } from '@/components/YouTubeGrid'

export default async function YouTubeVideos() {
  const videos = await getYouTubeVideos(50)
  const latest = videos.slice(0, 3)

  if (latest.length === 0) return null

  return (
    <section className="section-padding">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Latest Videos
            </h2>
            <p className="text-lg text-gray-600">
              Tutorials, demos, and deep-dives from our YouTube channel
            </p>
          </div>
          <Link
            href="/resources/videos"
            className="hidden md:flex items-center text-primary-600 font-medium hover:underline"
          >
            View all videos
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latest.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/resources/videos"
            className="inline-flex items-center text-primary-600 font-medium hover:underline"
          >
            View all videos
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
