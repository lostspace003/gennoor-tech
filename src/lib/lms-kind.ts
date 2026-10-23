// Client-safe helpers: what kind of item is this, and how do we colour it.
export type LmsKind = 'lecture' | 'lab' | 'demo' | 'quiz'

export const KIND_COLOR: Record<LmsKind, string> = {
  lecture: '#3b82f6',
  lab: '#e3a13a',
  demo: '#22a699',
  quiz: '#9aa3b2',
}

export const KIND_LABEL: Record<LmsKind, string> = {
  lecture: 'Lectures',
  lab: 'Lab videos',
  demo: 'Demos',
  quiz: 'Quizzes',
}

export function kindOf(item: { type: string; kind?: string }): LmsKind {
  if (item.type === 'quiz') return 'quiz'
  return item.kind === 'lab' || item.kind === 'demo' ? item.kind : 'lecture'
}
