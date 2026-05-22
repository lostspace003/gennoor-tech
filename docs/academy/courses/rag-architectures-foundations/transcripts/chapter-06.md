# Chapter 6 — Evaluation

**Course:** RAG Architectures · **Chapter:** 06 · ~4.5 min

## Persona
Emma. Engineer-to-engineer register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter six. *Evaluation.* Retrieval quality vs answer quality. The two layers most teams conflate.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · two distinct layers]

Two distinct evaluation layers.

*Layer one — retrieval evaluation.* Did the right chunks come back? *Independent of the LLM.* Metrics: hit rate, MRR (mean reciprocal rank), recall@k.

*Layer two — answer evaluation.* Given retrieved chunks, did the LLM produce a good answer? *Metrics: groundedness, faithfulness, answer relevance.*

Most teams measure only end-to-end answer quality. *Then can't diagnose where it broke.* Always measure both layers separately.

> [S3 ▸ slide change · t ≈ 1:00]

> [S3 ▸ reveal 1 · retrieval metrics]

Three retrieval metrics.

*Hit rate at k.* Of your eval queries, what fraction have at least one correct chunk in the top-k? *Quickest sanity check. Aim for 90%+ at k=10.*

*MRR — mean reciprocal rank.* Where in the top-k does the correct chunk appear? *1.0 = always at position 1. 0.5 = always at position 2. 0.0 = never in top-k.*

*Recall at k.* Of all relevant chunks per query, what fraction are in the top-k? *Critical when queries have multiple correct sources.*

> [S4 ▸ slide change · t ≈ 2:00]

> [S4 ▸ reveal 1 · answer metrics]

Three answer-quality metrics.

*Groundedness.* Is the answer supported by the retrieved chunks? *Use an LLM-as-judge: "Is statement X supported by context Y?"*

*Faithfulness.* Does the answer hallucinate facts not in retrieval? *Catch the cases where the LLM made things up despite having sources.*

*Answer relevance.* Does the answer address the question? *Sometimes the model retrieves correctly but answers a different question.*

These three are the RAGAS framework. *Tooling exists. Use it.*

> [S5 ▸ slide change · t ≈ 3:00]

> [S5 ▸ reveal 1 · building the eval set]

Building the eval set. *The hardest part.*

*Option one — synthetic.* Use an LLM to generate question-answer pairs from your corpus. *Fast to bootstrap. Doesn't reflect real user behaviour.*

*Option two — real queries.* Sample 100-500 from production logs. *Real distribution. Requires labelling.*

*Option three — gold + drift.* Curated 50-100 gold queries that never change. *Plus rotating real queries to catch drift.*

Best practice: option three. *Gold for regression. Rotating for production realism.*

> [S5 ▸ reveal 2 · the close]

The Monday move. *Build a 50-query gold eval set this week.* Mix easy, medium, and adversarial. *Once it exists, every RAG change becomes measurable.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Common RAG failures and fixes.* Six failure modes you'll meet in production.

> [end]
