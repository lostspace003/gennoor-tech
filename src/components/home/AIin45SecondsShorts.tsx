import { Youtube } from 'lucide-react'
import { getAIin45SecondsVideos } from '@/lib/youtube'
import ShortsStrip from '@/components/ShortsStrip'

const CHANNEL_URL = 'https://www.youtube.com/@AIin45Seconds-gennoor'

export default async function AIin45SecondsShorts() {
  const videos = await getAIin45SecondsVideos(12)

  if (videos.length === 0) return null

  return (
    <section className="py-20 lg:py-28 relative">
      <div className="section-divider absolute top-0 left-[10%] right-[10%]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-14">
          <div>
            <div className="inline-flex items-center rounded-full px-3 py-1 mb-4 text-xs font-semibold text-primary-600 bg-primary-50/80 border border-primary-100/60">
              Shorts
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              AI in 45 Seconds
            </h2>
            <p className="text-lg text-gray-500">
              Daily AI concepts and news, explained in under a minute
            </p>
          </div>
          <a
            href={`${CHANNEL_URL}?sub_confirmation=1`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center text-primary-600 font-semibold text-sm hover:text-primary-700 transition-colors"
          >
            <Youtube className="mr-2 w-4 h-4" />
            Subscribe on YouTube
          </a>
        </div>

        <ShortsStrip videos={videos} />

        <div className="mt-8 text-center md:hidden">
          <a
            href={`${CHANNEL_URL}?sub_confirmation=1`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-primary-600 font-semibold text-sm"
          >
            <Youtube className="mr-2 w-4 h-4" />
            Subscribe on YouTube
          </a>
        </div>
      </div>
    </section>
  )
}
