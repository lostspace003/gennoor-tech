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

### 1.3 Academy "Live sessions" have no backing system
- **The Academy Dashboard prototype** shows a dark "Next live session" card and a
  Live Sessions section with registration. No such system exists (same root gap
  as 1.2). The shipped dashboard shows real progress/certificates only.
- **To close:** Same events system as 1.2, filtered to Academy sessions.

### 1.4 CRM "New lead" quick action not in the header
- **The CRM prototype** has a "New lead" primary pill in the 52px header. Lead
  creation exists inside the Leads view, but there is no global header shortcut.
- **To close:** A header button opening the existing create-lead flow — small,
  purely additive.

### 1.5 Search index is hand-maintained (operational risk, not a bug)
- `src/components/SearchModal.tsx` uses a **hardcoded ~31-entry index** — it is
  not derived from `portal-nav.ts` or `site-config.ts`. Any route added or
  renamed in future silently disappears from ⌘K search until the array is
  updated by hand. No routes changed in this redesign, so search is currently
  correct.
- **To close:** Generate the index from `portal-nav.ts` + a static page list at
  build time.

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

### 2.1 Resources hub page (optional)
- The handoff includes `Resources.dc.html` — a hub with six tiles (Blog, Videos,
  Webinars, Workshops, PoC Catalog, AI Readiness). The live site has **no
  `/resources` index route**; the rail's "Resources" entry opens `/resources/blog`
  with children links. Everything is reachable; only the hub page itself is a
  design nicety not yet built.

### 2.2 Certification exam codes on training data (minor)
- The prototype's catalogue shows specific cert badges ("AI-103", "AI-901") on
  two programs. `src/data/training-programs.ts` models certification only as
  Yes/No, so the live cards show the generic "Certification" badge. Add an
  optional `certCode` field to the data if the specific codes matter.

### 2.3 Blog post cover images
- The prototype's featured card uses a cover-image pane (rendered as a styled
  placeholder). Real posts have `coverColor` but no cover images; the shipped
  featured card uses the brand orbital graphic instead. Optional: add real
  `coverImage` assets per post.

### 2.4 Docs drift: `docs/DESIGN-SYSTEM.md`
- The design-system doc still describes the previous Inter/Sora setup and old
  section rhythm. The source of truth is now the code (system font stack,
  `.display-*`/`.kicker`/`.pill-*` utilities in `src/styles/globals.css`).
  The doc should be rewritten to match — documentation only, no runtime impact.

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
