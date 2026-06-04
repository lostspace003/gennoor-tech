# MLOps for LLMs — Research Dossier

**Course slug:** `mlops-for-llms`
**Track:** Builder · Advanced
**Audience:** ML engineers, platform engineers, SREs, and on-call leads operating LLM systems in production
**Length:** 8 chapters · ~36 min total
**Voice:** Andrew (`en-US-AndrewMultilingualNeural`)

## Thesis

LLMs don't fail like classical ML models. They hallucinate confidently, get silently worse when a third-party vendor ships a model update, cost 10x more when users get clever with prompts, and require a different on-call playbook than the one your SRE team already wrote. Most of MLOps carries over — versioning, observability, CI/CD, incident response — but five things are genuinely new: non-determinism, generative outputs, third-party black boxes, per-request cost variability, and adversarial users. This course teaches the operating discipline: production evaluation, drift across three distinct surfaces, cost patterns that hold up, 60-second rollback, and the post-mortem habit that turns every incident into a durable regression test.

## Numbers table (anchor citations)

| # | Claim | Source | Date |
|---|---|---|---|
| 1 | OpenTelemetry GenAI semantic conventions — standard schema for LLM spans (model, tokens, temperature, prompt/response attributes) used across observability vendors | OpenTelemetry GenAI SIG conventions | 2024–2025 |
| 2 | MLflow — open-source ML lifecycle platform; tracking, model registry, evals; widely adopted for LLM artifact versioning by 2025 | MLflow project documentation | 2024–2025 |
| 3 | LangSmith — LangChain's hosted trace + eval platform; commonly paired with MLflow for trace-level LLM observability | LangSmith product docs | 2024–2025 |
| 4 | Weights & Biases — experiment tracking + LLM eval (Weave); standard for fine-tuning and prompt-experiment lineage | W&B product documentation | 2024–2025 |
| 5 | Kubeflow — Kubernetes-native ML pipelines; the classical-MLOps anchor that LLMOps inherits CI/CD and orchestration patterns from | Kubeflow project documentation | ongoing |
| 6 | Azure Machine Learning — managed MLOps platform with prompt flow + model catalog; standard reference for enterprise LLM lifecycle | Microsoft Learn Azure ML docs | 2024–2025 |
| 7 | LLM-as-judge methodology — using a strong model to grade outputs of another; validated as scalable but biased; needs calibration against human-labelled gold sets | Industry pattern + academic evaluation work | 2023–2025 |
| 8 | Three-tier production sampling (light continuous + targeted slice + gold human-labelled set) — vendor and platform-team pattern emerging across LLMOps stacks | Industry pattern | 2024–2025 |
| 9 | Three drift types for LLMs — input drift (prompt distribution shifts), output drift (response distribution shifts), behavioral drift (silent vendor model updates) | Industry pattern | 2024–2025 |
| 10 | Cost variability — same task can cost 10x more when users add long context, retries, or chain-of-thought-heavy prompts; per-request cost is the new latency | Vendor pattern across foundation-model providers | 2024–2025 |
| 11 | Cost patterns that work: prompt compression, response caching, tier-routing (cheap → expensive on confidence), smaller-model + retrieval | Vendor pattern + platform-team consensus | 2024–2025 |
| 12 | Anti-patterns: aggressive caching of personalized outputs, blanket downsizing without eval, hidden retry storms on rate-limit | Industry pattern | 2024–2025 |
| 13 | One-artifact versioning — prompt + model pin + eval set versioned as a single immutable triple; rollback target ≤ 60 seconds | Platform-team pattern | 2024–2025 |
| 14 | Rollout patterns — shadow (mirror traffic, no user impact), canary (small % real traffic), feature-flag (per-cohort) | Inherited from classical SRE / progressive-delivery practice | ongoing |
| 15 | Four LLM incident types — quality regression, drift, abuse (prompt injection / jailbreak), vendor outage — each needs a distinct runbook | Industry pattern | 2024–2025 |
| 16 | The confabulated-citation failure mode in production LLM systems — cross-domain analog: Mata v. Avianca (S.D.N.Y. Jun 2023) where lawyers filed a brief with hallucinated case citations | Mata v. Avianca · S.D.N.Y. | Jun 2023 |
| 17 | PII discipline in regulated contexts — eval traces often contain user data; redaction-at-capture + access boundaries are the LLMOps pattern; cross-references HIPAA, GDPR, India DPDP 2023 | Industry pattern + named regulations | 2024–2025 |
| 18 | NIST AI Risk Management Framework (AI RMF 1.0) — Govern / Map / Measure / Manage functions; the reference standard for AI ops governance in US enterprise | NIST AI RMF 1.0 | Jan 2023 |
| 19 | EU AI Act (Regulation 2024/1689) — GPAI provider obligations apply Aug 2025; high-risk system obligations apply Aug 2026; logging + post-market monitoring are operational requirements | Regulation (EU) 2024/1689 | 2024–2026 |
| 20 | A/B testing on traces — comparing two prompt+model variants on the same input population via stored OpenTelemetry traces, not synthetic eval sets alone | Industry pattern | 2024–2025 |
| 21 | Eval-case-it post-mortem — every production incident produces a new regression test added to the gold set; the durability discipline | Platform-team pattern | 2024–2025 |

## Named incidents

