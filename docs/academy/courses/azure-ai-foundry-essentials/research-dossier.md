# Azure AI Foundry Essentials — Research Dossier

**Course slug:** `azure-ai-foundry-essentials`
**Track:** Builder · Azure platform engineering
**Audience:** Azure-native engineers, ML platform teams, and solution architects taking LLM workloads from prototype to production on Microsoft's stack
**Length:** 8 chapters · ~36 min total
**Voice:** Emma (`en-US-EmmaMultilingualNeural`)

## Thesis

Azure AI Foundry isn't a new product — it's the consolidation layer that finally makes the Azure AI stack coherent for a platform team. The 2024–26 wave isn't about new models; it's about the three things teams kept rebuilding by hand: identity discipline, a real evaluation harness, and cost telemetry that fires before invoice day. Most production incidents on Azure LLM stacks aren't model failures — they're managed-identity-missing, no-rollback-path, and no-evaluator-on-the-prompt failures. This course teaches engineers to ship a Foundry workload that the platform team will actually sign off on, with a 20-item checklist and three disqualifiers nobody crosses.

## Numbers table (anchor citations)

| # | Claim | Source | Date |
|---|---|---|---|
| 1 | Azure AI Foundry GA — unified hub/project/connections model replacing Azure AI Studio as the consolidation layer over Azure OpenAI, AI Search, Content Safety, and Speech | Microsoft Learn · Azure AI Foundry overview | Nov 2024 (GA) |
| 2 | Foundry three-layer architecture: **hub** (shared infra, governance, networking), **project** (workspace per workload), **connections** (resource bindings — AOAI, Search, Storage, Key Vault) | Microsoft Learn · Foundry hub & project concepts | 2024–2026 |
| 3 | Azure OpenAI Service — GPT-4o, GPT-4o mini, o-series, GPT-4.1, embeddings; regional availability and quota the dominant scoping constraint, not feature parity | Microsoft Learn · AOAI models & regions | 2024–2026 |
| 4 | Foundry model catalog — four families: Azure OpenAI, open-weight (Llama, Mistral, Phi), partner (Cohere, AI21, Nixtla), custom fine-tunes; deployable as serverless API, managed compute, or batch | Microsoft Learn · Foundry model catalog | 2025 |
| 5 | Managed identity for AOAI + AI Search — the Microsoft-recommended pattern; eliminates key sprawl; required for any workload going through enterprise security review | Microsoft Learn · AOAI managed identity + Azure security baseline | 2024–2026 |
| 6 | Azure Key Vault — for the residual secrets that can't be managed-identity'd (third-party API keys, signing certs); soft-delete + purge protection mandatory for prod | Microsoft Learn · Key Vault security baseline | ongoing |
| 7 | Private endpoints + VNet injection — required pattern for regulated workloads (financial services, healthcare, public sector); Foundry hub supports network isolation | Microsoft Learn · Foundry network isolation | 2025 |
| 8 | Foundry built-in evaluators — groundedness, relevance, coherence, fluency, similarity, plus content safety (hate, sexual, violence, self-harm) and protected material | Microsoft Learn · Foundry evaluation SDK | 2024–2026 |
| 9 | Azure AI Content Safety — moderation API (text + image), prompt shields (jailbreak + indirect prompt injection), groundedness detection; integrated into Foundry eval flow | Microsoft Learn · Content Safety | 2024–2026 |
| 10 | Custom evaluator patterns — code-based (Python callable), prompt-based (LLM-as-judge), composite (rubric); evaluate.evaluate() harness supports all three | Microsoft Learn · azure-ai-evaluation SDK | 2025 |
| 11 | Four AOAI deployment types: **serverless API** (pay-per-token, multi-tenant), **PTU / Provisioned Throughput Units** (reserved capacity, predictable latency), **managed compute** (own GPU, open-weight), **batch** (24-hour SLA, ~50% discount) | Microsoft Learn · AOAI deployment types | 2024–2026 |
| 12 | PTU sizing — measured in P50/P99 latency at sustained TPM; the cross-over with serverless is workload-shape-dependent, not a flat threshold | Microsoft Learn · AOAI PTU sizing + capacity calculator | 2025 |
| 13 | Azure AI Search — vector + hybrid + semantic ranking; the default retrieval layer for Foundry RAG patterns; integrated vectorisation in 2024–25 | Microsoft Learn · AI Search vector search | 2024–2026 |
| 14 | Cost telemetry sources — **Azure Monitor** (per-resource metrics, token counts), **Cost Management** (billing-grade, T+1 day), **Foundry dashboards** (workload-level) | Microsoft Learn · Cost Management + AOAI monitoring | 2024–2026 |
| 15 | Three mandated cost alerts — daily spend threshold, monthly forecast, anomaly spike (hourly) — fire before the invoice day, not after | Microsoft Learn · Cost Management alerts | ongoing |
| 16 | Tagging discipline — `feature`, `env`, `owner` as the three minimums for FinOps attribution; without them, chargeback is impossible | Microsoft Learn · Azure tag governance + FinOps Framework | 2024–2026 |
| 17 | Microsoft responsible AI standard — Foundry inherits the six pillars (fairness, reliability, privacy, inclusiveness, transparency, accountability); evaluators map to reliability + safety | Microsoft Responsible AI Standard v2 | 2022, ongoing |
| 18 | EU AI Act — general-purpose AI (GPAI) obligations apply to the model providers (Microsoft, OpenAI); deployers carry transparency + risk-management duties from Aug 2026 | Regulation (EU) 2024/1689 | Aug 2026 |
| 19 | Confabulated-citation pattern — LLM-generated answers asserting fictitious documents; cross-domain analog (Mata v. Avianca, S.D.N.Y. Jun 2023); the reason groundedness + citation evaluators are non-optional | Industry pattern + cross-domain analog | 2023–2026 |
| 20 | Rollback path — every deployment must have a documented rollback to the previous model version *and* the previous prompt template; Foundry deployment versioning supports both | Microsoft Learn · Foundry deployment management | 2025 |

