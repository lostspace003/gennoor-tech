import type { Chapter, CourseTheme } from './_types.ts'
import { AI_FOUNDATIONS_THEME, AI_STRATEGY_C_SUITE_THEME, AI_GOVERNANCE_BOARDS_THEME, AI_FINANCE_THEME, AI_FINANCIAL_SERVICES_THEME, GENAI_BUSINESS_THEME, AI_FOR_HR_THEME, AI_HEALTHCARE_THEME, M365_COPILOT_THEME, AI_FOR_SALES_THEME, AI_FOR_CS_THEME, AI_FOR_OPS_THEME, AI_MANUFACTURING_THEME, COPILOT_STUDIO_THEME } from './_types.ts'

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

// Generative AI for Business
import { genAiBizChapter01 } from './generative-ai-for-business/chapter-01.ts'
import { genAiBizChapter02 } from './generative-ai-for-business/chapter-02.ts'
import { genAiBizChapter03 } from './generative-ai-for-business/chapter-03.ts'
import { genAiBizChapter04 } from './generative-ai-for-business/chapter-04.ts'
import { genAiBizChapter05 } from './generative-ai-for-business/chapter-05.ts'
import { genAiBizChapter06 } from './generative-ai-for-business/chapter-06.ts'
import { genAiBizChapter07 } from './generative-ai-for-business/chapter-07.ts'
import { genAiBizChapter08 } from './generative-ai-for-business/chapter-08.ts'

// AI for HR & People Teams
import { aiForHrChapter01 } from './ai-for-hr-people-teams/chapter-01.ts'
import { aiForHrChapter02 } from './ai-for-hr-people-teams/chapter-02.ts'
import { aiForHrChapter03 } from './ai-for-hr-people-teams/chapter-03.ts'
import { aiForHrChapter04 } from './ai-for-hr-people-teams/chapter-04.ts'
import { aiForHrChapter05 } from './ai-for-hr-people-teams/chapter-05.ts'
import { aiForHrChapter06 } from './ai-for-hr-people-teams/chapter-06.ts'
import { aiForHrChapter07 } from './ai-for-hr-people-teams/chapter-07.ts'
import { aiForHrChapter08 } from './ai-for-hr-people-teams/chapter-08.ts'

// AI in Healthcare
import { aiHealthcareChapter01 } from './ai-in-healthcare/chapter-01.ts'
import { aiHealthcareChapter02 } from './ai-in-healthcare/chapter-02.ts'
import { aiHealthcareChapter03 } from './ai-in-healthcare/chapter-03.ts'
import { aiHealthcareChapter04 } from './ai-in-healthcare/chapter-04.ts'
import { aiHealthcareChapter05 } from './ai-in-healthcare/chapter-05.ts'
import { aiHealthcareChapter06 } from './ai-in-healthcare/chapter-06.ts'
import { aiHealthcareChapter07 } from './ai-in-healthcare/chapter-07.ts'
import { aiHealthcareChapter08 } from './ai-in-healthcare/chapter-08.ts'

// Microsoft 365 Copilot Adoption Playbook
import { m365CopilotChapter01 } from './m365-copilot-adoption/chapter-01.ts'
import { m365CopilotChapter02 } from './m365-copilot-adoption/chapter-02.ts'
import { m365CopilotChapter03 } from './m365-copilot-adoption/chapter-03.ts'
import { m365CopilotChapter04 } from './m365-copilot-adoption/chapter-04.ts'
import { m365CopilotChapter05 } from './m365-copilot-adoption/chapter-05.ts'
import { m365CopilotChapter06 } from './m365-copilot-adoption/chapter-06.ts'
import { m365CopilotChapter07 } from './m365-copilot-adoption/chapter-07.ts'
import { m365CopilotChapter08 } from './m365-copilot-adoption/chapter-08.ts'

// AI for Sales & Marketing
import { aiSalesChapter01 } from './ai-for-sales-marketing/chapter-01.ts'
import { aiSalesChapter02 } from './ai-for-sales-marketing/chapter-02.ts'
import { aiSalesChapter03 } from './ai-for-sales-marketing/chapter-03.ts'
import { aiSalesChapter04 } from './ai-for-sales-marketing/chapter-04.ts'
import { aiSalesChapter05 } from './ai-for-sales-marketing/chapter-05.ts'
import { aiSalesChapter06 } from './ai-for-sales-marketing/chapter-06.ts'
import { aiSalesChapter07 } from './ai-for-sales-marketing/chapter-07.ts'
import { aiSalesChapter08 } from './ai-for-sales-marketing/chapter-08.ts'

