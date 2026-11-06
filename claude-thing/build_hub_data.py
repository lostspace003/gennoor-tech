"""Assemble prep-hub/data.js (window.EXAM_DATA) from the original hub HTML.

Track mapping (the original hub's names were wrong):
  associate-foundation  -> ccas-f  (Associate - Foundations)
  developer-pro         -> ccdv-f  (Developer - Foundations: content matches that exam)
  architect-foundation  -> ccar-p  (its content matches Architect - Professional)
  architect-pro         -> merged INTO ccar-p (extra advanced domains/matrix/patterns)
  ccar-f                -> authored fresh here (Claude Agent SDK track)
"""
import json, re
from pathlib import Path

HERE = Path(__file__).parent
SRC = (HERE / "claude_certification_exam_prep_hub.html").read_text(encoding="utf8")
OUT = HERE.parent / "public/claude-certifications/prep-hub/data.js"


def find_block(track_id: str) -> str:
    """Return the full text of a track's object literal (between its braces)."""
    key = f'"{track_id}": {{'
    start = SRC.index(key) + len(key) - 1  # at the '{'
    depth = 0
    i = start
    in_str = None
    while i < len(SRC):
        ch = SRC[i]
        if in_str:
            if ch == "\\":
                i += 2
                continue
            if ch == in_str:
                in_str = None
        elif ch in "\"'`":
            in_str = ch
        elif ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                return SRC[start : i + 1]
        i += 1
    raise ValueError("unbalanced block for " + track_id)


def find_array(block: str, field: str) -> str:
    """Return the text INSIDE the [] of a field like 'domains: [ ... ]'."""
    m = re.search(rf"{field}:\s*\[", block)
    start = m.end() - 1
    depth = 0
    i = start
    in_str = None
    while i < len(block):
        ch = block[i]
        if in_str:
            if ch == "\\":
                i += 2
                continue
            if ch == in_str:
                in_str = None
        elif ch in "\"'`":
            in_str = ch
        elif ch == "[":
            depth += 1
        elif ch == "]":
            depth -= 1
            if depth == 0:
                return block[start + 1 : i]
        i += 1
    raise ValueError("unbalanced array " + field)


A = find_block("associate-foundation")
B = find_block("developer-pro")
C = find_block("architect-foundation")
D = find_block("architect-pro")

def arrays(block):
    return {f: find_array(block, f).strip().rstrip(",") for f in ("domains", "decisionMatrix", "codePatterns")}

a, b, c, d = arrays(A), arrays(B), arrays(C), arrays(D)

