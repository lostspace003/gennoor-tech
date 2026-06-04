# RAG Architectures — Foundations · Research Dossier

**Course slug:** `rag-architectures-foundations`
**Track:** Builder · Applied AI Engineering
**Audience:** Backend engineers, ML engineers, applied scientists, and AI architects building retrieval-augmented systems
**Length:** 8 chapters · ~36 min total
**Voice:** Emma (`en-GB-EmmaMultilingualNeural`)

## Thesis

RAG looks simple in the architecture diagram and brutal in production. The reason is unglamorous: retrieval quality drives roughly 80% of system quality, and retrieval is exactly what most teams under-invest in. The 2024–26 wave of "just add RAG" projects fails not because vector databases are bad, but because teams stop at naive top-k vector search and skip the fusion, re-ranking, evaluation, and failure-mode discipline that production RAG actually requires. This course gives engineers the foundations to ship retrieval pipelines that are honest about what they retrieve, evaluable on two distinct layers, and architected around the six failure modes that consume the on-call rotation.

## Numbers table (anchor citations)

| # | Claim | Source | Date |
|---|---|---|---|
| 1 | Retrieval-Augmented Generation — original method paper introducing RAG with a parametric + non-parametric memory split | Lewis et al. · Meta AI / NeurIPS 2020 | 2020 |
| 2 | pgvector — open-source PostgreSQL extension for vector similarity search; HNSW + IVFFlat indexes | pgvector GitHub project | ongoing |
| 3 | Pinecone — managed vector database with serverless tier and hybrid search | Pinecone product documentation | 2024–2026 |
| 4 | Azure AI Search — Microsoft's hybrid retrieval service with BM25 + vector + semantic ranker | Microsoft Learn · Azure AI Search docs | 2024–2026 |
| 5 | Weaviate — open-source vector database with built-in hybrid search and modular embedders | Weaviate product documentation | 2024–2026 |
| 6 | BM25 — Okapi BM25 lexical ranking function, the keyword baseline every hybrid pipeline still uses | Robertson & Zaragoza · "The Probabilistic Relevance Framework" | 2009 reference |
| 7 | Reciprocal Rank Fusion (RRF) — parameter-light fusion of multiple ranked lists; the default hybrid combiner | Cormack, Clarke & Buettcher · SIGIR 2009 | 2009 |
| 8 | Semantic ranker as third layer in Azure AI Search — re-ranks top-N hybrid results with a transformer cross-encoder | Microsoft Learn · semantic ranking docs | 2024–2026 |
| 9 | Cross-encoder re-rankers — single-tower transformers that score (query, passage) pairs; higher quality, higher latency than bi-encoders | Sentence-Transformers / MS MARCO leaderboard pattern | ongoing |
| 10 | Managed re-ranker APIs — Cohere Rerank and Voyage Rerank as the two main vendor offerings | Cohere + Voyage product documentation | 2024–2026 |
| 11 | LLM-as-re-ranker — using a frontier LLM to score or re-order candidates; highest quality, highest cost | Industry vendor pattern (OpenAI / Anthropic / Google) | 2024–2026 |
| 12 | RAGAS — open-source evaluation framework for RAG with faithfulness, answer relevance, context precision, context recall | RAGAS open-source project | 2023–2026 |
| 13 | Retrieval metrics standard set — Hit@k, MRR (Mean Reciprocal Rank), Recall@k — IR canon long predating LLMs | Manning, Raghavan & Schütze · "Introduction to Information Retrieval" | 2008 reference |
| 14 | Chunking strategy as a dominant failure mode — fixed-token vs semantic vs structural; chunk size and overlap drive recall ceiling | Industry vendor pattern (LangChain, LlamaIndex, Azure docs) | 2024–2026 |
| 15 | Query rewriting / HyDE / multi-query — query-side techniques that lift retrieval when raw user queries are short or ambiguous | HyDE paper (Gao et al.) + industry pattern | 2022–2024 |
| 16 | Out-of-distribution (OOD) threshold — refusing to answer when top-1 similarity score is below a calibrated floor; the cheapest hallucination reducer | Industry pattern (vendor docs) | 2024–2026 |
| 17 | Context window overflow and "lost in the middle" — long-context degradation pattern documented at Stanford | Liu et al. · "Lost in the Middle" Stanford | 2023 |
| 18 | Metadata filtering as a precision lever — tenant, ACL, freshness, source-type filters at the index layer | Vendor pattern (Pinecone, Azure AI Search, Weaviate) | 2024–2026 |
| 19 | Stale-knowledge failure mode — embeddings + index never re-indexed after source-of-truth changes; a documented operational pattern | Industry vendor pattern | 2024–2026 |
| 20 | Hallucinated-citation failure in retrieval-grounded systems — model fabricating a passage attribution. Cross-domain anchor: Mata v. Avianca (S.D.N.Y. Jun 2023) | Cross-domain analog | Jun 2023 |
| 21 | EU AI Act high-risk obligations — transparency, logging, and human oversight requirements that touch RAG-grounded decision systems in regulated domains | EU AI Act 2024/1689 | Aug 2026 phased |
| 22 | MTEB — Massive Text Embedding Benchmark; the default board for comparing embedding models across retrieval, classification, clustering | MTEB leaderboard · Hugging Face | ongoing |

## Named incidents

