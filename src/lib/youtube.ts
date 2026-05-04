const API_KEY = process.env.YOUTUBE_API_KEY
const CHANNEL_HANDLE = '@GennoorTech'
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

async function getChannelId(): Promise<string | null> {
  if (!API_KEY) return null
  const res = await fetch(
    `${API_BASE}/channels?part=contentDetails&forHandle=${CHANNEL_HANDLE}&key=${API_KEY}`,
    { next: { revalidate: 21600 } }
  )
  if (!res.ok) return null
  const data = await res.json()
  return data.items?.[0]?.id || null
}

async function getUploadsPlaylistId(): Promise<string | null> {
  if (!API_KEY) return null
  const res = await fetch(
    `${API_BASE}/channels?part=contentDetails&forHandle=${CHANNEL_HANDLE}&key=${API_KEY}`,
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

export async function getYouTubeVideos(maxResults = 50): Promise<YouTubeVideo[]> {
  if (!API_KEY) return []

  try {
    const playlistId = await getUploadsPlaylistId()
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
        playlists: playlistMap[item.id] || [],
      }
    })
  } catch (e) {
    console.error('YouTube fetch error:', e)
    return []
  }
}
