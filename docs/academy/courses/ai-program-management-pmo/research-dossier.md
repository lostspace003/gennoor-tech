# AI Program Management & PMO — Research Dossier

**Course slug:** `ai-program-management-pmo`
**Track:** Foundations / Leadership · Delivery & PMO
**Audience:** AI program leaders, transformation directors, PMO heads owning delivery across an AI portfolio
**Length:** 8 chapters · ~36 min total
**Voice:** Emma (`en-US-EmmaMultilingualNeural`)

## Thesis

Most enterprise AI does not fail at modelling. It fails at delivery — at the boring discipline of stage-gating, vendor contracts, model retraining, ops handoff, and team design. The PMO is the muscle that converts pilots into operating capability. Healthy portfolios look like a pyramid (many pilots, fewer scaled, very few embedded) and most enterprises run an inverted funnel (lots of pilots, almost nothing embedded). Kill rates of 60–80% at the pilot gate are a feature, not a bug. Vendor contracts written for SaaS break on training-data rights, model-update transparency, sunset rights, and liability. Models drift; without a registry and retraining triggers they rot quietly. Ops teams refuse handovers without runbook + model card + dashboard + escalation tree. Underfunding the PMO is the most common false economy. This course teaches program leaders to industrialise AI delivery.

## Numbers table (anchor citations)

| # | Claim | Source | Date |
|---|---|---|---|
| 1 | PMBOK Guide 7th Edition — value-delivery and principles-based framing; stage-gating remains the spine of major-program governance | PMI · PMBOK 7 | 2021 (current 2024-26) |
| 2 | PMI "AI Innovators: Cracking the Code on Project Performance" — 81% of organisations are being impacted by AI; mature AI adopters complete more projects on budget than the median | PMI Pulse / AI Innovators report | 2024 |
| 3 | Gartner research line: a majority of generative-AI pilots stall before production; PMOs cite governance + ops handoff as the blockers | Gartner GenAI program research | 2024-2025 |
| 4 | McKinsey "State of AI" — top-performing AI organisations concentrate spend on fewer scaled use cases, not a long tail of pilots | McKinsey State of AI | 2024 |
| 5 | BCG "Where's the Value in AI?" — roughly 10% of companies capture ~70% of AI value; the gap is delivery discipline, not models | BCG AI value research | 2024 |
| 6 | Stage-Gate methodology (Cooper) — canonical reference for go/kill gates in innovation portfolios; explicit kill criteria + healthy kill rates at early gates | Robert G. Cooper · Stage-Gate | 1986+ (still standard) |
| 7 | PMI Disciplined Agile + Scrum.org evidence — hybrid (stage-gated portfolio + agile delivery inside the gate) is the dominant pattern for AI programs | PMI DA + Scrum.org | 2023-2025 |
| 8 | Major PPM platforms in 2026: ServiceNow SPM, Planview, Smartsheet, Microsoft Project for the Web + Planner, Asana, Monday, Jira Align, Clarity | Vendor product evidence | 2025-2026 |
| 9 | MLOps / model-lifecycle platforms: MLflow, Azure ML, Vertex AI, SageMaker, Databricks Model Registry, Weights & Biases — all converge on registry + lineage + drift monitoring | Vendor docs | 2024-2026 |
| 10 | Google "Hidden Technical Debt in ML Systems" (NeurIPS 2015) — canonical paper showing the model is the small box; everything around it (data, monitoring, serving, ops) is the system | Sculley et al. · NeurIPS 2015 | 2015 (still cited) |
| 11 | Model drift industry pattern — performance can degrade materially within weeks for fast-moving domains (fraud, demand, pricing); slower for stable language tasks; retrain triggers must be metric-based not calendar-based | Industry pattern + MLOps vendor evidence | ongoing |
| 12 | NIST AI Risk Management Framework (AI RMF 1.0) + Generative-AI profile — the Govern / Map / Measure / Manage loop maps cleanly to PMO stage-gates | NIST AI RMF 1.0 + GenAI profile | 2023-2024 |
| 13 | EU AI Act (Regulation 2024/1689) — high-risk obligations live from 2 Aug 2026; PMO is the natural owner of the conformity, post-market monitoring, and incident-reporting workstreams | EU AI Act Reg. 2024/1689 | Aug 2026 |
| 14 | India DPDP Act 2023 — operational from 2025; PMO owns data-flow inventory and consent posture across AI use cases for India-touching programs | DPDP Act 2023 | 2025 |
| 15 | RBI FREE-AI committee report — guidance on responsible AI in financial services in India; PMO-relevant because explainability + audit are vendor-RFP requirements | RBI FREE-AI report | 2025 |
| 16 | Model card pattern (Mitchell et al. 2019, "Model Cards for Model Reporting") — now standard PMO artifact at handoff; covers intended use, performance, limitations | Mitchell et al. · FAccT 2019 | 2019 |
| 17 | Runbook + escalation-tree pattern from Google SRE Book — adopted as the AI ops-handoff baseline; PMO ships it, ops accepts it | Google SRE Book | 2016 (canonical) |
| 18 | PMO team-design industry pattern — running ~50 active AI initiatives typically requires 6-10 people across portfolio lead, delivery, MLOps, governance, change; not one heroic PM | Industry pattern · multiple analyst notes | 2024-2025 |
| 19 | LLM-generated status-report fabrication — the confabulated-citation failure mode in PMO reporting. Cross-domain analog: Mata v. Avianca (S.D.N.Y. Jun 2023) — fabricated case citations from ChatGPT. Pattern industry observers warn about. | Industry pattern + Mata v. Avianca analog | 2023-2026 |
| 20 | Forecast-of-AI-cost industry pattern — initial vendor TCO estimates routinely understate inference + retraining + ops by 2-4x once embedded; PMO is the only function that catches this | Industry pattern · analyst evidence | 2024-2025 |
| 21 | Pilot-to-scale conversion industry pattern — healthy AI portfolios show 20-30% conversion from pilot to scale; 60-80% kill at pilot gate is the corollary | Industry pattern · multiple analyst notes | 2024-2025 |
| 22 | Microsoft Responsible AI Standard v2 + Impact Assessment template — public artifact PMOs adapt as the stage-gate-2 (scale-gate) checklist | Microsoft RAI Standard v2 | 2022 (current) |

