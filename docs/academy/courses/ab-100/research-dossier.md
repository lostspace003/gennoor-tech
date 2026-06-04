# AB-100: Architecting Agentic AI Business Solutions — Research Dossier

**Course slug:** `ab-100`
**Track:** Microsoft Certification · Architect
**Audience:** Solution architects, AI engineers, senior technical consultants, and lead developers preparing for the Microsoft AB-100 exam; also for delivery leads scoping enterprise agentic AI on the Microsoft stack
**Length:** 13 chapters + 50-question mock exam · ~20 hours self-paced total
**Pattern:** Legacy per-slide MP3 audio (the only course in the library still on `audioDir:` rather than `chapterAudio:`). Voice + cadence are slide-level, not chapter-level.

## Thesis

AB-100 is Microsoft's certification for *architecting* agentic AI on the Microsoft cloud — not for prompt engineering, not for using Copilot. The exam tests whether you can take a vague business ask, pick the right pattern across Copilot Studio, Azure AI Foundry, and Dynamics 365 prebuilt agents, defend the design under Responsible AI + governance + ALM constraints, and operate it in production. The course teaches the architect's standard playbook for each blueprint area: business analysis → strategy → design → extensibility → orchestration → monitoring → testing → ALM → RAI & governance. The through-line: pick the smallest pattern that meets the requirement; ground every decision in a Microsoft-documented framework; defend it under audit.

## Numbers table (anchor citations)

| # | Claim | Source | Date |
|---|---|---|---|
| 1 | Microsoft AB-100 exam — "Designing and Implementing a Microsoft AI Solution" / agentic AI architect track. Exam blueprint published on Microsoft Learn with skills-measured outline | Microsoft Learn · AB-100 exam page | 2024–2026 |
| 2 | Pass score: 700 / 1000. Format: 40–60 questions across MCQ, hotspot, drag-drop, multi-select, case study | Microsoft certification standard format | 2024–2026 |
| 3 | Microsoft Copilot Studio — low-code platform for building agents over Dataverse, M365 grounding, generative answers + topics + actions | Microsoft Learn · Copilot Studio docs | 2024–2026 |
| 4 | Azure AI Foundry (formerly Azure AI Studio) — unified platform for model catalogue, AI agents, evaluation, content safety, prompt flow | Microsoft Learn · Azure AI Foundry docs | 2024–2026 |
| 5 | Dynamics 365 prebuilt AI agents — sales, customer service, finance, supply chain agents shipped as first-party | Microsoft Learn · D365 Copilot + agents docs | 2024–2026 |
| 6 | Microsoft Cloud Adoption Framework (CAF) for AI — strategy, plan, ready, adopt, govern, secure, manage methodology | Microsoft Learn · CAF for AI | 2024–2026 |
| 7 | Microsoft Well-Architected Framework — reliability, security, cost optimization, operational excellence, performance efficiency pillars; AI workload guidance overlay | Microsoft Learn · WAF for AI workloads | 2024–2026 |
| 8 | Responsible AI standard v2 — Microsoft's RAI principles (fairness, reliability, privacy, inclusiveness, transparency, accountability); RAI Impact Assessment template | Microsoft Responsible AI Standard v2 | June 2022 (current) |
| 9 | Model Context Protocol (MCP) — open standard for connecting AI agents to tools and data; Microsoft adopting in Copilot Studio + Foundry | MCP spec + Microsoft tooling announcements | 2024–2026 |
| 10 | Computer Use / agentic browsing in Copilot Studio + Foundry — agents that operate UIs, with explicit human-in-the-loop checkpoints | Microsoft preview docs | 2024–2026 |
| 11 | Azure OpenAI Service — GPT-4, GPT-4o, GPT-4o-mini, embeddings, content safety, regional availability matrix, EU Data Boundary | Microsoft Learn · Azure OpenAI docs | 2024–2026 |
| 12 | Model router pattern — route requests by complexity to GPT-4o-mini vs GPT-4o vs reasoning models for cost-quality balance; canonical TCO pattern | Industry pattern + Azure AI Foundry guidance | 2024–2026 |
| 13 | Grounding patterns — retrieval-augmented generation, structured data grounding, Dataverse grounding, M365 Graph grounding; choose by data shape | Microsoft Learn · Copilot Studio + AI Foundry RAG docs | 2024–2026 |
| 14 | Restricted SharePoint Search + EU Data Boundary — security boundaries Copilot honours; common architecture gotcha | Microsoft Learn · Copilot data boundary docs | 2024–2026 |
| 15 | Connectors + plugins — 1,000+ Power Platform connectors; custom plugins via OpenAPI; agent action surface | Microsoft Learn · connector reference | 2024–2026 |
| 16 | ALM for AI — solution packaging, environment promotion (dev → test → prod), Dataverse data ALM, prompt versioning, model versioning | Microsoft Learn · Power Platform ALM + AI Foundry MLOps | 2024–2026 |
| 17 | Telemetry + observability — App Insights, Foundry traces, prompt flow runs, conversation transcripts; the inputs to feedback loops | Microsoft Learn · monitoring docs | 2024–2026 |
| 18 | EU AI Act 2024/1689 — high-risk classification (Annex III), Art. 50 transparency, Art. 27 FRIA, Art. 99 fines effective Aug 2026; architect must scope the use case correctly | EU AI Act 2024/1689 | published Aug 2024 |
| 19 | NIST AI Risk Management Framework — Govern, Map, Measure, Manage functions; pairs with RAI Impact Assessment | NIST AI RMF 1.0 | Jan 2023 |
| 20 | Hallucination pattern — LLM confabulation of plausible-but-false outputs; cross-domain analog: Mata v. Avianca (S.D.N.Y. Jun 2023) — frames why RAI controls + grounding + human review are architectural, not optional | Mata v. Avianca cross-domain analog | 2023 |
| 21 | Customer-facing chatbot accountability — operator owns the agent's outputs; cross-domain analog: Moffatt v. Air Canada (BC CRT Feb 2024) — frames why disclosure + escalation paths are architectural | Air Canada cross-domain analog | 2024 |
| 22 | Prompt validation, multi-turn E2E testing, red-teaming with Azure AI Foundry — required test surfaces for production agents | Microsoft Learn · AI evaluation docs | 2024–2026 |
| 23 | Total Cost of Ownership analysis — token costs + infra + integration + run + governance; the exam's recurring "pick the cheapest sufficient" pattern | Microsoft + industry TCO frameworks | ongoing |

