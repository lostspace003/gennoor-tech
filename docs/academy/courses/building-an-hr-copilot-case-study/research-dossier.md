# Building an HR Copilot — A Case Study · Research Dossier

**Course slug:** `building-an-hr-copilot-case-study`
**Track:** Applied · Case Study (FINAL GHOST · Course 47)
**Audience:** Technical leaders, solution architects, IT managers, HR-tech sponsors who learn best by walking through a real build
**Length:** 8 chapters · ~36 min total
**Voice:** Emma (`en-US-EmmaMultilingualNeural`)

## Thesis

Most HR copilot projects fail not at the model layer but at the *use-case selection* and *grounding discipline* layers. An anonymised 5,000-employee enterprise across India, GCC, and SEA picked HR onboarding Q&A — the boring use case — over the more exciting recruiting AI because of an impact × feasibility filter, then shipped it on Azure OpenAI + Copilot Studio + Dataverse with row-level security tested cross-role, an eval set built from real HR tickets, and a 3-cohort 4-week pilot with kill criteria signed by HR + IT + Legal pre-launch. The hard parts weren't the model — they were the 50-topic prototype that failed, the two hallucinations caught by the weekly eval cycle, and the week-4-to-8 adoption cliff. This course walks the whole build end-to-end so leaders can copy the *structure* without copying the mistakes.

## Numbers table (anchor citations)