## Named incidents

1. **The confabulated-citation pattern** — LLM responses citing fictitious sources. Industry-observed; ground in cross-domain analog **Mata v. Avianca (S.D.N.Y. Jun 2023)** rather than a specific Azure customer name. Motivates groundedness + citation evaluators.
2. **Key-in-config drift** — secrets pasted into App Configuration or notebook cells, surviving a public repo push. Industry pattern; motivates managed identity + Key Vault as a hard rule, not a preference.
3. **PTU over-provisioning at launch** — teams reserve PTU based on stress-test TPM, run at 15% utilisation for a quarter. Industry pattern; motivates the serverless-first, PTU-on-evidence rule.

## What we do NOT say

- **No "Foundry replaces your architects" framing.** Foundry is the consolidation layer; the platform team still owns identity, network, and cost governance.
- **No vendor selection bias inside Azure.** AOAI, open-weight, partner, custom fine-tunes are presented even-handedly; the selection criteria are workload-shape, not loyalty.
- **No "managed identity is optional."** It's a disqualifier on the checklist. Stated plainly.
- **No PTU-by-default.** Serverless is the starting point; PTU comes when you have evidence.
- **No invented Azure customer names.** Patterns and Microsoft Learn docs only; cross-domain analogs (Mata v. Avianca) where a real incident grounds the lesson.
- **No accuracy or cost numbers we can't point to.** Quote Microsoft Learn ranges or skip the number.

## Chapter blueprint

### Chapter 1 — Foundry architecture (~5 min)
**What:** The three-layer model: hub (shared infra, governance, networking), project (per-workload workspace), connections (resource bindings). Foundry vs raw Azure OpenAI — when each fits. The migration path from a working AOAI deployment to a Foundry project without breaking the SDK contract.
**Sources:** [1], [2], [3].

