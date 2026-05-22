# Chapter 5 — Hybrid search at production scale

**Course:** Banking Multimodal RAG · **Chapter:** 05 · ~4.5 min

## Persona
Andrew. Engineer + product register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter five. *Hybrid search at production scale.* Tuning for financial vocabulary. Re-ranking + citation surfacing.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · hybrid config]

The hybrid search configuration this bank uses.

*Component one — vector search.* Top 30 results by cosine similarity on text-embedding-3-large embeddings.

*Component two — BM25 keyword.* Top 30 results matched on financial terms, ratios, regulatory phrases.

*Component three — semantic ranker.* Azure AI Search semantic ranking on combined top 30. *Cross-encoder re-scores. Final top 8 go to LLM.*

The reason for keyword alongside vectors. *Financial vocabulary is precise. "Tier 1 capital ratio" must match exactly. Vectors alone find similar concepts; keyword finds the exact term.*

> [S3 ▸ slide change · t ≈ 1:15]

> [S3 ▸ reveal 1 · financial-vocabulary tuning]

Tuning hybrid for financial vocabulary.

*BM25 field boosts.* Boost the title and headings field 3x. *Financial documents have meaningful headings — "Risk-Weighted Assets" as a heading is a strong signal.*

*Vector weight tuning.* Start at equal weight with keyword. Tune based on eval set. *Many financial queries benefit from slightly higher keyword weight than default.*

*Semantic ranker domain.* Default works well. *Some banks fine-tune the ranker; most don't need to.*

> [S4 ▸ slide change · t ≈ 2:15]

> [S4 ▸ reveal 1 · re-ranking discipline]

Re-ranking discipline.

*Top 30 to ranker.* Ranker cross-encodes query + each candidate. Outputs relevance score.

*Top 8 to LLM.* Below 8, marginal improvement. Above 8, context bloat without quality lift.

*Latency budget.* Vector + keyword + ranker total ~600ms. Headroom for LLM call within 8-second total budget.

*Citation surfacing.* Each of the 8 chunks comes with source + page + chunk_id. LLM is required to cite by chunk_id.

> [S5 ▸ slide change · t ≈ 3:15]

> [S5 ▸ reveal 1 · honest scoring]

How to score hybrid + re-ranking. *Two questions.*

*Question one — does hybrid + ranker beat pure vector on your eval set?* >10% recall lift green · 5-10% amber · *no/negative red — config is wrong*.

*Question two — are citations rendered reliably 100% of the time?* Yes always green · "usually" amber · *intermittent red — citation reliability is brittle, dangerous in financial context*.

> [S5 ▸ reveal 2 · the close]

The Monday move. *Run your eval set with pure vector and with hybrid + ranker.* Diff results on the top 5 per query. *That's where the quality lift is concrete.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Evaluation harness.*

> [end]
