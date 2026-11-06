import os, asyncio
os.environ["ANTHROPIC_API_KEY"] = "sk-ant-mock-0000000000"   # MOCK key (real runs: your own key)
MODEL = "claude-sonnet-5-5"                                    # model id used by the agent loop

from claude_agent_sdk import ClaudeSDKClient, ClaudeAgentOptions
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
