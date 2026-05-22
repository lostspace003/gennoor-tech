# Chapter 8 — Capstone: Your LLMOps runbook

**Course:** MLOps for LLMs · **Chapter:** 08 · ~5 min

## Persona
Andrew. Platform-engineer register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter eight. *Capstone.* LLMOps runbook. 4 trust trip-wires. The builder.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · the principle]

The principle. *LLMOps is a discipline, not a vendor product.* The runbook is what your on-call operates against at 3am.

> [S3 ▸ slide change · t ≈ 0:45]

> [S3 ▸ reveal 1 · 5-section runbook]

The five sections of a working LLMOps runbook.

*Section one — eval suite.* Gold cases + sampled production traffic. Run on every deploy. Owners named.

*Section two — drift monitors.* Input, output, behavioral drift detection. Each alert has a runbook entry.

*Section three — cost telemetry.* Per-feature + per-user-cohort + p95/p99 cost. Reviewed weekly.

*Section four — versioning + rollout.* Prompt + model + eval as one artifact. Canary + shadow + rollback patterns documented.

*Section five — incident response.* Four incident types. Triage in five questions. Eval-case-it post-mortem.

Without all five. *On-call improvises. Improvisation at 3am is where reputations break.*

> [S4 ▸ slide change · t ≈ 2:00]

> [S4 ▸ reveal 1 · 4 trust trip-wires]

Four trust trip-wires. *Do not cross.*

*Trip-wire one — offline accuracy as the production gate.* For LLMs, offline doesn't predict prod. Online evals required.

*Trip-wire two — rollback that takes more than 60 seconds.* Rollback is a stated capability or a fiction. Test it.

*Trip-wire three — incidents without eval cases.* Promises don't survive the next quarter. Eval cases do.

*Trip-wire four — observability with PII in logs.* GDPR, HIPAA, DPDPA cross-domain. Tokenize before storing.

> [S5 ▸ slide change · t ≈ 3:15]

> [S5 ▸ reveal 1 · the builder]

The interactive LLMOps runbook builder.

Pick your eval cadence. Pick your tracing stack. Pick your rollout pattern. *Download the structured Markdown.* Take it to your platform team Monday.

> [S5 ▸ reveal 2 · the close]

The course in one breath. *LLMs in production don't fail like classical ML.* Online evals on sampled production. Three drift types. Cost as a feature. Versioned artifacts with 60-second rollback. Traces with OpenTelemetry GenAI. Four incident types. Eval-case-it post-mortems.

*Eight chapters. That's the course.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · the final close]

Open the builder. Pick your runbook. *Get the platform team review on the calendar before next Friday.*

See you in the next one.

> [end]
