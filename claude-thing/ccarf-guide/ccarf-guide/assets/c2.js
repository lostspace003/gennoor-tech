/* Chapters 4-6: tools, MCP, subagents */
chapter('ch4', '4. Built-in and custom tools', 'core',
  concept('4.1 Built-in tools and the tool lifecycle', {ex: 'e05_tools',
    what: 'Tools are actions Claude can request. The SDK ships built-in tools so the agent can work with files, the shell and the web without you writing code.',
    why: 'An LLM alone can only produce text. Tools give it hands: read data, change files, run commands, fetch pages.',
    how: 'Claude emits a <code>ToolUseBlock</code> (name + JSON input). The SDK runs hooks and permission checks, executes the tool, and returns a <code>ToolResultBlock</code> (<code>is_error</code> flags failures; Claude sees the error and can retry or change approach).',
    analogy: 'A workshop: Claude is the craftsperson asking an assistant to fetch or operate a specific instrument; a supervisor (permissions) may say no.',
    example: 'Code-fix agent: Grep finds the failing function, Read opens the file, Edit patches it, Bash runs the tests.',
    arch: 'Tool runtime sits after the gate (hooks → permissions) and returns results into the loop (see Tool execution architecture).',
    when: 'Prefer built-ins when they fit; add custom tools only for domain-specific actions.',
    exam: 'Tool failures are returned to Claude as results (not exceptions in your app); Claude decides whether to retry.' }) +
  tbl(['Tool', 'Purpose', 'Risk / note'], [
    ['Read', 'Read a file (text, images, PDFs)', 'Low; read-only'],
    ['Write', 'Create/overwrite a file', 'Modifies files; gated by permissions'],
    ['Edit', 'Exact string replacement in a file', 'Modifies files; fails if match not unique'],
    ['Bash', 'Run shell commands', 'Highest risk: arbitrary command execution; restrict/sandbox'],
    ['Grep', 'Regex content search', 'Read-only. Docs say Grep/Glob may be absent by default on some platforms - verify in your environment'],
    ['Glob', 'File-name pattern search', 'Read-only (same availability note)'],
    ['Agent', 'Launch a subagent (named <code>Task</code> in older versions; the init tools list may still show "Task")', 'Must be in allowed_tools for delegation; match both names when parsing'],
    ['WebSearch', 'Search the web', 'Untrusted results → prompt-injection surface'],
    ['WebFetch', 'Fetch and read a URL', 'Same; consider domain restrictions']]) +
  note('Verified against code.claude.com tools-reference and agent-loop pages (Nov 2026). Other built-ins exist (NotebookEdit, Skill, AskUserQuestion, task tools replacing legacy TodoWrite, etc.) - the list evolves, so consult the official tools reference.') +
  anim('d_tool') +
  concept('4.2 Custom tools with @tool', {ex: 'e06_custom',
    what: 'A custom tool is your own Python function exposed to Claude. You decorate it with <code>@tool(name, description, input_schema)</code> and bundle it with <code>create_sdk_mcp_server</code>.',
    why: 'Built-in tools cannot know your business systems (inventory, CRM, pricing). Custom tools expose them safely with typed inputs.',
    how: 'The handler is <code>async def f(args: dict) -> dict</code> returning <code>{"content": [{"type":"text","text":...}], "is_error": bool}</code>. The tool runs <b>in your process</b>. Names become <code>mcp__&lt;server&gt;__&lt;tool&gt;</code>; add them to <code>allowed_tools</code> to pre-approve.',
    analogy: 'Adding a new button to the assistant\'s phone: a clearly labeled, typed action.',
    example: 'Inventory agent that checks stock before quoting delivery dates.',
    arch: 'In-process MCP server: no subprocess or network hop, so your function can use local state and credentials.',
    when: 'Use for private business logic. Use an external MCP server when the tool is shared across apps/languages or already exists.',
    exam: 'Remember the <b>mcp__server__tool</b> naming and that <code>is_error</code> reports failure to Claude. Tool descriptions are prompts: vague descriptions cause wrong tool selection.' }) +
  anim('customtool') +
  '<h3>4.3 Tool restrictions and orchestration</h3><ul><li><b>Restrict:</b> <code>disallowed_tools</code>, narrow <code>allowed_tools</code>, hooks, permission modes, subagent <code>tools</code> lists.</li><li><b>Orchestrate:</b> Claude may call several tools in one turn; read-only tools (annotated <code>readOnlyHint</code>) can run in parallel. Chain dependencies naturally by results.</li><li><b>Annotations:</b> <code>ToolAnnotations</code> (readOnlyHint, destructiveHint, idempotentHint, openWorldHint) describe behavior.</li><li>MCP wildcards: <code>allowed_tools=["mcp__github__*"]</code> is valid; a global <code>*</code> is ignored.</li></ul>' + kc('ch4'));

