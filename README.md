# Gennoor Tech

The website, learning platform, CRM and admin centre for **Gennoor Tech**: enterprise AI and Microsoft training, certification preparation and AI consulting.
Live at [gennoor.com](https://www.gennoor.com).

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS · Azure App Service · Azure Blob/Table Storage · Qdrant · Azure AI Foundry · Microsoft Agent Framework (Python services on Azure Container Apps).

---

## What is on the website

| Area | Routes | What it does |
|---|---|---|
| **Home & About** | `/`, `/about`, `/about/founder`, `/about/certifications` | Company story, founder profile, certifications held. |
| **Training** | `/training`, `/services/training`, `/contact` | Instructor-led corporate training catalogue, custom-training enquiries, training offer banner. |
| **Certifications** | `/services/certifications`, `/guides/*` | Certification services and exam guides (AI-102, AI-103, MS-4004, PL-300). |
| **Academy** | `/academy`, `/academy/courses`, `/academy/dashboard`, `/ai-academy/[courseId]` | Self-paced academy courses with chapters, PDFs and audio. |
| **Learning Studio** | `/studio`, `/studio/[slug]`, `/studio/[slug]/learn`, `/studio/[slug]/discussion` | Course catalogue, video lessons with quizzes, progress and resume, ratings, community discussion, certificates. |
| **Certificate verification** | `/verify/[certId]` | Public page that confirms a certificate is genuine. |
| **Claude** | `/claude/courses`, `/workshops/claude-cowork` | Claude training courses and the Cowork workshop registration. |
| **Webinars & workshops** | `/webinars`, `/workshops` | Upcoming sessions and registration. |
| **Blog** | `/resources/blog`, `/resources/blog/[slug]`, `/resources/calendar` | 60 articles with tl;dr, key takeaways, FAQs, references, comments, categories and tags. |
| **Community** | `/community`, `/join` | Learner community and sign-up. |
| **Automation** | `/automation` | AI automation services. |
| **Tech call** | `/tech-call/respond` | Visitors answer a technical-call invitation. |
| **Assistants** | site-wide | GennoorBot and GennoorCare answer questions from the site's own content (vector retrieval). |
| **Legal** | `/privacy`, `/terms` | Privacy policy and terms. |
| **SEO** | `/sitemap.xml`, `/sitemap-index`, `/robots.txt` | Sitemap, IndexNow and Search Console resubmits run after each deploy. |

Every public form records where the visitor came from (campaign tag, referrer, landing page) and saves it to the CRM.

## CRM (`/crm`, staff only)

Dashboard · Leads (search is semantic, backed by Qdrant) · Pipeline · Inbox (Microsoft 365 mail) · Enquiries (status, notes, source counts) · Documents · Queue · Scheduler (meetings via Microsoft Bookings/Graph) · Team · Bot log. A morning digest email is sent Monday to Saturday at 06:30 IST.

## Admin centre (`/admin`, staff only)

The menu on the left is open by default (collapse it with the round button; on phones it is a drawer behind the hamburger). **Dashboard** expands into its own sections (Analytics, Communications, Bookings, System) and their tabs, and each page shows where you are with one-click pills for the connected pages of its section. Moving between pages uses a thin progress line and a quick fade.

| Page | What you do there |
|---|---|
| **Dashboard** | Analytics for the site, opened from the Dashboard section of the menu: Overview, Traffic, Insights, Academy, Certificates, Course feedback · Enquiries, Cowork, Emails, Comments · Bookings · Storage, SEO health, Indexing, Auth log, Setup. Days filter, live visitors, CSV exports, auto-refresh, CRM and GennoorCare summaries on the Overview. |
| **Cost centre** `/admin/costs` | Azure spend for the whole subscription by billing month (the 13th to the 12th), quarter, week or day; split by service, resource group, type or region; INR or USD. |
| **Sessions** `/admin/sessions` | One timeline of everything done in the studios and LinkedIn hub, grouped into work sessions, with links to resume. |
| **Social studio** `/admin/social` | Draft LinkedIn posts, polls and webinar announcements from a topic, notes and attached sources (links, PDFs, Word, images). Edit in a LinkedIn-style card, revise with AI, generate or animate images, build motion graphics (GIF/MP4), run the AI agent team, approve, then publish to your profile or the company page. Published posts can be edited and updated or re-posted. Every visual carries the Gennoor logo and website. AI cost is shown per draft and per month. |
| **Blog studio** `/admin/blog` | Write articles by hand or let the AI team research and write them in the blog's exact format with tl;dr, takeaways, FAQs, sources, category and tags (existing or new). **Approve & publish** opens the GitHub pull request, merges it automatically (a Merge button is there if GitHub needs a nudge), waits for the site to go live, then shares the article link with a short post on the company page and your profile. A **daily blog autopilot** does all of this by itself every day: research, write, review (revising up to twice), approve, publish and share; if a draft still fails review it is held for you instead. |
| **LinkedIn autopilot** `/admin/autopilot` | Researches what the industry is discussing, writes four posts a day (seven days a week), and publishes each at its slot unless you posted it first. Safeguards: quality gate, banned-topic screen, retries, no double posts, missed-window skip, token-expiry alerts, review-only mode, and one switch to turn it off. Weekday and weekend slots are editable. |
| **LinkedIn hub** `/admin/linkedin-hub` | Feed, people, inbox, companies and jobs through a saved LinkedIn login, with daily safety limits and an activity log. |
| **LinkedIn connection** `/admin/linkedin` | Connect your profile and the company page, and share blog posts. |
| **Learning Studio** `/admin/lms` | Import and manage Learning Studio courses. |
| **Comments / Community** | Moderate blog comments and learner community posts and reviews. |
| **Tech calls / Mailboxes** | Technical-call requests, and the status of every sending and receiving mailbox. |

## Automation at a glance

One scheduled heartbeat (`autopilot.yml`, every 15 minutes) drives all of it. Each part has its own switch in the admin centre and does nothing while off.

| What | How it behaves |
|---|---|
| **LinkedIn autopilot** | Researches what is being discussed across Microsoft, Google, AWS, OpenAI, Anthropic and open source, drafts four posts a day (weekday slots 08:30, 12:30, 17:30, 20:30 IST; weekend slots 09:30, 12:30, 17:00, 20:00), and publishes each at its slot to the company page and, 45 minutes later with a different opening line, to your profile. Anything you post yourself first is skipped. On by default. |
| **Quality gate** | A reviewer must pass each draft (up to two rewrites). A banned-word screen runs on every draft. Failures are held and emailed, never posted. Missed slots are skipped, not posted late. Retries with back-off; locks prevent double posts. |
| **Blog publishing flow** | **Approve & publish** opens the pull request and merges it; after the deploy, the article link goes out with a short post on the company page and on your profile. The Blog studio shows each step and a Merge button if needed. |
| **Daily blog autopilot** | Every day at 09:00 IST: research a fresh topic, write the article, review it (up to two revisions), approve, publish and share. A draft that still fails review is held and emailed. On by default. |
| **LinkedIn post format** | All posts share one format (see Content rules below). |

## Architecture

```
Browser ──> Next.js app (Azure App Service)
              ├─ Azure Blob/Table Storage    CRM data, drafts, spend ledger, LMS content
              ├─ Qdrant                      CRM lead search and course index
              ├─ Azure Communication Email   transactional email
              ├─ Microsoft Graph             mail, meetings, Bookings
              ├─ Azure AI Foundry            chat, web search, image generation
              ├─ ca-gennoor-vector           embeddings + FAISS retrieval service (Container App)
              └─ ca-gennoor-studio           Python agent service (Container App)
                                              ├─ Microsoft Agent Framework pipelines (research, write, design, review)
                                              ├─ Motion-graphic renderer (GIF/MP4) and logo footer
                                              └─ ca-gennoor-linkedin-mcp  LinkedIn connector (internal only)
```

Deeper diagrams: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md), [`docs/gennoor-system-guide.md`](docs/gennoor-system-guide.md).

