import Image from 'next/image'
import { Play, Eye } from 'lucide-react'
import type { YouTubeVideo } from '@/lib/youtube'

function formatViews(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toString()
}

export default function ShortsStrip({ videos }: { videos: YouTubeVideo[] }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-3 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
      {videos.map((video) => (
        <a
          key={video.id}
          href={`https://www.youtube.com/shorts/${video.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative w-40 sm:w-44 shrink-0 aspect-[9/16] rounded-xl overflow-hidden bg-gray-100 border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 ease-out"
        >
          {video.thumbnail && (
            <Image src={video.thumbnail} alt={video.title} fill className="object-cover" sizes="176px" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
          <div className="absolute top-2 right-2 bg-black/80 text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
            {video.duration}
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-11 h-11 bg-red-600 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
              <Play className="w-5 h-5 text-white ml-0.5 fill-white" />
            </div>
          </div>
          <div className="absolute bottom-0 inset-x-0 p-3">
            <p className="text-white text-xs font-semibold line-clamp-2 mb-1">{video.title}</p>
            <span className="flex items-center gap-1 text-[10px] text-white/80">
              <Eye className="w-3 h-3" />
              {formatViews(video.viewCount)} views
            </span>
          </div>
        </a>
      ))}
    </div>
  )
}