## Named incidents

1. **Mata v. Avianca (S.D.N.Y. Jun 2023)** — counsel filed a brief with hallucinated case law from ChatGPT; sanctions issued. Cross-domain analog for why architects must design citation discipline + human review into agent outputs.
2. **Moffatt v. Air Canada (BC CRT Feb 2024)** — airline chatbot promised a refund policy that did not exist; tribunal held the airline responsible. Cross-domain analog for why customer-facing agent design requires escalation paths and clear ownership.
3. **The "demo-to-prod" gap** — industry pattern: agents that work in pilot quietly degrade when grounding scope expands, traffic mixes, or model versions roll. The architectural answer is observability + eval harness + ALM gating before production rollout.

## What we do NOT say

- **No magic stack claims.** Copilot Studio + AI Foundry + Dynamics each have a fit envelope. Picking the wrong tool is a real exam failure mode.
- **No "single best architecture."** The exam rewards pattern selection per requirement, not loyalty to one design.
- **No glossing over RAI.** RAI Impact Assessment is treated as a deliverable, not a checkbox.
- **No model-of-the-week framing.** The exam tests architectural thinking; model versions move, patterns don't.
- **No undercosted designs.** Every chosen pattern carries a TCO + run-cost story.
- **No customer-facing autonomy without disclosure + escalation** — anchored on Air Canada cross-domain analog.

## Chapter blueprint

### Chapter 0 — Course introduction (~15 min)
**What:** How the course runs, how the slide+audio pattern works, how to use the mock exam. Exam logistics — registration, format, pass score, allowed materials. The architect mindset the rest of the course will reinforce.
**Sources:** [1], [2].

### Chapter 1 — Introduction to Agentic AI (~90 min)
**What:** The architect role on AI projects. Agentic AI fundamentals — agent vs copilot vs assistant, the spectrum from generative answers to autonomous actions. The solution landscape across the Microsoft stack and where each piece fits.
**Sources:** [3], [4], [5], [9], [10].

