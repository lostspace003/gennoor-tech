import os, asyncio
os.environ["ANTHROPIC_API_KEY"] = "sk-ant-mock-0000000000"   # MOCK key (real runs: your own key)
MODEL = "claude-sonnet-5-5"                                    # model id used by the agent loop

# Scenario 6 - Enterprise knowledge assistant (custom search tool + hook logging)
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
