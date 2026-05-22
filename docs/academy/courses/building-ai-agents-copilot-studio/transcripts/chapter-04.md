# Chapter 4 — Agents and agent flows

**Course:** Building AI Agents with Copilot Studio · **Chapter:** 04 · ~4.5 min

## Persona
Andrew. Architect register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter four. *Agents and agent flows.* What makes it an agent. Orchestration patterns.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · 3 differences that make it an agent]

Three differences that separate an agent from a chatbot.

*Difference one — state.* Agent remembers context across turns. *Last filter applied, last entity, last decision.*

*Difference two — reasoning.* Agent can plan multi-step actions. *"To file this expense, I need to: check policy, validate receipt, route for approval."*

*Difference three — tool composition.* Agent invokes multiple tools to accomplish a goal. *Not one fixed flow per topic.*

A topic-based chatbot has none of these. *An agent has all three.*

> [S3 ▸ slide change · t ≈ 1:15]

> [S3 ▸ reveal 1 · 3 orchestration patterns]

Three orchestration patterns in production.

*Pattern one — question and answer.* User asks. Agent retrieves grounded answer. *Single-tool, single-turn.* Most common starting point.

*Pattern two — transactional.* User initiates a workflow. Agent orchestrates multiple tool calls to complete it. *File expense. Create ticket. Update record.*

*Pattern three — research.* User asks an open question. Agent iteratively queries knowledge sources, refines, synthesises. *Multi-turn. Multi-source.*

Each pattern has different latency, different failure modes, different testing requirements.

> [S4 ▸ slide change · t ≈ 2:30]

> [S4 ▸ reveal 1 · state isolation under load]

State isolation tested under concurrent load.

This is where most agents fail in production. *In dev, you test one user. In production, you have hundreds concurrent.*

*State isolation failure mode.* User A's context leaks into User B's session. *Security incident. Trust failure.*

The discipline. *Concurrent-load test with multiple synthetic users.* User-specific data should never appear in another user's response. *Test this explicitly before launch.*

> [S5 ▸ slide change · t ≈ 3:30]

> [S5 ▸ reveal 1 · honest scoring]

How to score agent design honestly. *Two questions.*

*Question one — state isolation tested under realistic concurrent load before launch?* Yes green · single-user testing only amber · *no red — security incident waiting.*

*Question two — orchestration pattern matches use case?* Yes intentionally green · default-applied amber · *no/mismatched red.*

> [S5 ▸ reveal 2 · the close]

The Monday move. *Pick one production agent.* Map its orchestration. Run a 20-user concurrent test. *Watch for state leakage.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Knowledge sources, MCP, and Dataverse grounding.*

> [end]
