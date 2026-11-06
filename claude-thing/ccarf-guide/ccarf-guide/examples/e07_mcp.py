import os, asyncio
os.environ["ANTHROPIC_API_KEY"] = "sk-ant-mock-0000000000"   # MOCK key (real runs: your own key)
MODEL = "claude-sonnet-5-5"                                    # model id used by the agent loop

from claude_agent_sdk import query, ClaudeAgentOptions, SystemMessage
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
