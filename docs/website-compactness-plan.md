# Website Compactness & Clarity Pass — Plan (pending)

*Requested by Jalal, 26 Jul 2026. Execute as its own focused session.*

## Goal
Bring the CRM's compactness, clarity and act-oriented layout to all of gennoor.com — with zero readability problems on dark backgrounds.

## Scope
1. **Contrast audit** — every dark-background section (hero, newsletter, footer, CTA bands): text must pass WCAG AA; fix low-visibility text (light gray on navy etc.).
2. **Density pass, page-type by page-type** — home, services, training curricula, academy, blog, workshops: reduce oversized paddings/fonts, tighten hero heights, kill dead vertical space; content starts high on the page.
3. **Typography scale** — one compact scale sitewide (align to CRM: 13–15px body, tight headings).
4. **Component sweep** — cards, CTA blocks, tables: CRM-grade compactness; wide content scrolls in its own container, never the page.
5. **Mobile** — same density rules; no horizontal scroll anywhere.

## Constraints (must respect)
- The July visual-refresh design system has **contract-protected paths** — check `visual-refresh` memory/branch notes before touching shared components; verify protected pages after every change.
- No dark-bg + dark-text combinations anywhere; verify visually per page, not just in code.
- Follow saved UI rules: compact, top-left anchored, easy to view/understand/act ([ui-design-rules] memory).

## Method
Page-by-page with live screenshots before/after (Chrome connector), deployed in small batches, each batch visually verified on desktop + mobile widths before the next.

## Definition of done
Every top-level page: AA contrast on all text, no oversized empty bands, consistent compact type scale, mobile clean — reviewed and signed off by Jalal.
