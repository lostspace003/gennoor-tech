# 05 — Courses Catalog Plan

## What changes

Today: one interactive web course (AB-100) + bootcamp brochures hosted as HTML/PDF/DOCX in blob storage.

Tomorrow: **a branded PDF Course Catalog of 20 courses across 5 tracks** — each course is a clean, well-designed PDF (30–60 pages), branded with the Gennoor Tech logo (horizontal variant on cover, icon variant on chapter headers), tagline `train. innovate. build.` on the cover, and an **Enablement Sidebar** embedded inside every chapter that connects the learning to a 4-week pilot.

The existing AB-100 web course can either be promoted as the **Premium Interactive Course** (paid, optional) or migrated into the PDF catalog. Recommendation: keep AB-100 web-rendered as a flagship — but list it in the same catalog as the others, marked "Interactive Edition." All others are PDFs.

The bootcamp brochures already in blob storage become the **enterprise bootcamp offers** (linked from `/solutions/by-phase/train`), not the public course catalog.

## The Enablement Sidebar (inside every chapter)

This is the most important design rule for the catalog. The enablement narrative is **embedded inside the learning experience**, not bolted on at the end.

Every chapter ends with a sidebar like this:

```
┌────────────────────────────────────────────────────────────────┐
│  After this chapter — what changes in your organization?       │
│                                                                 │
│  Reading this is step one. The next step is applying it where  │
│  you work. Gennoor Tech runs a 4-week pilot tied to this       │
│  exact material — we set up the tools, train a small team on   │
│  your data, and ship a working artifact you keep.              │
│                                                                 │
│  Typical cost: $12k–$30k SMB / $40k–$120k Enterprise.          │
│  Typical timeline: 4 weeks, fixed scope.                       │
│                                                                 │
│  [Book a 30-minute pilot scoping call →]                       │
└────────────────────────────────────────────────────────────────┘
```

