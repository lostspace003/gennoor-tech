// Academy course data model — single source of truth for /academy and /academy/courses/[slug]

export type Track =
  | 'foundations'
  | 'function'
  | 'leadership'
  | 'industry'
  | 'builder'
  | 'applied'

export type Level = 'foundational' | 'intermediate' | 'advanced' | 'mastery'

export type Audience =
  | 'all-staff'
  | 'individual-contributor'
  | 'manager'
  | 'director'
  | 'executive'
  | 'board'
  | 'technical'

export type Func =
  | 'hr'
  | 'finance'
  | 'sales'
  | 'customer-service'
  | 'operations'
  | 'legal-compliance'
  | 'it-engineering'
  | 'strategy'

export type Industry =
  | 'financial-services'
  | 'healthcare'
  | 'manufacturing'
  | 'government'
  | 'energy-utilities'
  | 'retail-ecommerce'
  | 'education'
  | 'cross-industry'

export type Stack =
  | 'microsoft'
  | 'aws'
  | 'gcp'
  | 'open-source'
  | 'stack-agnostic'

export type GennoorPhase = 'diagnose' | 'train' | 'innovate' | 'build' | 'sustain'

export interface Chapter {
  number: number
  title: string
  duration: string // e.g. "8 min"
  objectives: string[]
  hasQuiz?: boolean
  hasExercise?: boolean
  isCapstone?: boolean
}

export interface Reference {
  title: string
  source: string
  url?: string
}

export interface Course {
  slug: string
  title: string
  subtitle: string

  // Taxonomy
  track: Track
  level: Level
  audience: Audience[]
  functions?: Func[]
  industries?: Industry[]
  stack: Stack[]
  pairedPhase: GennoorPhase[]

  // Format
  duration: string // total, e.g. "55 min"
  chapterCount: number
  format: ('video' | 'reading' | 'interactive' | 'hands-on')[]

  // Status
  status: 'available' | 'coming-soon' | 'in-development'
  availableFrom?: string // e.g. "2026 Q2" — used when status !== 'available'
  lastUpdated: string // YYYY-MM-DD

  // Marketing copy
  hookSentence: string // 1-line hook for the catalog card
  whoThisIsFor: string // 1 paragraph
  whatYoullLearn: string[] // 4-6 bullets
  prerequisites?: string[] // optional course slugs or short text descriptions

  // Content
  chapters: Chapter[]
  exerciseCount: number
  capstoneTitle?: string
  references: Reference[]

  // Cross-links
  pairedPocs?: string[] // PoC slugs from src/data/pocs.ts (future)
  relatedCourseSlugs?: string[] // sibling courses in this/adjacent tracks

  // Interactive web-rendered course variant.
  // When set, the catalog detail page shows a distinct CTA linking to the interactive experience.
  // Example: AB-100 lives at /ai-academy/ab-100 and is surfaced in /academy via this field.
  interactiveUrl?: string
}

export interface TrackInfo {
  id: Track
  label: string
  description: string
  tagline: string
}

export interface LevelInfo {
  id: Level
  label: string
  description: string
}
