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

## AI Weekend (`/ai-weekend`)

A live two-day workshop on the last Saturday and Sunday of every month. The public page shows the next dates by itself and moves on to the following month once a weekend has started.

- **Everything on the page** (name, fee ₹499 against a regular ₹1,999, 1,000 seats, times, the two days, questions) is in `src/data/ai-weekend.ts`.
- **Registrations** are kept apart from CRM leads, in the blob `crm-data/weekend/registrations.json`. Each person gets a confirmation email and `admin@` gets a notice. The form closes for the month when the seats are taken.
- **Staff desk** `/admin/weekend`, two tabs. **People**: who registered for each month, where they came from, payment (set by hand until online payment is added), which emails each person has had, Excel download. **Emails**: the weekend's own five emails, each previewed before sending:
  1. *Invitation* to people you paste in (up to 200 at a time; anyone already registered or invited is skipped).
  2. *How to pay* to those who have not paid. Once the payment details are saved, it is also sent automatically when someone registers.
  3. *Reminder* to everyone registered.
  4. *Joining link* to those who have paid.
  5. *The kit* to those who have paid, after the weekend.
  The text is in `src/lib/weekend-emails.ts`. These are separate from the CRM email series, and weekend registrations are not added to CRM leads.
- **Not built yet:** online payment. There is no payment provider in this repository.

## CRM (`/crm`, staff only)

Built around one job: get a lead, send them the email series, answer when they reply.

| Page | What you do there |
|---|---|
| **Today** `/crm/queue` | The whole job, top to bottom: 1 replies to answer, 2 new leads to pick up, 3 emails due to send, 4 leads that are waiting. |
| **Leads** `/crm/leads` | The list. Filter by organization, step or owner. Add a lead by hand, **Import** a lead sheet, or **Find on LinkedIn**. |
| **Replies** `/crm/inbox` | Mail from leads, read from the Microsoft 365 mailboxes. |
| **Meetings** `/crm/scheduler` | Teams meetings booked with leads; move or cancel them. |
| **Email series** `/crm/emails` | The nine emails, when each goes out, and how each looks. |
| **Call guide** `/crm/playbook` | What to say on a call, how to answer push-back, and the ten-slide presentation (`src/lib/crm/playbook.ts`). |
| More | Website enquiries · Files · Team (managers) · GennoorCare (managers). |

**A lead has one step:** New → Emailing → Talking → Proposal → Customer, or Closed. Sending the first email moves it to Emailing; booking a meeting moves it to Talking; the rest is set by hand on the lead page. A lead nobody holds is *unassigned*; a lead not worth working is *archived* (restorable).

**The lead sheet** has eight columns: Name, Email, Phone, Organization, Designation, Country, LinkedIn, Notes. Only Name is required. Download it from Leads. Common heading names are recognised; a lead already in the CRM is updated, never added twice.

**The email series** is nine fixed emails over about four months (`src/lib/crm/sequence.ts` for the plan, `src/lib/crm/sequence-emails.ts` for the text). Each is previewed before it is sent, can carry one personal line, leaves as `sales@gennoor.com` with `admin@` and the sender copied, and is never sent twice to the same lead. Email 2 attaches the Excel catalogue. Every email tells the reader to reply "stop"; use **Stop the emails** on the lead when they do.

**LinkedIn** runs through the LinkedIn hub's saved sign-in and shares its daily limits. *Find on LinkedIn* searches people and adds the ticked ones as leads. On a lead, *Connect* and *Message* send one prepared text at a time, started by a person.

**Who has access** is one list: `src/lib/crm/users.ts`. The sign-in check, the route guard, the API and the screens all read it.

AI is used in one place only: *Write a draft* when replying to a lead (Azure AI Foundry). The series emails are fixed text.

Email 4 carries an animated picture (`public/email/less-classroom-time.gif`, rebuilt with `python scripts/email-gif.py`). Its first frame is the finished picture, because Outlook on Windows shows only that frame.

A morning digest email is sent Monday to Saturday at 06:30 IST. Checks: `npx tsx scripts/crm-flow-test.ts` (add `--out <folder>` to write each email as an HTML file).

## Admin centre (`/admin`, staff only)

The menu is grouped by the job being done: Home (Dashboard, Work history, Costs) · Sales (CRM, AI Weekend, Events, Tech calls) · LinkedIn (hub, Autopilot, Connection) · Content (Social studio, Blog studio, Cert videos) · Learners (Learning Studio, Community, Blog comments, GennoorCare chats) · Settings (Mailboxes). The Dashboard's own sections stay folded away unless you are on the Dashboard.

