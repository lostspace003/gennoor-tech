import os, asyncio
os.environ["ANTHROPIC_API_KEY"] = "sk-ant-mock-0000000000"   # MOCK key (real runs: your own key)
MODEL = "claude-sonnet-5-5"                                    # model id used by the agent loop

# Scenario 1 - Enterprise document research agent
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