| # | Claim | Source | Date |
|---|---|---|---|
| 1 | Microsoft Copilot Studio — low-code agent platform on Power Platform with native Dataverse + Azure OpenAI integration; supports declarative + generative topics | Microsoft Learn — Copilot Studio overview | 2024–2026 |
| 2 | Azure OpenAI Service — GPT-4o, GPT-4o-mini, GPT-4 Turbo, embedding models with enterprise data-residency in 30+ regions including India (Central/South), UAE North, Southeast Asia | Microsoft Learn — Azure OpenAI regions | 2024–2026 |
| 3 | Dataverse — Microsoft's managed relational data platform; native row-level security via security roles, business units, and column-level permissions | Microsoft Learn — Dataverse security | ongoing |
| 4 | Impact × feasibility filter — industry pattern from McKinsey + BCG AI-portfolio playbooks: rate each candidate use case on business impact and technical/organisational feasibility, ship the high-feasibility quadrant first | Industry pattern (McKinsey / BCG AI-portfolio) | 2023–2025 |
| 5 | Onboarding Q&A as the canonical "boring but high-feasibility" enterprise copilot use case — high ticket volume, stable policy corpus, low decision risk, deflection-measurable | Industry pattern across Microsoft + ServiceNow + Workday case material | 2024–2026 |
| 6 | Recruiting AI is high-impact but feasibility-fragile — EU AI Act Annex III high-risk classification for employment screening; bias-audit regimes (NYC Local Law 144, Colorado AI Act 2026) | EU AI Act 2024/1689 + NYC Local Law 144 | 2023–2026 |
| 7 | Stack Fit Assessment — 3-layer pattern: model layer (Azure OpenAI), orchestration layer (Copilot Studio), data layer (Dataverse + SharePoint/HRIS); each evaluated independently against the use case | Industry pattern (Microsoft enterprise architecture guidance) | 2024–2026 |
| 8 | Integration gotchas that only surface at pilot scale — pattern: (a) HRIS API throttling under concurrent load, (b) Dataverse RLS interaction with delegated vs application permissions, (c) Copilot Studio topic-trigger collisions in multilingual prompts | Industry pattern from Microsoft Tech Community + Power Platform field engineering | 2024–2026 |
| 9 | Two grounding patterns — policy doc grounding (RAG over policy PDFs/SharePoint) vs structured-data grounding (Dataverse / HRIS row lookup); mixing them in one query is the hard mode | Industry pattern (Azure OpenAI on your data + Copilot Studio knowledge sources) | 2024–2026 |
| 10 | Row-level security must be tested cross-role before launch — pattern: every persona (employee, manager, HRBP, payroll admin) issues the same prompt; mismatched answers = RLS failure | Industry pattern (Microsoft Dataverse security testing guidance) | ongoing |
| 11 | 50-topic deterministic prototype failure mode — over-engineered intent trees collapse under real-user phrasing variance; industry pattern across early Microsoft Bot Framework + Copilot Studio deployments | Industry pattern (Power Virtual Agents → Copilot Studio field lessons) | 2020–2025 |
| 12 | 5+1 hybrid pattern — small number of deterministic topics for highest-volume intents + generative answers for the long tail + explicit human escalation; pattern that survived the prototype phase in the case study | Industry pattern (Microsoft Copilot Studio reference architectures) | 2024–2026 |
| 13 | Multilingual handling — Azure OpenAI native multilingual + Copilot Studio language detection; English + Hindi + Arabic + Tagalog covers ~95% of the case-study employee base; per-language eval slices required | Azure AI Language + Copilot Studio multilingual docs | 2024–2026 |
| 14 | Eval set from real HR tickets — pattern: stratified sample of 100-200 tickets from the last 90 days, labelled for intent + correct answer + grounding source; weekly iteration cycle catches drift and hallucination | Industry pattern (Azure AI Foundry evaluation guidance) | 2024–2026 |
| 15 | Hallucination categories caught pre-launch — pattern: (a) confabulated policy clause that doesn't exist in the corpus, (b) correct policy mis-applied to the wrong country/role. Cross-domain analog: Mata v. Avianca (S.D.N.Y. Jun 2023) for fabricated-source failure mode | Industry pattern + Mata v. Avianca analog | 2023–2026 |
| 16 | 3-cohort 4-week pilot rollout — sequential cohorts (e.g., 50 → 200 → 1,000 employees) with weekly review gates; pattern from Microsoft Customer Success enterprise rollouts | Industry pattern (Microsoft adoption framework) | 2024–2026 |
| 17 | Kill criteria signed pre-launch — pattern: (a) hallucination rate above threshold, (b) escalation rate above threshold, (c) RLS leak detected, (d) sentiment / CSAT below floor; signed by HR + IT + Legal before cohort 1 | Industry pattern (enterprise AI governance playbooks) | 2024–2026 |
| 18 | Week-4 adoption cliff — pattern across enterprise chatbot deployments where novelty drives week-1 usage and sustained usage drops sharply by week 4; Gartner + Forrester adoption research | Industry pattern (Gartner / Forrester enterprise chatbot adoption) | 2023–2025 |
| 19 | Four adoption interventions — weekly tips in employee comms, manager toolkits, visible feature releases, transparency dashboards (what the bot can/can't do); pattern that sustained ~50% usage past the cliff | Industry pattern (Microsoft Adoption & Change Management framework) | 2024–2026 |
| 20 | Trust trip-wires — pattern: no answer without a citable source, no PII echoed back unprompted, no policy answer outside the grounded corpus, explicit "I don't know" escalation path | Industry pattern (Microsoft Responsible AI Standard v2) | 2022–2026 |
| 21 | EU AI Act applicability to HR copilots — onboarding Q&A is generally not Annex III high-risk; performance-affecting workforce decisions are. The boundary matters for governance scope | EU AI Act 2024/1689 | Aug 2026 enforcement |
| 22 | Data residency for India + GCC + SEA — Azure OpenAI available in Central India, South India, UAE North, Southeast Asia (Singapore); Dataverse environment region pinning required | Microsoft Learn — Azure + Power Platform geo docs | 2024–2026 |
| 23 | Microsoft Responsible AI Standard v2 — fairness, reliability & safety, privacy & security, inclusiveness, transparency, accountability — the six-pillar frame used in the case-study governance review | Microsoft Responsible AI Standard v2 | 2022–2026 |
| 24 | Forecast value-added analog for copilots — Forecast-Value-Added (FVA) discipline maps to copilot eval: does the LLM-augmented answer improve resolution vs the baseline search? Industry pattern | Industry pattern (Gilliland FVA + copilot eval) | 2024–2026 |
| 25 | Cost per onboarding ticket benchmark — industry pattern: HR shared-services tickets cost $5-25 fully loaded; deflection of 30-50% on the high-volume tail is the case-study ROI lever | Industry pattern (HR shared-services benchmarking) | 2023–2025 |

## Named incidents

1. **The 50-topic deterministic prototype failure (case-study internal)** — over-engineered intent tree collapsed under real-user phrasing variance. Ground as the lesson behind the 5+1 hybrid that shipped.
2. **The two pre-launch hallucinations caught by the eval cycle (case-study internal)** — one confabulated clause + one correct-policy-wrong-country. Ground in the cross-domain analog: **Mata v. Avianca (S.D.N.Y. Jun 2023)** for the fabricated-source failure mode.
3. **The week-4 adoption cliff (industry pattern)** — sustained 50% usage achieved via four interventions; do not claim a single named company without verifiable public source.

## What we do NOT say

- **No "AI replaces HR" framing.** Copilot deflects high-volume tail; HRBPs handle the cases that need judgement. Escalation is the design choice, not the failure.
- **No vendor-bashing.** ServiceNow, Workday, and standalone RAG stacks are valid alternatives — the case study picked Microsoft because the customer's stack was already Microsoft.
- **No "set and forget."** Weekly eval cycle is non-negotiable.
- **No invented metrics.** Use the case-study numbers that are structurally honest (3-cohort 4-week pilot, 50% sustained usage, 2 hallucinations caught) and flag everything else as industry pattern.
- **No "Copilot Studio is no-code."** It is low-code. The case-study build needed Power Fx, custom connectors, and Azure Function fallbacks.
- **No recruiting-AI advocacy.** The case study consciously skipped it for governance reasons (EU AI Act Annex III, NYC LL 144).

## Chapter blueprint

### Chapter 1 — The starting situation (~5 min)
**What:** The 5,000-employee enterprise across India + GCC + SEA. The impact × feasibility filter applied to a candidate list. The three use cases consciously skipped (recruiting AI, performance-review summarisation, comp benchmarking) and *why*. The boring one that shipped: onboarding Q&A. Why boring won.
**Sources:** [4], [5], [6], [21], [25].

### Chapter 2 — Stack Fit Assessment (~5 min)
**What:** 3-layer fit — model (Azure OpenAI in Central India + UAE North + Singapore), orchestration (Copilot Studio), data (Dataverse + SharePoint policy corpus + HRIS connector). Three integration gotchas that only surface at pilot scale. "Why not" alternatives: ServiceNow Now Assist, Workday AI, standalone RAG on Azure AI Search.
**Sources:** [1], [2], [3], [7], [8], [22].

### Chapter 3 — Architecture and grounding (~5 min)
**What:** Two grounding patterns — policy-doc RAG (SharePoint policies through Copilot Studio knowledge) vs structured-data lookup (Dataverse rows for "how much leave do I have left"). Row-level security tested cross-role (employee, manager, HRBP, payroll admin) before launch. The hard mode: a single query that needs both patterns.
**Sources:** [3], [9], [10], [23].

### Chapter 4 — Building the conversation flow (~5 min)
**What:** The earlier 50-topic deterministic prototype that failed and why. The 5+1 hybrid that shipped — five deterministic topics for highest-volume intents + generative answers for the long tail + explicit human escalation. Multilingual handling (English + Hindi + Arabic + Tagalog) with per-language eval slices.
**Sources:** [11], [12], [13].

### Chapter 5 — Evaluation and iteration (~5 min)
**What:** Eval set built from ~150 real HR tickets, stratified by intent + country + role. Weekly iteration cycle. The two pre-launch hallucinations caught — one confabulated clause, one correct-policy-wrong-country. Cross-domain analog: Mata v. Avianca for the fabricated-source failure mode.
**Sources:** [14], [15], [24].

### Chapter 6 — Pilot rollout (~5 min)
**What:** 3-cohort 4-week sequence (50 → 200 → 1,000 employees). Four kill criteria signed by HR + IT + Legal pre-launch: hallucination rate, escalation rate, RLS leak, sentiment floor. What actually happened: no kill, two mid-pilot fixes, one expansion of the eval set.
**Sources:** [16], [17], [23].

### Chapter 7 — Adoption playbook (~5 min)
**What:** The week-4 cliff. Four interventions — weekly tips in employee comms, manager toolkits, visible feature releases monthly, transparency dashboard (what the bot can/can't do). Three adoption signals to watch: weekly active users, deflection rate, CSAT. Sustained ~50% usage past the cliff.
**Sources:** [18], [19].

### Chapter 8 — Capstone · Lessons learned (~6 min)
**What:** Five lessons from this build (use-case humility, grounding discipline, RLS cross-role testing, weekly eval cycle, adoption is half the build). Four trust trip-wires: no answer without source, no unprompted PII, no answer outside grounded corpus, explicit "I don't know" escalation. Interactive build-plan builder for the user's own copilot.
**Sources:** Composite of [20], [23], [24].

## Tone

- **Emma, builder-architect register.** Calm, structurally honest, allergic to demo-ware. The "we tried this and it failed before this worked" tone.
- **Numbers + accountability.** Every claim either grounds in the case study or flags as industry pattern.
- **Governance threaded through, not bolted on.** RLS, kill criteria, trust trip-wires are part of the build, not a final-chapter compliance section.

## Theme

Neutral-slate (`#475569` / `#334155`) + orange accent (`#F97316` / `#FB923C`) on a `#F8FAFC` tint, navy `#0F172A` for headings, slate cyan `#64748B` for secondary. No emojis. Sora headings, Inter body. Consistent with the FINAL GHOST applied case-study look.
