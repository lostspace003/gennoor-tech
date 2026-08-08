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

- **Type**: the **system font stack** — no webfont is loaded:
  `system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`. Inter and Sora
  were removed; do not reintroduce them. Nothing is heavier than 700.
  Headings use the `.display-*` utilities below rather than raw sizes.
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

## Type scale (globals.css)

Headings use these utilities — **pages must not redeclare heading sizes**.
Each is a fluid `clamp()` at weight 700 with negative tracking.

| Class | Size | Use |
|---|---|---|
| `.display-hero` | `clamp(44px, 5.6vw, 76px)` | Home-scale hero headline |
| `.display-section` | `clamp(32px, 4vw, 48px)` | Section headline |
| `.display-card` | `clamp(30px, 3.6vw, 44px)` | Sub-section / card feature |
| `.kicker` | 12px, `0.18em` tracking, uppercase | Eyebrow above a headline |
| `.lede` | 19px/1.45, `--ink-soft` | Section lede under a headline |

## Buttons (globals.css)

The Apple pill shapes. **One filled pill per surface.**

| Class | Use |
|---|---|
| `.pill-primary` | Filled accent — the single primary action |
| `.pill-primary-sm` | Same, compact — inline and card CTAs |
| `.pill-secondary` | White + hairline, neutral ink |

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

Redesigned pages set section rhythm directly (`px-8 py-16` on white, alternating
with `bg-[#f5f5f7]` bands) rather than using `.section-padding`. Both are live;
match whichever the page you are editing already uses.

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

⌘K search is **derived from that same tree** (`src/lib/search-index.ts`), so a
page added to the rail becomes searchable automatically. Pages that are
deliberately not in the rail must be listed in `STANDALONE_ROUTES` there.

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

Analytics (`GoogleAnalytics`, `PageViewTracker`, Trustpilot) in `layout.tsx`
(`TrackingPixels` was removed 2026-08-08 — the Meta/LinkedIn tags never had IDs
and the privacy policy declares no advertising cookies); form payload field names in the 6 form components
(EnquiryFormModal, CertificationEnquiryForm, BookCallModal, BookingCalendar,
EmailOTP, ClaudeCoworkPopup); `/api/**`, `/media/**` URLs; `middleware.ts`;
`.github/workflows`; `sitemap.ts`; `public/`.
