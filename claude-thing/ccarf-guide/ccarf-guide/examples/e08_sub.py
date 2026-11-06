import os, asyncio
os.environ["ANTHROPIC_API_KEY"] = "sk-ant-mock-0000000000"   # MOCK key (real runs: your own key)
MODEL = "claude-sonnet-5-5"                                    # model id used by the agent loop

from claude_agent_sdk import query, ClaudeAgentOptions, AgentDefinition
from show import show

opts = ClaudeAgentOptions(
    model=MODEL,
    allowed_tools=["Read", "Grep", "Glob", "Agent"],       # "Agent" enables delegation (older docs call it "Task")
    agents={
        "researcher": AgentDefinition(
            description="Finds and summarizes relevant facts in the docs folder.",   # how Claude decides to delegate
            prompt="You are a meticulous researcher. Return bullet findings with file names.",
            tools=["Read", "Grep", "Glob"],                # least privilege
            model="haiku",                                 # cheaper model for retrieval
        ),
        "analyst": AgentDefinition(
            description="Analyzes findings and quantifies risk.",
            prompt="You analyze provided findings and produce a risk table.",
            tools=["Read"],
            model="sonnet",
        ),
    },
)
async def main():
    async for m in query(prompt="Use researcher then analyst to assess renewal risk in ./contracts", options=opts):
        show(m)       # indented lines = messages produced inside a subagent's own context

asyncio.run(main())
