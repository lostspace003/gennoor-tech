# Follow-ups (deliberately out of scope for the 2026-07 visual refresh)

These were identified during the refresh but excluded because they change URLs,
delete files, or carry SEO/inbound-link risk. Each needs its own decision.

## URL / route dedupe candidates
- `/case-studies` vs `/portfolio/case-studies` — two case-study routes; only
  the portfolio one is linked. Pick a canonical, redirect the other.
- `/academy` vs `/ai-academy` — two parallel academy systems (catalog vs
  interactive player). Consider unifying the entry point.
- `/ai-readiness` vs `/ai-readiness-v2` — v2 is orphaned + noindex. Promote or delete.
- Orphan routes never linked: `/portfolio` (root), `/functions`,
  `/demo/logo-showcase`, `/dev/cert-preview`.
- `sitemap.ts` lists `/claude-cowork` and `/portfolio/demos`, both of which
  redirect — drop the redirected entries.

## Repo hygiene
- `public/` triplication: many course brochures/TOCs exist as PDF + DOCX +
  HTML (~20MB duplicated). NOT deleted because PDFs may be linked from
  already-sent emails — audit email logs before removing anything.
- `course-4-free/` and `organization-prospects-for-ai-training/` at repo root:
  unreferenced by code; move or archive after confirming no external use.
- `@tailwindcss/postcss@4` devDependency is installed but unused (pipeline is
  Tailwind 3 via postcss.config.js) — safe to uninstall, build-verify after.
- `siteConfig.navigation` in `src/lib/site-config.ts` is dead (the live nav is
  `src/lib/portal-nav.ts`) — removable once nothing else reads it.
- Archived dead code kept for reference: `src/components/_archive/Header.tsx`,
  `src/styles/_archive/modal-content.css`.

## Content (from next-tasks.md)
- Clarify company-vs-solo voice ("we" vs "Jalal") across pages.
- Strengthen testimonials (named, verifiable) and switch activity metrics to
  outcome metrics.
