# AI Product Management — Research Dossier

**Course slug:** `ai-product-management`
**Track:** Function · Product Management
**Audience:** Product managers, heads of product, engineering leaders building AI features into shipped products
**Length:** 8 chapters · ~36 min total
**Voice:** Andrew (`en-US-AndrewMultilingualNeural`)

## Thesis

AI products are evaluated like products — not like models. Users do not care about model accuracy in the abstract; they care whether the product works for their job, in their context, on their data. The 2024–26 generation of AI PMs has to import two disciplines that classic SaaS PMs never needed: an eval harness (because the underlying model drifts and you do not own its weights), and explicit guardrail/refusal design (because the failure modes are weird and customer-visible). The PMs who win this decade are the ones who frame an AI job-to-be-done, instrument the acceptance rate, build evals before they ship, and communicate honestly about what the system will and will not do. Hype kills trust; trust compounds.

## Numbers table (anchor citations)

| # | Claim | Source | Date |
|---|---|---|---|
| 1 | Marty Cagan · *Inspired* (Silicon Valley Product Group) — product discovery vs delivery distinction; "valuable, viable, usable, feasible" four risks; the canonical Western PM reference reused as the AI-PM scaffold | Cagan · SVPG · *Inspired* 2nd Ed | 2017 / ongoing |
| 2 | Teresa Torres · *Continuous Discovery Habits* — opportunity solution trees, weekly customer touchpoints, assumption testing; CDH is the discovery method most AI PM teams adopt | Torres · Product Talk · CDH | 2021 |
| 3 | Jobs-to-be-Done framing — Christensen / Ulwick / Klement lineage; "users hire products to make progress on a job" — the frame the course uses to keep AI features outcome-anchored | Christensen *Competing Against Luck* + Ulwick ODI | 2016 / classic |
| 4 | Acceptance rate as the single most useful AI product metric — pattern popularised by GitHub Copilot product team and re-used across coding-assistant, sales-assistant, support-assistant categories; the "did the user keep the suggestion?" signal | Industry pattern (GitHub Copilot product reporting + analog SaaS-AI products) | 2023–2025 |
| 5 | Eval harness as a PM artefact (not just an ML eng artefact) — three categories: task evals, quality + safety evals, production telemetry evals; pattern across OpenAI Evals, Anthropic evals, LangSmith, Braintrust, Humanloop, Arize | Vendor + OSS eval tooling landscape | 2024–2026 |
| 6 | The 4 case types in an eval set: happy path, edge case, adversarial, regression. Discipline imported from software testing; required because LLM behaviour drifts on model upgrade | Industry pattern · eval-tooling docs | 2024–2026 |
| 7 | The 4 telemetry signals: acceptance, edit-distance / correction rate, escalation / fallback rate, refusal rate. Pattern across copilot products | Industry pattern across AI-assistant products | 2024–2026 |
| 8 | Roadmap tooling reality — Aha! Roadmaps, Productboard, Roadmap.com, Jira Product Discovery, Linear — all added AI features in 2024–25; the tools changed, the discipline did not | Vendor product pages | 2024–2025 |
| 9 | NPS / CSAT research limits — Reichheld's NPS (HBR 2003) is widely used and widely criticised; for AI features, in-context thumbs / acceptance beat survey NPS because they are sampled at the moment of use | Reichheld HBR + Medallia / Qualtrics critique literature | 2003 / ongoing |
| 10 | Refusal as a feature — Anthropic + OpenAI safety documentation; a well-designed refusal preserves trust where a confident wrong answer destroys it. The PM owns refusal UX | Vendor safety docs + industry pattern | 2024–2026 |
| 11 | Adversarial / red-team testing required before launch — NIST AI RMF + EU AI Act Art 15 robustness; pattern across enterprise AI launches | NIST AI RMF 1.0 + EU AI Act 2024/1689 | 2023 / Aug 2026 |
| 12 | Unit economics of inference — per-token / per-request cost is a real P&L line, not a rounding error; the "free demo to paid product" gap killed several 2024 AI startups (pattern, not a single named company) | Industry pattern · vendor pricing pages | 2024–2026 |
| 13 | Three pricing approaches for AI features: bundled into existing seat, usage-based add-on, outcome / value-based. Each has known failure modes (margin, predictability, attribution) | Industry pattern across SaaS-AI launches | 2024–2026 |
| 14 | Air Canada Moffatt tribunal (Feb 2024, B.C. Civil Resolution Tribunal) — chatbot promised a bereavement-fare refund; tribunal held the airline liable for its own bot's statement. Cross-domain analog for "what your AI says, you own" | B.C. CRT · Moffatt v. Air Canada | Feb 2024 |
| 15 | Mata v. Avianca (S.D.N.Y. Jun 2023) — confabulated citations in court filing; cross-domain analog for "AI-generated content needs source verification before it ships" | S.D.N.Y. · Mata v. Avianca · Castel J | Jun 2023 |
| 16 | ML product management patterns — Chip Huyen *Designing Machine Learning Systems* (O'Reilly 2022) + Emmanuel Ameisen *Building ML Powered Applications* (O'Reilly 2020); the canonical references for the eval / telemetry / monitoring stack a PM has to commission | Huyen + Ameisen · O'Reilly | 2020 / 2022 |
| 17 | 5 core roles on an AI product team: PM, design, ML/AI eng, software eng, data + eval engineering. The eval engineering role is the new one | Industry pattern across 2024–26 AI product orgs | 2024–2026 |
| 18 | Operating cadence — weekly eval review, monthly telemetry / acceptance-rate review, quarterly model-and-prompt-portfolio review. Pattern adopted from MLOps but PM-led | Industry pattern · MLOps + product cadence | 2024–2026 |
| 19 | EU AI Act Art 50 transparency — users must be told when they are interacting with an AI system; PM owns the disclosure UX | EU AI Act 2024/1689 Art 50 | Aug 2026 enforcement |
| 20 | "Three anti-patterns" framing — chasing benchmarks over user outcomes (Goodhart's law in product clothing), shipping without eval and telemetry, forcing AI on every feature (the "AI shoehorn" problem). Industry-observed pattern, not a single citation | Industry pattern · 2024–26 AI-feature retrospectives | 2024–2026 |
| 21 | Continuous discovery weekly touchpoint standard — Torres CDH; for AI products this is non-negotiable because user expectations shift faster than for classic SaaS | Torres · CDH | 2021 / ongoing |

## Named incidents

1. **Air Canada Moffatt (B.C. CRT, Feb 2024)** — airline liable for its chatbot's promise. Use to ground "honest communication + you own what the AI says" in Chapter 6.
2. **Mata v. Avianca (S.D.N.Y. Jun 2023)** — confabulated citations. Use as the cross-domain analog for "AI output needs source-check before it ships to a customer."
3. **The "AI shoehorn" pattern (2024–25)** — features where AI was added because the board asked for it, not because the user had a job for it. Industry-observed; ground as pattern rather than naming a single company.
4. **The "free demo to paid product" unit-economics pattern (2024–25)** — startups whose per-request inference cost exceeded ARPU. Pattern, not named company.

## What we do NOT say

- **No model-benchmark worship.** MMLU / HumanEval / GSM8K matter to the model team, not the product. The product metric is acceptance rate in the user's job.
- **No "AI replaces the PM" framing.** Discovery, JTBD framing, eval design, telemetry interpretation — these are the PM job and get harder, not easier, with AI.
- **No vendor cheerleading.** Aha!, Productboard, Roadmap.com, Jira PD, Linear referenced even-handedly. Same for eval tooling (OpenAI Evals, LangSmith, Braintrust, Humanloop, Arize).
- **No invented case studies.** Where the public record only shows a pattern, we say "industry pattern" and ground in cross-domain analogs (Air Canada Moffatt, Mata v. Avianca).
- **No "ship fast, fix later."** For AI features the cost of a confidently-wrong answer is higher than for a classic bug — trust does not recover linearly.

## Chapter blueprint

### Chapter 1 — The AI PM landscape (~5 min)
**What:** Products not models. The 5 capabilities (JTBD framing · eval harnesses · telemetry · guardrails · honest communication). The 3 anti-patterns (benchmark chase · ship-without-eval · AI-shoehorn). Cagan four-risk frame ported to AI. Torres CDH as the discovery cadence.
**Sources:** [1], [2], [3], [20].

### Chapter 2 — Job-to-be-done framing (~5 min)
**What:** The 3-part frame (user job · success criterion · failure modes). The "is this an AI job?" question — when classic rules / search / heuristics are honestly the right answer. Ulwick / Christensen lineage. Torres opportunity solution tree as the bridge from JTBD to feature.
**Sources:** [2], [3].

### Chapter 3 — Eval harnesses (~5 min)
**What:** What an eval harness is (and is not). The 3 eval categories: task, quality + safety, production telemetry. The 4 case types: happy path, edge case, adversarial, regression. Chip Huyen + Ameisen as the engineering-side reference. Eval engineering as the new role.
**Sources:** [5], [6], [16], [17].

### Chapter 4 — Telemetry + customer feedback (~5 min)
**What:** The 4 telemetry signals (acceptance · correction / edit-distance · escalation · refusal). Acceptance rate as the single most useful AI product metric. NPS / CSAT limits for AI features — sample at moment of use, not quarterly. Privacy frame: log enough to learn, redact PII, retention policy.
**Sources:** [4], [7], [9], [21].

### Chapter 5 — Guardrails + refusals (~5 min)
**What:** 4 guardrail categories (input filtering · output filtering · policy / role · tool-use scoping). Refusal as a feature — well-designed refusals preserve trust. Adversarial / red-team testing required before launch (NIST AI RMF + EU AI Act Art 15). The cross-domain analog: Mata v. Avianca for "verify before you ship the output."
**Sources:** [10], [11], [15].

### Chapter 6 — Pricing, communication, trust (~5 min)
**What:** 3 pricing approaches (bundled seat · usage add-on · outcome / value-based) with known failure modes. The unit economics problem — inference is not free, your demo margin is not your product margin. Honest communication that builds trust: Air Canada Moffatt cross-domain — what your AI says, you own. EU AI Act Art 50 disclosure UX.
**Sources:** [12], [13], [14], [19].

### Chapter 7 — Team + operating model (~5 min)
**What:** 5 core roles (PM · design · ML / AI eng · software eng · data + eval eng). Eval engineering as the new role. Operating cadence — weekly eval review, monthly telemetry / acceptance review, quarterly model + prompt portfolio review. Customer feedback loop: Torres weekly touchpoints anchored to the AI feature.
**Sources:** [17], [18], [21].

### Chapter 8 — Making it stick · 12-month roadmap (~6 min)
**What:** 12-month rollout in three phases — foundations (months 1–4: pick 2 AI jobs, stand up eval harness, instrument telemetry) · discipline (months 5–8: guardrails, refusal UX, pricing decision) · cadence (months 9–12: weekly / monthly / quarterly operating model lives). 4 trust trip-wires: ship-without-eval, no telemetry, AI-shoehorn, dishonest marketing copy. Interactive Markdown builder for the head of product / CPO.
**Sources:** Composite of [5], [7], [11], [14], [18].

## Tone

- **Andrew, product-leader register.** Precise. Outcome-anchored. Numbers + accountability. Talks to PMs and engineering leaders, not to ML researchers.
- **Honest about model limits + product limits.** The model is one input; the product is the system around it. The PM owns the system.
- **Acceptance rate as the chorus.** When in doubt, ask "did the user keep the suggestion?" That is the product question.

## Theme

Same neutral-slate (`#475569` / `#334155` / `#0F172A` / `#64748B` / `#F8FAFC`) + orange accent (`#F97316` / `#FB923C`) palette. No emojis. Sora headings, Inter body.
