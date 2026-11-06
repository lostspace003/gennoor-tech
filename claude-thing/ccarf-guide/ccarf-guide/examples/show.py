"""Printing helper shared by the examples: turns SDK messages into readable lines."""
from claude_agent_sdk import AssistantMessage, UserMessage, SystemMessage, ResultMessage, TextBlock, ToolUseBlock

def show(msg):
    pad = "    (subagent) " if getattr(msg, "parent_tool_use_id", None) else ""
    if isinstance(msg, AssistantMessage):
        for b in msg.content:
            if isinstance(b, ToolUseBlock): print(f"{pad}[tool_use] {b.name} {b.input}")
            elif isinstance(b, TextBlock): print(f"{pad}{b.text}")
    elif isinstance(msg, UserMessage):
        for b in msg.content:
            print(f"{pad}[tool_result{' ERROR' if b.is_error else ''}] {b.content}")
    elif isinstance(msg, ResultMessage):
        print(f"-- {msg.subtype}: turns={msg.num_turns} cost=${msg.total_cost_usd} session={msg.session_id}")
