/* Output notes for code examples */
window.OUTNOTES = {};
window.OUTNOTES['e01_rbac_rag'] = [
  ['procedure codes billed', 'Only billing-related documents were retrieved. Clinical diagnosis notes (category="diagnosis") were filtered out at the retrieval layer because the user (billing_clerk_22) has permissions=["billing", "demographics"].'],
  ['[Billing-2025-06-10]', 'Citations reference the source document ID. The response is grounded in retrieved content.'],
  ['Cache: 0 read, 1847 write', 'First request: cache miss (0 read), cache write (1847 tokens = system prompt + context). Subsequent requests within ~5 min would show 1847 read, 0 write (90% cost savings).']
];

window.OUTNOTES['e02_hipaa_config'] = [
  ['Tier: ENTERPRISE', 'Claude Enterprise is required for HIPAA BAA eligibility.'],
  ['BAA status: SIGNED', 'Business Associate Agreement with Anthropic executed.'],
  ['ZDR: ENABLED', 'Zero Data Retention - PHI is processed transiently but not retained by Anthropic.'],
  ['Audit retention: 2555 days', '7 years of audit logs (HIPAA requirement) showing who accessed which patient\'s PHI.'],
  ['Guardrails: 3 layers', 'Prompt-level out-of-scope definitions + output classifier + tool hooks (defense in depth).']
];

window.OUTNOTES['e03_observability'] = [
  ['correlation_id', 'Same UUID across all three spans (gateway, retrieval, model). Querying by this ID reconstructs the full distributed trace.'],
  ['model_version', 'Exact model version (claude-sonnet-4-20250610) captured on the model span. Critical for isolating regressions caused by model updates.'],
  ['cache_read_tokens: 3200', 'Prompt caching in effect: 3200 tokens read from cache (cheaper, faster prefill). Cache write would appear on the first request.'],
  ['cost_usd: 0.047', 'Per-request cost estimate: (4820 input - 3200 cached) × $3/M + 3200 × $0.30/M + 340 output × $15/M = ~$0.047.']
];

window.OUTNOTES['e04_cost_model'] = [
  ['Baseline: $66,000', 'All Sonnet, no caching. 8k avg input × $3/M + 600 output × $15/M = $0.033/session × 2M = $66k/year.'],
  ['Optimized: $20,640', 'Prompt caching (3k-token system prompt cached) + tiered routing (60% Haiku, 40% Sonnet). Blended cost: $0.0103/session.'],
  ['Savings: $45,360 (68.7%)', 'Caching cuts the 45% static-preamble cost by ~90%. Tiered routing sends 60% of traffic to Haiku (12× cheaper than Sonnet). Combined: 68.7% savings.']
];
