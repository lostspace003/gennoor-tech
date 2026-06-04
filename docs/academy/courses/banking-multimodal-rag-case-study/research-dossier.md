# Case Study: Banking Multimodal RAG — Research Dossier

**Course slug:** `banking-multimodal-rag-case-study`
**Track:** Applied · Case Study (BFSI)
**Audience:** Technical leaders, ML engineers, and product managers learning by walking through a real bank multimodal RAG build
**Length:** 8 chapters · ~36 min total
**Voice:** Andrew (`en-US-AndrewMultilingualNeural`)

## Thesis

Most bank RAG pilots ship text-only, win the demo, and then fail the first real query — the one where the answer lives inside a chart, a table, or a scanned annexure. Multimodal isn't a model choice. It's a *document-cracking* and *index-design* choice that decides whether the system can ground the citation a regulator will ask for. This course walks through one bank's pivot from text-only to multimodal RAG on Azure AI Search + Vision + GPT-4o — the cracking discipline, the nine-field index, the three-component hybrid, the three-layer eval, and the five-section Model Risk Management (MRM) submission that survives RBI, SAMA, and the EU AI Act. The chorus: grounded citations, not clever prompting.

## Numbers table (anchor citations)

| # | Claim | Source | Date |
|---|---|---|---|
| 1 | Azure AI Search supports vector + keyword (BM25) + semantic ranker as a three-component hybrid; the semantic ranker re-ranks top results using a Microsoft-trained cross-encoder | Microsoft Learn — Azure AI Search hybrid + semantic ranking docs | 2024–2026 |
| 2 | `text-embedding-3-large` — OpenAI embedding model, 3072 dimensions, available via Azure OpenAI; the standard choice for high-accuracy enterprise RAG | OpenAI / Azure OpenAI model docs | 2024–2025 |
| 3 | GPT-4o on Azure OpenAI — native multimodal (text + image) input; the generator stage for chart/table answers in this build | Azure OpenAI model availability docs | 2024–2025 |
| 4 | BM25 — Okapi BM25 ranking function, the keyword scoring used by Azure AI Search alongside vector similarity | Robertson & Zaragoza · "The Probabilistic Relevance Framework" (industry standard) | classic reference |
| 5 | Azure AI Document Intelligence (formerly Form Recognizer) — layout + prebuilt models that produce structured table extraction with row/column semantics preserved | Microsoft Learn — Document Intelligence layout model | 2024–2026 |
| 6 | Azure AI Vision — image analysis + OCR; used here for chart-image description passes and scanned-annexure OCR | Microsoft Learn — Azure AI Vision docs | 2024–2026 |
| 7 | RBI — Reserve Bank of India FREE-AI committee report (2025) and ongoing master directions on IT governance set the explainability and audit-trail expectations for AI in Indian banks | RBI FREE-AI report + IT governance master direction | 2025 |
| 8 | SAMA — Saudi Central Bank Artificial Intelligence Ethics Principles and Cyber Security Framework set the explainability, fairness, and accountability bar for Saudi banks | SAMA AI Ethics Principles + CSF | 2023–2025 |
| 9 | EU AI Act (Regulation 2024/1689) — credit-scoring for natural persons is Annex III high-risk; back-office knowledge-retrieval RAG is generally not Annex III, but GPAI transparency obligations apply | EU AI Act 2024/1689 | Aug 2026 phased |
| 10 | Chunk-size discipline — industry pattern for finance RAG is 400–800 tokens per chunk with structural overlap; matches `text-embedding-3-large` context window economics | Industry pattern + vendor RAG guides | 2024–2026 |
| 11 | Table-cracking pattern — small tables stored whole, medium tables split by row-group, large tables stored row-by-row with column headers re-injected per row; preserves semantics across chunks | Industry pattern (Microsoft + LlamaIndex + LangChain RAG cookbooks) | 2024–2026 |
| 12 | Chart-cracking pattern — extract image, run a vision description pass, store the description in the index, and re-inject the original image at query time for GPT-4o grounding | Industry pattern from multimodal RAG cookbooks | 2024–2026 |
| 13 | Three-layer eval — retrieval (recall@k, MRR), grounding (citation-supports-claim), answer accuracy (vs gold) — the eval shape MRM teams accept in BFSI | Industry pattern + Azure AI evaluation docs | 2024–2026 |
| 14 | RAGAS / Azure AI Foundry evaluation harness — open-source + Microsoft-supported frameworks for the three-layer eval pattern | RAGAS docs + Azure AI Foundry eval docs | 2024–2026 |
| 15 | Hallucination + fabricated-citation pattern — the cross-domain analog regulators reference is Mata v. Avianca, S.D.N.Y. Jun 2023 (ChatGPT-fabricated case citations); used to ground "grounded citations or no answer" | Mata v. Avianca, S.D.N.Y. 22-cv-1461 · Jun 2023 | Jun 2023 |
| 16 | MRM — US Federal Reserve SR 11-7 "Guidance on Model Risk Management" is the canonical reference even non-US banks model their submission template on | Fed SR 11-7 | 2011 (ongoing) |
| 17 | Five-section MRM submission shape — purpose & scope · data & methodology · validation evidence · monitoring plan · limitations & controls — the structure most BFSI MRM teams expect | Industry pattern derived from SR 11-7 + RBI guidance | 2024–2026 |
| 18 | Top-30 → semantic ranker → top-8 — typical hybrid retrieval funnel in Azure AI Search production deployments; balances recall against generator context budget | Microsoft Learn — semantic ranker tuning guidance | 2024–2026 |
| 19 | 200-query gold set — industry pattern for a defensible RAG eval set in a regulated domain; smaller than ML training sets but stratified by content type (text / table / chart / annexure) | Industry pattern | 2024–2026 |
| 20 | Document Intelligence pricing tiers and ingestion-cost discipline — index build cost is dominated by Document Intelligence + embedding calls, not by Azure AI Search itself | Azure pricing pages (Document Intelligence + OpenAI embeddings) | 2024–2026 |
| 21 | Azure AI Search vector index — supports HNSW and exhaustive KNN; HNSW is the default for production scale, with `efSearch` and `m` as the standard tuning knobs | Microsoft Learn — vector search algorithms | 2024–2026 |
| 22 | Citation grounding — Azure OpenAI "On Your Data" / Assistants citations pattern; every generated sentence backed by a retrievable doc reference. The non-negotiable for banking RAG | Microsoft Learn — Azure OpenAI On Your Data | 2024–2026 |