### Chapter 2 — Model catalog navigation (~5 min)
**What:** Four model families (Azure OpenAI, open-weight, partner, custom). Three deployment styles available from the catalog (serverless API, managed compute, batch). Three selection criteria: latency budget, data residency, total cost at sustained throughput. The honest framing: GPT-4o-class is the default; open-weight earns its place on specific workloads.
**Sources:** [3], [4], [11].

### Chapter 3 — Project setup and identity (~5 min)
**What:** Managed identity as the default for AOAI + AI Search + Storage. Key Vault for the residual secrets, with soft-delete + purge protection. Private endpoints + VNet injection for regulated workloads. The three identity disqualifiers: shared keys in config, no Key Vault, no network isolation in regulated contexts.
**Sources:** [5], [6], [7].

### Chapter 4 — Evaluation harness (~5 min)
**What:** Built-in evaluators (groundedness, relevance, coherence, fluency, similarity) plus Content Safety (hate, sexual, violence, self-harm, prompt shields, protected material). Three custom evaluator patterns: code-based, prompt-based (LLM-as-judge), composite rubric. Four-step workflow: dataset → evaluators → run → diff against baseline. The confabulated-citation pattern is what groundedness exists for.
**Sources:** [8], [9], [10], [19].

### Chapter 5 — Deployment options (~5 min)
**What:** Four deployment types compared. **Serverless** for variable traffic and prototypes. **PTU** when sustained TPM + latency P99 justifies reserved capacity — on evidence, not at launch. **Managed compute** for open-weight or fine-tuned models needing GPU control. **Batch** for offline workloads at ~50% discount. Three latency rules: measure P99 not average, measure cold vs warm separately, never size PTU off a stress test alone.
**Sources:** [4], [11], [12].

### Chapter 6 — Cost monitoring (~5 min)
**What:** Three telemetry sources: Azure Monitor (real-time per-resource), Cost Management (billing-grade, T+1), Foundry dashboards (workload). Three alerts that fire before invoice day: daily threshold, monthly forecast, hourly anomaly spike. Three mandated tags — `feature`, `env`, `owner` — without which chargeback is impossible. The retrieval-cost trap: AI Search + embedding regenerations often beat inference cost on RAG workloads.
**Sources:** [13], [14], [15], [16].

### Chapter 7 — Production readiness checklist (~5 min)
**What:** 20-item checklist across four categories — security (5), evaluation (5), observability (5), rollback (5). Three disqualifiers nobody crosses: no managed identity in prod, no evaluation flow on the deployed prompt, no documented rollback path. Documented sign-off as the artefact, not a verbal nod. Responsible AI standard mapped to the relevant checklist rows.
**Sources:** [5], [8], [14], [17], [20].

### Chapter 8 — Capstone · Foundry production sign-off (~6 min)
**What:** Four-section sign-off pack: architecture diagram (hub/project/connections), identity & network attestation, evaluation report + baseline diff, cost + rollback plan. Four trust trip-wires: no key-in-config ever, no deploy without evaluators green, no PTU without two weeks of serverless evidence, no rollback path = no go-live. Interactive sign-off pack builder; output is what the platform team reviews.
**Sources:** Composite of [5], [8], [11], [14], [20].

## Tone

- **Emma, platform-engineering register.** Precise, calm, allergic to vendor marketing. Engineers want the rule and the reason.
- **Microsoft Learn as the anchor.** When in doubt, quote Microsoft Learn — not blog posts, not vendor pitches.
- **Disqualifiers stated plainly.** Managed identity, evaluation, rollback. Three things nobody crosses.
- **Serverless-first, PTU-on-evidence.** Capacity decisions follow measurement, not launch-week optimism.

## Theme

Neutral-slate base (`#475569` / `#334155`) with an orange accent (`#F97316` / `#FB923C`) for state changes and CTAs — a platform-engineering palette that reads as Azure-adjacent without copying the Microsoft blue. No emojis; Sora headings, Inter body.
