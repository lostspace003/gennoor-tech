/* Explanation cards for the code player. Each entry: [anchor substring of the line where the block starts, hooky title, explanation]. */
window.ANN = {};
function AN(n, out, a) { window.ANN[n] = { out: out, a: a }; }

AN('e01_query', 'Claude picked <b>Glob</b> first (find the files), then <b>Grep</b> (search inside them), then answered. Two tool turns, a tiny cost estimate, and a <code>session_id</code> you can resume later.', [
  ['from claude_agent_sdk import', '📦 One import, the whole toolkit', '<code>query</code> runs the agent, <code>ClaudeAgentOptions</code> configures it, and the message classes let you tell what Claude is doing at each moment.'],
  ['options = ClaudeAgentOptions(', '🧰 Write the job description', '<b>allowed_tools</b> pre-approves read-only tools, <b>max_turns</b> stops runaway loops, <b>cwd</b> says where the tools work. Nothing here lets Claude change a file.'],
  ['async for msg in query(', '🌊 Nothing happens until you iterate', '<code>query()</code> returns an <b>async iterator</b>. The agent loop advances as you consume messages, so you see progress live instead of waiting for one big answer.'],
  ['if isinstance(msg, AssistantMessage)', '🔍 Read the stream like a detective', 'A <b>ToolUseBlock</b> means "Claude chose a tool". A <b>TextBlock</b> is words for you. Printing both lets you watch the reasoning turn into actions.'],
  ['elif isinstance(msg, ResultMessage)', '🏁 The last message is the receipt', 'Always the final message: turns used, estimated cost, and the <b>session id</b> that lets you resume this conversation later.']]);

AN('e02_options', 'Claude tried <b>Bash</b>. The SDK refused because the tool is in <code>disallowed_tools</code>, and Claude turned that refusal into an explanation instead of crashing.', [
  ['options = ClaudeAgentOptions(', '🎛️ Every knob on one object', 'System prompt, model, allow list, deny list, permission mode, turn cap. This single object is where most architecture decisions live.'],
  ['allowed_tools=', '✅ Allowed ≠ "only these"', '<b>allowed_tools</b> means <i>approved without asking</i>. It does not hide other tools. This is one of the most common exam traps.'],
  ['disallowed_tools=', '⛔ Deny always wins', 'A tool in <b>disallowed_tools</b> is blocked even if something else would allow it. This is how you truly remove Bash.'],
  ['async def main', '🚦 Try to break the rule', 'We ask Claude to run a cleanup script, which needs Bash. Watch what the SDK does with the request.']]);

AN('e03_prompt', 'The preset form kept Claude Code\'s tool guidance <i>and</i> added your citation rule, so the answer cites <code>hr/remote.md</code>.', [
  ['custom = ', '✍️ Option 1: replace the prompt', 'A plain string <b>replaces</b> the default prompt. Great for a narrow, non-coding agent, but it drops built-in guidance on using tools.'],
  ['preset = ', '➕ Option 2: keep the guidance, add rules', 'The <code>claude_code</code> preset keeps the built-in tool-usage guidance, and <b>append</b> adds your own rule on top.'],
  ['async def main', '🧪 Compare and run', 'Print both prompt shapes, then run the preset agent so you can see the rule being followed.']]);

AN('e04_client', 'Turn 2 never repeated the PTO question, yet the agent knew what "contractors" meant. That continuity is the whole point of <code>ClaudeSDKClient</code>.', [
  ['async with ClaudeSDKClient', '🔌 Open one persistent session', 'The client keeps a single session alive across turns, unlike <code>query()</code> which is one exchange.'],
  ['await client.query("What does', '💬 Turn 1: send a message', '<code>client.query()</code> only <i>sends</i> the prompt. Nothing streams yet.'],
  ['async for msg in client.receive_response', '📡 Stream until the turn ends', '<code>receive_response()</code> yields messages up to and including the turn\'s <b>ResultMessage</b>.'],
  ['await client.query("And for', '🧠 Turn 2: rely on memory', 'The follow-up is vague on purpose. Because it is the same session, Claude remembers the earlier question.']]);

AN('e05_tools', 'Every tool request is visible: Grep first, then Read. This is how you audit what an agent actually did.', [
  ['opts = ', '🔒 A read-only agent', 'Read, Grep and Glob cannot modify anything, which makes this a safe agent to hand to many users.'],
  ['async for m in query', '👀 Watch every tool call', 'Iterate the stream and filter for assistant messages.'],
  ['if isinstance(b, ToolUseBlock)', '🎯 Spot the tool_use', 'Each <b>ToolUseBlock</b> carries the tool <code>name</code> and its JSON <code>input</code>, so you can log or audit it.']]);

