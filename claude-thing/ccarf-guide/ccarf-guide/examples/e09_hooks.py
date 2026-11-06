import os, asyncio
os.environ["ANTHROPIC_API_KEY"] = "sk-ant-mock-0000000000"   # MOCK key (real runs: your own key)
MODEL = "claude-sonnet-5-5"                                    # model id used by the agent loop

from claude_agent_sdk import query, ClaudeAgentOptions, HookMatcher
from show import show

async def block_dangerous(input_data, tool_use_id, context):
    cmd = input_data["tool_input"].get("command", "")
    if "rm -rf" in cmd:
        return {"hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "permissionDecision": "deny",                       # stop the tool before it runs
            "permissionDecisionReason": "Destructive command blocked by policy"}}
    return {}                                                   # empty dict = no objection

async def audit(input_data, tool_use_id, context):
    print("   AUDIT:", input_data["tool_name"], "->", str(input_data["tool_response"])[:40])
    return {}

opts = ClaudeAgentOptions(
    model=MODEL,
    allowed_tools=["Bash"],
    hooks={
        "PreToolUse":  [HookMatcher(matcher="Bash", hooks=[block_dangerous])],
        "PostToolUse": [HookMatcher(hooks=[audit])],            # no matcher = every tool
    },
)
async def main():
    async for m in query(prompt="Clean the build folder", options=opts):
        show(m)

asyncio.run(main())
