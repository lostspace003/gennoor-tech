# Chapter 4 — Hybrid search

**Course:** RAG Architectures · **Chapter:** 04 · ~4.5 min

## Persona
Emma. Engineer-to-engineer register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter four. *Hybrid search.* BM25 plus vectors plus semantic ranking. Where retrieval quality actually lives.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · why pure vector fails]

Why pure vector search underperforms.

Pure vector search has two systemic weaknesses. *We saw them in chapter 2.*

*Weakness one — exact identifiers.* "Order 8881234" needs keyword search. Vectors treat that ID as noise.

*Weakness two — out-of-distribution queries.* If a query uses vocabulary your training corpus underrepresents, the embedding is unreliable. *Keyword search still finds the term.*

Hybrid search combines BM25 keyword scoring with vector similarity. *Each compensates for the other's blind spots.*

> [S3 ▸ slide change · t ≈ 1:15]

> [S3 ▸ reveal 1 · fusion strategies]

Three ways to fuse the two scores.

*Strategy one — Reciprocal Rank Fusion, RRF.* Each retrieval method ranks documents. RRF combines ranks, not raw scores. *Default in Azure AI Search. Robust to scale differences.*

*Strategy two — Weighted score fusion.* Normalise BM25 and vector scores, multiply each by a weight, sum. *Tunable but the weights drift over time.*

*Strategy three — Cascade.* BM25 retrieves a wide candidate set. Vector retrieval re-ranks the top N. *Cheaper than running both in parallel at high recall.*

For most teams: *RRF as default. Tune to weighted or cascade only with evidence.*

> [S4 ▸ slide change · t ≈ 2:15]

> [S4 ▸ reveal 1 · semantic ranking]

Semantic ranking — the third layer.

After BM25 and vector retrieval produce candidates, a third layer can re-score using a cross-encoder. *Read both query and candidate together. Output a relevance score.*

*Cost.* Cross-encoders are 10-100x slower than vector search per candidate. *Only re-rank the top 20-50 from initial retrieval.*

*Value.* Substantial quality lift on ambiguous or compound queries. *Especially valuable when the answer requires understanding intent, not just term overlap.*

Azure AI Search has built-in semantic ranking. *Other stacks stitch this in via Cohere Rerank, Voyage AI rerank, or self-hosted cross-encoders.*

> [S5 ▸ slide change · t ≈ 3:15]

> [S5 ▸ reveal 1 · honest scoring]

How to score hybrid search. *Two questions.*

*Question one — for your top 100 production queries, does hybrid beat pure vector on recall at 10?* Yes green · marginal amber · *no red — you have a fusion or weighting bug.*

*Question two — for queries with identifiers, is BM25 picking them up?* Yes consistently green · sometimes amber · *no red — keyword index is broken or missing.*

> [S5 ▸ reveal 2 · the close]

The Monday move. *Run 50 of your real production queries through pure vector then hybrid.* Diff the top-5 results. *The cases where hybrid wins teach you what BM25 catches that vectors miss.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Re-ranking strategies.* Cross-encoders, LLM rerankers, and when they earn their cost.

> [end]