AN('e06_custom', 'First prompt: stock found. Second prompt: the tool returned <code>is_error</code>, and Claude explained the problem instead of guessing a number.', [
  ['@tool(', '🏷️ Describe the tool to Claude', 'Name, <b>description</b> and input schema. Claude reads the description to decide <i>when</i> to call it, so write it like a prompt.'],
  ['async def check_stock', '⚙️ Your code, any logic you like', 'A normal async function. It runs <b>in your process</b>, so it can use your database connections and secrets.'],
  ['if n is None', '🚨 Report failure properly', 'Return <code>is_error: True</code> with a message. Claude sees the error and can recover or explain.'],
  ['server = create_sdk_mcp_server', '📦 Bundle into an in-process MCP server', '<code>create_sdk_mcp_server</code> wraps your tools. No subprocess, no network.'],
  ['opts = ClaudeAgentOptions(', '🔗 Register and pre-approve', 'The server goes in <b>mcp_servers</b>; the tool is pre-approved as <code>mcp__inventory__check_stock</code> (mcp__&lt;server&gt;__&lt;tool&gt;).'],
  ['for prompt in', '🧪 Happy path and sad path', 'One SKU exists, one does not. Compare how Claude responds to success vs an error result.']]);

AN('e07_mcp', 'The init message listed the connected servers and their tools. Claude called <code>mcp__crm__lookup_customer</code> and used the JSON that came back.', [
  ['opts = ClaudeAgentOptions(', '🌐 Plug into outside systems', 'MCP servers are configured in <b>mcp_servers</b>. Each entry is one external integration.'],
  ['"fs":', '💻 Transport 1: stdio', 'A local <b>subprocess</b> started with a command. Great for local tools like the filesystem.'],
  ['"crm":', '☁️ Transport 2: remote HTTP', 'A remote server reached over HTTP with an <b>Authorization header</b>. Keep tokens in a secret store, never hard-coded.'],
  ['allowed_tools=', '🎟️ Allow-list by pattern', 'Names look like <code>mcp__server__tool</code>. A wildcard approves a whole server; a specific name approves one tool.'],
  ['if isinstance(m, SystemMessage)', '📋 Inspect the connection', 'The init message lists connected servers and available MCP tools, which is the first place to look when a tool "is missing".']]);

AN('e08_sub', 'Indented lines are the subagents\' own messages. The parent only received each <b>final</b> answer and merged them. The researcher\'s Grep never entered the main context.', [
  ['opts = ClaudeAgentOptions(', '🧑‍💼 The manager', 'The main agent orchestrates. It does not do the research itself.'],
  ['allowed_tools=["Read", "Grep", "Glob", "Agent"]', '📣 Delegation needs the Agent tool', 'Without <b>Agent</b> in the allowed tools, Claude cannot spawn a subagent. Older docs call it <code>Task</code>.'],
  ['"researcher": AgentDefinition(', '🔎 Specialist #1: researcher', 'A <b>description</b> (how Claude decides to delegate), a <b>prompt</b>, <b>least-privilege tools</b> and a cheaper model.'],
  ['"analyst": AgentDefinition(', '📊 Specialist #2: analyst', 'Different prompt, fewer tools, stronger model. Each subagent runs in its own <b>isolated context</b>.'],
  ['async for m in query', '🪆 See the isolation', 'Indented output belongs to a subagent. Only each subagent\'s final message flows back to the parent.']]);

AN('e09_hooks', 'The first <code>rm -rf</code> never ran: the hook denied it. Claude chose a safe command, and the PostToolUse hook logged only what actually executed.', [
  ['async def block_dangerous', '🛡️ A guard that cannot be sweet-talked', 'A <b>PreToolUse</b> hook runs before the tool. Code decides, not the model\'s good intentions.'],
  ['if "rm -rf" in cmd', '🚫 Say "deny" and give a reason', 'Returning <code>permissionDecision: "deny"</code> blocks the call. The reason is passed to Claude so it can adapt.'],
  ['async def audit', '📝 The black-box recorder', 'A <b>PostToolUse</b> hook sees every result. Perfect for audit logs and metrics.'],
  ['hooks={', '🔌 Wire hooks to events', '<b>HookMatcher</b> selects tools by name (a regex); no matcher means every tool.'],
  ['async for m in query', '▶️ Ask for something risky', '"Clean the build folder" tempts Claude to delete. Watch the guard step in.']]);

