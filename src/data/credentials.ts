/**
 * The lead instructor's active Microsoft and GitHub credentials. One source for the credentials page, the
 * "Taught by" line on every course page and the structured data, so the numbers can never disagree.
 *
 * Source: the Microsoft Learn transcript (learn.microsoft.com, shared below), "Active certifications".
 * To update after a new exam or a renewal: edit this list and `credentialsAsOf` / `learnStats` from the
 * transcript. Do not add anything that is not on the transcript (other vendors go in certifications.ts with
 * their own certificate file). Certification numbers and the legal name on the transcript are never shown.
 */

export type CredentialTrack = 'agentic' | 'ai-ml' | 'data' | 'devops' | 'leadership' | 'platform' | 'fundamentals'
export type CredentialLevel = 'Expert' | 'Associate' | 'Certification' | 'Fundamentals'

export interface Credential {
  /** exam code, for example AI-103 */
  code: string
  /** official title without the "Microsoft Certified:" prefix */
  name: string
  issuer: 'Microsoft' | 'GitHub'
  level: CredentialLevel
  /** date earned, from the transcript */
  earned: string
  track: CredentialTrack
  /** shown first on the credentials page */
  headline?: boolean
  /** Learning Studio course slugs this credential relates to */
  courses?: string[]
  /** Learning Studio course slugs whose exam this credential IS (the course prepares you for it) */
  primaryFor?: string[]
}

export const credentialTracks: Record<CredentialTrack, string> = {
  agentic: 'Agentic AI',
  'ai-ml': 'AI and ML',
  data: 'Data',
  devops: 'DevOps and GitHub',
  leadership: 'AI leadership',
  platform: 'Development and platform',
  fundamentals: 'Fundamentals',
}

export const credentials: Credential[] = [
  { code: 'AI-500', name: 'Multi-Agent AI Solutions', issuer: 'Microsoft', level: 'Expert', earned: '2026-10-03', track: 'agentic', headline: true, courses: ['ai-500'], primaryFor: ['ai-500'] },
  { code: 'AB-100', name: 'Agentic AI Business Solutions Architect', issuer: 'Microsoft', level: 'Expert', earned: '2026-03-05', track: 'agentic', headline: true, courses: ['ai-500'] },
  { code: 'AI-103', name: 'Azure AI Apps and Agents Developer', issuer: 'Microsoft', level: 'Associate', earned: '2026-08-15', track: 'agentic', headline: true, courses: ['ai-103', 'ai-500'], primaryFor: ['ai-103'] },
  { code: 'AB-620', name: 'AI Agent Builder', issuer: 'Microsoft', level: 'Associate', earned: '2026-08-07', track: 'agentic', headline: true, courses: ['ai-103'] },
  { code: 'GH-600', name: 'Agentic AI Developer', issuer: 'GitHub', level: 'Certification', earned: '2026-09-06', track: 'agentic' },
  { code: 'AB-410', name: 'Intelligent Applications Builder', issuer: 'Microsoft', level: 'Associate', earned: '2026-09-05', track: 'agentic' },
  { code: 'AI-102', name: 'Azure AI Engineer', issuer: 'Microsoft', level: 'Associate', earned: '2022-05-15', track: 'ai-ml', headline: true, courses: ['ai-103'] },
  { code: 'AI-200', name: 'Azure AI Cloud Developer', issuer: 'Microsoft', level: 'Associate', earned: '2026-08-07', track: 'ai-ml', courses: ['ai-103'] },
  { code: 'AI-300', name: 'Machine Learning Operations Engineer', issuer: 'Microsoft', level: 'Associate', earned: '2026-06-22', track: 'ai-ml' },
  { code: 'DP-100', name: 'Azure Data Scientist', issuer: 'Microsoft', level: 'Associate', earned: '2022-01-16', track: 'ai-ml' },
  { code: 'AB-250', name: 'Dynamics 365 Contact Center AI Engineer', issuer: 'Microsoft', level: 'Associate', earned: '2026-09-06', track: 'ai-ml' },
  { code: 'DP-700', name: 'Fabric Data Engineer', issuer: 'Microsoft', level: 'Associate', earned: '2026-07-17', track: 'data' },
  { code: 'DP-600', name: 'Fabric Analytics Engineer', issuer: 'Microsoft', level: 'Associate', earned: '2026-08-16', track: 'data' },
  { code: 'DP-800', name: 'SQL AI Developer', issuer: 'Microsoft', level: 'Associate', earned: '2026-09-06', track: 'data' },
  { code: 'PL-300', name: 'Power BI Data Analyst', issuer: 'Microsoft', level: 'Associate', earned: '2026-08-19', track: 'data' },
  { code: 'AZ-400', name: 'DevOps Engineer', issuer: 'Microsoft', level: 'Expert', earned: '2022-12-25', track: 'devops', headline: true },
  { code: 'GH-300', name: 'GitHub Copilot', issuer: 'GitHub', level: 'Certification', earned: '2025-11-07', track: 'devops' },
  { code: 'GH-900', name: 'GitHub Foundations', issuer: 'GitHub', level: 'Certification', earned: '2025-12-10', track: 'devops' },
  { code: 'AB-731', name: 'AI Transformation Leader', issuer: 'Microsoft', level: 'Certification', earned: '2026-01-31', track: 'leadership' },
  { code: 'AB-730', name: 'AI Business Professional', issuer: 'Microsoft', level: 'Certification', earned: '2026-01-31', track: 'leadership' },
  { code: 'AZ-204', name: 'Azure Developer', issuer: 'Microsoft', level: 'Associate', earned: '2022-08-01', track: 'platform' },
  { code: 'PL-400', name: 'Power Platform Developer', issuer: 'Microsoft', level: 'Associate', earned: '2022-10-03', track: 'platform' },
  { code: 'AI-900', name: 'Azure AI Fundamentals', issuer: 'Microsoft', level: 'Fundamentals', earned: '2022-04-07', track: 'fundamentals' },
  { code: 'PL-900', name: 'Power Platform Fundamentals', issuer: 'Microsoft', level: 'Fundamentals', earned: '2022-02-05', track: 'fundamentals' },
]

/** the date the numbers below were read from the transcript */
export const credentialsAsOf = '2026-10-23'

/** Microsoft Learn transcript totals on that date */
export const learnStats = {
  examsPassed: 27,
  learningHours: 388,
  modules: 521,
  learningPaths: 131,
  /** Microsoft Certified Trainer since */
  mctSince: 2022,
}

/** the public transcript: the source of truth for everything on the credentials page */
export const transcriptUrl = 'https://learn.microsoft.com/en-us/users/lostspace003/transcript/vjw63s4jxnmmwre?tab=credentials-tab'

export const courseNames: Record<string, string> = {
  'ai-103': 'AI-103 course',
  'ai-500': 'AI-500 course',
}

export function monthYear(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })
}

export function credentialsForCourse(slug: string): { primary?: Credential; related: Credential[] } {
  const primary = credentials.find(c => c.primaryFor?.includes(slug))
  const related = credentials.filter(c => c !== primary && c.courses?.includes(slug)).slice(0, 3)
  return { primary, related }
}
