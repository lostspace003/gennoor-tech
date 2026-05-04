import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Play, Eye } from 'lucide-react'
import { getYouTubeVideos, type YouTubeVideo } from '@/lib/youtube'

function formatViews(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toString()
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days < 1) return 'Today'
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  if (days < 365) return `${Math.floor(days / 30)}mo ago`
  return `${Math.floor(days / 365)}y ago`
}

function VideoCard({ video }: { video: YouTubeVideo }) {
  return (
    <a
      href={`https://www.youtube.com/watch?v=${video.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out bg-white border border-gray-100"
    >
      <div className="relative aspect-video bg-gray-100">
        {video.thumbnail && (
          <Image
            src={video.thumbnail}
            alt={video.title}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
          {video.duration}
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
            <Play className="w-5 h-5 text-white ml-0.5 fill-white" />
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors duration-200">
          {video.title}
        </h3>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {formatViews(video.viewCount)}
          </span>
          <span>{timeAgo(video.publishedAt)}</span>
        </div>
      </div>
    </a>
  )
}

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
