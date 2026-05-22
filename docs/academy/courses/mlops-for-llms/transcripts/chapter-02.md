# Chapter 2 — Model evaluation in production

**Course:** MLOps for LLMs · **Chapter:** 02 · ~4.5 min

## Persona
Andrew. Platform-engineer register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter two. *Model evaluation in production.* Online evals, sampling discipline, LLM-as-judge with human review.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · why online evals]

Why production evals matter more for LLMs.

*Classical ML.* Offline accuracy on a held-out test set is a strong predictor of production performance. *Train, eval, deploy, monitor confidence and drift.*

*LLM systems.* Offline evals don't transfer. *Real users ask things your test set doesn't. Real context retrieved at inference time changes the picture. Real edge cases never in your eval suite.*

The answer. *Online evals on sampled production traffic. Continuous, not gated to release.*

> [S3 ▸ slide change · t ≈ 1:15]

> [S3 ▸ reveal 1 · 3-tier sampling]

Three-tier sampling discipline.

*Tier one — light sampling.* 1-5% of all production traffic. Automated LLM-as-judge for groundedness and faithfulness. *Cheap. Catches obvious regressions.*

*Tier two — targeted sampling.* High-stakes flows, new model versions, customer complaints. *Heavier eval — multiple judges, structured rubrics.*

*Tier three — gold cases.* 50-200 curated examples. Run on every deploy. *Catches regressions before they ship.*

Without all three. *Light sampling alone misses the rare-but-high-impact cases. Gold alone misses the long tail.*

> [S4 ▸ slide change · t ≈ 2:30]

> [S4 ▸ reveal 1 · LLM-as-judge done right]

LLM-as-judge — done right.

*Common mistake.* Use the same model that generated the answer as the judge. *Bias built in.*

*Better.* Use a different model family — Claude judging GPT, or vice versa. *Or a smaller specialized model.*

*Structured rubric.* "On a scale of 1-5, does the answer ground in the provided context?" beats "Is this a good answer?" *Reproducibility comes from structure.*

*Human review on disagreements.* When two judges disagree, escalate to human. *Don't average and move on — investigate.*

> [S5 ▸ slide change · t ≈ 3:30]

> [S5 ▸ reveal 1 · PII discipline]

PII discipline.

Production traffic contains PII. *Healthcare records, customer names, account numbers, addresses.*

You can't pipe that to an LLM-as-judge without thought. *And you can't get useful evals if you strip too aggressively.*

The pattern. *PII detection + tokenization. Replace identifiers with stable tokens before eval. Reverse on the way out if needed.*

For regulated contexts. *Run evals inside your compliance boundary. Use models cleared for PHI/PII processing. Azure OpenAI with BAA, Anthropic via Bedrock with HIPAA, internal models behind your network.*

> [S5 ▸ reveal 2 · the close]

The Monday move. *Pick one production LLM feature.* Set up 1% sampling with one LLM-as-judge metric. *Catch one regression you wouldn't have caught otherwise — that's the case for online evals.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Drift detection.* Input, output, and behavioral drift.

> [end]
