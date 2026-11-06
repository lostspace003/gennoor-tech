import os, asyncio
os.environ["ANTHROPIC_API_KEY"] = "sk-ant-mock-0000000000"   # MOCK key (real runs: your own key)
MODEL = "claude-sonnet-5-5"                                    # model id used by the agent loop

from claude_agent_sdk import tool, create_sdk_mcp_server, ClaudeAgentOptions, query
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