chapter('ch5', '5. MCP architecture and integration', 'core',
  concept('5.1 Model Context Protocol (MCP)', {ex: 'e07_mcp',
    what: 'MCP is an open protocol that standardizes how AI applications connect to tools, data (<b>resources</b>) and reusable <b>prompts</b>. The AI app hosts an <b>MCP client</b>; each integration is an <b>MCP server</b>.',
    why: 'Without a standard, every tool×app pair needs custom glue. With MCP, write a server once and any MCP client (Claude Code, Agent SDK, others) can use it.',
    how: 'Client and server exchange JSON-RPC messages over a transport: <b>stdio</b> (local subprocess), <b>http</b> (remote streamable HTTP) or <b>sse</b> (legacy remote). The client calls <code>tools/list</code> then <code>tools/call</code>. Servers expose three primitives: tools (actions), resources (data), prompts (templates).',
    analogy: 'USB-C for AI: one port shape, many devices.',
    example: 'An enterprise assistant connects to a GitHub MCP server (HTTP) and a local filesystem server (stdio).',
    arch: 'Agent → built-in MCP client → transport → MCP server → external system; results return the same way.',
    when: 'Use MCP for integrations shared across apps or maintained by others. Use SDK tools for app-private logic.',
    exam: 'Know client vs server roles, the three primitives, transports, and the tool-name format.' }) +
  anim('mcp') +
  concept('5.2 SDK-created MCP servers', {
    what: '<code>create_sdk_mcp_server(name, version, tools)</code> builds an in-process MCP server from <code>@tool</code> functions (<code>type</code> "sdk").',
    why: 'Avoids running separate processes, handling IPC and deployment of another service for simple custom tools.',
    how: 'The returned config goes into <code>mcp_servers</code>. The SDK routes tool calls to your Python functions directly.',
    analogy: 'A built-in extension vs. a separately installed app.',
    example: 'See chapter 4.2 inventory server.',
    when: 'Single-app tools needing local state. Choose standalone when multiple clients/languages need it, or it must be isolated/sandboxed separately.',
    exam: 'In-process = no network/subprocess, same security boundary as your app.' }) +
  anim('d_sdkmcp') +
  '<h3>5.3 Authentication, authorization and security</h3><ul><li><b>Auth:</b> pass tokens via <code>headers</code>/<code>env</code> from a secret store; never hard-code. Server-side, authorize per user (OAuth scopes), not just per agent.</li><li><b>Least privilege:</b> expose narrow tools (<code>get_invoice</code>) rather than raw SQL; allow only needed tools.</li><li><b>Untrusted servers:</b> third-party MCP servers run code or return text that may contain prompt injection; vet, pin versions, log calls.</li><li><b>Human approval</b> for write/destructive tools.</li></ul>' +
  tbl(['Comparison', 'Left', 'Right', 'Choose'], [
    ['Client vs server', 'MCP client: inside the AI app; discovers and calls tools', 'MCP server: exposes tools/resources/prompts', 'You build servers to publish capability; the SDK already is a client'],
    ['SDK server vs standalone', 'In-process, Python functions', 'Separate process/service, any language', 'SDK for private/simple; standalone for sharing and isolation'],
    ['SDK tools vs MCP tools', 'Custom tools are themselves delivered via an in-process MCP server', 'External MCP tools', 'Same naming and permissions; differ in where code runs'],
    ['Function calling vs MCP', 'Tool schema defined per application', 'Standard protocol, reusable servers', 'MCP for reuse; function calling for one app'],
    ['Agent SDK vs MCP', 'Framework running the agent loop', 'Protocol for connecting tools', 'Complementary, not alternatives']]) +
  kc('ch5'));

chapter('ch6', '6. Subagents and multi-agent systems', 'core',
  concept('6.1 Subagents and the Agent tool', {ex: 'e08_sub',
    what: 'A subagent is a specialized agent the main agent can delegate to through the <b>Agent</b> tool. It has its own prompt, tools and (optionally) model, and runs in an <b>isolated context</b>.',
    why: 'Keeps the main context clean (only a summary comes back), allows specialization and least-privilege tools, and enables parallel work.',
    how: 'Define subagents in <code>agents={"name": AgentDefinition(description, prompt, tools, model)}</code> and include <code>"Agent"</code> in <code>allowed_tools</code>. Claude picks a subagent from its <code>description</code> (or you name it). The subagent runs, and its <b>final message</b> returns to the parent as the tool result. Subagents cannot see the parent history, so the delegation prompt must carry needed context.',
    analogy: 'A manager hands a self-contained brief to a specialist and only reads the specialist\'s memo, not their whole notebook.',
    example: 'A due-diligence agent delegates "find risks in contracts" to a read-only reviewer and "compute exposure" to an analyst with Bash.',
    arch: 'Main agent = orchestrator; each Agent call spawns a child run with fresh context; only the final text returns.',
    when: 'Use multi-agent when tasks are separable, context would overflow, or specialization/parallelism pays off. Use a single agent for simple, tightly coupled tasks (less cost, less coordination).',
    exam: 'Key points: <b>context isolation</b>, results return as summaries, parent must pass context explicitly, subagents are defined by description/prompt/tools/model, delegation requires the Agent tool. Subagents cannot be nested arbitrarily - check current docs for depth limits.' }) +
  anim('subagent') + anim('multiagent') +
  tbl(['Aspect', 'Main agent', 'Subagent'], [
    ['Context', 'Accumulates full conversation', 'Fresh, isolated window'],
    ['Tools', 'Per options', 'Per AgentDefinition (or inherited)'],
    ['Talks to user', 'Yes', 'No - reports to parent'],
    ['Result', 'ResultMessage', 'Final message as tool result']]) +
  tbl(['Aspect', 'Single-agent', 'Multi-agent'], [
    ['Complexity / cost', 'Lower', 'Higher (more model calls)'],
    ['Context', 'One window can fill', 'Distributed'],
    ['Specialization', 'Generalist', 'Role-specific prompts/tools'],
    ['Parallelism', 'Limited', 'Independent tasks in parallel'],
    ['Failure modes', 'Simpler to debug', 'Lost context in hand-offs, coordination errors']]) +
  tbl(['Sequential', 'Parallel'], [['Step B needs A\'s output (plan → research → write)', 'Independent subtasks (research 3 competitors); faster, same cost'], ['Easier debugging', 'Aggregate results afterward']]) +
  kc('ch6'));
