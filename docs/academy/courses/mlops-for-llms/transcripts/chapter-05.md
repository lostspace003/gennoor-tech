# Chapter 5 — Versioning prompts and models together

**Course:** MLOps for LLMs · **Chapter:** 05 · ~4.5 min

## Persona
Andrew. Platform-engineer register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter five. *Versioning prompts and models together.* Canary, shadow, rollback. The one-artifact discipline.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · the one-artifact discipline]

The one-artifact discipline.

Most teams version prompts in one place, model selection in another, eval suites in a third. *Production breaks because the three drift independently.*

The fix. *Treat prompt + model version + eval suite as one versioned artifact.*

A deploy is a triple: prompt vX, model vY, eval vZ. *Production points at one triple at a time. Rollback is changing the triple, not patching one part.*

> [S3 ▸ slide change · t ≈ 1:00]

> [S3 ▸ reveal 1 · 3 rollout patterns]

Three rollout patterns.

*Pattern one — shadow.* New artifact runs alongside production. Old serves users. *Compare outputs offline. No user impact.* For high-risk changes.

*Pattern two — canary.* New artifact serves 1-5% of traffic. Monitor for regressions. *Roll forward to 100% over hours or days.*

*Pattern three — feature flag per user.* New artifact behind a flag. Internal users + opt-ins first. *For changes that need real user feedback before broad rollout.*

> [S4 ▸ slide change · t ≈ 2:00]

> [S4 ▸ reveal 1 · rollback as one command]

Rollback as a single command.

The principle. *If rollback takes more than 60 seconds, you don't have rollback. You have hope.*

What makes 60-second rollback possible.

*Versioned artifacts.* Old triple still exists.

*Traffic-routing layer.* Switch which triple is served. Not redeploy.

*Eval suite as part of CI.* You know what good looks like for the rolled-back version.

*Observability that survives the rollback.* You can compare what users saw before vs after.

Without these. *Rollback means "deploy yesterday's code from scratch." That's 30-60 minutes minimum during an incident.*

> [S5 ▸ slide change · t ≈ 3:15]

> [S5 ▸ reveal 1 · honest scoring]

How to score versioning discipline. *Two questions.*

*Question one — can on-call roll back the current LLM artifact in under 60 seconds?* Yes tested green · "we think so" amber · *no/never-tested red — during an incident you'll learn the hard way*.

*Question two — when production answers go bad, can you trace back to the exact prompt + model + eval triple at that time?* Yes green · partially amber · *no red — root cause investigations stall*.

> [S5 ▸ reveal 2 · the close]

The Monday move. *Run a rollback drill.* Pick a prod LLM feature. Roll back, run smoke tests, roll forward. *Time the steps. That's your incident response baseline.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Observability with traces.* OpenTelemetry, MLflow, LangSmith.

> [end]