1. **Mata v. Avianca (S.D.N.Y. Jun 2023)** — fabricated citations submitted by counsel relying on ChatGPT. The cross-domain anchor for the hallucinated-citation failure mode in any retrieval-grounded system. Sanctions issued.
2. **"Lost in the Middle" (Stanford, 2023)** — empirical demonstration that long-context models degrade when the relevant passage is buried in the middle of the prompt. Grounds the context-overflow failure mode.
3. **The stale-index pattern** — operational failure where the embedding index lags the source of truth (policy changed, document re-published, embedding never refreshed). Industry-observed; ground as pattern, not a specific named outage.

## What we do NOT say

- **No "RAG always wins" framing.** Three named cases (structural transformation, reasoning over the prompt, knowledge fits in context) where RAG is the wrong architecture.
- **No single-vendor advocacy.** pgvector, Pinecone, Azure AI Search, Weaviate referenced even-handedly with a scale guide rather than a winner.
- **No "pure vector search is enough."** Hybrid (BM25 + vector + semantic ranker) is the production baseline; pure vector is the demo.
- **No fabricated case studies, customer names, or specific WSJ/blog citations.** Where the dossier needs a real-world anchor, use Mata v. Avianca, the original RAG paper, or "Lost in the Middle."
- **No accuracy promises.** Retrieval metrics are paired with answer metrics; RAGAS is the framework, not a guarantee.
- **No "fine-tuning vs RAG" cage match.** They solve different problems; the course frames the boundary, not a winner.

## Chapter blueprint

### Chapter 1 — Why RAG and when not to use it (~5 min)
**What:** When RAG fits — large or changing knowledge base, citations required, long-tail facts. Three cases when it is the wrong architecture — structural transformation, reasoning over the prompt itself, knowledge small enough to fit in context. RAG vs long-context vs fine-tuning as three distinct levers, not competitors.
**Sources:** [1], [17].

### Chapter 2 — Embeddings explained (~5 min)
**What:** What embeddings are and what they encode well — topic, paraphrase, semantic relations. What they reliably miss — exact IDs, negation, numerics, recency. Four model-selection factors — domain fit, dimensionality, context length, hosting constraints — grounded in MTEB-style comparison.
**Sources:** [1], [22].

### Chapter 3 — Vector stores (~5 min)
**What:** Four stores compared — pgvector for "already-on-Postgres," Pinecone for serverless scale, Azure AI Search for Microsoft-stack hybrid, Weaviate for self-hosted modular. Scale guide by document count. Three evaluation dimensions — recall, latency, operational cost. The hidden cost traps in managed serverless pricing.
**Sources:** [2], [3], [4], [5].

### Chapter 4 — Hybrid search (~5 min)
**What:** Why pure vector fails on exact-match, IDs, and rare terms. Three fusion strategies — Reciprocal Rank Fusion as the default, weighted score blending, and cascade (BM25 first, then vector re-rank). Semantic ranking as the third honest layer. Honest scoring discipline — never display normalised scores as confidence.
**Sources:** [4], [6], [7], [8].

### Chapter 5 — Re-ranking strategies (~5 min)
**What:** Why re-ranking exists — first-stage retrieval optimises recall, re-ranking optimises precision on a small top-N. Three re-ranker types — cross-encoder open models, managed APIs (Cohere, Voyage), and LLM-as-judge. The cost-quality curve and the discipline of only re-ranking a small top-N.
**Sources:** [9], [10], [11].

### Chapter 6 — Evaluation (~5 min)
**What:** Two distinct layers — retrieval evaluation (did we fetch the right chunks) and answer evaluation (did the model use them faithfully). Three retrieval metrics — Hit@k, MRR, Recall@k. Three answer metrics from RAGAS — faithfulness, answer relevance, context precision. Three eval-set options — hand-curated, synthetic from documents, production-replay.
**Sources:** [12], [13].

### Chapter 7 — Common RAG failures and fixes (~5 min)
**What:** Six production failure modes with targeted fixes — chunking (size, overlap, semantic boundaries), query intent (rewriting, multi-query, HyDE), out-of-distribution queries (calibrated similarity floor), context overflow ("lost in the middle"), metadata blind spots (tenant, ACL, freshness filters), stale knowledge (re-index discipline). Each failure paired with the metric that surfaces it.
**Sources:** [14], [15], [16], [17], [18], [19].

### Chapter 8 — Capstone · production RAG (~6 min)
**What:** Five-component production architecture — ingestion, index, retrieval pipeline (hybrid + re-rank), generation with citations, evaluation harness. Four trust trip-wires — no answer without retrieved evidence, citation grounding check, OOD refusal threshold, and human-review queue for low-confidence answers. Interactive architecture-decision-record builder that captures the decisions made for the learner's own system.
**Sources:** [12], [16], [20], [21].

## Tone

- **Emma, senior engineer register.** Precise. Architecture-diagram-on-the-whiteboard cadence. Numbers and trade-offs over slogans.
- **Honest about what RAG can and cannot do.** Retrieval quality is the lever; embeddings are not magic; hybrid beats pure vector; evaluation is two layers, not one.
- **Production failure modes get named directly.** Chunking, OOD, "lost in the middle," stale knowledge, hallucinated citations — by name, with the fix.
- **No vendor-fan energy.** pgvector, Pinecone, Azure AI Search, Weaviate are tools with trade-offs, not teams to root for.

## Theme

Neutral-slate base (`#475569` / `#334155`) with an orange accent (`#F97316` / `#FB923C`) and a near-black navy (`#0F172A`) for headings. No emojis. Sora headings, Inter body.
