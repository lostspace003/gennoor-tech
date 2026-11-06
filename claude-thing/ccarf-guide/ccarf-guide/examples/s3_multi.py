import os, asyncio
os.environ["ANTHROPIC_API_KEY"] = "sk-ant-mock-0000000000"   # MOCK key (real runs: your own key)
MODEL = "claude-sonnet-5-5"                                    # model id used by the agent loop

# Scenario 3 - Multi-agent research system (planner = main agent)
from claude_agent_sdk import query, ClaudeAgentOptions, AgentDefinition
from show import show

agents = {
    "researcher": AgentDefinition("Finds facts in files", "Return bullet findings with file names.", tools=["Read", "Grep", "Glob"], model="haiku"),
    "analyst":    AgentDefinition("Rates risk from findings", "Produce a risk table from the findings you are given.", tools=["Read"], model="sonnet"),
    "reviewer":   AgentDefinition("Quality-checks an analysis", "Find gaps and unsupported claims.", tools=[], model="opus"),
}
opts = ClaudeAgentOptions(
    model=MODEL,
    system_prompt="You are the planner. Delegate research, analysis and review in order, then compile the report.",
    allowed_tools=["Agent"],     # the planner itself only delegates
    agents=agents,
)
async def main():
    async for m in query(prompt="Plan the vendor risk review for our contracts", options=opts):
        show(m)

asyncio.run(main())
