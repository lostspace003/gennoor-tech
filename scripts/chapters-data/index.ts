import type { Chapter } from './_types.ts'
import { aiFoundationsChapter01 } from './chapter-01.ts'
import { aiFoundationsChapter02 } from './chapter-02.ts'
import { aiFoundationsChapter03 } from './chapter-03.ts'
import { aiFoundationsChapter04 } from './chapter-04.ts'
import { aiFoundationsChapter05 } from './chapter-05.ts'
import { aiFoundationsChapter06 } from './chapter-06.ts'
import { aiFoundationsChapter07 } from './chapter-07.ts'
import { aiFoundationsChapter08 } from './chapter-08.ts'

export const chapters: Record<string, Chapter> = {
  'chapter-01': aiFoundationsChapter01,
  'chapter-02': aiFoundationsChapter02,
  'chapter-03': aiFoundationsChapter03,
  'chapter-04': aiFoundationsChapter04,
  'chapter-05': aiFoundationsChapter05,
  'chapter-06': aiFoundationsChapter06,
  'chapter-07': aiFoundationsChapter07,
  'chapter-08': aiFoundationsChapter08,
}

export type { Chapter, Slide, SlideStep } from './_types.ts'
export { ICONS, stepCard, calloutBlock } from './_types.ts'
