/* Code annotations */
window.ANN = {};
function AN(n, out, a) { window.ANN[n] = { out: out, a: a }; }

AN('e01_basic', 'TicketFlow\'s first Claude call: 42 input tokens, 18 output. This is the foundation every other pattern builds on.', [
  ['import anthropic', '📦 The official SDK', 'Install with <code>pip install anthropic</code>. Handles auth, retries, parsing.'],
  ['os.environ["ANTHROPIC_API_KEY"]', '🔑 Never hard-code keys', 'Load from environment or secrets manager. This mock key is for the example only.'],
  ['client = anthropic.Anthropic()', '🔌 Create the client', 'Reads API key from <code>ANTHROPIC_API_KEY</code> env var by default.'],
  ['model="claude-sonnet-4-5"', '🧠 Choose the model', 'Sonnet 4.5 balances quality and cost. Haiku is faster/cheaper, Opus is strongest.'],
  ['max_tokens=1024', '⚖️ Cap output length', 'Prevents runaway token costs. Adjust based on expected response size.'],
  ['system="You are TicketFlow', '📋 Role and behavior', 'System prompt sets the assistant\'s role, tone, and rules. Persistent across the conversation.'],
  ['messages=[', '💬 The conversation', 'List of user/assistant messages. First call: one user message.'],
  ['message.usage.input_tokens', '📊 Token tracking', 'Every response reports exact input/output tokens. Use this for cost tracking and projections.']
]);

AN('e02_async', 'Three tickets classified concurrently. AsyncAnthropic integrates naturally with async Python event loops.', [
  ['import asyncio', '🔄 Async runtime', 'Python\'s built-in async/await support.'],
  ['client = anthropic.AsyncAnthropic()', '⚡ Async client', 'Use <code>AsyncAnthropic</code> in async contexts. Every method is awaitable.'],
  ['await client.messages.create', '⏸️ Awaitable API call', 'Does not block the event loop while waiting for the response.'],
  ['tasks = [classify_ticket', '📋 Concurrent work', 'Build a list of coroutines (not yet running).'],
  ['await asyncio.gather(*tasks)', '🚀 Run concurrently', '<code>gather</code> schedules all tasks together and waits for all to complete.']
]);

AN('e03_batch', 'Overnight batch of 1000 classifications at 50% cost savings. Flexible completion window = huge discount.', [
  ['requests = [', '📦 Batch payload', 'List of individual Messages API requests, each with a <code>custom_id</code>.'],
  ['"custom_id": f"ticket-{i}"', '🏷️ Track each request', 'Your unique ID to match results back to inputs.'],
  ['client.messages.batches.create', '🚀 Submit batch', 'Returns immediately. Processing happens async; poll for status.'],
  ['batch.processing_status', '⏳ Check progress', 'Statuses: <code>in_progress</code>, <code>ended</code>. Poll every 60s.'],
  ['client.messages.batches.results', '📥 Retrieve outputs', 'Iterate over results once batch completes. Match by <code>custom_id</code>.']
]);

AN('e04_cache', 'Request 2 re-used 10K cached tokens at 90% discount. Multi-turn cost optimization in action.', [
  ['KNOWLEDGE_BASE =', '📚 Static context', 'Long document/KB that stays the same across requests.'],
  ['"cache_control": {"type": "ephemeral"}', '💾 Cache this block', 'Marks the text for caching. Lasts 5 minutes.'],
  ['cache_creation_input_tokens', '💰 First request cost', 'Cache miss: full input cost + small cache write surcharge.'],
  ['cache_read_input_tokens', '🎉 Cache hit!', 'Cached tokens billed at 90% discount (1/10th the cost).'],
  ['message2.usage.cache_read', '📊 Savings proof', '10K tokens read from cache instead of re-sent at full price.']
]);

AN('e05_structured', 'JSON schema validation caught format issues. Typed data goes straight to downstream logic—no parsing fragility.', [
  ['SCHEMA = {', '📐 Define the shape', 'JSON Schema lists fields, types, enums, and constraints.'],
  ['"enum": ["billing", "technical"', '🎯 Constrain values', 'Limits category to known options. Downstream code trusts it.'],
  ['"required": ["category"', '✅ Mandatory fields', 'Schema validation fails if these are missing.'],
  ['json.loads(raw_output)', '🧪 Parse JSON', 'Throws <code>JSONDecodeError</code> if malformed.'],
  ['use jsonschema.validate', '🛡️ Validate schema', 'Use <code>jsonschema</code> library in production to enforce the shape.'],
  ['if data["priority"] == "urgent"', '⚙️ Use typed data', 'No regex, no guessing. Downstream logic works with validated structure.']
]);

