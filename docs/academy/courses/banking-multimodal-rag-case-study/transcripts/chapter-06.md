# Chapter 6 — Evaluation harness

**Course:** Banking Multimodal RAG · **Chapter:** 06 · ~4.5 min

## Persona
Andrew. Engineer + product register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter six. *Evaluation harness.* What model risk management actually wants to see.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · 3-layer eval]

Three eval layers — MRM-defensible.

*Layer one — retrieval evaluation.* Hit rate · MRR · recall@k on 200 gold queries. *Whether the right chunks come back.*

*Layer two — grounding + faithfulness.* For each generated answer, is it supported by the retrieved chunks? *LLM-as-judge with structured rubric. Different model family than generator (Claude judging GPT-4o output, or vice versa).*

*Layer three — answer accuracy.* Numerical accuracy on table queries. Trend correctness on chart queries. Domain expert reviews 20 per week. *Sample-based gold standard.*

> [S3 ▸ slide change · t ≈ 1:15]

> [S3 ▸ reveal 1 · gold set construction]

Gold set construction for this bank.

*Size.* 200 queries across query types and document classes.

*Coverage.* 60 text-only queries · 80 table queries · 40 chart queries · 20 mixed multi-source.

*Source.* Real analyst queries from 6 months of production logs. Anonymised. Labelled with expected answer + source documents + source pages.

*Maintenance.* New gold cases added monthly from production. Reviewed quarterly. Retired when no longer representative.

> [S4 ▸ slide change · t ≈ 2:30]

> [S4 ▸ reveal 1 · CI integration]

Continuous evaluation in CI.

*Trigger.* Every change to prompts, index schema, embedding model, or LLM version.

*What runs.* Full 200-query gold suite. All 3 eval layers.

*Pass criteria.* Each layer must not regress more than 2% from previous baseline. Any regression below threshold blocks deploy until investigation.

*Reports.* Eval results stored in Azure DevOps + MLflow. Diff visible to PR reviewers.

> [S5 ▸ slide change · t ≈ 3:30]

> [S5 ▸ reveal 1 · honest scoring]

How to score eval harness. *Two questions.*

*Question one — does your eval cover all 3 layers (retrieval + grounding + answer accuracy)?* Yes all 3 green · 2 of 3 amber · *1 layer red — incomplete, MRM won't accept*.

*Question two — does CI block deploys on eval regression?* Yes hard-block green · soft amber · *informational only red — regressions ship*.

> [S5 ▸ reveal 2 · the close]

The Monday move. *Run your current gold eval set today.* If you don't have one, build a 50-query starter. *Without it, every change is a guess.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Regulatory acceptance — RBI and SAMA pre-checks. MRM submission.*

> [end]
