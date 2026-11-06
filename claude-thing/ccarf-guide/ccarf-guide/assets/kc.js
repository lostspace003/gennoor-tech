/* Chapter knowledge checks: t=type, q=question, o=options, a=answer, e=explanation */
function M(q, o, a, e) { return { t: 'Multiple choice', q: q, o: o, a: a, e: e }; }
function Cn(q, a, e) { return { t: 'Conceptual', q: q, a: a, e: e }; }
function Sc(q, a, e) { return { t: 'Scenario', q: q, a: a, e: e }; }
function Cd(q, a, e) { return { t: 'Code interpretation', q: q, a: a, e: e }; }
KC.ch2 = [
  Cn('In one sentence, what does the Agent SDK give you that the Messages API does not?', 'The agent loop, built-in tools, permissions, hooks, MCP and session handling.', 'With the Messages API you write tool dispatch and context handling yourself.'),
  M('Which is the final message of a query() stream?', ['SystemMessage', 'AssistantMessage', 'ResultMessage', 'UserMessage'], 'C. ResultMessage', 'It carries subtype, turns, cost and session_id.'),
  Sc('A team needs file edits, shell commands and approvals with minimal code. Which fits best?', 'The Agent SDK.', 'It bundles those tools and a permission system; the raw API would need all of it hand-built.'),
  Cd('In e01_query, what does max_turns=8 do?', 'Caps agent-loop iterations (tool-use turns) at 8.', 'It is a safety limit against runaway loops; exceeding it yields error_max_turns.'),
  M('The Agent SDK was previously named:', ['Claude Tools SDK', 'Claude Code SDK', 'Claude Loop SDK', 'Anthropic Agents'], 'B. Claude Code SDK', 'Imports changed from claude_code_sdk to claude_agent_sdk.')];
KC.ch3 = [
  M('allowed_tools=["Read"] means:', ['Only Read exists', 'Read is auto-approved; others still may exist and ask', 'Read is blocked', 'Read is read-only'], 'B', 'allowed_tools pre-approves; it does not remove other tools. Use disallowed_tools to block.'),
  Cn('Difference between a custom string system_prompt and the claude_code preset with append?', 'A string replaces the default prompt; preset+append keeps Claude Code guidance and adds yours.', 'Choose preset for tool-heavy coding agents.'),
  Sc('You need multi-turn chat with interrupt support. Which API?', 'ClaudeSDKClient.', 'query() is a single exchange; the client keeps a session and supports interrupt().'),
  Cd('What does await client.query(...) followed by receive_response() do?', 'Sends a turn, then streams messages until the ResultMessage ends the turn.', 'It is how turns are executed in the client.'),
  M('Which permission_mode auto-approves file edits in the working directory?', ['default', 'plan', 'acceptEdits', 'dontAsk'], 'C', 'bypassPermissions approves almost everything and should be sandboxed.')];
KC.ch4 = [
  M('Which built-in tool is highest risk?', ['Read', 'Glob', 'Bash', 'Grep'], 'C', 'Bash runs arbitrary commands.'),
  Cn('What does is_error:true in a custom tool result do?', 'Tells Claude the tool failed so it can recover or explain.', 'The error goes back into the loop as a tool_result.'),
  Cd('Tool "check_stock" on server "inventory": what name goes in allowed_tools?', 'mcp__inventory__check_stock', 'Format mcp__<server>__<tool>.'),
  Sc('Claude keeps picking the wrong custom tool. First fix?', 'Improve the tool descriptions/schemas.', 'Descriptions are effectively prompts for tool selection.'),
  M('Which tool lets the main agent delegate?', ['Task list', 'Agent', 'Skill', 'Monitor'], 'B', 'Named "Task" in older versions; match both when parsing.')];
KC.ch5 = [
  M('MCP primitives are:', ['tools, resources, prompts', 'agents, hooks, sessions', 'models, tokens, caches', 'files, shells, webs'], 'A', 'Actions, data and templates.'),
  Cn('Why use an SDK-created MCP server?', 'No subprocess or network; functions run in your process with local state.', 'Standalone servers are better for sharing across apps.'),
  Sc('Three apps need the same Jira integration. SDK tool or standalone MCP server?', 'Standalone MCP server.', 'Write once, reuse by any MCP client.'),
  M('Which is NOT an MCP transport for mcp_servers?', ['stdio', 'http', 'sse', 'smtp'], 'D', 'smtp is not an MCP transport.'),
  Cn('Name two MCP security risks.', 'Untrusted servers running code/over-broad tokens; prompt injection via tool results.', 'Mitigate with vetting, least privilege, allow-lists, approvals.')];
