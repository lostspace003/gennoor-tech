/* Chapters 8-10: Agent SDK, Multi-agent, MCP */

chapter('ch8', '8. Agent SDK: execution loop & checkpointing', 'core',
'<h2>TicketFlow: Week 8</h2>' +
'<p>You\'re building a long-running resolution workflow: classify → research KB → attempt fix → verify. Takes 20 steps. Workers sometimes crash mid-task. Without checkpointing, it restarts from step 1 every time. You implement state persistence: after each step, save progress to disk. On crash, resume from last checkpoint.</p>' +

concept('8.1 Agent SDK overview', {
  what: 'The Claude Agent SDK is a framework that runs the agent loop for you: Claude reasons, calls tools, reads results, repeats. It ships built-in tools (Read, Write, Bash, Grep), permission controls, hooks, MCP, and session management.',
  why: 'With Messages API you write the tool-dispatch loop yourself. The Agent SDK gives you that harness ready-made, plus governance (permissions, hooks) and built-in tools.',
  how: 'Install <code>claude-agent-sdk</code>. Call <code>query(prompt=..., options=ClaudeAgentOptions(...))</code>. SDK runs the loop and streams back typed messages.',
  analogy: 'Messages API = LEGO bricks (you build the structure). Agent SDK = pre-assembled kit with instructions.',
  when: 'Use Agent SDK for: multi-step workflows needing file/shell/web tools. Use Messages API for: single-shot generation, custom tool-only workflows.',
  exam: 'Exam: "Need file editing + shell + approvals in a few lines" → Agent SDK. "Simple extraction, no tools" → Messages API.'
}) +

note('This guide focuses on production Messages API + custom agents (exam scope). For Agent SDK deep dive, see the CCAR-F guide.') +

concept('8.2 Checkpointing pattern', { ex: 'e08_checkpoint',
  what: 'Checkpointing means saving intermediate agent state (current step, message history, metadata) to persistent storage after each step. On crash/restart, reload the checkpoint and resume from where it left off.',
  why: 'Long-running tasks (20+ steps) risk losing hours of work if a worker crashes. Checkpointing makes agents fault-tolerant.',
  how: 'After each Claude call or state transition, serialize state to JSON file (or DB). On init, check for existing checkpoint; if found, reload state and continue.',
  analogy: 'Video game save points. Without saves: die → restart from level 1. With saves: die → reload from last checkpoint.',
  example: 'TicketFlow resolution agent crashes on step 15. Without checkpointing: restart from step 1. With checkpointing: resume from step 15.',
  arch: 'Step 1 → save state → step 2 → save state → crash → reload state → resume step 2.',
  when: 'Checkpoint in: stateless workers (can restart anytime), long multi-step tasks, critical workflows where re-running is expensive.',
  exam: 'Exam: "20-step task, worker crashes" → checkpointing enables resume. NOT "increase timeout" or "run two in parallel."'
}) +

anim('checkpoint_resume') +

'<h3>8.3 Resumability requirements</h3>' +
'<ol>' +
'<li><b>Stateless workers:</b> Don\'t rely on in-memory state. Write checkpoints to shared storage (DB, S3).</li>' +
'<li><b>Idempotent steps:</b> Re-running a step from checkpoint should be safe (no double-charge, no duplicate record).</li>' +
'<li><b>Checkpoint after each step:</b> Not just at the end. Granular saves minimize lost work.</li>' +
'</ol>' +

kc('ch8'));

chapter('ch9', '9. Multi-agent orchestration & workflows', 'core',
'<h2>TicketFlow: Week 9</h2>' +
'<p>Complex tickets span billing, technical, and product issues. A single agent loses track of which sub-issue it resolved. You refactor to an orchestrator pattern: one main agent delegates billing → billing agent, technical → tech agent, escalations → human-in-loop agent. Each specialist has focused tools and prompts. Orchestrator merges results.</p>' +

concept('9.1 Orchestrator + subagents', {
  what: 'Multi-agent orchestration uses one main agent (orchestrator) that decomposes the task and delegates sub-tasks to specialized subagents. Each subagent has its own prompt, tools, and model. Only final results return to the orchestrator.',
  why: 'Single agents struggle with multi-domain tasks, context overflow, and state tracking across unrelated sub-issues. Specialists with scoped contexts handle complexity better.',
  how: 'Orchestrator analyzes request → identifies sub-tasks → spawns subagents (can run in parallel) → collects results → synthesizes final answer.',
  analogy: 'A general contractor delegates plumbing to a plumber, electrical to an electrician. Each specialist knows their domain deeply.',
  example: 'TicketFlow ticket: "Charged twice + app crashes + want dark mode." Orchestrator delegates: billing agent (refund tool), tech agent (logs tool), feature agent (read-only).',
  arch: 'Orchestrator → subagent 1 (isolated context) → subagent 2 (isolated context) → merge results.',
  when: 'Use multi-agent for: separable sub-tasks, context would overflow, specialization/parallelism pays off. Use single agent for: tightly coupled small tasks.',
  exam: 'Exam: "3 independent competitor analyses" → parallel subagents. "Simple one-file fix" → single agent (multi-agent adds cost/coordination).'
}) +

anim('orchestrator') +

'<h3>9.2 Single-agent vs multi-agent decision matrix</h3>' +
tbl(['Factor', 'Single agent', 'Multi-agent'], [
  ['Task complexity', 'Straightforward, tightly coupled', 'Multi-domain, separable sub-tasks'],
  ['Context', 'Fits in one window', 'Would overflow or dilute'],
  ['Specialization', 'Generalist works', 'Domain-specific tools/prompts needed'],
  ['Parallelism', 'Sequential is fine', 'Independent tasks → faster with parallel'],
  ['Cost', 'Lower (fewer model calls)', 'Higher (more calls + coordination overhead)'],
  ['Failure modes', 'Simpler to debug', 'Lost context in hand-offs, coordination bugs']
]) +

examNote('Exam trap: multi-agent for everything. Correct: use when separation, specialization, or parallelism justifies the cost.') +

concept('9.3 Workflow vs agent hybrid', {
  what: 'A hybrid architecture uses deterministic workflows for the standard path and invokes an agent only at decision points (unexpected formats, edge cases).',
  why: 'Standard operations (extract invoice, validate schema) are fast, cheap, and reliable with rules. Agents add cost and non-determinism. Reserve agents for where flexibility is needed.',
  how: 'Workflow handles 90% of cases (rule-based). At decision point (e.g., unexpected format), invoke agent to decide: re-route, flag, or escalate.',
  analogy: 'Airport security: standard scanner (deterministic) for most passengers. Suspicious bag → call human agent (flexible reasoning).',
  example: 'TicketFlow invoice processing: standard extraction (workflow) → schema validation (workflow) → unexpected format detected → agent decides (re-route vs flag).',
  when: 'Use hybrid when: high-volume standard path + occasional exceptions. Keeps cost low, reliability high, flexibility available.',
  exam: 'Exam: "Mostly standard invoices, occasional weird format" → workflow + agent at decision point. NOT fully autonomous agent for all.'
}) +

anim('workflow_agent') +

kc('ch9'));

