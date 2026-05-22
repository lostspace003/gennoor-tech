# Chapter 1 — The banking use case

**Course:** Banking Multimodal RAG · **Chapter:** 01 · ~4.5 min

## Persona
Andrew. Engineer + product register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Welcome to the Banking Multimodal RAG case study. *Andrew here.* Why pure text-RAG fails on financial documents. The bank's actual success criteria.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · the principle]

The principle.

This case is a real bank build. *Anonymised but structurally honest.* RAG over annual reports, regulatory filings, internal credit memos.

The team shipped text-only RAG first. *Three months in, the business pushed back hard.* Queries about charts came back wrong. Queries about tables returned text chunks. Queries about scanned annexures retrieved nothing useful.

The pivot to multimodal. *That's what this case walks through.*

> [S3 ▸ slide change · t ≈ 1:15]

> [S3 ▸ reveal 1 · 3 failure modes text-RAG hit]

Three failure modes pure text-RAG hit on financial documents.

*Failure one — table semantics destroyed.* PDF tables flattened to text lose row-column structure. *"Revenue in 2024 from segment X" can't be answered because the table is just words now.*

*Failure two — charts invisible.* Bar charts, line charts, pie charts in annual reports are images. *Pure text extraction misses them entirely. The most quoted data is the chart data.*

*Failure three — scanned annexures.* Older regulatory filings, court documents, due-diligence packs. *OCR quality varies. Headers and footers contaminate chunks. Page boundaries split sentences.*

These three are not edge cases in banking. *They are most of the corpus.*

> [S4 ▸ slide change · t ≈ 2:45]

> [S4 ▸ reveal 1 · 4 success criteria]

Four success criteria the bank negotiated with the business.

*Criterion one — accuracy at table-level questions.* "What was net interest margin in Q3 2024 from Bank Y's filing?" *Must answer with the actual number, not a paragraph mentioning it.*

*Criterion two — chart-data retrieval.* "What was the trend in NPL ratio across the last 3 years?" *Model must extract from the chart, not just describe the surrounding text.*

*Criterion three — citation surfacing.* Every answer must point to source document + page + chunk. *Air Canada Moffatt cross-domain. Bank cannot give answers it can't defend.*

*Criterion four — answer in under 8 seconds for 95% of queries.* Without this, analysts go back to Ctrl+F. The product fails by neglect.*

> [S5 ▸ slide change · t ≈ 3:45]

> [S5 ▸ reveal 1 · honest scoring]

How to score this kind of build before starting. *Two questions.*

*Question one — have you tested text-RAG on representative documents from your corpus?* Yes with measurements green · "we read the docs" amber · *no/skipped red — you don't know what's broken*.

*Question two — has the business pre-committed to specific success criteria, not just "good answers"?* Yes specific green · partial amber · *no red — perpetual scope creep ahead*.

> [S5 ▸ reveal 2 · the close]

The Monday move. *Pull 20 representative financial documents.* Test current text-RAG on 15 real queries. *Failure modes you find map this case study to your context.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Stack Fit Assessment.* Azure AI Search · Vision · GPT-4o.

> [end]
