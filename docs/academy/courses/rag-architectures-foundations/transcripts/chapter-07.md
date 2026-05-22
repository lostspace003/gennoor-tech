# Chapter 7 — Common RAG failures and fixes

**Course:** RAG Architectures · **Chapter:** 07 · ~4.5 min

## Persona
Emma. Engineer-to-engineer register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter seven. *Six failure modes.* The ones you actually meet in production. And the targeted fixes.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · failure 1 + 2]

Failure modes one and two.

*Failure one — bad chunking.* Chunks too big dilute meaning. Chunks too small lose context. *Sentences split mid-table. Headers separated from content.*

The fix. *Structure-aware chunking.* Use document structure — headings, sections, list items — to define chunk boundaries. *Library: LangChain text splitters. Better: write a chunker that understands your document type.*

*Failure two — query intent mismatch.* User asks "compare X and Y." Retrieval finds chunks about X. None about the comparison.

The fix. *Query rewriting.* Use an LLM to expand or reformulate the query before retrieval. *"Compare X and Y" becomes three queries: about X, about Y, comparison criteria.*

> [S3 ▸ slide change · t ≈ 1:15]

> [S3 ▸ reveal 1 · failure 3 + 4]

Failure modes three and four.

*Failure three — out-of-distribution queries.* User asks something your corpus doesn't cover. *Retrieval returns irrelevant junk. LLM answers anyway from training data.*

The fix. *Relevance threshold.* If top-1 retrieval score is below a threshold, refuse to answer. Tell the user the corpus doesn't cover this. *Better silence than a hallucinated answer.*

*Failure four — context overflow.* Top-k chunks exceed the LLM's context window. Truncation drops the relevant chunks.

The fix. *Map-reduce or recursive synthesis.* Process chunks in batches, summarise, then combine. *Or use a model with larger context. But long-context isn't always cheaper.*

> [S4 ▸ slide change · t ≈ 2:15]

> [S4 ▸ reveal 1 · failure 5 + 6]

Failure modes five and six.

*Failure five — metadata blind spots.* User has access to documents A but not B. Retrieval returns B. *Privacy incident.*

The fix. *Filter-then-retrieve.* Apply access control as a metadata filter on the vector store query. Never trust application-layer filtering. *Especially critical in Dataverse-grounded scenarios — chapter 5 of Copilot Studio course covers this.*

*Failure six — stale knowledge.* Document updated yesterday. Embedding from last month. *Retrieval returns the old chunk; new content invisible.*

The fix. *Embedding pipeline as part of CI/CD.* Re-embed on content change. Cache by content hash. *Failure to do this silently degrades quality.*

> [S5 ▸ slide change · t ≈ 3:15]

> [S5 ▸ reveal 1 · honest scoring]

How to score RAG failure-handling. *Two questions.*

*Question one — do you have a relevance threshold in production?* Yes green · "we discussed it" amber · *no red — your bot hallucinates on OOD queries*.

*Question two — re-embedding triggered on every content change?* Yes automatically green · manual amber · *no red — knowledge silently stale*.

> [S5 ▸ reveal 2 · the close]

The Monday move. *Sample 20 production queries that produced low-quality answers.* Map each to one of the six failure modes. *Patterns point to your highest-leverage fix.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · last chapter]

Last chapter. *Capstone — production RAG pipeline. The builder.*

> [end]
