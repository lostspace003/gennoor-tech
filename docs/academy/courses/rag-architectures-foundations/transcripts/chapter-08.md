# Chapter 8 — Capstone: production RAG

**Course:** RAG Architectures · **Chapter:** 08 · ~5 min

## Persona
Emma. Engineer-to-engineer register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter eight. *Capstone.* End-to-end RAG pipeline design. Eval harness. 4 trust trip-wires. The builder.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · the principle]

The principle. *Production RAG is a system, not a notebook.* Retrieval quality is the foundation. Everything else is layered on top.

> [S3 ▸ slide change · t ≈ 0:45]

> [S3 ▸ reveal 1 · 5-component architecture]

The five components of a production RAG pipeline.

*Component one — ingestion + chunking.* Structure-aware. Versioned. Re-runs on content change.

*Component two — embedding + index.* Embed once, cache by hash. Hybrid index — BM25 plus vector plus metadata.

*Component three — retrieval + re-ranking.* Hybrid search returns 50. Re-ranker scores top-50. Top-5 go to LLM.

*Component four — generation + grounding.* LLM call with explicit citation requirement. Refuses to answer when retrieval below threshold.

*Component five — evaluation + monitoring.* Gold eval set runs on every deploy. Production sample for drift detection.

> [S4 ▸ slide change · t ≈ 2:00]

> [S4 ▸ reveal 1 · 4 trust trip-wires]

Four trust trip-wires. *Do not cross.*

*Trip-wire one — answer without citation.* Always cite the retrieved source. Users without citations can't verify. Air Canada Moffatt cross-domain applies.

*Trip-wire two — confident answer on OOD query.* Without a relevance threshold, you produce confident hallucinations. Set the threshold.

*Trip-wire three — access control at retrieval, not generation.* Always filter at the vector store. Never rely on the LLM to redact.

*Trip-wire four — no eval set.* If you can't measure quality, you can't improve. Every RAG change is then a guess.

> [S5 ▸ slide change · t ≈ 3:15]

> [S5 ▸ reveal 1 · the builder]

The interactive RAG architecture builder.

Pick your scale tier. Pick your vector store. Pick your re-ranker. Pick your eval approach. *Download the architecture decision record.* Take it to architecture review Monday.

> [S5 ▸ reveal 2 · the close]

The course in one breath. *RAG looks simple in the diagram and brutal in production.* Five components — ingestion, embedding, retrieval, generation, evaluation. Hybrid search beats pure vector. Re-rank a small top-N. Measure both retrieval and answer quality. Four trip-wires you don't cross.

*Eight chapters. That's the course.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · the final close]

Open the builder. Pick your architecture. *Get architecture review on the calendar before next Friday.*

See you in the next one.

> [end]
