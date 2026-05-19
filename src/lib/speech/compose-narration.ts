// Compose narration SSML from chapter content blocks.
// Strips HTML, adds natural pauses, escapes XML characters.

import type {
  ChapterContent,
  ContentBlock,
} from '@/data/academy/chapter-content/types'
import type { AzureNeuralVoice } from './azure-speech'

interface NarrationOptions {
  voice?: AzureNeuralVoice
  /** Rate adjustment, e.g., '+0%', '-10%', '+10%'. Default: '+0%' */
  rate?: string
}

/** Strip basic HTML tags (strong, em, i, b) and decode entities. */
function stripHtml(text: string): string {
  return text
    .replace(/<\/?(?:strong|em|i|b|span|code)[^>]*>/gi, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#39;/g, "'")
    .replace(/&laquo;/g, '"')
    .replace(/&raquo;/g, '"')
    .replace(/&mdash;/g, ' — ')
    .replace(/&ndash;/g, ' – ')
}

/** Escape characters that have special meaning in XML. */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/** Sanitize narrative text for SSML: strip HTML, then escape XML. */
function sanitize(text: string): string {
  return escapeXml(stripHtml(text))
}

function blockToText(block: ContentBlock): string {
  switch (block.type) {
    case 'h2':
      return `<break time="600ms"/>${sanitize(block.text)}.<break time="400ms"/>`
    case 'h3':
      return `<break time="400ms"/>${sanitize(block.text)}.<break time="300ms"/>`
    case 'p':
      return `${sanitize(block.text)}<break time="200ms"/>`
    case 'list': {
      const items = block.items
        .map((item, i) => {
          const cleaned = sanitize(item)
          // For ordered lists, prefix with the number for clarity in narration
          const prefix = block.ordered ? `${i + 1}. ` : ''
          return `${prefix}${cleaned}<break time="350ms"/>`
        })
        .join(' ')
      return `<break time="200ms"/>${items}`
    }
    case 'callout': {
      const label =
        block.variant === 'warning'
          ? 'Warning.'
          : block.variant === 'tip'
            ? 'Tip.'
            : block.variant === 'action'
              ? 'Action.'
              : 'Note.'
      const title = block.title ? `${sanitize(block.title)}. ` : ''
      return `<break time="400ms"/>${label} ${title}${sanitize(block.text)}<break time="300ms"/>`
    }
    case 'example': {
      const title = block.title ? `${sanitize(block.title)}. ` : 'Example. '
      return `<break time="300ms"/>${title}${sanitize(block.text)}<break time="300ms"/>`
    }
    case 'quote': {
      const attribution = block.attribution ? ` — ${sanitize(block.attribution)}` : ''
      return `<break time="400ms"/>Quote. ${sanitize(block.text)}${attribution}<break time="400ms"/>`
    }
  }
}

/**
 * Compose full chapter narration SSML.
 * Includes: intro, all content blocks, key takeaways.
 * Omits: quiz, exercise prompts, capstone (these are interactive — read on screen, not narrated).
 */
export function composeChapterSSML(
  content: ChapterContent,
  { voice = 'en-US-JennyNeural', rate = '+0%' }: NarrationOptions = {},
): string {
  const lang = voice.startsWith('ar-')
    ? 'ar-SA'
    : voice.startsWith('hi-')
      ? 'hi-IN'
      : voice.startsWith('en-IN')
        ? 'en-IN'
        : voice.startsWith('en-GB')
          ? 'en-GB'
          : 'en-US'

  const intro = sanitize(content.intro)
  const body = content.blocks.map(blockToText).join(' ')
  const takeaways = [
    '<break time="600ms"/>',
    'Key takeaways from this chapter.',
    '<break time="400ms"/>',
    content.keyTakeaways
      .map((t, i) => `${i + 1}. ${sanitize(t)}<break time="350ms"/>`)
      .join(' '),
  ].join(' ')

  return `<speak version="1.0" xml:lang="${lang}" xmlns="http://www.w3.org/2001/10/synthesis">
<voice name="${voice}">
<prosody rate="${rate}">
${intro}<break time="500ms"/>
${body}
${takeaways}
</prosody>
</voice>
</speak>`
}