### Chapter 2 — Analyze Business Requirements (~100 min)
**What:** Grounding and data architecture. Translating fuzzy business needs into AI specs. Choosing the right grounding pattern by data shape — Dataverse, M365 Graph, SharePoint, structured DB, retrieval index. Restricted SharePoint Search + EU Data Boundary as scoping inputs.
**Sources:** [13], [14], [15].

### Chapter 3 — Develop AI Strategy (~120 min)
**What:** Microsoft Cloud Adoption Framework for AI applied. Agent types and when to use each. Solution design rules — smallest pattern that meets the requirement, document every choice against CAF + WAF.
**Sources:** [6], [7].

### Chapter 4 — Return on AI Investment (~100 min)
**What:** TCO analysis end to end — token costs, infra, integration, run, governance overhead. Model router pattern as the canonical cost lever. ROI modelling for agent projects with the productivity-claim discipline.
**Sources:** [11], [12], [23].

### Chapter 5 — Design AI Solutions (~120 min)
**What:** Responsible AI as an architectural input. Copilot Studio fit envelope vs Azure AI Foundry fit envelope. Solution design patterns — RAG, multi-agent orchestration, prebuilt + custom hybrid. RAI Impact Assessment as a deliverable.
**Sources:** [3], [4], [8], [19].

### Chapter 6 — Design Extensibility (~100 min)
**What:** Connectors + plugins as the agent's action surface. MCP for tool access. Computer Use for agentic UI operations. Where each extension model fits and where it breaks down. Custom plugin via OpenAPI walkthrough.
**Sources:** [9], [10], [15].

### Chapter 7 — Orchestrate Prebuilt Agents (~110 min)
**What:** Dynamics 365 capability map by module. Prebuilt agent orchestration — when prebuilt is the right answer, when you compose, when you build. The handoff patterns between prebuilt and custom agents.
**Sources:** [5].

### Chapter 8 — Analyze, Monitor, Tune (~110 min)
**What:** Telemetry from Foundry traces, App Insights, prompt flow runs, conversation transcripts. Feedback loops that work — flag → triage → eval set update → re-deploy. Continuous improvement cadence.
**Sources:** [17], [22].

### Chapter 9 — Manage Testing (~100 min)
**What:** Prompt validation discipline. Multi-app end-to-end testing across Copilot Studio + Power Platform + Dynamics. Eval harness + red-team passes in AI Foundry. Quality assurance gates before production.
**Sources:** [22].

### Chapter 10 — ALM for AI Solutions (~110 min)
**What:** Application lifecycle management — solution packaging, environment promotion. Data ALM — Dataverse + sample data + production data discipline. Custom model ALM — version pinning, eval-gated promotion, rollback paths.
**Sources:** [16].

### Chapter 11 — RAI, Security & Governance (~120 min)
**What:** Responsible AI principles applied per workload. Security patterns — identity, secrets, network, data boundary. GRC overlay — EU AI Act, NIST AI RMF, sector regulators (BFSI, healthcare). Audit-defensible design.
**Sources:** [8], [18], [19], [20], [21].

### Chapter 12 — Final Revision (~80 min)
**What:** Cross-cutting frameworks — CAF + WAF + RAI together. Common pitfalls — overscoping, wrong pattern, missing RAI Impact Assessment, no eval harness. Exam preparation tactics.
**Sources:** Composite of [1], [6], [7], [8].

### Mock Exam (~120 min)
**What:** 50 questions matching the real AB-100 format — MCQ, hotspot, drag-drop, multi-select, case study. Pass score 700/1000. Calibration against the real exam difficulty distribution.
**Sources:** [1], [2].

## Tone

- **Architect register.** Precise. Pattern-first. Every recommendation defended against a Microsoft-documented framework.
- **Exam-aware but not exam-only.** The course is good cert prep AND a working architectural reference. Doesn't drift into trivia.
- **Defensible under audit.** RAI + GRC are treated as architectural inputs, not afterthoughts.
- **Cost-aware.** TCO is a recurring lens, not a final-chapter footnote.

## Theme

Neutral-slate + orange-accent palette (matching the rest of the academy). No emojis. Sora-style headings, Inter body. AB-100 specifically uses the legacy `audioDir:` per-slide MP3 pattern — slide-level voice, not chapter-level. Not slated for migration to the new chapter-MP3 pattern; intentional carve-out.
