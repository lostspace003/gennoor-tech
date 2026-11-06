import os, asyncio
os.environ["ANTHROPIC_API_KEY"] = "sk-ant-mock-0000000000"   # MOCK key (real runs: your own key)
MODEL = "claude-sonnet-5-5"                                    # model id used by the agent loop

from claude_agent_sdk import query, ClaudeAgentOptions, ResultMessage, ClaudeSDKError

async def attempt(label, **limits):
    opts = ClaudeAgentOptions(model=MODEL, allowed_tools=["Read", "Bash", "Edit"], **limits)
    try:
        async for m in query(prompt="Find the failing test and fix it", options=opts):
            if isinstance(m, ResultMessage):
                print(f"{label}: subtype={m.subtype} turns={m.num_turns} cost=${m.total_cost_usd}")
    except ClaudeSDKError as e:           # single-shot query() raises AFTER yielding the error ResultMessage
        print(f"{label}: raised -> {e}")

async def main():
    await attempt("turn cap", max_turns=1)
    await attempt("budget cap", max_budget_usd=0.003)
    await attempt("no caps")

asyncio.run(main())
