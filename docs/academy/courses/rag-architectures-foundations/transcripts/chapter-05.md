# Chapter 5 — Re-ranking strategies

**Course:** RAG Architectures · **Chapter:** 05 · ~4.5 min

## Persona
Emma. Engineer-to-engineer register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter five. *Re-ranking strategies.* Cross-encoders, LLM rerankers, and when they earn their cost.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · why re-ranking]

Why re-ranking exists.

Retrieval pulls back say 50 candidates. The top-5 going into the LLM determines answer quality.

*The problem.* Initial retrieval ranking is built for recall, not precision. *The right answer is often in the top-50 but ranked at position 23.*

*The fix.* A second pass that's slower but more accurate. *Re-score the 50 candidates with a model that reads query and document together.*

> [S3 ▸ slide change · t ≈ 1:00]

> [S3 ▸ reveal 1 · 3 re-ranker types]

Three types of re-rankers.

*Type one — cross-encoder.* Transformer model that takes (query, document) and outputs a relevance score. *Examples: BAAI/bge-reranker-large, ms-marco-MiniLM. Self-hosted or via Hugging Face.*

*Type two — managed reranker API.* Cohere Rerank, Voyage AI Rerank. *Pay-per-query. Higher latency than self-hosted but no infra to run.*

*Type three — LLM reranker.* Use a small LLM to score candidates. *Most expensive. Best quality on ambiguous queries. Worth it only for high-value queries.*

> [S4 ▸ slide change · t ≈ 2:00]

> [S4 ▸ reveal 1 · cost vs quality curve]

The cost-versus-quality curve.

Re-ranking improves quality. *But quality lift per dollar drops off fast.*

*First 50 candidates re-ranked.* Often 15-25% quality lift over pure retrieval. *Strong ROI.*

*Beyond 50 candidates.* Marginal lift. *Often not worth the latency hit.*

*Re-ranking everything in the index.* No. *That's just slow retrieval.*

The discipline: *re-rank a small top-N. Tune N to your latency budget. Measure quality before and after.*

> [S5 ▸ slide change · t ≈ 3:00]

> [S5 ▸ reveal 1 · honest scoring]

How to score re-ranking. *Two questions.*

*Question one — does re-ranking lift answer quality on your evaluation set?* >10% lift green · 5-10% amber · *<5% red — costing latency without value.*

*Question two — is the re-ranker latency staying within your p95 budget?* Yes green · marginal amber · *no red — strip it back or switch to a smaller model.*

> [S5 ▸ reveal 2 · the close]

The Monday move. *Run your eval set with and without re-ranking.* Plot the curves. *If your team is debating re-ranking strategies, this 30-minute experiment ends the debate.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Evaluation.* Retrieval quality vs answer quality, and how to measure both.

> [end]
