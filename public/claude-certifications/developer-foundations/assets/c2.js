/* Chapters 5-7: Caching, Tools, Format Drift */

chapter('ch5', '5. Prompt caching & multi-turn optimization', 'core',
'<h2>TicketFlow: Week 4</h2>' +
'<p>Agents are having multi-turn conversations with customers, and each turn re-sends the 20K-token TicketFlow knowledge base. Costs are spiking. You enable prompt caching: turn 1 pays full price, turn 2+ pay 90% less on the cached KB. Monthly costs drop by 85%.</p>' +

concept('5.1 Prompt caching mechanics', { ex: 'e04_cache',
  what: 'Prompt caching lets you mark static content (system prompt, KB, examples) for caching. First request pays full cost + small write fee. Subsequent requests within 5 minutes read cached tokens at 90% discount.',
  why: 'Multi-turn conversations and long static contexts (KB, examples, tool definitions) waste tokens being re-sent every turn. Caching cuts this cost massively.',
  how: 'Add <code>cache_control: {"type": "ephemeral"}</code> to system message blocks you want cached. First turn: cache miss (write). Next turns: cache hit (90% off).',
  analogy: 'A textbook: turn 1 reads the whole book (expensive). Turn 2+ flip to the bookmarked page (cheap). The book stays open for 5 minutes.',
  example: 'TicketFlow KB is 10K tokens. Turn 1: 10K input tokens at full price. Turn 2-10: 10K read from cache at 1/10th cost. Savings: 9K × 9 turns × price.',
  arch: 'Request 1 → cache miss → write KB to cache (5min TTL) → request 2 → cache hit → read at 90% discount.',
  when: 'Use caching for: long system prompts, knowledge bases, examples, tool definitions that stay static across turns. Re-send identical cached blocks each turn.',
  exam: 'Exam: "20K KB re-sent every turn, how to optimize?" → prompt caching with cache_control. Know the 90% discount and 5min TTL.'
}) +

anim('cache_hit') +

'<h3>5.2 Cache mechanics & TTL</h3>' +
tbl(['Aspect', 'Detail'], [
  ['Discount', '90% off cached input tokens (billed at 1/10th price)'],
  ['TTL', '5 minutes of inactivity'],
  ['Scope', 'Per model, per exact prefix'],
  ['Write fee', 'Small surcharge on cache_creation_input_tokens'],
  ['Refresh', 'Each cache hit extends TTL by 5 minutes']
]) +

examNote('Exam trap: assuming cache lasts forever. It expires after 5min of no use. Design for: frequent multi-turn conversations.') +

'<h3>5.3 Multi-turn cost optimization strategy</h3>' +
'<ol>' +
'<li>Identify static content (KB, system prompt, examples).</li>' +
'<li>Mark with <code>cache_control</code> in system message blocks.</li>' +
'<li>Ensure identical cached blocks are sent on every turn (no variation).</li>' +
'<li>Monitor <code>cache_creation_input_tokens</code> (miss) and <code>cache_read_input_tokens</code> (hit).</li>' +
'</ol>' +

kc('ch5'));

chapter('ch6', '6. Tool use & argument validation', 'core',
'<h2>TicketFlow: Week 5</h2>' +
'<p>Agents need to look up customer data mid-conversation. You define a <code>lookup_customer</code> tool with name, description, and JSON schema. Claude starts calling it automatically. But occasionally it sends malformed emails. You add argument validation to catch this before the DB query.</p>' +

concept('6.1 Tool use flow', { ex: 'e06_tools',
  what: 'Tool use lets Claude request actions (DB lookups, API calls, file operations) by emitting <code>tool_use</code> blocks. Your app executes the tool and returns a <code>tool_result</code>. Loop continues until Claude stops requesting tools.',
  why: 'LLMs alone can only produce text. Tools give them hands: read data, change state, call external services.',
  how: 'Define tools array with name, description, input_schema. Send to <code>messages.create(tools=...)</code>. Check <code>response.content</code> for <code>tool_use</code> blocks. Execute tool, append <code>tool_result</code> as user message. Repeat until <code>stop_reason == "end_turn"</code>.',
  analogy: 'A pilot requesting ground crew actions over radio. "Need fuel" → ground crew fuels → pilot acknowledges → continues flight.',
  example: 'TicketFlow agent: "Check status for alice@example.com" → Claude emits <code>lookup_customer</code> tool_use → you run DB query → return result → Claude synthesizes answer.',
  arch: 'Claude emits tool_use → your dispatcher executes → tool_result returned → appended to messages → next Claude turn.',
  when: 'Use tools when the model needs live data, external actions, or deterministic computation it cannot hallucinate correctly.',
  exam: 'Know the loop: tool_use → execute → tool_result → repeat. Exam asks: "Model keeps picking wrong tool" → fix description/schema, not max_tokens.'
}) +

anim('tool_loop') +

'<h3>6.2 Tool definition best practices</h3>' +
tbl(['Field', 'Best practice', 'Why'], [
  ['name', 'Short, descriptive, snake_case', 'Claude reads this to decide which tool'],
  ['description', 'Clear purpose + when to call it', 'Vague description = wrong tool picked'],
  ['input_schema', 'Strict JSON Schema with required fields', 'Loose schema = malformed arguments'],
  ['Return format', '{"content": [{"type": "text", "text": ...}]}', 'Standard tool_result shape']
]) +

examNote('Exam trap: "Tool keeps getting called at wrong time" → rewrite description. Schema alone does NOT drive when to call.') +

'<h3>6.3 Argument validation & error handling</h3>' +
note('<b>Critical:</b> JSON Schema validates <i>shape</i>, not business rules. Always add custom validation (e.g., email format, ID exists, amount > 0) in your dispatcher before executing.') +

'<p><b>Error handling pattern:</b></p>' +
'<ol>' +
'<li>Validate arguments against schema (SDK does this).</li>' +
'<li>Add custom business-rule checks (your code).</li>' +
'<li>If validation fails, return <code>tool_result</code> with error message (not exception).</li>' +
'<li>Claude sees error and adapts (retry, ask user, try different approach).</li>' +
'</ol>' +

examNote('Exam: "Tool call fails with invalid email" → validate arguments in your dispatcher, return error tool_result to Claude.') +

kc('ch6'));

