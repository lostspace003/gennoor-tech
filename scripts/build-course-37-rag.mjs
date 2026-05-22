// Course 37 — RAG Architectures Foundations (Emma · builder track)
import { emit } from './build-chapter-html.mjs'
const courseTagline = 'Builder · RAG Architectures'
const OUT = 'tmp/academy-build/rag-architectures-foundations/chapters'

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

emit({ courseTagline, chapter: { number: '01 / 06', id: 'chapter-01', title: 'Why RAG and when not to use it' }, audioSrc: '../audio/chapter-01/chapter-01.mp3', outPath: `${OUT}/chapter-01-why-rag.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 1 · RAG vs LONG-CONTEXT vs FINE-TUNING', h1Html: 'When RAG fits · <em>and 3 cases when it doesn\'t</em>', subtitleHtml: '<strong>The gap between demo RAG and production RAG is wider than vendors admit.</strong>' },
  { type: 'content', eyebrow: 'The principle', icon: '1', headlineHtml: 'Retrieval drives 80% of system quality · <em>and is what teams under-invest in</em>',
    blocks: [{ atStep: 1, html: card('THE PRINCIPLE', 'Simple in the diagram · brutal in production', ['RAG looks simple in the diagram and brutal in production. Embed, retrieve, generate. Three boxes on a slide.', 'In production: <strong>retrieval quality drives 80% of system quality</strong>. And retrieval quality is exactly what most teams under-invest in.']) }] },
  { type: 'content', eyebrow: 'When RAG fits', icon: '2', headlineHtml: 'Large/changing KB · citations needed · <em>long-tail facts</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('P1', 'Large or changing KB', '', 'Docs · catalogs · tickets. <strong>Too large for context. Changes faster than fine-tuning.</strong>', 'green')}
${cell('P2', 'Citations + grounding', '', 'Legal · medical · financial · compliance. <strong>Must point to source.</strong>', 'green')}
${cell('P3', 'Long-tail facts', '', 'Specific products · customers · regulations. <strong>Fine-tuning forgets. Retrieval surfaces on demand.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: 'When RAG is wrong', icon: '!', iconRed: true, headlineHtml: 'Structural · reasoning · <em>fits in context</em>',
    blocks: [{ atStep: 1, html: cardRed('3 CASES WHERE RAG IS THE WRONG ARCHITECTURE', '', ['<strong>1. Structural transformation.</strong> Summarisation · translation · format conversion. Input contains everything. Pure model task.', '<strong>2. Reasoning over the prompt.</strong> Math · code from spec · workflow planning. Retrieval adds noise. Long-context or tool-use fits.', '<strong>3. Knowledge fits in context.</strong> Under 100k tokens, rarely changes → include in system prompt. Skip retrieval.']) }] },
  { type: 'content', eyebrow: 'RAG vs long-context vs fine-tuning', icon: '3', headlineHtml: 'Different problems · <em>different costs</em>',
    blocks: [
      { atStep: 1, html: card('THREE PATTERNS · DON\'T CONFUSE THEM', 'Pick by what the task actually needs', ['<strong>RAG:</strong> external knowledge · citations · changing facts. Cost: retrieval infra + per-query embed/search.', '<strong>Long-context:</strong> knowledge fits in window. Cost: input tokens scale linearly — expensive at >100k tokens.', '<strong>Fine-tuning:</strong> style · format · persona · domain vocabulary. Cost: training + serving infra. Not for facts that change.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Look at your current AI feature', ['Which of the three does it actually need? <strong>Many teams pick RAG by default. The right answer is sometimes long-context or fine-tuning.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 2', icon: '→', headlineHtml: 'Embeddings explained · <em>what they encode + miss</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 1', 'Principle · 3 fits · 3 wrong cases · 3 patterns.', '<strong>Next:</strong> embedding mental model · 4 model selection factors.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '02 / 06', id: 'chapter-02', title: 'Embeddings explained' }, audioSrc: '../audio/chapter-02/chapter-02.mp3', outPath: `${OUT}/chapter-02-embeddings.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 2 · DENSE VECTOR REPRESENTATIONS', h1Html: 'What embeddings encode · <em>what they miss · how to pick</em>', subtitleHtml: '<strong>768 to 3072 floats per chunk. Cosine distance is how RAG retrieves.</strong>' },
  { type: 'content', eyebrow: 'What embeddings are', icon: '1', headlineHtml: 'Dense vectors · <em>semantic neighbours = nearby in space</em>',
    blocks: [{ atStep: 1, html: card('WHAT EMBEDDINGS ACTUALLY ARE', 'A dense vector representation of text', ['Typically <strong>768 to 3072 floats</strong> per chunk of text.', 'Model maps semantically similar text to nearby points. <em>"Refund policy" near "money back guarantee." Far from "pizza recipe."</em>', 'That distance — usually cosine — is how RAG retrieves. <strong>Query in. Embedding out. Nearest-neighbour search.</strong>']) }] },
  { type: 'content', eyebrow: 'What embeddings encode well', icon: '2', headlineHtml: 'Topic · paraphrase · <em>semantic relations</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('E1', 'Topical similarity', '', 'Documents about same domain cluster together.', 'green')}
${cell('E2', 'Paraphrase equivalence', '', '"Cancel subscription" maps near "I want to unsubscribe."', 'green')}
${cell('E3', 'Semantic relations', '', '"Doctor" + "physician" cluster. "Refund" + "reimbursement" cluster.', 'green')}
</div>` }] },
  { type: 'content', eyebrow: 'What embeddings miss', icon: '!', iconRed: true, headlineHtml: 'IDs · negation · numerics · <em>recency</em>',
    blocks: [{ atStep: 1, html: cardRed('WHAT EMBEDDINGS MISS · WHERE RAG FAILS', 'Where BM25 + metadata are the partner', ['<strong>Exact identifiers.</strong> Order 8881234 · SKU AB-100. Embeddings treat as noise. <em>BM25 partner needed.</em>', '<strong>Negation + contradiction.</strong> "Refund policy" near "no refund policy." Similarity ignores polarity.', '<strong>Numerical reasoning.</strong> ">100" doesn\'t retrieve docs containing "127." <em>Metadata filters fix this.</em>', '<strong>Recency.</strong> Embedding doesn\'t know what\'s new. <em>Time-based filtering needed alongside.</em>']) }] },
  { type: 'content', eyebrow: 'Picking the model · 4 factors', icon: '3', headlineHtml: 'Dimension · context length · language · <em>provider lock-in</em>',
    blocks: [
      { atStep: 1, html: card('PICKING AN EMBEDDING MODEL · 4 FACTORS', 'Default to 1024-dim unless evidence', ['<strong>1. Dimension:</strong> 768-3072. Higher = better quality + more cost. Default 1024.', '<strong>2. Context length:</strong> 512-8k tokens. Longer chunks dilute meaning.', '<strong>3. Language coverage:</strong> multilingual if your content is. Critical in GCC · India · SEA.', '<strong>4. Provider lock-in:</strong> OpenAI text-embedding-3-large is good but proprietary. <em>BGE · E5 · GTE for portability.</em>']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Embed 10 representative queries from your domain', ['Check whether semantically similar queries cluster. <strong>Check whether queries with IDs cluster — they won\'t, which is the lesson.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 3', icon: '→', headlineHtml: 'Vector stores · <em>pgvector · Pinecone · Azure · Weaviate</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 2', 'What they are · what encodes · what misses · 4 picks.', '<strong>Next:</strong> 4-store honest comparison · scale guide · cost trap.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '03 / 06', id: 'chapter-03', title: 'Vector stores' }, audioSrc: '../audio/chapter-03/chapter-03.mp3', outPath: `${OUT}/chapter-03-vector-stores.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 3 · pgvector · Pinecone · Azure · Weaviate', h1Html: 'Honest comparison · scale guide · <em>cost trap</em>', subtitleHtml: '<strong>Vector store cost is a small fraction of total. Embedding + LLM dominate.</strong>' },
  { type: 'content', eyebrow: '4 stores compared', icon: '1', headlineHtml: 'pgvector · Pinecone · Azure AI Search · <em>Weaviate</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('S1', 'pgvector', '', 'Postgres extension. <strong>Easiest ops. Scales to single-digit millions comfortably.</strong>', 'green')}
${cell('S2', 'Pinecone', '', 'Managed service. <strong>Best perf/$ above 10M vectors. Vendor lock-in. Pricing surprises.</strong>', 'amber')}
${cell('S3', 'Azure AI Search', '', 'MS hybrid engine. <strong>Best hybrid BM25 + vector + semantic out of box. Azure-native.</strong>', 'green')}
${cell('S4', 'Weaviate', '', 'OSS + managed option. <strong>Good middle ground. Modular schema. Self-host or cloud.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: 'The scale question', icon: '2', headlineHtml: '<1M · 1-10M · <em>>10M</em>',
    blocks: [{ atStep: 1, html: card('SCALE GUIDE', 'Picks by vector count', ['<strong>Under 1M vectors:</strong> pgvector wins. Existing Postgres team operates it.', '<strong>1-10M vectors:</strong> Azure AI Search or Weaviate. Hybrid search becomes the differentiator.', '<strong>Above 10M vectors:</strong> Pinecone · Azure AI Search · Qdrant · Milvus. Performance + ops maturity non-negotiable.']) }] },
  { type: 'content', eyebrow: '3 evaluation dimensions beyond perf', icon: '3', headlineHtml: 'Ops · hybrid · <em>metadata filtering</em>',
    blocks: [{ atStep: 1, html: card('3 DIMENSIONS BEYOND PURE PERFORMANCE', 'Don\'t pick on RPS alone', ['<strong>1. Operational footprint.</strong> Who runs it? On-call? DR? Managed services trade money for simplicity.', '<strong>2. Hybrid search support.</strong> BM25 + vector + reranking in one query? Or stitch yourself?', '<strong>3. Metadata filtering.</strong> Tenant · doc type · recency · ACL. <em>Some stores fall over at high cardinality.</em>']) }] },
  { type: 'content', eyebrow: 'The cost trap', icon: '!', iconRed: true, headlineHtml: 'Re-embedding everything · <em>over-provisioning</em>',
    blocks: [
      { atStep: 1, html: cardRed('COST TRAPS MOST TEAMS HIT', 'Embedding + LLM dominate, not the store', ['<strong>Mistake 1:</strong> re-embedding documents on every change. Embed once. Re-embed only on content change. <em>Cache by document hash.</em>', '<strong>Mistake 2:</strong> over-provisioning capacity. Most queries hit a small subset. <em>Hot/cold tiering reduces cost meaningfully.</em>']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Count your vectors · project 12-month volume', ['Map to scale guide. <strong>Decision should be defensible to your CFO, not just your team.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 4', icon: '→', headlineHtml: 'Hybrid search · <em>BM25 + vectors + semantic ranking</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 3', '4 stores · scale guide · 3 dims · cost trap.', '<strong>Next:</strong> RRF · weighted · cascade · semantic ranking.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '04 / 06', id: 'chapter-04', title: 'Hybrid search' }, audioSrc: '../audio/chapter-04/chapter-04.mp3', outPath: `${OUT}/chapter-04-hybrid-search.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 4 · BM25 + VECTORS + SEMANTIC RANKING', h1Html: 'Where retrieval quality lives · <em>RRF · weighted · cascade</em>', subtitleHtml: '<strong>Each method compensates for the other\'s blind spots.</strong>' },
  { type: 'content', eyebrow: 'Why pure vector fails', icon: '1', headlineHtml: 'IDs · <em>out-of-distribution queries</em>',
    blocks: [{ atStep: 1, html: card('PURE VECTOR HAS TWO SYSTEMIC WEAKNESSES', 'We saw them in chapter 2', ['<strong>Weakness 1 — exact identifiers.</strong> "Order 8881234" needs keyword search. Vectors treat as noise.', '<strong>Weakness 2 — out-of-distribution queries.</strong> Underrepresented vocabulary → unreliable embedding. <em>BM25 still finds the term.</em>'], 'Hybrid combines BM25 keyword scoring with vector similarity. <strong>Each compensates for the other\'s blind spots.</strong>') }] },
  { type: 'content', eyebrow: '3 fusion strategies', icon: '2', headlineHtml: 'RRF · weighted · <em>cascade</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('F1', 'RRF (Reciprocal Rank Fusion)', '', 'Combines ranks not scores. <strong>Default in Azure. Robust to scale differences.</strong>', 'green')}
${cell('F2', 'Weighted score fusion', '', 'Normalise + weight + sum. <strong>Tunable but weights drift.</strong>', 'amber')}
${cell('F3', 'Cascade', '', 'BM25 retrieves wide set · vectors re-rank top N. <strong>Cheaper at high recall.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: 'Semantic ranking', icon: '3', headlineHtml: 'Cross-encoder · <em>10-100x slower per candidate</em>',
    blocks: [{ atStep: 1, html: card('SEMANTIC RANKING · THE THIRD LAYER', 'Cross-encoder reads query + candidate together', ['<strong>Cost:</strong> 10-100x slower than vector search per candidate. <em>Only re-rank top 20-50.</em>', '<strong>Value:</strong> substantial quality lift on ambiguous or compound queries. <em>Especially valuable when answer requires intent understanding.</em>'], 'Azure AI Search has built-in semantic ranking. Other stacks: Cohere Rerank · Voyage rerank · self-hosted cross-encoders.') }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '4', headlineHtml: 'Hybrid beats pure vector · <em>BM25 catches IDs</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE HYBRID SEARCH', '2 questions', ['<strong>Q1:</strong> top 100 production queries — does hybrid beat pure vector on recall@10? Yes green · marginal amber · <strong>no red — fusion bug</strong>.', '<strong>Q2:</strong> for queries with IDs, is BM25 picking them up? Yes consistently green · sometimes amber · <strong>no red — keyword index broken</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', '50 real production queries · pure vs hybrid', ['Diff top-5 results. <strong>Cases where hybrid wins teach you what BM25 catches that vectors miss.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 5', icon: '→', headlineHtml: 'Re-ranking · <em>when it earns its cost</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 4', 'Why pure fails · 3 fusion · semantic · scoring.', '<strong>Next:</strong> 3 re-ranker types · cost-quality curve · scoring.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '05 / 06', id: 'chapter-05', title: 'Re-ranking strategies' }, audioSrc: '../audio/chapter-05/chapter-05.mp3', outPath: `${OUT}/chapter-05-reranking.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 5 · COST-QUALITY CURVE', h1Html: 'Cross-encoders · managed API · <em>LLM rerankers</em>', subtitleHtml: '<strong>Re-rank a small top-N. Measure before and after.</strong>' },
  { type: 'content', eyebrow: 'Why re-ranking', icon: '1', headlineHtml: 'Initial ranking built for recall · <em>top-5 determines quality</em>',
    blocks: [{ atStep: 1, html: card('WHY RE-RANKING EXISTS', 'The recall vs precision tradeoff', ['Retrieval pulls back say 50 candidates. <strong>Top-5 going into LLM determines answer quality.</strong>', '<strong>Problem:</strong> initial ranking is built for recall. Right answer is often in top-50 but ranked at position 23.', '<strong>Fix:</strong> second pass that\'s slower but more accurate. Re-score 50 candidates with a model that reads query + document together.']) }] },
  { type: 'content', eyebrow: '3 re-ranker types', icon: '2', headlineHtml: 'Cross-encoder · managed API · <em>LLM</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('R1', 'Cross-encoder', '', 'BAAI/bge-reranker · ms-marco-MiniLM. <strong>Self-host or HF.</strong>', 'green')}
${cell('R2', 'Managed reranker API', '', 'Cohere Rerank · Voyage AI. <strong>Pay-per-query. Higher latency, no infra.</strong>', 'green')}
${cell('R3', 'LLM reranker', '', 'Small LLM scores candidates. <strong>Most expensive. Best on ambiguous queries.</strong>', 'amber')}
</div>` }] },
  { type: 'content', eyebrow: 'Cost-quality curve', icon: '3', headlineHtml: 'First 50 · <em>quality lift per dollar drops fast</em>',
    blocks: [{ atStep: 1, html: card('COST-VS-QUALITY CURVE', 'Diminishing returns past top-50', ['<strong>First 50 re-ranked:</strong> often 15-25% quality lift. Strong ROI.', '<strong>Beyond 50:</strong> marginal lift. Often not worth latency hit.', '<strong>Re-ranking everything:</strong> no. That\'s just slow retrieval.'], '<strong>Discipline:</strong> re-rank small top-N. Tune N to latency budget. Measure quality before/after.') }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '4', headlineHtml: 'Lift on eval set · <em>p95 latency</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE RE-RANKING', '2 questions', ['<strong>Q1:</strong> answer quality lift on eval set? >10% green · 5-10% amber · <strong><5% red — latency without value</strong>.', '<strong>Q2:</strong> re-ranker latency within p95 budget? Yes green · marginal amber · <strong>no red — strip back or smaller model</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Run eval set with + without re-ranking', ['Plot the curves. <strong>30-minute experiment ends the team debate.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 6', icon: '→', headlineHtml: 'Evaluation · <em>retrieval quality vs answer quality</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 5', 'Why re-rank · 3 types · cost-quality · scoring.', '<strong>Next:</strong> 2 distinct layers · 3 retrieval metrics · 3 answer metrics · eval set.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '06 / 06', id: 'chapter-06', title: 'Evaluation' }, audioSrc: '../audio/chapter-06/chapter-06.mp3', outPath: `${OUT}/chapter-06-evaluation.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 6 · TWO LAYERS · NEVER CONFLATE', h1Html: 'Retrieval quality · answer quality · <em>building the eval set</em>', subtitleHtml: '<strong>Measure both layers separately. Without that, you can\'t diagnose where it broke.</strong>' },
  { type: 'content', eyebrow: '2 distinct layers', icon: '1', headlineHtml: 'Retrieval · <em>answer</em>',
    blocks: [{ atStep: 1, html: card('TWO DISTINCT EVALUATION LAYERS', 'Most teams measure only end-to-end → can\'t diagnose', ['<strong>Layer 1 — retrieval.</strong> Did the right chunks come back? <em>Independent of LLM.</em> Metrics: hit rate · MRR · recall@k.', '<strong>Layer 2 — answer.</strong> Given retrieved chunks, did LLM produce a good answer? <em>Metrics: groundedness · faithfulness · answer relevance.</em>'], 'Most teams measure only end-to-end. <strong>Then can\'t diagnose where it broke.</strong>') }] },
  { type: 'content', eyebrow: '3 retrieval metrics', icon: '2', headlineHtml: 'Hit rate · MRR · <em>recall@k</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('M1', 'Hit rate @ k', '', 'Fraction of queries with ≥1 correct chunk in top-k. <strong>Aim 90%+ at k=10.</strong>', 'green')}
${cell('M2', 'MRR (mean reciprocal rank)', '', 'Where does correct chunk appear? 1.0=position 1 · 0.5=position 2.', 'green')}
${cell('M3', 'Recall @ k', '', 'Of all relevant chunks per query · what fraction in top-k? <strong>Critical for multi-source.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '3 answer-quality metrics', icon: '3', headlineHtml: 'Groundedness · faithfulness · <em>relevance</em>',
    blocks: [{ atStep: 1, html: card('3 ANSWER-QUALITY METRICS · RAGAS', 'LLM-as-judge with structured prompts', ['<strong>Groundedness.</strong> Is answer supported by retrieved chunks? <em>"Is statement X supported by context Y?"</em>', '<strong>Faithfulness.</strong> Does answer hallucinate facts not in retrieval? Catch when LLM made things up despite sources.', '<strong>Answer relevance.</strong> Does answer address the question? <em>Sometimes model retrieves correctly but answers a different question.</em>'], 'These three are the RAGAS framework. <strong>Tooling exists. Use it.</strong>') }] },
  { type: 'content', eyebrow: 'Building the eval set', icon: '4', headlineHtml: 'Synthetic · real · <em>gold + drift</em>',
    blocks: [
      { atStep: 1, html: card('BUILDING THE EVAL SET · 3 OPTIONS', 'Hardest part is doing it', ['<strong>Synthetic:</strong> LLM generates Q&A from corpus. Fast bootstrap. Doesn\'t reflect real user behaviour.', '<strong>Real queries:</strong> 100-500 from production logs. Real distribution. Requires labelling.', '<strong>Gold + drift:</strong> 50-100 curated gold queries never change. Plus rotating real queries to catch drift.'], '<strong>Best practice:</strong> gold + drift. Gold for regression. Rotating for production realism.') },
      { atStep: 2, html: card('MONDAY MOVE', 'Build a 50-query gold eval set this week', ['Mix easy · medium · adversarial. <strong>Once it exists, every RAG change becomes measurable.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 7', icon: '→', headlineHtml: 'Common RAG failures · <em>6 modes + targeted fixes</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 6', '2 layers · 3 retrieval · 3 answer · 3 eval-set options.', '<strong>Next:</strong> 6 failure modes you meet in production.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '07 / 06', id: 'chapter-07', title: 'Common RAG failures and fixes' }, audioSrc: '../audio/chapter-07/chapter-07.mp3', outPath: `${OUT}/chapter-07-failures.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 7 · 6 MODES YOU\'LL MEET', h1Html: 'Bad chunking · query mismatch · OOD · overflow · <em>metadata · stale</em>', subtitleHtml: '<strong>The targeted fixes — not generic "improve RAG" advice.</strong>' },
  { type: 'content', eyebrow: 'Failures 1 + 2', icon: '!', iconRed: true, headlineHtml: 'Bad chunking · <em>query intent mismatch</em>',
    blocks: [{ atStep: 1, html: cardRed('FAILURE MODES 1 + 2', 'And their targeted fixes', ['<strong>1. Bad chunking.</strong> Too big = dilute. Too small = lose context. Sentences mid-table · headers separated.', '<em>Fix: structure-aware chunking.</em> Use headings · sections · lists. Library: LangChain. Better: write a chunker that understands your doc type.', '<strong>2. Query intent mismatch.</strong> "Compare X and Y" retrieves only chunks about X. None about comparison.', '<em>Fix: query rewriting.</em> LLM expands or reformulates before retrieval. "Compare X and Y" → 3 queries: X, Y, comparison criteria.']) }] },
  { type: 'content', eyebrow: 'Failures 3 + 4', icon: '!', iconRed: true, headlineHtml: 'OOD queries · <em>context overflow</em>',
    blocks: [{ atStep: 1, html: cardRed('FAILURE MODES 3 + 4', '', ['<strong>3. Out-of-distribution queries.</strong> User asks something corpus doesn\'t cover. Retrieval junk. <em>LLM answers anyway from training data.</em>', '<em>Fix: relevance threshold.</em> If top-1 score below threshold → refuse to answer. Tell user. <strong>Better silence than hallucination.</strong>', '<strong>4. Context overflow.</strong> Top-k chunks exceed LLM window. Truncation drops relevant chunks.', '<em>Fix: map-reduce or recursive synthesis.</em> Batch process · summarise · combine. Or larger context model — but long-context isn\'t always cheaper.']) }] },
  { type: 'content', eyebrow: 'Failures 5 + 6', icon: '!', iconRed: true, headlineHtml: 'Metadata blind spots · <em>stale knowledge</em>',
    blocks: [{ atStep: 1, html: cardRed('FAILURE MODES 5 + 6', '', ['<strong>5. Metadata blind spots.</strong> User has access to A, not B. Retrieval returns B. <em>Privacy incident.</em>', '<em>Fix: filter-then-retrieve.</em> Apply access control as metadata filter on vector store query. Never trust app-layer filtering. <strong>Especially critical in Dataverse-grounded scenarios.</strong>', '<strong>6. Stale knowledge.</strong> Doc updated yesterday. Embedding from last month. Retrieval returns old chunk.', '<em>Fix: embedding pipeline as CI/CD.</em> Re-embed on content change. Cache by content hash. <strong>Silent quality degradation otherwise.</strong>']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '1', headlineHtml: 'Relevance threshold · <em>re-embedding on change</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE RAG FAILURE-HANDLING', '2 questions', ['<strong>Q1:</strong> relevance threshold in production? Yes green · "discussed" amber · <strong>no red — bot hallucinates on OOD</strong>.', '<strong>Q2:</strong> re-embedding triggered on every content change? Auto yes green · manual amber · <strong>no red — knowledge silently stale</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Sample 20 low-quality production answers', ['Map each to one of the 6 failure modes. <strong>Patterns point to highest-leverage fix.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Last chapter', icon: '→', headlineHtml: 'Capstone · production RAG pipeline · <em>the builder</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 7', '6 failure modes · 6 fixes · scoring.', '<strong>Last:</strong> 5-component architecture · 4 trip-wires · interactive builder.') }] },
], cues: baseCues })

const ch8Builder = `
var builderInit=false;var state={scale:'',store:'',rerank:'',eval:''};
function initBuilderOnce(){if(builderInit)return;builderInit=true;document.querySelectorAll('.preset').forEach(function(grp){var key=grp.getAttribute('data-group');grp.querySelectorAll('button').forEach(function(btn){btn.addEventListener('click',function(){var val=btn.getAttribute('data-val');grp.querySelectorAll('button').forEach(function(b){b.classList.remove('picked')});btn.classList.add('picked');state[key]=val;render()})})});document.getElementById('dlBtn').addEventListener('click',function(){var blob=new Blob([buildMd()],{type:'text/markdown'});var url=URL.createObjectURL(blob);var a=document.createElement('a');a.href=url;a.download='rag-architecture-decision.md';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a);URL.revokeObjectURL(url)},100)});render()}
function buildMd(){var s=state.scale||'_(pick scale)_';var st=state.store||'_(pick vector store)_';var rr=state.rerank||'_(pick re-ranker)_';var e=state.eval||'_(pick eval approach)_';return '# RAG Architecture Decision Record\\n\\n**Owner:** ____________________\\n**Date:** ____________________\\n\\n## Scale tier\\n> '+s+'\\n\\n## Vector store\\n> '+st+'\\n\\n## Re-ranker\\n> '+rr+'\\n\\n## Eval approach\\n> '+e+'\\n\\n## 5-component checklist\\n- [ ] Ingestion + chunking: structure-aware · versioned · re-runs on content change\\n- [ ] Embedding + index: hybrid (BM25 + vector + metadata) · cached by hash\\n- [ ] Retrieval + re-ranking: hybrid retrieval → top-50 → re-rank → top-5 to LLM\\n- [ ] Generation + grounding: explicit citation · refuse below threshold\\n- [ ] Evaluation + monitoring: gold eval set on every deploy · production sample for drift\\n\\n## 4 trust trip-wires (do not cross)\\n- Answer without citation\\n- Confident answer on OOD query (no relevance threshold)\\n- Access control at generation, not retrieval\\n- No eval set\\n\\n---\\nSource: Gennoor Academy · RAG Architectures Foundations\\n'}
function render(){var pv=document.getElementById('preview');if(pv)pv.textContent=buildMd()}
`

emit({ courseTagline, chapter: { number: '08 / 06', id: 'chapter-08', title: 'Capstone — production RAG' }, audioSrc: '../audio/chapter-08/chapter-08.mp3', outPath: `${OUT}/chapter-08-making-it-stick.html`, builderSlide: 5, builderStep: 1, builderInitFn: ch8Builder, slides: [
  { type: 'title', eyebrow: 'CHAPTER 8 · CAPSTONE · ARCHITECTURE DECISION RECORD', h1Html: '5 components · 4 trip-wires · <em>the builder</em>', subtitleHtml: '<strong>Production RAG is a system, not a notebook.</strong>' },
  { type: 'content', eyebrow: 'The principle', icon: '1', headlineHtml: 'System · <em>not notebook</em>',
    blocks: [{ atStep: 1, html: card('THE PRINCIPLE', 'Retrieval quality is foundation', ['Production RAG is a system, not a notebook. <strong>Retrieval quality is the foundation. Everything else is layered on top.</strong>']) }] },
  { type: 'content', eyebrow: '5-component architecture', icon: '2', headlineHtml: 'Ingest · index · retrieve · generate · <em>evaluate</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('C1', 'Ingestion + chunking', '', 'Structure-aware · versioned · re-runs on change.')}
${cell('C2', 'Embedding + index', '', 'Embed once · cache by hash · hybrid index.', 'amber')}
${cell('C3', 'Retrieval + re-ranking', '', 'Hybrid → 50 · re-rank → top 5 → LLM.', 'green')}
${cell('C4', 'Generation + grounding', '', 'Citation required · refuse below threshold.', 'green')}
${cell('C5', 'Evaluation + monitoring', '', 'Gold eval on every deploy · prod sample drift.', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '4 trust trip-wires', icon: '!', iconRed: true, headlineHtml: 'No citation · OOD confident · ACL at gen · <em>no eval</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('W1', 'Answer without citation', '', 'Air Canada Moffatt cross-domain. Users can\'t verify.', 'red')}
${cell('W2', 'OOD confident answer', '', 'No relevance threshold = confident hallucination.', 'red')}
${cell('W3', 'ACL at generation, not retrieval', '', 'Always filter at vector store. Never trust LLM to redact.', 'red')}
${cell('W4', 'No eval set', '', 'Can\'t measure quality = can\'t improve. Every change is a guess.', 'red')}
</div>` }] },
  { type: 'content', eyebrow: 'Interactive · ADR builder', icon: '✓', headlineHtml: 'Scale · store · re-ranker · eval · <em>take to architecture review</em>',
    blocks: [{ atStep: 1, html: `<div class="builder" data-step="1">
<div class="fields">
<div class="group"><h5>Scale tier</h5><div class="preset" data-group="scale">
<button data-val="Small (<1M vectors) — pgvector territory, existing Postgres team operates">Small <1M</button>
<button data-val="Medium (1M-10M vectors) — Azure AI Search or Weaviate, hybrid is differentiator">Medium 1-10M</button>
<button data-val="Large (>10M vectors) — Pinecone, Azure AI Search, Qdrant, or Milvus">Large >10M</button>
</div></div>
<div class="group"><h5>Vector store</h5><div class="preset" data-group="store">
<button data-val="pgvector — Postgres extension, simplest ops">pgvector</button>
<button data-val="Azure AI Search — best hybrid out of box for Azure-native stacks">Azure AI Search</button>
<button data-val="Pinecone — managed, best perf/$ at scale, vendor lock-in">Pinecone</button>
<button data-val="Weaviate — open-source with managed option, modular schema">Weaviate</button>
</div></div>
<div class="group"><h5>Re-ranker</h5><div class="preset" data-group="rerank">
<button data-val="Cross-encoder self-hosted (BAAI/bge-reranker, ms-marco-MiniLM)">Cross-encoder self-host</button>
<button data-val="Managed API (Cohere Rerank, Voyage AI) — pay-per-query">Managed API</button>
<button data-val="No re-ranker initially — measure first, add only with evidence">No re-ranker yet</button>
</div></div>
<div class="group"><h5>Eval approach</h5><div class="preset" data-group="eval">
<button data-val="Gold (50-100 curated) + rotating production sample for drift detection">Gold + drift</button>
<button data-val="Real-query labelled set (100-500 from production logs)">Real queries</button>
<button data-val="Synthetic (LLM-generated Q&A pairs) to bootstrap quickly">Synthetic bootstrap</button>
</div></div>
<button class="dl-btn" id="dlBtn">⬇ Download my RAG ADR (.md)</button>
</div>
<div class="preview" id="preview"># RAG Architecture Decision Record

Pick scale, store, re-ranker, and eval approach on the left.</div>
</div>` }] },
  { type: 'content', eyebrow: 'The course · in one breath', icon: '→', headlineHtml: 'Simple in diagram · brutal in production · 5 components · <em>4 trip-wires</em>',
    blocks: [{ atStep: 1, html: `<div class="final-close" data-step="1"><div class="eyebrow">END OF COURSE · 8 CHAPTERS · WHAT YOU DO THIS WEEK</div><h2>RAG looks simple in the diagram and brutal in production. Five components — ingestion, embedding, retrieval, generation, evaluation. Hybrid search beats pure vector. Re-rank a small top-N. Measure retrieval AND answer quality separately. Four trust trip-wires you don't cross.</h2><p>That\'s eight chapters in one breath. <em>That\'s the course.</em></p>
<div class="close-list"><div class="row"><span class="arr">→</span>Open the builder. Pick your architecture.</div><div class="row"><span class="arr">→</span>Get architecture review on the calendar before next Friday.</div></div>
<div class="close-final">SEE YOU IN THE NEXT ONE.</div></div>` }] },
], cues: [
  { at: 0.0, slide: 1 },
  { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
  { at: 45.0, slide: 3 }, { at: 55.0, slide: 3, step: 1 },
  { at: 120.0, slide: 4 }, { at: 130.0, slide: 4, step: 1 },
  { at: 195.0, slide: 5 }, { at: 205.0, slide: 5, step: 1 },
  { at: 240.0, slide: 6 }, { at: 250.0, slide: 6, step: 1 },
] })

console.log('\n✓ Course 37 chapters 1-8 built.')