# ---- the new CCAR-F (Agent SDK) track, authored here ----
ccarf = {
    "domains": json.dumps([
        {"title": "1. Agent SDK Fundamentals & Configuration", "weight": "30%", "icon": "ph-circuitry", "points": [
            "<strong>What the SDK gives you:</strong> the agent loop (reason &rarr; act &rarr; observe), built-in tools, permissions, hooks, MCP wiring and session handling. With the plain Messages API you build all of that yourself.",
            "<strong>query() vs ClaudeSDKClient:</strong> <code>query()</code> is a single exchange returning an async iterator; <code>ClaudeSDKClient</code> keeps a session for multi-turn chat and supports <code>interrupt()</code>.",
            "<strong>Message stream:</strong> SystemMessage &rarr; AssistantMessage(s) &rarr; ResultMessage. The ResultMessage carries subtype, turns, cost and session_id; <code>max_turns</code> caps loop iterations (exceeding it yields <code>error_max_turns</code>).",
            "<strong>System prompts:</strong> a custom string replaces the default; the <code>claude_code</code> preset with <code>append</code> keeps the tool-use guidance and adds yours \u2014 prefer the preset for tool-heavy agents.",
        ]},
        {"title": "2. Tools, Custom Tools & MCP", "weight": "30%", "icon": "ph-wrench", "points": [
            "<strong>Built-in tool risk ladder:</strong> Read/Glob/Grep are low risk; <code>Bash</code> runs arbitrary commands and is the highest risk \u2014 scope or deny it explicitly.",
            "<strong>allowed_tools pre-approves; it does not remove.</strong> Other tools still exist and prompt for permission. Use <code>disallowed_tools</code> to block.",
            "<strong>Custom tools:</strong> clear JSON schema, precise description of when to call, explicit error handling; return <code>is_error: true</code> so Claude can recover inside the loop.",
            "<strong>MCP servers</strong> connect external systems through a standard protocol; tool names are namespaced (<code>mcp__server__tool</code>) and MCP tools obey the same permission model.",
        ]},
        {"title": "3. Subagents, Hooks & Sessions", "weight": "25%", "icon": "ph-tree-structure", "points": [
            "<strong>Subagents</strong> isolate context: a research or log-analysis subagent burns its own tokens and returns only a synthesis to the parent \u2014 the fix when verbose tool output pollutes the orchestrator.",
            "<strong>Hooks are deterministic:</strong> PreToolUse hooks intercept tool calls before execution and can block or require approval \u2014 unlike prompt instructions, which are probabilistic.",
            "<strong>Sessions:</strong> every run has a session_id; resume to continue with full context. Permission modes: <code>default</code>, <code>acceptEdits</code> (auto-approves file edits in the working directory), <code>plan</code>, <code>bypassPermissions</code> (sandbox only).",
        ]},
        {"title": "4. Security, Errors & Enterprise Patterns", "weight": "15%", "icon": "ph-shield-check", "points": [
            "<strong>Least privilege first:</strong> narrow allowed_tools, explicit deny rules for destructive commands, approvals on irreversible actions, human-in-the-loop before high-impact writes.",
            "<strong>Error subtypes matter:</strong> distinguish <code>error_max_turns</code> (raise the cap or decompose) from tool failures (fix the tool or its inputs) from permission denials (adjust scope deliberately).",
            "<strong>Production shape:</strong> deterministic workflow for the standard path, agent invoked at the genuinely open-ended decision points; log turns, cost and session ids per run.",
        ]},
    ], ensure_ascii=False)[1:-1],
    "decisionMatrix": json.dumps([
        {"trigger": "Team needs file edits, shell commands and approvals with minimal custom code", "action": "Use the Agent SDK \u2014 it bundles the loop, tools and permissions; the raw Messages API would need all of it hand-built", "category": "SDK vs API"},
        {"trigger": "Single question-answer exchange with tool use, no conversation to maintain", "action": "query() \u2014 one exchange, async iterator, ResultMessage at the end", "category": "SDK vs API"},
        {"trigger": "Multi-turn conversation that must support interrupting a running turn", "action": "ClaudeSDKClient \u2014 keeps the session and supports interrupt()", "category": "SDK vs API"},
        {"trigger": "Agent loops forever or runs away on a hard task", "action": "Set max_turns; handle the error_max_turns result subtype explicitly", "category": "Configuration"},
        {"trigger": "You set allowed_tools=[\"Read\"] and are asked what happens to other tools", "action": "Read is pre-approved; other tools still exist and will prompt \u2014 use disallowed_tools to remove", "category": "Configuration"},
        {"trigger": "Tool-heavy coding agent needs a system prompt that keeps default tool guidance", "action": "claude_code preset + append, not a replacement string", "category": "Configuration"},
        {"trigger": "External pricing/CRM/database system must be reachable by several agents", "action": "Expose it as an MCP server \u2014 standard protocol, namespaced tools, reusable across agents", "category": "Tools & MCP"},
        {"trigger": "Custom tool's backing service fails intermittently", "action": "Return is_error: true in the tool result so Claude can recover or explain \u2014 never swallow the failure", "category": "Tools & MCP"},
        {"trigger": "Which built-in tool deserves the tightest control?", "action": "Bash \u2014 arbitrary command execution; scope with narrow patterns and explicit deny rules", "category": "Security"},
        {"trigger": "Agent must never run destructive database/shell operations in production", "action": "Deterministic PreToolUse hook that blocks or requires approval \u2014 not a system-prompt warning", "category": "Security"},
        {"trigger": "Subagent inspects 50k-token logs and the parent then loses output quality", "action": "Isolate the subagent's context; it returns only a schema-constrained summary to the orchestrator", "category": "Subagents"},
        {"trigger": "Billing, shipping and product sub-issues get mixed up by one agent", "action": "Orchestrator that delegates each domain to a dedicated subagent", "category": "Subagents"},
        {"trigger": "Standard invoice pipeline with occasional unexpected formats", "action": "Deterministic workflow for the standard path; invoke an agent only at the open-ended decision point", "category": "Architecture"},
        {"trigger": "A conversation must continue tomorrow with full context", "action": "Persist the session_id and resume the session \u2014 do not replay the transcript into a fresh prompt", "category": "Sessions"},
        {"trigger": "Reviewer asks which permission mode auto-approves edits in the working directory", "action": "acceptEdits \u2014 bypassPermissions approves almost everything and belongs only in a sandbox", "category": "Security"},
    ], ensure_ascii=False)[1:-1],
    "codePatterns": json.dumps([
        {
            "title": "query() with scoped tools, max_turns and the ResultMessage",
            "tag": "Agent loop fundamentals",
            "description": "The canonical single-exchange agent run: pre-approved tools, a turn cap, and reading cost/turns off the final ResultMessage.",
            "lang": "python",
            "code": "import asyncio\nfrom claude_agent_sdk import query, ClaudeAgentOptions\n\noptions = ClaudeAgentOptions(\n    allowed_tools=[\"Read\", \"Glob\", \"Grep\"],   # pre-approved; others still prompt\n    disallowed_tools=[\"Bash\"],                 # removed outright\n    max_turns=8,                                # safety cap -> error_max_turns beyond\n    system_prompt={\"type\": \"preset\", \"preset\": \"claude_code\",\n                   \"append\": \"Only summarize; never modify files.\"},\n)\n\nasync def main():\n    async for msg in query(prompt=\"Summarize the contracts in ./docs\", options=options):\n        kind = type(msg).__name__\n        if kind == \"ResultMessage\":\n            print(\"subtype:\", msg.subtype)        # 'success' | 'error_max_turns' | ...\n            print(\"turns:\", msg.num_turns, \"cost: $\", msg.total_cost_usd)\n            print(\"session:\", msg.session_id)     # persist to resume later\n\nasyncio.run(main())",
        },
        {
            "title": "Custom tool + deterministic PreToolUse hook",
            "tag": "Tools, hooks & least privilege",
            "description": "A schema'd custom tool that reports failures via is_error, plus a hook that deterministically blocks destructive SQL before execution.",
            "lang": "python",
            "code": "from claude_agent_sdk import tool, create_sdk_mcp_server, ClaudeAgentOptions\n\n@tool(\"lookup_price\", \"Look up the current price for a SKU\", {\"sku\": str})\nasync def lookup_price(args):\n    try:\n        price = await pricing_service.get(args[\"sku\"])\n        return {\"content\": [{\"type\": \"text\", \"text\": f\"{args['sku']}: {price}\"}]}\n    except ServiceError as e:\n        # Tell the loop the tool failed so Claude can recover or explain\n        return {\"content\": [{\"type\": \"text\", \"text\": str(e)}], \"is_error\": True}\n\nasync def block_destructive(input_data, tool_use_id, context):\n    cmd = (input_data.get(\"tool_input\") or {}).get(\"command\", \"\")\n    if any(k in cmd.upper() for k in (\"DROP \", \"TRUNCATE \", \"DELETE FROM\")):\n        return {\"hookSpecificOutput\": {\"hookEventName\": \"PreToolUse\",\n                                         \"permissionDecision\": \"deny\",\n                                         \"permissionDecisionReason\": \"Destructive SQL blocked by policy\"}}\n    return {}\n\noptions = ClaudeAgentOptions(\n    mcp_servers={\"pricing\": create_sdk_mcp_server(\"pricing\", tools=[lookup_price])},\n    allowed_tools=[\"mcp__pricing__lookup_price\", \"Read\"],\n    hooks={\"PreToolUse\": [{\"matcher\": \"Bash\", \"hooks\": [block_destructive]}]},\n)",
        },
    ], ensure_ascii=False)[1:-1],
}

