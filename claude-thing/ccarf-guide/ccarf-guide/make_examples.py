"""Writes examples/*.py, runs each against the mock SDK and stores code+output in assets/examples.js."""
import os, subprocess, json, sys
ROOT = os.path.dirname(os.path.abspath(__file__))
HEAD = '''import os, asyncio
os.environ["ANTHROPIC_API_KEY"] = "sk-ant-mock-0000000000"   # MOCK key (real runs: your own key)
MODEL = "claude-sonnet-5-5"                                    # model id used by the agent loop
'''
E = {}
E["e01_query"] = r'''from claude_agent_sdk import query, ClaudeAgentOptions, AssistantMessage, TextBlock, ToolUseBlock, ResultMessage

async def main():
    options = ClaudeAgentOptions(
        model=MODEL,
        allowed_tools=["Read", "Glob", "Grep"],   # pre-approved, read-only built-in tools
        max_turns=8,                              # safety cap on agent-loop iterations
        cwd="./contracts",                        # working directory for the tools
    )
    # query() returns an async iterator: nothing runs until we iterate
    async for msg in query(prompt="List every contract that renews in 2026.", options=options):
        if isinstance(msg, AssistantMessage):
            for block in msg.content:
                if isinstance(block, ToolUseBlock): print("[tool]", block.name, block.input)   # Claude chose a tool
                elif isinstance(block, TextBlock): print(block.text)                           # Claude's text
        elif isinstance(msg, ResultMessage):          # always the last message
            print(f"turns={msg.num_turns} cost=${msg.total_cost_usd} session={msg.session_id}")

asyncio.run(main())
'''
E["e02_options"] = r'''from claude_agent_sdk import query, ClaudeAgentOptions
from show import show

options = ClaudeAgentOptions(
    system_prompt="You are a careful IT assistant.",   # role / behaviour
    model=MODEL,                        # which Claude model runs the loop
    allowed_tools=["Read", "Grep"],     # auto-approved tools (does NOT hide other tools)
    disallowed_tools=["Bash"],          # always blocked - deny beats allow
    permission_mode="default",          # default | acceptEdits | plan | dontAsk | bypassPermissions | auto
    max_turns=10,                       # cap on tool-use iterations
)

async def main():
    print("deny list:", options.disallowed_tools, "| mode:", options.permission_mode)
    async for msg in query(prompt="Please run the cleanup script.", options=options):
        show(msg)                       # Claude tries Bash -> the SDK refuses -> Claude explains

asyncio.run(main())
'''
E["e03_prompt"] = r'''from claude_agent_sdk import query, ClaudeAgentOptions
from show import show

# 1) Custom string: REPLACES the default prompt (narrow, non-coding agent)
custom = ClaudeAgentOptions(model=MODEL, allowed_tools=["Read", "Grep"],
                            system_prompt="Answer only from the provided HR policies.")
# 2) Preset + append: keeps Claude Code's built-in guidance and adds your rules
preset = ClaudeAgentOptions(model=MODEL, allowed_tools=["Read", "Grep"],
                            system_prompt={"type": "preset", "preset": "claude_code",
                                           "append": "Always cite the policy file path."})
async def main():
    print("custom:", custom.system_prompt)
    print("preset:", preset.system_prompt)
    async for msg in query(prompt="Which policy covers remote work?", options=preset):
        show(msg)

asyncio.run(main())
'''
E["e04_client"] = r'''from claude_agent_sdk import ClaudeSDKClient, ClaudeAgentOptions
from show import show

async def main():
    opts = ClaudeAgentOptions(model=MODEL, allowed_tools=["Read", "Grep"])
    async with ClaudeSDKClient(options=opts) as client:       # one persistent session
        await client.query("What does our PTO policy say?")   # turn 1
        async for msg in client.receive_response():           # stream until this turn's ResultMessage
            show(msg)
        print("----- turn 2 (same session) -----")
        await client.query("And for contractors?")            # turn 2 relies on turn 1 context
        async for msg in client.receive_response():
            show(msg)

asyncio.run(main())
'''
E["e05_tools"] = r'''from claude_agent_sdk import query, ClaudeAgentOptions, AssistantMessage, ToolUseBlock

opts = ClaudeAgentOptions(model=MODEL, allowed_tools=["Read", "Grep", "Glob"])   # read-only agent

async def main():
    async for m in query(prompt="Where is retry logic implemented?", options=opts):
        if isinstance(m, AssistantMessage):
            for b in m.content:
                if isinstance(b, ToolUseBlock):
                    print("tool_use ->", b.name, b.input)       # observe every invocation

asyncio.run(main())
'''
E["e06_custom"] = r'''from claude_agent_sdk import tool, create_sdk_mcp_server, ClaudeAgentOptions, query
from show import show

@tool("check_stock", "Return units in stock for a SKU", {"sku": str})   # name, description (Claude reads it), schema
async def check_stock(args):
    stock = {"A-100": 42, "B-200": 0}                    # stand-in for a database call
    n = stock.get(args["sku"])
    if n is None:
        return {"content": [{"type": "text", "text": "Unknown SKU"}], "is_error": True}   # error goes back to Claude
    return {"content": [{"type": "text", "text": f"{args['sku']}: {n} in stock"}]}

server = create_sdk_mcp_server(name="inventory", version="1.0.0", tools=[check_stock])

opts = ClaudeAgentOptions(
    model=MODEL,
    mcp_servers={"inventory": server},                   # register under the key "inventory"
    allowed_tools=["mcp__inventory__check_stock"],       # mcp__<server>__<tool>
)
async def main():
    for prompt in ["Do we have SKU A-100?", "Do we have SKU Z-999?"]:
        print(">>", prompt)
        async for m in query(prompt=prompt, options=opts):
            show(m)

asyncio.run(main())
'''
E["e07_mcp"] = r'''from claude_agent_sdk import query, ClaudeAgentOptions, SystemMessage
from show import show

opts = ClaudeAgentOptions(
    model=MODEL,
    mcp_servers={
        "fs":  {"command": "npx", "args": ["-y", "@modelcontextprotocol/server-filesystem", "/data"]},   # stdio transport
        "crm": {"type": "http", "url": "https://mcp.example.com/crm",                                    # remote HTTP transport
                "headers": {"Authorization": "Bearer ${CRM_TOKEN}"}},
    },
    allowed_tools=["mcp__fs__*", "mcp__crm__lookup_customer"],   # wildcard per server; names are mcp__<server>__<tool>
)
async def main():
    async for m in query(prompt="Look up customer C-77 in the CRM", options=opts):
        if isinstance(m, SystemMessage):
            print("connected servers:", m.data["mcp_servers"])
            print("mcp tools:", [t for t in m.data["tools"] if t.startswith("mcp__")])
        else:
            show(m)

asyncio.run(main())
'''
E["e08_sub"] = r'''from claude_agent_sdk import query, ClaudeAgentOptions, AgentDefinition
from show import show

opts = ClaudeAgentOptions(
    model=MODEL,
    allowed_tools=["Read", "Grep", "Glob", "Agent"],       # "Agent" enables delegation (older docs call it "Task")
    agents={
        "researcher": AgentDefinition(
            description="Finds and summarizes relevant facts in the docs folder.",   # how Claude decides to delegate
            prompt="You are a meticulous researcher. Return bullet findings with file names.",
            tools=["Read", "Grep", "Glob"],                # least privilege
            model="haiku",                                 # cheaper model for retrieval
        ),
        "analyst": AgentDefinition(
            description="Analyzes findings and quantifies risk.",
            prompt="You analyze provided findings and produce a risk table.",
            tools=["Read"],
            model="sonnet",
        ),
    },
)
async def main():
    async for m in query(prompt="Use researcher then analyst to assess renewal risk in ./contracts", options=opts):
        show(m)       # indented lines = messages produced inside a subagent's own context

asyncio.run(main())
'''
E["e09_hooks"] = r'''from claude_agent_sdk import query, ClaudeAgentOptions, HookMatcher
from show import show

async def block_dangerous(input_data, tool_use_id, context):
    cmd = input_data["tool_input"].get("command", "")
    if "rm -rf" in cmd:
        return {"hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "permissionDecision": "deny",                       # stop the tool before it runs
            "permissionDecisionReason": "Destructive command blocked by policy"}}
    return {}                                                   # empty dict = no objection

async def audit(input_data, tool_use_id, context):
    print("   AUDIT:", input_data["tool_name"], "->", str(input_data["tool_response"])[:40])
    return {}

opts = ClaudeAgentOptions(
    model=MODEL,
    allowed_tools=["Bash"],
    hooks={
        "PreToolUse":  [HookMatcher(matcher="Bash", hooks=[block_dangerous])],
        "PostToolUse": [HookMatcher(hooks=[audit])],            # no matcher = every tool
    },
)
async def main():
    async for m in query(prompt="Clean the build folder", options=opts):
        show(m)

asyncio.run(main())
'''
E["e10_session"] = r'''from claude_agent_sdk import query, ClaudeAgentOptions, ResultMessage, AssistantMessage, TextBlock

async def run(prompt, **kw):
    sid, text = None, ""
    async for m in query(prompt=prompt, options=ClaudeAgentOptions(model=MODEL, allowed_tools=["Read"], **kw)):
        if isinstance(m, AssistantMessage):
            text = "".join(b.text for b in m.content if isinstance(b, TextBlock)) or text
        if isinstance(m, ResultMessage):
            sid = m.session_id                          # capture for later resume
    return sid, text

async def main():
    sid, t = await run("Read report.md and remember the key numbers.");      print("1)", sid, t)
    _, t = await run("What was the revenue figure?", resume=sid);              print("2) resumed:", t)
    _, t = await run("What was the revenue figure?");                          print("3) fresh session:", t)
    branch, t = await run("Assume revenue is 10% lower; redo the summary.",
                          resume=sid, fork_session=True)                       # new id, original untouched
    print("4) fork:", branch, "!=", sid, "->", t)

asyncio.run(main())
'''
E["e11_perm"] = r'''from claude_agent_sdk import ClaudeSDKClient, ClaudeAgentOptions, PermissionResultAllow, PermissionResultDeny
from show import show

HUMAN_SAYS = {"answer": "no"}          # stands in for a real person clicking Approve/Deny

async def can_use_tool(tool_name, tool_input, context):
    if tool_name == "Bash" and "restart" in tool_input.get("command", ""):
        print(f"   [approval requested] {tool_input['command']!r} -> human says {HUMAN_SAYS['answer']!r}")
        if HUMAN_SAYS["answer"] == "yes":
            return PermissionResultAllow()
        return PermissionResultDeny(message="Operator declined the restart")
    return PermissionResultAllow()

opts = ClaudeAgentOptions(
    model=MODEL,
    allowed_tools=["Read", "Grep"],     # auto-approved (never reach the callback)
    disallowed_tools=["WebFetch"],      # hard deny
    can_use_tool=can_use_tool,          # decides everything else
)
async def main():
    for answer in ["no", "yes"]:
        HUMAN_SAYS["answer"] = answer
        print(f"=== run with human answer: {answer} ===")
        async with ClaudeSDKClient(options=opts) as client:
            await client.query("Restart the web service and check its logs")
            async for m in client.receive_response():
                show(m)

asyncio.run(main())
'''
E["e12_struct"] = r'''from claude_agent_sdk import query, ClaudeAgentOptions, ResultMessage

schema = {"type": "object",
          "properties": {"vendor": {"type": "string"}, "amount": {"type": "number"}, "due_date": {"type": "string"}},
          "required": ["vendor", "amount", "due_date"]}

opts = ClaudeAgentOptions(model=MODEL, allowed_tools=["Read"],
                          output_format={"type": "json_schema", "schema": schema})

async def main():
    async for m in query(prompt="Extract fields from invoice.txt", options=opts):
        if isinstance(m, ResultMessage) and m.subtype == "success":
            data = m.structured_output                      # already validated against the schema
            print("structured_output:", data)
            print("amount + 10% tax =", round(data["amount"] * 1.10, 2))   # usable typed data, no text parsing

asyncio.run(main())
'''
E["e13_errors"] = r'''from claude_agent_sdk import query, ClaudeAgentOptions, ResultMessage, ClaudeSDKError

async def attempt(label, **limits):
    opts = ClaudeAgentOptions(model=MODEL, allowed_tools=["Read", "Bash", "Edit"], **limits)
    try:
        async for m in query(prompt="Find the failing test and fix it", options=opts):
            if isinstance(m, ResultMessage):
                print(f"{label}: subtype={m.subtype} turns={m.num_turns} cost=${m.total_cost_usd}")
    except ClaudeSDKError as e:           # single-shot query() raises AFTER yielding the error ResultMessage
        print(f"{label}: raised -> {e}")

async def main():
    await attempt("turn cap", max_turns=1)
    await attempt("budget cap", max_budget_usd=0.003)
    await attempt("no caps")

asyncio.run(main())
'''
E["s1_docs"] = r'''# Scenario 1 - Enterprise document research agent
from claude_agent_sdk import query, ClaudeAgentOptions
from show import show

opts = ClaudeAgentOptions(
    model=MODEL,
    system_prompt="You are a document research assistant. Cite file paths.",
    allowed_tools=["Glob", "Grep", "Read", "Write"],
    permission_mode="acceptEdits",       # file writes inside the workspace are auto-approved
    max_turns=10,
)
async def main():
    async for m in query(prompt="Summarize the IT onboarding docs into summary.md", options=opts):
        show(m)
    from claude_agent_sdk import FILES   # mock only: peek at the virtual file system
    print("--- summary.md ---"); print(FILES["summary.md"])

asyncio.run(main())
'''
E["s2_dev"] = r'''# Scenario 2 - Software development agent
from claude_agent_sdk import query, ClaudeAgentOptions
from show import show

opts = ClaudeAgentOptions(
    model=MODEL,
    allowed_tools=["Grep", "Read", "Edit", "Bash"],
    disallowed_tools=["WebFetch", "WebSearch"],       # code agent needs no internet
    max_turns=12,
)
async def main():
    async for m in query(prompt="Make parse_price accept dollar signs like '$4.50'", options=opts):
        show(m)
    from claude_agent_sdk import FILES   # mock only
    print("--- src/price.py after edit ---"); print(FILES["src/price.py"])

asyncio.run(main())
'''
E["s3_multi"] = r'''# Scenario 3 - Multi-agent research system (planner = main agent)
from claude_agent_sdk import query, ClaudeAgentOptions, AgentDefinition
from show import show

agents = {
    "researcher": AgentDefinition("Finds facts in files", "Return bullet findings with file names.", tools=["Read", "Grep", "Glob"], model="haiku"),
    "analyst":    AgentDefinition("Rates risk from findings", "Produce a risk table from the findings you are given.", tools=["Read"], model="sonnet"),
    "reviewer":   AgentDefinition("Quality-checks an analysis", "Find gaps and unsupported claims.", tools=[], model="opus"),
}
opts = ClaudeAgentOptions(
    model=MODEL,
    system_prompt="You are the planner. Delegate research, analysis and review in order, then compile the report.",
    allowed_tools=["Agent"],     # the planner itself only delegates
    agents=agents,
)
async def main():
    async for m in query(prompt="Plan the vendor risk review for our contracts", options=opts):
        show(m)

asyncio.run(main())
'''
E["s4_mcp"] = r'''# Scenario 4 - MCP-connected enterprise assistant
from claude_agent_sdk import query, ClaudeAgentOptions
from show import show

opts = ClaudeAgentOptions(
    model=MODEL,
    mcp_servers={
        "crm":     {"type": "http", "url": "https://mcp.example.com/crm",     "headers": {"Authorization": "Bearer ${CRM_TOKEN}"}},
        "tickets": {"type": "http", "url": "https://mcp.example.com/tickets", "headers": {"Authorization": "Bearer ${TICKETS_TOKEN}"}},
    },
    allowed_tools=["mcp__crm__lookup_customer", "mcp__tickets__list_tickets"],   # read-only tools only
)
async def main():
    async for m in query(prompt="What are the open tickets for customer C-77?", options=opts):
        show(m)

asyncio.run(main())
'''
E["s5_hitl"] = r'''# Scenario 5 - Human-approved execution agent (refunds)
from claude_agent_sdk import (tool, create_sdk_mcp_server, ClaudeSDKClient, ClaudeAgentOptions,
                              PermissionResultAllow, PermissionResultDeny)
from show import show

@tool("issue_refund", "Refund an order", {"order": str, "amount": float})
async def issue_refund(args):
    return {"content": [{"type": "text", "text": f"refunded ${args['amount']:.2f} on {args['order']}"}]}

payments = create_sdk_mcp_server("payments", tools=[issue_refund])
AUDIT = []                                           # who/what/decision

async def can_use_tool(name, tool_input, ctx):
    amount = tool_input.get("amount", 0)
    if name.endswith("issue_refund") and amount > 100:           # policy: large refunds need a human
        decision = "denied"                                      # stand-in for a real approval UI
        AUDIT.append((name, tool_input, decision))
        return PermissionResultDeny(message=f"Refund of ${amount} needs manager approval; request queued")
    AUDIT.append((name, tool_input, "auto-approved"))
    return PermissionResultAllow()

opts = ClaudeAgentOptions(model=MODEL, mcp_servers={"payments": payments}, can_use_tool=can_use_tool)

async def main():
    async with ClaudeSDKClient(options=opts) as c:
        await c.query("Refund order O-1 ($40) and order O-2 ($250)")
        async for m in c.receive_response():
            show(m)
    print("--- audit log ---")
    for row in AUDIT: print(row)

asyncio.run(main())
'''
E["s6_kb"] = r'''# Scenario 6 - Enterprise knowledge assistant (custom search tool + hook logging)
from claude_agent_sdk import tool, create_sdk_mcp_server, query, ClaudeAgentOptions, HookMatcher
from show import show

@tool("search_kb", "Search the internal knowledge base; returns matching document paths", {"query": str})
async def search_kb(args):
    hits = {"vpn": "docs/vpn.md", "mfa": "docs/mfa.md"}
    return {"content": [{"type": "text", "text": hits.get(args["query"].lower(), "no match")}]}

kb = create_sdk_mcp_server("kb", tools=[search_kb])
LOG = []
async def log_tool(input_data, tool_use_id, context):
    LOG.append(input_data["tool_name"]); return {}

opts = ClaudeAgentOptions(
    model=MODEL,
    system_prompt="Answer employee questions only from the knowledge base. Cite the source path.",
    mcp_servers={"kb": kb},
    allowed_tools=["mcp__kb__search_kb", "Read"],
    hooks={"PostToolUse": [HookMatcher(hooks=[log_tool])]},
)
async def main():
    async for m in query(prompt="How do I get VPN access?", options=opts):
        show(m)
    print("tools used (from hook):", LOG)

asyncio.run(main())
'''

os.makedirs(os.path.join(ROOT, "examples"), exist_ok=True)
env = dict(os.environ, PYTHONPATH=os.path.join(ROOT, "mock") + os.pathsep + os.path.join(ROOT, "examples"), PYTHONIOENCODING="utf-8")
res = {}
for k, body in E.items():
    src = HEAD + "\n" + body
    path = os.path.join(ROOT, "examples", k + ".py")
    open(path, "w", encoding="utf-8").write(src)
    p = subprocess.run([sys.executable, path], capture_output=True, text=True, env=env, cwd=os.path.join(ROOT, "examples"))
    out = p.stdout.rstrip() + (("\n[stderr]\n" + p.stderr) if p.returncode else "")
    if p.returncode: print("FAILED", k, p.stderr[-600:])
    res[k] = {"code": src, "out": out}
open(os.path.join(ROOT, "assets", "examples.js"), "w", encoding="utf-8").write("window.EX = " + json.dumps(res, ensure_ascii=False) + ";")
print("built", len(res))