// AI for Customer Service & Support
import { aiCsChapter01 } from './ai-for-customer-service-support/chapter-01.ts'
import { aiCsChapter02 } from './ai-for-customer-service-support/chapter-02.ts'
import { aiCsChapter03 } from './ai-for-customer-service-support/chapter-03.ts'
import { aiCsChapter04 } from './ai-for-customer-service-support/chapter-04.ts'
import { aiCsChapter05 } from './ai-for-customer-service-support/chapter-05.ts'
import { aiCsChapter06 } from './ai-for-customer-service-support/chapter-06.ts'
import { aiCsChapter07 } from './ai-for-customer-service-support/chapter-07.ts'
import { aiCsChapter08 } from './ai-for-customer-service-support/chapter-08.ts'

// AI for Operations & Supply Chain
import { aiOpsChapter01 } from './ai-for-operations-supply-chain/chapter-01.ts'
import { aiOpsChapter02 } from './ai-for-operations-supply-chain/chapter-02.ts'
import { aiOpsChapter03 } from './ai-for-operations-supply-chain/chapter-03.ts'
import { aiOpsChapter04 } from './ai-for-operations-supply-chain/chapter-04.ts'
import { aiOpsChapter05 } from './ai-for-operations-supply-chain/chapter-05.ts'
import { aiOpsChapter06 } from './ai-for-operations-supply-chain/chapter-06.ts'
import { aiOpsChapter07 } from './ai-for-operations-supply-chain/chapter-07.ts'
import { aiOpsChapter08 } from './ai-for-operations-supply-chain/chapter-08.ts'

// AI in Manufacturing
import { aiMfgChapter01 } from './ai-in-manufacturing/chapter-01.ts'
import { aiMfgChapter02 } from './ai-in-manufacturing/chapter-02.ts'
import { aiMfgChapter03 } from './ai-in-manufacturing/chapter-03.ts'
import { aiMfgChapter04 } from './ai-in-manufacturing/chapter-04.ts'
import { aiMfgChapter05 } from './ai-in-manufacturing/chapter-05.ts'
import { aiMfgChapter06 } from './ai-in-manufacturing/chapter-06.ts'
import { aiMfgChapter07 } from './ai-in-manufacturing/chapter-07.ts'
import { aiMfgChapter08 } from './ai-in-manufacturing/chapter-08.ts'

// Building AI Agents with Copilot Studio
import { copilotStudioChapter01 } from './building-ai-agents-copilot-studio/chapter-01.ts'
import { copilotStudioChapter02 } from './building-ai-agents-copilot-studio/chapter-02.ts'
import { copilotStudioChapter03 } from './building-ai-agents-copilot-studio/chapter-03.ts'
import { copilotStudioChapter04 } from './building-ai-agents-copilot-studio/chapter-04.ts'
import { copilotStudioChapter05 } from './building-ai-agents-copilot-studio/chapter-05.ts'
import { copilotStudioChapter06 } from './building-ai-agents-copilot-studio/chapter-06.ts'
import { copilotStudioChapter07 } from './building-ai-agents-copilot-studio/chapter-07.ts'
import { copilotStudioChapter08 } from './building-ai-agents-copilot-studio/chapter-08.ts'