AN('e10_session', 'Call 2 resumed and remembered. Call 3 was a fresh session and had no idea. Call 4 forked: <b>a new id</b>, old history, original untouched.', [
  ['async def run(', '🧩 A helper that captures the id', 'We run a query and keep the <code>session_id</code> from the result.'],
  ['sid = m.session_id', '🆔 The bookmark', 'The session id identifies the saved transcript. Store it and you can come back later, even from another process.'],
  ['sid, t = await run("Read report', '1️⃣ Start a conversation', 'Claude reads the report and remembers the numbers.'],
  ['"What was the revenue figure?", resume=sid)', '2️⃣ Resume: the memory is back', '<code>resume=session_id</code> reloads the history, so the follow-up question works.'],
  ['print("3) fresh session:"', '3️⃣ Fresh session: amnesia', 'Same question, no resume. A new session starts with no memory.'],
  ['branch, t = await run(', '4️⃣ Fork: what-if without risk', '<b>fork_session=True</b> branches into a new session id. The original stays as it was.']]);

AN('e11_perm', 'Run 1: the human said no and the tool was denied, so Claude moved on to reading logs. Run 2: approved, the restart happened. Same agent, different decision.', [
  ['HUMAN_SAYS', '🙋 A stand-in for a real person', 'In production this would be a Slack button or web form. Here a variable plays the reviewer.'],
  ['async def can_use_tool', '🚪 The approval gate', 'Called only for requests nothing else decided. Safe reads never reach it because they are pre-approved.'],
  ['PermissionResultDeny(message=', '❌ A denial Claude can read', 'The message goes back to Claude, which then picks another approach.'],
  ['opts = ClaudeAgentOptions(', '⚖️ Layer the rules', 'Allow list for safe tools, deny list for forbidden tools, <b>can_use_tool</b> for everything else.'],
  ['for answer in', '🔁 Same request, two humans', 'Run the same agent with a "no" and then a "yes" to see the behaviour change.']]);

AN('e12_struct', 'No text parsing. The result arrived as a validated Python dict, so <code>amount * 1.10</code> just works.', [
  ['schema = ', '📐 Define the shape you want', 'A JSON Schema lists the fields and their types. Required fields must be present.'],
  ['opts = ClaudeAgentOptions', '🧾 Ask for structured output', '<code>output_format</code> with type <code>json_schema</code> tells the SDK to return validated JSON.'],
  ['if isinstance(m, ResultMessage) and m.subtype', '✅ Only trust a success result', 'Check <code>subtype == "success"</code>. A failure to match the schema ends with a different subtype.'],
  ['data = m.structured_output', '🎁 Typed data, ready to use', 'The result is in <code>structured_output</code>. No regex, no guessing.']]);

AN('e13_errors', 'The same task hit three outcomes. Caps produced an error result <i>and</i> an exception; with no caps it finished in 3 turns.', [
  ['async def attempt', '🧯 One wrapper, three limits', 'We run the same task under different limits and report what happened.'],
  ['except ClaudeSDKError', '💥 Single-shot query() raises', 'After yielding the error ResultMessage, <code>query()</code> raises. Always wrap the loop in try/except.'],
  ['await attempt("turn cap"', '🔢 Turn cap', '<code>max_turns=1</code> stops after one tool turn: <b>error_max_turns</b>.'],
  ['await attempt("budget cap"', '💸 Budget cap', '<code>max_budget_usd</code> stops spending: <b>error_max_budget_usd</b>.'],
  ['await attempt("no caps")', '🏁 No caps', 'Success after 3 turns. Compare the cost with the capped runs.']]);

AN('s1_docs', 'Glob, Read, Read, Write. The agent produced <code>summary.md</code> without a single approval prompt, and the file content is printed from the virtual file system.', [
  ['# Scenario 1', '📚 The business problem', 'Staff lose hours hunting through scattered documents. We want one summary file with citations.'],
  ['opts = ClaudeAgentOptions(', '🧰 Read widely, write narrowly', 'Glob, Grep and Read to explore, and Write to save the summary.'],
  ['permission_mode="acceptEdits"', '✍️ Auto-approve edits', '<b>acceptEdits</b> approves file writes in the workspace so the run does not stall on prompts.'],
  ['async for m in query', '▶️ Run the research', 'The agent lists docs, reads the VPN and MFA pages and writes the summary.'],
  ['from claude_agent_sdk import FILES', '👀 Peek at the result', 'Mock-only helper: print the file the agent wrote.']]);

