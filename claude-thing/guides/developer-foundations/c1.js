/* Chapters 2-4: Messages API, Async, Batch */

chapter('ch2', '2. Messages API foundations', 'core',
'<h2>TicketFlow: Day 1</h2>' +
'<p>Your first task at Loomline: take the prototype ticket classifier from a Jupyter notebook to a production Python service. The prototype uses the Messages API to categorize support tickets as <code>billing</code>, <code>technical</code>, or <code>feature_request</code>. Your job: make it reliable, cost-tracked, and ready for real traffic.</p>' +

concept('2.1 Messages API anatomy', { ex: 'e01_basic',
  what: 'The Messages API is the foundational Claude interface. You send a list of messages (user/assistant turns) plus a system prompt and model name, and Claude returns a response with content blocks and token usage.',
  why: 'Every advanced pattern (tools, batch, agents) builds on Messages API. Understanding its request/response shape, token tracking, and error modes is the foundation of production Claude development.',
  how: 'Create an Anthropic client, call <code>client.messages.create()</code> with model, max_tokens, system, messages. The response includes <code>content</code> (text/tool blocks), <code>stop_reason</code>, and <code>usage</code> (input/output tokens).',
  analogy: 'A function call: you pass (prompt, config) and get back (answer, metadata). Except the function is a 200B-parameter neural network.',
  example: 'TicketFlow\'s first API call classifies "User can\'t log in" as <code>Authentication, High priority</code>. Input: 42 tokens, Output: 18 tokens.',
  walk: [
    'Import the <code>anthropic</code> library (pip install anthropic).',
    'Set <code>ANTHROPIC_API_KEY</code> environment variable (never hard-code).',
    'Create client: <code>client = anthropic.Anthropic()</code>.',
    'Call <code>client.messages.create(...)</code> with model, max_tokens, system, messages.',
    'Read <code>message.content[0].text</code> for the answer.',
    'Log <code>message.usage.input_tokens</code> and <code>output_tokens</code> for cost tracking.'
  ],
  arch: 'Your app → SDK client → Messages API (/v1/messages) → Claude model → response (content + usage).',
  when: 'Use Messages API for all Claude interactions: single-shot classification, chat, tool use, batch. It is the universal interface.',
  exam: 'Know the request shape (model, max_tokens, system, messages) and response shape (content, stop_reason, usage). Token tracking is essential for cost management.'
}) +

anim('messages_flow') +

'<h3>2.2 System prompts vs user messages</h3>' +
'<p>The exam tests the difference:</p>' +
tbl(['Aspect', 'System prompt', 'User message'], [
  ['Role', 'Defines assistant behavior, tone, rules', 'User\'s input/question for this turn'],
  ['Persistence', 'Static across conversation', 'Per-turn'],
  ['Format constraints', 'Output schema, JSON rules go here', 'Task-specific input goes here'],
  ['Best practice', 'Consolidate behavioral rules here', 'Keep focused on the user\'s request']
]) +
examNote('Common trap: scattering instructions across system + user. Consolidate behavior in system; user message is the task input.') +

'<h3>2.3 Model selection</h3>' +
tbl(['Model tier', 'Use when', 'TicketFlow example'], [
  ['Haiku (fast, cheap)', 'Straightforward classification, tight latency/cost budgets', 'Overnight batch classification'],
  ['Sonnet (balanced)', 'Most production workloads', 'Real-time ticket triage'],
  ['Opus (strongest)', 'Complex reasoning, rare edge cases', 'Escalation decision (invest vs refund)']
]) +
examNote('Exam asks: "tight latency + simple task" → Haiku. "Complex reasoning" → Opus. "Most workflows" → Sonnet.') +

kc('ch2'));