## Named incidents

1. **Mata v. Avianca (S.D.N.Y. Jun 2023)** — fabricated ChatGPT citations in a legal filing. Cross-domain analog for the confabulated-citation failure mode in LLM-generated PMO status reports.
2. **Pattern: vendor sunset / forced model upgrade.** Industry-observed pattern where a vendor deprecates a model version mid-program. Ground in the contract-pillars discussion rather than naming a specific vendor.
3. **Pattern: model drift in fast-moving domains.** Industry pattern from MLOps practice; do not name a specific company unless verifiably public.

## What we do NOT say

- **No "PMO equals bureaucracy" apology.** Stage-gates are a feature.
- **No vendor selection bias.** ServiceNow, Planview, Smartsheet, Microsoft, Asana, Monday referenced even-handedly for PPM; MLflow, Azure ML, Vertex AI, SageMaker, Databricks, W&B for MLOps.
- **No "agile replaces gates" framing.** Hybrid is the pattern (gated portfolio + agile inside the gate).
- **No specific kill-rate or conversion-rate claims attributed to a named consultancy unless verifiable.** Frame as industry pattern.
- **No invented vendor incidents.** Use Mata v. Avianca only as the cross-domain analog for confabulation; never invent named program failures.
- **No "set up PMO, walk away" framing.** Underfunding is the recurring failure mode.

## Chapter blueprint