Every "i" button explains its control in plain words. Side-by-side panels in the Social studio, Blog studio and LinkedIn hub have a draggable divider (arrow keys work too) and remember their width.

The menu on the left is open by default (collapse it with the round button; on phones it is a drawer behind the hamburger). **Dashboard** expands into its own sections (Analytics, Communications, Bookings, System) and their tabs, and each page shows where you are with one-click pills for the connected pages of its section. Moving between pages uses a thin progress line and a quick fade.

| Page | What you do there |
|---|---|
| **Dashboard** | Analytics for the site, opened from the Dashboard section of the menu: Overview, Traffic, Insights, Academy, Certificates, Course feedback · Enquiries, Cowork, Emails, Comments · Bookings · Storage, SEO health, Indexing, Auth log, Setup. Days filter, live visitors, CSV exports, auto-refresh, CRM and GennoorCare summaries on the Overview. |
| **Cost centre** `/admin/costs` | Azure spend for the whole subscription by billing month (the 13th to the 12th), quarter, week or day; split by service, resource group, type or region; INR or USD. |
| **Sessions** `/admin/sessions` | One timeline of everything done in the studios and LinkedIn hub, grouped into work sessions, with links to resume. |
| **Social studio** `/admin/social` | Draft LinkedIn posts, polls and webinar announcements from a topic, notes and attached sources (links, PDFs, Word, images). Edit in a LinkedIn-style card, revise with AI, generate or animate images, build motion graphics (GIF/MP4), run the AI agent team, approve, then publish to your profile or the company page. Published posts can be edited and updated or re-posted. Every visual carries the Gennoor logo and website. AI cost is shown per draft and per month. |
| **Blog studio** `/admin/blog` | Write articles by hand or let the AI team research and write them in the blog's exact format with tl;dr, takeaways, FAQs, sources, category and tags (existing or new). **Approve & publish** opens the GitHub pull request, merges it automatically (a Merge button is there if GitHub needs a nudge), waits for the site to go live, then shares the article on the company page, after which your profile reposts it with a short note (switchable to its own post). Every share gets a meaningful first comment from its author. A **daily blog autopilot** does all of this by itself every day: research, write, review (revising up to twice), approve, publish and share; if a draft still fails review it is held for you instead. |
| **LinkedIn autopilot** `/admin/autopilot` | Researches what the industry is discussing, writes four posts a day (seven days a week), and publishes each at its slot unless you posted it first. The company page posts first, your profile reposts it with a short note (or posts its own version, a setting on the page), and every post gets a meaningful first comment. Safeguards: quality gate, banned-topic screen, retries, no double posts, missed-window skip, token-expiry alerts, review-only mode, and one switch to turn it off. Weekday and weekend slots are editable. |
| **LinkedIn hub** `/admin/linkedin-hub` | Home has one search box (people, companies, posts, jobs, messages); the status and today's limits stay at the top of every tab; people results can be ticked and added to the CRM. Feed, people, inbox, companies and jobs through a saved LinkedIn login, with daily safety limits and a history. Tick-box dropdowns for places (19 countries, cities in brackets) and profile sections; people results shown as a clean table with clickable names. The **Prospecting** tab finds work emails (Vibe Prospecting) and every people table downloads as Excel. Searches take plain words (pasted profile, company and job links work too), with quick-start examples and "i" tips on every field. Results are shown as clean headings and bullets, can be copied with formatting kept, and can be emailed to any address. |
| **LinkedIn connection** `/admin/linkedin` | Connect your profile and the company page, and share blog posts (each share gets a first comment). Warns before either login expires. |
| **Learning Studio** `/admin/lms` | Import and manage Learning Studio courses. |
| **Comments / Community** | Moderate blog comments and learner community posts and reviews. |
| **Tech calls / Mailboxes** | Technical-call requests, and the status of every sending and receiving mailbox. |

## Automation at a glance

One scheduled heartbeat (`autopilot.yml`, every 15 minutes) drives all of it. Each part has its own switch in the admin centre and does nothing while off.

