// Runs once when the server starts, which is after every deploy.
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs' || process.env.NODE_ENV !== 'production') return

  // Give the new version a couple of minutes to settle, then make sure every published course is
  // indexed for the Ask bot and lesson search. Courses that are already indexed are skipped.
  setTimeout(async () => {
    try {
      const { indexMissingCourses } = await import('@/lib/course-index-sync')
      const r = await indexMissingCourses()
      if (r.indexed.length) console.log(`course-index: indexed after start: ${r.indexed.join(', ')}`)
    } catch (e) {
      console.error('course-index: start-up check failed -', e instanceof Error ? e.message : e)
    }
  }, 120_000)
}
