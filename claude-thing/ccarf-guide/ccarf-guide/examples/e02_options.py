import os, asyncio
os.environ["ANTHROPIC_API_KEY"] = "sk-ant-mock-0000000000"   # MOCK key (real runs: your own key)
MODEL = "claude-sonnet-5-5"                                    # model id used by the agent loop

from claude_agent_sdk import query, ClaudeAgentOptions
from show import show

options = ClaudeAgentOptions(
    system_prompt="You are a careful IT assistant.",   # role / behaviour
    model=MODEL,                        # which Claude model runs the loop
    allowed_tools=["Read", "Grep"],     # auto-approved tools (does NOT hide other tools)
    disallowed_tools=["Bash"],          # always blocked - deny beats allow
    permission_mode="default",          # default | acceptEdits | plan | dontAsk | bypassPermissions | auto
    max_turns=10,                       # cap on tool-use iterations
)

async def main():
    print("deny list:", options.disallowed_tools, "| mode:", options.permission_mode)
    async for msg in query(prompt="Please run the cleanup script.", options=options):
        show(msg)                       # Claude tries Bash -> the SDK refuses -> Claude explains

asyncio.run(main())
