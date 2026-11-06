import os, asyncio
os.environ["ANTHROPIC_API_KEY"] = "sk-ant-mock-0000000000"   # MOCK key (real runs: your own key)
MODEL = "claude-sonnet-5-5"                                    # model id used by the agent loop

# Scenario 2 - Software development agent
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