const COURSE_THEMES: Record<string, CourseTheme> = {
  'ai-foundations': AI_FOUNDATIONS_THEME,
  'ai-strategy-c-suite': AI_STRATEGY_C_SUITE_THEME,
  'ai-governance-risk-boards': AI_GOVERNANCE_BOARDS_THEME,
  'ai-for-finance-accounting': AI_FINANCE_THEME,
  'ai-in-financial-services': AI_FINANCIAL_SERVICES_THEME,
  'generative-ai-for-business': GENAI_BUSINESS_THEME,
  'ai-for-hr-people-teams': AI_FOR_HR_THEME,
  'ai-in-healthcare': AI_HEALTHCARE_THEME,
  'm365-copilot-adoption': M365_COPILOT_THEME,
  'ai-for-sales-marketing': AI_FOR_SALES_THEME,
  'ai-for-customer-service-support': AI_FOR_CS_THEME,
  'ai-for-operations-supply-chain': AI_FOR_OPS_THEME,
  'ai-in-manufacturing': AI_MANUFACTURING_THEME,
  'building-ai-agents-copilot-studio': COPILOT_STUDIO_THEME,
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
  'generative-ai-for-business': {
    'chapter-01': withTheme(genAiBizChapter01),
    'chapter-02': withTheme(genAiBizChapter02),
    'chapter-03': withTheme(genAiBizChapter03),
    'chapter-04': withTheme(genAiBizChapter04),
    'chapter-05': withTheme(genAiBizChapter05),
    'chapter-06': withTheme(genAiBizChapter06),
    'chapter-07': withTheme(genAiBizChapter07),
    'chapter-08': withTheme(genAiBizChapter08),
  },
  'ai-for-hr-people-teams': {
    'chapter-01': withTheme(aiForHrChapter01),
    'chapter-02': withTheme(aiForHrChapter02),
    'chapter-03': withTheme(aiForHrChapter03),
    'chapter-04': withTheme(aiForHrChapter04),
    'chapter-05': withTheme(aiForHrChapter05),
    'chapter-06': withTheme(aiForHrChapter06),
    'chapter-07': withTheme(aiForHrChapter07),
    'chapter-08': withTheme(aiForHrChapter08),
  },
  'ai-in-healthcare': {
    'chapter-01': withTheme(aiHealthcareChapter01),
    'chapter-02': withTheme(aiHealthcareChapter02),
    'chapter-03': withTheme(aiHealthcareChapter03),
    'chapter-04': withTheme(aiHealthcareChapter04),
    'chapter-05': withTheme(aiHealthcareChapter05),
    'chapter-06': withTheme(aiHealthcareChapter06),
    'chapter-07': withTheme(aiHealthcareChapter07),
    'chapter-08': withTheme(aiHealthcareChapter08),
  },
  'm365-copilot-adoption': {
    'chapter-01': withTheme(m365CopilotChapter01),
    'chapter-02': withTheme(m365CopilotChapter02),
    'chapter-03': withTheme(m365CopilotChapter03),
    'chapter-04': withTheme(m365CopilotChapter04),
    'chapter-05': withTheme(m365CopilotChapter05),
    'chapter-06': withTheme(m365CopilotChapter06),
    'chapter-07': withTheme(m365CopilotChapter07),
    'chapter-08': withTheme(m365CopilotChapter08),
  },
  'ai-for-sales-marketing': {
    'chapter-01': withTheme(aiSalesChapter01),
    'chapter-02': withTheme(aiSalesChapter02),
    'chapter-03': withTheme(aiSalesChapter03),
    'chapter-04': withTheme(aiSalesChapter04),
    'chapter-05': withTheme(aiSalesChapter05),
    'chapter-06': withTheme(aiSalesChapter06),
    'chapter-07': withTheme(aiSalesChapter07),
    'chapter-08': withTheme(aiSalesChapter08),
  },
  'ai-for-customer-service-support': {
    'chapter-01': withTheme(aiCsChapter01),
    'chapter-02': withTheme(aiCsChapter02),
    'chapter-03': withTheme(aiCsChapter03),
    'chapter-04': withTheme(aiCsChapter04),
    'chapter-05': withTheme(aiCsChapter05),
    'chapter-06': withTheme(aiCsChapter06),
    'chapter-07': withTheme(aiCsChapter07),
    'chapter-08': withTheme(aiCsChapter08),
  },
  'ai-for-operations-supply-chain': {
    'chapter-01': withTheme(aiOpsChapter01),
    'chapter-02': withTheme(aiOpsChapter02),
    'chapter-03': withTheme(aiOpsChapter03),
    'chapter-04': withTheme(aiOpsChapter04),
    'chapter-05': withTheme(aiOpsChapter05),
    'chapter-06': withTheme(aiOpsChapter06),
    'chapter-07': withTheme(aiOpsChapter07),
    'chapter-08': withTheme(aiOpsChapter08),
  },
  'ai-in-manufacturing': {
    'chapter-01': withTheme(aiMfgChapter01),
    'chapter-02': withTheme(aiMfgChapter02),
    'chapter-03': withTheme(aiMfgChapter03),
    'chapter-04': withTheme(aiMfgChapter04),
    'chapter-05': withTheme(aiMfgChapter05),
    'chapter-06': withTheme(aiMfgChapter06),
    'chapter-07': withTheme(aiMfgChapter07),
    'chapter-08': withTheme(aiMfgChapter08),
  },
  'building-ai-agents-copilot-studio': {
    'chapter-01': withTheme(copilotStudioChapter01),
    'chapter-02': withTheme(copilotStudioChapter02),
    'chapter-03': withTheme(copilotStudioChapter03),
    'chapter-04': withTheme(copilotStudioChapter04),
    'chapter-05': withTheme(copilotStudioChapter05),
    'chapter-06': withTheme(copilotStudioChapter06),
    'chapter-07': withTheme(copilotStudioChapter07),
    'chapter-08': withTheme(copilotStudioChapter08),
  },
}

// Legacy flat map (AI Foundations only). Build script can use coursesData by courseId.
export const chapters: Record<string, Chapter> = coursesData['ai-foundations']

export type { Chapter, Slide, SlideStep, CourseTheme } from './_types.ts'
export { ICONS, stepCard, calloutBlock, DEFAULT_THEME, AI_FOUNDATIONS_THEME, AI_STRATEGY_C_SUITE_THEME, AI_GOVERNANCE_BOARDS_THEME, AI_FINANCE_THEME, AI_FINANCIAL_SERVICES_THEME, GENAI_BUSINESS_THEME, AI_FOR_HR_THEME, AI_HEALTHCARE_THEME, M365_COPILOT_THEME, AI_FOR_SALES_THEME, AI_FOR_CS_THEME, AI_FOR_OPS_THEME, AI_MANUFACTURING_THEME, COPILOT_STUDIO_THEME } from './_types.ts'
