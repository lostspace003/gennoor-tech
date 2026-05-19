import type { CourseContent, ChapterContent } from './types'
import { aiFoundationsForEveryone } from './ai-foundations-for-everyone'

// Registry — add new course content here as it gets authored.
const allCourseContent: Record<string, CourseContent> = {
  [aiFoundationsForEveryone.courseSlug]: aiFoundationsForEveryone,
}

/** Returns the chapter content for a given course slug + chapter number, or undefined if not yet authored. */
export function getChapterContent(
  courseSlug: string,
  chapterNumber: number,
): ChapterContent | undefined {
  return allCourseContent[courseSlug]?.chapters[chapterNumber]
}

/** Returns true if the course has any authored chapter content (used to decide if chapters are linkable on the catalog page). */
export function hasAnyChapterContent(courseSlug: string): boolean {
  const course = allCourseContent[courseSlug]
  return !!course && Object.keys(course.chapters).length > 0
}

/** Returns the list of chapter numbers that have authored content for a course. */
export function getAuthoredChapterNumbers(courseSlug: string): number[] {
  const course = allCourseContent[courseSlug]
  if (!course) return []
  return Object.keys(course.chapters)
    .map(Number)
    .sort((a, b) => a - b)
}