| What | How it behaves |
|---|---|
| **LinkedIn autopilot** | Researches what is being discussed across Microsoft, Google, AWS, OpenAI, Anthropic and open source, drafts four posts a day (weekday slots 08:30, 12:30, 17:30, 20:30 IST; weekend slots 09:30, 12:30, 17:00, 20:00), and publishes each at its slot to the company page and, 45 minutes later, your profile reposts it with a short note of its own (or posts its own version, if you choose that). Each post gets a meaningful first comment. Anything you post yourself first is skipped. On by default. |
| **Quality gate** | A reviewer must pass each draft (up to two rewrites). A banned-word screen runs on every draft. Failures are held and emailed, never posted. Missed slots are skipped, not posted late. Retries with back-off; locks prevent double posts. |
| **Blog publishing flow** | **Approve & publish** opens the pull request and merges it; after the deploy, the article link goes out with a short post on the company page and on your profile. The Blog studio shows each step and a Merge button if needed. |
| **Daily blog autopilot** | Every day at 09:00 IST: research a fresh topic, write the article, review it (up to two revisions), approve, publish and share. A draft that still fails review is held and emailed. On by default. |
| **LinkedIn post format** | All posts share one format (see Content rules below). |

## Architecture

```
Browser ──> Next.js app (Azure App Service)
              ├─ Azure Blob/Table Storage    CRM data, drafts, spend ledger, LMS content
              ├─ Qdrant                      course index
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
- **Prospecting:** `PROSPECTING_API_KEY` (optional "Server default" key; more keys are added in the hub's Prospecting tab)
- **LinkedIn:** `LINKEDIN_CLIENT_ID/SECRET`, `LINKEDIN_PAGE_CLIENT_ID/SECRET`, `STUDIO_AGENTS_URL`, `STUDIO_AGENTS_KEY`
- **Publishing and automation:** `GITHUB_TOKEN`, `GITHUB_REPO`, `CRM_CRON_SECRET`
- **Cost centre:** `AZURE_COST_SUBSCRIPTION_ID`, `AZURE_BILLING_CYCLE_DAY`, `AZURE_COST_USD_INR`
- **Analytics and SEO:** `APPINSIGHTS_*`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `GOOGLE_SERVICE_ACCOUNT_KEY`

## Prospecting: get an API key

Vibe Prospecting runs on Explorium, so the key comes from there.

1. Go to **admin.explorium.ai** and sign in.
2. Open **Access & Authentication** in the left menu.
3. Click **Getting Your API Key** and copy the key.
4. In the hub, open the **Prospecting** tab, paste it under "Add or replace a key", name it and press **Add and connect**. It is checked at once and shows its credits.
5. Run a People search, then use **Find email** on a person or **Find emails for all**. Each email costs about 2 credits. **Download Excel** saves the table.

Add several keys and the one marked *In use* runs first; if it runs out of credits the next takes over. Keys are stored encrypted and only their last 4 characters are ever shown. To replace one, add the new key and remove the old.

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

## Sales material: what to say, and the rules

The email series in the CRM is the written pitch. Calls and presentations follow the same order.

**The pitch, in order**
1. The Learning Studio is open to their team today: full courses, labs, quizzes, a certificate.
2. Sample courses to open, and the Excel catalogue.
3. Training built around their organization, on our platform or one set up for them (custom voice and digital presenter, an assistant, a question board).
4. Less classroom time: lessons and labs alone, trainer time for questions.
5. Claude: certification preparation, team training, automation.
6. Support after the training: a doubt desk answered by a trainer.

**Rules for anything sent to a lead**
- No prices. Cost depends on team size and scope; give a range on a call, after asking how many people, which teams, on site or remote, and when.
- No customer names without written consent. No invented numbers.
- Claude Partner Network: only "Gennoor is Certified in the Claude Partner Network." Badge unaltered, PNG in email, linked to claude.com/partners. Full rules: `Gennoor-CPN-Certified-Kit/cpn/PRESENTATION-GUIDE.md`.
- One next step per email or call.

**A call:** ask permission, let them talk for most of it (team size, teams, location, timeline, what blocks them), link one offering to what they said, book the next step from the lead's Meeting tab.

**A presentation (about 10 slides):** their situation in their words · the cost of standing still · the outcome · how we deliver · the recommended programme · proof · credentials · plan and timeline · investment range · next step with a date.

**To confirm before relying on it**
- The emails say classroom time can fall by "about 60%" as an aim, and describe a custom learning platform, a custom voice and digital presenter, and a doubt desk. The public website does not yet describe these, so a lead who looks will not find them there.
- The emails call the Learning Studio "at no charge". The content rules below say not to describe courses as free because they may become paid. Decide which holds, and change `sequence-emails.ts` or the rule.

## More documentation

[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) · [`docs/DESIGN-SYSTEM.md`](docs/DESIGN-SYSTEM.md) · [`docs/lms-course-format.md`](docs/lms-course-format.md) · [`docs/course-index.md`](docs/course-index.md) · [`docs/FOLLOW-UPS.md`](docs/FOLLOW-UPS.md)
