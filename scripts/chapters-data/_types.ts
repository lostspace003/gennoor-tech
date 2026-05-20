// Shared types and helpers for Academy chapter data files.
// Each chapter lives in its own file (chapter-01.ts, chapter-02.ts, etc.)
// and exports a Chapter object literal.

// ─────────────────────────────────────────────────────────────────────
// ICON LIBRARY — inline SVG (Lucide-style stroke icons)
// ─────────────────────────────────────────────────────────────────────

export const ICONS = {
  brain: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>`,
  cog: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/><circle cx="12" cy="12" r="3"/></svg>`,
  sparkles: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .962L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/></svg>`,
  x: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  lightbulb: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>`,
  alertTriangle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>`,
  calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`,
  compass: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,
  trophy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>`,
  target: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
  shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>`,
  users: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  zap: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
  bookOpen: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
  flag: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>`,
  rocket: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>`,
} as const

// ─────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────

export interface SlideStep {
  /** Renderable HTML for the step content */
  html: string
  /** Narration text — conversational, with em-dashes for natural pauses */
  narration: string
}

export interface Slide {
  /** Slide-deck visible title */
  title: string
  /** Optional accent icon key from ICONS */
  iconKey?: keyof typeof ICONS
  /** Optional eyebrow above the title (e.g., "OPENING", "TAKEAWAYS") */
  eyebrow?: string
  /** Optional main body HTML (before steps) */
  bodyHtml?: string
  /** Lead narration — read first */
  narrationLead?: string
  /** Step cards revealed one at a time */
  steps?: SlideStep[]
  /** Callout HTML appearing after steps */
  calloutHtml?: string
  /** Narration for the callout (read after steps) */
  calloutNarration?: string
  /** Closing narration after callout */
  narrationTrail?: string
}

export interface CourseTheme {
  primary: string
  primaryDeep: string
  accent: string
  accentLight: string
  navy: string
  cyan: string
  tint: string
}

export const DEFAULT_THEME: CourseTheme = {
  primary:     '#2563EB',
  primaryDeep: '#1D4ED8',
  accent:      '#F59E0B',
  accentLight: '#FCD34D',
  navy:        '#0C1426',
  cyan:        '#60A5FA',
  tint:        '#EFF6FF',
}

export const AI_FOUNDATIONS_THEME: CourseTheme = {
  primary:     '#0F766E',
  primaryDeep: '#0E6058',
  accent:      '#D97706',
  accentLight: '#FCD34D',
  navy:        '#134E4A',
  cyan:        '#5EEAD4',
  tint:        '#F0FDFA',
}

export const AI_STRATEGY_C_SUITE_THEME: CourseTheme = {
  primary:     '#1E40AF',
  primaryDeep: '#1E3A8A',
  accent:      '#F59E0B',
  accentLight: '#FCD34D',
  navy:        '#0B1220',
  cyan:        '#60A5FA',
  tint:        '#EFF6FF',
}

export const AI_GOVERNANCE_BOARDS_THEME: CourseTheme = {
  primary:     '#475569',
  primaryDeep: '#334155',
  accent:      '#B45309',
  accentLight: '#F59E0B',
  navy:        '#0F172A',
  cyan:        '#64748B',
  tint:        '#F1F5F9',
}

export const AI_FINANCE_THEME: CourseTheme = {
  primary:     '#047857',
  primaryDeep: '#065F46',
  accent:      '#D97706',
  accentLight: '#FCD34D',
  navy:        '#022C22',
  cyan:        '#34D399',
  tint:        '#ECFDF5',
}

export const AI_FINANCIAL_SERVICES_THEME: CourseTheme = {
  primary:     '#1D4ED8',
  primaryDeep: '#1E3A8A',
  accent:      '#CA8A04',
  accentLight: '#FACC15',
  navy:        '#0B1538',
  cyan:        '#60A5FA',
  tint:        '#EFF6FF',
}

export const GENAI_BUSINESS_THEME: CourseTheme = {
  primary:     '#7C3AED',
  primaryDeep: '#6D28D9',
  accent:      '#F59E0B',
  accentLight: '#FCD34D',
  navy:        '#1F1147',
  cyan:        '#A78BFA',
  tint:        '#F5F3FF',
}

export const AI_FOR_HR_THEME: CourseTheme = {
  primary:     '#BE185D',
  primaryDeep: '#9D174D',
  accent:      '#D97706',
  accentLight: '#FCD34D',
  navy:        '#3F0A23',
  cyan:        '#F472B6',
  tint:        '#FDF2F8',
}

export const AI_HEALTHCARE_THEME: CourseTheme = {
  primary:     '#0D9488',
  primaryDeep: '#0F766E',
  accent:      '#D97706',
  accentLight: '#FCD34D',
  navy:        '#0B3B36',
  cyan:        '#5EEAD4',
  tint:        '#F0FDFA',
}

export const M365_COPILOT_THEME: CourseTheme = {
  primary:     '#0078D4',
  primaryDeep: '#005A9E',
  accent:      '#F59E0B',
  accentLight: '#FCD34D',
  navy:        '#0A1F33',
  cyan:        '#50B0EE',
  tint:        '#EBF5FB',
}

export const AI_FOR_SALES_THEME: CourseTheme = {
  primary:     '#EA580C',
  primaryDeep: '#C2410C',
  accent:      '#0EA5E9',
  accentLight: '#7DD3FC',
  navy:        '#431407',
  cyan:        '#FB923C',
  tint:        '#FFF7ED',
}

export interface Chapter {
  courseId: string
  chapterId: string
  chapterNumber: number
  chapterSlug: string
  title: string
  subtitle: string
  slides: Slide[]
  theme?: CourseTheme
}

// ─────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────

/** Wraps a step card with an icon + heading + body. */
export function stepCard(
  iconKey: keyof typeof ICONS,
  accent: 'blue' | 'amber' | 'red' | 'green',
  heading: string,
  body: string,
): string {
  return `<div class="step-card accent-${accent}">
    <div class="step-icon">${ICONS[iconKey]}</div>
    <div class="step-content">
      <h3>${heading}</h3>
      <p>${body}</p>
    </div>
  </div>`
}

/** Wraps a callout with an icon + title + body. */
export function calloutBlock(
  iconKey: keyof typeof ICONS,
  variant: 'info' | 'tip' | 'warning',
  title: string,
  body: string,
): string {
  return `<div class="callout callout-${variant}">
    <div class="callout-icon">${ICONS[iconKey]}</div>
    <div>
      <div class="callout-title">${title}</div>
      <div class="callout-body">${body}</div>
    </div>
  </div>`
}
