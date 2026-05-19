# 06 — PoC Catalog

## The principle

The PoC Catalog is the most commercially loaded surface on the site after the homepage. It must do two jobs at once:

1. **Show realistic, named, scoped PoCs** — the kind of things enterprises actually search for and budget for.
2. **Make it 100% clear that the catalog is a starting set, not the menu** — *"If you can imagine an AI, ML, analytics, forecasting, or custom deployment use case, we build it. The catalog below is what we ship most often."*

This second point is critical. The user is right: we cannot leave any stone unturned. If a prospect says *"can you build us a predictive lead-scoring model for our CRM?"*, the answer is **yes, and here's how** — even if it isn't in the catalog. The catalog is **the most-searched 18 PoCs**, designed to capture the top of search demand; the **Custom Build** track captures everything else.

Hence the two parts of this catalog: **Standard PoCs** (18, below) and **Custom Builds** (open-ended, with examples).

## How each PoC card is structured (template)

Every PoC entry follows the same shape on the site so a buyer can scan 18 of them in 90 seconds.

```
┌──────────────────────────────────────────────────────────────┐
│  [POC TITLE]                                                  │
│  [Category badge]   [Gennoor Way: Phase 3]                    │
│                                                               │
│  ONE-SENTENCE PROBLEM:                                        │
│  What the org is dealing with.                                │
│                                                               │
│  WHAT WE BUILD:                                               │
│  3 bullets. Concrete. Specific.                               │
│                                                               │
│  ARCHITECTURE: [ASCII diagram or thumbnail]                   │
│                                                               │
│  WHO IT'S FOR: [Industry / Function]                         │
│  TIMELINE: 4-8 weeks                                          │
│  PRICE BAND: SMB $X–$Y  |  Enterprise $X–$Y                  │
│  SUSTAINMENT: $X/mo retainer covers governance + drift checks │
│                                                               │
│  PAIRED COURSE: [Course title — link]                         │
│  PAIRED INDUSTRY PAGE: [Vertical — link]                      │
│                                                               │
│  [Get this PoC scoped →]   [Talk to delivery →]              │
└──────────────────────────────────────────────────────────────┘
```

## The 18 Standard PoCs

Grouped by category. Each chosen because (a) enterprises actually search for it, (b) it has a clear ROI conversation, (c) we can credibly deliver it with our stack.

### Category: Documents & Knowledge

