import type { Chapter, CourseTheme } from './_types.ts'
import { AI_FOUNDATIONS_THEME, AI_STRATEGY_C_SUITE_THEME } from './_types.ts'

// AI Foundations
import { aiFoundationsChapter01 } from './ai-foundations/chapter-01.ts'
import { aiFoundationsChapter02 } from './ai-foundations/chapter-02.ts'
import { aiFoundationsChapter03 } from './ai-foundations/chapter-03.ts'
import { aiFoundationsChapter04 } from './ai-foundations/chapter-04.ts'
import { aiFoundationsChapter05 } from './ai-foundations/chapter-05.ts'
import { aiFoundationsChapter06 } from './ai-foundations/chapter-06.ts'
import { aiFoundationsChapter07 } from './ai-foundations/chapter-07.ts'
import { aiFoundationsChapter08 } from './ai-foundations/chapter-08.ts'

// AI Strategy for the C-Suite
import { aiStrategyChapter01 } from './ai-strategy-c-suite/chapter-01.ts'
import { aiStrategyChapter02 } from './ai-strategy-c-suite/chapter-02.ts'
import { aiStrategyChapter03 } from './ai-strategy-c-suite/chapter-03.ts'
import { aiStrategyChapter04 } from './ai-strategy-c-suite/chapter-04.ts'
import { aiStrategyChapter05 } from './ai-strategy-c-suite/chapter-05.ts'
import { aiStrategyChapter06 } from './ai-strategy-c-suite/chapter-06.ts'
import { aiStrategyChapter07 } from './ai-strategy-c-suite/chapter-07.ts'
import { aiStrategyChapter08 } from './ai-strategy-c-suite/chapter-08.ts'

const COURSE_THEMES: Record<string, CourseTheme> = {
  'ai-foundations': AI_FOUNDATIONS_THEME,
  'ai-strategy-c-suite': AI_STRATEGY_C_SUITE_THEME,
}

const withTheme = (chapter: Chapter): Chapter => {
  const theme = COURSE_THEMES[chapter.courseId]
  return theme ? { ...chapter, theme } : chapter
}

// Per-course chapter maps. Keys are chapterId (chapter-01, chapter-02, ...).
export const coursesData: Record<string, Record<string, Chapter>> = {
  'ai-foundations': {
    'chapter-01': withTheme(aiFoundationsChapter01),
    'chapter-02': withTheme(aiFoundationsChapter02),
    'chapter-03': withTheme(aiFoundationsChapter03),
    'chapter-04': withTheme(aiFoundationsChapter04),
    'chapter-05': withTheme(aiFoundationsChapter05),
    'chapter-06': withTheme(aiFoundationsChapter06),
    'chapter-07': withTheme(aiFoundationsChapter07),
    'chapter-08': withTheme(aiFoundationsChapter08),
  },
  'ai-strategy-c-suite': {
    'chapter-01': withTheme(aiStrategyChapter01),
    'chapter-02': withTheme(aiStrategyChapter02),
    'chapter-03': withTheme(aiStrategyChapter03),
    'chapter-04': withTheme(aiStrategyChapter04),
    'chapter-05': withTheme(aiStrategyChapter05),
    'chapter-06': withTheme(aiStrategyChapter06),
    'chapter-07': withTheme(aiStrategyChapter07),
    'chapter-08': withTheme(aiStrategyChapter08),
  },
}

// Legacy flat map (AI Foundations only). Build script can use coursesData by courseId.
export const chapters: Record<string, Chapter> = coursesData['ai-foundations']

export type { Chapter, Slide, SlideStep, CourseTheme } from './_types.ts'
export { ICONS, stepCard, calloutBlock, DEFAULT_THEME, AI_FOUNDATIONS_THEME, AI_STRATEGY_C_SUITE_THEME } from './_types.ts'
