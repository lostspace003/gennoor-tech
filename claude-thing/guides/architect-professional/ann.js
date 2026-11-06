/* Annotations for code examples */
window.ANN = {};
function AN(n, out, a) { window.ANN[n] = { out: out, a: a }; }

AN('e01_rbac_rag', 'The billing clerk sees only billing-related documents; clinical diagnosis notes were filtered out at the retrieval layer. Cache tokens: 0 read (first request), 1847 write (system prompt + context cached for future requests).', [
  ['def get_user_permissions', '🔐 Identity resolution', 'In production, resolve from SSO/OAuth. The user_id maps to a list of allowed document categories (e.g., clinical staff see diagnosis/treatment; billing staff see only billing/demographics).'],
  ['def retrieve_with_rbac', '🚪 RBAC enforcement point', 'CRITICAL: RBAC is enforced HERE, at the retrieval layer, BEFORE any content enters the prompt. The vector DB query includes a filter: WHERE document.category IN user.permissions. Unauthorized documents never leave the database.'],
  ['permissions = get_user_permissions', '🎫 Per-user scoped access', 'Each user\'s permissions are resolved from their identity. No shared API keys; each request carries the user\'s identity.'],
  ['filter={"category": {"$in": permissions}}', '📋 ACL filter at the query', 'The filter is applied at the vector DB query (not post-retrieval). Only authorized passages are returned to the prompt constructor.'],
  ['system_prompt = """You are', '📦 Cacheable system prefix', 'The static system prompt is marked with cache_control. On subsequent requests within ~5 minutes, it is read from cache at ~10% of input token cost.'],
  ['"cache_control": {"type": "ephemeral"}', '💾 Prompt caching enabled', 'Both the system prompt and the retrieved context are cached. First request writes to cache; subsequent requests read from cache (cheaper, faster prefill).'],
  ['cache_read_input_tokens', '📊 Cache metrics', 'First request: 0 read (nothing cached yet), 1847 write (system + context). Subsequent requests would show ~1847 read, 0 write (90% cost savings on those tokens).']
]);

AN('e02_hipaa_config', 'Configuration validated for HIPAA compliance. All four controls in place: Enterprise tier (BAA-eligible), signed BAA, ZDR enabled, and 7-year audit retention.', [
  ['tier: enterprise', '🏥 HIPAA-eligible tier', 'Claude Enterprise is required for BAA eligibility. Consumer tiers (Pro, Team) do not offer BAAs.'],
  ['baa_signed: true', '📜 Business Associate Agreement', 'Legal contract making Anthropic liable for HIPAA safeguards. Required for any vendor processing PHI on behalf of a covered entity.'],
  ['zdr_enabled: true', '🚫 Zero Data Retention', 'Anthropic does not log or retain prompts/responses containing PHI. Satisfies HIPAA\'s minimum-necessary and use-limitation rules.'],
  ['log_retention_days: 2555', '📝 7-year audit trail', 'HIPAA requires covered entities to retain audit logs (who accessed which patient\'s PHI, when) for 7 years (2555 days).'],
  ['secret_store: azure-key-vault', '🔑 Secrets never in prompt', 'Credentials are resolved from Azure Key Vault at tool execution time. They never appear in the prompt context (defense against leakage and injection).'],
  ['sso_provider: entra-id', '🎫 Per-user authentication', 'Users authenticate via SSO (Entra ID); each request carries the user\'s scoped token, not a shared API key. Enables attribution and least privilege.'],
  ['enforcement_point: retrieval', '🚧 RBAC at retrieval layer', 'Access control is enforced at the retrieval layer, BEFORE content enters the prompt. The ACL source (postgres) maps user_id → allowed document categories.'],
  ['layers:', '🛡️ Layered guardrails', 'Three layers: prompt-level out-of-scope definitions, output classifier blocking unsafe content, and tool gates (hooks) for audit and validation. Defense in depth.']
]);

AN('e03_observability', 'Three spans exported to the tracing backend, all sharing the same correlation_id. Querying by correlation_id reconstructs the full request flow: gateway → retrieval → model. Model version (claude-sonnet-4-20250610) captured on span-003.', [
  ['correlation_id = str(uuid.uuid4())', '🔗 Correlation ID generation', 'A unique ID (UUID) generated at the gateway when the request enters. Propagated to every downstream service and logged with every span.'],
  ['correlation_id=correlation_id', '📡 Propagate across services', 'Every span includes the same correlation_id. This allows the tracing backend to link spans from different services (gateway, retrieval, agent, tool servers) into one distributed trace.'],
  ['model_id="claude-sonnet-4"', '🤖 Model identity capture', 'The model ID and version are captured from the API response metadata and logged with the span. Critical for correlating regressions with model updates.'],
  ['model_version="claude-sonnet-4-20250610"', '📅 Model version tracking', 'The exact model version (date-stamped) is logged. If accuracy drops on June 11, logs can isolate requests served by the new version vs. the prior version.'],
  ['cache_read_tokens', '💾 Cache metrics in observability', 'Cache read/write tokens are logged as metadata. Helps track caching effectiveness and diagnose cost anomalies.'],
  ['asdict(span)', '📤 Export to tracing backend', 'In production, each span is sent to Datadog / Honeycomb / Jaeger. Query by correlation_id to reconstruct the end-to-end trace.']
]);

AN('e04_cost_model', 'Baseline: $66k/year (all Sonnet, no caching). Optimized: $20.6k/year (prompt caching + tiered routing to Haiku). Savings: $45.4k (68.7%).', [
  ['CACHE_WRITE = 3.0', '💵 Cache pricing', 'Cache write is billed at the same price as input tokens ($3/M for Sonnet). Cache read is ~10% of input ($0.30/M for Sonnet).'],
  ['cache_write_per_session = 3000 / 10', '📊 Amortized cache write', 'The 3k-token system prompt is cached. Assume 10 sessions per cache TTL (~5 min). Each session pays 1/10 of the write cost (amortized).'],
  ['cache_read_per_session = 3000 * 9 / 10', '📖 Cache read benefit', '9 out of 10 sessions read the cached system prompt at $0.30/M (vs. $3/M for fresh input). 90% savings on those 3k tokens.'],
  ['sonnet_pct = 0.40', '🎯 Tiered routing split', '60% of routine queries → Haiku (fast, cheap). 40% of complex queries → Sonnet (capable). Weighted average cost drops significantly.'],
  ['haiku_cost = (', '🚀 Haiku economics', 'Haiku input: $0.25/M (12× cheaper than Sonnet $3/M). Output: $1.25/M (12× cheaper than Sonnet $15/M). Most sessions fit Haiku\'s quality bar.'],
  ['savings_pct = (savings / baseline) * 100', '📉 Total savings calculation', 'Combining prompt caching (targets the 45% static preamble cost) + tiered routing (sends 60% to Haiku) yields 68.7% overall savings without quality loss.']
]);
