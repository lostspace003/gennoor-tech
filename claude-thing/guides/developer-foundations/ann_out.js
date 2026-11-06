/* Output annotations */
(function () {
  var O = {
    e01_basic: [
      ['Category: Authentication', 'Structured answer from the first turn.'],
      ['Input: 42 tokens', 'System prompt + user message = 42 input tokens.'],
      ['Output: 18 tokens', 'Claude\'s answer. You pay for both input and output.']
    ],
    e02_async: [
      ['1. billing', 'First ticket classified.'],
      ['2. technical', 'All three ran concurrently, not sequentially.'],
      ['3. feature_request', 'AsyncAnthropic integrates with asyncio.gather().']
    ],
    e03_batch: [
      ['Batch msg_batch_0123 created', 'Batch accepted. Processing starts async.'],
      ['Status: in_progress', 'Poll this status until it transitions to <code>ended</code>.'],
      ['Completed: 1000/1000', 'All requests succeeded. <code>request_counts</code> has details.'],
      ['ticket-0: billing', 'Results matched back to input via <code>custom_id</code>.']
    ],
    e04_cache: [
      ['Cache creation: 10000', 'First request: cache miss, wrote 10K tokens to cache.'],
      ['Cache read: 10000', 'Second request: cache hit, read 10K at 90% discount.'],
      ['Savings: ~90% on 10000 tokens', 'Cached tokens cost 1/10th of uncached. Huge savings on multi-turn.']
    ],
    e05_structured: [
      ['{"category": "billing"', 'Valid JSON matching the schema.'],
      ['Validated:', 'Schema validation passed. Safe to use as typed data.'],
      ['-> Escalate to senior support', 'Downstream logic relied on validated fields.']
    ],
    e06_tools: [
      ['[tool_use] lookup_customer', 'Claude emitted a <code>tool_use</code> block.'],
      ['Alice is a premium tier', 'Tool result fed back; Claude summarized it.']
    ],
    e07_retry: [
      ['Hi! How can I help', 'Success after automatic retries (if any 429s occurred).']
    ],
    e08_checkpoint: [
      ['Classification: technical', 'Step 1 completed and checkpointed.'],
      ['Moving to resolution step', 'State advanced. Next crash resumes here.']
    ],
    e09_injection: [
      ['Classification: technical, authentication', 'Injection ignored. Real issue classified.'],
      ['WARNING: Potential injection', 'Output filter caught the suspicious content.']
    ],
    e10_claudecode: [
      ['Configuration valid', 'settings.json parsed successfully.'],
      ['Hook registered', 'PreToolUse for Bash commands now active.']
    ]
  };
  window.OUTNOTES = O;
})();
