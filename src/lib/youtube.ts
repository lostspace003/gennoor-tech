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
  channelTitle: string
}

function parseDuration(iso: string): string {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return '0:00'
  const h = parseInt(match[1] || '0')
  const m = parseInt(match[2] || '0')
  const s = parseInt(match[3] || '0')
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  return `${m}:${s.toString().padStart(2, '0')}`
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

    return (videosData.items || []).map((item: any) => ({
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
      duration: parseDuration(item.contentDetails?.duration || ''),
      channelTitle: item.snippet.channelTitle,
    }))
  } catch (e) {
    console.error('YouTube fetch error:', e)
    return []
  }
}
