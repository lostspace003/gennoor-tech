# Gennoor Tech — End-to-End Architecture

> Enterprise AI Training & Solutions platform.
> **Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind · deployed on **Vercel**, backed by **Microsoft Azure** services.
> _Last generated: 2026-06-18_

---

## 1. System Context (C4 Level 1)

How the platform sits between its users and the external services it depends on.

```mermaid
graph TB
    subgraph Users
        V[Website Visitor / Lead]
        L[Academy Learner]
        A[Admin / Staff<br/>Gennoor team]
    end

    APP([Gennoor Tech Platform<br/>Next.js 16 on Vercel])

    subgraph External["External & Azure Services"]
        OAI[OpenAI API<br/>AI Readiness & extraction]
        ACE[Azure Communication<br/>Email]
        GRAPH[Microsoft Graph<br/>Bookings + Sent Items]
        ENTRA[Microsoft Entra ID<br/>Admin SSO]
        GOOG[Google OAuth<br/>Learner login]
        TABLES[(Azure Table Storage)]
        BLOB[(Azure Blob Storage)]
        SPEECH[Azure Speech<br/>Academy audio]
        AI_INS[Azure App Insights<br/>+ GA4]
        SEO[IndexNow / Google<br/>Search Console]
    end

    V --> APP
    L --> APP
    A --> APP

    APP --> OAI
    APP --> ACE
    APP --> GRAPH
    APP --> ENTRA
    APP --> GOOG
    APP --> TABLES
    APP --> BLOB
    APP --> SPEECH
    APP --> AI_INS
    APP --> SEO
```

---

## 2. Container / Deployment Architecture (C4 Level 2)

The runtime shape: one Next.js app, split into Edge + Node runtimes, fronted by Vercel's CDN.

```mermaid
graph TB
    Client[Browser<br/>React 19 · Tailwind · framer-motion · recharts]

    subgraph Vercel["▲ Vercel Platform"]
        CDN[Edge CDN<br/>static assets · ISR cache]
        MW[Edge Middleware<br/>middleware.ts<br/>routing + pageview hooks]

        subgraph NextApp["Next.js 16 App Router"]
            RSC[Server Components<br/>marketing · academy · admin pages]
            CC[Client Components<br/>interactive UI]
            API[Route Handlers<br/>/api/* — Node runtime]
        end
    end

    subgraph AzureCloud["Microsoft Azure"]
        TS[(Table Storage<br/>PageViews · Certificates<br/>EmailLogs · Sessions<br/>Feedback · Registrations)]
        BS[(Blob Storage<br/>website-content<br/>certificates · media · PDFs)]
        ACE[Communication Email]
        SP[Speech Service]
        INS[Application Insights]
    end

    subgraph SaaS["Identity & AI"]
        ENTRA[Entra ID — Admin]
        GRAPH[MS Graph — Bookings]
        GOOG[Google OAuth — Learner]
        OAI[OpenAI API]
    end

    Client <--> CDN
    Client <--> MW
    MW --> RSC
    RSC --> CC
    Client <--> API

    API --> TS
    API --> BS
    API --> ACE
    API --> SP
    API --> OAI
    API --> GRAPH
    API --> ENTRA
    API --> GOOG
    RSC --> TS
    RSC --> BS
    NextApp -.telemetry.-> INS
    NextApp -.telemetry.-> GOOG
```

---

## 3. Application Layers

