# Gennoor Tech — Design System

The site's visual language. All tokens live in `src/styles/globals.css` and
`tailwind.config.js`. Nothing else should define a colour.

## The rule that makes it feel calm

**One accent.** Blue (`primary-600`, `#0071e3`) means *"you can act on this"*.
Links, active nav, and primary buttons. Nothing else on the page is blue, and
nothing that isn't actionable is coloured at all.

Everything else is the neutral ramp (Apple's system greys) on white or
`gray-100` (`#f5f5f7`). Separation comes from a **1px hairline and whitespace** —
never shadow, blur, glow, or gradient.

## Foundations

- **Type**: Inter (body, 16px/1.65) + Sora (headings). One scale, defined once
  in `globals.css @layer base` — pages must not redeclare heading sizes.
  Nothing is heavier than 700. h1 = `clamp(2.125rem, 3.8vw, 2.875rem)`.
- **Surfaces**: `#ffffff` (canvas) and `gray-100` `#f5f5f7` (panel/rail).
  There is no third surface.
- **Hairlines**: `gray-200` `#e8e8ed`; `gray-300` `#d2d2d7` on hover/emphasis.
- **Radius**: cards `rounded-2xl`, buttons/inputs `rounded-xl`, rail rows
  `rounded-lg`, chips `rounded-full`.
- **Shadows**: none, by default. If you reach for one, use a hairline instead.

## Colour tokens

| Token | Hex | Use |
|---|---|---|
| `primary-600` | `#0071e3` | The only accent. Links, active nav, primary button. |
| `primary-100` | `#e8f0fe` | Active-row tint in the rail. |
| `gray-900` | `#1d1d1f` | Primary ink, dark panels. |
| `gray-600` | `#6e6e73` | Secondary ink. |
| `gray-500` | `#86868b` | Tertiary ink, idle icons. |
| `gray-200` | `#e8e8ed` | Hairlines. |
| `gray-100` | `#f5f5f7` | Panel / rail surface. |
| `green-600` | `#1d8348` | Success **text and dots only** — never a fill. |
| `amber-600` | `#9a6700` | Warning **text and dots only**. |
| `red-600` | `#c0392b` | Error **text and dots only**. |

### Why the old colour names still work

`purple-*`, `teal-*`, `indigo-*`, `accent-*`, `secondary-*` and friends are all
**re-pointed at the neutral or accent ramp** in `tailwind.config.js`. They
resolve to the system; none of them adds a colour. This is deliberate — ~700
existing class names referenced them, and re-pointing the token retired them all
at once without touching 100+ files or losing content.

**Do not "fix" this by reintroducing a real hue.** Adding a colour to that
config is a design decision, not a bug fix.

## Component classes (globals.css)

| Class | Use |
|---|---|
| `.card` | Default content card: white, 1px `gray-200`, no shadow |
| `.glass-card` | Legacy name — now identical to `.card` |
| `.btn-primary` | Solid `#0071e3`. **One per surface.** |
| `.btn-secondary` | White + 1px `gray-300` |
| `.btn-outline` | Transparent + 1px, accent text |
| `.section-padding` | `py-12 lg:py-16` — major sections |
| `.section-padding-sm` | `py-8 lg:py-12` — utility strips |

`.gradient-text`, `.heading-gradient`, `.glow-border`, `.ambient-orb`,
`.noise-overlay` are **neutralised, not deleted** — they render as flat ink or
nothing. The names survive only so existing markup keeps compiling.

## Gradients

Gradients are not part of the system. The 203 decorative ones were flattened to
their `from-` colour. The ~48 that remain are **functional and must stay**:

- fade masks (`from-white to-transparent`)
- image/video scrims (`from-black/90 to-transparent`)

Rule of thumb: if a gradient has a `transparent` stop or an alpha (`/`), it's
doing a job. Otherwise it's decoration — use a solid.

## Shared components

- `src/components/shared/PageHero.tsx` — every page hero.
- `src/components/shared/PageCTA.tsx` — every closing CTA.
- `src/components/shared/Disclosure.tsx` — collapse long content behind a
  one-line summary (native `details`, SEO-safe). Needs `after:content-none`
  on the summary to suppress the global FAQ "+" rule.

## Site chrome

`PortalShell` (top bar + collapsible left rail + breadcrumb). Nav IA lives in
`src/lib/portal-nav.ts` — labels/icons may change; **hrefs are contracts**.

Rail conventions (iCloud idiom):
- the rail is `gray-100`, the content beside it is white — that contrast is the
  separation, so the rail needs no shadow
- selection is a filled `primary-100` pill, not a left edge marker
- icons are monochrome and inherit the row's state
- child rows are **text-only and indented** — a second column of icons is what
  made the old rail feel busy
- badges are quiet uppercase text, never a coloured chip
- the top bar carries **exactly one** filled button ("Book a call")

## Intentional exceptions

`src/app/work/nanhe-momin` and `src/app/work/safar-anbiya` are client
showcases and keep their own brand palettes. `TrustpilotWidget` keeps
Trustpilot green (`#00b67a`) — brand requirement. Don't normalise these.

## Do-not-touch (wiring)

Analytics (`GoogleAnalytics`, `PageViewTracker`, `TrackingPixels`, Trustpilot)
in `layout.tsx`; form payload field names in the 6 form components
(EnquiryFormModal, CertificationEnquiryForm, BookCallModal, BookingCalendar,
EmailOTP, ClaudeCoworkPopup); `/api/**`, `/media/**` URLs; `middleware.ts`;
`.github/workflows`; `sitemap.ts`; `public/`.
