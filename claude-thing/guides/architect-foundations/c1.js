/* Chapters 2-3: fundamentals, configuration & execution */
chapter('ch2', '2. Claude Agent SDK fundamentals', 'core',
  note('<b>Naming:</b> the SDK was previously called the <i>Claude Code SDK</i> and was renamed the <b>Claude Agent SDK</b>. Python package: <code>claude-agent-sdk</code> (import <code>claude_agent_sdk</code>); TypeScript: <code>@anthropic-ai/claude-agent-sdk</code>.') +
  concept('2.1 What the Agent SDK is', {ex: 'e01_query',
    what: 'The Claude Agent SDK is a library that lets your program run the same <b>agent loop</b> that powers Claude Code: Claude reasons, calls tools (read files, run commands, search the web, call your functions), looks at the results and repeats until the task is done. You write a prompt and options; the SDK runs the loop for you.',
    why: 'With the plain Anthropic API (the Messages API) <i>you</i> must write the loop: send messages, detect tool_use, run the tool, send back tool_result, manage context growth, handle permissions and retries. The Agent SDK gives you that harness (built-in tools, context management, permissions, hooks, MCP, sessions) ready-made.',
    how: 'Your app calls <code>query()</code> or <code>ClaudeSDKClient</code>. The SDK starts the agent runtime, which sends the conversation and tool definitions to Claude, executes returned tool calls (subject to permissions and hooks), appends results, and loops. The SDK streams typed messages back to you (<code>SystemMessage</code>, <code>AssistantMessage</code>, <code>UserMessage</code> carrying tool results, and finally <code>ResultMessage</code>).',
    analogy: 'The Messages API is a very smart consultant you must instruct step by step by letter. The Agent SDK is hiring that consultant into an office with a desk, files, a phone and a manager (permissions) - you just hand over the assignment.',
    example: 'A compliance team wants an agent that scans a folder of contracts, extracts renewal dates and writes a CSV. With the SDK they enable Read/Glob/Grep/Write and give a prompt; no orchestration code is needed.',
    walk: ['<code>ClaudeAgentOptions</code> declares what the agent may do.', '<code>query()</code> starts the loop; nothing runs until you iterate.', 'Claude calls Glob, then Read, then answers - each is a turn.', '<code>ResultMessage</code> carries final metrics and the <code>session_id</code> for later resume.'],
    arch: 'Your app → Agent SDK (typed API) → agent runtime (loop, context, tool dispatch) → Claude via the Anthropic API; tools, MCP servers and hooks hang off the runtime.',
    when: 'Choose the SDK when the task needs multi-step tool use over files, code, the web or enterprise systems. Use the plain Messages API for single-shot generation, classification or when you want full control over every step.',
    exam: 'Know that the SDK <b>owns the loop</b> and ships built-in tools; the Messages API does not. Do not confuse SDK (library you embed) with the Claude Code CLI/app (an end-user product built on the same engine).' }) +
  anim('d_sdk') + anim('lifecycle') +
  '<h3>2.2 Agent execution loop and lifecycle</h3><ol><li><b>Prompt</b> enters (string or streamed input).</li><li><b>Model call</b>: Claude returns text and/or <code>tool_use</code> blocks.</li><li><b>Gate</b>: hooks → deny rules → permission mode / allow rules → <code>can_use_tool</code>.</li><li><b>Tool execution</b> and <code>tool_result</code> appended.</li><li><b>Repeat</b> until Claude responds without tool calls, <code>max_turns</code> is hit, or an error/interrupt occurs.</li><li><b>ResultMessage</b> with <code>subtype</code> (e.g. success or an error subtype), cost, usage, session id.</li></ol>' +
  '<h3>2.3 Comparisons that are commonly confused</h3>' +
  tbl(['Aspect', 'Claude Agent SDK', 'Claude Code', 'Anthropic API (Messages)'], [
    ['Definition', 'Library to embed the agent loop in your app', 'Ready-made coding assistant (CLI / desktop / IDE)', 'Raw model endpoint'],
    ['Who writes the loop?', 'SDK', 'Product', 'You'],
    ['Built-in tools', 'Yes (Read, Write, Edit, Bash, Grep, Glob, WebSearch, WebFetch, Agent ...)', 'Yes (same engine)', 'No (you define tools; server tools such as web search are opt-in)'],
    ['Interface', 'Python / TypeScript code', 'Terminal, IDE, desktop', 'HTTP / client SDKs'],
    ['Best for', 'Custom agents in products, pipelines, services', 'Interactive developer work', 'Chat, extraction, classification, custom orchestration']]) +
  tbl(['Aspect', 'Agent SDK', 'Traditional function calling'], [
    ['Loop', 'Automatic', 'Manual: you detect tool_use, run, return tool_result'],
    ['Tool set', 'Built-ins + custom + MCP', 'Only what you implement'],
    ['Permissions/hooks', 'Built in', 'Write your own'],
    ['Context/session mgmt', 'Built in (resume, compaction)', 'Your responsibility'],
    ['Control', 'Higher-level, less granular', 'Maximum granularity']]) +
  examNote('Typical scenario: "A team needs file-editing, shell and web tools with approvals in a few lines of code" → Agent SDK. "Simple structured extraction from one document" → Messages API.') +
  '<h3>2.4 Capabilities and limitations</h3><ul><li><b>Can:</b> multi-step tool use, subagents, MCP, hooks, sessions, streaming, structured outputs, permission control.</li><li><b>Limits:</b> bounded by context window and cost; non-deterministic; autonomous actions require governance; the runtime needs a host able to run its process (Node-based CLI is bundled/required depending on version); latency of multi-turn loops.</li></ul>' +
  kc('ch2'));

