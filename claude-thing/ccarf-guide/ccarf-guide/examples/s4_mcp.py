import os, asyncio
os.environ["ANTHROPIC_API_KEY"] = "sk-ant-mock-0000000000"   # MOCK key (real runs: your own key)
MODEL = "claude-sonnet-5-5"                                    # model id used by the agent loop

# Scenario 4 - MCP-connected enterprise assistant
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
