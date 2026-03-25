import type { BlogPost } from '../index'

export const post: BlogPost = {
    slug: 'mlflow-rag-evaluation-pipeline',
    title: 'Evaluating RAG Pipelines with MLflow: A Practical Framework',
    excerpt: 'Your RAG system is only as good as your evaluation. Here is how to build a systematic evaluation pipeline using MLflow that catches quality issues before users do.',
    tldr: 'A systematic RAG evaluation pipeline using MLflow tracks retrieval quality, answer faithfulness, and relevance across versions — catching quality regressions before users experience them.',
    content: `
<p>Most teams building retrieval-augmented generation (RAG) systems start with vibes-based evaluation: "Does this answer look good?" While intuition helps during initial development, it fails catastrophically at scale. Production RAG systems answer thousands of queries daily across diverse topics—manual review is impossible, and subtle quality degradations go unnoticed until users complain. This guide presents a practical framework for rigorous RAG evaluation using MLflow.</p>

<h2>Why Vibes-Based Evaluation Fails at Scale</h2>

<p>The vibes approach has fatal flaws:</p>

<h3>Cognitive Biases</h3>

<p>Humans fall victim to confirmation bias (seeing what they expect), recency bias (over-weighting recent examples), and anchoring (being influenced by initial impressions). These biases make subjective evaluation unreliable, especially when comparing similar system versions.</p>

<h3>Limited Coverage</h3>

<p>Manual review typically covers 10-50 examples. Production systems handle millions of queries spanning edge cases you never imagined. Your sample is almost certainly not representative.</p>

<h3>Inconsistency</h3>

<p>Different reviewers apply different standards. The same reviewer applies different standards on different days. Inter-rater reliability studies consistently show poor agreement on subjective quality assessments.</p>

<h3>Inability to Detect Regressions</h3>

<p>When you modify chunk sizes, change embedding models, or update prompts, vibes evaluation can't reliably detect whether performance improved or degraded. You're flying blind.</p>

<h3>No Cost Visibility</h3>

<p>Manual review doesn't capture token usage, API costs, or latency. You might achieve slightly better quality at 10x the cost—a terrible trade-off that vibes evaluation won't reveal.</p>

<p>Systematic evaluation with MLflow solves these problems by combining automated metrics, large test sets, and reproducible experiments.</p>

<h2>Comprehensive RAG Evaluation Taxonomy</h2>

<p>RAG evaluation breaks down into three categories, each measuring different aspects of system quality:</p>

<h3>Retrieval Quality</h3>

<p>Did the system find the right documents? Metrics include precision (what percentage of retrieved docs are relevant), recall (what percentage of relevant docs were retrieved), and ranking quality (are the best docs at the top).</p>

<h3>Generation Quality</h3>

<p>Given the retrieved context, did the LLM produce a good answer? Metrics include faithfulness (does the answer follow from the context), relevance (does it address the question), coherence (is it well-written), and safety (is it non-toxic and appropriate).</p>

<h3>End-to-End Quality</h3>

<p>From the user's perspective, was the overall experience successful? Metrics include answer correctness, user satisfaction, task completion rate, and whether the system knew when to say "I don't know."</p>

<p>Comprehensive evaluation requires metrics from all three categories. Optimizing only retrieval or only generation leads to sub-optimal systems.</p>

<div class="blog-diagram">
<svg viewBox="0 0 600 150" xmlns="http://www.w3.org/2000/svg">
<rect x="10" y="10" width="110" height="35" rx="6" fill="#2563eb" /><text x="65" y="32" text-anchor="middle" fill="#fff" font-size="11" font-weight="600">User Query</text>
<polygon points="125,27 138,20 138,35" fill="#94a3b8" />
<rect x="143" y="10" width="110" height="35" rx="6" fill="#0d9488" /><text x="198" y="32" text-anchor="middle" fill="#fff" font-size="11" font-weight="600">Retrieval</text>
<polygon points="258,27 271,20 271,35" fill="#94a3b8" />
<rect x="276" y="10" width="110" height="35" rx="6" fill="#0d9488" /><text x="331" y="32" text-anchor="middle" fill="#fff" font-size="11" font-weight="600">Generation</text>
<polygon points="391,27 404,20 404,35" fill="#94a3b8" />
<rect x="409" y="10" width="110" height="35" rx="6" fill="#2563eb" /><text x="464" y="32" text-anchor="middle" fill="#fff" font-size="11" font-weight="600">Answer</text>
<rect x="143" y="60" width="110" height="30" rx="4" fill="#475569" /><text x="198" y="80" text-anchor="middle" fill="#fff" font-size="9">Precision / Recall</text>
<rect x="276" y="60" width="110" height="30" rx="4" fill="#475569" /><text x="331" y="80" text-anchor="middle" fill="#fff" font-size="9">Faithfulness</text>
<rect x="409" y="60" width="110" height="30" rx="4" fill="#475569" /><text x="464" y="80" text-anchor="middle" fill="#fff" font-size="9">Correctness</text>
<line x1="198" y1="45" x2="198" y2="60" stroke="#64748b" stroke-width="1.5" /><line x1="331" y1="45" x2="331" y2="60" stroke="#64748b" stroke-width="1.5" /><line x1="464" y1="45" x2="464" y2="60" stroke="#64748b" stroke-width="1.5" />
<rect x="200" y="110" width="200" height="30" rx="4" fill="#1e293b" /><text x="300" y="130" text-anchor="middle" fill="#fff" font-size="10" font-weight="600">MLflow Dashboard</text>
<line x1="198" y1="90" x2="250" y2="110" stroke="#64748b" stroke-width="1" /><line x1="331" y1="90" x2="300" y2="110" stroke="#64748b" stroke-width="1" /><line x1="464" y1="90" x2="350" y2="110" stroke="#64748b" stroke-width="1" />
</svg>
<figcaption>RAG evaluation pipeline: metrics at every stage feed into MLflow for tracking</figcaption>
</div>

<h2>Retrieval Metrics Deep Dive</h2>

<h3>Precision and Recall</h3>

<p>These fundamental metrics require ground truth labels indicating which documents are relevant to each query:</p>

<ul>
<li><strong>Precision@K</strong>: Of the K documents retrieved, what percentage are relevant?</li>
<li><strong>Recall@K</strong>: Of all relevant documents in the corpus, what percentage appear in the top K results?</li>
</ul>

<p>Example: For query "What is the loan approval process?", if the system retrieves 5 documents and 3 are relevant, and there are 4 relevant documents total in the corpus:</p>

<code>
Precision@5 = 3/5 = 0.60<br>
Recall@5 = 3/4 = 0.75
</code>

<p>High precision means users aren't overwhelmed with irrelevant results. High recall means the system finds all the information it needs to answer comprehensively.</p>

<h3>Mean Reciprocal Rank (MRR)</h3>

<p>MRR measures how quickly users find relevant results:</p>

<code>
MRR = average(1 / rank_of_first_relevant_document)
</code>

<p>If the first relevant document appears in position 1, the reciprocal rank is 1.0. Position 2 yields 0.5, position 3 yields 0.33, and so on. Higher MRR means users find what they need faster.</p>

<h3>Normalized Discounted Cumulative Gain (NDCG)</h3>

<p>NDCG is sophisticated ranking metric that accounts for graded relevance (some documents are more relevant than others) and position (earlier documents matter more):</p>

<code>
DCG@K = sum(relevance_score[i] / log2(i + 1) for i in 1 to K)<br>
NDCG@K = DCG@K / ideal_DCG@K
</code>

<p>NDCG ranges from 0 to 1, with 1 indicating perfect ranking. It's particularly useful when you have nuanced relevance labels (e.g., "highly relevant", "somewhat relevant", "not relevant") rather than binary labels.</p>

<h3>Hit Rate</h3>

<p>Simple but effective: what percentage of queries have at least one relevant document in the top K results?</p>

<code>
Hit_Rate@K = (number of queries with ≥1 relevant doc in top K) / (total queries)
</code>

<p>Hit rate is easier to calculate than precision/recall because you only need to identify if any relevant documents were retrieved, not label every document.</p>

<h3>Implementation in Code</h3>

<code>
from mlflow.metrics import make_metric<br><br>
def calculate_retrieval_metrics(predictions, targets, metrics):<br>
&nbsp;&nbsp;&nbsp;&nbsp;"""Calculate precision, recall, and MRR for retrieved documents"""<br>
&nbsp;&nbsp;&nbsp;&nbsp;results = {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"precision_at_5": [],<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"recall_at_5": [],<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"mrr": []<br>
&nbsp;&nbsp;&nbsp;&nbsp;}<br>
&nbsp;&nbsp;&nbsp;&nbsp;<br>
&nbsp;&nbsp;&nbsp;&nbsp;for pred, target in zip(predictions, targets):<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;retrieved_doc_ids = pred["retrieved_docs"][:5]<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;relevant_doc_ids = target["relevant_docs"]<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Precision@5<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;relevant_in_retrieved = sum(1 for doc in retrieved_doc_ids if doc in relevant_doc_ids)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;precision = relevant_in_retrieved / len(retrieved_doc_ids) if retrieved_doc_ids else 0<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;results["precision_at_5"].append(precision)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Recall@5<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;recall = relevant_in_retrieved / len(relevant_doc_ids) if relevant_doc_ids else 0<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;results["recall_at_5"].append(recall)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# MRR<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;reciprocal_rank = 0<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;for i, doc in enumerate(retrieved_doc_ids, 1):<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if doc in relevant_doc_ids:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;reciprocal_rank = 1 / i<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;break<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;results["mrr"].append(reciprocal_rank)<br>
&nbsp;&nbsp;&nbsp;&nbsp;<br>
&nbsp;&nbsp;&nbsp;&nbsp;return {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"precision_at_5": sum(results["precision_at_5"]) / len(results["precision_at_5"]),<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"recall_at_5": sum(results["recall_at_5"]) / len(results["recall_at_5"]),<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"mrr": sum(results["mrr"]) / len(results["mrr"])<br>
&nbsp;&nbsp;&nbsp;&nbsp;}<br><br>
retrieval_metric = make_metric(<br>
&nbsp;&nbsp;&nbsp;&nbsp;eval_fn=calculate_retrieval_metrics,<br>
&nbsp;&nbsp;&nbsp;&nbsp;greater_is_better=True,<br>
&nbsp;&nbsp;&nbsp;&nbsp;name="retrieval_quality"<br>
)
</code>

<h2>Generation Metrics Deep Dive</h2>

<h3>Faithfulness</h3>

<p>Faithfulness measures whether the generated answer is supported by the retrieved context. This is critical for preventing hallucinations—the LLM should only make claims that can be verified in the source documents.</p>

<p>Implement faithfulness evaluation using an LLM-as-judge approach:</p>

<code>
from mlflow.metrics import faithfulness<br><br>
faithfulness_metric = faithfulness(model="openai:/gpt-4")
</code>

<p>The judge model receives the retrieved context, the generated answer, and a prompt asking "Is every claim in the answer supported by the context?" It returns a score from 0 to 1.</p>

<h3>Relevance</h3>

<p>Relevance measures whether the answer actually addresses the user's question. An answer can be faithful to the context but still irrelevant if the wrong documents were retrieved.</p>

<code>
from mlflow.metrics import answer_relevance<br><br>
relevance_metric = answer_relevance(model="openai:/gpt-4")
</code>

<h3>Coherence</h3>

<p>Coherence assesses whether the answer is well-written, logically structured, and easy to understand. Poor coherence manifests as awkward phrasing, contradictions, or disjointed flow.</p>

<p>Build a custom coherence metric:</p>

<code>
def evaluate_coherence(predictions, targets, metrics):<br>
&nbsp;&nbsp;&nbsp;&nbsp;"""Evaluate answer coherence using GPT-4 as judge"""<br>
&nbsp;&nbsp;&nbsp;&nbsp;import openai<br>
&nbsp;&nbsp;&nbsp;&nbsp;<br>
&nbsp;&nbsp;&nbsp;&nbsp;scores = []<br>
&nbsp;&nbsp;&nbsp;&nbsp;for pred in predictions:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;judge_prompt = f"""Rate the coherence of this answer on a scale of 1-5:<br>
<br>
Answer: {pred}<br>
<br>
Consider: Is it well-structured? Does it flow logically? Is it easy to understand?<br>
Respond with only a number from 1 to 5."""<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;response = openai.ChatCompletion.create(<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;model="gpt-4",<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;messages=[{"role": "user", "content": judge_prompt}]<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;score = int(response.choices[0].message.content.strip())<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;scores.append(score / 5)  # Normalize to 0-1<br>
&nbsp;&nbsp;&nbsp;&nbsp;<br>
&nbsp;&nbsp;&nbsp;&nbsp;return {"coherence": sum(scores) / len(scores)}
</code>

<h3>Toxicity</h3>

<p>Toxicity detection identifies harmful, offensive, or inappropriate content. Use specialized models like Perspective API or Azure Content Safety:</p>

<code>
from mlflow.metrics import toxicity<br><br>
toxicity_metric = toxicity(model="openai:/gpt-4")
</code>

<p>Set strict thresholds—even a small percentage of toxic responses can cause significant reputational damage.</p>

<h3>Conciseness</h3>

<p>Some domains prioritize brief answers, while others require comprehensive explanations. Measure answer length and penalize verbosity when appropriate:</p>

<code>
def evaluate_conciseness(predictions, targets, metrics):<br>
&nbsp;&nbsp;&nbsp;&nbsp;"""Penalize unnecessarily long answers"""<br>
&nbsp;&nbsp;&nbsp;&nbsp;scores = []<br>
&nbsp;&nbsp;&nbsp;&nbsp;target_length = 150  # words<br>
&nbsp;&nbsp;&nbsp;&nbsp;<br>
&nbsp;&nbsp;&nbsp;&nbsp;for pred in predictions:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;word_count = len(pred.split())<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if word_count <= target_length:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;score = 1.0<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;else:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Penalty for excess words<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;score = max(0, 1 - (word_count - target_length) / target_length)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;scores.append(score)<br>
&nbsp;&nbsp;&nbsp;&nbsp;<br>
&nbsp;&nbsp;&nbsp;&nbsp;return {"conciseness": sum(scores) / len(scores)}
</code>

<h2>Building Golden Test Sets</h2>

<p>Automated metrics are only as good as the test data they evaluate against. Golden test sets are curated collections of query-answer pairs with ground truth labels.</p>

<h3>Strategies for Test Set Creation</h3>

<h4>1. Mine Production Logs</h4>

<p>Identify frequently asked questions from actual users. This ensures your test set reflects real usage patterns rather than what developers imagine users will ask.</p>

<h4>2. Synthetic Data Generation</h4>

<p>Use LLMs to generate diverse questions from your document corpus:</p>

<code>
for document in corpus:<br>
&nbsp;&nbsp;&nbsp;&nbsp;prompt = f"""Generate 5 questions that could be answered using this document:<br>
<br>
{document}<br>
<br>
Questions should vary in complexity and specificity."""<br>
&nbsp;&nbsp;&nbsp;&nbsp;questions = llm.generate(prompt)<br>
&nbsp;&nbsp;&nbsp;&nbsp;# Add to test set with document as ground truth context
</code>

<h4>3. Subject Matter Expert (SME) Curation</h4>

<p>Have domain experts write questions they expect users to ask, along with correct answers and relevant documents. This is time-consuming but produces high-quality test data for critical scenarios.</p>

<h4>4. Edge Case Collection</h4>

<p>Actively seek out challenging scenarios:</p>

<ul>
<li>Ambiguous questions that could have multiple interpretations</li>
<li>Questions requiring information from multiple documents</li>
<li>Questions with no good answer in the corpus</li>
<li>Questions with contradictory information across documents</li>
<li>Domain-specific jargon or technical terminology</li>
</ul>

<h3>Test Set Size Recommendations</h3>

<ul>
<li><strong>Minimum viable</strong>: 50-100 examples for initial development</li>
<li><strong>Development set</strong>: 200-500 examples for hyperparameter tuning and prompt engineering</li>
<li><strong>Test set</strong>: 500-1000 examples for final evaluation and confidence before production</li>
<li><strong>Continuous evaluation</strong>: 50-100 new examples per month from production traffic</li>
</ul>

<h3>Test Set Maintenance</h3>

<p>Test sets decay over time as your document corpus evolves, user needs change, and edge cases emerge. Schedule quarterly reviews:</p>

<ol>
<li>Remove outdated questions whose answers have changed</li>
<li>Add new questions covering recent edge cases from production</li>
<li>Update ground truth labels based on document updates</li>
<li>Rebalance categories to ensure representative coverage</li>
</ol>

<p>Store test sets in version control (Git) with clear change logs. Tag test set versions with the document corpus versions they correspond to.</p>

<div class="blog-stats">
<div class="stat"><span class="stat-value">500+</span><span class="stat-label">Test Cases for Production</span></div>
<div class="stat"><span class="stat-value">3</span><span class="stat-label">Evaluation Dimensions</span></div>
<div class="stat"><span class="stat-value">Quarterly</span><span class="stat-label">Test Set Refresh Cadence</span></div>
</div>

<p>For guidance on building test sets tailored to your domain, our <a href="/services/training">MLOps training programs</a> include hands-on workshops.</p>

<h2>MLflow Evaluate Configuration and Code Patterns</h2>

<h3>Complete Evaluation Pipeline</h3>

<code>
import mlflow<br>
import pandas as pd<br>
from mlflow.metrics import faithfulness, answer_relevance<br><br>
# Load test set<br>
test_data = pd.read_csv("test_set.csv")<br><br>
# Define evaluation data format<br>
eval_data = pd.DataFrame({<br>
&nbsp;&nbsp;&nbsp;&nbsp;"inputs": test_data["question"],<br>
&nbsp;&nbsp;&nbsp;&nbsp;"ground_truth": test_data["expected_answer"],<br>
&nbsp;&nbsp;&nbsp;&nbsp;"context": test_data["relevant_documents"]<br>
})<br><br>
# Define your RAG model as a function<br>
def rag_model(inputs):<br>
&nbsp;&nbsp;&nbsp;&nbsp;results = []<br>
&nbsp;&nbsp;&nbsp;&nbsp;for question in inputs["inputs"]:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Retrieve documents<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;docs = retriever.retrieve(question)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Generate answer<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;answer = generator.generate(question, docs)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;results.append(answer)<br>
&nbsp;&nbsp;&nbsp;&nbsp;return results<br><br>
# Run evaluation<br>
with mlflow.start_run():<br>
&nbsp;&nbsp;&nbsp;&nbsp;# Log configuration<br>
&nbsp;&nbsp;&nbsp;&nbsp;mlflow.log_param("chunk_size", 512)<br>
&nbsp;&nbsp;&nbsp;&nbsp;mlflow.log_param("embedding_model", "text-embedding-ada-002")<br>
&nbsp;&nbsp;&nbsp;&nbsp;mlflow.log_param("llm_model", "gpt-4")<br>
&nbsp;&nbsp;&nbsp;&nbsp;mlflow.log_param("temperature", 0.7)<br>
&nbsp;&nbsp;&nbsp;&nbsp;mlflow.log_param("top_k_docs", 5)<br>
&nbsp;&nbsp;&nbsp;&nbsp;<br>
&nbsp;&nbsp;&nbsp;&nbsp;# Evaluate<br>
&nbsp;&nbsp;&nbsp;&nbsp;results = mlflow.evaluate(<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;model=rag_model,<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;data=eval_data,<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;model_type="question-answering",<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;metrics=[<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;faithfulness(model="openai:/gpt-4"),<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;answer_relevance(model="openai:/gpt-4"),<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;retrieval_metric,<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;toxicity_metric<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]<br>
&nbsp;&nbsp;&nbsp;&nbsp;)<br>
&nbsp;&nbsp;&nbsp;&nbsp;<br>
&nbsp;&nbsp;&nbsp;&nbsp;# Log aggregate metrics<br>
&nbsp;&nbsp;&nbsp;&nbsp;mlflow.log_metrics(results.metrics)<br>
&nbsp;&nbsp;&nbsp;&nbsp;<br>
&nbsp;&nbsp;&nbsp;&nbsp;# Save detailed results<br>
&nbsp;&nbsp;&nbsp;&nbsp;results.tables["eval_results_table"].to_csv("detailed_results.csv")<br>
&nbsp;&nbsp;&nbsp;&nbsp;mlflow.log_artifact("detailed_results.csv")
</code>

<h3>Comparing Multiple Configurations</h3>

<code>
configurations = [<br>
&nbsp;&nbsp;&nbsp;&nbsp;{"chunk_size": 256, "top_k": 3},<br>
&nbsp;&nbsp;&nbsp;&nbsp;{"chunk_size": 512, "top_k": 5},<br>
&nbsp;&nbsp;&nbsp;&nbsp;{"chunk_size": 1024, "top_k": 7}<br>
]<br><br>
for config in configurations:<br>
&nbsp;&nbsp;&nbsp;&nbsp;with mlflow.start_run(run_name=f"chunk_{config['chunk_size']}_k_{config['top_k']}"):<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Configure system<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;rag_system.set_chunk_size(config["chunk_size"])<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;rag_system.set_top_k(config["top_k"])<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Log parameters<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;mlflow.log_params(config)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Evaluate<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;results = mlflow.evaluate(...)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;mlflow.log_metrics(results.metrics)
</code>

<p>Use the MLflow UI to compare runs side-by-side and identify the best configuration.</p>

<h2>Automated Evaluation Pipelines with CI/CD</h2>

<p>Integrate evaluation into your development workflow to catch regressions before production deployment.</p>

<h3>GitHub Actions Example</h3>

<code>
name: RAG Evaluation<br>
on: [pull_request]<br><br>
jobs:<br>
&nbsp;&nbsp;evaluate:<br>
&nbsp;&nbsp;&nbsp;&nbsp;runs-on: ubuntu-latest<br>
&nbsp;&nbsp;&nbsp;&nbsp;steps:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- uses: actions/checkout@v3<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- name: Set up Python<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;uses: actions/setup-python@v4<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;with:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;python-version: '3.10'<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- name: Install dependencies<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;run: pip install -r requirements.txt<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- name: Run evaluation<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;env:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;MLFLOW_TRACKING_URI: \${{ secrets.MLFLOW_TRACKING_URI }}<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;OPENAI_API_KEY: \${{ secrets.OPENAI_API_KEY }}<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;run: python evaluate_rag.py<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- name: Check metrics threshold<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;run: python check_thresholds.py
</code>

<h3>Quality Gates</h3>

<p>Define minimum acceptable metrics and fail the CI pipeline if they're not met:</p>

<code>
import mlflow<br><br>
client = mlflow.tracking.MlflowClient()<br>
run = client.get_run(run_id)<br><br>
thresholds = {<br>
&nbsp;&nbsp;&nbsp;&nbsp;"faithfulness": 0.85,<br>
&nbsp;&nbsp;&nbsp;&nbsp;"answer_relevance": 0.80,<br>
&nbsp;&nbsp;&nbsp;&nbsp;"precision_at_5": 0.70,<br>
&nbsp;&nbsp;&nbsp;&nbsp;"toxicity": 0.05  # Lower is better<br>
}<br><br>
failures = []<br>
for metric, threshold in thresholds.items():<br>
&nbsp;&nbsp;&nbsp;&nbsp;value = run.data.metrics.get(metric, 0)<br>
&nbsp;&nbsp;&nbsp;&nbsp;if metric == "toxicity":<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if value > threshold:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;failures.append(f"{metric}: {value} > {threshold}")<br>
&nbsp;&nbsp;&nbsp;&nbsp;else:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if value < threshold:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;failures.append(f"{metric}: {value} < {threshold}")<br><br>
if failures:<br>
&nbsp;&nbsp;&nbsp;&nbsp;print("Quality gates failed:")<br>
&nbsp;&nbsp;&nbsp;&nbsp;for failure in failures:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;print(f"  - {failure}")<br>
&nbsp;&nbsp;&nbsp;&nbsp;exit(1)
</code>

<h2>A/B Testing RAG Configurations</h2>

<p>Once in production, use A/B testing to validate improvements with real users:</p>

<ol>
<li><strong>Deploy challenger variant</strong>: Deploy new RAG configuration alongside existing "champion" version</li>
<li><strong>Route traffic</strong>: Send 10% of traffic to challenger, 90% to champion</li>
<li><strong>Collect metrics</strong>: Track quality metrics, user feedback, cost, and latency for both variants</li>
<li><strong>Statistical analysis</strong>: Determine if observed differences are statistically significant</li>
<li><strong>Promote or rollback</strong>: If challenger performs better, gradually increase traffic; if worse, remove it</li>
</ol>

<p>Use feature flags (Azure App Configuration, LaunchDarkly) to control routing without code deployments.</p>

<h2>Chunking Strategy Evaluation</h2>

<p>Chunk size dramatically impacts RAG performance. Evaluate multiple strategies:</p>

<h3>Fixed-Size Chunking</h3>

<code>
chunk_sizes = [128, 256, 512, 1024]<br>
for size in chunk_sizes:<br>
&nbsp;&nbsp;&nbsp;&nbsp;with mlflow.start_run(run_name=f"fixed_chunk_{size}"):<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;chunker = FixedSizeChunker(size=size, overlap=50)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Rebuild index and evaluate
</code>

<h3>Semantic Chunking</h3>

<p>Chunk at natural boundaries (sentences, paragraphs, sections) rather than fixed character counts:</p>

<code>
strategies = ["sentence", "paragraph", "section"]<br>
for strategy in strategies:<br>
&nbsp;&nbsp;&nbsp;&nbsp;with mlflow.start_run(run_name=f"semantic_chunk_{strategy}"):<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;chunker = SemanticChunker(strategy=strategy)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Rebuild index and evaluate
</code>

<h3>Hybrid Approaches</h3>

<p>Combine semantic boundaries with maximum size constraints to prevent overly large chunks.</p>

<h2>Embedding Model Comparison Framework</h2>

<p>Different embedding models trade off quality, speed, and cost:</p>

<code>
embedding_models = [<br>
&nbsp;&nbsp;&nbsp;&nbsp;{"name": "text-embedding-ada-002", "dim": 1536, "cost": "low"},<br>
&nbsp;&nbsp;&nbsp;&nbsp;{"name": "text-embedding-3-small", "dim": 1536, "cost": "low"},<br>
&nbsp;&nbsp;&nbsp;&nbsp;{"name": "text-embedding-3-large", "dim": 3072, "cost": "medium"},<br>
&nbsp;&nbsp;&nbsp;&nbsp;{"name": "sentence-transformers/all-mpnet-base-v2", "dim": 768, "cost": "zero"}<br>
]<br><br>
for model in embedding_models:<br>
&nbsp;&nbsp;&nbsp;&nbsp;with mlflow.start_run(run_name=f"embedding_{model['name']}"):<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Rebuild vector store with new embeddings<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;retriever = rebuild_index(embedding_model=model["name"])<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Evaluate retrieval quality<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;results = mlflow.evaluate(...)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Log model characteristics<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;mlflow.log_param("embedding_dim", model["dim"])<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;mlflow.log_param("cost_tier", model["cost"])
</code>

<p>Often, cheaper embedding models perform nearly as well as expensive ones for domain-specific corpora. Always benchmark before choosing.</p>

<h2>Prompt Template Evaluation</h2>

<p>Systematically test prompt variations:</p>

<code>
prompt_templates = [<br>
&nbsp;&nbsp;&nbsp;&nbsp;"""Answer this question based on the context:<br>
Question: {question}<br>
Context: {context}""",<br>
<br>
&nbsp;&nbsp;&nbsp;&nbsp;"""You are a helpful assistant. Use only the provided context to answer the question. If the context doesn't contain enough information, say "I don't have enough information to answer that."<br>
<br>
Context: {context}<br>
<br>
Question: {question}""",<br>
<br>
&nbsp;&nbsp;&nbsp;&nbsp;"""Based on the following context, provide a concise answer to the question. Cite specific facts from the context.<br>
<br>
Context: {context}<br>
<br>
Question: {question}<br>
<br>
Answer:"""<br>
]<br><br>
for i, template in enumerate(prompt_templates):<br>
&nbsp;&nbsp;&nbsp;&nbsp;with mlflow.start_run(run_name=f"prompt_variant_{i}"):<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;rag_system.set_prompt_template(template)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;results = mlflow.evaluate(...)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;mlflow.log_text(template, "prompt_template.txt")
</code>

<p>Small prompt changes can yield significant quality differences. Test extensively.</p>

<h2>Handling Edge Cases</h2>

<h3>No-Answer Scenarios</h3>

<p>When the corpus doesn't contain relevant information, the system should say "I don't know" rather than hallucinate:</p>

<code>
def evaluate_no_answer_handling(predictions, targets, metrics):<br>
&nbsp;&nbsp;&nbsp;&nbsp;"""Check if system appropriately refuses to answer when it shouldn't"""<br>
&nbsp;&nbsp;&nbsp;&nbsp;scores = []<br>
&nbsp;&nbsp;&nbsp;&nbsp;no_answer_phrases = ["I don't have", "I don't know", "insufficient information", "I cannot answer"]<br>
&nbsp;&nbsp;&nbsp;&nbsp;<br>
&nbsp;&nbsp;&nbsp;&nbsp;for pred, target in zip(predictions, targets):<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if target["should_refuse"]:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Should say "I don't know"<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;refused = any(phrase in pred.lower() for phrase in no_answer_phrases)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;scores.append(1.0 if refused else 0.0)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;else:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Should provide answer<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;provided_answer = not any(phrase in pred.lower() for phrase in no_answer_phrases)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;scores.append(1.0 if provided_answer else 0.0)<br>
&nbsp;&nbsp;&nbsp;&nbsp;<br>
&nbsp;&nbsp;&nbsp;&nbsp;return {"no_answer_accuracy": sum(scores) / len(scores)}
</code>

<h3>Multi-Document Synthesis</h3>

<p>Some questions require synthesizing information from multiple documents. Evaluate whether the system successfully combines evidence:</p>

<code>
def evaluate_multi_doc_synthesis(predictions, targets, metrics):<br>
&nbsp;&nbsp;&nbsp;&nbsp;"""Check if answer incorporates information from multiple source documents"""<br>
&nbsp;&nbsp;&nbsp;&nbsp;scores = []<br>
&nbsp;&nbsp;&nbsp;&nbsp;<br>
&nbsp;&nbsp;&nbsp;&nbsp;for pred, target in zip(predictions, targets):<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if target["requires_multi_doc"]:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Check if answer mentions facts from multiple ground truth docs<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;docs_referenced = sum(<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 for doc in target["source_docs"]<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if any(fact in pred for fact in doc["key_facts"])<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;score = min(1.0, docs_referenced / len(target["source_docs"]))<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;scores.append(score)<br>
&nbsp;&nbsp;&nbsp;&nbsp;<br>
&nbsp;&nbsp;&nbsp;&nbsp;return {"multi_doc_synthesis": sum(scores) / len(scores) if scores else 1.0}
</code>

<h3>Contradictory Sources</h3>

<p>When documents contradict each other, the system should acknowledge the contradiction rather than picking one arbitrarily:</p>

<ul>
<li>Test set includes queries where documents provide conflicting information</li>
<li>Ground truth answer acknowledges both perspectives</li>
<li>Evaluate whether generated answer identifies the contradiction</li>
</ul>

<h2>Real-World Case Study: RAG Evaluation at Scale</h2>

<p>A financial services company built a RAG system for internal policy Q&A, serving 5,000 employees across legal, compliance, HR, and operations departments.</p>

<h3>Initial Challenges</h3>

<ul>
<li>Manual review of 20 questions couldn't catch regressions</li>
<li>Employees reported inconsistent answer quality</li>
<li>No visibility into which departments or query types had poor experiences</li>
<li>Prompt engineering changes caused unexpected quality degradation</li>
</ul>

<h3>Evaluation Framework Implementation</h3>

<p>They built a comprehensive framework using MLflow:</p>

<ol>
<li><strong>Golden Test Set</strong>: 800 questions curated from 6 months of production logs, labeled by SMEs with ground truth answers and relevant policies</li>
<li><strong>Automated Pipeline</strong>: GitHub Actions running evaluation on every pull request, blocking merges if quality gates fail</li>
<li><strong>Segmented Metrics</strong>: Tracked performance separately for each department, query complexity level, and document type</li>
<li><strong>Cost Tracking</strong>: Logged token usage and costs per evaluation run to prevent ballooning expenses</li>
<li><strong>Human-in-the-Loop</strong>: Weekly review of low-scoring examples to identify systematic issues</li>
</ol>

<h3>Results</h3>

<ul>
<li>Faithfulness score improved from 0.72 to 0.91 over 3 months</li>
<li>Caught 12 regressions before production deployment</li>
<li>Identified that legal queries needed different chunk sizes than HR queries</li>
<li>Reduced LLM costs by 35% by using cheaper models for simple queries</li>
<li>Employee satisfaction (measured by thumbs up/down) improved from 68% to 87%</li>
</ul>

<p>The evaluation framework paid for itself within 6 weeks by preventing production issues and optimizing infrastructure costs. For similar success in your organization, explore our <a href="/services/training">MLOps consulting and training services</a>.</p>

<h2>Common Pitfalls and How to Avoid Them</h2>

<h3>Pitfall 1: Test Set Contamination</h3>

<p>Accidentally including test data in training or optimization leads to overfitting. Keep test sets completely separate and only evaluate against them for final validation, not during development.</p>

<h3>Pitfall 2: Metric Selection Bias</h3>

<p>Optimizing for easy-to-measure metrics (like retrieval precision) while ignoring harder-to-measure ones (like user satisfaction) produces systems that perform well on paper but poorly in practice. Use a balanced scorecard of metrics.</p>

<h3>Pitfall 3: Ignoring Latency</h3>

<p>Achieving 98% quality with 10-second latency is usually worse than 92% quality with 2-second latency. Always measure and log latency alongside quality metrics.</p>

<h3>Pitfall 4: Static Test Sets</h3>

<p>As your system improves, existing test sets become too easy and stop providing signal. Continuously add new edge cases from production.</p>

<h3>Pitfall 5: Lack of Baseline</h3>

<p>Establishing a baseline before optimization attempts is critical. Without it, you can't tell if changes improved performance or just shifted it around.</p>

<h3>Pitfall 6: Over-Reliance on LLM Judges</h3>

<p>LLM-as-judge metrics are powerful but not perfect. They can miss subtle issues, have biases, and cost money to run. Complement them with heuristic metrics and human review of edge cases.</p>

<h2>Conclusion</h2>

<p>RAG evaluation separates production-grade systems from prototypes. Vibes-based assessment works for demos but fails at scale—systematic evaluation with MLflow provides the rigor necessary for reliable, high-quality RAG deployments.</p>

<p>Start with basic metrics (precision, faithfulness, relevance), build a modest golden test set, and automate evaluation in CI/CD. As your system matures, expand metrics to cover edge cases, segment performance by user groups, and implement continuous evaluation of production traffic.</p>

<p>RAG systems are complex with many configuration options—chunk size, embedding models, retrieval strategies, prompt templates, and reranking approaches. Only systematic evaluation reveals which combinations work best for your specific use case and data. The investment in evaluation infrastructure pays dividends through fewer production issues, lower costs, and higher user satisfaction.</p>

<p>For teams serious about production RAG systems, evaluation isn't optional—it's the foundation of quality. Build it early, iterate often, and let data guide your optimization decisions. For more insights on MLOps and RAG best practices, visit our <a href="/resources/blog">blog</a>.</p>
`,
    author: 'Gennoor Tech',
    date: '2026-02-24',
    readTime: '12 min read',
    category: 'MLOps',
    tags: ['MLflow', 'RAG', 'Evaluation', 'AI Quality'],
    hashtags: ['#MLflow', '#RAG', '#AIEvaluation', '#MLOps', '#DataQuality'],
    coverColor: '#1E8449',
    icon: '🔍',
  }
