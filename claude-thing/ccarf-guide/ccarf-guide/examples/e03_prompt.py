import os, asyncio
os.environ["ANTHROPIC_API_KEY"] = "sk-ant-mock-0000000000"   # MOCK key (real runs: your own key)
MODEL = "claude-sonnet-5-5"                                    # model id used by the agent loop

from claude_agent_sdk import query, ClaudeAgentOptions
from show import show

# 1) Custom string: REPLACES the default prompt (narrow, non-coding agent)
custom = ClaudeAgentOptions(model=MODEL, allowed_tools=["Read", "Grep"],
                            system_prompt="Answer only from the provided HR policies.")
# 2) Preset + append: keeps Claude Code's built-in guidance and adds your rules
preset = ClaudeAgentOptions(model=MODEL, allowed_tools=["Read", "Grep"],
                            system_prompt={"type": "preset", "preset": "claude_code",
                                           "append": "Always cite the policy file path."})
async def main():
    print("custom:", custom.system_prompt)
    print("preset:", preset.system_prompt)
    async for msg in query(prompt="Which policy covers remote work?", options=preset):
        show(msg)

asyncio.run(main())