chapter('ch7', '7. Format drift & context management', 'core',
'<h2>TicketFlow: Week 7</h2>' +
'<p>After 15 conversation turns, agents start returning malformed JSON. First few turns: perfect schema compliance. Turn 15: missing fields, wrong types. You identify the failure mode as <b>format drift</b>—context pollution diluting schema attention. Fix: output validation + context pruning.</p>' +

concept('7.1 Format drift', {
  what: 'Format drift is the gradual loss of output structure (e.g., JSON schema) over many conversation turns, caused by accumulated noisy context diluting the model\'s attention on the schema.',
  why: 'Multi-turn conversations fill the context window with tool outputs, previous responses, and metadata. Even if total tokens fit, the <i>relevant</i> schema constraint gets buried.',
  how: 'Detect: validate every output against schema. Mitigate: prune stale tool outputs, summarize verbose results, re-emphasize schema in later turns.',
  analogy: 'A whiteboard filling with notes. First hour: clean diagrams. Hour 10: board so crowded you can\'t see the original structure.',
  example: 'TicketFlow turn 1-5: valid JSON. Turn 10: schema still works. Turn 15: missing "priority" field. Cause: 20+ tool outputs diluted attention.',
  when: 'Monitor for drift in: long conversations, verbose tool outputs, >10 turns. Validate output at every turn.',
  exam: 'Exam: "JSON malformed after 15 turns, first turns worked" → format drift. Fix: validate + context management, NOT bigger model or temperature.'
}) +

anim('format_drift') +

'<h3>7.2 Context management strategies</h3>' +
tbl(['Pattern', 'When to use', 'TicketFlow example'], [
  ['Pruning', 'Remove stale tool outputs no longer needed', 'Drop turn-5 tool output at turn 10'],
  ['Summarization', 'Replace verbose outputs with summaries', '"3 API calls succeeded" instead of full JSON'],
  ['Chunking', 'Split large docs into smaller pieces', 'Process 50-page contract in 5-page chunks'],
  ['Re-emphasize', 'Repeat schema constraints in later turns', 'Turn 10: add "IMPORTANT: return valid JSON" to user message']
]) +

examNote('Exam trap: "context window large enough, still losing quality" → context ROT, not overflow. Fix: prune/summarize, not bigger window.') +

'<h3>7.3 Temperature does NOT fix context issues</h3>' +
note('<b>Common misconception:</b> "Lower temperature will fix format drift or context overflow." FALSE. Temperature controls output randomness, not context capacity or attention. Context issues require context management (pruning, chunking), not parameter tweaks.') +

examNote('Exam: "Context window full, junior dev suggests changing temperature" → explain temperature is unrelated; use chunking/summarization.') +

'<h3>7.4 Whole-document vs chunking trade-off</h3>' +
tbl(['Approach', 'Strength', 'Weakness', 'When to choose'], [
  ['Whole-document', 'Cross-section reasoning, global synthesis', 'Citation drift in long docs, fills context', 'Fits in window + reasoning matters more than citation precision'],
  ['Chunking', 'Strong per-chunk citations, scalable', 'Loses cross-chunk synthesis', 'Long docs where citation accuracy is critical']
]) +

examNote('Exam asks: "Contract fits in window but citations drift at end" vs "chunked loses cross-section reasoning." Answer depends on which property the use case values.') +

kc('ch7'));
