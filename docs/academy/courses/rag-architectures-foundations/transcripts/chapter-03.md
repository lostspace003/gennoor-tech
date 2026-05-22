# Chapter 3 — Vector stores

**Course:** RAG Architectures · **Chapter:** 03 · ~4.5 min

## Persona
Emma. Engineer-to-engineer register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter three. *Vector stores.* pgvector, Pinecone, Azure AI Search, Weaviate. The right choice for your scale.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · 4 stores compared]

Four vector stores. Honest comparison.

*pgvector.* Postgres extension. Your existing database becomes a vector store. *Easiest operational story. Scales to single-digit millions of vectors comfortably. Past that, performance falls off.*

*Pinecone.* Managed service. *Highest performance per dollar above 10 million vectors. Vendor lock-in. Pricing surprises if usage spikes.*

*Azure AI Search.* Microsoft's hybrid search engine. *Best in class for hybrid (BM25 + vector + semantic) out of the box. Excellent if you're already on Azure.*

*Weaviate.* Open-source with managed option. *Good middle ground. Strong modular schema. Self-host or managed cloud.*

> [S3 ▸ slide change · t ≈ 1:15]

> [S3 ▸ reveal 1 · the scale question]

The scale question.

*Under one million vectors.* pgvector wins. *Your existing Postgres team can operate it. No new infrastructure.*

*One to ten million vectors.* Azure AI Search or Weaviate. *Hybrid search becomes the differentiator at this scale. pgvector's HNSW is OK but lags.*

*Above ten million vectors.* Pinecone, Azure AI Search, or specialised stores like Qdrant or Milvus. *Performance + operational maturity become non-negotiable.*

> [S4 ▸ slide change · t ≈ 2:15]

> [S4 ▸ reveal 1 · 3 evaluation dimensions]

Three dimensions to evaluate beyond raw performance.

*Dimension one — operational footprint.* Who runs it? On-call rotation? Disaster recovery? *Managed services trade money for ops simplicity.*

*Dimension two — hybrid search support.* Pure vector search is often insufficient. *Does the store support BM25 + vector + reranking in one query? Or do you stitch it yourself?*

*Dimension three — metadata filtering.* Production RAG filters by tenant, document type, recency, access permissions. *How efficient is filtered search? Some stores fall over at high cardinality.*

> [S5 ▸ slide change · t ≈ 3:15]

> [S5 ▸ reveal 1 · the cost trap]

The cost trap most teams hit.

Vector store costs are usually a *small* fraction of total RAG bill. Embedding API calls and LLM generation dominate.

The cost mistake teams make. *Re-embedding documents on every change.* Embedding is expensive. *Embed once. Re-embed only when content changes. Cache by document hash.*

*Second cost mistake.* Over-provisioning capacity. Vector stores price on RAM. *Most queries hit a small subset. Hot/cold tiering reduces cost meaningfully.*

> [S5 ▸ reveal 2 · the close]

The Monday move. *Count your vectors.* Project to 12-month volume. Map to the scale guide. *Your decision should be defensible to your CFO, not just your team.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Hybrid search.* BM25 + vectors + semantic ranking. Where the quality is hiding.

> [end]
