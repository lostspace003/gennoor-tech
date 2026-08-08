# Azure + GitHub setup runbook — every automation, clearly

This is the complete operations map for the site's automations: **what each
flow does, which Azure/GitHub setting powers it, the exact variable names the
code reads, and how to test it**. Variable names below are taken directly from
the code (`grep process.env` across `src/lib`, `src/app/api`, `scripts`), not
from memory.

> **Where settings live**
> - Runtime settings → **Azure Portal → App Service `gennoor-tech` →
>   Configuration → Application settings** (the running site reads these).
> - CI/CD settings → **GitHub → repo → Settings → Secrets and variables →
>   Actions** (the deploy pipeline injects these at build time — see §4 for
>   which ones the workflows reference).
> - Most values must exist in **both** places if they're needed at build AND
>   at runtime.

---

## 1. NEW in this PR — needs your attention

### 1.1 Webinar registration (NEW automation — architecture done, config is existing)
- **What I built:** `POST /api/webinar-register` + a data-driven `/webinars`
  page with a "Register free" modal (name, email, optional company).
- **What it does on submit:** rate-limits by IP → saves the registrant to
  Azure Table Storage under enquiry type **`WebinarRegistration`** →
  emails the attendee a confirmation → emails the admin a notification.
- **Settings it uses (ALL already exist for other flows — nothing new to
  create):**
  - `AZURE_STORAGE_CONNECTION_STRING` (registrant storage)
  - Email transport: `AZURE_COMMUNICATION_CONNECTION_STRING` (or the SMTP
    fallback `SMTP_HOST/PORT/USER/PASS/SECURE` — whichever your
    `email-service` is configured with today)
  - `EMAIL_FROM_WEBINAR` (sender — defaults to `webinar@gennoor.com` if unset;
    **make sure this mailbox/sender identity exists in Azure Communication
    Services** or your SMTP provider)
  - `EMAIL_ADMIN` (admin notification target; default `admin@gennoor.com`)
- **The one thing YOU own:** sending the joining link before the session
  (manual email or your own follow-up automation). The confirmation email
  tells attendees the link comes separately.
- **To publish an event:** edit `src/data/webinars.ts` → add an entry to
  `upcomingWebinars` (id, title, type, month, day, meta). The page renders
  rows + registration automatically. Move finished events to `pastWebinars`
  with a `recordingUrl` for "Watch recording ›".

### 1.2 Footer newsletter (was decorative — NOW wired)
- The footer form previously did nothing. It now uses the same flow as the
  blog newsletter: **OTP email verification** (`/api/verify-otp`) then
  `POST /api/book-expert-call` with `programTitle: "Newsletter Subscription
  (Footer)"`. No new settings — it rides the existing email + storage config.
- Subscribers land in the same store the blog newsletter uses; footer
  signups are distinguishable by that programTitle.

### 1.3 CRM "New lead" header shortcut (NEW UI, existing flow)
- The CRM header now has a "New lead" pill → `/crm/leads?new=1`, which opens
  the existing Add-lead modal. No new settings.

---

## 2. Every existing automation, flow by flow