HEADERS = {
    "ccas-f": dict(
        code="CCAS-F", title="Claude Certified Associate \u2013 Foundations", level="Foundations",
        role="Knowledge workers & analysts", icon="ph-user-focus",
        summary="Working with Claude responsibly and well: the AI Fluency Framework (Description, Delegation, Diligence, Discernment), workspace features (Artifacts, Code Execution, Projects, Skills, Memory), structured prompting and iteration.",
        stats=[{"label": "Practice bank", "value": "60 questions"},
               {"label": "Question types", "value": "Single, select-two, sequence"},
               {"label": "Core framework", "value": "The 4 Ds of AI Fluency"},
               {"label": "Audience", "value": "Knowledge workers & analysts"}],
    ),
    "ccdv-f": dict(
        code="CCDV-F", title="Claude Certified Developer \u2013 Foundations", level="Foundations",
        role="Software engineers", icon="ph-terminal-window",
        summary="Production Claude engineering: async SDK integration, schema validation and tool calling, Agent SDK checkpointing and context management, Claude Code (CLAUDE.md, Skills, hooks) and prompt security.",
        stats=[{"label": "Practice bank", "value": "53 questions"},
               {"label": "Question types", "value": "Scenario-based single choice"},
               {"label": "Core stack", "value": "Claude SDK, Agent SDK, Claude Code"},
               {"label": "Audience", "value": "AI & backend engineers"}],
    ),
    "ccar-f": dict(
        code="CCAR-F", title="Claude Certified Architect \u2013 Foundations", level="Foundations",
        role="Solution architects (Agent SDK)", icon="ph-compass-tool",
        summary="Designing agent systems on the Claude Agent SDK: the agent loop, query() vs ClaudeSDKClient, built-in and custom tools, MCP, subagents, deterministic hooks, sessions, permissions and enterprise hardening.",
        stats=[{"label": "Practice bank", "value": "60 questions"},
               {"label": "Question types", "value": "Single choice & scenarios"},
               {"label": "Core stack", "value": "Claude Agent SDK, MCP"},
               {"label": "Audience", "value": "Solution architects & senior engineers"}],
    ),
    "ccar-p": dict(
        code="CCAR-P", title="Claude Certified Architect \u2013 Professional", level="Professional",
        role="Principal & enterprise architects", icon="ph-cpu",
        summary="Enterprise-scale Claude architecture: business value pillars and SLA gates, RAG with RBAC at the retrieval layer, prompt caching and the token lifecycle, tool governance, HIPAA/BAA/ZDR compliance, layered guardrails, observability and fair rollouts.",
        stats=[{"label": "Practice bank", "value": "62 questions"},
               {"label": "Question types", "value": "Single, select-two, matrix scenarios"},
               {"label": "Core pillars", "value": "Security, RAG, FinOps, Governance"},
               {"label": "Audience", "value": "Principal & staff AI architects"}],
    ),
}


