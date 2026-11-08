/** Data shapes for the Claude certification course reader.
 *  Produced by claude-thing/build_course_json.js → public/cert-data/<slug>.json */

export type ChapterKind = 'intro' | 'story' | 'playbook' | 'cheatsheet' | 'exam' | 'next' | 'refs'

export interface Scene {
  kicker: string
  title: string
  /** Verbatim opening HTML of the chapter (the story moment); empty when nothing was cut. */
  html: string
  cut: boolean
}

/** A rendered flow animation (claude-thing/flows): served from <BLOB_URL>/cert-flows/<id>.{mp4,gif,jpg} */
export interface FlowRef {
  id: string
  title: string
  duration: number
  steps: number
}

export interface Chapter {
  id: string
  /** Chapter number as printed in the course (0 for the unnumbered cheat sheet). */
  n: number
  title: string
  short: string
  kind: ChapterKind
  tag: string | null
  nocheck: boolean
  html: string
  icon: string | null
  teaser: string
  scene: Scene | null
  takeaways: string[]
  flow: FlowRef | null
}

export type ChapterMeta = Pick<Chapter, 'id' | 'n' | 'title' | 'short' | 'kind' | 'icon' | 'teaser' | 'nocheck' | 'flow'>

export interface AnimNode { id: string; label: string; sub?: string; x: number; y: number }
export interface AnimStep { on: string[] | null; edge: string[] | string[][] | null; text: string }
export interface AnimSpec {
  title: string
  nodes: AnimNode[]
  edges: (string | number)[][]
  steps: AnimStep[]
  vb?: [number, number]
  overview?: boolean
}

export interface KCItem {
  /** 'Multiple choice' | 'Conceptual' | 'Scenario' */
  t: string
  q: string
  o?: string[]
  /** Letter(s) for multiple choice ("B", "B and D"), prose for the others. */
  a: string
  e: string
}

export interface Example { code: string; out: string }
export interface Annotation { out: string; a: [string, string, string][] }

export interface Question {
  id: string
  n: number
  /** topic */
  t: string
  /** difficulty */
  d: string
  /** format */
  c: string
  q: string
  o: string[]
  a: number | number[]
  /** why the answer is right */
  w: string
  /** why the others are wrong */
  x: string
  /** concept tested */
  k: string
  /** chapter id that covers the concept, when one was found */
  ch: string | null
}

export interface CheatSheet {
  stats: { label: string; value: string }[]
  summary: string
  domains: { title: string; weight: string; points: string[] }[]
  matrix: { trigger: string; action: string; category: string }[]
  code: { title: string; tag: string; concepts: string[]; description: string; lang: string; code: string }[]
}

export interface CourseData {
  slug: string
  key: string
  chapters: Chapter[]
  anims: Record<string, AnimSpec>
  kc: Record<string, KCItem[]>
  ex: Record<string, Example>
  ann: Record<string, Annotation>
  outnotes: Record<string, [string, string][]>
  questions: Question[]
  cheat: CheatSheet | null
}

export type Auth = null | false | { email: string; name: string }
