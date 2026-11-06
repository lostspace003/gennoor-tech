import os, asyncio
os.environ["ANTHROPIC_API_KEY"] = "sk-ant-mock-0000000000"   # MOCK key (real runs: your own key)
MODEL = "claude-sonnet-5-5"                                    # model id used by the agent loop

from claude_agent_sdk import query, ClaudeAgentOptions, ResultMessage, AssistantMessage, TextBlock

async def run(prompt, **kw):
    sid, text = None, ""
    async for m in query(prompt=prompt, options=ClaudeAgentOptions(model=MODEL, allowed_tools=["Read"], **kw)):
        if isinstance(m, AssistantMessage):
            text = "".join(b.text for b in m.content if isinstance(b, TextBlock)) or text
        if isinstance(m, ResultMessage):
            sid = m.session_id                          # capture for later resume
    return sid, text

async def main():
    sid, t = await run("Read report.md and remember the key numbers.");      print("1)", sid, t)
    _, t = await run("What was the revenue figure?", resume=sid);              print("2) resumed:", t)
    _, t = await run("What was the revenue figure?");                          print("3) fresh session:", t)
    branch, t = await run("Assume revenue is 10% lower; redo the summary.",
                          resume=sid, fork_session=True)                       # new id, original untouched
    print("4) fork:", branch, "!=", sid, "->", t)

asyncio.run(main())