## Named incidents

1. **Mata v. Avianca (S.D.N.Y., Jun 2023)** — ChatGPT-fabricated case citations submitted in a federal court filing; the cross-domain analog regulators reach for when they ask "how do you stop the model citing something that does not exist?" Ground the trust trip-wires here, not in an unnamed bank story.
2. **The text-only RAG pivot pattern** — bank ships text-only RAG, demo passes, first regulator-style query on a chart fails. Industry pattern observed across multiple BFSI multimodal RAG case studies; do not attribute to a specific named bank unless we have a public source.
3. **MRM rejection pattern** — submission rejected for missing the monitoring plan or the limitations section. Industry pattern grounded in SR 11-7 expectations.

## What we do NOT say

- **No invented bank name.** "A real bank" stays anonymised. No fake quarterly numbers, no fake regulator letters, no fake MRM committee names.
- **No "Azure beats AWS / Google."** This is one bank's stack choice — we explain the fit, not run a bake-off.
- **No "RAG eliminates hallucination."** RAG reduces it; grounded citation + eval harness + monitoring is the discipline.
- **No specific accuracy percentages** beyond ones we can defend ("chart queries lifted from ~25% to ~80% relevance" is framed as this bank's reported lift, not an industry constant).
- **No claim multimodal RAG is required for every bank use case.** Text-only RAG is fine when the corpus is genuinely text. The pivot is content-type-driven.
- **No claim the EU AI Act classifies internal-knowledge RAG as high-risk by default.** Credit-scoring is. Internal Q&A generally is not. Be precise.

## Chapter blueprint

### Chapter 1 — The banking use case (~5 min)
**What:** The three text-RAG failure modes (table semantics destroyed by naive chunking · charts invisible to a text-only pipeline · scanned annexures unusable without OCR + vision). The four success criteria the business pre-committed to (grounded citations · regulator-acceptable explainability · sub-5-second latency · MRM-passable evaluation). The pivot decision: text-only → multimodal.
**Sources:** [11], [12], [13], [22].

### Chapter 2 — Stack Fit Assessment (~5 min)
**What:** The three-stage pipeline (ingest + crack · index + retrieve · generate + cite) and the Azure stack mapped per stage — Document Intelligence + Vision for cracking, Azure AI Search + `text-embedding-3-large` for indexing/retrieval, GPT-4o for generation with citations. Why each component fits. What gets swapped if the bank is already on AWS Bedrock or Vertex AI (pattern transfers; service names change).
**Sources:** [1], [2], [3], [5], [6], [21], [22].

### Chapter 3 — Document cracking (~5 min)
**What:** Three content types (text · tables · charts) and three cracker behaviours. Table-cracking discipline — small whole / medium row-group / large row-by-row with column headers re-injected. Chart-cracking — extract image, vision description pass, store description, re-inject original image at query time. The reported lift on chart queries (~25% → ~80% relevance, framed as this bank's number). Scanned-annexure handling via OCR.
**Sources:** [5], [6], [11], [12].

### Chapter 4 — Indexing strategy (~5 min)
**What:** The nine-field index schema (id · content · contentVector · contentType · tableHtml · chartImageRef · sourceDoc · page · metadata). Why `text-embedding-3-large` (3072 dim) for accuracy on financial vocabulary. Chunk-size discipline at 400–800 tokens with structural overlap. HNSW tuning knobs (`m`, `efSearch`) as the production defaults.
**Sources:** [2], [10], [21].

### Chapter 5 — Hybrid search at production scale (~5 min)
**What:** The three-component hybrid — vector similarity + BM25 keyword + semantic ranker. Financial-vocabulary tuning (synonyms, acronyms, product names). The top-30 → semantic ranker → top-8 funnel. Why the ranker matters more in finance than in general Q&A: the lexical overlap problem (every doc says "interest rate").
**Sources:** [1], [4], [18].

### Chapter 6 — Evaluation harness (~5 min)
**What:** The three-layer eval — retrieval (recall@k, MRR) · grounding (citation-supports-claim) · answer accuracy (vs gold). The 200-query gold set, stratified by content type. CI integration with a hard-block on regression. Why this is the eval shape MRM accepts: it maps to validation evidence in SR 11-7 language.
**Sources:** [13], [14], [16], [19].

### Chapter 7 — Regulatory acceptance (~5 min)
**What:** The five-section MRM submission (purpose & scope · data & methodology · validation evidence · monitoring plan · limitations & controls). The five questions regional regulators consistently ask — how is the data sourced, how is the model evaluated, how do you detect drift, how do you handle a wrong answer, who is accountable. RBI (FREE-AI + IT governance), SAMA (AI Ethics Principles), and EU AI Act (GPAI transparency for back-office RAG; credit-scoring is the separate Annex III conversation).
**Sources:** [7], [8], [9], [16], [17].

### Chapter 8 — Capstone · Lessons learned (~6 min)
**What:** Five lessons from this build (cracking is the work · citations or no answer · eval before launch · MRM is a writing exercise as much as a modelling one · monitor what regulators will ask). Four trust trip-wires (no answer without a citation · no citation without grounding eval · no model swap without re-eval · no production without monitoring). Interactive build-plan builder — pick content types, stack, eval depth, and regulator → get a draft 8-week plan. The Mata v. Avianca analog as the closing reminder.
**Sources:** Composite of [13], [15], [16], [17], [22].

## Tone

- **Andrew, applied-engineer + MRM-aware register.** Precise. Component names, field schemas, tuning knobs. Not theoretical.
- **Banks-deserve-it discipline.** Every claim grounds in a doc or a regulator. No hand-waving.
- **Grounded citations as the chorus.** The whole course is one argument: ground or do not ship.

## Theme

Same neutral-slate + orange-accent palette as the rest of the Applied track (`#475569` / `#334155` slate, `#F97316` orange accent, `#0F172A` navy, `#64748B` cool grey, `#F8FAFC` tint). No emojis. Sora headings, Inter body.
