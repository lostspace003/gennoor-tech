# Chapter 2 — Stack Fit Assessment

**Course:** Banking Multimodal RAG · **Chapter:** 02 · ~4.5 min

## Persona
Andrew. Engineer + product register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter two. *Stack Fit Assessment.* Azure AI Search · Vision · GPT-4o. Mapping capabilities to pipeline stages.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · 3-stage pipeline]

The three-stage pipeline.

*Stage one — ingest + crack.* Documents in. Text · tables · charts extracted as separate retrievable chunks.

*Stage two — index + retrieve.* Chunks embedded. Hybrid search returns relevant ones. Re-ranker prioritises.

*Stage three — generate + cite.* GPT-4o reads retrieved chunks. Generates answer. Cites sources.

Each stage maps to specific Azure capabilities.

> [S3 ▸ slide change · t ≈ 1:00]

> [S3 ▸ reveal 1 · stage 1 stack]

Stage one — ingest + crack.

*Azure AI Document Intelligence.* For text + table extraction from PDFs. *Layout model preserves table structure.*

*Azure AI Vision.* For chart understanding. *GPT-4o vision can describe a chart. Document Intelligence + Vision in combination extract data from charts where possible.*

*Azure Blob Storage.* Raw documents stored with provenance metadata. *Hash-versioned for re-cracking when models improve.*

> [S4 ▸ slide change · t ≈ 1:45]

> [S4 ▸ reveal 1 · stage 2 stack]

Stage two — index + retrieve.

*Azure AI Search.* Vector + keyword + semantic ranking in one query. *Best-in-class hybrid out of the box.*

*Azure OpenAI embeddings.* text-embedding-3-large for the dense vector layer. *1536 or 3072 dimensions.*

*Index schema.* Chunk text · chunk type (text/table/chart) · source document · page · embedding · keywords · permission tags.

> [S5 ▸ slide change · t ≈ 2:30]

> [S5 ▸ reveal 1 · stage 3 stack]

Stage three — generate + cite.

*Azure OpenAI GPT-4o.* For answer generation. *Multimodal — can read text chunks and inline chart images.*

*Prompt structure.* System message defines role + citation requirement. User message has the query + retrieved chunks + chart images.

*Citation surfacing.* GPT-4o outputs structured JSON with answer + citation list. Front-end renders source links inline.

> [S5 ▸ reveal 2 · honest scoring]

How to score Stack Fit. *Two questions.*

*Question one — does each pipeline stage have specifically-assigned services, not "Azure OpenAI for everything"?* Yes mapped green · partial amber · *single-service approach red — won't handle multimodal*.

*Question two — is the citation requirement built into the prompt structure, not bolted on?* Built in green · prompt-engineering retrofit amber · *no/post-hoc red — citation reliability is brittle*.

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Document cracking.* Text · tables · charts.

> [end]
