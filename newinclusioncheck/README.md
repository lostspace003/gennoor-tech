# New Inclusion Check — gaps found during the Apple-style redesign

This is the honest audit of **automations and content the site did not have**,
surfaced while implementing the redesign (PR #23). Nothing in this list was broken
by the redesign — these are pre-existing gaps or things the design prototypes
envision that had no backing system yet.

> **STATUS UPDATE:** items 1.1 (footer newsletter), 1.2 (webinars/events
> architecture), and 1.4 (CRM "New lead" shortcut) are now **BUILT** in this
> PR — code side complete, using only existing Azure settings. What remains
> on your side is configuration/verification, spelled out step-by-step in
> **[AZURE-GITHUB-SETUP.md](./AZURE-GITHUB-SETUP.md)** in this folder.
>
> **STATUS UPDATE 2 (2026-08-08):** the remaining code-side gaps are now
> **BUILT** too — 1.3 (Academy live sessions), 1.5 (derived search index),
> 2.1 (Resources hub), 2.2 (cert codes), 2.3 (blog cover images), and 2.4
> (design-system doc). Details under each item below.
>
> **The only item left is 1.6** — live email/booking verification, which can
> only be done against the deployed site with real Azure credentials. Run
> the checklist in §7 of AZURE-GITHUB-SETUP.md after this deploys.

---

## 1. Automations missing or not wired

### 1.1 Footer newsletter form has no backend (pre-existing)
- **Today:** The footer's "Stay updated with AI insights" form renders an email
  input + Subscribe button but has **no `action` and no `onSubmit`** — submitting
  reloads the page and stores nothing. This was true before the redesign; it was
  deliberately preserved rather than silently wired to an invented endpoint.
- **Working reference:** The blog page's newsletter block IS wired — OTP-verified
  email via `EmailOTP` → POST `/api/book-expert-call`.
- **To close:** Reuse the blog flow in `src/components/layout/Footer.tsx`, or
  remove the footer form. Recommended: reuse the flow (one shared component).

### 1.2 Webinars/events system does not exist
- **Today:** `/webinars` is an honest "dates announcing soon" page. There is no
  event data source, no registration endpoint, no reminder emails, no
  recording archive.
- **The prototype envisions:** an Upcoming list (date badge · title · Webinar/
  Workshop tag · "Register free" pill) and a Past Sessions list with "Watch
  recording ›" links.
- **To close:** `src/data/webinars.ts` (or a CMS/table) + a registration API
  route that emails a confirmation and calendar invite (the Azure Communication
  Email + Graph plumbing already exists in `src/lib`), + linking recordings to
  the YouTube library. The redesigned page is structured so the Upcoming list
  can drop straight in.

### 1.3 Academy "Live sessions" — ✅ BUILT
- **The Academy Dashboard prototype** showed a dark "Next live session" card and a
  Live Sessions section with registration. No such system existed (same root gap
  as 1.2).
- **Closed by:** `src/components/academy/AcademyLiveSessions.tsx`, mounted on
  `/academy/dashboard`. It reads the **same source as /webinars**
  (`src/data/webinars.ts`) filtered by a new `audience` field
  (`'Public' | 'Academy' | 'Both'`, defaults to `Public`), so there is no
  second events system to maintain. Registration goes through the existing
  `POST /api/webinar-register` via a shared
  `src/components/webinars/WebinarRegisterModal.tsx` (extracted from
  `/webinars`, prefilled with the signed-in learner's name/email).
- **To publish an Academy session:** add an entry to `upcomingWebinars` with
  `audience: 'Academy'` (dashboard only) or `'Both'` (dashboard + /webinars).
- With nothing published it shows an honest empty state linking to the public
  schedule — never an invented session.

### 1.4 CRM "New lead" quick action not in the header
- **The CRM prototype** has a "New lead" primary pill in the 52px header. Lead
  creation exists inside the Leads view, but there is no global header shortcut.
- **To close:** A header button opening the existing create-lead flow — small,
  purely additive.

### 1.5 Search index is hand-maintained — ✅ BUILT
- `src/components/SearchModal.tsx` used a **hardcoded ~31-entry index** not
  derived from `portal-nav.ts`, so any route added or renamed silently
  disappeared from ⌘K search until someone edited the array by hand.
- **Closed by:** `src/lib/search-index.ts`. Every entry in `portalNav`
  (sections + children) is now indexed automatically — add a page to the rail
  and it is searchable with no extra step; rename an href and search follows.
  Rich descriptions/keywords live in an additive `PAGE_META` map, so a route
  with no metadata still gets indexed from its nav label rather than vanishing.
  `STANDALONE_ROUTES` covers real pages deliberately kept out of the rail, and
  `PRIVATE_PREFIXES` keeps `/crm`, `/admin`, `/dev`, `/demo` and `/api` out.
- **Side effect worth knowing:** the audit assumed search was "currently
  correct". It was not — the hardcoded list was missing ~20 live pages
  (Solutions for SMB/Enterprise, The Gennoor Way, PoC Catalog, both
  calculators, Team & Delivery, Trust & Security, several guides, the legal
  pages). They are all searchable now.

### 1.6 Live-email verification requires the deployed environment
- The dev sandbox has no Azure credentials, so contact-form → email,
  booking → Microsoft Bookings, enquiry modals, and certificate emails were
  verified by **code-path preservation** (zero diff under `src/app/api/**`,
  all 81 client endpoint references intact), not by live sends.
- **To close:** After merge, run one live pass: contact form, a booking, an
  enquiry modal, a certificate claim. All four paths are byte-identical to the
  pre-redesign code.

---

## 2. Content missing vs. the design prototypes

### 2.1 Resources hub page — ✅ BUILT
- The handoff includes `Resources.dc.html` — a hub with six tiles (Blog, Videos,
  Webinars, Workshops, PoC Catalog, AI Readiness). The live site had **no
  `/resources` index route**; the rail's "Resources" entry opened
  `/resources/blog`.
- **Closed by:** `src/app/resources/page.tsx` — the six tiles plus a dark
  Academy band, a guides/exam-prep list, and the two free calculators. The rail
  (`portal-nav.ts`), the footer nav (`site-config.ts`) and `sitemap.ts` now all
  point at `/resources`, with "All resources" added as the first child link.

### 2.2 Certification exam codes on training data — ✅ BUILT
- `src/data/training-programs.ts` modelled certification only as Yes/No, so
  every cert-aligned card showed the generic "Certification" badge.
- **Closed by:** an optional `certCode` field on `TrainingProgram`, rendered by
  `TrainingCard.tsx` and the program detail page (badge + FAQ answer), falling
  back to the generic label when absent.
- **Populated conservatively — read this before adding more.** Codes are
  factual commercial claims, so only programs that map to exactly one named
  exam were filled in: **`AI-103`** on both *Microsoft AI for Developers*
  entries and **`AB-100`** on both *AB100 Certification Prep* entries (its
  description names that exam outright). Both codes match the site's own
  catalogue in `src/data/certification-prep.ts`.
- Deliberately left blank: *AI on Google Cloud*, *AI on AWS*, *Microsoft
  Applied Skills Bootcamp*, *Power Platform + AI*, *GenAI Copilot Mastery*,
  *Agentic AI Engineering* — these prepare for vendor credentials with no
  single unambiguous code. **Do not guess these**; take the code from
  `certification-prep.ts` or the vendor, then add it.

### 2.3 Blog post cover images — ✅ SUPPORT BUILT (assets are yours to add)
- The prototype's featured card uses a cover-image pane; real posts have
  `coverColor` but no images, so the featured card used the brand orbital.
- **Closed by:** an optional `coverImage` field on `BlogPostMeta`. When set,
  the featured card on `/resources/blog` renders that image (object-cover,
  lazy-loaded); when absent it keeps the orbital graphic exactly as before.
- **Still yours:** no image assets were invented. Add real cover art per post
  by setting `coverImage` to a blob URL — the rendering is already live.

### 2.4 Docs drift: `docs/DESIGN-SYSTEM.md` — ✅ FIXED
- The doc described the retired Inter/Sora setup and omitted the shipped
  utilities.
- **Closed by:** the Foundations "Type" entry now states the real system font
  stack (`system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif` — no
  webfont is loaded), plus new tables documenting `.display-hero`,
  `.display-section`, `.display-card`, `.kicker`, `.lede` and the
  `.pill-primary` / `.pill-primary-sm` / `.pill-secondary` buttons with their
  actual values from `globals.css`. Section rhythm now notes that redesigned
  pages set `px-8 py-16` bands directly rather than using `.section-padding`,
  and the site-chrome section records that ⌘K search derives from
  `portal-nav.ts`.

---

## 2.5 LEARNER ACCOUNTS — ✅ BUILT (shipped in this release)

Requested: learners sign in with **Microsoft** or **any email**; email signups
verified by **OTP via ACS**; **password with OTP-based reset**; a saved
**learner profile**; and a **data/analytics section** in the dashboard.
All of it is now implemented and live in the codebase:

Code shipped (no action needed unless noted):
1. **Sign-in modal** (`LearnerAuthModal`) — Microsoft, Google (when
   `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set), email one-time code, and
   **password sign-in** + **forgot-password** (OTP → new password →
   auto sign-in). Apple-idiom restyle.
2. **Password on top of OTP** — `scrypt` hash on the learner record
   (`src/lib/learner-password.ts`); routes:
   - `POST /api/learner/login-password` — email+password sign-in
   - `POST /api/learner/set-password` — set/change (authed; requires
     current password when one exists)
   - `POST /api/learner/reset-password` — `{email, otp, newPassword}`
     using the existing `/api/send-otp` ACS flow
   OTP remains the always-available fallback — nobody gets locked out.
3. **Profile** — `GET/PUT /api/learner/profile` (name, organization, role,
   provider, member-since) + the **Profile & security** cards on
   `/academy/dashboard` (edit profile, set/change password, sign out).
4. **Dashboard analytics** — "Your analytics" section on
   `/academy/dashboard`: weekly learning-minutes bar chart + course-status
   donut (recharts), computed live from progress rows. Works signed-out
   (device-local rows) and signed-in (server rows). No new Azure resources.
5. **Academy overview** — "The Academy at a glance" dark campus band on
   `/academy` (live counts, 4-step journey, six-track directory).

Azure config still needed from you (ONE item, only for the Microsoft
button): a learner Entra app registration (multitenant + personal
accounts), then set app settings `LEARNER_AZURE_AD_CLIENT_ID`,
`LEARNER_AZURE_AD_CLIENT_SECRET` (+ tenant if single-tenant). Redirect
URI: `https://gennoor.com/api/learner/login-microsoft/callback`. Until set, the
route falls back to `AZURE_AD_CLIENT_ID`. Verify with:

```bash
az webapp config appsettings list -g <RG> -n gennoor-tech \
  --query "[?contains(name,'LEARNER')].{n:name}" -o table
```

Everything else (OTP email, JWT, Table Storage `Learners`) runs on
existing settings — `LEARNER_JWT_SECRET` should be set in production
(falls back to `AUTH_SECRET`).

## 3. Follow-up polish (not gaps, listed for completeness)
- **Admin dashboard internals** (`src/app/admin/page.tsx`, ~2,400 lines) kept the
  existing calm system rather than a deep prototype restyle — it is consistent
  but not pixel-matched to `Admin.dc.html`. Safe to deep-restyle later,
  view by view.
- A few Home sections without prototypes (PoC showcase, featured builds) keep
  their own art direction as product-branded showcase panels; heading scales
  could be unified onto the `.display-*` utilities in a polish pass.
