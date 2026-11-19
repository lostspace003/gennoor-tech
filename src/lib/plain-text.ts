/**
 * Words a stranger typed, made plain before they are saved.
 *
 * On 16 November 2026 someone signed up to the Learning Studio with the name
 * `Test<h1 style="color:red">INJECTED</h1><a href="https://example.com/phish">Click` to see whether the site
 * would show it as a live heading and a link. It did not (pages and emails turn such text into harmless
 * characters when they show it), but the text was SAVED exactly as typed, and one forgotten place that shows it
 * raw would have been enough. So a name, a company, a role, a city: anything that is a short plain field loses
 * its angle brackets and control characters on the way in as well. Two locks, not one (docs/SECURITY.md).
 *
 * This is for short plain fields. It is not a replacement for escaping when the text is shown
 * (`escapeHtml`, or React's own text nodes): "&", quotes and apostrophes are kept, because people and
 * companies have them (O'Brien, AT&T).
 *
 * No imports, so it loads anywhere (browser, server, scripts).
 */

// < > (tags), control characters, and the invisible direction marks used to disguise text
const UNSAFE = /[<>\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F​-‏‪-‮⁦-⁩﻿]/g

/** One line of plain text: no tags, no control characters, spaces tidied, at most `max` characters. */
export function plainField(value: unknown, max: number): string {
  return String(value ?? '')
    .replace(UNSAFE, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max)
    .trim()
}

/** The same for a longer text where line breaks matter (a message, a note). */
export function plainText(value: unknown, max: number): string {
  return String(value ?? '')
    .replace(/\r\n?/g, '\n')
    .replace(UNSAFE, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, max)
    .trim()
}

/** True when the text holds something `plainField` would remove. For checks. */
export const hasMarkup = (value: unknown): boolean => { UNSAFE.lastIndex = 0; return UNSAFE.test(String(value ?? '')) }
