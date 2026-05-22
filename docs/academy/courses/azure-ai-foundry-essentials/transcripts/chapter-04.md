# Chapter 4 — Evaluation harness

**Course:** Azure AI Foundry Essentials · **Chapter:** 04 · ~4.5 min

## Persona
Emma. Azure-architect register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter four. *Evaluation harness.* Built-in Foundry evaluators. Custom judges. What you actually wire up.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · built-in evaluators]

Foundry's built-in evaluators.

*Groundedness.* Does the answer ground in the provided context? *For RAG, this is the metric that catches hallucinations.*

*Relevance.* Does the answer address the question? *Catches the case where retrieval brought back valid content but the answer drifted.*

*Coherence + fluency.* Standard output-quality metrics. *Less load-bearing for most workloads, but worth tracking.*

*Safety.* Built on Azure Content Safety. Catches harmful outputs. *Required for any customer-facing surface.*

Default to wiring all four. *They're cheap.*

> [S3 ▸ slide change · t ≈ 1:15]

> [S3 ▸ reveal 1 · custom evaluators]

Three patterns for custom evaluators.

*Pattern one — LLM-as-judge with structured rubric.* Use a different model family than your generator. Structured 1-5 scale. *Reproducibility from structure.*

*Pattern two — code-based evaluator.* Regex, JSON schema validation, format check. *For deterministic correctness criteria — JSON output, presence of required fields, citation links resolvable.*

*Pattern three — human-in-loop for high-stakes.* Sampling for the cases that matter most. *Don't average and move on — investigate when humans and judges disagree.*

> [S4 ▸ slide change · t ≈ 2:15]

> [S4 ▸ reveal 1 · the eval workflow]

The Foundry eval workflow that scales.

*Step one.* Build a gold eval set in Foundry — 50 to 200 examples covering happy path, edge cases, adversarial.

*Step two.* Wire it as a flow that runs on every model or prompt change. *Like unit tests, but for LLM outputs.*

*Step three.* Compare runs against baseline. *Block deploys that regress core metrics. Allow deploys that improve.*

*Step four.* Production sampling layer. *Daily sample to catch drift. Weekly review of disagreements.*

Without the workflow, eval is a one-time exercise. *Quality drifts silently.*

> [S5 ▸ slide change · t ≈ 3:30]

> [S5 ▸ reveal 1 · honest scoring]

How to score Foundry eval discipline. *Two questions.*

*Question one — does every prompt or model change run the eval flow before deploy?* Yes automated green · manual amber · *no red — regressions ship*.

*Question two — for your customer-facing surface, is safety evaluation wired and the action-on-fail defined?* Yes green · safety only amber · *no red — content safety incident waiting*.

> [S5 ▸ reveal 2 · the close]

The Monday move. *Set up a 50-example gold eval flow in Foundry for one production workload.* Run it against current model + prompt. *That baseline is what you defend against drift.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Deployment options.* Serverless, managed compute, batch.

> [end]
