/**
 * Text that is safe to send to another service.
 *
 * Why this exists (13 November 2026): the LinkedIn autopilot could not write a single post for two
 * days. The opening lines of recent posts are kept in Unicode bold; each bold letter is TWO units
 * in a JavaScript string. A line cut at "the first 200" could end on half a letter. JSON.stringify
 * writes such a half as an escape that strict readers refuse: Azure answered "Invalid body: failed
 * to parse JSON value", and the Python agent service answered 500.
 *
 * So: cut text with `cut()` (never in the middle of a letter), and build every request body that
 * carries text we did not type ourselves with `safeJson()`.
 *
 * No imports, so it loads anywhere (browser, server, scripts).
 */

/** Half of a two-unit letter with its other half missing. */
const LONE = /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g

/** The same text without any half letters. Text that is already whole comes back untouched. */
export const wellFormed = (text: string): string => text.replace(LONE, '')

/** True when the text holds half a letter. For checks and tests. */
export const hasBrokenLetter = (text: string): boolean => { LONE.lastIndex = 0; return LONE.test(text) }

/** The first `max` units of a text, never ending on half a letter. */
export function cut(text: string, max: number): string {
  if (text.length <= max) return wellFormed(text)
  let end = max
  const last = text.charCodeAt(end - 1)
  if (last >= 0xd800 && last <= 0xdbff) end--
  return wellFormed(text.slice(0, end))
}

/** JSON.stringify for a request body: every string in it is made whole first. */
export const safeJson = (value: unknown): string => JSON.stringify(value, (_key, v) => (typeof v === 'string' ? wellFormed(v) : v))