| # | Flow (where) | Endpoint | Azure services used | Key settings (exact names) |
|---|---|---|---|---|
| 1 | Contact / proposal form (`/contact`) | `/api/contact-enquiry` | Table Storage + email | `AZURE_STORAGE_CONNECTION_STRING`, `AZURE_COMMUNICATION_CONNECTION_STRING` or `SMTP_*`, `EMAIL_FROM_ENQUIRY`, `EMAIL_ADMIN` |
| 2 | Booking calendar (`/contact#book`, `/resources/calendar`) | `/api/bookings/*` | Microsoft Bookings via Graph | `MS_GRAPH_CLIENT_ID`, `MS_GRAPH_CLIENT_SECRET`, `MS_GRAPH_TENANT_ID`, `MS_BOOKINGS_BUSINESS_ID` |
| 3 | Training enquiry modals (Training page cards) | `/api/training-enquiry` (via `EnquiryFormModal`) | email + storage | `EMAIL_FROM_TRAINING`, `CC_SALES_ON_TRAINING`, storage + transport as above |
| 4 | Certification enquiry | `/api/certification-enquiry` | email + storage | `EMAIL_FROM_ENQUIRY`, transport + storage |
| 5 | Blog + footer newsletter, expert-call requests | `/api/book-expert-call`, OTP via `/api/verify-otp` | email + storage | transport + storage, `EMAIL_FROM_INFO` |
| 6 | **Webinar registration (NEW)** | `/api/webinar-register` | email + storage | `EMAIL_FROM_WEBINAR`, `EMAIL_ADMIN`, transport + storage |
| 7 | Claude Cowork workshop registration (`/workshops/claude-cowork`) | `/api/claude-cowork-register` | email + storage | `EMAIL_FROM_INFO`, `EMAIL_ADMIN` |
| 8 | AI Readiness quiz → narrated report + email report | `/api/ai-readiness/*` | Azure OpenAI + Speech + email | `AZURE_OPENAI_READINESS_KEY`, `AZURE_OPENAI_READINESS_ENDPOINT`, `AZURE_OPENAI_READINESS_DEPLOYMENT`, `AZURE_OPENAI_READINESS_DEPLOYMENT_MAIN`, `AZURE_SPEECH_KEY`, `AZURE_SPEECH_REGION` |
| 9 | Academy learner system (see §5) | `/api/learner/*`, `/api/certificates/*` | Storage + email + JWT | `LEARNER_JWT_SECRET`, storage + transport |
| 10 | Academy chapter narration (TTS pipeline) | server-side | Azure Speech (eastus) | `AZURE_SPEECH_ACADEMY_KEY`, `AZURE_SPEECH_ACADEMY_REGION` |
| 11 | GennoorCare site bot → chat, lead capture, escalation email | `/api/gennoorcare/*` | Azure OpenAI + storage + email | `AZURE_OPENAI_API_KEY`/`AZURE_OPENAI_KEY`, `AZURE_OPENAI_ENDPOINT`, `AZURE_OPENAI_DEPLOYMENT`, `AZURE_OPENAI_API_VERSION` |
| 12 | CRM (auth, inbox, copilot, digests) | `/crm`, `/api/admin/*` | Entra ID + Graph + OpenAI/Foundry | `AZURE_AD_CLIENT_ID`, `AZURE_AD_CLIENT_SECRET`, `AZURE_AD_TENANT_ID`, `NEXTAUTH_SECRET`/`AUTH_SECRET`, `NEXTAUTH_URL`, `OUTLOOK_SENDER_MAILBOX`, `FOUNDRY_API_KEY`, `FOUNDRY_CLIENT_ID`, `FOUNDRY_CLIENT_SECRET`, `FOUNDRY_TENANT_ID`, `FOUNDRY_OPENAI_BASE` |
| 13 | Page-view analytics + admin dashboards | `/api/log-pageview`, `/api/admin/*` | Table Storage + App Insights | `AZURE_STORAGE_CONNECTION_STRING`, `APPLICATIONINSIGHTS_CONNECTION_STRING` |
| 14 | Media (videos, logos, PDFs) via secured proxy | `/media/*` | Blob Storage (private) | `NEXT_PUBLIC_BLOB_URL`, `AZURE_STORAGE_CONNECTION_STRING`, `AZURE_STORAGE_KEY` |
| 15 | YouTube auto-sync (videos page + home) | build/ISR-time fetch | YouTube Data API | `YOUTUBE_API_KEY` |
| 16 | SEO automations (IndexNow, GSC resubmit, sitemaps) | `scripts/*`, `/api/admin/gsc-*` | Google APIs | `GSC_OAUTH_CLIENT_ID`, `GSC_OAUTH_CLIENT_SECRET`, `GSC_OAUTH_REFRESH_TOKEN`, `GOOGLE_SERVICE_ACCOUNT_KEY` |
| 17 | Google Analytics | client | — | `NEXT_PUBLIC_GA_MEASUREMENT_ID` |

**None of rows 1–5, 7–17 changed in this PR** — verify they carry the same
values as before; nothing to add.

---

## 3. Azure App Service — settings checklist

Group check in **App Service → Configuration**. If a flow above matters to
you, its variables from §2 must be present. The high-risk ones (site breaks
visibly without them):

- `AZURE_STORAGE_CONNECTION_STRING` — every form save, analytics, media proxy
- `AZURE_COMMUNICATION_CONNECTION_STRING` (or full `SMTP_*` set) — every email
- `NEXTAUTH_SECRET` + `NEXTAUTH_URL` + `AZURE_AD_*` — CRM/admin login
- `NEXT_PUBLIC_BLOB_URL` — logos/videos through `/media`
- `EMAIL_FROM_WEBINAR` — **check this one now**; it's used by the new
  webinar flow (defaults to `webinar@gennoor.com` — that sender must be a
  verified identity in your email provider)

---

## 4. GitHub Actions — secrets the workflows reference

`deploy.yml` (CI/CD on PR + main), `crm-digest.yml`, `seo-reindex.yml`,
`site-index.yml` reference exactly these (verify they exist under repo
Actions secrets; values are write-only and cannot be read back):

