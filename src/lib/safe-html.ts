import DOMPurify from 'dompurify'
import type { CSSProperties } from 'react'

/**
 * HTML that did not come from our own code, made safe to show inside a page of ours: an email someone sent
 * us, a draft a model wrote after reading a stranger's message, anything a visitor could have had a hand in.
 *
 * Why (19 November 2026): the dashboard showed the AI-written reply to a "Book a call" request with
 * `dangerouslySetInnerHTML` and nothing else. The model writes that reply after reading the stranger's own
 * message, so a message that talked the model into repeating a piece of script would have run that script in
 * a signed-in member of staff's browser, with everything that member of staff may do.
 *
 * Use BOTH parts wherever such HTML is shown (docs/SECURITY.md, "HTML we did not write"):
 *   <div style={CONTAINED} dangerouslySetInnerHTML={{ __html: safeHtml(html) }} />
 * - `safeHtml` removes script, event handlers, forms, frames and anything else that can act;
 * - `CONTAINED` keeps what is left inside its own box: without it, a "position: fixed" block in an email could
 *   cover the whole screen with a fake "your session ended, sign in again".
 * Links open in a new tab and tell the other site nothing about where they came from.
 *
 * Browser only: on the server there is no page to clean with, so this returns nothing rather than the raw HTML.
 */
let hooked = false

export function safeHtml(html: string | null | undefined): string {
  if (typeof window === 'undefined' || !html) return ''
  if (!hooked) {
    hooked = true
    DOMPurify.addHook('afterSanitizeAttributes', (node) => {
      if (node instanceof HTMLAnchorElement) {
        node.setAttribute('target', '_blank')
        node.setAttribute('rel', 'noopener noreferrer nofollow')
      }
    })
  }
  return DOMPurify.sanitize(String(html), {
    FORBID_TAGS: ['style', 'form', 'input', 'button', 'textarea', 'select', 'option', 'iframe', 'frame', 'object', 'embed', 'link', 'meta', 'base', 'svg', 'math', 'audio', 'video', 'source', 'dialog'],
    FORBID_ATTR: ['srcset', 'formaction', 'action', 'ping', 'autofocus', 'contenteditable'],
    ALLOW_DATA_ATTR: false,
  })
}

/** Put on the element that shows the cleaned HTML: nothing inside can be drawn outside it or over the page. */
export const CONTAINED: CSSProperties = { contain: 'content', position: 'relative', overflow: 'auto', isolation: 'isolate' }
