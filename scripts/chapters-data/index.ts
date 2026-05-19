import type { Chapter, CourseTheme } from './_types.ts'
import { AI_FOUNDATIONS_THEME, AI_STRATEGY_C_SUITE_THEME, AI_GOVERNANCE_BOARDS_THEME, AI_FINANCE_THEME, AI_FINANCIAL_SERVICES_THEME } from './_types.ts'

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

// AI Governance & Risk for Boards
import { aiGovernanceBoardsChapter01 } from './ai-governance-risk-boards/chapter-01.ts'
import { aiGovernanceBoardsChapter02 } from './ai-governance-risk-boards/chapter-02.ts'
import { aiGovernanceBoardsChapter03 } from './ai-governance-risk-boards/chapter-03.ts'
import { aiGovernanceBoardsChapter04 } from './ai-governance-risk-boards/chapter-04.ts'
import { aiGovernanceBoardsChapter05 } from './ai-governance-risk-boards/chapter-05.ts'
import { aiGovernanceBoardsChapter06 } from './ai-governance-risk-boards/chapter-06.ts'
import { aiGovernanceBoardsChapter07 } from './ai-governance-risk-boards/chapter-07.ts'
import { aiGovernanceBoardsChapter08 } from './ai-governance-risk-boards/chapter-08.ts'

// AI for Finance & Accounting
import { aiForFinanceChapter01 } from './ai-for-finance-accounting/chapter-01.ts'
import { aiForFinanceChapter02 } from './ai-for-finance-accounting/chapter-02.ts'
import { aiForFinanceChapter03 } from './ai-for-finance-accounting/chapter-03.ts'
import { aiForFinanceChapter04 } from './ai-for-finance-accounting/chapter-04.ts'
import { aiForFinanceChapter05 } from './ai-for-finance-accounting/chapter-05.ts'
import { aiForFinanceChapter06 } from './ai-for-finance-accounting/chapter-06.ts'
import { aiForFinanceChapter07 } from './ai-for-finance-accounting/chapter-07.ts'
import { aiForFinanceChapter08 } from './ai-for-finance-accounting/chapter-08.ts'

// AI in Financial Services
import { aiFinServChapter01 } from './ai-in-financial-services/chapter-01.ts'
import { aiFinServChapter02 } from './ai-in-financial-services/chapter-02.ts'
import { aiFinServChapter03 } from './ai-in-financial-services/chapter-03.ts'
import { aiFinServChapter04 } from './ai-in-financial-services/chapter-04.ts'
import { aiFinServChapter05 } from './ai-in-financial-services/chapter-05.ts'
import { aiFinServChapter06 } from './ai-in-financial-services/chapter-06.ts'
import { aiFinServChapter07 } from './ai-in-financial-services/chapter-07.ts'
import { aiFinServChapter08 } from './ai-in-financial-services/chapter-08.ts'

const COURSE_THEMES: Record<string, CourseTheme> = {
  'ai-foundations': AI_FOUNDATIONS_THEME,
  'ai-strategy-c-suite': AI_STRATEGY_C_SUITE_THEME,
  'ai-governance-risk-boards': AI_GOVERNANCE_BOARDS_THEME,
  'ai-for-finance-accounting': AI_FINANCE_THEME,
  'ai-in-financial-services': AI_FINANCIAL_SERVICES_THEME,
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
  'ai-governance-risk-boards': {
    'chapter-01': withTheme(aiGovernanceBoardsChapter01),
    'chapter-02': withTheme(aiGovernanceBoardsChapter02),
    'chapter-03': withTheme(aiGovernanceBoardsChapter03),
    'chapter-04': withTheme(aiGovernanceBoardsChapter04),
    'chapter-05': withTheme(aiGovernanceBoardsChapter05),
    'chapter-06': withTheme(aiGovernanceBoardsChapter06),
    'chapter-07': withTheme(aiGovernanceBoardsChapter07),
    'chapter-08': withTheme(aiGovernanceBoardsChapter08),
  },
  'ai-for-finance-accounting': {
    'chapter-01': withTheme(aiForFinanceChapter01),
    'chapter-02': withTheme(aiForFinanceChapter02),
    'chapter-03': withTheme(aiForFinanceChapter03),
    'chapter-04': withTheme(aiForFinanceChapter04),
    'chapter-05': withTheme(aiForFinanceChapter05),
    'chapter-06': withTheme(aiForFinanceChapter06),
    'chapter-07': withTheme(aiForFinanceChapter07),
    'chapter-08': withTheme(aiForFinanceChapter08),
  },
  'ai-in-financial-services': {
    'chapter-01': withTheme(aiFinServChapter01),
    'chapter-02': withTheme(aiFinServChapter02),
    'chapter-03': withTheme(aiFinServChapter03),
    'chapter-04': withTheme(aiFinServChapter04),
    'chapter-05': withTheme(aiFinServChapter05),
    'chapter-06': withTheme(aiFinServChapter06),
    'chapter-07': withTheme(aiFinServChapter07),
    'chapter-08': withTheme(aiFinServChapter08),
  },
}

// Legacy flat map (AI Foundations only). Build script can use coursesData by courseId.
export const chapters: Record<string, Chapter> = coursesData['ai-foundations']

export type { Chapter, Slide, SlideStep, CourseTheme } from './_types.ts'
export { ICONS, stepCard, calloutBlock, DEFAULT_THEME, AI_FOUNDATIONS_THEME, AI_STRATEGY_C_SUITE_THEME, AI_GOVERNANCE_BOARDS_THEME, AI_FINANCE_THEME, AI_FINANCIAL_SERVICES_THEME } from './_types.ts'