1. **Mata v. Avianca (S.D.N.Y. Jun 2023)** — lawyers filed a brief with hallucinated case citations generated by ChatGPT; the canonical cross-domain analog for the confabulated-output failure mode that LLMOps must catch in production.
2. **The silent-vendor-update pattern** — a foundation model provider ships an update with no version bump and behavior shifts overnight; industry-observed pattern that motivates behavioral-drift detection, not a single named outage.
3. **The retry-storm cost incident pattern** — a downstream rate-limit triggers exponential retries; bill spikes 5–20x in a single hour. Vendor-observed pattern across cost post-mortems.
4. **The prompt-injection abuse pattern** — adversarial users get the model to leak system prompts or bypass guardrails; the abuse incident type that quality-only evals will not catch.

## What we do NOT say

- **No "LLMOps is brand-new."** Versioning, observability, CI/CD, incident response all carry over. We are precise about the five things that are actually new.
- **No vendor lock-in framing.** MLflow, LangSmith, Weights & Biases, Kubeflow, Azure ML referenced even-handedly; OpenTelemetry as the open standard.
- **No "LLM-as-judge solves eval."** It's scalable but biased — needs calibration against human gold sets.
- **No invented incident citations.** Confabulated-citation pattern is anchored in Mata v. Avianca; other failure modes framed as industry/vendor patterns, not specific named outages.
- **No "set and forget" rollbacks.** 60-second rollback is the floor, not the ceiling — eval-case-it post-mortem is non-negotiable.
- **No accuracy or cost-reduction percentages dressed up as benchmarks.** The discipline is the deliverable.

## Chapter blueprint

### Chapter 1 — LLMOps vs MLOps (~5 min)
**What:** The five differences that make LLMOps a distinct discipline — non-determinism, generative outputs, third-party black boxes, per-request cost variability, adversarial users. What carries over from classical MLOps (versioning, observability, CI/CD, incident response) and what doesn't. The framing for everything that follows.
**Sources:** [2], [3], [4], [5], [6], [10].

### Chapter 2 — Model evaluation in production (~5 min)
**What:** Three-tier sampling — light continuous traffic eval, targeted slice eval on risky inputs, and a human-labelled gold set. LLM-as-judge done right (with calibration, not blind trust). PII discipline for regulated contexts — redaction at capture, access boundaries, alignment with HIPAA / GDPR / India DPDP.
**Sources:** [7], [8], [17].

### Chapter 3 — Drift detection (~5 min)
**What:** Three drift types — input (your users changed), output (your model changed), behavioral (your vendor changed silently). Regression-set replay as the detection mechanism. The difference between actionable alerts (drift that moves a metric you care about) and cosmetic alerts (distribution shift that doesn't).
**Sources:** [9], [21].

### Chapter 4 — Cost optimization patterns (~5 min)
**What:** The cost surprise — same task, 10x more spend when users get clever. Four patterns that work: prompt compression, response caching, tier-routing (cheap first, escalate on low confidence), smaller-model + retrieval. Three anti-patterns: caching personalized outputs, blanket downsizing without eval, hidden retry storms. Cost telemetry on every span.
**Sources:** [10], [11], [12].

### Chapter 5 — Versioning prompts and models together (~5 min)
**What:** The one-artifact discipline — prompt + model pin + eval set versioned as a single immutable triple, never separately. Three rollout patterns inherited from progressive delivery: shadow (mirror traffic), canary (small % real), feature flag (per-cohort). The 60-second rollback target as the operational floor.
**Sources:** [13], [14].

### Chapter 6 — Observability with traces (~5 min)
**What:** OpenTelemetry GenAI semantic conventions as the open standard for spans (model, tokens, temperature, prompt/response attributes). MLflow versus LangSmith — when each fits, when to run both. A/B testing on stored traces rather than synthetic eval sets alone, so comparisons reflect real production input distributions.
**Sources:** [1], [2], [3], [20].

### Chapter 7 — Incident response for LLM failures (~5 min)
**What:** Four incident types — quality regression, drift, abuse (prompt injection / jailbreak), vendor outage — each with its own runbook. The 5-question triage: what changed, who's affected, which artifact version, blast radius, rollback cost. The eval-case-it post-mortem — every incident becomes a regression test added to the gold set, so the same failure cannot ship twice.
**Sources:** [15], [16], [21].

### Chapter 8 — Capstone · your LLMOps runbook (~6 min)
**What:** A 5-section runbook (eval, drift, cost, versioning, incidents) the platform team can ship in a quarter. Four trust trip-wires — no artifact without an eval triple, no rollout without a rollback target, no incident without an eval-case-it entry, no vendor pin without drift monitoring. Interactive runbook builder calibrated to the team's stack. NIST AI RMF and EU AI Act as the governance backdrop.
**Sources:** [13], [15], [18], [19], [21].

## Tone

- **Andrew, platform-engineer register.** Precise, operational, calm. The voice that's been on-call long enough to know which alerts matter.
- **MLOps as the inheritance, LLMOps as the delta.** We respect what carries over; we name what's new without theatrics.
- **Discipline over heroics.** Runbooks, rollback targets, regression tests — not vibes.
- **Honest about vendor variability.** Third-party black boxes are a fact, not a scandal; the operating posture is detection plus reversibility.

## Theme

Same neutral-slate + orange-accent palette (primary `#475569`, accent `#F97316`). No emojis. Sora headings, Inter body.
