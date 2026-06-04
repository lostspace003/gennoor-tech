# AI Risk for Audit Committees — Research Dossier

**Course slug:** `ai-risk-for-audit-committees`
**Track:** Leadership · Board & Audit Committee
**Audience:** Audit committee chairs, audit committee members, chief audit executives, internal audit leaders
**Length:** 8 chapters · ~36 min total
**Voice:** Emma (`en-US-EmmaMultilingualNeural`)

## Thesis

AI risk does not fit cleanly into the existing risk universe. Most audit committees still receive AI as an operational subcategory under "IT risk" — but AI is four risk types at once (operational, compliance, strategic, reputational) plus three risks that do not map cleanly to any legacy bucket (model behaviour drift, bias risk, cognitive offloading at decision boundaries). The audit committee's job is not to become AI engineers. It is to apply the discipline they already use — COSO, three-lines, ISO 31000 — honestly, with NIST AI RMF overlaying the gaps, and to press the 9-question line of inquiry that distinguishes maturity from rehearsal. This course teaches that line, and how to put a 1-page board view in front of the full board that surfaces real shifts rather than heatmap-as-theatre.

## Numbers table (anchor citations)

| # | Claim | Source | Date |
|---|---|---|---|
| 1 | COSO Internal Control — Integrated Framework: the dominant US internal control reference; 5 components, 17 principles | COSO 2013 framework (still current) | 2013, in force |
| 2 | COSO ERM — Enterprise Risk Management Integrating with Strategy and Performance | COSO ERM 2017 | 2017 |
| 3 | COSO + Deloitte "Realize the Full Potential of AI" supplementary guidance applying COSO ERM to AI | COSO + Deloitte AI guidance | 2024 |
| 4 | NIST AI Risk Management Framework (AI RMF 1.0) — voluntary, four functions: Govern, Map, Measure, Manage | NIST AI RMF 1.0 | Jan 2023 |
| 5 | NIST Generative AI Profile (NIST AI 600-1) — generative-AI-specific overlay to AI RMF | NIST AI 600-1 | Jul 2024 |
| 6 | ISO 31000:2018 Risk Management — Guidelines; principles-based international risk standard | ISO 31000 | 2018 |
| 7 | ISO/IEC 42001:2023 AI Management System — first certifiable AI management system standard | ISO/IEC 42001 | Dec 2023 |
| 8 | ISO/IEC 23894:2023 AI Risk Management — guidance applying ISO 31000 to AI | ISO/IEC 23894 | Feb 2023 |
| 9 | IIA Three Lines Model (updated 2020) — governance body, first line (ops), second line (risk/compliance), third line (internal audit) | IIA Three Lines Model | 2020 update |
| 10 | IIA AI Auditing Framework — three components (strategy, governance, human factor) | IIA AI Auditing Framework | 2017, refreshed |
| 11 | EU AI Act (Regulation 2024/1689) — risk-tiered: prohibited, high-risk (Annex III), limited, minimal; GPAI obligations from Aug 2025; high-risk from Aug 2026 | Official Journal of the EU | Jul 2024 |
| 12 | SR 11-7 — US Federal Reserve / OCC model risk management guidance; foundational reference for model validation discipline applicable to AI | Fed/OCC SR 11-7 | 2011, still in force |
| 13 | NYDFS Circular Letter No. 7 (2024) — AI in insurance underwriting; governance + board oversight expectations | NYDFS CL No. 7 | Jul 2024 |
| 14 | SEC cybersecurity disclosure rule (2023) — board oversight + material incident disclosure; the precedent pattern audit committees are extending to AI | SEC Final Rule 33-11216 | Jul 2023 |
| 15 | Industry pattern — board AI heatmaps frequently become "heatmap-as-theatre": all amber, no movement quarter-over-quarter, no decision triggers. Pattern observed across audit-committee practitioner forums. | Industry pattern | ongoing |
| 16 | Cognitive offloading at decision boundaries — pattern where humans-in-the-loop rubber-stamp model output; not yet a named control framework but a documented research concern in human-AI teaming literature | Industry pattern + HFE literature | 2023-2025 |
| 17 | Model behaviour drift — output distribution change without code change (data drift, concept drift, foundation-model version drift). Standard MLOps category extended to GenAI. | Industry pattern (MLOps literature) | ongoing |
| 18 | Mata v. Avianca (S.D.N.Y. Jun 2023) — the canonical cross-domain analog for confabulated-citation risk in any AI-assisted work product, including board papers and audit memos | S.D.N.Y. case 22-cv-1461 | Jun 2023 |
| 19 | Inherent vs residual risk — standard ERM construct; the controls-assumed anti-pattern is when residual is reported without inherent ever being baselined | ERM convention (COSO, ISO 31000) | foundational |
| 20 | Cross-committee split problem — AI typically touches audit, risk, technology, and ESG/sustainability committees simultaneously; coordination is the gap most boards have not solved | Industry pattern | 2024-2026 |
| 21 | OECD AI Principles (2019, updated 2024) — five values-based principles informing most national AI frameworks | OECD AI Principles | 2019/2024 |
| 22 | IIA Global Internal Audit Standards (effective Jan 2025) — replaces IPPF; raises bar on technology risk coverage | IIA Standards 2024 | Jan 2025 |
| 23 | India DPDP Act 2023 + draft rules — personal data processing including AI training/inference; relevant where Indian personal data flows through AI systems | DPDP Act 2023 | enacted 2023 |

