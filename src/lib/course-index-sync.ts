import { listLmsCourses } from '@/lib/lms'
import { courses as interactiveCourses } from '@/config/courses'
import { courseIndexedCount, indexInteractiveCourse, indexLmsCourse, qdrantConfigured } from '@/lib/course-index'

/**
 * Keeps the course index complete without anyone remembering to run it. A published course (video or
 * interactive) that has no lessons in Qdrant yet is indexed; one that is already indexed is left alone,
 * so calling this is cheap and safe at any time.
 */
export interface CourseIndexJob { slug: string; run: () => Promise<{ chunks: number }> }

export async function findUnindexedCourses(): Promise<{ checked: number; pending: CourseIndexJob[] }> {
  const jobs: CourseIndexJob[] = [
    ...(await listLmsCourses()).map((c) => ({ slug: c.slug, run: () => indexLmsCourse(c) })),
    ...interactiveCourses.map((c) => ({ slug: `ia-${c.id}`, run: () => indexInteractiveCourse(c) })),
  ]
  const pending: CourseIndexJob[] = []
  for (const j of jobs) if ((await courseIndexedCount(j.slug)) === 0) pending.push(j)
  return { checked: jobs.length, pending }
}

export async function runCourseIndexJobs(jobs: CourseIndexJob[]): Promise<string[]> {
  const done: string[] = []
  for (const j of jobs) {
    try {
      const s = await j.run()
      console.log(`course-index: ${j.slug} ${s.chunks} chunks`)
      done.push(j.slug)
    } catch (e) {
      console.error(`course-index: ${j.slug} failed -`, e instanceof Error ? e.message : e)
    }
  }
  return done
}

export async function indexMissingCourses(): Promise<{ checked: number; indexed: string[] }> {
  if (!qdrantConfigured()) return { checked: 0, indexed: [] }
  const { checked, pending } = await findUnindexedCourses()
  return { checked, indexed: await runCourseIndexJobs(pending) }
}
