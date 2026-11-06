/* Animation/diagram specifications */
(function () {
  function n(id, label, sub, x, y) { return { id: id, label: label, sub: sub, x: x, y: y }; }
  function st(on, edge, text) { return { on: on, edge: edge, text: text }; }
  function ov(spec, title) { var c = {}; for (var k in spec) c[k] = spec[k]; c.overview = true; if (title) c.title = title; return c; }
  var A = {};

  A.d_discovery = { title: 'Discovery workshop flow', overview: true,
    nodes: [n('s', 'Stakeholders', 'business units, compliance', 90, 150), n('w', 'Workshops', 'requirements elicitation', 300, 150), n('c', 'Constraints', 'SLAs, compliance, budget', 520, 70), n('cr', 'Success criteria', 'accuracy, latency, cost', 520, 240), n('a', 'ADR', 'decision + alternatives', 740, 150)],
    edges: [['s', 'w'], ['w', 'c'], ['w', 'cr'], ['c', 'a'], ['cr', 'a']],
    steps: [st(['s'], null, 'Stakeholders from each business unit, compliance, security, and finance are invited.'), st(['w'], ['s', 'w'], 'Facilitated workshops surface business goals, workflow pain points, latency tolerance, accuracy thresholds, compliance requirements, and budget ceilings.'), st(['c'], ['w', 'c'], 'Hard constraints are documented: SLAs (p95 <800ms), compliance regimes (HIPAA, SOC2), and budget limits.'), st(['cr'], ['w', 'cr'], 'Success criteria are defined with measurable thresholds (e.g., accuracy ≥95%, cost <$0.10/request).'), st(['a'], ['c', 'a'], 'An Architecture Decision Record captures the decision, alternatives considered, and trade-offs accepted, using the constraints and criteria as inputs.')]
  };

  A.d_sla_gate = { title: 'SLA elimination gate', overview: true,
    nodes: [n('c', 'Candidate architectures', 'X, Y, Z', 90, 150), n('s', 'SLA check', 'mandatory constraints', 300, 150), n('e', 'Eliminated', 'violates SLA', 520, 70), n('sv', 'Survivors', 'meet SLA', 520, 240), n('o', 'Optimize', 'cost / quality / complexity', 740, 240)],
    edges: [['c', 's'], ['s', 'e', 'fails'], ['s', 'sv', 'pass'], ['sv', 'o']],
    steps: [st(['c'], null, 'Multiple candidate architectures are proposed (e.g., Architecture X, Y, Z).'), st(['s'], ['c', 's'], 'Each architecture is evaluated against mandatory SLAs (latency, compliance, accuracy).'), st(['e'], ['s', 'e'], 'Any architecture violating an SLA is eliminated immediately, regardless of cost or quality advantages.'), st(['sv'], ['s', 'sv'], 'Architectures that meet all SLAs proceed to the next evaluation stage.'), st(['o'], ['sv', 'o'], 'Among survivors, compare and optimize on secondary goals (cost, quality, simplicity).')]
  };

  A.d_hybrid_retrieval = { title: 'Hybrid retrieval pipeline', overview: true,
    nodes: [n('q', 'User query', 'paraphrased question', 90, 150), n('d', 'Dense retriever', 'vector embeddings', 280, 60), n('sp', 'Sparse retriever', 'BM25', 280, 150), n('st', 'Structured query', 'SQL filters', 280, 240), n('m', 'Merge & re-rank', 'reciprocal rank fusion', 520, 150), n('r', 'RBAC filter', 'user identity', 700, 150), n('p', 'Prompt constructor', 'top-N passages', 880, 150)],
    edges: [['q', 'd'], ['q', 'sp'], ['q', 'st'], ['d', 'm'], ['sp', 'm'], ['st', 'm'], ['m', 'r'], ['r', 'p']],
    steps: [st(['q'], null, 'User submits a paraphrased query (e.g., "What happens if I cancel my plan?").'), st(['d', 'sp', 'st'], ['q', 'd'], 'Three retrievers run in parallel: dense (vector similarity), sparse (BM25 term matching), structured (SQL filter on metadata).'), st(['m'], ['d', 'm'], 'Results from all three retrievers are merged and re-ranked (e.g., reciprocal rank fusion or learned re-ranker).'), st(['r'], ['m', 'r'], 'RBAC filter applies the authenticated user\'s identity to remove documents the user is not authorized to see.'), st(['p'], ['r', 'p'], 'Prompt constructor takes the top-N authorized passages and builds the prompt.')]
  };

  A.d_rbac_retrieval = { title: 'RBAC enforcement at retrieval layer', overview: true,
    nodes: [n('u', 'User request', 'authenticated session', 90, 150), n('g', 'Gateway', 'resolves user identity', 250, 150), n('r', 'Retrieval service', 'applies ACL filter', 450, 150), n('v', 'Vector DB / Index', 'WHERE acl.roles ∩ user.roles', 670, 150), n('a', 'Authorized passages', 'only', 850, 150), n('p', 'Prompt constructor', 'trusted input', 1020, 150)],
    edges: [['u', 'g'], ['g', 'r', 'user_id'], ['r', 'v', 'query + ACL'], ['v', 'a'], ['a', 'p']],
    steps: [st(['u'], null, 'User sends a query; gateway authenticates and resolves user identity (user_id, roles).'), st(['g'], ['u', 'g'], 'Gateway passes user_id to the retrieval service (not a shared service token).'), st(['r'], ['g', 'r'], 'Retrieval service applies an ACL filter at the database query: WHERE acl.allowed_roles ∩ user.roles.'), st(['v'], ['r', 'v'], 'Vector DB / search index returns only documents the user is authorized to see.'), st(['a'], ['v', 'a'], 'Authorized passages proceed to prompt construction; unauthorized documents never enter the result set.'), st(['p'], ['a', 'p'], 'Prompt constructor receives only authorized content, so the model context is safe.')]
  };

  A.d_cache_lifecycle = { title: 'Prompt caching token lifecycle', overview: true,
    nodes: [n('i', 'Input Preparation', 'trim/compact', 90, 150), n('pc', 'Prompt Construction', 'order stable first', 320, 150), n('c', 'Cache write', 'first request', 560, 60), n('cr', 'Cache read', 'subsequent requests', 560, 240), n('o', 'Output Handling', 'validate/persist', 800, 150)],
    edges: [['i', 'pc'], ['pc', 'c', 'write'], ['pc', 'cr', 'read'], ['c', 'o'], ['cr', 'o']],
    steps: [st(['i'], null, 'Input Preparation: trim retrieved passages to relevant spans; compact or summarize conversation history if full history is no longer needed.'), st(['pc'], ['i', 'pc'], 'Prompt Construction: order sections so stable repeated content (system prompt, shared docs) sits before per-request dynamic content; mark stable prefix with cache_control.'), st(['c'], ['pc', 'c'], 'First request: cache write. The static prefix is transmitted and cached server-side; billed at input token price.'), st(['cr'], ['pc', 'cr'], 'Subsequent requests (within ~5min TTL): cache read. The cached prefix is billed at ~10% of input token cost; prefill latency drops.'), st(['o'], ['c', 'o'], 'Output Handling: validate the model\'s structured output against the expected schema; persist validated results for audit and downstream systems.')]
  };

  A.d_model_routing = { title: 'Tiered model routing', overview: true,
    nodes: [n('r', 'Incoming requests', '10k/day', 90, 150), n('c', 'Classifier', 'routine vs complex', 280, 150), n('h', 'Haiku', 'fast, low-cost', 500, 60), n('s', 'Sonnet', 'capable, balanced', 500, 240), n('v', 'Validate', 'quality check', 700, 150), n('fb', 'Fallback', 'Haiku → Sonnet if fail', 700, 240)],
    edges: [['r', 'c'], ['c', 'h', 'routine'], ['c', 's', 'complex'], ['h', 'v'], ['s', 'v'], ['v', 'fb']],
    steps: [st(['r'], null, 'Incoming requests arrive (e.g., 10,000 support tickets/day).'), st(['c'], ['r', 'c'], 'A lightweight classifier (keyword heuristic, logistic regression, small model) labels each request as "routine" or "complex."'), st(['h'], ['c', 'h'], 'Routine requests (85%) → routed to Haiku (fast, low-cost tier).'), st(['s'], ['c', 's'], 'Complex requests (15%) → routed to Sonnet (capable, balanced tier).'), st(['v'], ['h', 'v'], 'Validate response quality; if Haiku response lacks confidence or fails validation → fallback to Sonnet.'), st(['fb'], ['v', 'fb'], 'Fallback ensures quality is not sacrificed; most requests stay on Haiku (cost/latency savings).')]
  };

  A.d_tool_search = { title: 'Progressive tool discovery (Tool Search)', overview: true,
    nodes: [n('a', 'Agent startup', '8 core tools', 90, 150), n('t', 'Task', 'needs rare tool', 280, 150), n('ts', 'ToolSearch', 'query: "warehouse shipment"', 500, 150), n('l', 'Load tools', 'definitions enter context', 720, 150), n('e', 'Execute', 'with newly loaded tool', 920, 150)],
    edges: [['a', 't'], ['t', 'ts'], ['ts', 'l'], ['l', 'e']],
    steps: [st(['a'], null, 'Agent starts with 8 core tools (CRM lookup, ticket search, policy retrieval, draft response); the other 52 tools are deferred.'), st(['t'], ['a', 't'], 'A task arrives needing a tool not in the active set (e.g., "look up last warehouse shipment for order O-29471").'), st(['ts'], ['t', 'ts'], 'Agent calls ToolSearch meta-tool with query "warehouse shipment order."'), st(['l'], ['ts', 'l'], 'ToolSearch returns matching tool definitions; those definitions enter the context window.'), st(['e'], ['l', 'e'], 'Agent proceeds with the newly loaded tool (e.g., mcp__warehouse__lookup_shipment).')]
  };

  A.d_capability_decomp = { title: 'Capability decomposition (multi-agent)', overview: true,
    nodes: [n('o', 'Orchestrator', 'only Agent tool', 90, 150), n('i', 'Intake subagent', '8 tools', 320, 60), n('p', 'Policy subagent', '7 tools', 320, 150), n('f', 'Fraud subagent', '9 tools', 320, 240), n('m', 'Merge', 'synthesize results', 560, 150)],
    edges: [['o', 'i', 'delegate'], ['o', 'p', 'delegate'], ['o', 'f', 'delegate'], ['i', 'm'], ['p', 'm'], ['f', 'm']],
    steps: [st(['o'], null, 'Orchestrator has only the Agent tool and delegates tasks by domain.'), st(['i', 'p', 'f'], ['o', 'i'], 'Request: "Check if claim C-12345 matches a fraud pattern." Orchestrator delegates to fraud subagent (9 tools).'), st(['m'], ['f', 'm'], 'Fraud subagent executes with its scoped toolset (9 tools, not 34), returns result to orchestrator.'), st(['o'], ['m', 'o'], 'Orchestrator synthesizes and responds. Tool-selection accuracy improves (9 relevant tools vs. 34 overlapping tools).')]
  };

  A.d_hipaa_stack = { title: 'HIPAA-compliant deployment stack', overview: true,
    nodes: [n('u', 'Clinician', 'authenticated session', 90, 150), n('g', 'API Gateway', 'validates auth, logs access', 280, 150), n('e', 'Claude Enterprise', 'BAA + ZDR enabled', 500, 150), n('a', 'Audit log', 'who/what/when', 720, 150)],
    edges: [['u', 'g'], ['g', 'e', 'PHI in request'], ['e', 'g', 'response'], ['g', 'a', 'log']],
    steps: [st(['u'], null, 'Clinician (authenticated via SSO) submits a query containing PHI.'), st(['g'], ['u', 'g'], 'API gateway validates the session and logs: user ID, patient ID, timestamp, session ID (HIPAA audit trail).'), st(['e'], ['g', 'e'], 'Request is sent to Claude Enterprise endpoint with BAA in force and ZDR enabled. Anthropic processes PHI transiently but retains nothing.'), st(['a'], ['g', 'a'], 'Audit log persists who accessed which patient\'s PHI and when, meeting HIPAA\'s audit requirement.')]
  };

  A.d_layered_guardrails = { title: 'Layered guardrail architecture', overview: true,
    nodes: [n('q', 'User query', 'potentially out-of-scope', 90, 150), n('p', 'Layer 1: Prompt', 'system instructions', 250, 150), n('m', 'Model response', 'draft', 410, 150), n('oc', 'Layer 2: Output classifier', 'detect unsafe content', 570, 150), n('tg', 'Layer 3: Tool gate', 'hooks / permissions', 730, 70), n('ob', 'Layer 4: Observability', 'logs / alerts', 730, 240), n('d', 'Deliver or block', 'final decision', 890, 150)],
    edges: [['q', 'p'], ['p', 'm'], ['m', 'oc'], ['oc', 'tg'], ['oc', 'ob'], ['tg', 'd'], ['ob', 'd']],
    steps: [st(['q'], null, 'User query arrives (e.g., "Should I invest in these stocks?").'), st(['p'], ['q', 'p'], 'Layer 1 (Prompt): system instructions say "You must not provide regulated investment advice. Redirect to a licensed advisor."'), st(['m'], ['p', 'm'], 'Model generates a draft response guided by the prompt.'), st(['oc'], ['m', 'oc'], 'Layer 2 (Output classifier): scans response for phrases like "buy," "invest in," "guaranteed return." If detected → block and return canned refusal.'), st(['tg'], ['oc', 'tg'], 'Layer 3 (Tool gate): if tools are involved, hooks/permissions check for unsafe tool calls (e.g., draft_investment_plan requires approval).'), st(['ob'], ['oc', 'ob'], 'Layer 4 (Observability): log every refusal and blocked output; alert if refusal rate spikes.'), st(['d'], ['tg', 'd'], 'If all layers pass → deliver response; if any layer blocks → return refusal.')]
  };

  A.d_observability_trace = { title: 'Distributed tracing with correlation IDs', overview: true,
    nodes: [n('g', 'Gateway', 'generates correlation_id', 90, 150), n('a', 'Agent', 'logs correlation_id', 280, 150), n('r', 'Retrieval service', 'logs correlation_id + query', 490, 150), n('t', 'Tool / MCP', 'logs correlation_id + call', 700, 150), n('tr', 'Tracing backend', 'query by correlation_id', 910, 150)],
    edges: [['g', 'a', 'correlation_id'], ['a', 'r', 'correlation_id'], ['r', 't', 'correlation_id'], ['t', 'tr']],
    steps: [st(['g'], null, 'API gateway generates a unique correlation ID (UUID) when the request enters.'), st(['a'], ['g', 'a'], 'Gateway passes correlation_id downstream; agent logs it with every tool call.'), st(['r'], ['a', 'r'], 'Retrieval service receives correlation_id, logs it with the query and results.'), st(['t'], ['r', 't'], 'Tool / MCP server logs correlation_id with the tool call and outcome.'), st(['tr'], ['t', 'tr'], 'All spans are exported to the tracing backend; query by correlation_id reconstructs the full request flow across services.')]
  };

  A.d_canary_rollout = { title: 'Canary deployment with rollback gates', overview: true,
    nodes: [n('b', 'Baseline (100%)', 'current version', 90, 150), n('c5', 'Canary 5%', 'new version', 280, 60), n('g1', 'Gate 1', 'metrics check', 470, 60), n('c25', 'Canary 25%', '', 660, 60), n('g2', 'Gate 2', 'metrics check', 850, 60), n('rb', 'Rollback', 'revert to baseline', 470, 240)],
    edges: [['b', 'c5'], ['c5', 'g1'], ['g1', 'c25', 'pass'], ['g1', 'rb', 'fail'], ['c25', 'g2'], ['g2', 'rb', 'fail']],
    steps: [st(['b'], null, 'Baseline version serves 100% of traffic.'), st(['c5'], ['b', 'c5'], 'Deploy new version to 5% of traffic (canary).'), st(['g1'], ['c5', 'g1'], 'Gate 1: collect metrics for 48 hours; compare to baseline. If accuracy drops >2 points or hallucination rate rises >1 point → rollback.'), st(['rb'], ['g1', 'rb'], 'If gate fails → automatic rollback to baseline; alert on-call.'), st(['c25'], ['g1', 'c25'], 'If gate passes → expand canary to 25%; repeat metric checks at each stage (50%, 100%).'), st(['g2'], ['c25', 'g2'], 'Gate 2 checks 25% canary; if pass → expand to 50%; if fail → rollback.')]
  };

  A.d_hitl_placement = ov(A.d_hitl = { title: 'Human-in-the-loop architecture',
    nodes: [n('a', 'Agent', 'proposes action', 90, 150), n('c', 'can_use_tool callback', 'checks impact', 280, 150), n('u', 'Approval UI', 'Slack / web', 490, 70), n('h', 'Human reviewer', 'approve / deny', 670, 70), n('l', 'Audit log', 'who approved what', 490, 240), n('e', 'Execute or adapt', 'proceed / retry', 870, 150)],
    edges: [['a', 'c'], ['c', 'u', 'high-impact'], ['u', 'h'], ['h', 'c', 'decision'], ['c', 'l'], ['c', 'e']],
    steps: [st(['a'], null, 'Agent proposes a high-consequence action (e.g., refund >$100, delete record).'), st(['c'], ['a', 'c'], 'Runtime invokes can_use_tool callback; callback checks tool name and input.'), st(['u'], ['c', 'u'], 'Callback posts approval request to UI (Slack modal, web dashboard) with exact tool input.'), st(['h'], ['u', 'h'], 'Human reviews the input (not just Claude\'s description) and decides.'), st(['l'], ['h', 'l'], 'Decision is logged: timestamp, user, agent, tool, input, approver, allow/deny.'), st(['e'], ['c', 'e'], 'If approved → action executes; if denied → agent adapts (e.g., queues for later review).')]
  }, 'Human-in-the-loop gate placement');

  window.ANIMS = A;
})();
