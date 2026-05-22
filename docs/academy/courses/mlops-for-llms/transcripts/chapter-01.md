# Chapter 1 — LLMOps vs MLOps

**Course:** MLOps for LLMs · **Chapter:** 01 · ~4.5 min

## Persona
Andrew. Platform-engineer register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Welcome to MLOps for LLMs. *Andrew here.* What changes when the model is generative, non-deterministic, and third-party.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · the principle]

The principle.

LLMs in production don't fail like classical ML. *Classical ML fails predictably — accuracy drops, AUC slips, distribution shifts.* You can usually catch it with offline evals and dashboards.

LLMs fail differently. *They hallucinate confidently. They refuse to answer one day and answer the next. They cost 10x more per request when a single user gets clever. They get silently worse when the vendor updates the model.*

The on-call playbook is different. *That's why LLMOps is its own discipline.*

> [S3 ▸ slide change · t ≈ 1:15]

> [S3 ▸ reveal 1 · 5 differences]

Five things that change when the model is an LLM.

*Difference one — non-determinism.* Same input, different output. Standard regression tests break. *You need probabilistic eval.*

*Difference two — generative outputs.* Free-form text. No single accuracy number. *Multi-dimensional quality: groundedness, faithfulness, relevance, format.*

*Difference three — third-party black boxes.* OpenAI, Anthropic, Azure update models without notice. *Your behavior changes when their model changes.*

*Difference four — per-request cost variability.* Tokens vary 10-100x per request. *Cost is a feature, not a constant.*

*Difference five — adversarial users.* Prompt injection, jailbreaks, abuse patterns. *Security model is closer to a web app than a model.*

> [S4 ▸ slide change · t ≈ 2:30]

> [S4 ▸ reveal 1 · what carries over]

What carries over from classical MLOps.

*Carries over — versioning.* You still need to know what's running in production. *Just versioning prompts now, not weights.*

*Carries over — observability.* Traces, metrics, logs. The schemas evolve but the discipline is the same.

*Carries over — CI/CD.* Eval suites run on every change. Canary rollouts. One-command rollback.

*Carries over — incident response.* Same loop — detect, mitigate, root-cause, eval-case-it.

> [S5 ▸ slide change · t ≈ 3:15]

> [S5 ▸ reveal 1 · what doesn't]

What doesn't carry over — and where teams get hurt.

*Doesn't carry over — offline accuracy as the gate.* For LLMs, offline accuracy doesn't predict production quality. *You need online evals.*

*Doesn't carry over — model retraining cadence.* You don't retrain. Vendor does. *You version your prompts and integrations.*

*Doesn't carry over — feature stores.* LLM context is built per-request via retrieval. *No precomputed features.*

> [S5 ▸ reveal 2 · the close]

The Monday move. *List your current LLM features.* For each, how would your on-call know if quality silently degraded? *If the answer is "user complaints," that's the gap.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Model evaluation in production.* Online evals, sampling, LLM-as-judge with human review.

> [end]