```
┌──────────────────────────────────────────────────────────────────────┐
│  PRESENTATION  ── src/app/**  (App Router pages)                       │
│  Marketing (services, industries, solutions, about, resources/blog)   │
│  Academy / ai-academy (courses, dashboard, player)                    │
│  Admin console (/admin/*)  ·  Verify (/verify/[certId])               │
│  Components: src/components/{home,academy,portal,booking,ui,...}      │
├──────────────────────────────────────────────────────────────────────┤
│  API / ROUTE HANDLERS  ── src/app/api/**  (Node runtime)              │
│  auth · learner · admin · ai-readiness(+v2) · bookings · certificates │
│  blog-comments · *-enquiry · send-otp/verify-otp · content/media proxy│
├──────────────────────────────────────────────────────────────────────┤
│  DOMAIN / SERVICES  ── src/lib/**                                     │
│  auth.ts · learner-auth.ts · admin-auth.ts   (identity)              │
│  azure-storage.ts · azure-blobs.ts           (persistence)          │
│  email-service.ts · microsoft-graph.ts       (comms + bookings)     │
│  certificates.ts · certificate-pdf.ts        (credentials)          │
│  progress-store.ts · course-feedback.ts      (learning)             │
│  analytics.ts · app-insights.ts · rate-limit.ts (cross-cutting)     │
├──────────────────────────────────────────────────────────────────────┤
│  DATA / CONTENT  ── src/data/**  ·  src/config/**                    │
│  Static course content, blog posts, authors, course catalog (in-repo)│
└──────────────────────────────────────────────────────────────────────┘
```

---

## 4. Identity Model — two separate auth systems

```mermaid
graph LR
    subgraph Admin["Admin Auth — NextAuth v5"]
        A1[/admin/login/] --> A2[Microsoft Entra ID<br/>OAuth/OIDC]
        A2 --> A3{email in<br/>ALLOWED_USERS?}
        A3 -- yes --> A4[Admin session cookie<br/>middleware-guarded /admin/*]
        A3 -- no --> A5[Reject]
    end

    subgraph Learner["Learner Auth — custom JWT (jose)"]
        L1[Academy login] --> L2{Provider}
        L2 --> L3[Email OTP]
        L2 --> L4[Google OAuth]
        L2 --> L5[Microsoft]
        L3 & L4 & L5 --> L6[Signed JWT<br/>learner-session cookie · 30d]
    end
```

- **Admin** → `next-auth@5` + Microsoft Entra ID, restricted to an allow-list (`AZURE_AD_ALLOWED_USERS`), enforced by `middleware.ts` on `/admin/*`.
- **Learner** → self-issued HS256 JWT in an httpOnly cookie (`src/lib/learner-auth.ts`); three login paths: **OTP** (email code), **Google**, **Microsoft**.

---

## 5. Key End-to-End Flows

### 5a. AI Readiness Assessment (lead-gen + GenAI)

```mermaid
sequenceDiagram
    participant U as Visitor
    participant FE as AI Readiness UI
    participant API as /api/ai-readiness/generate
    participant OAI as OpenAI
    participant BS as Blob Storage
    participant ACE as Azure Comm. Email
    participant TS as Table Storage

    U->>FE: Fill assessment form
    FE->>API: POST answers
    API->>OAI: Prompt → tailored blueprint
    OAI-->>API: Readiness report (text)
    API->>BS: Render & store report PDF
    API->>ACE: Email report to lead (+ admin notify)
    API->>TS: Persist lead + track event
    API-->>FE: Report + download link
```

### 5b. Booking an Expert Call (Microsoft Graph Bookings)

```mermaid
sequenceDiagram
    participant U as Visitor
    participant API as /api/bookings/*
    participant G as Microsoft Graph
    participant ACE as Azure Email

    U->>API: GET availability (IST 9–18 business hours)
    API->>G: getStaffAvailability(staffId)
    G-->>API: Free/busy slots
    API-->>U: Bookable slots
    U->>API: POST create booking
    API->>G: Create appointment
    G-->>API: Confirmed
    API->>ACE: Confirmation email
```

### 5c. Certificate Issue + Public Verification

```mermaid
sequenceDiagram
    participant L as Learner
    participant API as /api/learner/.../issue-cert
    participant PDF as certificate-pdf (PDFKit)
    participant BS as Blob (certificates/)
    participant TS as Table (Certificates)
    participant V as Verifier (public)

    L->>API: Complete course → issue cert
    API->>PDF: Generate certificate (+ QR)
    PDF->>BS: Upload PDF (SAS URL)
    API->>TS: Save cert record (certId, status)
    API-->>L: Cert + verify URL
    V->>API: GET /verify/[certId]
    API->>TS: Lookup certId
    TS-->>V: Valid / Revoked + PDF link
```