`APPLICATIONINSIGHTS_CONNECTION_STRING`, `AZURE_AD_CLIENT_ID`,
`AZURE_AD_CLIENT_SECRET`, `AZURE_AD_TENANT_ID`,
`AZURE_COMMUNICATION_CONNECTION_STRING`, `AZURE_CREDENTIALS`,
`AZURE_SEARCH_ADMIN_KEY`, `AZURE_STORAGE_CONNECTION_STRING`,
`CRM_CRON_SECRET`, `FOUNDRY_API_KEY`, `GSC_OAUTH_CLIENT_ID`,
`GSC_OAUTH_CLIENT_SECRET`, `GSC_OAUTH_REFRESH_TOKEN`, `MS_GRAPH_CLIENT_ID`,
`MS_GRAPH_CLIENT_SECRET`, `MS_GRAPH_TENANT_ID`, `NEXTAUTH_SECRET`,
`NEXT_PUBLIC_CAREER_API_URL`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`,
`YOUTUBE_API_KEY`

**This PR adds no new secret.** The webinar flow reuses the existing email +
storage secrets.

> **2026-08-08:** `NEXT_PUBLIC_FB_PIXEL_ID` and
> `NEXT_PUBLIC_LINKEDIN_PARTNER_ID` were **removed** — no pixel IDs existed on
> either platform, the tags never rendered, and the privacy policy states the
> site uses no advertising or tracking cookies. The Meta Pixel and LinkedIn
> Insight Tag code, the `TrackingPixels` component, and both workflow lines are
> deleted. `NEXT_PUBLIC_GA_MEASUREMENT_ID` was added as an Actions secret the
> same day — it had been set on the App Service but **not** in Actions, and
> because `NEXT_PUBLIC_*` is inlined at build time, Google Analytics was absent
> from the deployed bundle entirely.

---

## 5. AI Academy student registration — how it works (no new form needed)

There is deliberately **no signup wall**. The learner system works like this:

1. **Anonymous by default** — progress is saved on-device (localStorage) as
   the learner watches chapters. Nothing to configure.
2. **Certificate claim = the registration moment** — on course completion the
   learner enters name + email, verifies via **OTP email**
   (`/api/learner/*`, `/api/verify-otp`), and the certificate is issued,
   stored, and emailed. This is where a learner becomes a known contact.
   Settings: `LEARNER_JWT_SECRET`, storage + email transport (all existing).
3. **Logged-in learners** (legacy sessions) sync progress server-side via
   `/api/learner/progress` and see it on `/academy/dashboard`.
4. **Where the leads go:** claimed certificates and OTP-verified emails are
   in Azure Table Storage — your CRM/automation can pick them up from there
   (same storage account as all enquiries).

If you later want a hard "register before learning" gate, that is a product
decision — the plumbing (OTP, JWT, progress APIs) already exists; only the
gating UI would need to be added. Recommended: keep it frictionless.

---

## 6. RUN THIS IN VS CODE WITH CLAUDE CODE — az / gh wiring check

> **How to use:** open this repo in VS Code, start Claude Code, and say:
> *"Read newinclusioncheck/AZURE-GITHUB-SETUP.md section 6 and run the
> wiring check — report anything missing, then help me set it."*
> Prerequisites on your machine: `az login` (subscription with the
> `gennoor-tech` App Service) and `gh auth login` (repo access).

### 6.1 Find your resource group (once)

```bash
az webapp list --query "[?name=='gennoor-tech'].{name:name, rg:resourceGroup, state:state, host:defaultHostName}" -o table
# Put the rg value into RG below.
```

### 6.2 Check ALL runtime settings the code reads

```bash
RG="<your-resource-group>"   # from 6.1
APP="gennoor-tech"

REQUIRED_VARS=(
  # Storage + email (every form, analytics, media)
  AZURE_STORAGE_CONNECTION_STRING AZURE_COMMUNICATION_CONNECTION_STRING
  EMAIL_FROM_INFO EMAIL_FROM_TRAINING EMAIL_FROM_ENQUIRY EMAIL_FROM_SCHEDULE
  EMAIL_FROM_SALES EMAIL_FROM_WEBINAR EMAIL_ADMIN
  # Auth (CRM/admin)
  NEXTAUTH_SECRET NEXTAUTH_URL AZURE_AD_CLIENT_ID AZURE_AD_CLIENT_SECRET AZURE_AD_TENANT_ID
  # Graph / Bookings
  MS_GRAPH_CLIENT_ID MS_GRAPH_CLIENT_SECRET MS_GRAPH_TENANT_ID MS_BOOKINGS_BUSINESS_ID
  OUTLOOK_SENDER_MAILBOX
  # AI (bot, readiness, copilot)
  AZURE_OPENAI_ENDPOINT AZURE_OPENAI_API_KEY AZURE_OPENAI_DEPLOYMENT AZURE_OPENAI_API_VERSION
  AZURE_OPENAI_READINESS_ENDPOINT AZURE_OPENAI_READINESS_KEY AZURE_OPENAI_READINESS_DEPLOYMENT
  FOUNDRY_API_KEY FOUNDRY_OPENAI_BASE
  # Speech (readiness narration + academy TTS)
  AZURE_SPEECH_KEY AZURE_SPEECH_REGION AZURE_SPEECH_ACADEMY_KEY AZURE_SPEECH_ACADEMY_REGION
  # Learner system
  LEARNER_JWT_SECRET
  # Media + misc
  NEXT_PUBLIC_BLOB_URL YOUTUBE_API_KEY APPLICATIONINSIGHTS_CONNECTION_STRING
  NEXT_PUBLIC_GA_MEASUREMENT_ID CRM_CRON_SECRET
)

HAVE=$(az webapp config appsettings list -g "$RG" -n "$APP" --query "[].name" -o tsv)
for v in "${REQUIRED_VARS[@]}"; do
  echo "$HAVE" | grep -qx "$v" && echo "OK       $v" || echo "MISSING  $v"
done
```

Set a missing one (value never echoes back once set):

```bash
az webapp config appsettings set -g "$RG" -n "$APP" --settings NAME="value"
```

### 6.3 Sanity-check the Azure resources behind the settings

```bash
# Table Storage — enquiry/analytics tables exist and are reachable
az storage table list --connection-string "$(az webapp config appsettings list -g "$RG" -n "$APP" --query "[?name=='AZURE_STORAGE_CONNECTION_STRING'].value" -o tsv)" -o table

# Azure Communication Services — the email domain/sender must be verified
az communication list -o table
az communication email domain list --email-service-name <acs-email-service> -g "$RG" -o table 2>/dev/null || echo "check ACS email domains in the portal"

# App Service is running + latest deploy state
az webapp show -g "$RG" -n "$APP" --query "{state:state, lastModified:lastModifiedTimeUtc}" -o table
az webapp log deployment show -g "$RG" -n "$APP" 2>/dev/null | tail -20
```

### 6.4 GitHub side (gh CLI)

```bash
REPO="lostspace003/gennoor-tech"

# Secrets the workflows reference — names only (values are write-only)
gh secret list -R "$REPO"

# Compare against the list in §4 above; set any missing:
gh secret set NAME -R "$REPO"        # prompts for the value

# Latest pipeline runs on main
gh run list -R "$REPO" --branch main --limit 5
gh run view -R "$REPO" --log-failed   # if the latest failed
```

### 6.5 New-in-this-release checks (webinars + footer newsletter)

```bash
# EMAIL_FROM_WEBINAR present? (6.2 covers it) Then live-test the endpoint:
curl -s -X POST https://gennoor.com/api/webinar-register \
  -H 'Content-Type: application/json' \
  -d '{"name":"Wiring Test","email":"<your-email>","webinarId":"wiring-test","webinarTitle":"Wiring Test"}'
# Expect {"success":true,...}, a confirmation email to you, an admin email,
# and a WebinarRegistration row in Table Storage. Delete the test row after.
```

---

## 7. Post-deploy verification script (run once after merge)

1. **Contact form** → submit on `/contact` → expect confirmation UI + email
   to `EMAIL_ADMIN` + entry in Table Storage (`ContactEnquiry`).
2. **Booking** → book a slot at `/contact#book` → expect Microsoft Bookings
   confirmation.
3. **Training enquiry** → open a bootcamp card → Enquire → submit → email.
4. **Newsletter (footer AND blog)** → enter email → OTP arrives → verify →
   Subscribe → success state.
5. **Webinar (NEW)** — publish a test event in `src/data/webinars.ts`,
   deploy, register with your own email → expect confirmation from
   `EMAIL_FROM_WEBINAR` + admin notification + `WebinarRegistration` row in
   Table Storage. Then remove the test event.
6. **Academy** → open a chapter → play, scrub back/forward, fullscreen (F),
   let a chapter auto-advance → claim a certificate with OTP on a test
   completion.
7. **CRM** → log in → "New lead" header button opens the add-lead modal →
   inbox badge updates → copilot answers.
8. **GennoorCare bot** → open the bubble, ask a question, leave contact
   details → lead appears in CRM + admin email.
