'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { Play, Eye, ThumbsUp, Search, Clock, Calendar, ListVideo, LayoutGrid, LayoutList } from 'lucide-react'
import type { YouTubeVideo } from '@/lib/youtube'

type SortOption = 'latest' | 'popular' | 'oldest' | 'most-liked'
type DurationFilter = 'all' | 'shorts' | 'short' | 'medium' | 'long'
type TimeFilter = 'all' | 'week' | 'month' | '3months' | 'year'
type ViewMode = 'grid' | 'list'

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

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function VideoCardGrid({ video }: { video: YouTubeVideo }) {
  return (
    <a
      href={`https://www.youtube.com/watch?v=${video.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out bg-white border border-gray-100"
    >
      <div className="relative aspect-video bg-gray-100">
        {video.thumbnail && (
          <Image src={video.thumbnail} alt={video.title} fill className="object-cover" />
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
        {video.playlists.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {video.playlists.map((pl) => (
              <span key={pl} className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-primary-50 text-primary-700">
                {pl}
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{formatViews(video.viewCount)}</span>
            <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" />{formatViews(video.likeCount)}</span>
          </div>
          <span>{timeAgo(video.publishedAt)}</span>
        </div>
      </div>
    </a>
  )
}

function VideoCardList({ video }: { video: YouTubeVideo }) {
  return (
    <a
      href={`https://www.youtube.com/watch?v=${video.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex gap-4 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ease-out bg-white border border-gray-100 p-3"
    >
      <div className="relative w-48 sm:w-56 flex-shrink-0 aspect-video rounded-lg overflow-hidden bg-gray-100">
        {video.thumbnail && (
          <Image src={video.thumbnail} alt={video.title} fill className="object-cover" />
        )}
        <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
          {video.duration}
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
            <Play className="w-4 h-4 text-white ml-0.5 fill-white" />
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center min-w-0 flex-1">
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1 group-hover:text-primary-600 transition-colors duration-200">
          {video.title}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-2 mb-2 hidden sm:block">{video.description}</p>
        {video.playlists.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {video.playlists.map((pl) => (
              <span key={pl} className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-primary-50 text-primary-700">
                {pl}
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{formatViews(video.viewCount)} views</span>
          <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" />{formatViews(video.likeCount)}</span>
          <span>{formatDate(video.publishedAt)}</span>
        </div>
      </div>
    </a>
  )
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Most Viewed' },
  { value: 'most-liked', label: 'Most Liked' },
  { value: 'oldest', label: 'Oldest' },
]

const DURATION_OPTIONS: { value: DurationFilter; label: string; icon?: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'shorts', label: 'Shorts' },
  { value: 'short', label: '1–5 min' },
  { value: 'medium', label: '5–15 min' },
  { value: 'long', label: '15+ min' },
]

const TIME_OPTIONS: { value: TimeFilter; label: string }[] = [
  { value: 'all', label: 'All Time' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: '3months', label: 'Last 3 Months' },
  { value: 'year', label: 'This Year' },
]

function FilterPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap ${
        active
          ? 'bg-primary-600 text-white shadow-sm'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {children}
    </button>
  )
}

export default function YouTubeGrid({ videos }: { videos: YouTubeVideo[] }) {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortOption>('latest')
  const [duration, setDuration] = useState<DurationFilter>('all')
  const [time, setTime] = useState<TimeFilter>('all')
  const [playlist, setPlaylist] = useState<string>('all')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  const allPlaylists = useMemo(() => {
    const set = new Set<string>()
    videos.forEach((v) => v.playlists.forEach((p) => set.add(p)))
    return Array.from(set).sort()
  }, [videos])

  const filtered = useMemo(() => {
    let result = [...videos]

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (v) => v.title.toLowerCase().includes(q) || v.description.toLowerCase().includes(q)
      )
    }

    if (duration !== 'all') {
      result = result.filter((v) => {
        const s = v.durationSeconds
        switch (duration) {
          case 'shorts': return s <= 60
          case 'short': return s > 60 && s <= 300
          case 'medium': return s > 300 && s <= 900
          case 'long': return s > 900
          default: return true
        }
      })
    }

    if (time !== 'all') {
      const now = Date.now()
      const cutoff = {
        week: now - 7 * 86400000,
        month: now - 30 * 86400000,
        '3months': now - 90 * 86400000,
        year: now - 365 * 86400000,
      }[time]
      result = result.filter((v) => new Date(v.publishedAt).getTime() >= cutoff)
    }

    if (playlist !== 'all') {
      result = result.filter((v) => v.playlists.includes(playlist))
    }

    switch (sort) {
      case 'latest': result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()); break
      case 'popular': result.sort((a, b) => b.viewCount - a.viewCount); break
      case 'most-liked': result.sort((a, b) => b.likeCount - a.likeCount); break
      case 'oldest': result.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()); break
    }

    return result
  }, [videos, search, sort, duration, time, playlist])

  const activeFilterCount = [
    duration !== 'all',
    time !== 'all',
    playlist !== 'all',
  ].filter(Boolean).length

  return (
    <div>
      {/* Search + View Toggle */}
      <div className="flex gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search videos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all duration-200"
          />
        </div>
        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2.5 transition-colors duration-200 ${viewMode === 'grid' ? 'bg-primary-50 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
            type="button" aria-label="Grid view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2.5 transition-colors duration-200 ${viewMode === 'list' ? 'bg-primary-50 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
            type="button" aria-label="List view"
          >
            <LayoutList className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter rows */}
      <div className="space-y-3 mb-6">
        {/* Sort */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider w-16 flex-shrink-0">Sort</span>
          {SORT_OPTIONS.map((opt) => (
            <FilterPill key={opt.value} active={sort === opt.value} onClick={() => setSort(opt.value)}>
              {opt.label}
            </FilterPill>
          ))}
        </div>

        {/* Duration */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider w-16 flex-shrink-0 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Length
          </span>
          {DURATION_OPTIONS.map((opt) => (
            <FilterPill key={opt.value} active={duration === opt.value} onClick={() => setDuration(opt.value)}>
              {opt.label}
            </FilterPill>
          ))}
        </div>

        {/* Time */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider w-16 flex-shrink-0 flex items-center gap-1">
            <Calendar className="w-3 h-3" /> Date
          </span>
          {TIME_OPTIONS.map((opt) => (
            <FilterPill key={opt.value} active={time === opt.value} onClick={() => setTime(opt.value)}>
              {opt.label}
            </FilterPill>
          ))}
        </div>

        {/* Playlists */}
        {allPlaylists.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider w-16 flex-shrink-0 flex items-center gap-1">
              <ListVideo className="w-3 h-3" /> Series
            </span>
            <FilterPill active={playlist === 'all'} onClick={() => setPlaylist('all')}>All</FilterPill>
            {allPlaylists.map((pl) => (
              <FilterPill key={pl} active={playlist === pl} onClick={() => setPlaylist(pl)}>
                {pl}
              </FilterPill>
            ))}
          </div>
        )}
      </div>

      {/* Results count + active filters */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">
          {filtered.length} video{filtered.length !== 1 ? 's' : ''}
          {search && ` matching "${search}"`}
        </p>
        {activeFilterCount > 0 && (
          <button
            onClick={() => { setDuration('all'); setTime('all'); setPlaylist('all') }}
            className="text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors"
            type="button"
          >
            Clear filters ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Videos */}
      {filtered.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((video) => <VideoCardGrid key={video.id} video={video} />)}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((video) => <VideoCardList key={video.id} video={video} />)}
          </div>
        )
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No videos found</p>
          <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
        </div>
      )}
    </div>
  )
}
