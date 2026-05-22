# Chapter 6 — Observability with traces

**Course:** MLOps for LLMs · **Chapter:** 06 · ~4.5 min

## Persona
Andrew. Platform-engineer register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter six. *Observability with traces.* OpenTelemetry GenAI conventions. MLflow and LangSmith. Trace search and replay.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · why traces]

Why traces matter more for LLMs.

*Classical systems.* A request follows a few well-defined paths. Logs at start and end usually suffice.

*LLM systems.* A single request triggers retrieval, prompt construction, model call, tool calls, parsing, post-processing. *Five to fifteen steps with non-deterministic outputs at each.*

When something goes wrong, *"which step caused it?"* is the first question. Without traces, you don't know.

> [S3 ▸ slide change · t ≈ 1:00]

> [S3 ▸ reveal 1 · OpenTelemetry GenAI]

OpenTelemetry GenAI semantic conventions.

The standard. *Vendor-neutral. Defines a shared schema for LLM traces.*

Span attributes you instrument.

*gen-ai.system.* "openai" or "anthropic" or "bedrock."

*gen-ai.request.model.* "gpt-4o" or "claude-sonnet-4."

*gen-ai.usage.input_tokens, output_tokens.* For cost attribution.

*gen-ai.prompt + gen-ai.completion.* The actual content. *Subject to redaction for PII.*

Why standard schemas matter. *Your eval tooling, cost tooling, drift tooling all read the same fields. No bespoke parsing.*

> [S4 ▸ slide change · t ≈ 2:00]

> [S4 ▸ reveal 1 · tooling stack]

Two tooling stacks.

*Stack one — MLflow.* Open-source. Self-hosted. Strong in ML lineage. *LLM tracing now first-class.* Pairs with Databricks if you're on that platform.

*Stack two — LangSmith.* Managed by LangChain. *Strong on trace search, replay, eval linking.* Pay-per-trace pricing. Lock-in moderate.

Both implement OpenTelemetry GenAI. *Choose by team familiarity + ops budget.* Or roll your own on top of OTLP-compatible backend like Jaeger or Honeycomb.

> [S5 ▸ slide change · t ≈ 3:00]

> [S5 ▸ reveal 1 · A/B testing on top]

A/B testing LLM systems — built on traces.

A/B testing LLMs is harder than classical A/B testing. *Non-determinism makes single-run comparisons noisy. User feedback signals lag — sometimes by days.*

The discipline. *Use traces as the eval substrate. Replay both prompts/models against the same input sample. Compare outputs with judges.*

Avoid the trap. *Don't judge on a single offline metric.* Online behavior — engagement, completion, escalation rate — must be the gate.

> [S5 ▸ reveal 2 · the close]

The Monday move. *Pull one production LLM request from the last 24 hours.* Walk the trace. *If you can't see every step + cost + latency, your observability has gaps.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Incident response for LLM failures.*

> [end]
