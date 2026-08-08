/**
 * Webinars & live workshops — the single data source for /webinars.
 *
 * HOW TO PUBLISH AN EVENT (no code changes elsewhere needed):
 *  1. Add an entry to `upcomingWebinars` below. The page renders the
 *     prototype's Upcoming rows (date badge · title · type tag · meta ·
 *     "Register free") automatically as soon as the array is non-empty.
 *  2. When the session is done, move it to `pastWebinars` and set
 *     `recordingUrl` to the YouTube link so "Watch recording ›" appears.
 *
 * Registration is handled by POST /api/webinar-register — it stores the
 * registrant in Azure Table Storage (WebinarRegistration), emails the
 * attendee a confirmation from EMAIL_FROM_WEBINAR, and notifies
 * EMAIL_ADMIN. The joining link is sent manually or by your own
 * follow-up automation closer to the date.
 */

/**
 * Where a session is advertised.
 *  - 'Public'  → /webinars only (the default)
 *  - 'Academy' → the Academy dashboard only (learner-facing live sessions)
 *  - 'Both'    → shown in both places
 *
 * This is what lets the Academy "Live sessions" area run off the same
 * event source as /webinars — closing gap 1.3 in newinclusioncheck/README.md
 * without a second system to maintain.
 */
export type WebinarAudience = 'Public' | 'Academy' | 'Both'

export interface UpcomingWebinar {
  /** Stable id — used as the registration reference (e.g. 'data-integration-2026-08') */
  id: string
  title: string
  type: 'Webinar' | 'Workshop'
  /** Three-letter month for the date badge, e.g. 'Aug' */
  month: string
  /** Day-of-month for the date badge, e.g. '24' */
  day: string
  /** One meta line, e.g. '10:00–12:00 GST · Jalal Ahmed Khan · Q&A included' */
  meta: string
  /** Defaults to 'Public' when omitted. */
  audience?: WebinarAudience
  /** Optional course id to tie an Academy session to a track. */
  courseId?: string
}

export interface PastWebinar {
  title: string
  /** e.g. 'Jul 2026' */
  date: string
  /** YouTube (or other) recording link; omit while unpublished */
  recordingUrl?: string
}

/**
 * Publish upcoming sessions here. Empty = the page shows the honest
 * "dates announcing soon" state.
 *
 * Example entry:
 * {
 *   id: 'data-integration-2026-09',
 *   title: 'Data Integration with AI',
 *   type: 'Webinar',
 *   month: 'Sep',
 *   day: '24',
 *   meta: '10:00–12:00 GST · Jalal Ahmed Khan · Q&A included',
 * },
 */
export const upcomingWebinars: UpcomingWebinar[] = []

export const pastWebinars: PastWebinar[] = []

/** Sessions advertised on the public /webinars page. */
export function getPublicWebinars(): UpcomingWebinar[] {
  return upcomingWebinars.filter(w => (w.audience ?? 'Public') !== 'Academy')
}

/** Sessions surfaced to signed-in learners on the Academy dashboard. */
export function getAcademyWebinars(): UpcomingWebinar[] {
  return upcomingWebinars.filter(w => {
    const audience = w.audience ?? 'Public'
    return audience === 'Academy' || audience === 'Both'
  })
}