chapter('ch3', '3. Agent configuration and execution', 'core',
  concept('3.1 ClaudeAgentOptions', {ex: 'e02_options',
    what: '<code>ClaudeAgentOptions</code> is a dataclass bundling every runtime setting of an agent run: system prompt, model, tools, permission mode, MCP servers, subagents, hooks, session behavior, turn limits and working directory.',
    why: 'Configuration is how you shape <i>what the agent knows, can do, and may do</i>. Most architectural decisions in the exam map to one option.',
    how: 'You build the object once and pass it to <code>query(options=...)</code> or <code>ClaudeSDKClient(options=...)</code>. The SDK forwards it to the runtime at startup.',
    analogy: 'A job description plus a badge: system prompt = the role, allowed_tools = the keys on the badge, permission_mode = how much supervision applies, max_turns = the time budget.',
    example: 'A support-ticket triage agent: read-only tools, strict system prompt, <code>max_turns=10</code>, model set to a fast model, cwd pointing at the knowledge-base folder.',
    walk: ['<code>allowed_tools</code> = pre-approval list; <code>disallowed_tools</code> = hard block that overrides allow.', '<code>permission_mode</code> sets the baseline for everything not explicitly listed.', '<code>max_turns</code> prevents runaway loops.'],
    arch: 'Options are the single configuration surface of the runtime layer in the SDK architecture diagram.',
    when: 'Always. Create per-use-case option objects (research agent vs. editing agent) rather than one giant permissive configuration.',
    exam: 'Common trap: <b><code>allowed_tools</code> means "approve without asking", not "only these tools exist"</b>. To truly remove a tool use <code>disallowed_tools</code> (or restrict the tool set), and a deny rule always beats an allow.' }) +
  concept('3.2 System prompts and model selection', {ex: 'e03_prompt',
    what: 'The system prompt tells Claude its role and rules. You can pass a plain string, or the Claude Code preset with extra instructions appended. The <code>model</code> option picks the model.',
    why: 'Behavior, tone, output format and safety rules are controlled here. Different tasks need different cost/quality trade-offs (a small fast model for triage, a stronger one for analysis).',
    how: 'A string <i>replaces</i> the default prompt (so Claude loses built-in coding guidance); the preset form keeps Claude Code\'s tool-usage guidance and lets you <code>append</code> your own text. Filesystem settings (CLAUDE.md, .claude/settings.json) are controlled by <code>setting_sources</code>: per the migration guide, omitting it loads user, project and local settings, while <code>setting_sources=[]</code> isolates the run (verify against your installed version).',
    analogy: 'The system prompt is the employee handbook; the model is how senior the employee is.',
    example: 'A finance agent appends "Never reveal account numbers; always show currency" to the preset prompt.',
    when: 'Use a custom string for narrow, non-coding agents. Use the preset + append for agents that rely on file/shell tools.',
    exam: 'Know the difference between replacing and appending; know that model choice is an option, and subagents can override the model individually.' }) +
  '<h3>3.3 Query and execution patterns</h3>' +
  tbl(['Pattern', 'API', 'Characteristics', 'Use when'], [
    ['One-shot', '<code>query(prompt=..., options=...)</code>', 'Async iterator; new session each call unless resumed; no interrupts', 'Batch jobs, pipelines, single task'],
    ['Interactive client', '<code>ClaudeSDKClient</code>', 'Long-lived session; <code>client.query()</code> + <code>receive_response()</code>; supports <code>interrupt()</code>, hooks, <code>can_use_tool</code>, custom tools', 'Chat UIs, multi-turn, approval flows'],
    ['Streaming input', 'Pass an <code>AsyncIterable</code> as prompt', 'Lets you feed messages over time', 'Required by <code>can_use_tool</code> with <code>query()</code>']]) +
  concept('3.4 Streaming, async execution and state', {ex: 'e04_client',
    what: 'Everything in the SDK is <b>async</b>: you consume an async iterator of messages as Claude works instead of waiting for one final blob.',
    why: 'Agent runs take seconds to minutes. Streaming lets you show progress, log tool calls live, and stop early.',
    how: '<code>async for msg in query(...)</code> yields messages in order. With <code>ClaudeSDKClient</code>, <code>await client.query(text)</code> sends a turn and <code>client.receive_response()</code> yields messages until a <code>ResultMessage</code>. State = conversation history kept by the session (not Python variables).',
    analogy: 'Watching a live sports feed instead of reading tomorrow\'s newspaper.',
    example: 'A chat UI that prints "Reading policy.pdf…" as soon as a <code>ToolUseBlock</code> appears.',
    arch: 'Streaming sits between the runtime and your app: typed messages are the contract for progress, tool visibility and final results.',
    when: '<code>query()</code> for fire-and-forget; <code>ClaudeSDKClient</code> when you need continuity, interrupts or interactivity.',
    exam: '<b>Client vs query:</b> client = same session across turns, supports interrupt; query = single exchange. Message order always ends with a ResultMessage.' }) +
  kc('ch3'));
