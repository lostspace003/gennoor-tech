# Chapter 3 — Document cracking

**Course:** Banking Multimodal RAG · **Chapter:** 03 · ~4.5 min

## Persona
Andrew. Engineer + product register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter three. *Document cracking.* Text + tables + charts into retrieval-ready chunks.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · 3 content types]

Three content types · three crackers.

*Type one — text.* Headings · paragraphs · footnotes. *Document Intelligence layout model with structure-aware chunking.*

*Type two — tables.* Financial statements · ratio tables · comparison grids. *Document Intelligence extracts as HTML or structured JSON. Each row + header becomes its own chunk OR full table becomes one chunk depending on size.*

*Type three — charts.* Bar · line · pie · scatter. *Vision + GPT-4o describes the chart and extracts data where possible. Chart image stored alongside description for downstream multimodal retrieval.*

> [S3 ▸ slide change · t ≈ 1:15]

> [S3 ▸ reveal 1 · table-cracking discipline]

Table-cracking discipline.

*Small tables (<10 rows).* Whole table as one chunk. Include header + body together. *Model can reason over the full table.*

*Medium tables (10-50 rows).* Header + row-group chunks. Header repeated in each chunk for context. *Five rows per chunk typical.*

*Large tables (>50 rows).* Header + individual-row chunks. Each row as its own chunk with header context appended.

*Always preserve.* Column headers in each chunk. Source document + page. Row position. *Without these, the model can answer rows but not "which row."*

> [S4 ▸ slide change · t ≈ 2:30]

> [S4 ▸ reveal 1 · chart-cracking discipline]

Chart-cracking discipline.

*Step one.* Extract chart image from PDF.

*Step two.* Vision pass — GPT-4o describes chart type, axes, series, key data points. Output structured JSON.

*Step three.* Store chart image + description + JSON together.

*Step four.* At query time, when retrieval surfaces a chart-related chunk, the chart image is also sent to the multimodal LLM. *Inline chart understanding.*

The accuracy lift on chart-based queries. *Substantial.* Going from text-only to multimodal moved chart-query accuracy from ~25% to ~80% in this bank's evaluation.

> [S5 ▸ slide change · t ≈ 3:45]

> [S5 ▸ reveal 1 · honest scoring]

How to score document cracking. *Two questions.*

*Question one — for table-level queries, is row-level retrieval working?* Yes >80% accuracy green · 50-80% amber · *<50% red — table semantics being lost*.

*Question two — for chart-level queries, are charts being sent to multimodal LLM at query time?* Yes always green · sometimes amber · *no/text-only red — charts invisible*.

> [S5 ▸ reveal 2 · the close]

The Monday move. *Sample 10 chart queries from your domain.* Run them through current text-RAG. *Failure rate tells you the chart-cracking opportunity.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Indexing strategy.*

> [end]