AN('s2_dev', 'Grep → Read → Edit → Bash. The edit was applied and the test command passed. Code changes with proof.', [
  ['# Scenario 2', '🛠️ The business problem', 'Developers lose time on routine changes. The agent edits code and checks its own work.'],
  ['opts = ', '🧰 A developer\'s toolbox', 'Search, read, edit and run commands.'],
  ['disallowed_tools', '🌐 No internet needed', 'Deny WebFetch and WebSearch so the code agent cannot be steered by random web pages.'],
  ['async for m', '▶️ Make the change', 'The agent locates, edits, then runs pytest.'],
  ['from claude_agent_sdk import FILES', '🔬 Verify the edit', 'Mock-only helper: print the edited file.']]);

AN('s3_multi', 'Three specialists, three isolated contexts, one planner assembling the report. The reviewer had <b>no tools</b>, only the text it was given.', [
  ['agents = {', '👥 Define the squad', 'Researcher (read-only, cheap model), analyst (reads), reviewer (no tools, strongest model).'],
  ['"reviewer"', '🕵️ A reviewer with no tools', 'Least privilege: it only critiques the text it is handed.'],
  ['opts = ClaudeAgentOptions(', '🧑‍✈️ The planner', 'A system prompt tells the main agent to delegate in order and compile the result.'],
  ['allowed_tools=["Agent"]', '🔑 The planner only delegates', 'Its only tool is Agent, so it cannot touch files itself.'],
  ['async for m', '▶️ Watch the hand-offs', 'Each Agent call creates an indented subagent run.']]);

AN('s4_mcp', 'The agent called two different systems and joined the results: CRM said who the customer is, tickets said what is open.', [
  ['opts = ClaudeAgentOptions(', '🔗 Two systems, one assistant', 'The CRM and ticketing system are separate MCP servers owned by other teams.'],
  ['"crm":', '🔐 Credentials come from the environment', 'The bearer token is a placeholder resolved from a secret store, never typed into code.'],
  ['allowed_tools=', '📖 Read-only on purpose', 'Only lookup and list tools are pre-approved. Writes would need approval.'],
  ['async for m', '▶️ Ask a cross-system question', 'Claude chains the calls: customer lookup, then ticket list.']]);

AN('s5_hitl', 'The $40 refund went through automatically. The $250 refund was blocked by policy and recorded in the audit log, ready for a manager.', [
  ['@tool("issue_refund"', '💳 A tool with real consequences', 'This custom tool moves money, so it must be gated.'],
  ['payments = create_sdk', '📦 Expose it to the agent', 'Wrap the tool in an in-process MCP server.'],
  ['async def can_use_tool', '🧠 Policy in code', 'The callback sees the tool name <b>and its real input</b>, so it can enforce an amount threshold.'],
  ['if name.endswith', '💰 Over $100? Ask a human', 'Large refunds are denied with a message and logged; small ones are auto-approved.'],
  ['opts = ClaudeAgentOptions(', '🔌 Plug the gate in', 'Register the tool server and the callback.'],
  ['async with ClaudeSDKClient', '▶️ Two refunds, one request', 'The agent attempts both refunds in one run.'],
  ['print("--- audit log', '📒 Accountability', 'Every decision was recorded: what, with which input, and the outcome.']]);

AN('s6_kb', 'The agent searched, read the source and answered with a citation. The hook captured the tools used without the model knowing.', [
  ['@tool("search_kb"', '🔎 A search tool for your knowledge base', 'It returns document paths. In production it would enforce each user\'s access rights.'],
  ['kb = create_sdk', '📦 In-process server', 'Private to this app, so there is no extra service to run.'],
  ['async def log_tool', '📈 Observability for free', 'A hook records which tools ran.'],
  ['opts = ClaudeAgentOptions(', '🧭 Ground the assistant', 'The system prompt says "answer only from the knowledge base and cite".'],
  ['hooks=', '🔌 Attach the logger', 'PostToolUse with no matcher logs every tool.'],
  ['async for m', '▶️ Ask a real employee question', '"How do I get VPN access?" triggers search, read, answer.']]);