## Named incidents

1. **Mata v. Avianca (S.D.N.Y. Jun 2023)** — lawyer filed AI-generated brief with fabricated case citations. Use as the cross-domain analog for any AI-assisted board paper, audit memo, or management response that goes un-source-checked.
2. **Heatmap-as-theatre pattern** — board AI heatmaps that stay all-amber, quarter-after-quarter, with no movement and no decision triggers. Industry-observed pattern; ground as pattern, not a specific named board.
3. **Controls-assumed anti-pattern** — residual-risk-only reporting where inherent was never baselined. ERM convention; ground as pattern.

## What we do NOT say

- **No "audit committees must become AI experts."** The job is to press the right questions, not to evaluate model architectures.
- **No single-framework dogma.** COSO, three-lines, ISO 31000, NIST AI RMF, ISO 42001 each cover part of the surface; the integration is the work.
- **No invented board incidents.** No "Bank X audit committee discovered model drift" stories unless they are in public reporting. Use Mata v. Avianca as the cross-domain analog instead.
- **No regulator overreach claims.** EU AI Act timeline, SEC cyber disclosure precedent, NYDFS CL No. 7, SR 11-7 — only what is on the page.
- **No "AI replaces internal audit."** Third-line independence still applies. AI changes the audit plan, not the assurance model.
- **No vendor calls.** No naming a specific GRC or model-risk platform as the answer.

## Chapter blueprint

### Chapter 1 — AI in the risk universe (~5 min)
**What:** Why AI does not fit one bucket. The four buckets it touches at once (operational, compliance, strategic, reputational). The three risks that do not map cleanly: model behaviour drift, bias risk, cognitive offloading at decision boundaries. The audit committee framing: not new physics — new combinatorics.
**Sources:** [1], [2], [4], [16], [17].

### Chapter 2 — Inherent vs residual risk (~5 min)
**What:** Four inherent dimensions (output sensitivity, automation depth, affected population, recovery difficulty). The controls-assumed anti-pattern made visible: management reports residual without ever baselining inherent. How the audit committee asks for inherent first, residual second, gap explicitly.
**Sources:** [1], [2], [6], [19].

### Chapter 3 — Mapping AI to control frameworks (~5 min)
**What:** Three existing frameworks the committee already knows — COSO (ERM + Internal Control), IIA Three Lines (2020), ISO 31000 — and the NIST AI RMF overlay covering what they miss (Govern / Map / Measure / Manage). ISO 42001 + ISO 23894 as the certifiable + risk-guidance pair. Three integration patterns: overlay, embed, replace (only one of those is sensible).
**Sources:** [1], [2], [4], [5], [6], [7], [8], [9].

### Chapter 4 — Audit committee questions (~5 min)
**What:** Nine questions in three categories (governance, operations, assurance). What a mature answer sounds like vs a rehearsed answer. The tell: rehearsed answers describe the policy; mature answers describe the last time the policy fired and what changed.
**Sources:** [4], [9], [10], [12].

### Chapter 5 — Independent assurance (~5 min)
**What:** Three lines mapped to AI — first line owns the model, second line owns the framework, third line owns the assurance. Which line for which control. A 12-month internal audit AI plan: discovery quarter, framework-conformance quarter, control-testing quarter, deep-dive quarter. The skills the third line needs and cannot fake.
**Sources:** [9], [10], [12], [22].

### Chapter 6 — Reporting AI risk to the full board (~5 min)
**What:** A 3-section one-page board view (inventory shift, risk shift, assurance shift). The heatmap-as-theatre trap and the cure (movement, not colour). Neither panic nor sleep — the register the report should hit. The SEC cyber disclosure precedent as the template audit committees are extending.
**Sources:** [14], [15].

### Chapter 7 — Cross-committee coordination (~5 min)
**What:** The split problem — AI sits across audit, risk, technology, ESG. The four-committee coordination model. Three coordination patterns: lead-committee, joint-session, charter-clarification. What goes wrong without it (twin gaps + duplicated rework). The EU AI Act, NYDFS CL No. 7 as the regulatory forcing functions.
**Sources:** [11], [13], [20].

### Chapter 8 — Capstone · Audit committee AI playbook (~6 min)
**What:** A 5-section one-page playbook (universe, framework, line of inquiry, assurance plan, board view). Four trust trip-wires: no AI-generated board paper without source check (Mata v. Avianca pattern), no residual without inherent, no heatmap without movement, no cross-committee silence. Interactive playbook builder.
**Sources:** Composite of [1], [4], [9], [15], [18].

## Tone

- **Emma, board-register.** Calm, precise, senior. Speaks to chairs who have sat through 200 audit committee meetings.
- **No AI hype.** This is risk discipline applied to a new asset class, not a revolution.
- **No fear, no dismissal.** Neither panic nor sleep. The register the course itself models.
- **Frameworks named correctly.** COSO, NIST AI RMF, ISO 31000, ISO 42001, IIA Three Lines, SR 11-7, EU AI Act, NYDFS CL No. 7 — used precisely or not at all.

## Theme

Neutral-slate (#475569 / #334155) + orange accent (#F97316 / #FB923C). Navy #0F172A. No emojis. Sora headings, Inter body. Audit-committee register: white space, restraint, no decoration.
