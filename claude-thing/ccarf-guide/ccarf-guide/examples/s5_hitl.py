import os, asyncio
os.environ["ANTHROPIC_API_KEY"] = "sk-ant-mock-0000000000"   # MOCK key (real runs: your own key)
MODEL = "claude-sonnet-5-5"                                    # model id used by the agent loop

# Scenario 5 - Human-approved execution agent (refunds)
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
