# Chapter 2 — Embeddings explained

**Course:** RAG Architectures · **Chapter:** 02 · ~4.5 min

## Persona
Emma. Engineer-to-engineer register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter two. *Embeddings explained.* What they encode. What they miss. How to pick the right model.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · what embeddings are]

What embeddings actually are.

A dense vector representation of text. *Typically 768 to 3072 floating-point numbers per chunk of text.*

The model maps semantically similar text to nearby points in that high-dimensional space. *"Refund policy" and "money back guarantee" end up close. "Refund policy" and "pizza recipe" end up far apart.*

That distance — usually cosine — is how RAG retrieves. *Query in. Embedding out. Nearest-neighbour search.*

> [S3 ▸ slide change · t ≈ 1:00]

> [S3 ▸ reveal 1 · what embeddings encode well]

What embeddings encode well.

*Topical similarity.* Documents about the same domain cluster together.

*Paraphrase equivalence.* "Cancel my subscription" maps near "I want to unsubscribe."

*Semantic relations.* "Doctor" and "physician" cluster. "Refund" and "reimbursement" cluster.

> [S4 ▸ slide change · t ≈ 1:45]

> [S4 ▸ reveal 1 · what embeddings miss]

What embeddings miss — and where RAG fails because of it.

*Exact identifiers.* Order ID 8881234, SKU code AB-100, customer reference X-7392. *Embeddings treat these as noise. BM25 keyword search is the partner you need.*

*Negation and contradiction.* "Refund policy" and "no refund policy" map near each other. *Semantic similarity ignores polarity.*

*Numerical reasoning.* "Quantities greater than 100" doesn't retrieve documents with "127" in them via embeddings alone. *Metadata filters fix this.*

*Recency.* Embedding doesn't know what's new. *Time-based filtering needed alongside.*

> [S5 ▸ slide change · t ≈ 2:45]

> [S5 ▸ reveal 1 · picking the model]

Picking the embedding model. *4 factors.*

*Factor one — dimension.* 768 to 3072 typical. Higher dimensions improve quality but cost more in storage and query latency. *Default to 1024 unless you have evidence to scale up.*

*Factor two — context length.* How much text per embedding. 512 tokens is common. Some models go to 8k. *Longer context means chunks can be larger, but very-long-context embeddings dilute meaning.*

*Factor three — language coverage.* If your content is multilingual, pick a multilingual model. *Most teams in GCC, India, SEA need this.*

*Factor four — provider lock-in.* OpenAI text-embedding-3-large is good but proprietary. *Open-source — BGE, E5, GTE — gives you portability.*

> [S5 ▸ reveal 2 · the close]

The Monday move. *Embed 10 representative queries from your domain.* Check whether semantically similar queries end up close. Check whether queries with identifiers end up close — they won't, *which is the lesson*.

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Vector stores.* pgvector, Pinecone, Azure AI Search, Weaviate — comparison and choice.

> [end]
