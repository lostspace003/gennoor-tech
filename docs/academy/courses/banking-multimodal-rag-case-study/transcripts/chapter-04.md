# Chapter 4 — Indexing strategy

**Course:** Banking Multimodal RAG · **Chapter:** 04 · ~4.5 min

## Persona
Andrew. Engineer + product register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter four. *Indexing strategy.* Schemas · embedding choices · provenance tracking.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · index schema]

The index schema this bank settled on.

*Field — chunk_text.* The actual chunk content.

*Field — chunk_embedding.* text-embedding-3-large vector.

*Field — chunk_type.* "text", "table", "chart". Used for retrieval boosting and filtering.

*Field — source_document.* Document ID + filename + version hash.

*Field — page.* Page number in source.

*Field — chunk_position.* Within-document position for reconstruction.

*Field — permission_tags.* Access control. Department, role, region.

*Field — recency_date.* When the source document was published. Used for time-based filtering.

*Field — chart_image_url.* For chunks of type "chart", a URL to the actual chart image.

Nine fields. *Each with a specific use at query time.*

> [S3 ▸ slide change · t ≈ 1:45]

> [S3 ▸ reveal 1 · embedding choices]

Embedding model choices.

*Default — text-embedding-3-large.* 3072 dimensions. *Strongest semantic embedding from OpenAI as of 2026.*

*Cheaper alternative — text-embedding-3-small.* 1536 dimensions. *Acceptable for many domains. The bank tested both; large won by 7-9% on retrieval recall.*

*Multilingual.* If your corpus is multilingual (common in GCC + India contexts), test with multilingual embedding models. *text-embedding-3-large is multilingual-capable.*

> [S4 ▸ slide change · t ≈ 2:30]

> [S4 ▸ reveal 1 · chunk size discipline]

Chunk size discipline.

*Text chunks — 400-800 tokens.* Smaller than common defaults. *Banking content is dense. Larger chunks dilute meaning.*

*Table chunks — variable.* Small tables whole. Large tables row-grouped.

*Chart chunks — text description ~200 tokens + image stored separately.*

*Overlap.* 50 tokens between text chunks. Prevents context loss at boundaries.

> [S5 ▸ slide change · t ≈ 3:15]

> [S5 ▸ reveal 1 · honest scoring]

How to score indexing strategy. *Two questions.*

*Question one — does your schema include chunk_type and source provenance for citation?* Yes both green · partial amber · *no red — citation broken*.

*Question two — have you tested at least 2 embedding models against your eval set?* Yes documented green · default-only amber · *no/picked-by-default red*.

> [S5 ▸ reveal 2 · the close]

The Monday move. *Pull your current index schema.* Map fields to query-time use. *Unused fields and missing fields are the schema refactor.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Hybrid search at production scale.*

> [end]
