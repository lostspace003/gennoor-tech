/* Chapters 7-10: hooks, sessions, security, advanced */
chapter('ch7', '7. Hooks and lifecycle management', 'core',
  concept('7.1 Hooks', {ex: 'e09_hooks',
    what: 'Hooks are callbacks that the SDK runs at defined points in the agent lifecycle. You register them in <code>ClaudeAgentOptions(hooks={...})</code> using <code>HookMatcher</code>.',
    why: 'Prompts are suggestions; hooks are <b>deterministic enforcement</b>. Use them to block dangerous calls, rewrite inputs, log, audit, inject context or notify.',
    how: 'At an event the SDK finds matchers whose regex <code>matcher</code> matches the tool name (None = all) and awaits each callback <code>async def cb(input_data, tool_use_id, context)</code>. Return <code>{}</code> to proceed, or a <code>hookSpecificOutput</code> with <code>permissionDecision</code> ("allow", "deny", "ask", "defer") and a reason. If several PreToolUse hooks disagree: deny beats defer beats ask beats allow.',
    analogy: 'Security checkpoints and CCTV along a corridor: they inspect everyone passing, independent of what the traveler intends.',
    example: 'Block any Bash command containing <code>rm -rf</code>, and log every tool result to an audit file.',
    arch: 'Hooks wrap the tool gate (see Hook execution architecture): PreToolUse before permissions, PostToolUse after execution.',
    when: 'Hooks for enforcement/observability that must always happen. Tools are things Claude <i>chooses</i> to call; hooks run <i>whether or not</i> Claude wants them.',
    exam: '<b>Python hook events (verified):</b> PreToolUse, PostToolUse, PostToolUseFailure, UserPromptSubmit, Stop, SubagentStop, PreCompact, Notification, SubagentStart, PermissionRequest. TypeScript supports more (e.g. SessionStart/SessionEnd as callbacks) - in Python those work only as shell-command hooks from settings files. A hook "allow" does not bypass deny rules.' }) +
  anim('hooks') +
  tbl(['Hooks', 'Tools'], [['Run automatically at lifecycle events', 'Invoked by Claude\'s decision'], ['Deterministic policy/telemetry', 'Capabilities to act'], ['Can deny/modify tool calls', 'Return data to Claude'], ['Written as callbacks', 'Written as @tool functions / built-ins']]) +
  kc('ch7'));

chapter('ch8', '8. Sessions and context management', 'core',
  concept('8.1 Sessions, resume and fork', {ex: 'e10_session',
    what: 'A <b>session</b> is the persisted conversation (messages, tool calls, results) identified by a <code>session_id</code>. <b>Context</b> is what is inside the model\'s window right now. Sessions are storage; context is working memory.',
    why: 'Long tasks span many turns or processes. Sessions let you pause, resume, and branch without re-explaining.',
    how: 'The init <code>SystemMessage</code> (and the final <code>ResultMessage</code>) carry the session id. Pass <code>resume=session_id</code> to continue; add <code>fork_session=True</code> to branch into a new id leaving the original untouched; <code>continue_conversation=True</code> resumes the most recent session in the cwd. <code>ClaudeSDKClient</code> keeps its session across <code>query()</code> calls. Transcripts are stored as JSONL under <code>~/.claude/projects/</code> by default.',
    analogy: 'A saved game file (session) versus what is on your screen (context). Forking = save-as a new file.',
    example: 'An analyst reviews a report overnight; next morning the agent resumes, then forks to explore an alternative conclusion.',
    arch: 'Session store (transcript files or a custom session_store) sits beside the runtime; resume loads history into a new context.',
    when: 'Resume for continuity; fork for what-if exploration; new session for unrelated tasks (avoids polluted context).',
    exam: 'Forking branches <b>conversation</b>, not files (use file checkpointing for file rollback). Do not sum total_cost_usd across resumed results of the same session.' }) +
  anim('session') +
  '<h3>8.2 Context window, compaction and tokens</h3><ul><li>Every turn re-sends history, so cost and latency grow with conversation length; tool outputs (big files, command logs) are the usual culprits.</li><li>When context nears the limit the runtime <b>compacts</b> (summarizes) earlier history; a <code>PreCompact</code> hook lets you react. Persistent rules should live in the system prompt/CLAUDE.md, which are re-injected.</li><li><b>Strategies:</b> subagents for noisy work, targeted Grep before Read, short tool outputs, split work across sessions, <code>get_context_usage()</code> on the client to inspect usage.</li><li><b>Memory</b> beyond the window = files (notes, CLAUDE.md) or external stores the agent reads.</li></ul>' +
  tbl(['Sessions', 'Context'], [['Persisted conversation with an id', 'Tokens currently in the model window'], ['Survives process restarts', 'Rebuilt (maybe compacted) on resume'], ['Resume / fork', 'Managed via compaction and subagents']]) +
  kc('ch8'));