KC.ch6 = [
  Cn('What returns to the parent when a subagent finishes?', 'Its final message (as the tool result), not its intermediate steps.', 'That is the context isolation benefit.'),
  M('Which AgentDefinition field drives automatic delegation choice?', ['prompt', 'description', 'model', 'tools'], 'B', 'Claude reads the description to decide.'),
  Sc('Three independent competitor analyses. Sequential or parallel?', 'Parallel subagents.', 'They are independent; parallel cuts latency.'),
  Sc('A trivial single-file fix. Multi-agent?', 'No - single agent.', 'Multi-agent adds cost and hand-off risk.'),
  Cn('Does a subagent see the parent conversation?', 'No. Pass needed context in the delegation prompt.', 'Fresh isolated context.')];
KC.ch7 = [
  M('Which event runs before a tool executes?', ['PostToolUse', 'PreToolUse', 'Stop', 'PreCompact'], 'B', ''),
  Cd('A hook returns {} - what happens?', 'No objection: execution proceeds.', 'To block, return hookSpecificOutput with permissionDecision "deny".'),
  Cn('Hooks vs tools?', 'Hooks run at lifecycle events regardless of Claude; tools are actions Claude chooses.', 'Use hooks for deterministic policy.'),
  M('Multiple PreToolUse hooks disagree. Which wins?', ['allow', 'ask', 'defer', 'deny'], 'D', 'deny > defer > ask > allow.'),
  Sc('You must log every tool result for audit. Mechanism?', 'PostToolUse hook.', 'See e09_hooks / s6_kb.')];
KC.ch8 = [
  Cn('Session vs context?', 'Session = persisted transcript with an id; context = tokens in the model window now.', ''),
  M('Which option branches a session into a new id?', ['resume only', 'fork_session=True with resume', 'continue_conversation', 'max_turns'], 'B', ''),
  Cd('In e10_session, why does the fresh-session call not know the revenue?', 'It was not resumed, so history is absent.', ''),
  Sc('A huge tool output keeps filling the context. Options?', 'Subagents, targeted Grep, shorter outputs, compaction.', ''),
  M('Does fork_session roll back files?', ['Yes', 'No - conversation only', 'Only Write', 'Only Bash'], 'B', 'Use file checkpointing for files.')];
KC.ch9 = [
  M('Deny rules in bypassPermissions mode:', ['Ignored', 'Still apply', 'Prompt the user', 'Apply to Bash only'], 'B', ''),
  Cn('Mode vs callback?', 'Mode = static baseline; callback = dynamic per-call decision (e.g. human).', ''),
  Sc('Agent reads web pages and has email-sending tool. Risk?', 'Prompt injection driving data exfiltration; require approval and limit tools.', ''),
  Cd('What does PermissionResultDeny(message=...) do?', 'Blocks the tool and shows Claude the message so it can adapt.', ''),
  Cn('Where should bypassPermissions be used?', 'Only in isolated sandboxes.', '')];
KC.ch10 = [
  M('Where is structured output returned?', ['AssistantMessage.text', 'ResultMessage.structured_output', 'SystemMessage', 'UserMessage'], 'B', ''),
  Cn('Is total_cost_usd exact billing?', 'No, a client-side estimate.', ''),
  Cd('In e13_errors, why is there both a ResultMessage and an exception?', 'Single-shot query() yields the error ResultMessage and then raises.', ''),
  Sc('Cap spending per run.', 'max_budget_usd (and max_turns).', ''),
  Cn('Which usage field includes subagents?', 'model_usage.', 'usage covers the main loop only.')];
KC.ch11 = [
  Sc('Always-on policy across all tool calls: which control?', 'Hooks.', ''),
  Sc('Limit blast radius of a compromised agent?', 'Sandbox/container, scoped credentials.', ''),
  Cn('Why store session ids externally?', 'To resume after worker restarts.', ''),
  Sc('Large refund approvals?', 'can_use_tool + approval queue + audit.', ''),
  Cn('Why enforce limits in both callback and backend?', 'Defense in depth.', '')];
KC.ch12 = [
  Cn('Scenario 3: why does the reviewer have no tools?', 'Least privilege; it only critiques text it is given.', ''),
  Cn('Scenario 5: which control decides refunds >$100?', 'can_use_tool callback.', ''),
  Cd('Scenario 6: what does the PostToolUse hook collect?', 'Names of tools used.', ''),
  Cn('Scenario 4: why MCP rather than custom tools?', 'Shared, team-owned systems reused by other apps.', ''),
  Cn('Scenario 1: why acceptEdits?', 'It lets the agent write summary.md without prompting.', '')];
