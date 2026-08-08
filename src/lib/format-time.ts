/**
 * One way to render a moment in time across every email we send.
 *
 * The team works in IST; a meaningful share of readers sit in US Central. So a
 * timestamp is always written as IST first, with the Central equivalent in
 * brackets — never as a raw ISO string, and never in whatever zone the server
 * happens to run in (Azure App Service runs UTC, which is what made stamps
 * look "weird" in the first place).
 *
 *   formatIstCst('2026-08-08T14:23:01.123Z')
 *   → "08 Aug 2026, 7:53 pm IST (9:23 am CDT)"
 */

export const IST_ZONE = 'Asia/Kolkata'
/** US Central. Renders as CST in winter and CDT during daylight saving. */
export const CST_ZONE = 'America/Chicago'

/** Accepts a Date, an ISO string, or epoch millis. Invalid input → null. */
function toDate(input: Date | string | number | null | undefined): Date | null {
  if (input === null || input === undefined || input === '') return null
  const d = input instanceof Date ? input : new Date(input)
  return Number.isNaN(d.getTime()) ? null : d
}

/**
 * "08 Aug 2026, 7:53 pm IST" — en-IN is the only common locale whose short
 * zone name for Asia/Kolkata is the letters "IST" rather than "GMT+5:30".
 */
export function formatIst(input: Date | string | number): string {
  const d = toDate(input)
  if (!d) return ''
  return d.toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
    timeZone: IST_ZONE, timeZoneName: 'short',
  })
}

/**
 * "9:23 am CDT" — time only, since it always accompanies the IST date. en-US
 * is used here for the same reason en-IN is used above: it is the locale that
 * yields "CST"/"CDT" instead of "GMT-5".
 */
export function formatCstTime(input: Date | string | number): string {
  const d = toDate(input)
  if (!d) return ''
  return d
    .toLocaleString('en-US', {
      hour: 'numeric', minute: '2-digit', hour12: true,
      timeZone: CST_ZONE, timeZoneName: 'short',
    })
    .replace(/\bAM\b/, 'am')
    .replace(/\bPM\b/, 'pm')
}

/**
 * The default stamp for emails: IST with the US Central conversion alongside.
 * Falls back to an empty string rather than printing "Invalid Date" into a
 * customer-facing message.
 */
export function formatIstCst(input: Date | string | number | null | undefined): string {
  const d = toDate(input)
  if (!d) return ''
  return `${formatIst(d)} (${formatCstTime(d)})`
}

/**
 * "7:53 pm IST (9:23 am CDT)" — time only, for lists where the date is
 * already established by a heading (a day's meetings, for instance).
 */
export function formatIstCstTime(input: Date | string | number | null | undefined): string {
  const d = toDate(input)
  if (!d) return ''
  const ist = d.toLocaleString('en-IN', {
    hour: 'numeric', minute: '2-digit', hour12: true,
    timeZone: IST_ZONE, timeZoneName: 'short',
  })
  return `${ist} (${formatCstTime(d)})`
}

/**
 * Same pair, but across a day boundary the Central date differs from the
 * Indian one — so this longer form spells the Central date out too. Use it
 * where a reader may act on the date, e.g. meeting invitations.
 */
export function formatIstCstFull(input: Date | string | number | null | undefined): string {
  const d = toDate(input)
  if (!d) return ''
  const cst = d
    .toLocaleString('en-US', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true,
      timeZone: CST_ZONE, timeZoneName: 'short',
    })
    .replace(/\bAM\b/, 'am')
    .replace(/\bPM\b/, 'pm')
  return `${formatIst(d)} (${cst})`
}
