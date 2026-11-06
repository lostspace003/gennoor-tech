/* Animation specs */
(function () {
  function n(id, label, sub, x, y) { return { id: id, label: label, sub: sub, x: x, y: y }; }
  function st(on, edge, text) { return { on: on, edge: edge, text: text }; }
  var A = {};

  A.messages_flow = { title: 'Messages API request/response anatomy', vb: [0, 0, 900, 300],
    nodes: [n('app', 'Your app', 'Python/TS', 80, 150), n('sdk', 'SDK client', 'anthropic lib', 250, 150), n('api', 'Messages API', 'Claude', 450, 150), n('res', 'Response', 'usage + content', 680, 150)],
    edges: [['app', 'sdk'], ['sdk', 'api', 'POST /messages'], ['api', 'res'], ['res', 'app']],
    steps: [
      st(['app'], null, 'Your app constructs model, max_tokens, system, messages.'),
      st(['sdk'], ['app', 'sdk'], 'SDK formats request, adds auth header with API key.'),
      st(['api'], ['sdk', 'api'], 'Request sent to Anthropic Messages API.'),
      st(['res'], ['api', 'res'], 'API returns: content blocks, stop_reason, usage (input/output tokens).'),
      st(['app'], ['res', 'app'], 'Your app reads content[0].text and logs token usage.')]};

  A.async_loop = { title: 'AsyncAnthropic in event loop', vb: [0, 0, 900, 300],
    nodes: [n('ev', 'Event loop', 'asyncio', 80, 150), n('t1', 'classify(t1)', 'awaitable', 280, 60), n('t2', 'classify(t2)', 'awaitable', 280, 150), n('t3', 'classify(t3)', 'awaitable', 280, 240), n('api', 'Claude API', '3 concurrent calls', 550, 150), n('out', 'Results', 'gathered', 780, 150)],
    edges: [['ev', 't1'], ['ev', 't2'], ['ev', 't3'], ['t1', 'api'], ['t2', 'api'], ['t3', 'api'], ['api', 'out']],
    steps: [
      st(['ev'], null, 'Event loop schedules async tasks without blocking.'),
      st(['t1', 't2', 't3'], ['ev', 't1'], 'Three classify() coroutines created (not yet run).'),
      st(['api'], [['t1', 'api'], ['t2', 'api'], ['t3', 'api']], 'asyncio.gather() schedules all three. They run concurrently.'),
      st(['out'], ['api', 'out'], 'All responses return. gather() returns the list of results.')]};

  A.retry_backoff = { title: 'SDK retry logic on 429', vb: [0, 0, 900, 300],
    nodes: [n('app', 'Your app', 'client.messages', 80, 150), n('sdk', 'SDK', 'retry loop', 280, 150), n('api', 'API', 'rate limited', 480, 60), n('ok', 'Success', 'response', 680, 150), n('err', 'RateLimitError', 'exhausted retries', 480, 240)],
    edges: [['app', 'sdk'], ['sdk', 'api', 'attempt 1'], ['api', 'sdk', '429'], ['sdk', 'api', 'retry'], ['api', 'ok', '200'], ['ok', 'app'], ['sdk', 'err']],
    steps: [
      st(['app', 'sdk'], ['app', 'sdk'], 'Your code calls client.messages.create().'),
      st(['api'], ['sdk', 'api'], 'Attempt 1: API returns HTTP 429 (rate limit).'),
      st(['sdk'], ['api', 'sdk'], 'SDK catches 429, waits with exponential backoff, retries.'),
      st(['ok'], [['sdk', 'api'], ['api', 'ok']], 'Retry succeeds: HTTP 200. Response returned.'),
      st(['err'], ['sdk', 'err'], 'If all retries fail, SDK raises RateLimitError.')]};

  A.batch_flow = { title: 'Batch API workflow', vb: [0, 0, 900, 300],
    nodes: [n('app', 'Your app', 'overnight job', 80, 150), n('sub', 'Submit batch', 'batches.create', 250, 150), n('q', 'Queue', 'processing', 420, 150), n('poll', 'Poll status', 'in_progress', 580, 60), n('done', 'Retrieve', 'results', 750, 150)],
    edges: [['app', 'sub'], ['sub', 'q'], ['q', 'poll'], ['poll', 'q', 'wait'], ['q', 'done'], ['done', 'app']],
    steps: [
      st(['app', 'sub'], ['app', 'sub'], 'Submit batch of requests with custom_ids.'),
      st(['q'], ['sub', 'q'], 'Batch queued. Returns batch_id and status immediately.'),
      st(['poll'], ['q', 'poll'], 'Poll batches.retrieve() every 60s.'),
      st(['q'], ['poll', 'q'], 'While in_progress, keep polling.'),
      st(['done'], ['q', 'done'], 'Status: ended. Retrieve results via batches.results().'),
      st(['app'], ['done', 'app'], 'Results matched by custom_id. 50% cost savings.')]};

  A.cache_hit = { title: 'Prompt caching: miss vs hit', vb: [0, 0, 900, 300],
    nodes: [n('kb', 'Knowledge base', '10K tokens', 80, 150), n('r1', 'Request 1', 'cache_control', 280, 60), n('miss', 'Cache miss', 'full cost', 480, 60), n('cache', 'Cache', '5min TTL', 680, 150), n('r2', 'Request 2', 'same KB', 280, 240), n('hit', 'Cache hit', '90% off', 480, 240)],
    edges: [['kb', 'r1'], ['r1', 'miss'], ['miss', 'cache'], ['kb', 'r2'], ['r2', 'hit'], ['hit', 'cache']],
    steps: [
      st(['r1'], ['kb', 'r1'], 'Request 1: KB marked with cache_control.'),
      st(['miss'], ['r1', 'miss'], 'Cache miss: full input cost + cache write fee.'),
      st(['cache'], ['miss', 'cache'], '10K tokens cached for 5 minutes.'),
      st(['r2'], ['kb', 'r2'], 'Request 2: same KB with cache_control.'),
      st(['hit'], ['r2', 'hit'], 'Cache hit: 90% discount on those 10K tokens.'),
      st(['cache'], ['hit', 'cache'], 'Cached tokens read at 1/10th cost.')]};

  A.tool_loop = { title: 'Tool use round-trip', vb: [0, 0, 900, 300],
    nodes: [n('c', 'Claude', 'reasoning', 80, 150), n('tu', 'tool_use', 'JSON block', 280, 60), n('app', 'Your app', 'dispatcher', 480, 60), n('exec', 'Tool exec', 'DB/API call', 680, 60), n('tr', 'tool_result', 'back to Claude', 480, 240), n('ans', 'Answer', 'synthesis', 280, 240)],
    edges: [['c', 'tu'], ['tu', 'app'], ['app', 'exec'], ['exec', 'tr'], ['tr', 'c'], ['c', 'ans']],
    steps: [
      st(['c', 'tu'], ['c', 'tu'], 'Claude emits tool_use with name + input.'),
      st(['app'], ['tu', 'app'], 'Your dispatcher receives tool_use block.'),
      st(['exec'], ['app', 'exec'], 'Validate arguments, execute tool (DB lookup, API call).'),
      st(['tr'], ['exec', 'tr'], 'Return tool_result (or is_error).'),
      st(['c'], ['tr', 'c'], 'Result fed back to Claude in next turn.'),
      st(['ans'], ['c', 'ans'], 'Claude synthesizes final answer from tool output.')]};

  A.schema_validate = { title: 'Structured output validation pipeline', vb: [0, 0, 900, 300],
    nodes: [n('c', 'Claude', 'generates JSON', 80, 150), n('raw', 'Raw output', 'text block', 250, 150), n('parse', 'JSON parse', 'json.loads', 420, 60), n('valid', 'Schema valid', 'jsonschema', 590, 60), n('use', 'Use data', 'typed dict', 760, 60), n('retry', 'Retry/fallback', 'malformed', 420, 240)],
    edges: [['c', 'raw'], ['raw', 'parse'], ['parse', 'valid'], ['valid', 'use'], ['parse', 'retry']],
    steps: [
      st(['c', 'raw'], ['c', 'raw'], 'Claude returns JSON in text block.'),
      st(['parse'], ['raw', 'parse'], 'json.loads() parses string.'),
      st(['retry'], ['parse', 'retry'], 'If JSONDecodeError, log and retry with schema in prompt.'),
      st(['valid'], ['parse', 'valid'], 'jsonschema.validate(data, SCHEMA) checks shape.'),
      st(['use'], ['valid', 'use'], 'Validation passed: downstream code trusts typed data.')]};

  A.format_drift = { title: 'Format drift over turns', vb: [0, 0, 900, 300],
    nodes: [n('t1', 'Turn 1', 'valid JSON', 80, 60), n('t5', 'Turn 5', 'still valid', 280, 60), n('t10', 'Turn 10', 'losing shape', 480, 60), n('t15', 'Turn 15', 'malformed', 680, 60), n('ctx', 'Context rot', 'noisy history', 380, 240)],
    edges: [['t1', 't5'], ['t5', 't10'], ['t10', 't15'], ['t10', 'ctx']],
    steps: [
      st(['t1'], null, 'First few turns: clean JSON output.'),
      st(['t5'], ['t1', 't5'], 'Mid-conversation: format still held.'),
      st(['t10'], ['t5', 't10'], 'After 10+ turns: context fills, format starts drifting.'),
      st(['ctx'], ['t10', 'ctx'], 'Cause: noisy tool outputs dilute schema attention.'),
      st(['t15'], ['t10', 't15'], 'Turn 15: malformed JSON. Validation catches it.')]};

  A.checkpoint_resume = { title: 'Checkpointing & resume', vb: [0, 0, 900, 300],
    nodes: [n('s1', 'Step 1', 'classify', 80, 150), n('ck1', 'Checkpoint', 'state saved', 250, 60), n('s2', 'Step 2', 'resolve', 420, 150), n('crash', 'Worker crash', 'process dies', 590, 240), n('resume', 'Resume', 'load checkpoint', 760, 150)],
    edges: [['s1', 'ck1'], ['ck1', 's2'], ['s2', 'crash'], ['crash', 'resume'], ['resume', 's2']],
    steps: [
      st(['s1', 'ck1'], [['s1', 'ck1']], 'After step 1, save state to disk (JSON file).'),
      st(['s2'], ['ck1', 's2'], 'Proceed to step 2.'),
      st(['crash'], ['s2', 'crash'], 'Worker crashes mid-step.'),
      st(['resume'], ['crash', 'resume'], 'On restart, load checkpoint.'),
      st(['s2'], ['resume', 's2'], 'Resume from step 2, not from scratch.')]};

  A.orchestrator = { title: 'Multi-agent orchestrator pattern', vb: [0, 0, 900, 300],
    nodes: [n('orch', 'Orchestrator', 'plan + delegate', 80, 150), n('a1', 'Classify agent', 'fast model', 300, 60), n('a2', 'Resolve agent', 'tools', 300, 150), n('a3', 'Escalate agent', 'human loop', 300, 240), n('merge', 'Merge results', 'orchestrator', 600, 150), n('out', 'Final output', 'combined', 800, 150)],
    edges: [['orch', 'a1'], ['orch', 'a2'], ['orch', 'a3'], ['a1', 'merge'], ['a2', 'merge'], ['a3', 'merge'], ['merge', 'out']],
    steps: [
      st(['orch'], null, 'Orchestrator decomposes task into sub-tasks.'),
      st(['a1', 'a2', 'a3'], [['orch', 'a1'], ['orch', 'a2'], ['orch', 'a3']], 'Delegates to specialized agents (can run in parallel).'),
      st(['merge'], [['a1', 'merge'], ['a2', 'merge'], ['a3', 'merge']], 'Each agent returns result; orchestrator collects.'),
      st(['out'], ['merge', 'out'], 'Orchestrator synthesizes final answer.')]};

  A.workflow_agent = { title: 'Workflow + agent hybrid', vb: [0, 0, 900, 300],
    nodes: [n('std', 'Standard path', 'deterministic', 80, 150), n('ext', 'Extract', 'rule-based', 220, 150), n('val', 'Validate', 'schema check', 360, 150), n('dec', 'Decision point', 'unexpected?', 500, 150), n('agent', 'Agent', 'flexible reasoning', 650, 60), n('done', 'Done', 'output', 800, 150)],
    edges: [['std', 'ext'], ['ext', 'val'], ['val', 'dec'], ['dec', 'agent', 'yes'], ['dec', 'done', 'no'], ['agent', 'done']],
    steps: [
      st(['std', 'ext'], [['std', 'ext']], 'Standard invoice: deterministic extraction (cheap, reliable).'),
      st(['val'], ['ext', 'val'], 'Schema validation (rule-based).'),
      st(['dec'], ['val', 'dec'], 'Decision point: is format unexpected?'),
      st(['done'], ['dec', 'done'], 'No: standard path completes.'),
      st(['agent'], ['dec', 'agent'], 'Yes: invoke agent for flexible reasoning.'),
      st(['done'], ['agent', 'done'], 'Agent decides: re-route, escalate, or flag.')]};

  A.hook_intercept = { title: 'PreToolUse hook interception', vb: [0, 0, 900, 300],
    nodes: [n('tu', 'tool_use', 'Bash("rm -rf")', 80, 150), n('hook', 'PreToolUse hook', 'check_bash.js', 300, 150), n('deny', 'Deny', 'blocked', 520, 60), n('allow', 'Allow', 'safe cmd', 520, 240), n('exec', 'Execute', 'runs', 720, 240)],
    edges: [['tu', 'hook'], ['hook', 'deny'], ['hook', 'allow'], ['allow', 'exec']],
    steps: [
      st(['tu', 'hook'], [['tu', 'hook']], 'Claude emits tool_use. Hook fires BEFORE execution.'),
      st(['deny'], ['hook', 'deny'], 'Hook inspects: "rm -rf" found. Return deny decision.'),
      st(['allow'], ['hook', 'allow'], 'Hook inspects: safe command. Return {} (no objection).'),
      st(['exec'], ['allow', 'exec'], 'Safe command executes.')]};

  A.injection_defense = { title: 'Prompt injection isolation', vb: [0, 0, 900, 300],
    nodes: [n('inp', 'Untrusted input', 'user ticket', 80, 150), n('tag', 'Tag as data', '<user_ticket>', 280, 150), n('sys', 'System prompt', 'UNTRUSTED warning', 480, 60), n('claude', 'Claude', 'treats as data', 680, 150), n('out', 'Output', 'real issue only', 850, 150)],
    edges: [['inp', 'tag'], ['tag', 'sys'], ['sys', 'claude'], ['claude', 'out']],
    steps: [
      st(['inp'], null, 'User input may contain "Ignore previous instructions...".'),
      st(['tag'], ['inp', 'tag'], 'Wrap in <user_ticket> tags to delimit boundary.'),
      st(['sys'], ['tag', 'sys'], 'System prompt warns: UNTRUSTED USER DATA, do not follow.'),
      st(['claude'], ['sys', 'claude'], 'Claude processes ticket as passive data, not commands.'),
      st(['out'], ['claude', 'out'], 'Output: real issue classified, injection ignored.')]};

  window.ANIMS = A;
})();