def hdr_js(h):
    return (
        f'    code: {json.dumps(h["code"])},\n'
        f'    title: {json.dumps(h["title"])},\n'
        f'    level: {json.dumps(h["level"])},\n'
        f'    role: {json.dumps(h["role"])},\n'
        f'    icon: {json.dumps(h["icon"])},\n'
        f'    summary: {json.dumps(h["summary"], ensure_ascii=False)},\n'
        f'    stats: {json.dumps(h["stats"], ensure_ascii=False)},\n'
    )


def track_js(tid, arr):
    h = HEADERS[tid]
    return (
        f'  "{tid}": {{\n' + hdr_js(h) +
        f'    domains: [\n{arr["domains"]}\n    ],\n'
        f'    decisionMatrix: [\n{arr["decisionMatrix"]}\n    ],\n'
        f'    codePatterns: [\n{arr["codePatterns"]}\n    ]\n'
        f'  }}'
    )


# ccar-p: merge architect-foundation content with architect-pro extras
cp = {
    "domains": c["domains"] + ",\n" + d["domains"],
    "decisionMatrix": c["decisionMatrix"] + ",\n" + d["decisionMatrix"],
    "codePatterns": c["codePatterns"] + ",\n" + d["codePatterns"],
}

out = (
    "/* Track content for the Claude Certification Prep Hub.\n"
    "   Generated by claude-thing/build_hub_data.py from the original hub + authored CCAR-F track.\n"
    "   Regenerate there; do not hand-edit. */\n"
    "window.EXAM_DATA = {\n"
    + ",\n".join([
        track_js("ccas-f", a),
        track_js("ccdv-f", b),
        track_js("ccar-f", ccarf),
        track_js("ccar-p", cp),
    ])
    + "\n};\n"
)
OUT.write_text(out, encoding="utf8")
print("wrote", OUT, len(out), "chars")
