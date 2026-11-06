/* Animation + diagram specs. n(id,label,sub,x,y); st(activeNodes, [from,to]|null, caption). */
(function () {
  function n(id, label, sub, x, y) { return { id: id, label: label, sub: sub, x: x, y: y }; }
  function st(on, edge, text) { return { on: on, edge: edge, text: text }; }
  function ov(spec, title) { var c = {}; for (var k in spec) c[k] = spec[k]; c.overview = true; if (title) c.title = title; return c; }
  var A = {};

  A.lifecycle = { title: 'Agent execution lifecycle',
    nodes: [n('u', 'User request', 'prompt string', 80, 150), n('a', 'Claude Agent', 'agent loop', 300, 150), n('t', 'Tool', 'Read / Bash / custom', 560, 70), n('r', 'Final response', 'ResultMessage', 800, 150)],
    edges: [['u', 'a', 'query()'], ['a', 't', 'tool_use'], ['t', 'a', 'tool_result'], ['a', 'r', 'result']],
    steps: [
      st(['u', 'a'], ['u', 'a'], 'The application calls query(prompt=...). The SDK starts the agent loop and sends the prompt plus the tool definitions to Claude.'),
      st(['a'], null, 'Tool selection: Claude reasons about the task and decides it needs a tool (for example Read). It emits a tool_use block with a tool name and JSON arguments.'),
      st(['a', 't'], ['a', 't'], 'The SDK checks permissions/hooks, then dispatches the tool call to the tool implementation.'),
      st(['t'], null, 'Tool execution: the tool runs (reads the file, runs the command, calls your function).'),
      st(['t', 'a'], ['t', 'a'], 'Tool result: the output is returned to Claude as a tool_result block appended to the conversation.'),
      st(['a'], null, 'Agent processing: Claude reads the result and either calls another tool (loop repeats) or decides it has enough to answer.'),
      st(['a', 'r'], ['a', 'r'], 'Final response: when Claude stops requesting tools, the SDK yields a ResultMessage (final text, session_id, cost, turns).')] };

  A.mcp = { title: 'MCP integration flow',
    nodes: [n('a', 'Claude Agent', 'Agent SDK', 80, 150), n('c', 'MCP Client', 'inside the SDK', 250, 150), n('s', 'MCP Server', 'stdio / HTTP / SSE', 450, 150), n('x', 'External system', 'DB / API / SaaS', 650, 150)],
    edges: [['a', 'c'], ['c', 's', 'JSON-RPC'], ['s', 'x'], ['x', 's'], ['s', 'c'], ['c', 'a']],
    steps: [
      st(['a'], null, 'At startup the SDK connects to each server listed in mcp_servers and lists its tools (tools/list). Tool names become mcp__<server>__<tool>.'),
      st(['a', 'c'], ['a', 'c'], 'Claude emits a tool_use for e.g. mcp__crm__lookup_customer. The agent hands it to the built-in MCP client.'),
      st(['c', 's'], ['c', 's'], 'The MCP client sends a JSON-RPC tools/call request over the transport (stdio subprocess, HTTP or SSE).'),
      st(['s', 'x'], ['s', 'x'], 'The MCP server executes the tool against the external system (database query, REST call).'),
      st(['x', 's'], ['x', 's'], 'The external system returns data to the MCP server.'),
      st(['s', 'c'], ['s', 'c'], 'The server wraps the data in an MCP result (content blocks) and replies to the client.'),
      st(['c', 'a'], ['c', 'a'], 'The client delivers the result to Claude as a tool_result; the agent continues reasoning.')] };

  A.subagent = { title: 'Subagent architecture',
    nodes: [n('m', 'Main agent', 'orchestrator', 120, 150), n('r', 'Research subagent', 'Read/Grep/WebSearch', 450, 60), n('y', 'Analysis subagent', 'Read/Bash', 450, 240), n('g', 'Aggregation', 'main agent merges', 740, 150)],
    edges: [['m', 'r', 'Agent tool'], ['m', 'y', 'Agent tool'], ['r', 'g', 'summary'], ['y', 'g', 'summary'], ['g', 'm']],
    steps: [
      st(['m'], null, 'The main agent receives the request and decomposes it into independent sub-tasks.'),
      st(['m', 'r'], ['m', 'r'], 'Task delegation 1: the main agent calls the Agent tool, naming the research subagent and giving it a self-contained prompt.'),
      st(['m', 'y'], ['m', 'y'], 'Task delegation 2: a second Agent call goes to the analysis subagent (can run in parallel with the first).'),
      st(['r', 'y'], null, 'Each subagent runs in its OWN fresh context window with its own prompt, tools and model. They do not see each other or the main history.'),
      st(['r', 'g'], ['r', 'g'], 'The research subagent finishes; only its final message returns to the parent (not its intermediate tool calls).'),
      st(['y', 'g'], ['y', 'g'], 'The analysis subagent returns its final summary the same way.'),
      st(['g', 'm'], ['g', 'm'], 'Results aggregation: the main agent merges both summaries and produces the final response.')] };

  A.hooks = { title: 'Hook flow (PreToolUse)',
    nodes: [n('e', 'Agent event', 'tool_use: Bash', 90, 150), n('h', 'Hook trigger', 'matcher "Bash"', 280, 150), n('v', 'Validation', 'your Python callback', 480, 150), n('b', 'Blocked', 'permissionDecision deny', 700, 60), n('c', 'Continue', 'tool executes', 700, 240)],
    edges: [['e', 'h'], ['h', 'v'], ['v', 'b', 'deny'], ['v', 'c', 'allow']],
    steps: [
      st(['e'], null, 'Claude decides to call a tool. Before it runs, the SDK raises the PreToolUse event.'),
      st(['e', 'h'], ['e', 'h'], 'Hook trigger: HookMatcher(matcher="Bash") selects the hooks registered for this tool name.'),
      st(['h', 'v'], ['h', 'v'], 'Validation: your async callback receives input_data (tool_name, tool_input) and inspects the command.'),
      st(['v', 'b'], ['v', 'b'], 'Dangerous command (e.g. rm -rf): the hook returns a deny decision. The tool never runs; Claude is told why.'),
      st(['v', 'c'], ['v', 'c'], 'Safe command: the hook returns {} (or allow) and execution continues to the tool. A PostToolUse hook can then log the result.')] };

  A.permission = { title: 'Permission management',
    nodes: [n('q', 'Tool request', 'Bash("npm test")', 80, 150), n('p', 'Permission check', 'rules + mode', 270, 150), n('h', 'Human approval', 'can_use_tool', 480, 150), n('d', 'Allow / Deny', 'decision', 660, 150), n('x', 'Tool execution', 'only if allowed', 830, 150)],
    edges: [['q', 'p'], ['p', 'h', 'ask'], ['h', 'd'], ['d', 'x']],
    steps: [
      st(['q'], null, 'Claude requests a tool call.'),
      st(['q', 'p'], ['q', 'p'], 'The SDK evaluates hooks, deny rules, the permission_mode and allow rules (in that precedence).'),
      st(['p'], null, 'If a rule already decides (allowed_tools / disallowed_tools) the flow skips straight to the decision. Otherwise the request is undecided.'),
      st(['p', 'h'], ['p', 'h'], 'Undecided requests go to your can_use_tool callback, where a person (or policy) is asked to approve.'),
      st(['h', 'd'], ['h', 'd'], 'The callback returns PermissionResultAllow or PermissionResultDeny(message=...).'),
      st(['d', 'x'], ['d', 'x'], 'Allow: the tool executes. Deny: Claude receives the denial message and adapts instead.')] };

  A.multiagent = { title: 'Multi-agent workflow',
    nodes: [n('p', 'Planner', 'plans steps', 80, 150), n('r', 'Research agent', 'gathers facts', 270, 150), n('a', 'Analyst agent', 'interprets', 470, 150), n('v', 'Reviewer agent', 'checks quality', 670, 150), n('o', 'Final output', 'report', 830, 60)],
    edges: [['p', 'r', 'tasks'], ['r', 'a', 'findings'], ['a', 'v', 'draft'], ['v', 'o', 'approved'], ['v', 'a', 'revise']],
    steps: [
      st(['p'], null, 'The orchestrator (main agent) acts as Planner: it writes a plan with ordered sub-tasks.'),
      st(['p', 'r'], ['p', 'r'], 'Planner delegates research through the Agent tool; research subagent returns sourced findings.'),
      st(['r', 'a'], ['r', 'a'], 'Findings are passed (in the prompt) to the analyst subagent; subagents cannot share context implicitly.'),
      st(['a', 'v'], ['a', 'v'], 'The analyst returns a draft analysis to the orchestrator, which sends it to the reviewer.'),
      st(['v', 'a'], ['v', 'a'], 'If the reviewer finds problems it asks for a revision (loop back) - a quality gate.'),
      st(['v', 'o'], ['v', 'o'], 'Approved: the orchestrator emits the final output.')] };
  A.multiagent.steps[4].text = 'Optional loop: if the reviewer finds problems, a revision request goes back to the analyst (quality gate).';

  A.customtool = { title: 'Custom tool creation',
    nodes: [n('d', '1. Define tool', '@tool decorator', 90, 150), n('r', '2. Register', 'create_sdk_mcp_server', 270, 150), n('i', '3. Agent invokes', 'mcp__server__tool', 470, 150), n('e', '4. Execute function', 'your async def', 660, 150), n('o', '5. Return result', '{"content":[...]}', 830, 150)],
    edges: [['d', 'r'], ['r', 'i'], ['i', 'e'], ['e', 'o']],
    steps: [
      st(['d'], null, 'Define: decorate an async function with @tool(name, description, input_schema). Claude reads the description to decide when to call it.'),
      st(['d', 'r'], ['d', 'r'], 'Register: bundle tools with create_sdk_mcp_server(name=..., tools=[...]) and pass it in ClaudeAgentOptions(mcp_servers={...}); list its tool names in allowed_tools.'),
      st(['r', 'i'], ['r', 'i'], 'Agent invokes: Claude emits tool_use for mcp__<server>__<tool> with arguments matching the schema.'),
      st(['i', 'e'], ['i', 'e'], 'Execute: the SDK runs your function IN-PROCESS (no subprocess) with the args dict.'),
      st(['e', 'o'], ['e', 'o'], 'Return: your function returns {"content": [{"type": "text", "text": ...}]}; Claude receives it as the tool result.')] };

  A.session = { title: 'Session management',
    nodes: [n('n', 'New session', 'no resume', 90, 150), n('i', 'User interaction', 'turns / tools', 290, 150), n('s', 'Session state', 'session_id + transcript', 500, 150), n('c', 'Continue', 'same context', 690, 60), n('r', 'Resume / fork', 'resume=session_id', 780, 240)],
    edges: [['n', 'i'], ['i', 's', 'saved'], ['s', 'c'], ['s', 'r']],
    steps: [
      st(['n'], null, 'A query() without resume starts a new session; the first message of the stream is a system init message that carries session_id.'),
      st(['n', 'i'], ['n', 'i'], 'The user interacts: prompts, tool calls and results accumulate as conversation history.'),
      st(['i', 's'], ['i', 's'], 'Session state: the transcript is persisted by the CLI under a session_id. Capture the id from the init/result message.'),
      st(['s', 'c'], ['s', 'c'], 'Continue conversation: within ClaudeSDKClient, further query() calls reuse the same session automatically.'),
      st(['s', 'r'], ['s', 'r'], 'Resume later (even in a new process) with ClaudeAgentOptions(resume=session_id); add fork_session=True to branch into a new session id without altering the original.')] };

  /* ---------- Architecture diagrams (overview mode; Play walks through them) ---------- */
  A.d_sdk = { title: 'Claude Agent SDK architecture', overview: true,
    nodes: [n('app', 'Your application', 'Python / TypeScript', 90, 150), n('sdk', 'Agent SDK', 'query / ClaudeSDKClient', 290, 150), n('cli', 'Agent runtime', 'Claude Code engine', 490, 150), n('api', 'Claude model', 'Anthropic API', 700, 70), n('tl', 'Tools / MCP / hooks', 'local + external', 700, 240)],
    edges: [['app', 'sdk'], ['sdk', 'cli', 'messages'], ['cli', 'api', 'inference'], ['cli', 'tl', 'tool calls']],
    steps: [st(['app'], null, 'Your code constructs ClaudeAgentOptions and calls query() or ClaudeSDKClient.'), st(['sdk'], ['app', 'sdk'], 'The SDK exposes the typed Python API and streams back typed messages.'), st(['cli'], ['sdk', 'cli'], 'The SDK drives the Claude Code agent runtime (agent loop, context management, tool dispatch) as a subprocess.'), st(['api'], ['cli', 'api'], 'The runtime calls the Claude model through the Anthropic API for each reasoning step.'), st(['tl'], ['cli', 'tl'], 'Tool calls go to built-in tools, SDK/external MCP servers and your hooks; results feed back into the loop.')] };

  A.d_tool = { title: 'Tool execution architecture', overview: true,
    nodes: [n('c', 'Claude', 'emits tool_use', 90, 150), n('h', 'PreToolUse hooks', 'validate', 270, 150), n('p', 'Permissions', 'rules / mode / callback', 470, 150), n('t', 'Tool runtime', 'built-in / MCP', 670, 150), n('po', 'PostToolUse hooks', 'log / audit', 820, 60)],
    edges: [['c', 'h'], ['h', 'p'], ['p', 't'], ['t', 'po'], ['t', 'c', 'tool_result', 62]],
    steps: [st(['c'], null, 'Claude produces a tool_use block (name + input).'), st(['h'], ['c', 'h'], 'PreToolUse hooks can allow, deny or modify the call.'), st(['p'], ['h', 'p'], 'Permission rules and mode decide whether the call may proceed or must ask.'), st(['t'], ['p', 't'], 'The tool executes (file system, shell, web, MCP).'), st(['po'], ['t', 'po'], 'PostToolUse hooks observe the output for logging/audit.'), st(['c'], ['t', 'c'], 'The tool_result is appended to the conversation for the next model step.')] };
  A.d_custom = ov(A.customtool, 'Custom tool architecture');
  A.d_mcp = ov(A.mcp, 'MCP architecture');
  A.d_sdkmcp = { title: 'SDK-created MCP server architecture', overview: true,
    nodes: [n('f', 'Python function', '@tool async def', 90, 150), n('s', 'create_sdk_mcp_server', 'in-process server', 300, 150), n('o', 'ClaudeAgentOptions', 'mcp_servers={...}', 520, 150), n('a', 'Agent', 'mcp__srv__fn', 730, 150)],
    edges: [['f', 's', 'wrap'], ['s', 'o', 'config'], ['o', 'a'], ['a', 'f', 'call (same process)', 62]],
    steps: [st(['f'], null, 'Your plain async functions hold the business logic.'), st(['s'], ['f', 's'], 'create_sdk_mcp_server wraps them as an MCP server object that lives in your Python process.'), st(['o'], ['s', 'o'], 'You register it under a name in mcp_servers; type is "sdk" (no subprocess, no network).'), st(['a'], ['o', 'a'], 'The agent sees tools named mcp__<name>__<tool>.'), st(['f'], ['a', 'f'], 'Calls execute directly in your process, so they can use your variables, DB connections and secrets safely.')] };
  A.d_sub = ov(A.subagent, 'Subagent architecture');
  A.d_multi = ov(A.multiagent, 'Multi-agent orchestration architecture');
  A.d_hook = ov(A.hooks, 'Hook execution architecture');
  A.d_sec = { title: 'Permission and security architecture', overview: true,
    nodes: [n('r', 'Tool request', '', 80, 150), n('hk', 'Hooks', 'PreToolUse', 240, 150), n('dr', 'Deny rules', 'disallowed_tools', 400, 150), n('pm', 'Permission mode', 'default/acceptEdits/plan', 580, 150), n('cb', 'can_use_tool', 'human / policy', 750, 70), n('sb', 'Sandbox / OS limits', 'cwd, container', 750, 240)],
    edges: [['r', 'hk'], ['hk', 'dr'], ['dr', 'pm'], ['pm', 'cb'], ['pm', 'sb']],
    steps: [st(['r'], null, 'Every tool request passes the same layered gate.'), st(['hk'], ['r', 'hk'], 'Layer 1: hooks can block or rewrite immediately.'), st(['dr'], ['hk', 'dr'], 'Layer 2: explicit deny rules always win.'), st(['pm'], ['dr', 'pm'], 'Layer 3: permission mode and allow rules (allowed_tools) auto-approve some calls.'), st(['cb'], ['pm', 'cb'], 'Layer 4: anything unresolved asks your can_use_tool callback.'), st(['sb'], ['pm', 'sb'], 'Defense in depth: even approved tools run inside OS/container limits, a scoped cwd and least-privilege credentials.')] };
  A.d_sess = ov(A.session, 'Session management architecture');
  A.d_hitl = { title: 'Human-in-the-loop architecture', overview: true,
    nodes: [n('a', 'Agent', 'runs autonomously', 100, 150), n('g', 'can_use_tool', 'callback gate', 300, 150), n('u', 'Approval UI', 'Slack / web / CLI', 500, 70), n('hu', 'Human reviewer', 'approve / deny', 700, 70), n('l', 'Audit log', 'who approved what', 700, 240)],
    edges: [['a', 'g', 'sensitive tool'], ['g', 'u', 'request'], ['u', 'hu'], ['hu', 'g', 'decision'], ['g', 'l'], ['g', 'a', 'allow/deny']],
    steps: [st(['a'], null, 'The agent works until it requests a sensitive tool (e.g. refund, deploy, delete).'), st(['g'], ['a', 'g'], 'The SDK pauses and calls your can_use_tool(tool_name, input, context) coroutine.'), st(['u'], ['g', 'u'], 'Your code posts the request to an approval channel.'), st(['hu'], ['u', 'hu'], 'A human inspects the exact tool input and decides.'), st(['g'], ['hu', 'g'], 'The decision returns to the callback.'), st(['l'], ['g', 'l'], 'The decision is written to an audit log.'), st(['a'], ['g', 'a'], 'Allow resumes execution; Deny sends a message so Claude can choose another approach.')] };
  A.d_ent = { title: 'Enterprise agent architecture', overview: true,
    nodes: [n('ui', 'Users / API gateway', 'SSO, rate limits', 90, 150), n('o', 'Agent service', 'Agent SDK workers', 290, 150), n('gv', 'Governance', 'hooks, permissions, audit', 500, 60), n('m', 'MCP servers', 'CRM, DB, tickets', 700, 150), n('ob', 'Observability', 'logs, cost, traces', 500, 250)],
    edges: [['ui', 'o'], ['o', 'gv'], ['o', 'm'], ['o', 'ob']],
    steps: [st(['ui'], null, 'Authenticated requests arrive through a gateway that applies identity and quotas.'), st(['o'], ['ui', 'o'], 'Stateless workers run the Agent SDK in sandboxed containers; session ids are stored for resumption.'), st(['gv'], ['o', 'gv'], 'Hooks and permissions enforce policy and write audit trails.'), st(['m'], ['o', 'm'], 'Enterprise systems are reached only via vetted MCP servers with scoped credentials.'), st(['ob'], ['o', 'ob'], 'Cost (total_cost_usd), turns and errors are exported to monitoring.')] };
  A.d_lifecycle = ov(A.lifecycle, 'Agent execution lifecycle (architecture)');

  window.ANIMS = A;
})();