chapter('ch3', '3. AsyncAnthropic & production integration', 'core',
'<h2>TicketFlow: Week 2</h2>' +
'<p>Traffic is spiking. Your synchronous Flask service is blocking the event loop on every Claude call, and requests are timing out. The team needs concurrent ticket processing. You migrate to <code>AsyncAnthropic</code> and integrate it into the async Python stack.</p>' +

concept('3.1 AsyncAnthropic in async services', { ex: 'e02_async',
  what: 'AsyncAnthropic is the async variant of the Anthropic client. Every method is awaitable, allowing Claude calls to run concurrently on an async event loop without blocking.',
  why: 'Async services (FastAPI, aiohttp, async workers) must not block the event loop. Synchronous API calls freeze the entire server. AsyncAnthropic integrates natively with asyncio.',
  how: 'Import <code>AsyncAnthropic</code>, create the client, <code>await client.messages.create()</code>. Use <code>asyncio.gather()</code> to run multiple calls concurrently.',
  analogy: 'A restaurant kitchen: async lets you start 10 dishes concurrently and finish each when ready, instead of making one dish at a time while others wait.',
  example: 'TicketFlow processes 3 tickets concurrently with <code>asyncio.gather()</code>. Total latency: one API call duration, not three sequential calls.',
  arch: 'Async event loop schedules awaitable calls → multiple Claude requests in flight → gather() returns all results.',
  when: 'Always use AsyncAnthropic in async Python services (FastAPI, async workers). Use synchronous client only in sync contexts (Jupyter, scripts).',
  exam: 'Exam scenario: "async service blocking on Claude calls" → use AsyncAnthropic. Know that sync client blocks the event loop.'
}) +

anim('async_loop') +

'<h3>3.2 Secrets management</h3>' +
note('<b>Security rule:</b> API keys must never be committed to source code or checked into Git. Load from environment variables or a secrets manager (AWS Secrets Manager, GCP Secret Manager, HashiCorp Vault).') +
examNote('Exam trap: "Put keys in config file and commit it" is always wrong. Correct: secrets manager or env var loaded at runtime.') +

concept('3.3 SDK retry behavior', { ex: 'e07_retry',
  what: 'The Anthropic SDK automatically retries transient errors (HTTP 429 rate limits, 500/503 server errors, network timeouts) with exponential backoff up to <code>max_retries</code>.',
  why: 'Transient errors are common in distributed systems. Manual retry loops are error-prone. The SDK handles retries, backoff, and jitter for you.',
  how: 'Configure <code>max_retries</code> and <code>timeout</code> on client init. The SDK retries automatically. Catch <code>RateLimitError</code> when all retries are exhausted.',
  example: 'TicketFlow hits a 429 during peak traffic. SDK retries automatically with backoff. If all retries fail, <code>RateLimitError</code> is raised and logged.',
  when: 'Set <code>max_retries=3</code> (or higher) for production services. Log <code>RateLimitError</code> to monitor rate-limit frequency.',
  exam: 'Know that SDK retries 429/500/503 automatically. Exam asks: "Should you implement manual retry for 429?" → No, SDK handles it.'
}) +

anim('retry_backoff') +

'<h3>3.4 Error handling & categorization</h3>' +
tbl(['Error type', 'Severity', 'Action'], [
  ['RateLimitError (429)', 'Warn', 'Log, back off. Retries exhausted; try later.'],
  ['APITimeoutError', 'Warn', 'Retry or fail gracefully.'],
  ['AuthenticationError (401)', 'Critical', 'Page on-call. Invalid/missing API key.'],
  ['APIError (500/503)', 'Warn', 'Transient. SDK retries automatically.'],
  ['InvalidRequestError (400)', 'Error', 'Malformed request. Fix code.']
]) +
examNote('Exam asks: "How to route errors?" → Categorize by impact and recoverability. 429/500 = warn + retry. Auth failure = page on-call.') +

kc('ch3'));

chapter('ch4', '4. Batch API & cost management', 'core',
'<h2>TicketFlow: Week 3</h2>' +
'<p>Product wants overnight batch processing: classify 10,000 tickets that came in after hours. Real-time API would cost $X. Finance asks: can we cut that cost? You discover the Batch API: 50% savings for async workloads with flexible completion windows.</p>' +

concept('4.1 Batch API for async workloads', { ex: 'e03_batch',
  what: 'The Message Batches API processes large volumes of requests asynchronously at 50% lower token cost. You submit a batch (up to 10K requests), poll for completion (hours later), and retrieve results.',
  why: 'Non-interactive workloads (overnight jobs, backfills, bulk analysis) don\'t need instant responses. Batch API trades latency flexibility for massive cost savings.',
  how: '<code>client.messages.batches.create(requests=...)</code> submits batch. Poll <code>batches.retrieve(batch_id)</code> every 60s. When <code>processing_status == "ended"</code>, iterate <code>batches.results(batch_id)</code>.',
  analogy: 'Express shipping vs ground shipping. Express (realtime API) costs 2x, arrives instantly. Ground (batch) costs half, arrives tomorrow. Same product.',
  example: 'TicketFlow\'s overnight batch: 10K tickets submitted at 8pm, completed by 6am, 50% cheaper than realtime.',
  arch: 'App → batches.create() → queue → async processing → poll until ended → batches.results().',
  when: 'Use Batch API for: overnight jobs, backfills, non-interactive bulk work. Completion window: hours. Do NOT use for user-facing realtime responses.',
  exam: 'Exam scenario: "10K emails overnight, flexible window" → Batch API (50% savings). "User waiting for response" → realtime Messages API.'
}) +

anim('batch_flow') +

'<h3>4.2 Token tracking & cost projection</h3>' +
'<p>Every <code>message.usage</code> reports exact input/output tokens. Production apps must track this for cost management and budget forecasting.</p>' +

concept('4.3 Cost projection formula', {
  what: 'Cost = (request_volume × avg_input_tokens × input_price) + (request_volume × avg_output_tokens × output_price). Add batch discount (50%) or cache savings (90% on cached).',
  why: 'Finance needs cost forecasts before approving new features. Projections prevent budget overruns.',
  how: 'Log token usage per request → compute averages → multiply by pricing → scale by expected volume.',
  example: 'TicketFlow forecast: 10K tickets/day, 50 avg input, 20 avg output, Sonnet pricing = $X/day. Batch cuts it to $X/2.',
  when: 'Run projections before launching new features, scaling traffic, or migrating models.',
  exam: 'Exam asks: "Build cost model" → answer includes request volume, avg tokens, model pricing, and discounts (batch/cache).'
}) +

examNote('Exam trap: ignoring output tokens. Both input AND output tokens contribute to cost.') +

'<h3>4.4 Token tracking by feature</h3>' +
note('When costs grow, you need to know <i>which feature</i> is driving spend. Instrument token usage per endpoint/feature in your logs. Example: <code>{"feature": "classify", "input_tokens": 42, "output_tokens": 18}</code>.') +
examNote('Exam: "Costs growing, don\'t know why" → add per-feature token tracking to identify drivers before optimizing.') +

kc('ch4'));
