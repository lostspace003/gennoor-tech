/**
 * Routes that render their own full-screen shell and must get NO site
 * chrome — no rail, topbar, breadcrumb, footer, or floating helpers.
 *
 * - /crm and /admin: internal apps with their own shells
 * - /ai-academy/<course>/<chapter>: the immersive chapter player — site
 *   chrome over the player caused stray clicks to hit the invisible rail
 *   and visually competed with the lesson.
 *
 * Single source of truth: PortalShell, Footer, WhatsAppButton, and
 * GennoorCare all consult this — keep them in lockstep by never
 * duplicating the pattern list elsewhere.
 */
export function isChromelessRoute(pathname: string | null | undefined): boolean {
  if (!pathname) return false
  if (pathname.startsWith('/crm') || pathname.startsWith('/admin')) return true
  // /ai-academy/{courseId}/{chapterSlug} → exactly 3+ segments under ai-academy
  if (pathname.startsWith('/ai-academy/')) {
    const segments = pathname.split('/').filter(Boolean)
    if (segments.length >= 3) return true
  }
  return false
}