### Chapter 1 — The PMO landscape (~5 min)
**What:** Delivery is the gap between pilots and value. BCG 10/70 framing. Gartner stall-pattern. The three PMO failure modes: no stage-gates, no lifecycle, no ops handoff. Why PMO is the muscle, not the paperwork.
**Sources:** [3], [4], [5], [10].

### Chapter 2 — Portfolio shape (~5 min)
**What:** Three phases: pilot, scale, embed. The pyramid pattern (many pilots, fewer scaled, very few embedded) vs the inverted funnel most enterprises run. 20-30% pilot-to-scale conversion as industry pattern. McKinsey concentration finding.
**Sources:** [4], [21].

### Chapter 3 — Stage-gating discipline (~5 min)
**What:** Three gates (idea → pilot → scale → embed). Three pilot kill criteria (no value signal, no data, no operating owner). 60-80% kill at pilot gate is healthy. The political reality of killing pilots executives sponsored. Cooper Stage-Gate canon. NIST RMF map onto gates.
**Sources:** [6], [12], [21].

### Chapter 4 — Vendor management for AI (~5 min)
**What:** Four contract pillars: training-data rights, model-update transparency, sunset rights, liability allocation. Three vendor failure modes (forced upgrade, opaque retraining, walk-away cost). Three patterns that work: shortlist + bake-off, escrow + sunset clause, joint roadmap review. TCO under-estimate pattern.
**Sources:** [8], [13], [20], [22].

### Chapter 5 — Model lifecycle management (~5 min)
**What:** Four lifecycle stages (build, deploy, monitor, retire). Four retraining triggers (performance, data drift, concept drift, business change) — metric-based not calendar-based. Model registry as single source of truth: MLflow, Azure ML, Vertex AI, SageMaker, Databricks, W&B. Sculley "Hidden Technical Debt" framing.
**Sources:** [9], [10], [11], [16].

### Chapter 6 — Ops handoff pattern (~5 min)
**What:** The handoff problem — ops will refuse without artifacts. Four artifacts: runbook (SRE pattern), model card (Mitchell et al.), dashboard (drift + business KPI), escalation tree. The deliberate shadow period before cutover. Three anti-patterns: over-the-wall, parallel-forever, ops-as-firefighter.
**Sources:** [16], [17].

### Chapter 7 — Team structure + roles (~5 min)
**What:** Five PMO roles: portfolio lead, delivery PM, MLOps engineer, governance / RAI partner, change & adoption lead. Three design patterns: hub-and-spoke, federated, central-of-excellence. Honest sizing: ~50 active initiatives = 6-10 people. Underfunding-the-PMO is the false economy.
**Sources:** [2], [18], [22].

### Chapter 8 — Making it stick · 90-day PMO bootstrap (~6 min)
**What:** Day 1-30 — inventory the portfolio, draft the gate criteria, name the owners. Day 31-60 — first gate review, kill the obvious deadweight, stand up the model registry. Day 61-90 — first ops handoff, first vendor contract reviewed against the four pillars, first quarterly portfolio review. Four trust trip-wires: no gate decision without owner, no scale without model card, no LLM-generated status report without source check (Mata v. Avianca analog), no vendor signed without sunset clause. Interactive Markdown builder for CIO / transformation director.
**Sources:** Composite of [6], [12], [13], [19], [22].

## Tone

- **Emma, program-leader register.** Calm, structured, evidence-led. Audience runs portfolios for a living.
- **Discipline as the unlock.** Stage-gates and kill rates are how good PMOs respect sponsors' time and money.
- **Honest about LLM limits.** Confabulation is the failure mode PMOs underwrite when they let AI draft status reports unchecked (Mata v. Avianca analog).
- **PMO as portfolio capital allocator**, not paperwork generator.

## Theme

Neutral-slate + orange-accent palette (`primary #475569`, `accent #F97316`, deep navy `#0F172A`). No emojis. Sora headings, Inter body. Same family as the other Foundations / Leadership courses.
