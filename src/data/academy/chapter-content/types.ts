// Chapter-content data model — the actual instructional content for Academy chapters.
// Sits alongside the Course/Chapter metadata in courses.ts. A course can have
// metadata without content (scaffold) or with content (authored).

export type ContentBlock =
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'p'; text: string }
  | { type: 'callout'; variant: 'info' | 'warning' | 'action' | 'tip'; title?: string; text: string }
  | { type: 'list'; ordered?: boolean; items: string[] }
  | { type: 'example'; title?: string; text: string }
  | { type: 'quote'; text: string; attribution?: string }

export interface QuizQuestion {
  question: string
  options: string[]
  /** 0-based index into options */
  correctIndex: number
  /** Shown after submit, regardless of right/wrong */
  explanation: string
}

export interface ChapterExercise {
  title: string
  /** What the learner does — written for direct address ("Open Word and...") */
  prompt: string
  /** What the learner walks away with — the tangible artifact */
  deliverable: string
}

export interface ChapterCapstone {
  /** Multi-line instructions for the capstone */
  instructions: string
  /** What the learner produces */
  deliverable: string
}

export interface ChapterContent {
  /** 1–3 sentence intro shown above the main content */
  intro: string
  /** Ordered list of content blocks */
  blocks: ContentBlock[]
  /** 3–5 key takeaways shown at end of chapter */
  keyTakeaways: string[]
  /** Optional quiz at end of chapter — flagged by hasQuiz on Chapter metadata */
  quiz?: QuizQuestion[]
  /** Optional exercise — flagged by hasExercise on Chapter metadata */
  exercise?: ChapterExercise
  /** Optional capstone — only on the last chapter (isCapstone) */
  capstone?: ChapterCapstone
}

/** Full set of chapter content for a single course, keyed by chapter.number */
export interface CourseContent {
  courseSlug: string
  chapters: Record<number, ChapterContent>
}
