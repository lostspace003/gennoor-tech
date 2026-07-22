# Gennoor Tech — Design System

The site's visual language, consolidated during the 2026-07 visual refresh. All
tokens live in `src/styles/globals.css` and `tailwind.config.js`.

## Foundations

- **Type**: Inter (body, 16px/1.7) + Sora (headings, `-0.02em` tracking).
  One scale, defined once in `globals.css @layer base` — pages must not
  redeclare heading sizes. h1 = `clamp(2.5rem, 4.5vw, 3.25rem)`.
- **Color discipline**: blue (`primary-600/700`) is the only action color.
  Teal (`accent`) is a supporting accent. Amber (`secondary`) is for small
  badges only — never solid CTA buttons.
- **Radius**: cards `rounded-2xl`, buttons/inputs `rounded-xl`, chips `rounded-full`.
- **Shadows**: soft and layered, low-alpha slate (`rgba(15,23,42,…)`). "HD"
  comes from crisp 1px borders + whitespace, not blur.

## Component classes (globals.css)

| Class | Use |
|---|---|
| `.card` | Default content card: white, 1px `gray-200/70` border, layered soft shadow |
| `.glass-card` | Hero overlays only — not mid-page content |
| `.btn-primary` | Blue gradient, `hover:shadow-glow-blue` |
| `.btn-secondary` | Quiet neutral: white + ring |
| `.btn-outline` | 1px primary outline |
| `.section-padding` | `py-16 lg:py-24` — major sections |
| `.section-padding-sm` | `py-10 lg:py-14` — utility strips |

Page-level section rhythm: `py-14 lg:py-20` (matches PageHero). Homepage
sections run `py-20 lg:py-28`. `py-18` does not exist in Tailwind — never use it.

## Shared components

- `src/components/shared/PageHero.tsx` — every page hero. Props: eyebrow,
  breadcrumbs, title, description, meta chips, ctas, `size` (default|compact),
  `align` (left|center), children (media slot).
- `src/components/shared/PageCTA.tsx` — every closing CTA.
- `src/components/shared/Disclosure.tsx` — collapse long content behind a
  one-line summary (native `details`, SEO-safe). Use when a page has walls of
  prose; keep the lead visible, never collapse hero content.

## Site chrome

`PortalShell` (top bar + collapsible left rail + breadcrumb) is the site's
chrome. Nav IA lives in `src/lib/portal-nav.ts` — labels/icons may change;
hrefs are contracts. The ambient orbs + noise overlay in `layout.tsx` are the
brand signature — keep them subtle.

## Do-not-touch (wiring)

Analytics (`GoogleAnalytics`, `PageViewTracker`, `TrackingPixels`, Trustpilot)
in `layout.tsx`; form payload field names in the 6 form components; `/api/**`,
`/media/**` URLs; `middleware.ts`; `.github/workflows`; `sitemap.ts`; `public/`.