#### POC-01 — Invoice & Receipt AI Extraction
- **Problem:** AP teams hand-key thousands of invoices/month with errors and lag.
- **Build:** Document AI + LLM verification + ERP write-back. Handles tables, multi-language, signatures.
- **Industry:** All, esp. BFSI, Manufacturing, Retail
- **Timeline:** 4 weeks
- **Price:** SMB $15k–$25k · Enterprise $50k–$120k
- **Sustainment:** $2k–$8k/mo
- **Paired course:** [#5 AI for Finance & Accounting](05-courses-plan.md)

#### POC-02 — Contract & Legal Document Review
- **Problem:** legal teams spend hours redlining standard contracts.
- **Build:** clause extraction, risk flagging, comparison against playbook.
- **Industry:** All, esp. Legal Services, BFSI, Real Estate
- **Timeline:** 6 weeks
- **Price:** SMB $20k–$35k · Enterprise $60k–$150k
- **Sustainment:** $3k–$10k/mo
- **Paired course:** [#9 AI for Legal, Risk & Compliance](05-courses-plan.md)

#### POC-03 — Enterprise RAG / Knowledge Search
- **Problem:** employees can't find policies, SOPs, technical docs across SharePoint/Confluence/PDFs.
- **Build:** hybrid search (keyword + vector + semantic ranking) over enterprise corpus, with citations and access control.
- **Industry:** All
- **Timeline:** 6 weeks
- **Price:** SMB $25k–$45k · Enterprise $80k–$200k
- **Sustainment:** $4k–$15k/mo
- **Paired course:** [#18 Prompt Engineering for Practitioners](05-courses-plan.md)

#### POC-04 — Multimodal RAG for Financial Documents
- **Problem:** financial PDFs contain tables, charts, and precise numbers that pure text-RAG misses.
- **Build:** two-stage pipeline (text + image extraction) → hybrid search → GPT-4o multimodal answers with citations.
- **Industry:** BFSI, Audit, Consulting
- **Timeline:** 6-8 weeks
- **Price:** SMB N/A · Enterprise $90k–$220k
- **Sustainment:** $5k–$18k/mo
- **Paired course:** [#13 AI in Financial Services](05-courses-plan.md)
- **Status:** existing reference architecture from prior work

### Category: Agents (function-specific copilots)

#### POC-05 — HR Onboarding Copilot
- **Problem:** new joiners flood HR with policy questions; HR is the bottleneck on day 1-30.
- **Build:** Copilot Studio agent grounded on policy docs + onboarding tasks + escalation.
- **Industry:** All
- **Timeline:** 4 weeks
- **Price:** SMB $12k–$25k · Enterprise $40k–$100k
- **Sustainment:** $2k–$6k/mo
- **Paired course:** [#4 AI for HR & People Teams](05-courses-plan.md)

#### POC-06 — Sales Proposal Generator
- **Problem:** sales reps spend hours assembling proposals from scattered templates.
- **Build:** prompt-driven proposal builder with brand templates, CRM context, and version control.
- **Industry:** All B2B
- **Timeline:** 4-6 weeks
- **Price:** SMB $15k–$30k · Enterprise $45k–$110k
- **Sustainment:** $2k–$7k/mo
- **Paired course:** [#6 AI for Sales & Marketing](05-courses-plan.md)

#### POC-07 — Multilingual Customer Support Agent
- **Problem:** support volume scaling faster than headcount; non-English markets under-served.
- **Build:** voice + text support agent with intent routing, RAG over knowledge base, fluent in EN/AR/HI/SW.
- **Industry:** Telecom, Retail, BFSI
- **Timeline:** 6-8 weeks
- **Price:** SMB $25k–$50k · Enterprise $80k–$200k
- **Sustainment:** $5k–$18k/mo
- **Paired course:** [#7 AI for Customer Service & Support](05-courses-plan.md)

#### POC-08 — Finance Reconciliation Agent
- **Problem:** month-end close clogged by manual reconciliation across accounts/systems.
- **Build:** agent that ingests bank statements, GL, AP/AR; flags mismatches; suggests journal entries; human-in-the-loop.
- **Industry:** All
- **Timeline:** 6 weeks
- **Price:** SMB $25k–$40k · Enterprise $70k–$160k
- **Sustainment:** $4k–$12k/mo
- **Paired course:** [#5 AI for Finance & Accounting](05-courses-plan.md)

#### POC-09 — Procurement & Vendor Intelligence Agent
- **Problem:** procurement teams can't compare vendors, contracts, and pricing across silos.
- **Build:** agent that ingests vendor docs + spend data, suggests consolidation, flags risk.
- **Industry:** Manufacturing, Energy, Healthcare
- **Timeline:** 6 weeks
- **Price:** SMB N/A · Enterprise $60k–$140k
- **Sustainment:** $4k–$12k/mo
- **Paired course:** [#8 AI for Operations & Supply Chain](05-courses-plan.md)

### Category: Industry-Specific

#### POC-10 — Loan Origination Agent (BFSI)
- **Problem:** retail loan applications take days to underwrite manually.
- **Build:** multi-agent system — KYC verification, income parsing, risk scoring, decisioning aid, document generation.
- **Industry:** Retail Banks, NBFCs
- **Timeline:** 8 weeks
- **Price:** Enterprise $120k–$280k
- **Sustainment:** $8k–$25k/mo
- **Paired course:** [#13 AI in Financial Services](05-courses-plan.md)

#### POC-11 — Clinical Documentation Assistant (Healthcare)
- **Problem:** physicians spend ~2 hours/day on EHR documentation.
- **Build:** ambient voice → structured note → EHR integration. PHI-safe deployment.
- **Industry:** Hospitals, Clinics
- **Timeline:** 8 weeks
- **Price:** Enterprise $100k–$240k
- **Sustainment:** $6k–$20k/mo
- **Paired course:** [#14 AI in Healthcare](05-courses-plan.md)
- **Note:** regulatory caveat clearly shown on the page — needs hospital governance buy-in

#### POC-12 — Predictive Maintenance Agent (Manufacturing)
- **Problem:** unplanned downtime costs more than the maintenance team's annual budget.
- **Build:** time-series + anomaly detection + LLM-narrated maintenance recommendations to plant engineers.
- **Industry:** Manufacturing, Energy
- **Timeline:** 8-10 weeks
- **Price:** Enterprise $100k–$250k
- **Sustainment:** $6k–$20k/mo
- **Paired course:** [#15 AI in Manufacturing](05-courses-plan.md)

#### POC-13 — Citizen Services Multilingual Agent (Government)
- **Problem:** citizen calls to government services overwhelm call centers; multi-language need.
- **Build:** voice + chat agent grounded on policy docs, multilingual, with case-handoff and audit trail.
- **Industry:** Government, Municipalities
- **Timeline:** 10 weeks
- **Price:** Enterprise $150k–$350k
- **Sustainment:** $10k–$30k/mo
- **Paired course:** [#16 AI in Government & Public Sector](05-courses-plan.md)

#### POC-14 — Personalized Learning Path Agent (Education)
- **Problem:** EdTech platforms struggle to personalize beyond simple recommendations.
- **Build:** agent that observes learner behavior, identifies gaps, generates customized practice & explanations.
- **Industry:** EdTech, Universities, Ministries of Education
- **Timeline:** 6-8 weeks
- **Price:** SMB $30k–$60k · Enterprise $80k–$180k
- **Sustainment:** $4k–$15k/mo
- **Paired course:** [#17 AI in Education](05-courses-plan.md)

### Category: Analytics, Forecasting & ML

#### POC-15 — Demand Forecasting Engine
- **Problem:** sales/ops planning runs on Excel; forecasts are stale within a week.
- **Build:** time-series + ML forecasting pipeline (Azure ML), Power BI surfacing, what-if scenarios via LLM interface.
- **Industry:** Retail, Manufacturing, Supply Chain
- **Timeline:** 8 weeks
- **Price:** SMB $30k–$55k · Enterprise $90k–$200k
- **Sustainment:** $5k–$18k/mo
- **Paired course:** [#21 Machine Learning & Forecasting for Business](05-courses-plan.md)

#### POC-16 — Anomaly Detection / Fraud Engine
- **Problem:** fraud + suspicious transactions hide in normal volume.
- **Build:** real-time anomaly detection (ML + LLM reasoning layer), case management dashboard.
- **Industry:** BFSI, E-commerce, Insurance
- **Timeline:** 8 weeks
- **Price:** Enterprise $100k–$240k
- **Sustainment:** $7k–$25k/mo
- **Paired course:** [#13 AI in Financial Services](05-courses-plan.md)

### Category: Productivity & Adoption

#### POC-17 — Microsoft 365 Copilot Rollout (Adoption Pilot)
- **Problem:** the org has licenses but adoption is stuck at 10%.
- **Build:** structured 4-week pilot: licensing strategy, persona-based prompt libraries, training, metrics dashboard.
- **Industry:** All
- **Timeline:** 4 weeks
- **Price:** SMB $12k–$22k · Enterprise $40k–$90k
- **Sustainment:** $3k–$10k/mo (continuous adoption support)
- **Paired course:** [#20 Microsoft 365 Copilot Adoption Playbook](05-courses-plan.md)

#### POC-18 — Meeting Intelligence & Action Tracker
- **Problem:** decisions made in meetings get lost; action items never followed up.
- **Build:** transcript ingest → decision/action extraction → CRM/project-tool sync → weekly digest agent.
- **Industry:** All
- **Timeline:** 4-6 weeks
- **Price:** SMB $15k–$28k · Enterprise $45k–$110k
- **Sustainment:** $2k–$8k/mo

---

## Custom Build / Bespoke Engineering — the second half of the offer

This is the **"no stone unturned"** part. The site must make it unmistakable: **the 18 PoCs above are our most-shipped patterns. If your problem isn't here, we build the custom solution.**

### What this looks like on the catalog page

After the 18 PoCs, a full-width band:

```
┌─────────────────────────────────────────────────────────────────┐
│  Don't see your use case?                                        │
│  We build custom too.                                            │
│                                                                  │
│  Machine learning models. Custom analytics platforms. Forecast   │
│  engines. Bespoke deployments. Anything in the AI, ML, analytics │
│  or data space — we curate the approach, build it in your        │
│  environment, transfer the code, and sustain it after Go-Live.   │
│                                                                  │
│  How a custom build works:                                       │
│    1. Discovery & scoping call (free, 30 min)                    │
│    2. Written scope, fixed price, fixed timeline (within 5 days) │
│    3. Build with weekly demos                                    │
│    4. Code, docs, runbook handover                               │
│    5. Optional sustainment retainer                              │
│                                                                  │
│  [ Scope a custom build → ]                                      │
└─────────────────────────────────────────────────────────────────┘
```

### Custom Build examples (shown on the page below the CTA)

We list **6 example custom builds** that span what "anything" looks like — so prospects can see we mean it:

1. **Custom ML model for credit scoring** — built on the client's data, deployed on their Azure ML workspace, with explainability dashboards.
2. **Custom analytics platform** — semantic layer, dashboards, natural-language query — over the client's data warehouse (Snowflake/Fabric/Synapse).
3. **Custom forecast engine** — domain-specific (cement, hospitality occupancy, hospital admissions) with what-if scenarios.
4. **Custom data pipeline + AI layer** — ingestion → cleaning → feature store → model serving — full MLOps.
5. **Custom multi-agent system** — beyond Copilot Studio — LangGraph/Semantic Kernel/CrewAI orchestration with custom tools.
6. **Custom AI deployment on-premise / sovereign** — for regulated clients who can't use public cloud LLMs. Ollama + private model + air-gapped.

### Why this works

This makes the catalog feel **vast without being vague**. The 18 listed PoCs anchor credibility and SEO; the 6 custom examples expand the imagination; the framework above explains the path. A buyer leaves the page thinking: *"They can do this — and they can also do whatever else I'll need next."*

---

## Page surfaces this catalog feeds

The PoC catalog isn't just `/resources/pocs` — it surfaces in **six places**:

1. `/resources/pocs` (the catalog itself)
2. `/resources/pocs/[slug]` (per-PoC deep pages)
3. Homepage Featured PoCs strip (3 rotating)
4. Industry vertical pages (each lists 3-5 relevant PoCs)
5. Function pages (each lists 3-5 relevant PoCs)
6. Inside every course PDF (the Enablement Sidebar references the paired PoC)

Each PoC is reused 4-6 times across the site without rewriting — the data lives in `src/data/pocs.ts` (already exists; just expand it).

## What this replaces / extends

Today's `src/data/pocs.ts` has a handful of well-described PoCs. We **keep that file**, **expand it** to 18 entries, and add a `customBuild: true | false` field plus `priceBand`, `timeline`, `phaseTag`, `industries[]`, `functions[]`, `pairedCourseId`, `sustainmentBand`.

Old `/portfolio/demos` page → 301 to `/resources/pocs`.

---

## The financial logic of this catalog

If only **2 of the 18 PoCs convert per quarter** at the SMB band (~$25k avg), that's $50k/quarter floor — and the SMB conversion is the slower one. Enterprise PoC conversions at the same rate would be $300k+. Add the sustainment retainers and the catalog by itself becomes a defensible revenue line, with the courses as zero-cost-of-distribution top-of-funnel.

> **Continue to: [07 — Sustainability & delivery model](07-sustainability-delivery.md)**