chapter('ch10', '10. MCP servers & cross-team reuse', 'core',
'<h2>TicketFlow: Week 10</h2>' +
'<p>Three teams need the same Jira and CRM integrations. Copying custom tool code into each app creates drift and duplicate maintenance. You build an MCP server: Jira/CRM tools exposed via the Model Context Protocol. All teams consume it as a shared service. Write once, reuse everywhere.</p>' +

concept('10.1 Model Context Protocol (MCP)', {
  what: 'MCP is an open protocol standardizing how AI apps connect to tools, data (resources), and prompts. You write an MCP server (exposes tools/resources); any MCP client (Claude Code, Agent SDK, others) can consume it.',
  why: 'Without MCP, every app×integration pair needs custom glue. With MCP, write the integration once; all apps reuse it via the standard protocol.',
  how: 'MCP servers expose tools, resources, prompts via JSON-RPC over stdio/http/sse. Client calls <code>tools/list</code> to discover, <code>tools/call</code> to execute.',
  analogy: 'USB-C for AI integrations. One port shape, many devices.',
  example: 'TicketFlow MCP server exposes <code>jira_create_issue</code>, <code>crm_lookup_customer</code>. Three apps connect to it: TicketFlow, Escalation Dashboard, Analytics.',
  arch: 'App → MCP client (built into SDK) → JSON-RPC transport → MCP server → external system (Jira/CRM).',
  when: 'Build MCP server for: shared integrations across teams/apps. Use SDK custom tools for: app-private logic.',
  exam: 'Exam: "Same integration needed by 3 apps in different languages" → MCP server. "Private tool for one app" → custom tool.'
}) +

'<h3>10.2 Built-in tool vs custom tool vs Skill vs MCP</h3>' +
tbl(['Mechanism', 'Use when', 'Example'], [
  ['Built-in tool (Read, Bash)', 'Standard file/shell operations', 'Read config.json'],
  ['Custom tool (@tool decorator)', 'App-private business logic', 'TicketFlow-specific pricing calc'],
  ['Skill (Claude Code)', 'Reusable instructions + scripts for dev workflow', 'Database migration checklist'],
  ['MCP server', 'Shared integration across teams/apps', 'Jira/CRM connector used by 5 services']
]) +

examNote('Exam: "Which to choose?" → match scope and reuse needs. Shared → MCP. Private → custom tool. Dev workflow → Skill.') +

'<h3>10.3 MCP tool naming</h3>' +
note('MCP tools appear to Claude as <code>mcp__&lt;server&gt;__&lt;tool&gt;</code>. Example: server "jira", tool "create_issue" → <code>mcp__jira__create_issue</code>. Add to <code>allowed_tools</code> to pre-approve.') +

'<h3>10.4 MCP security considerations</h3>' +
'<ul>' +
'<li><b>Authentication:</b> Pass tokens via headers/env from secrets manager, not hard-coded.</li>' +
'<li><b>Authorization:</b> Server must enforce per-user scopes (OAuth), not just per-app.</li>' +
'<li><b>Untrusted servers:</b> Third-party MCP servers run code and return text (prompt injection vector). Vet, pin versions, log calls.</li>' +
'<li><b>Least privilege:</b> Expose narrow tools (<code>get_invoice</code>) not raw SQL access.</li>' +
'</ul>' +

examNote('Exam: "MCP tool results contain injection attempt" → treat as untrusted data, restrict tools/egress, require approval for side effects.') +

kc('ch10'));
