import { NextResponse, type NextRequest } from 'next/server'
import { generateSpeech, isAcademySpeechConfigured } from '@/lib/speech/azure-speech'
import { composeChapterSSML } from '@/lib/speech/compose-narration'
import { getChapterContent } from '@/data/academy/chapter-content'

interface RouteParams {
  params: Promise<{ slug: string; number: string }>
}

/**
 * Streams MP3 audio narration of a specific chapter.
 * Generated on demand via Azure Speech Service; cached at the edge for repeat plays.
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { slug, number } = await params

  if (!isAcademySpeechConfigured()) {
    return NextResponse.json(
      { error: 'Speech service not configured on this environment' },
      { status: 503 },
    )
  }

  const chapterNum = parseInt(number, 10)
  if (Number.isNaN(chapterNum)) {
    return NextResponse.json({ error: 'Invalid chapter number' }, { status: 400 })
  }

  const content = getChapterContent(slug, chapterNum)
  if (!content) {
    return NextResponse.json(
      { error: 'Chapter content not authored yet' },
      { status: 404 },
    )
  }

  try {
    const ssml = composeChapterSSML(content, { voice: 'en-US-JennyNeural' })
    const audio = await generateSpeech({ ssml })

    return new NextResponse(new Uint8Array(audio), {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        // Cache aggressively — chapter content rarely changes. Revalidation will replace.
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Disposition': `inline; filename="chapter-${chapterNum}.mp3"`,
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Speech generation failed', detail: message },
      { status: 502 },
    )
  }
}
