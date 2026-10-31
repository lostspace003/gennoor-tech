// Runs once when the server starts, which is after every deploy.
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs' || process.env.NODE_ENV !== 'production') return

  // Heartbeat every 15 minutes for the LinkedIn autopilot, the blog publishing flow (merge, live, share) and the daily
  // blog. The GitHub schedule (autopilot.yml) triggers the same route, but GitHub can run it late or skip it, so the site
  // also beats by itself. Every run is locked and idempotent, so two triggers never double-post.
  // It runs the work directly rather than calling the route over HTTP, which can fail on the container's bind address.
  const beat = async () => {
    try {
      console.log('heartbeat: start')
      const { runHeartbeat } = await import('@/lib/heartbeat')
      await runHeartbeat()
      console.log('heartbeat: done')
    } catch (e) { console.error('heartbeat failed -', e instanceof Error ? e.message : e) }
  }
  setTimeout(beat, 150_000)
  const timer = setInterval(beat, 15 * 60_000)
  timer.unref?.()

  // Give the new version a couple of minutes to settle, then bring the indexes up to date.
  setTimeout(async () => {
    // 1. Every published course is searchable for the Ask bot. Courses already indexed are skipped.
    try {
      const { indexMissingCourses } = await import('@/lib/course-index-sync')
      const r = await indexMissingCourses()
      if (r.indexed.length) console.log(`course-index: indexed after start: ${r.indexed.join(', ')}`)
    } catch (e) {
      console.error('course-index: start-up check failed -', e instanceof Error ? e.message : e)
    }

    // 2. The assistant's site index picks up new and changed pages. It only re-embeds pages that
    //    changed, and answers 409 when a run is already going, so a restart without changes is cheap.
    const secret = process.env.CRM_CRON_SECRET
    if (!secret) return
    try {
      const res = await fetch(`http://127.0.0.1:${process.env.PORT || 3000}/api/admin/site-index`, {
        method: 'POST',
        headers: { 'x-cron-secret': secret },
        signal: AbortSignal.timeout(60_000),
      })
      console.log(`site-index: refresh after start answered ${res.status}`)
    } catch (e) {
      console.error('site-index: refresh after start failed -', e instanceof Error ? e.message : e)
    }
  }, 120_000)
}
