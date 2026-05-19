// Azure Speech Service — REST-based TTS client.
// Server-side ONLY. Never import this from a client component.

const ACADEMY_KEY = process.env.AZURE_SPEECH_ACADEMY_KEY
const ACADEMY_REGION = process.env.AZURE_SPEECH_ACADEMY_REGION

export type AzureNeuralVoice =
  | 'en-US-JennyNeural'
  | 'en-US-DavisNeural'
  | 'en-IN-PrabhatNeural'
  | 'en-IN-NeerjaNeural'
  | 'en-GB-RyanNeural'
  | 'ar-SA-HamedNeural'
  | 'ar-SA-ZariyahNeural'
  | 'hi-IN-MadhurNeural'
  | 'hi-IN-SwaraNeural'

export interface SpeechOptions {
  /** SSML XML body. Compose via compose-narration helpers. */
  ssml: string
  /** Output audio format. Default: 24khz, 48kbps mono MP3 — good quality, small file. */
  outputFormat?: string
}

/**
 * Generate speech audio from SSML using the Academy Azure Speech instance.
 * Returns an ArrayBuffer of MP3 (or whatever format was requested).
 * Throws on any error; caller handles fallback.
 */
export async function generateSpeech({
  ssml,
  outputFormat = 'audio-24khz-48kbitrate-mono-mp3',
}: SpeechOptions): Promise<ArrayBuffer> {
  if (!ACADEMY_KEY || !ACADEMY_REGION) {
    throw new Error(
      'AZURE_SPEECH_ACADEMY_KEY and AZURE_SPEECH_ACADEMY_REGION must be set in environment',
    )
  }

  const endpoint = `https://${ACADEMY_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': ACADEMY_KEY,
      'Content-Type': 'application/ssml+xml',
      'X-Microsoft-OutputFormat': outputFormat,
      'User-Agent': 'gennoor-academy',
    },
    body: ssml,
  })

  if (!response.ok) {
    const errText = await response.text().catch(() => '<no body>')
    throw new Error(
      `Azure Speech TTS failed: ${response.status} ${response.statusText} — ${errText.slice(0, 200)}`,
    )
  }

  return await response.arrayBuffer()
}

/** Returns true if the Academy speech credentials are configured. Use to gate UI. */
export function isAcademySpeechConfigured(): boolean {
  return Boolean(ACADEMY_KEY && ACADEMY_REGION)
}
