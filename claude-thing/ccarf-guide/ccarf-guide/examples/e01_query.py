import os, asyncio
os.environ["ANTHROPIC_API_KEY"] = "sk-ant-mock-0000000000"   # MOCK key (real runs: your own key)
MODEL = "claude-sonnet-5-5"                                    # model id used by the agent loop

from claude_agent_sdk import query, ClaudeAgentOptions, AssistantMessage, TextBlock, ToolUseBlock, ResultMessage

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
