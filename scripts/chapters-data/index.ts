import type { Chapter } from './_types.ts'
import { AI_FOUNDATIONS_THEME } from './_types.ts'
import { aiFoundationsChapter01 } from './chapter-01.ts'
import { aiFoundationsChapter02 } from './chapter-02.ts'
import { aiFoundationsChapter03 } from './chapter-03.ts'
import { aiFoundationsChapter04 } from './chapter-04.ts'
import { aiFoundationsChapter05 } from './chapter-05.ts'
import { aiFoundationsChapter06 } from './chapter-06.ts'
import { aiFoundationsChapter07 } from './chapter-07.ts'
import { aiFoundationsChapter08 } from './chapter-08.ts'

const withTheme = (chapter: Chapter): Chapter =>
  chapter.courseId === 'ai-foundations' ? { ...chapter, theme: AI_FOUNDATIONS_THEME } : chapter

export const chapters: Record<string, Chapter> = {
  'chapter-01': withTheme(aiFoundationsChapter01),
  'chapter-02': withTheme(aiFoundationsChapter02),
  'chapter-03': withTheme(aiFoundationsChapter03),
  'chapter-04': withTheme(aiFoundationsChapter04),
  'chapter-05': withTheme(aiFoundationsChapter05),
  'chapter-06': withTheme(aiFoundationsChapter06),
  'chapter-07': withTheme(aiFoundationsChapter07),
  'chapter-08': withTheme(aiFoundationsChapter08),
}

export type { Chapter, Slide, SlideStep, CourseTheme } from './_types.ts'
export { ICONS, stepCard, calloutBlock, DEFAULT_THEME, AI_FOUNDATIONS_THEME } from './_types.ts'