## Repository layout

| Path | Contents |
|---|---|
| `src/app` | Pages and API routes (`api/admin/*` for the admin centre, `api/cron/*` for scheduled jobs). |
| `src/components` | UI components (`admin/` shared admin shell, `crm/`, `academy/`, `home/` ...). |
| `src/lib` | Server logic: CRM, LMS, LinkedIn, social and blog studios (`social/`), autopilot (`autopilot/`), Azure cost reader, email. |
| `src/data` | Content as code: blog posts, academy courses, certifications, training programs, webinars. |
| `services/studio-agents` | Python agent service: pipelines, renderer, LinkedIn connector client. |
| `services/vector` | Python embeddings and FAISS retrieval service. |
| `scripts` | Course build tools, SEO helpers, LinkedIn connector setup and sign-in, autopilot tests. |
| `docs` | Architecture, design system, Learning Studio course format, indexing guides. |
| `.github/workflows` | CI/CD and scheduled jobs. |
| `Gennoor-CPN-Certified-Kit` | Claude Partner Network badges and launch kit. |

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values you need
npm run dev                  # http://localhost:3000
npm run build                # production build
npx tsx scripts/autopilot-test.ts          # LinkedIn autopilot safeguard tests
npx tsx scripts/blog-automation-test.ts    # blog publishing flow and daily blog autopilot tests
npx tsx scripts/linkedin-format-test.ts    # LinkedIn post formatting tests
```

The admin centre needs sign-in with an authorised work account. Most features degrade gracefully when an optional setting is missing.

## Configuration

Names only; set them in `.env.local` locally and in App Service settings in production. Never commit values.

- **Auth:** `AUTH_SECRET`, `NEXTAUTH_URL`, `AZURE_AD_*`, `GOOGLE_CLIENT_ID`, `LEARNER_*`
- **Storage:** `AZURE_STORAGE_CONNECTION_STRING`, `LMS_STORAGE_CONNECTION_STRING`, `NEXT_PUBLIC_BLOB_URL`
- **Email and Microsoft 365:** `AZURE_COMMUNICATION_CONNECTION_STRING`, `EMAIL_FROM_*`, `MS_GRAPH_*`, `MS_BOOKINGS_BUSINESS_ID`
- **AI:** `FOUNDRY_API_KEY`, `FOUNDRY_OPENAI_BASE`, `FOUNDRY_*_MODEL`, `FOUNDRY_IMAGE_DEPLOYMENT`, `AZURE_OPENAI_*`; cost estimates via `FOUNDRY_TEXT_USD_IN`, `FOUNDRY_TEXT_USD_OUT`, `FOUNDRY_IMAGE_USD`
- **Search and retrieval:** `QDRANT_*`, `VECTOR_SERVICE_URL`, `VECTOR_API_KEY`
- **LinkedIn:** `LINKEDIN_CLIENT_ID/SECRET`, `LINKEDIN_PAGE_CLIENT_ID/SECRET`, `STUDIO_AGENTS_URL`, `STUDIO_AGENTS_KEY`
- **Publishing and automation:** `GITHUB_TOKEN`, `GITHUB_REPO`, `CRM_CRON_SECRET`
- **Cost centre:** `AZURE_COST_SUBSCRIPTION_ID`, `AZURE_BILLING_CYCLE_DAY`, `AZURE_COST_USD_INR`
- **Analytics and SEO:** `APPINSIGHTS_*`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `GOOGLE_SERVICE_ACCOUNT_KEY`

## Scheduled jobs (GitHub Actions)

| Workflow | When | Does |
|---|---|---|
| `deploy.yml` | Push to `main` | Build, test, deploy to Azure App Service. |
| `autopilot.yml` | Every 15 minutes | One heartbeat for the LinkedIn autopilot, the blog publishing flow (merge, live, share) and the daily blog autopilot; each does nothing while switched off. |
| `crm-digest.yml` | Mon to Sat, 06:30 IST | Sends the CRM morning digest. |
| `seo-reindex.yml` | Every 4 days | Resubmits URLs to Bing and Google. |
| `site-index.yml` | Monthly | Refreshes the assistant's site index. |

## Deploying

- **Website:** merge to `main`. The pipeline builds and deploys automatically.
- **Agent service:** `az acr build -r <registry> -t gennoor-studio:<tag> services/studio-agents`, then `az containerapp update -n ca-gennoor-studio --image <registry>.azurecr.io/gennoor-studio:<tag>`.
- **LinkedIn connector:** `scripts/linkedin-mcp-setup.ps1` creates it once; `scripts/linkedin-mcp-login.ps1` signs in once (the saved login lasts about a year and lives on Azure storage).

## Operations

- **Reconnect LinkedIn:** logins last about 60 days. On `/admin/linkedin` press **Reconnect (member)** and **Connect + company page**. Automation emails you a week before they expire.
- **LinkedIn hub sign-in:** done once with `scripts/linkedin-mcp-login.ps1` (you type your own password in a secure browser view). The saved login lasts about a year.
- **Switch things off:** the big toggle on `/admin/autopilot`, and the On/Off switch in the Blog studio. Nothing is posted while off.
- **Where state lives (Azure Blob container `crm-data`):** `social/drafts.json`, `social/spend.json` (AI cost ledger), `autopilot/state.json`, `blog/drafts.json`, `blog/automation.json`, `linkedin.json` (login tokens).
- **Agent service settings (Container App):** `STUDIO_API_KEY`, `FOUNDRY_API_KEY`, `FOUNDRY_OPENAI_BASE`, `FOUNDRY_WEB_MODEL`, `LINKEDIN_MCP_URL`; optional `LI_MIN_GAP_SECONDS`, `LI_CACHE_SECONDS`, `BRAND_SITE`.
- **Publishing from the Blog studio** needs `GITHUB_TOKEN` on the site with permission to create branches, commits and pull requests (and to merge) on this repository.

## Content rules

- Do not describe courses, cards, videos or search data as "free"; courses may become paid.
- Guides and blog posts are authored by the Gennoor Technical Team, not an individual.
- Cards and their links stay aligned: icon, title, text, then the card's own link, centred, the same on every page.
- Course and quiz text is markdown; see [`docs/lms-course-format.md`](docs/lms-course-format.md).
- The credentials list lives in `src/data/credentials.ts`.
- Every LinkedIn post (written by hand, by AI, by the autopilot, or the blog-share posts) is formatted by `src/lib/linkedin-format.ts`: bold Unicode opening line, short paragraphs, quiet `▪` bullets, no emoji except an occasional 💡 (plus `⚙` / `🔒`), and one tidy hashtag line. The "Format for LinkedIn" button in the Social studio applies it on demand, and it is applied again automatically just before publishing.

## More documentation

[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) · [`docs/DESIGN-SYSTEM.md`](docs/DESIGN-SYSTEM.md) · [`docs/lms-course-format.md`](docs/lms-course-format.md) · [`docs/course-index.md`](docs/course-index.md) · [`docs/FOLLOW-UPS.md`](docs/FOLLOW-UPS.md)