### 5d. Academy Content & Audio Streaming

```mermaid
sequenceDiagram
    participant L as Learner
    participant Proxy as /api/content/[...path]
    participant BS as Blob Storage
    participant PS as progress-store

    L->>Proxy: Request slide/audio (Range header)
    Proxy->>BS: Fetch blob (range-aware stream)
    BS-->>Proxy: Bytes (206 Partial)
    Proxy-->>L: Streamed content
    L->>PS: Save progress (localStorage)
    L->>API: /api/learner/progress/sync (server copy)
```

---

## 6. Data Stores

| Store | Technology | What lives here |
|-------|-----------|-----------------|
| **Tabular** | Azure **Table Storage** | PageViews, Certificates, EmailLogs, Sessions, AI-Readiness leads, Course feedback, Cowork registrations, Blog comments |
| **Objects** | Azure **Blob Storage** (`website-content` + others) | Certificate PDFs, generated report PDFs, academy media/audio, uploaded content |
| **Static content** | In-repo `src/data/**`, `src/config/**` | Course chapters, blog posts, authors, catalog — shipped with the build |
| **Client state** | Browser `localStorage` | Learner course progress (synced to server) |
| **Ephemeral** | OTP store (`otp-store.ts`) | Short-lived email OTP codes |

---

## 7. Cross-Cutting Concerns

```mermaid
graph LR
    REQ[Incoming request] --> RL[Rate limiting<br/>rate-limit.ts]
    RL --> AUTH[Auth guard<br/>middleware + session checks]
    AUTH --> HANDLER[Route handler]
    HANDLER --> OBS[Observability]
    OBS --> AI[App Insights<br/>requests · deps · exceptions]
    OBS --> GA[GA4 / Mixpanel]
    HANDLER --> SEO[SEO: sitemap-index<br/>IndexNow · GSC resubmit]
```

- **Security:** httpOnly cookies, JWT signing (`jose`), Entra allow-list, per-route rate limiting, server-side env secrets, SAS-scoped blob access.
- **Observability:** Azure Application Insights (auto-collect requests/deps/exceptions) + GA4 + optional Mixpanel; custom PageViews table.
- **SEO automation:** `sitemap-index`, IndexNow push, Google Search Console resubmit (`scripts/*`, `npm run indexnow`).
- **Email routing:** role-based from-addresses (sales/training/support/...) via Azure Communication Email, mirrored to Outlook Sent Items through MS Graph.

---

## 8. Deployment & Environments

```mermaid
graph LR
    DEV[Local<br/>next dev] --> GIT[Git repo]
    GIT -- push staging --> VS[Vercel<br/>staging deploy]
    GIT -- push main --> VP[Vercel<br/>production deploy]
    VS --> PREVIEW[staging URL]
    VP --> PROD[gennoor.tech]
```

- **Vercel** auto-deploys both `main` (prod) and `staging` branches (`vercel.json`).
- Secrets via Vercel env vars (`.env.example` documents the full surface: Azure conn strings, OpenAI, Graph, Entra, SMTP fallbacks, CRM/WhatsApp toggles).
- Build: `next build`; ISR/edge handled by Vercel; Node runtime for `/api/*`.

---

## 9. Architecture at a glance

| Concern | Choice |
|---|---|
| Framework | Next.js 16 App Router, React 19, TypeScript |
| Hosting | Vercel (Edge CDN + serverless functions) |
| Styling | Tailwind, framer-motion, lucide-react, recharts |
| Admin identity | NextAuth v5 + Microsoft Entra ID (allow-list) |
| Learner identity | Custom JWT (jose) — OTP / Google / Microsoft |
| Persistence | Azure Table Storage + Azure Blob Storage |
| GenAI | OpenAI API (readiness blueprints, field extraction) |
| Comms | Azure Communication Email + MS Graph |
| Scheduling | Microsoft Graph Bookings |
| Credentials | PDFKit certificates + QR + public verify |
| Observability | App Insights + GA4 (+ Mixpanel optional) |
| Growth/SEO | sitemap-index, IndexNow, GSC resubmit |
```
