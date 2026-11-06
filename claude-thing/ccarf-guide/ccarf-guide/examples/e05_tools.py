import os, asyncio
os.environ["ANTHROPIC_API_KEY"] = "sk-ant-mock-0000000000"   # MOCK key (real runs: your own key)
MODEL = "claude-sonnet-5-5"                                    # model id used by the agent loop

from claude_agent_sdk import query, ClaudeAgentOptions, AssistantMessage, ToolUseBlock

opts = ClaudeAgentOptions(model=MODEL, allowed_tools=["Read", "Grep", "Glob"])   # read-only agent

async def main():
    async for m in query(prompt="Where is retry logic implemented?", options=opts):
        if isinstance(m, AssistantMessage):
            for b in m.content:
                if isinstance(b, ToolUseBlock):
                    print("tool_use ->", b.name, b.input)       # observe every invocation

asyncio.run(main())