Color treatment: subtle gradient with the amber accent (#F59E0B) — not a screaming CTA, but a present one. **Subtle but always there.**

This way the reader is never far from the next phase of the Gennoor Way. Training → Pilot → Build is a continuous thread.

## Track structure

```
TRACK 1: FOUNDATIONS — what every business person should know
   ├─ AI Foundations for Everyone
   ├─ Generative AI for Business
   └─ AI Literacy for Non-Technical Teams

TRACK 2: BY FUNCTION — AI for the work you actually do
   ├─ AI for HR & People Teams
   ├─ AI for Finance & Accounting
   ├─ AI for Sales & Marketing
   ├─ AI for Customer Service & Support
   ├─ AI for Operations & Supply Chain
   └─ AI for Legal, Risk & Compliance

TRACK 3: LEADERSHIP — for the C-suite and boards
   ├─ AI Strategy for the C-Suite
   ├─ AI Governance & Risk for Boards
   └─ AI ROI & Business Case Building

TRACK 4: INDUSTRY — vertical-specific applications
   ├─ AI in Financial Services
   ├─ AI in Healthcare
   ├─ AI in Manufacturing
   ├─ AI in Government & Public Sector
   └─ AI in Education

TRACK 5: BUILDER — for technical practitioners
   ├─ Prompt Engineering for Practitioners
   ├─ Building AI Agents with Copilot Studio
   ├─ Microsoft 365 Copilot Adoption Playbook
   └─ Machine Learning & Forecasting for Business
```

Total: **20 courses**.

## Course-by-course brief

### TRACK 1 — Foundations

#### 1. AI Foundations for Everyone
- **Audience:** All employees, including non-technical
- **Pages:** ~48
- **Chapters:** What AI is and isn't · How LLMs work (in plain English) · Where AI fits in everyday work · Privacy & ethics · How to evaluate AI claims · Hands-on with Copilot · Where to go next
- **Embedded enablement:** every chapter pairs with the Copilot Kickstart pilot or org-wide rollout
- **Outcome:** the entire org speaks the same AI vocabulary

#### 2. Generative AI for Business
- **Audience:** Managers, team leads
- **Pages:** ~40
- **Chapters:** GenAI explained without code · The ROI conversation · Use case discovery · Vendor evaluation · Pilot design · Adoption playbook
- **Outcome:** managers can run a credible internal GenAI discussion

#### 3. AI Literacy for Non-Technical Teams
- **Audience:** Non-tech functions (HR, Marketing, Sales, Ops)
- **Pages:** ~36
- **Chapters:** Demystifying AI · Prompting as a skill · Where AI helps you specifically · The risks you should know · 10 prompts to try Monday morning

### TRACK 2 — By Function

#### 4. AI for HR & People Teams
- **Audience:** HR leaders, L&D, people ops
- **Pages:** ~56
- **Chapters:** AI in recruiting (and the bias traps) · Onboarding copilots · Performance & feedback AI · L&D personalization · Policy Q&A bots · Employee experience AI · Compliance & data handling
- **Embedded enablement:** pairs with HR Onboarding Copilot PoC (see [06](06-poc-catalog.md))

#### 5. AI for Finance & Accounting
- **Audience:** CFOs, controllers, FP&A, accountants
- **Pages:** ~60
- **Chapters:** AI in close & consolidation · Invoice & document AI · Forecasting with AI · Audit & anomaly detection · Tax & compliance copilots · Risk management · The data quality conversation
- **Embedded enablement:** pairs with Invoice Extraction PoC + Forecasting Custom Build

#### 6. AI for Sales & Marketing
- **Audience:** CROs, CMOs, demand gen, sales ops
- **Pages:** ~52
- **Chapters:** AI in prospecting · Lead scoring · Proposal generation · Content production (and brand risk) · Personalization · Marketing analytics · Sales call AI

#### 7. AI for Customer Service & Support
- **Audience:** CX leaders, support managers
- **Pages:** ~48
- **Chapters:** Agent assist vs full bots · Multilingual support · Knowledge base AI · Sentiment & escalation · Quality assurance · Voice support · Adoption with frontline teams

#### 8. AI for Operations & Supply Chain
- **Audience:** COOs, supply chain leaders
- **Pages:** ~56
- **Chapters:** Demand forecasting · Procurement automation · Logistics optimization · Predictive maintenance · Inventory intelligence · Supplier risk · End-to-end visibility
- **Embedded enablement:** pairs with Forecasting Custom Build + Predictive Maintenance PoC

#### 9. AI for Legal, Risk & Compliance
- **Audience:** GCs, compliance officers
- **Pages:** ~52
- **Chapters:** Contract review AI · Regulatory monitoring · Compliance copilots · IP & confidentiality · Audit trail · Hallucination risk · Vendor governance

### TRACK 3 — Leadership

#### 10. AI Strategy for the C-Suite
- **Audience:** CEOs, CIOs, CDOs, CSOs
- **Pages:** ~44
- **Chapters:** Where AI value lives · Building the AI portfolio · Capital allocation · Talent & org design · Governance · Sustaining momentum · Board reporting

#### 11. AI Governance & Risk for Boards
- **Audience:** Board directors, audit committees
- **Pages:** ~32
- **Chapters:** What boards should ask about AI · Frameworks (NIST, EU AI Act) · Risk taxonomy · Reporting & metrics · Vendor risk · Incident response

#### 12. AI ROI & Business Case Building
- **Audience:** Finance partners, PMOs, CFOs
- **Pages:** ~40
- **Chapters:** The four ROI patterns · Quantifying productivity gains · Cost modeling · Risk-adjusted returns · Sample business cases · Common ROI traps

### TRACK 4 — Industry

#### 13. AI in Financial Services
- **Audience:** BFSI leaders
- **Pages:** ~60
- Topics: fraud detection · KYC/AML · credit scoring · claims processing · advisor copilots · regulatory reporting · open banking AI
- **Embedded enablement:** pairs with Multimodal RAG for Banking + Loan Origination Agent PoC

#### 14. AI in Healthcare
- **Audience:** Healthcare admins, hospital IT leaders
- **Pages:** ~56
- Topics: clinical documentation · patient journey AI · imaging AI overview · pharmacy & inventory · operations AI · safety & PHI handling · regulatory posture

#### 15. AI in Manufacturing
- **Audience:** Plant managers, operations VPs
- **Pages:** ~52
- Topics: predictive maintenance · quality vision · process optimization · supply chain · safety AI · digital twin · workforce

#### 16. AI in Government & Public Sector
- **Audience:** Public sector CIOs, transformation leads
- **Pages:** ~56
- Topics: citizen services · case management · data sovereignty · multilingual · procurement · GCC Vision alignment · public-trust framework

#### 17. AI in Education
- **Audience:** University admin, EdTech, ministry of education
- **Pages:** ~48
- Topics: personalized learning · campus operations · admissions · academic integrity · assessment AI · regional language models

### TRACK 5 — Builder

#### 18. Prompt Engineering for Practitioners
- **Audience:** Developers, analysts, power users
- **Pages:** ~44
- Topics: prompting principles · structured outputs · function calling · chain-of-thought · evaluation · prompt versioning

#### 19. Building AI Agents with Copilot Studio
- **Audience:** Power Platform developers, citizen developers
- **Pages:** ~60
- Topics: Copilot Studio architecture · topic design · plugins · agents · MCP integration · Dataverse · deployment · governance
- **Embedded enablement:** pairs with Copilot Studio implementation PoC

#### 20. Microsoft 365 Copilot Adoption Playbook
- **Audience:** IT leaders, change management
- **Pages:** ~40
- Topics: licensing strategy · pilot design · prompt libraries · governance · measurement · scaling
- **Embedded enablement:** pairs with Copilot Kickstart engagement

#### 21. (Bonus) Machine Learning & Forecasting for Business
- **Audience:** Analysts, BI leaders, ops planners
- **Pages:** ~52
- Topics: when to use ML vs LLM · forecasting fundamentals · Azure ML basics · model evaluation · MLOps · deploying ML in production · the data reality
- **Embedded enablement:** pairs directly with the **Custom ML Build** offering — *"if your team needs more than reading this, our engineers build the model with you in 6–10 weeks."*

## PDF design specification

Every course PDF follows the same template:

### Cover page
- **Top-left:** Gennoor Tech horizontal logo
- **Center:** Course title + subtitle + track name + audience label
- **Bottom-left:** Page count + edition + date
- **Bottom-right:** Tagline `train. innovate. build.`
- Color: white background, blue + amber accent

### Inside front cover
- About Gennoor Tech (3 short paragraphs)
- The Gennoor Way diagram (mini version)
- How to use this course
- Contact box

### Chapter headers
- Gennoor icon logo (top-left corner)
- Chapter number + title (large)
- 1-sentence promise + estimated reading time
- A pull-quote from the chapter

### Body pages
- Two-column where it makes sense; single column for narrative
- Sidebar callouts (blue) for key concepts
- Sidebar callouts (amber) for **practical actions you can do today**
- End of every chapter: the **Enablement Sidebar** (see top)

### Back cover
- A **"Next steps" page**:
  - "I want to apply this in my company" → Pilot scoping call
  - "I want my team to take this course together" → Team workshop
  - "I want to go deeper" → Bootcamp invitation
- All certifications + a single line about the founder
- Contact info + social links

## Production approach

### Phase A (immediate, 2-3 weeks): Top 5 courses as MVP
Ship these first:
1. AI Foundations for Everyone
2. AI Strategy for the C-Suite
3. AI Governance & Risk for Boards
4. AI for Finance & Accounting
5. AI in Financial Services

These cover the top buyer profiles: business users, executives, board members, the most active enterprise function (Finance), and the strongest vertical (BFSI).

### Phase B (weeks 4-8): Next 5 courses
6. Generative AI for Business
7. AI for HR & People Teams
8. AI in Healthcare
9. Microsoft 365 Copilot Adoption Playbook
10. Building AI Agents with Copilot Studio

### Phase C (weeks 9-16): Remaining 10–11 courses

### Tooling

- **Authoring:** Markdown source → typeset in Microsoft Word or a Pandoc-based pipeline with a custom template. Or Adobe InDesign if budget permits (cleaner output, takes more time).
- **Source files:** stored in `/content/courses/<slug>.md` in this repo.
- **Output:** PDFs uploaded to Azure Blob Storage (consistent with existing content workflow per [memory feedback_serve_from_blob_storage.md](../../../memory/feedback_serve_from_blob_storage.md)).
- **Delivery:** download is email-gated via existing newsletter signup → leads enter funnel.

## Course → engagement → revenue path

```
[Free PDF download]
    │   email captured
    ▼
[Welcome email + 4-week drip]
    │   each email links to enablement sidebar topics
    ▼
[Pilot scoping call request]
    │   30 min discovery
    ▼
[4-week pilot proposal]
    │   fixed scope, fixed price
    ▼
[Pilot delivered]
    │   working artifact
    ▼
[Phase 4 Build engagement] (production)
    │
    ▼
[Phase 5 Sustain retainer] (ongoing)
```

The PDF catalog is the **top of the funnel for the entire Gennoor Way**. Free, branded, distributable, with the enablement sidebar acting as the constant gentle pull toward the next phase.

## SEO benefit

Each course gets its own `/resources/courses/[slug]` page. Each page is indexed individually. Each page targets a specific keyword cluster (e.g., "AI for HR teams," "AI governance for boards"). Result: 20 new high-intent landing pages, each linkable from the blog, social, and external sites.

> **Continue to: [06 — PoC catalog](06-poc-catalog.md)**
