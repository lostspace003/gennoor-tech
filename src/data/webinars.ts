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