chapter('ch9', '9. Security, permissions and governance', 'core',
  concept('9.1 Permission modes, rules and callbacks', {ex: 'e11_perm',
    what: 'Permissions decide whether a tool call may run. Layers: hooks → deny rules → ask rules → permission mode → allow rules → <code>can_use_tool</code> callback.',
    why: 'Agents act autonomously; without guardrails one bad prompt or injected instruction could delete data or leak secrets.',
    how: 'Modes: <code>default</code> (unmatched calls go to your callback), <code>acceptEdits</code> (auto-approve file edits inside the working directory), <code>plan</code> (no execution; planning), <code>dontAsk</code> (deny anything not pre-approved), <code>bypassPermissions</code> (approve everything not denied - use only in isolated sandboxes), <code>auto</code> (classifier-based). Deny rules apply even in bypass mode. <code>can_use_tool</code> returns <code>PermissionResultAllow</code> or <code>PermissionResultDeny(message=...)</code>; with <code>query()</code> it needs streaming input and a keep-alive hook (see docs).',
    analogy: 'Building access: always-denied rooms (deny), keycard doors (allow), and "ask the receptionist" (callback).',
    example: 'A DevOps agent may read logs freely but must obtain human approval before restarting a service.',
    arch: 'Defense in depth: policy (hooks/rules) + approval (callback) + isolation (sandbox, container, least-privilege credentials).',
    when: 'Use <b>modes/rules</b> for static policy; <b>callbacks</b> for dynamic or human decisions.',
    exam: 'Permission modes = coarse baseline; callbacks = per-call logic. <code>allowed_tools</code> does not restrict bypassPermissions. Deny always wins.' }) +
  anim('permission') + anim('d_sec') + anim('d_hitl') +
  '<h3>9.2 Prompt injection, sandboxing and governance</h3><ul><li><b>Prompt injection:</b> text from web pages, files or MCP results may contain instructions. Treat tool output as <i>data</i>; limit tools after reading untrusted content; require approval for side effects; never give one agent both untrusted input and powerful credentials.</li><li><b>Sandboxing:</b> run in containers/VMs, scope <code>cwd</code>/<code>add_dirs</code>, restrict network, mount read-only, use the <code>sandbox</code> option where supported; never run <code>bypassPermissions</code> on a developer\'s real machine.</li><li><b>Governance:</b> central policy via settings, hooks for audit logs (who/what/when), cost caps (<code>max_budget_usd</code>), versioned prompts, review of MCP servers.</li></ul>' +
  tbl(['Permission modes', 'Permission callbacks'], [['Static baseline set in options (or switched at runtime)', 'Dynamic Python logic per call'], ['No code needed', 'Can ask a human, check a database, rewrite input'], ['Coarse', 'Fine-grained']]) +
  kc('ch9'));

chapter('ch10', '10. Advanced Agent SDK concepts', 'sup',
  concept('10.1 Structured outputs', {ex: 'e12_struct',
    what: 'Ask the agent to return JSON that conforms to a JSON Schema via <code>output_format</code>.',
    why: 'Downstream code needs machine-readable results, not prose.',
    how: '<code>output_format={"type": "json_schema", "schema": ...}</code>; the validated object appears in <code>ResultMessage.structured_output</code>. If validation keeps failing the result subtype is <code>error_max_structured_output_retries</code>. With Pydantic use <code>Model.model_json_schema()</code>.',
    analogy: 'A form with fixed fields instead of a free-text letter.',
    example: 'Extract {vendor, amount, due_date} from invoices into a database.',
    when: 'Whenever another program consumes the answer.',
    exam: 'Know the option name, the result field, and the failure subtype.' }) +
  '<h3>10.2 Errors, retries, cost, monitoring</h3>' +
  exBlock('e13_errors') +
  '<ul><li><b>Retries:</b> retry transient failures with backoff at your layer; make tools idempotent; resume the session instead of restarting from scratch.</li><li><b>Cost:</b> <code>total_cost_usd</code> is a client-side <i>estimate</i>; <code>usage</code> covers the main loop, <code>model_usage</code> includes subagents. Use cheaper models for subagents, cap with <code>max_turns</code>/<code>max_budget_usd</code>.</li><li><b>Observability:</b> hooks (Pre/PostToolUse) emit structured logs; capture session ids, turns, cost, denied permissions (<code>permission_denials</code>).</li><li><b>Testing:</b> mock tool handlers, assert on hook decisions, run evals on fixed prompts, use <code>plan</code> mode or read-only tools in CI.</li><li><b>Deployment:</b> container per run/session, secrets from a vault, persistent session store for resumption, queue long jobs, never <code>bypassPermissions</code> outside a sandbox.</li></ul>' + kc('ch10'));
