import type { BlogPost } from '../index'

export const post: BlogPost = {
    slug: 'rag-beyond-basics-graphrag-hybrid-search',
    title: 'RAG Beyond the Basics: GraphRAG, Hybrid Search, and What Actually Works',
    excerpt: 'Basic RAG is table stakes. Here is what leading enterprises are doing with GraphRAG, hybrid search, re-ranking, and agentic retrieval patterns.',
    tldr: 'Advanced RAG techniques that actually improve production quality: GraphRAG for relationship-aware retrieval, hybrid search combining vector and keyword approaches, re-ranking for precision, and agentic retrieval for multi-step queries.',
    content: `
<h2>Why Basic RAG Hits the Ceiling</h2>

<p>Retrieval-Augmented Generation (RAG) has become the standard pattern for grounding large language models in enterprise knowledge. The basic pattern—chunk documents, embed them, retrieve top-k similar chunks, pass to LLM—works remarkably well for simple question-answering over documents. But as organizations scale RAG systems to production, they encounter fundamental limitations that basic vector similarity search cannot overcome.</p>

<p>The first limitation is <strong>semantic drift</strong>. Vector embeddings capture local semantic meaning, but they struggle with queries that require understanding relationships across multiple documents, temporal sequences, or hierarchical structures. A question like "How has our pricing strategy evolved over the past three years and how does it correlate with customer churn?" requires connecting information across quarterly reports, pricing announcements, and customer data—something pure vector similarity handles poorly.</p>

<p>The second limitation is <strong>keyword blindness</strong>. Semantic embeddings excel at conceptual similarity but fail on exact matches. If a user searches for "ISO 27001 certification" or a specific product SKU like "SKU-2847-B", semantic search may return conceptually related but factually incorrect results. In regulated industries—healthcare, finance, legal—this is unacceptable.</p>

<p>The third limitation is <strong>context collapse</strong>. When you chunk a 100-page technical specification into 500-token segments, you lose document structure, cross-references, and the relationships between sections. The retrieved chunks lack the surrounding context that humans use to interpret technical documentation.</p>

<p>Advanced RAG patterns solve these problems by moving beyond naive vector similarity to incorporate graph structures, hybrid retrieval, intelligent re-ranking, and context-aware chunking strategies. Organizations implementing these patterns see 40-60% improvements in retrieval accuracy and dramatic reductions in hallucination rates.</p>

<h2>GraphRAG: Adding Structure to Semantic Search</h2>

<p>GraphRAG, pioneered by Microsoft Research, addresses the relationship problem by extracting an explicit knowledge graph from your document corpus. Instead of treating documents as isolated chunks, GraphRAG identifies entities (people, products, concepts), relationships (reports to, depends on, contradicts), and creates a queryable graph structure alongside your vector embeddings.</p>

<p>The architecture has three components. First, an <strong>entity extraction pipeline</strong> uses NER (Named Entity Recognition) and relation extraction models to identify structured information in your documents. For enterprise content, you often need custom entity types—not just person/organization/location, but product names, regulatory codes, internal project names, and domain-specific concepts.</p>

<p>Second, a <strong>graph database</strong> (Neo4j, Amazon Neptune, Azure Cosmos DB with Gremlin API) stores entities and relationships. Each node contains not just structured attributes but also vector embeddings of the entity description, enabling hybrid graph-vector traversal.</p>

<p>Third, a <strong>query planning layer</strong> translates natural language questions into graph traversal + vector search operations. A question like "Which products are affected by the Q3 supply chain issues?" becomes: (1) semantic search for "supply chain issues Q3", (2) extract mentioned entities, (3) graph traversal to find connected product nodes, (4) retrieve detailed chunks about those specific products.</p>

<p>GraphRAG excels for multi-hop reasoning. Microsoft's implementation on a 1M-document corporate knowledge base showed that questions requiring 2+ reasoning steps had 73% accuracy with GraphRAG versus 41% with standard RAG. The performance gap widens as question complexity increases.</p>

<h3>Implementation Considerations</h3>

<p>Building GraphRAG requires upfront investment. Entity extraction quality determines graph quality—garbage in, garbage out. For specialized domains, you need to fine-tune extraction models or use LLM-based extraction with careful prompt engineering. Expect 2-4 weeks of iteration to get entity schemas and extraction pipelines production-ready.</p>

<p>Graph maintenance is non-trivial. As documents update, you must propagate changes through the graph, merging entities and updating relationships. Implementing proper graph versioning and change tracking is essential for production systems. Budget for ongoing curation—especially in the first 3-6 months as you refine entity types and relationship definitions.</p>

<p>At Gennoor Tech, we help organizations implement GraphRAG through our <a href="/services/training">Azure AI training programs</a>, covering entity extraction, graph design, and production deployment patterns for enterprise knowledge systems.</p>

<div class="blog-diagram"><svg viewBox="0 0 600 150" xmlns="http://www.w3.org/2000/svg"><rect x="230" y="5" width="140" height="35" rx="6" fill="#2563eb" /><text x="300" y="28" text-anchor="middle" fill="#fff" font-size="12" font-weight="600">User Query</text><line x1="260" y1="40" x2="100" y2="60" stroke="#64748b" stroke-width="2" /><line x1="300" y1="40" x2="300" y2="60" stroke="#64748b" stroke-width="2" /><line x1="340" y1="40" x2="500" y2="60" stroke="#64748b" stroke-width="2" /><rect x="20" y="60" width="160" height="35" rx="6" fill="#0d9488" /><text x="100" y="82" text-anchor="middle" fill="#fff" font-size="11" font-weight="600">Vector Search</text><rect x="220" y="60" width="160" height="35" rx="6" fill="#0d9488" /><text x="300" y="82" text-anchor="middle" fill="#fff" font-size="11" font-weight="600">Knowledge Graph</text><rect x="420" y="60" width="160" height="35" rx="6" fill="#0d9488" /><text x="500" y="82" text-anchor="middle" fill="#fff" font-size="11" font-weight="600">Keyword Search</text><line x1="100" y1="95" x2="300" y2="110" stroke="#64748b" stroke-width="2" /><line x1="300" y1="95" x2="300" y2="110" stroke="#64748b" stroke-width="2" /><line x1="500" y1="95" x2="300" y2="110" stroke="#64748b" stroke-width="2" /><rect x="200" y="110" width="200" height="35" rx="6" fill="#2563eb" /><text x="300" y="132" text-anchor="middle" fill="#fff" font-size="12" font-weight="600">Re-Rank &amp; Generate</text></svg><figcaption>Advanced RAG pipeline: multi-source retrieval with intelligent fusion</figcaption></div>

<div class="blog-compare"><div class="compare-card"><div class="compare-title">Basic RAG</div><p>Vector similarity only. 41% accuracy on multi-hop questions. Struggles with exact matches and relationships.</p></div><div class="compare-card"><div class="compare-title">GraphRAG</div><p>Entity-aware retrieval. 73% accuracy on multi-hop questions. Excels at relationship-heavy knowledge.</p></div><div class="compare-card"><div class="compare-title">Hybrid + Re-Rank</div><p>Combined keyword and semantic search with cross-encoder re-ranking. 15-30% precision improvement.</p></div></div>

<h2>Hybrid Search: Combining Keyword and Semantic Retrieval</h2>

<p>Hybrid search solves the keyword blindness problem by combining traditional keyword search (BM25, Elasticsearch) with semantic vector search, then intelligently fusing the results. The pattern is simple but powerful: run both searches in parallel, normalize scores, and merge using a weighted combination or learned ranking model.</p>

<p>Azure AI Search (formerly Cognitive Search) provides built-in hybrid search with configurable semantic-keyword weighting. A typical configuration might be 60% semantic, 40% keyword for general knowledge retrieval, but 80% keyword, 20% semantic for compliance documents where exact term matches are critical.</p>

<p>The <strong>reciprocal rank fusion (RRF)</strong> algorithm provides a simple, effective way to merge result sets without requiring score calibration. RRF assigns each result a score based on its rank position (1/rank) across all retrievers, then sums scores to produce final rankings. This avoids the problem of comparing raw scores from different retrieval systems with incompatible score distributions.</p>

<p>For production systems, implement <strong>query classification</strong> to dynamically adjust hybrid weights. Use a small classification model (fine-tuned BERT, few-shot GPT-4o-mini) to categorize incoming queries as factual/conceptual/navigational, then apply appropriate keyword-semantic weights. Factual queries ("What is our GDPR data retention policy?") lean keyword-heavy; conceptual queries ("How do we approach customer retention?") lean semantic-heavy.</p>

<h3>Metadata Filtering and Faceted Search</h3>

<p>Hybrid search becomes dramatically more effective when combined with metadata filtering. Instead of searching across your entire corpus, pre-filter by document type, date range, department, security classification, or custom taxonomies before executing semantic/keyword retrieval.</p>

<p>Structure your index with rich metadata: <code>doc_type</code>, <code>created_date</code>, <code>last_modified</code>, <code>department</code>, <code>security_level</code>, <code>document_stage</code> (draft/approved/archived), <code>tags</code>, <code>author</code>, and domain-specific fields. Then expose filters through your query interface: "Search technical documentation from 2024 and 2025 where security_level is internal or public."</p>

<p>Metadata filtering typically improves retrieval precision by 25-40% while reducing irrelevant results and speeding up queries by limiting the search space. For large corpora (1M+ documents), proper filtering is the difference between acceptable and unusable performance.</p>

<h2>Re-Ranking: Two-Stage Retrieval for Quality</h2>

<p>Re-ranking implements a two-stage retrieval pattern: fast first-stage retrieval returns 50-100 candidates, then a slower, more accurate second-stage model re-ranks the top candidates. This architecture balances speed and quality—fast retrieval handles the bulk of filtering, expensive re-ranking focuses compute on the most promising results.</p>

<p>First-stage retrieval uses efficient vector search (FAISS, Azure AI Search) or hybrid search to quickly narrow from millions of chunks to 50-100 candidates. This stage prioritizes recall—cast a wide net to ensure relevant documents are in the candidate set.</p>

<p>Second-stage re-ranking uses cross-encoder models (like <code>ms-marco-MiniLM</code> or <code>bge-reranker-large</code>) that process query-document pairs jointly, capturing fine-grained relevance signals that bi-encoder embeddings miss. Cross-encoders are 10-50x slower than vector similarity but 15-30% more accurate, making them perfect for re-ranking small candidate sets.</p>

<p>Cohere offers a re-ranking API that's production-ready out of the box. Azure AI Search includes semantic re-ranking using Microsoft's proprietary models. For full control, deploy open-source re-rankers (BGE, ColBERT) on Azure Container Apps or AKS.</p>

<h3>Advanced Re-Ranking Strategies</h3>

<p>Beyond simple cross-encoder re-ranking, consider <strong>LLM-as-a-judge</strong> re-ranking for complex domains. Use GPT-4o or Claude to evaluate whether each retrieved chunk actually answers the user's question, providing a relevance score and explanation. This is expensive (5-10 cents per query for 20 candidates) but achieves state-of-the-art quality for high-value use cases—regulatory compliance, medical question-answering, legal research.</p>

<p>Implement <strong>diversity re-ranking</strong> to avoid redundant results. Standard retrieval often returns multiple chunks from the same document or near-duplicate content. Diversity algorithms (MMR, maximal marginal relevance) penalize similarity between retrieved chunks, ensuring you return distinct information. This is especially important for summarization tasks where you want comprehensive coverage.</p>

<h2>Multi-Index Architectures and Specialized Retrievers</h2>

<p>Enterprise knowledge exists in multiple formats—documents, structured databases, code repositories, wikis, tickets, emails. A single-index RAG system treats everything as unstructured text, losing the specialized retrieval patterns each format requires.</p>

<p>Multi-index architectures maintain separate indexes for different content types, each optimized for its format. A typical enterprise setup includes: (1) document index with hybrid search, (2) structured data index (SQL, knowledge graph), (3) code index with syntax-aware search, (4) conversation index for support tickets and emails with thread-aware retrieval.</p>

<p>The query routing layer classifies incoming questions and dispatches to appropriate indexes. "What is our refund policy?" → document index. "Show me all customers who churned after price increase" → structured data index with SQL generation. "How does the authentication module work?" → code index with semantic code search.</p>

<p>Implement specialized retrievers for each content type. For code, use tree-sitter parsing to index at function/class granularity with symbol-aware embeddings. For structured data, use text-to-SQL or text-to-Cypher models to generate precise database queries instead of keyword search. For emails/tickets, maintain conversation threads and retrieve entire threads instead of isolated messages.</p>

<h2>Chunk Optimization and Parent-Child Retrieval</h2>

<p>Chunking strategy has enormous impact on RAG quality. The default approach—split documents into 500-token overlapping chunks—is simple but suboptimal. It fragments logical sections, splits tables and code blocks, and loses document structure.</p>

<p><strong>Semantic chunking</strong> uses NLP to identify natural document boundaries—section headings, topic shifts, paragraph breaks—rather than fixed token counts. Libraries like LangChain and LlamaIndex provide semantic splitters that preserve logical coherence. Expect 20-30% better retrieval quality compared to naive fixed-size chunking.</p>

<p><strong>Parent-child retrieval</strong> indexes small chunks for retrieval precision but returns larger parent contexts for generation. Store 200-token child chunks with embeddings, but maintain links to 1,000-token parent sections. When a child chunk matches, retrieve its parent for LLM context. This gives you narrow retrieval (matching specific facts) with broad context (surrounding explanation).</p>

<p>For technical documentation, implement <strong>structured chunking</strong> that respects document hierarchy. Each chunk includes metadata about its position: <code>doc_title</code>, <code>section</code>, <code>subsection</code>, <code>chunk_index</code>. When generating responses, the LLM sees not just chunk content but structural context: "From section 3.2 'Security Configuration' of the Deployment Guide..."</p>

<h3>HyDE: Hypothetical Document Embeddings</h3>

<p>HyDE (Hypothetical Document Embeddings) inverts the retrieval problem. Instead of embedding the user's question and searching for similar documents, HyDE asks the LLM to generate a hypothetical answer to the question, embeds that answer, and searches for documents similar to the hypothetical answer.</p>

<p>Why does this work? User questions are often short, vague, and use different vocabulary than documentation. Hypothetical answers are longer, detailed, and written in documentation style—making them more similar to actual documents. A question like "How do I configure SSO?" generates a hypothetical answer: "To configure single sign-on, navigate to Settings → Authentication → SSO Configuration. Enter your identity provider metadata URL and configure SAML assertions..." This hypothetical answer embeds much closer to the actual documentation than the original question.</p>

<p>HyDE adds latency (one extra LLM call) and cost but typically improves retrieval accuracy by 15-25%, especially for vague or poorly-worded questions. Implement HyDE selectively—use query classification to identify ambiguous questions that benefit from hypothetical answer generation.</p>

<h2>Query Transformation and Decomposition</h2>

<p>Complex questions often need transformation before retrieval. A question like "Compare our Q4 performance to Q3 and explain the causes of any revenue decline" needs decomposition into sub-queries: (1) retrieve Q4 performance data, (2) retrieve Q3 performance data, (3) compare metrics, (4) retrieve context about business changes between Q3 and Q4.</p>

<p><strong>Query decomposition</strong> uses an LLM to break complex questions into simpler sub-queries, execute retrievals in parallel or sequence, then synthesize results. This pattern handles multi-hop reasoning, comparisons, and analytical questions that single-shot retrieval cannot address.</p>

<p><strong>Query expansion</strong> generates alternative phrasings or related terms. "machine learning deployment" expands to include "ML model serving", "inference infrastructure", "production ML systems". Execute retrievals for all variations and merge results. This compensates for vocabulary mismatch between user queries and document language.</p>

<p><strong>Step-back prompting</strong> generates higher-level questions before retrieval. For "How do I debug OAuth token expiration in production?", first retrieve on the step-back question "How does OAuth token lifecycle work?" to get conceptual grounding, then retrieve on the specific debugging question. This two-phase retrieval provides both conceptual foundation and specific answers.</p>

<h2>Evaluating Advanced RAG Systems</h2>

<p>Advanced RAG requires rigorous evaluation. Start with a <strong>golden dataset</strong> of question-answer pairs curated by domain experts. For each question, annotate which documents/chunks should be retrieved (retrieval ground truth) and the correct answer (generation ground truth).</p>

<p>Measure <strong>retrieval metrics</strong>: precision@k (what fraction of top-k results are relevant), recall@k (what fraction of relevant documents appear in top-k), MRR (mean reciprocal rank—position of first relevant result), and NDCG (normalized discounted cumulative gain—rewards relevant results at top ranks).</p>

<p>Measure <strong>generation metrics</strong>: factual accuracy (does the answer contain correct information from retrieved context), groundedness (is the answer supported by retrieved documents or hallucinated), completeness (does it address all parts of the question), and conciseness (no unnecessary information).</p>

<p>Use <strong>LLM-as-a-judge evaluation</strong> for subjective quality. GPT-4o evaluates whether generated answers are accurate, relevant, and well-grounded by comparing them to retrieved context and reference answers. This correlates well with human judgment (0.85+ agreement) and scales to thousands of evaluations.</p>

<p>Azure AI Studio provides built-in RAG evaluation with metrics for groundedness, relevance, and coherence. LangSmith offers evaluation datasets, metrics tracking, and A/B testing for comparing RAG configurations. Implement continuous evaluation in your CI/CD pipeline—run your golden dataset on every RAG system change.</p>

<h2>Performance Comparisons and ROI</h2>

<p>Organizations implementing advanced RAG patterns report significant improvements over basic vector search. Microsoft's internal study showed GraphRAG achieving 73% accuracy on multi-hop questions versus 41% for standard RAG—a 78% relative improvement. Hybrid search typically adds 15-25% precision improvement over pure semantic search, with larger gains in specialized domains.</p>

<p>Re-ranking improves top-3 relevance by 20-30% while adding 100-300ms latency per query. For most enterprise use cases, this trade-off is favorable—users strongly prefer slower, accurate results over fast, irrelevant results. Implement caching and async processing to mitigate latency impact.</p>

<p>The business impact is substantial. Customer support organizations report 40-50% reduction in escalations when agents use advanced RAG systems versus basic keyword search. Legal and compliance teams reduce research time by 60-70% with GraphRAG-enhanced case law and regulation retrieval. Engineering teams resolve bugs 30% faster with hybrid code search combining semantic and syntax-aware retrieval.</p>

<p>Cost increases are manageable. GraphRAG adds upfront entity extraction cost (approximately $50-200 per 1M tokens) and graph database hosting ($100-500/month for mid-size deployments). Hybrid search requires maintaining both vector and keyword indexes (approximately 2x storage). Re-ranking adds 2-5 cents per query for Cohere API or hosting costs for self-deployed models. For high-value use cases, ROI is overwhelmingly positive.</p>

<h2>Implementation Roadmap for Production RAG</h2>

<p>Start with <strong>baseline RAG</strong> using Azure AI Search hybrid search with semantic ranking enabled. Implement proper chunking (semantic boundaries, not fixed tokens), rich metadata filtering, and basic evaluation. Get this into production quickly—basic RAG solves 70% of use cases and provides infrastructure for advanced patterns.</p>

<p>Add <strong>re-ranking</strong> next. Implement two-stage retrieval with cross-encoder re-ranking (Cohere API or self-hosted BGE). Measure precision improvements on your golden dataset. This is high-impact and relatively low-complexity—typically 2-3 weeks to production.</p>

<p>Introduce <strong>query transformation</strong> for complex questions. Implement decomposition for multi-part questions and HyDE for ambiguous queries. Use query classification to apply transformations selectively. This addresses the long tail of complex questions that basic retrieval handles poorly.</p>

<p>For organizations with relationship-heavy knowledge (legal precedent, technical dependencies, organizational structures), implement <strong>GraphRAG</strong>. This is a 2-3 month effort requiring entity schema design, extraction pipeline development, graph database deployment, and query planning logic. Prioritize use cases where multi-hop reasoning delivers clear business value.</p>

<p>Implement <strong>continuous evaluation and monitoring</strong> throughout. Track retrieval quality metrics, user satisfaction signals (thumbs up/down, query refinement patterns), and business outcomes (resolution time, escalation rates). Use this data to prioritize improvements and validate that advanced patterns deliver ROI.</p>

<p>At Gennoor Tech, our <a href="/services/training">enterprise AI training programs</a> guide organizations through this roadmap, from initial RAG deployment to advanced patterns like GraphRAG and multi-agent orchestration. We provide hands-on implementation support, architecture reviews, and team upskilling to ensure your RAG systems deliver production-grade quality and measurable business impact. Explore more advanced AI patterns on our <a href="/resources/blog">blog</a>, where we cover the latest in enterprise AI implementation.</p>
`,
    author: 'Gennoor Tech',
    date: '2026-01-19',
    readTime: '12 min read',
    category: 'AI Architecture',
    tags: ['RAG', 'GraphRAG', 'Hybrid Search', 'Vector Search'],
    hashtags: ['#RAG', '#GraphRAG', '#HybridSearch', '#VectorSearch', '#AIArchitecture'],
    coverColor: '#1B4F72',
    icon: '🕸️',
  }
