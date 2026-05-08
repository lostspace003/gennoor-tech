const PROGRESS_KEY = 'gennoor-academy-progress'

export interface ChapterProgress {
  chapterId: string
  courseId: string
  currentSlide: number
  totalSlides: number
  completionPercent: number
  completed: boolean
  lastAccessed: string
}

export interface CourseProgress {
  courseId: string
  chapters: Record<string, ChapterProgress>
  lastAccessed: string
}

export function getLocalProgress(courseId: string): CourseProgress | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(`${PROGRESS_KEY}-${courseId}`)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveLocalProgress(courseId: string, chapterId: string, data: Partial<ChapterProgress>): void {
  if (typeof window === 'undefined') return
  const existing = getLocalProgress(courseId) || { courseId, chapters: {}, lastAccessed: '' }
  const prev = existing.chapters[chapterId]
  const merged: ChapterProgress = {
    chapterId: data.chapterId ?? prev?.chapterId ?? chapterId,
    courseId: data.courseId ?? prev?.courseId ?? courseId,
    currentSlide: data.currentSlide ?? prev?.currentSlide ?? 0,
    totalSlides: data.totalSlides ?? prev?.totalSlides ?? 0,
    completionPercent: data.completionPercent ?? prev?.completionPercent ?? 0,
    completed: data.completed ?? prev?.completed ?? false,
    lastAccessed: new Date().toISOString(),
  }
  existing.chapters[chapterId] = merged
  if (existing.chapters[chapterId].completionPercent >= 95) {
    existing.chapters[chapterId].completed = true
  }
  existing.lastAccessed = new Date().toISOString()
  localStorage.setItem(`${PROGRESS_KEY}-${courseId}`, JSON.stringify(existing))
}

export function getOverallProgress(courseId: string, totalChapters: number): number {
  const progress = getLocalProgress(courseId)
  if (!progress) return 0
  const completedCount = Object.values(progress.chapters).filter(ch => ch.completed).length
  return Math.round((completedCount / totalChapters) * 100)
}

export function getAllLocalProgress(): Record<string, CourseProgress> {
  if (typeof window === 'undefined') return {}
  const result: Record<string, CourseProgress> = {}
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith(PROGRESS_KEY)) {
      try {
        const courseId = key.replace(`${PROGRESS_KEY}-`, '')
        result[courseId] = JSON.parse(localStorage.getItem(key)!)
      } catch { /* ignore corrupt data */ }
    }
  }
  return result
}