AN('e06_tools', 'Tool use loop: Claude requested <code>lookup_customer</code>, we executed it, result fed back. Loop continues until <code>end_turn</code>.', [
  ['tools = [', '🧰 Tool definitions', 'List of available tools, each with name, description, and input schema.'],
  ['"description": "Get customer', '📖 Claude reads this', 'Clear description drives tool selection. Vague = wrong tool picked.'],
  ['"input_schema":', '📋 Typed inputs', 'JSON Schema for the tool\'s arguments. SDK validates before calling.'],
  ['def execute_tool(tool_name, tool_input)', '⚙️ Your dispatcher', 'Called when Claude emits <code>tool_use</code>. Validate, run, return result.'],
  ['if "@" not in tool_input.get("email"', '🛡️ Validate arguments', 'Schema alone is not enough; check business rules.'],
  ['response.stop_reason == "end_turn"', '🏁 Loop exit', 'Claude finished and has no more tool requests.'],
  ['if block.type == "tool_use"', '🔍 Detect tool requests', 'Each <code>tool_use</code> block names a tool and provides JSON input.'],
  ['messages.append({"role": "user", "content": tool_results})', '🔄 Feed results back', 'Tool results return to Claude as a user message. Loop repeats.']
]);

AN('e07_retry', 'SDK handled transient errors automatically with exponential backoff. No manual retry loop needed.', [
  ['max_retries=3', '🔁 Automatic retries', 'SDK retries HTTP 429, 500, 503 up to 3 times with backoff.'],
  ['timeout=30.0', '⏱️ Request timeout', '30s limit per individual request attempt.'],
  ['except anthropic.RateLimitError', '⛔ All retries exhausted', 'Raised after max_retries on persistent 429. Back off and try later.'],
  ['except anthropic.APITimeoutError', '⏰ Timeout', 'Request took longer than <code>timeout</code> seconds.'],
  ['except anthropic.APIError', '❌ Catch-all', 'Other API errors (auth, invalid request, etc.).']
]);

AN('e08_checkpoint', 'State saved after each step. If the worker crashes, next run resumes from the saved checkpoint.', [
  ['self.state_file = f"checkpoint_', '💾 Persistent state', 'JSON file holding current step and message history.'],
  ['def load_checkpoint(self)', '🔄 Resume on restart', 'Reload state if file exists; start fresh otherwise.'],
  ['{"step": "classify"', '🚦 Step tracking', 'State machine: classify → resolve → close.'],
  ['self.state["messages"].append', '📜 Accumulate history', 'Each turn appends to the conversation list.'],
  ['self.save_checkpoint()', '✅ Commit after each step', 'Write to disk after every Claude call. Resume here if crash.']
]);

AN('e09_injection', 'Tagging untrusted input as data prevented the injection. Model classified the real issue, ignored the malicious instruction.', [
  ['user_ticket = """Ignore previous', '🚨 Injection attempt', 'Untrusted user input containing an attack.'],
  ['# system="Process this ticket: {user_ticket}"', '❌ VULNERABLE', 'Embedding untrusted input directly lets it execute as instructions.'],
  ['IMPORTANT: The ticket content is UNTRUSTED', '🛡️ Explicit warning', 'System prompt tells Claude to treat ticket as data, not commands.'],
  ['"<user_ticket>\\n{user_ticket}\\n</user_ticket>"', '🏷️ Tag as data', 'XML-style delimiters mark the boundary. Treat as passive text.'],
  ['if "email" in response_text.lower()', '🔍 Output filter', 'Additional check: block suspicious outputs mentioning email addresses.']
]);

AN('e10_claudecode', 'Settings.json wired a PreToolUse hook that blocks destructive Bash commands before they run. Deterministic safety.', [
  ['hooks": {', '🎣 Lifecycle callbacks', 'Claude Code hooks intercept events like PreToolUse, PostToolUse.'],
  ['"matcher": "Bash"', '🎯 Target specific tool', 'This hook fires only for Bash commands.'],
  ['"script": "./hooks/check_bash.js"', '📝 External script', 'JavaScript file that inspects the command.'],
  ['module.exports = async ({ tool_input })', '⚙️ Hook handler', 'Receives tool name and input. Return deny to block.'],
  ['if (cmd.includes(\'rm -rf\')', '🛡️ Deterministic check', 'Code enforcement, not prompt suggestion. Cannot be bypassed.'],
  ['permissionDecision: \'deny\'', '⛔ Block execution', 'Tool never runs. Claude is told why and adapts.']
]);
