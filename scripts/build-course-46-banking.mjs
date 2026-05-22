// Course 46 — Banking Multimodal RAG Case Study (Andrew · applied track)
import { emit } from './build-chapter-html.mjs'
const courseTagline = 'Case Study · Banking Multimodal RAG'
const OUT = 'tmp/academy-build/banking-multimodal-rag-case-study/chapters'

const card = (ct, h3, ps, t) => `<div class="card"><span class="ct">${ct}</span><h3>${h3}</h3>${ps.map(p => `<p>${p}</p>`).join('')}${t ? `<div class="takeaway">${t}</div>` : ''}</div>`
const cardRed = (ct, h3, ps, t) => `<div class="card red"><span class="ct">${ct}</span><h3>${h3}</h3>${ps.map(p => `<p>${p}</p>`).join('')}${t ? `<div class="takeaway">${t}</div>` : ''}</div>`
const cell = (cn, h4, num, p, cls = '') => `<div class="cell ${cls}"><span class="cn">${cn}</span><h4>${h4}</h4>${num ? `<div class="num">${num}</div>` : ''}<p>${p}</p></div>`
const closeCard = (e, h2, p) => `<div class="final-close"><div class="eyebrow">${e}</div><h2>${h2}</h2><p>${p}</p></div>`
const baseCues = [
  { at: 0.0, slide: 1 },
  { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
  { at: 75.0, slide: 3 }, { at: 85.0, slide: 3, step: 1 },
  { at: 135.0, slide: 4 }, { at: 145.0, slide: 4, step: 1 },
  { at: 195.0, slide: 5 }, { at: 205.0, slide: 5, step: 1 }, { at: 245.0, slide: 5, step: 2 },
  { at: 270.0, slide: 6 }, { at: 280.0, slide: 6, step: 1 },
]

emit({ courseTagline, chapter: { number: '01 / 06', id: 'chapter-01', title: 'The banking use case' }, audioSrc: '../audio/chapter-01/chapter-01.mp3', outPath: `${OUT}/chapter-01-use-case.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 1 · REAL BANK BUILD · ANONYMISED', h1Html: '3 failure modes text-RAG hit · <em>4 success criteria</em>', subtitleHtml: '<strong>Charts and tables are most of the corpus in banking. Text-RAG misses them.</strong>' },
  { type: 'content', eyebrow: 'The principle', icon: '1', headlineHtml: 'Real build · <em>structurally honest</em>',
    blocks: [{ atStep: 1, html: card('THE PRINCIPLE · A REAL BANK BUILD', 'Anonymised but structurally honest', ['This case is a real bank build. <strong>RAG over annual reports · regulatory filings · internal credit memos.</strong>', 'Team shipped text-only RAG first. 3 months in, business pushed back hard. <em>Queries about charts came back wrong. Queries about tables returned text chunks. Queries about scanned annexures retrieved nothing useful.</em>'], '<strong>The pivot to multimodal.</strong> That\'s what this case walks through.') }] },
  { type: 'content', eyebrow: '3 text-RAG failure modes', icon: '!', iconRed: true, headlineHtml: 'Table semantics destroyed · charts invisible · <em>scanned annexures unusable</em>',
    blocks: [{ atStep: 1, html: cardRed('3 FAILURE MODES PURE TEXT-RAG HIT', 'Not edge cases · most of the corpus', ['<strong>1. Table semantics destroyed.</strong> PDF tables flattened lose row-column structure. <em>"Revenue 2024 from segment X" can\'t be answered.</em>', '<strong>2. Charts invisible.</strong> Bar · line · pie charts are images. <em>Pure text extraction misses entirely. Most-quoted data is chart data.</em>', '<strong>3. Scanned annexures.</strong> Older filings · court docs · DD packs. <em>OCR varies · headers/footers contaminate · page boundaries split sentences.</em>']) }] },
  { type: 'content', eyebrow: '4 success criteria', icon: '2', headlineHtml: 'Table accuracy · chart retrieval · citation · <em>latency</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('C1', 'Table-level accuracy', '', '"What was NIM Q3 2024 from Y filing?" → actual number, not paragraph.', 'green')}
${cell('C2', 'Chart-data retrieval', '', '"NPL ratio trend last 3 years?" → extract from chart, not just text.', 'green')}
${cell('C3', 'Citation surfacing', '', 'Every answer → source doc + page + chunk. <strong>Air Canada Moffatt cross-domain.</strong>', 'green')}
${cell('C4', 'Latency under 8s @ p95', '', 'Without this, analysts go back to Ctrl+F. <strong>Product fails by neglect.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Tested representative docs · <em>business pre-committed criteria</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE THIS BUILD BEFORE STARTING', '2 questions', ['<strong>Q1:</strong> tested text-RAG on representative documents? With measurements green · "we read docs" amber · <strong>no/skipped red — don\'t know what\'s broken</strong>.', '<strong>Q2:</strong> business pre-committed to specific success criteria, not "good answers"? Yes green · partial amber · <strong>no red — perpetual scope creep</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pull 20 representative financial documents', ['Test current text-RAG on 15 real queries. <strong>Failure modes map this case to your context.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 2', icon: '→', headlineHtml: 'Stack Fit Assessment · <em>Azure AI Search + Vision + GPT-4o</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 1', 'Real bank build · 3 failure modes · 4 success criteria.', '<strong>Next:</strong> 3-stage pipeline · per-stage Azure stack.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '02 / 06', id: 'chapter-02', title: 'Stack Fit Assessment' }, audioSrc: '../audio/chapter-02/chapter-02.mp3', outPath: `${OUT}/chapter-02-stack.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 2 · INGEST → INDEX → GENERATE', h1Html: '3-stage pipeline · <em>per-stage Azure stack</em>', subtitleHtml: '<strong>Each pipeline stage maps to specific Azure capabilities. Not "Azure OpenAI for everything."</strong>' },
  { type: 'content', eyebrow: '3-stage pipeline', icon: '1', headlineHtml: 'Ingest+crack · index+retrieve · <em>generate+cite</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('S1', 'Ingest + crack', '', 'Documents in · text/tables/charts extracted as separate chunks.', 'green')}
${cell('S2', 'Index + retrieve', '', 'Chunks embedded · hybrid search returns relevant · re-ranker prioritises.', 'green')}
${cell('S3', 'Generate + cite', '', 'GPT-4o reads chunks · generates answer · cites sources.', 'green')}
</div>` }] },
  { type: 'content', eyebrow: 'Stage 1 stack', icon: '2', headlineHtml: 'Document Intelligence · AI Vision · <em>Blob Storage</em>',
    blocks: [{ atStep: 1, html: card('STAGE 1 · INGEST + CRACK', '', ['<strong>Azure AI Document Intelligence.</strong> Text + table extraction from PDFs. Layout model preserves table structure.', '<strong>Azure AI Vision.</strong> Chart understanding. GPT-4o vision describes charts. Vision + DI extract data from charts where possible.', '<strong>Azure Blob Storage.</strong> Raw docs stored with provenance metadata. Hash-versioned for re-cracking when models improve.']) }] },
  { type: 'content', eyebrow: 'Stage 2 stack', icon: '3', headlineHtml: 'Azure AI Search · text-embedding-3-large · <em>index schema</em>',
    blocks: [{ atStep: 1, html: card('STAGE 2 · INDEX + RETRIEVE', '', ['<strong>Azure AI Search.</strong> Vector + keyword + semantic ranking in one query. Best-in-class hybrid out of box.', '<strong>Azure OpenAI embeddings.</strong> text-embedding-3-large for dense vector layer. 1536 or 3072 dimensions.', '<strong>Index schema.</strong> Chunk text · chunk type (text/table/chart) · source · page · embedding · keywords · permission tags.']) }] },
  { type: 'content', eyebrow: 'Stage 3 stack', icon: '4', headlineHtml: 'GPT-4o · structured prompt · <em>citation surfacing</em>',
    blocks: [
      { atStep: 1, html: card('STAGE 3 · GENERATE + CITE', '', ['<strong>Azure OpenAI GPT-4o.</strong> Multimodal — reads text chunks and inline chart images.', '<strong>Prompt structure.</strong> System message defines role + citation requirement. User: query + retrieved chunks + chart images.', '<strong>Citation surfacing.</strong> GPT-4o outputs structured JSON with answer + citation list. Front-end renders source links inline.']) },
      { atStep: 2, html: card('MONDAY MOVE · 2 SCORING QUESTIONS', 'Map services + citation requirement', ['<strong>Q1:</strong> each stage has specifically-assigned services? Yes green · partial amber · <strong>single-service red — won\'t handle multimodal</strong>.', '<strong>Q2:</strong> citation requirement built into prompt, not bolted on? Built in green · retrofit amber · <strong>post-hoc red — brittle</strong>.']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 3', icon: '→', headlineHtml: 'Document cracking · <em>text + tables + charts</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 2', '3-stage pipeline · per-stage Azure stack.', '<strong>Next:</strong> 3 content types · 3 crackers · table+chart discipline.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '03 / 06', id: 'chapter-03', title: 'Document cracking' }, audioSrc: '../audio/chapter-03/chapter-03.mp3', outPath: `${OUT}/chapter-03-cracking.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 3 · 3 CONTENT TYPES · 3 CRACKERS', h1Html: 'Text · tables · charts · <em>retrieval-ready chunks</em>', subtitleHtml: '<strong>Chart accuracy lift: ~25% text-only → ~80% multimodal in bank\'s eval.</strong>' },
  { type: 'content', eyebrow: '3 content types', icon: '1', headlineHtml: 'Text · tables · <em>charts</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('T1', 'Text', '', 'Headings · paragraphs · footnotes. <strong>DI layout model + structure-aware chunking.</strong>', 'green')}
${cell('T2', 'Tables', '', 'Financial statements · ratios · grids. <strong>DI extracts as HTML or JSON. Whole table or row-grouped.</strong>', 'green')}
${cell('T3', 'Charts', '', 'Bar · line · pie · scatter. <strong>Vision + GPT-4o describes + extracts. Image stored for downstream multimodal retrieval.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: 'Table-cracking discipline', icon: '2', headlineHtml: 'Small whole · medium row-group · <em>large individual rows</em>',
    blocks: [{ atStep: 1, html: card('TABLE-CRACKING DISCIPLINE', 'Always preserve: column headers · source + page · row position', ['<strong>Small (<10 rows).</strong> Whole table as one chunk. Include header + body. Model reasons over full table.', '<strong>Medium (10-50 rows).</strong> Header + row-group chunks. Header repeated in each. ~5 rows per chunk.', '<strong>Large (>50 rows).</strong> Header + individual-row chunks. Each row its own chunk with header context.'], '<strong>Always preserve:</strong> column headers in each chunk · source + page · row position. <em>Without these, model answers rows but not "which row."</em>') }] },
  { type: 'content', eyebrow: 'Chart-cracking discipline', icon: '3', headlineHtml: 'Extract · vision pass · store · <em>inline at query time</em>',
    blocks: [{ atStep: 1, html: card('CHART-CRACKING DISCIPLINE', '', ['<strong>Step 1.</strong> Extract chart image from PDF.', '<strong>Step 2.</strong> Vision pass — GPT-4o describes chart type · axes · series · key data points. Output structured JSON.', '<strong>Step 3.</strong> Store chart image + description + JSON together.', '<strong>Step 4.</strong> At query time, when retrieval surfaces chart-related chunk, chart image is also sent to multimodal LLM. <em>Inline chart understanding.</em>'], 'Accuracy lift on chart queries: <strong>~25% (text-only) → ~80% (multimodal)</strong> in this bank\'s evaluation.') }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '4', headlineHtml: 'Row-level retrieval · <em>charts sent to multimodal LLM</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE DOCUMENT CRACKING', '2 questions', ['<strong>Q1:</strong> for table-level queries, row-level retrieval working? >80% green · 50-80% amber · <strong><50% red — table semantics lost</strong>.', '<strong>Q2:</strong> for chart-level queries, charts sent to multimodal LLM at query time? Always green · sometimes amber · <strong>no/text-only red — charts invisible</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Sample 10 chart queries from your domain', ['Run through current text-RAG. <strong>Failure rate = chart-cracking opportunity.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 4', icon: '→', headlineHtml: 'Indexing strategy · <em>schema + embeddings + chunk sizes</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 3', '3 content types · table + chart discipline · 25%→80% lift.', '<strong>Next:</strong> 9-field schema · embedding choices · chunk size discipline.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '04 / 06', id: 'chapter-04', title: 'Indexing strategy' }, audioSrc: '../audio/chapter-04/chapter-04.mp3', outPath: `${OUT}/chapter-04-indexing.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 4 · 9-FIELD SCHEMA · EMBED + CHUNK', h1Html: 'Index schema · embedding choices · <em>chunk size discipline</em>', subtitleHtml: '<strong>Banking content is dense. Smaller chunks (400-800 tokens) than common defaults.</strong>' },
  { type: 'content', eyebrow: '9-field schema', icon: '1', headlineHtml: 'Text · embedding · type · source · page · position · permission · recency · <em>chart URL</em>',
    blocks: [{ atStep: 1, html: card('THE INDEX SCHEMA THIS BANK USES', '9 fields · each with specific use at query time', ['<strong>chunk_text</strong> — actual content', '<strong>chunk_embedding</strong> — text-embedding-3-large vector', '<strong>chunk_type</strong> — "text" / "table" / "chart" (used for boosting + filtering)', '<strong>source_document</strong> — doc ID + filename + version hash', '<strong>page</strong> — page number in source', '<strong>chunk_position</strong> — within-document position for reconstruction', '<strong>permission_tags</strong> — access control (department · role · region)', '<strong>recency_date</strong> — when source published (time filtering)', '<strong>chart_image_url</strong> — for chart-type chunks, link to actual image']) }] },
  { type: 'content', eyebrow: 'Embedding choices', icon: '2', headlineHtml: 'text-embedding-3-large · <em>3072 dimensions</em>',
    blocks: [{ atStep: 1, html: card('EMBEDDING MODEL CHOICES', 'Bank tested both · large won 7-9% on retrieval recall', ['<strong>Default — text-embedding-3-large.</strong> 3072 dimensions. Strongest semantic from OpenAI as of 2026.', '<strong>Cheaper — text-embedding-3-small.</strong> 1536 dimensions. Acceptable for many domains.', '<strong>Multilingual.</strong> Common in GCC + India. <em>text-embedding-3-large is multilingual-capable.</em>']) }] },
  { type: 'content', eyebrow: 'Chunk size discipline', icon: '3', headlineHtml: 'Text 400-800 · table variable · <em>chart desc 200 + image</em>',
    blocks: [{ atStep: 1, html: card('CHUNK SIZE DISCIPLINE', 'Banking dense — smaller than defaults', ['<strong>Text chunks — 400-800 tokens.</strong> Smaller than common defaults. Banking content dense. Larger dilutes meaning.', '<strong>Table chunks — variable.</strong> Small whole · large row-grouped.', '<strong>Chart chunks — text description ~200 tokens + image stored separately.</strong>', '<strong>Overlap — 50 tokens between text chunks.</strong> Prevents context loss at boundaries.']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '4', headlineHtml: 'Schema includes chunk_type + source · <em>2 embedding models tested</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE INDEXING STRATEGY', '2 questions', ['<strong>Q1:</strong> schema includes chunk_type and source provenance for citation? Both yes green · partial amber · <strong>no red — citation broken</strong>.', '<strong>Q2:</strong> tested ≥2 embedding models against your eval set? Documented green · default-only amber · <strong>no/picked-by-default red</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pull current index schema', ['Map fields to query-time use. <strong>Unused or missing fields = schema refactor.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 5', icon: '→', headlineHtml: 'Hybrid search · <em>tuning for financial vocab + citation surfacing</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 4', '9-field schema · embedding choices · chunk discipline.', '<strong>Next:</strong> 3-component hybrid · financial-vocab tuning · re-ranking.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '05 / 06', id: 'chapter-05', title: 'Hybrid search at production scale' }, audioSrc: '../audio/chapter-05/chapter-05.mp3', outPath: `${OUT}/chapter-05-hybrid.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 5 · VECTOR + KEYWORD + SEMANTIC RANKER', h1Html: 'Tuning for financial vocabulary · <em>re-ranking + citation surfacing</em>', subtitleHtml: '<strong>Top 30 → ranker → top 8 to LLM. Latency budget ~600ms.</strong>' },
  { type: 'content', eyebrow: '3-component hybrid', icon: '1', headlineHtml: 'Vector · BM25 · <em>semantic ranker</em>',
    blocks: [{ atStep: 1, html: card('THE HYBRID SEARCH CONFIGURATION', 'Top 30 → ranker → top 8 to LLM', ['<strong>Vector search.</strong> Top 30 by cosine similarity on text-embedding-3-large.', '<strong>BM25 keyword.</strong> Top 30 matched on financial terms · ratios · regulatory phrases.', '<strong>Semantic ranker.</strong> Azure AI Search ranking on combined top 30. <em>Cross-encoder re-scores. Final top 8 to LLM.</em>'], '<strong>Why keyword alongside vectors:</strong> financial vocabulary is precise. "Tier 1 capital ratio" must match exactly. Vectors find similar concepts; keyword finds the exact term.') }] },
  { type: 'content', eyebrow: 'Financial-vocab tuning', icon: '2', headlineHtml: 'Heading boost · weight tuning · <em>default ranker</em>',
    blocks: [{ atStep: 1, html: card('TUNING HYBRID FOR FINANCIAL VOCABULARY', '', ['<strong>BM25 field boosts.</strong> Boost title + headings field 3x. "Risk-Weighted Assets" as heading = strong signal.', '<strong>Vector weight tuning.</strong> Start equal · tune from eval set. Many financial queries benefit from slightly higher keyword weight.', '<strong>Semantic ranker domain.</strong> Default works well. Some banks fine-tune · most don\'t need to.']) }] },
  { type: 'content', eyebrow: 'Re-ranking discipline', icon: '3', headlineHtml: 'Top 30 · top 8 · <em>citation surfacing</em>',
    blocks: [{ atStep: 1, html: card('RE-RANKING DISCIPLINE', '', ['<strong>Top 30 to ranker.</strong> Cross-encodes query + each candidate. Outputs relevance score.', '<strong>Top 8 to LLM.</strong> Below 8 marginal improvement. Above 8 context bloat without quality lift.', '<strong>Latency budget.</strong> Vector + keyword + ranker total ~600ms. Headroom for LLM call within 8-second total.', '<strong>Citation surfacing.</strong> Each of 8 chunks comes with source + page + chunk_id. LLM required to cite by chunk_id.']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '4', headlineHtml: 'Hybrid beats pure vector · <em>citations rendered 100%</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE HYBRID + RE-RANKING', '2 questions', ['<strong>Q1:</strong> hybrid + ranker beats pure vector on eval? >10% lift green · 5-10% amber · <strong>no/negative red — config wrong</strong>.', '<strong>Q2:</strong> citations rendered reliably 100%? Always green · "usually" amber · <strong>intermittent red — dangerous in financial context</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Run eval with pure vector and hybrid + ranker', ['Diff top-5 per query. <strong>That\'s where quality lift is concrete.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 6', icon: '→', headlineHtml: 'Evaluation harness · <em>3-layer eval + MRM-defensible</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 5', '3-component hybrid · vocab tuning · re-ranking discipline.', '<strong>Next:</strong> 3-layer eval · gold set · CI integration.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '06 / 06', id: 'chapter-06', title: 'Evaluation harness' }, audioSrc: '../audio/chapter-06/chapter-06.mp3', outPath: `${OUT}/chapter-06-eval.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 6 · 3-LAYER EVAL · MRM-DEFENSIBLE', h1Html: '200 gold queries · <em>continuous eval in CI</em>', subtitleHtml: '<strong>Every change to prompts, schema, embedding model, or LLM version triggers full eval suite.</strong>' },
  { type: 'content', eyebrow: '3 eval layers', icon: '1', headlineHtml: 'Retrieval · grounding · <em>answer accuracy</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('E1', 'Retrieval', '', 'Hit rate · MRR · recall@k on 200 gold queries. <strong>Whether right chunks come back.</strong>', 'green')}
${cell('E2', 'Grounding + faithfulness', '', 'Each answer supported by retrieved chunks? LLM-as-judge with structured rubric. <strong>Different model family (Claude judging GPT, vice versa).</strong>', 'green')}
${cell('E3', 'Answer accuracy', '', 'Numerical accuracy on tables · trend correctness on charts. <strong>Domain expert reviews 20/week. Sample-based gold standard.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: 'Gold set construction', icon: '2', headlineHtml: '200 queries · 4 types · <em>real production logs</em>',
    blocks: [{ atStep: 1, html: card('GOLD SET CONSTRUCTION', '', ['<strong>Size.</strong> 200 queries across query types + document classes.', '<strong>Coverage.</strong> 60 text-only · 80 table · 40 chart · 20 mixed multi-source.', '<strong>Source.</strong> Real analyst queries from 6 months of production logs. Anonymised. Labelled with expected answer + source documents + pages.', '<strong>Maintenance.</strong> New gold cases added monthly from production. Reviewed quarterly. Retired when no longer representative.']) }] },
  { type: 'content', eyebrow: 'CI integration', icon: '3', headlineHtml: 'Eval on every change · <em>regression hard-blocks</em>',
    blocks: [{ atStep: 1, html: card('CONTINUOUS EVALUATION IN CI', '', ['<strong>Trigger.</strong> Every change to prompts · index schema · embedding model · LLM version.', '<strong>What runs.</strong> Full 200-query gold suite. All 3 eval layers.', '<strong>Pass criteria.</strong> Each layer must not regress more than 2% from baseline. Any regression below threshold blocks deploy until investigation.', '<strong>Reports.</strong> Eval results in Azure DevOps + MLflow. Diff visible to PR reviewers.']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '4', headlineHtml: 'All 3 layers · <em>CI hard-blocks regressions</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE EVAL HARNESS', '2 questions', ['<strong>Q1:</strong> eval covers all 3 layers (retrieval + grounding + answer accuracy)? All 3 green · 2 of 3 amber · <strong>1 red — incomplete, MRM won\'t accept</strong>.', '<strong>Q2:</strong> CI blocks deploys on eval regression? Hard-block green · soft amber · <strong>informational only red — regressions ship</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Run your current gold eval set today', ['If you don\'t have one, build a 50-query starter. <strong>Without it, every change is a guess.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 7', icon: '→', headlineHtml: 'Regulatory acceptance · <em>RBI · SAMA · MRM submission</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 6', '3-layer eval · gold set · CI integration.', '<strong>Next:</strong> MRM submission structure · 5 regulator questions · RBI + SAMA specifics.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '07 / 06', id: 'chapter-07', title: 'Regulatory acceptance' }, audioSrc: '../audio/chapter-07/chapter-07.mp3', outPath: `${OUT}/chapter-07-regulatory.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 7 · MRM SUBMISSION · RBI · SAMA · EU AI ACT', h1Html: '5-section MRM submission · 5 regulator questions · <em>regional specifics</em>', subtitleHtml: '<strong>Each section rated by MRM. Each tied to NIST AI RMF or local regulator equivalent.</strong>' },
  { type: 'content', eyebrow: '5-section MRM submission', icon: '1', headlineHtml: 'Model · development · performance · controls · <em>governance</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('M1', 'Model definition', '', 'What it is · what it does · where in decision flow.', 'green')}
${cell('M2', 'Model development', '', 'Architecture · training data lineage · evaluation methodology.', 'green')}
${cell('M3', 'Model performance', '', 'Eval results all 3 layers · test set composition · known limitations.', 'green')}
${cell('M4', 'Controls', '', 'Pre-deploy controls · prod monitoring · drift · incident response.', 'green')}
${cell('M5', 'Governance', '', 'Named owner · review cadence · decommission criteria.', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '5 regulator questions', icon: '!', iconRed: true, headlineHtml: 'Explainability · auditability · bias · residency · <em>vendor concentration</em>',
    blocks: [{ atStep: 1, html: cardRed('5 QUESTIONS REGIONAL REGULATORS CONSISTENTLY ASK', '', ['<strong>Q1 — explainability.</strong> How does user understand why this answer? <em>Citation surfacing answers this. Without citations, RAG doesn\'t pass.</em>', '<strong>Q2 — auditability.</strong> Trace a specific answer back through retrieval and generation chain? Logging every query · chunks · response · model version.', '<strong>Q3 — bias + fairness.</strong> Different demographic groups treated consistently? Required even for non-credit RAG.', '<strong>Q4 — data residency.</strong> Where is data processed? Embeddings live? Sovereign region in writing.', '<strong>Q5 — vendor concentration.</strong> Vendor sunsets or changes pricing — what happens? Vendor risk plan required.']) }] },
  { type: 'content', eyebrow: 'RBI + SAMA + EU specifics', icon: '2', headlineHtml: 'India · Saudi · <em>EU AI Act</em>',
    blocks: [{ atStep: 1, html: card('REGIONAL REGULATOR SPECIFICS · 6-WEEK ASSESSMENT IN PARALLEL', '', ['<strong>RBI (India).</strong> Data residency in Indian region · audit trail of every customer-facing AI interaction · annual independent third-party model validation.', '<strong>SAMA (Saudi).</strong> Sovereign infra preference (G42, NEOM Cloud) · Arabic-language explainability · Sharia-compliance review for decision-supporting AI.', '<strong>EU AI Act (international banks with EU customers).</strong> High-risk classification if used in credit decisions · conformity assessment · post-market monitoring.']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: '5 questions documentable · <em>MRM tied to frameworks</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE REGULATORY READINESS', '2 questions', ['<strong>Q1:</strong> answer all 5 regulator questions with documentation today? All 5 green · 3-4 amber · <strong><3 red — submission will fail</strong>.', '<strong>Q2:</strong> MRM submission tied to regulatory frameworks (NIST AI RMF + regional)? Mapped green · partial amber · <strong>no red — MRM committee finds gaps</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Write 2-line answers to 5 questions for your build', ['If any answer is "we\'ll figure it out," <strong>that\'s the submission gap.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Last chapter', icon: '→', headlineHtml: 'Capstone · 5 lessons · <em>4 trip-wires · the builder</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 7', '5-section MRM · 5 regulator questions · 3 regional specifics.', '<strong>Last:</strong> 5 lessons · 4 trip-wires · build-plan builder.') }] },
], cues: baseCues })

const ch8Builder = `
var builderInit=false;var state={doctype:'',weighting:'',mrm:''};
function initBuilderOnce(){if(builderInit)return;builderInit=true;document.querySelectorAll('.preset').forEach(function(grp){var key=grp.getAttribute('data-group');grp.querySelectorAll('button').forEach(function(btn){btn.addEventListener('click',function(){var val=btn.getAttribute('data-val');grp.querySelectorAll('button').forEach(function(b){b.classList.remove('picked')});btn.classList.add('picked');state[key]=val;render()})})});document.getElementById('dlBtn').addEventListener('click',function(){var blob=new Blob([buildMd()],{type:'text/markdown'});var url=URL.createObjectURL(blob);var a=document.createElement('a');a.href=url;a.download='banking-multimodal-rag-plan.md';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a);URL.revokeObjectURL(url)},100)});render()}
function buildMd(){var d=state.doctype||'_(pick document type focus)_';var w=state.weighting||'_(pick hybrid weighting tilt)_';var m=state.mrm||'_(pick MRM cadence)_';return '# Banking Multimodal RAG · Build Plan\\n\\n**Engineering lead:** ____________________\\n**MRM partner:** ____________________\\n\\n## Document type focus\\n> '+d+'\\n\\n## Hybrid weighting tilt\\n> '+w+'\\n\\n## MRM cadence\\n> '+m+'\\n\\n## 5 lessons embedded\\n- [ ] Start with eval, not the stack\\n- [ ] Multimodal is a pipeline change, not a flag\\n- [ ] Citation non-negotiable\\n- [ ] MRM early (week 4, not week 12)\\n- [ ] Vendor concentration plan documented\\n\\n## 4 trust trip-wires\\n- Pure text-RAG for financial documents\\n- Answer without citation\\n- MRM as afterthought\\n- Single-vendor lock-in without exit plan\\n\\n---\\nSource: Gennoor Academy · Banking Multimodal RAG Case Study\\n'}
function render(){var pv=document.getElementById('preview');if(pv)pv.textContent=buildMd()}
`

emit({ courseTagline, chapter: { number: '08 / 06', id: 'chapter-08', title: 'Capstone — Lessons learned' }, audioSrc: '../audio/chapter-08/chapter-08.mp3', outPath: `${OUT}/chapter-08-making-it-stick.html`, builderSlide: 5, builderStep: 1, builderInitFn: ch8Builder, slides: [
  { type: 'title', eyebrow: 'CHAPTER 8 · 5 LESSONS · 4 TRIP-WIRES · THE BUILDER', h1Html: 'What the bank learned · <em>build-plan builder</em>', subtitleHtml: '<strong>Shipped multimodal RAG in 8 months from text-only RAG.</strong>' },
  { type: 'content', eyebrow: 'The principle', icon: '1', headlineHtml: '8 months · text-only → multimodal · <em>differences bigger than expected</em>',
    blocks: [{ atStep: 1, html: card('THE PRINCIPLE', '', ['<strong>This bank shipped multimodal RAG in 8 months from text-only RAG.</strong> The differences with text-only RAG are concrete, measurable, and bigger than most teams expect.']) }] },
  { type: 'content', eyebrow: '5 lessons', icon: '2', headlineHtml: 'Eval first · multimodal is pipeline · citation · MRM early · <em>vendor plan</em>',
    blocks: [{ atStep: 1, html: card('5 LESSONS FROM THIS BANK\'S BUILD', '', ['<strong>1. Start with eval, not the stack.</strong> First 3 weeks were eval-set construction. <em>Without it, can\'t know which stack changes are improvements.</em>', '<strong>2. Multimodal is not a flag.</strong> It\'s a pipeline change. Cracking · indexing · re-ranking · prompting · all change.', '<strong>3. Citation is non-negotiable.</strong> Uncited number is worthless in finance. Air Canada Moffatt cross-domain. Bank lost 2 weeks rebuilding when citation broke at scale.', '<strong>4. MRM early.</strong> Brought MRM in at week 4. Earlier than typical. <em>Saved 6 weeks of rework at submission time.</em>', '<strong>5. Vendor concentration plan.</strong> Even on happy Azure path · documented "what if Azure OpenAI changes." 2 days. Saved a board-level argument later.']) }] },
  { type: 'content', eyebrow: '4 trust trip-wires', icon: '!', iconRed: true, headlineHtml: 'Pure text-RAG · no citation · MRM afterthought · <em>single-vendor</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('W1', 'Pure text-RAG for financial docs', '', 'Charts + tables are most of the content.', 'red')}
${cell('W2', 'Answer without citation', '', 'In finance, uncited = unusable.', 'red')}
${cell('W3', 'MRM as afterthought', '', 'Week 4, not week 12. Earlier prevents rework.', 'red')}
${cell('W4', 'Single-vendor without exit plan', '', 'Board asks late. Have the plan ready.', 'red')}
</div>` }] },
  { type: 'content', eyebrow: 'Interactive · build-plan builder', icon: '✓', headlineHtml: 'Doc type · weighting · MRM cadence · <em>take to kickoff Monday</em>',
    blocks: [{ atStep: 1, html: `<div class="builder" data-step="1">
<div class="fields">
<div class="group"><h5>Document type focus</h5><div class="preset" data-group="doctype">
<button data-val="Annual reports + filings (charts + tables heavy)">Annual reports + filings</button>
<button data-val="Internal credit memos + analyst reports (text + tables)">Credit memos + analyst</button>
<button data-val="Customer-facing documents (regulator-visible, citation-critical)">Customer-facing docs</button>
<button data-val="Mixed corpus (need all three crackers)">Mixed corpus</button>
</div></div>
<div class="group"><h5>Hybrid weighting tilt</h5><div class="preset" data-group="weighting">
<button data-val="Slightly keyword-tilted (precise financial vocabulary - default for most banks)">Keyword-tilted</button>
<button data-val="Equal weight (default starting point - tune from eval)">Equal weight</button>
<button data-val="Vector-tilted (more semantic queries, less precise terminology)">Vector-tilted</button>
</div></div>
<div class="group"><h5>MRM cadence</h5><div class="preset" data-group="mrm">
<button data-val="Week-4 engagement (recommended - early prevents rework)">Week 4 engagement</button>
<button data-val="Week-8 engagement (standard pattern - some rework risk)">Week 8 engagement</button>
<button data-val="Week-12 engagement (late but acceptable for low-risk POCs only)">Week 12 engagement</button>
</div></div>
<button class="dl-btn" id="dlBtn">⬇ Download my multimodal RAG build plan (.md)</button>
</div>
<div class="preview" id="preview"># Banking Multimodal RAG · Build Plan

Pick document type focus, hybrid weighting, and MRM cadence on the left.</div>
</div>` }] },
  { type: 'content', eyebrow: 'The case · in one breath', icon: '→', headlineHtml: 'Eval first · Azure stack · cracking · hybrid · 3-layer eval · MRM · <em>5 lessons</em>',
    blocks: [{ atStep: 1, html: `<div class="final-close" data-step="1"><div class="eyebrow">END OF CASE · 8 CHAPTERS · WHAT YOU DO THIS WEEK</div><h2>Multimodal RAG for banking is its own discipline. Eval first. Azure AI Search plus Vision plus GPT-4o. Document cracking with table and chart semantics preserved. Hybrid plus re-ranking tuned for financial vocab. Three-layer eval that MRM accepts. Five regulator questions answerable. Five lessons plus four trust trip-wires.</h2><p>That\'s eight chapters in one breath. <em>That\'s the case.</em></p>
<div class="close-list"><div class="row"><span class="arr">→</span>Open the builder. Pick your starting point.</div><div class="row"><span class="arr">→</span>Get engineering + MRM kickoff on the calendar before next Friday.</div></div>
<div class="close-final">SEE YOU IN THE NEXT ONE.</div></div>` }] },
], cues: [
  { at: 0.0, slide: 1 },
  { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
  { at: 45.0, slide: 3 }, { at: 55.0, slide: 3, step: 1 },
  { at: 120.0, slide: 4 }, { at: 130.0, slide: 4, step: 1 },
  { at: 195.0, slide: 5 }, { at: 205.0, slide: 5, step: 1 },
  { at: 240.0, slide: 6 }, { at: 250.0, slide: 6, step: 1 },
] })

console.log('\n✓ Course 46 chapters 1-8 built.')
