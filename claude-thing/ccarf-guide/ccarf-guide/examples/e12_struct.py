import os, asyncio
os.environ["ANTHROPIC_API_KEY"] = "sk-ant-mock-0000000000"   # MOCK key (real runs: your own key)
MODEL = "claude-sonnet-5-5"                                    # model id used by the agent loop

from claude_agent_sdk import query, ClaudeAgentOptions, ResultMessage

schema = {"type": "object",
          "properties": {"vendor": {"type": "string"}, "amount": {"type": "number"}, "due_date": {"type": "string"}},
          "required": ["vendor", "amount", "due_date"]}

opts = ClaudeAgentOptions(model=MODEL, allowed_tools=["Read"],
                          output_format={"type": "json_schema", "schema": schema})

async def main():
    async for m in query(prompt="Extract fields from invoice.txt", options=opts):
        if isinstance(m, ResultMessage) and m.subtype == "success":
            data = m.structured_output                      # already validated against the schema
            print("structured_output:", data)
            print("amount + 10% tax =", round(data["amount"] * 1.10, 2))   # usable typed data, no text parsing

asyncio.run(main())
