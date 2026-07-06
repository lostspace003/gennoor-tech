const API_KEY = process.env.YOUTUBE_API_KEY
const CHANNEL_HANDLE = '@GennoorTech'
const SHORTS_CHANNEL_HANDLE = '@AIin45Seconds-gennoor'
const API_BASE = 'https://www.googleapis.com/youtube/v3'

export interface YouTubeVideo {
  id: string
  title: string
  description: string
  thumbnail: string
  publishedAt: string
  viewCount: number
  likeCount: number
  duration: string
  durationSeconds: number
  channelTitle: string
  playlists: string[]
}

export interface YouTubePlaylist {
  id: string
  title: string
  description: string
  thumbnail: string
  videoCount: number
}

function parseDuration(iso: string): { formatted: string; seconds: number } {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return { formatted: '0:00', seconds: 0 }
  const h = parseInt(match[1] || '0')
  const m = parseInt(match[2] || '0')
  const s = parseInt(match[3] || '0')
  const seconds = h * 3600 + m * 60 + s
  const formatted = h > 0
    ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    : `${m}:${s.toString().padStart(2, '0')}`
  return { formatted, seconds }
}

async function getChannelId(handle = CHANNEL_HANDLE): Promise<string | null> {
  if (!API_KEY) return null
  const res = await fetch(
    `${API_BASE}/channels?part=contentDetails&forHandle=${handle}&key=${API_KEY}`,
    { next: { revalidate: 21600 } }
  )
  if (!res.ok) return null
  const data = await res.json()
  return data.items?.[0]?.id || null
}

async function getUploadsPlaylistId(handle: string): Promise<string | null> {
  if (!API_KEY) return null
  const res = await fetch(
    `${API_BASE}/channels?part=contentDetails&forHandle=${handle}&key=${API_KEY}`,
    { next: { revalidate: 21600 } }
  )
  if (!res.ok) return null
  const data = await res.json()
  return data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads || null
}

export async function getYouTubePlaylists(): Promise<YouTubePlaylist[]> {
  if (!API_KEY) return []
  try {
    const channelId = await getChannelId()
    if (!channelId) return []

    const res = await fetch(
      `${API_BASE}/playlists?part=snippet,contentDetails&channelId=${channelId}&maxResults=50&key=${API_KEY}`,
      { next: { revalidate: 21600 } }
    )
    if (!res.ok) return []
    const data = await res.json()

    return (data.items || []).map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || '',
      videoCount: item.contentDetails?.itemCount || 0,
    }))
  } catch (e) {
    console.error('YouTube playlists fetch error:', e)
    return []
  }
}

async function getPlaylistVideoIds(playlistId: string): Promise<string[]> {
  if (!API_KEY) return []
  const res = await fetch(
    `${API_BASE}/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&key=${API_KEY}`,
    { next: { revalidate: 21600 } }
  )
  if (!res.ok) return []
  const data = await res.json()
  return (data.items || []).map((item: any) => item.snippet?.resourceId?.videoId).filter(Boolean)
}

async function fetchUploadedVideos(handle: string, maxResults: number): Promise<YouTubeVideo[]> {
  if (!API_KEY) return []

  const playlistId = await getUploadsPlaylistId(handle)
  if (!playlistId) return []

  const playlistRes = await fetch(
    `${API_BASE}/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=${maxResults}&key=${API_KEY}`,
    { next: { revalidate: 21600 } }
  )
  if (!playlistRes.ok) return []
  const playlistData = await playlistRes.json()

  const videoIds = playlistData.items
    ?.map((item: any) => item.snippet?.resourceId?.videoId)
    .filter(Boolean)
    .join(',')
  if (!videoIds) return []

  const videosRes = await fetch(
    `${API_BASE}/videos?part=snippet,statistics,contentDetails&id=${videoIds}&key=${API_KEY}`,
    { next: { revalidate: 21600 } }
  )
  if (!videosRes.ok) return []
  const videosData = await videosRes.json()

  return (videosData.items || []).map((item: any) => {
    const { formatted, seconds } = parseDuration(item.contentDetails?.duration || '')
    return {
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails?.maxres?.url
        || item.snippet.thumbnails?.high?.url
        || item.snippet.thumbnails?.medium?.url
        || '',
      publishedAt: item.snippet.publishedAt,
      viewCount: parseInt(item.statistics?.viewCount || '0'),
      likeCount: parseInt(item.statistics?.likeCount || '0'),
      duration: formatted,
      durationSeconds: seconds,
      channelTitle: item.snippet.channelTitle,
      playlists: [],
    }
  })
}

export async function getYouTubeVideos(maxResults = 50): Promise<YouTubeVideo[]> {
  try {
    const videos = await fetchUploadedVideos(CHANNEL_HANDLE, maxResults)
    if (videos.length === 0) return []

    const playlists = await getYouTubePlaylists()
    const playlistMap: Record<string, string[]> = {}

    await Promise.all(
      playlists.map(async (pl) => {
        const ids = await getPlaylistVideoIds(pl.id)
        ids.forEach((vid) => {
          if (!playlistMap[vid]) playlistMap[vid] = []
          playlistMap[vid].push(pl.title)
        })
      })
    )

    return videos.map((video) => ({ ...video, playlists: playlistMap[video.id] || [] }))
  } catch (e) {
    console.error('YouTube fetch error:', e)
    return []
  }
}

export async function getAIin45SecondsVideos(maxResults = 12): Promise<YouTubeVideo[]> {
  try {
    return await fetchUploadedVideos(SHORTS_CHANNEL_HANDLE, maxResults)
  } catch (e) {
    console.error('AI in 45 Seconds fetch error:', e)
    return []
  }
}
