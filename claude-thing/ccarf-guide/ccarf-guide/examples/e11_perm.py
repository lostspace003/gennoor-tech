import os, asyncio
os.environ["ANTHROPIC_API_KEY"] = "sk-ant-mock-0000000000"   # MOCK key (real runs: your own key)
MODEL = "claude-sonnet-5-5"                                    # model id used by the agent loop

from claude_agent_sdk import ClaudeSDKClient, ClaudeAgentOptions, PermissionResultAllow, PermissionResultDeny
from show import show

HUMAN_SAYS = {"answer": "no"}          # stands in for a real person clicking Approve/Deny

async def can_use_tool(tool_name, tool_input, context):
    if tool_name == "Bash" and "restart" in tool_input.get("command", ""):
        print(f"   [approval requested] {tool_input['command']!r} -> human says {HUMAN_SAYS['answer']!r}")
        if HUMAN_SAYS["answer"] == "yes":
            return PermissionResultAllow()
        return PermissionResultDeny(message="Operator declined the restart")
    return PermissionResultAllow()

opts = ClaudeAgentOptions(
    model=MODEL,
    allowed_tools=["Read", "Grep"],     # auto-approved (never reach the callback)
    disallowed_tools=["WebFetch"],      # hard deny
    can_use_tool=can_use_tool,          # decides everything else
)
async def main():
    for answer in ["no", "yes"]:
        HUMAN_SAYS["answer"] = answer
        print(f"=== run with human answer: {answer} ===")
        async with ClaudeSDKClient(options=opts) as client:
            await client.query("Restart the web service and check its logs")
            async for m in client.receive_response():
                show(m)

asyncio.run(main())
