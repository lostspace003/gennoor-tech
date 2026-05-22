# Chapter 3 — Architecture and grounding

**Course:** HR Copilot Case Study · **Chapter:** 03 · ~4.5 min

## Persona
Emma. Builder-storyteller register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter three. *Architecture and grounding.* Two grounding patterns. Row-level security so users see what they may see.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · 2 grounding patterns]

Two grounding patterns the copilot uses.

*Pattern one — policy doc grounding.* Onboarding policy · leave policy · benefits · expense rules. *SharePoint as source. Indexed via Azure AI Search. Retrieved at query time.*

*Pattern two — HRIS data grounding.* Employee profile · manager · entitlements · accrued leave · location-specific policies. *Dataverse as source. Queried at runtime. Filtered by identity.*

Both are grounding. *Different data shapes need different patterns.* Mixing them in one query is what makes the copilot feel intelligent.

> [S3 ▸ slide change · t ≈ 1:15]

> [S3 ▸ reveal 1 · row-level security]

Row-level security — the critical pattern.

*The principle.* Copilot answers only what the calling user is allowed to see in source systems.

*The implementation.* Dataverse security roles propagated through Copilot Studio's on-behalf-of authentication. *User context flows from front-end → Copilot Studio → Dataverse query. Dataverse applies security roles.*

*Tested cross-role before launch.* Test as IC · as manager · as director · as HR admin. *Each role sees different data. Each role answers different questions.*

Without this. *Privacy incident waiting.* "Show me Priya's leave balance" can't be answered by anyone except Priya, her manager, and HR. Copilot must enforce this.

> [S4 ▸ slide change · t ≈ 2:30]

> [S4 ▸ reveal 1 · mixing patterns]

Mixing patterns in one query.

The hardest queries combine both patterns. *Example: "How many days of vacation do I have left and what's the carry-forward policy?"*

*"How many days of vacation do I have left"* — HRIS data, user-specific.

*"What's the carry-forward policy"* — policy doc.

The copilot's orchestration. *Recognise both. Query both sources. Combine in one answer with citation.*

This is where Copilot Studio's topic + generative-answer hybrid shines. *Topic handles HRIS query. Generative answer with retrieval handles policy. One response stitches them.*

> [S5 ▸ slide change · t ≈ 3:45]

> [S5 ▸ reveal 1 · honest scoring]

How to score architecture + grounding. *Two questions.*

*Question one — has RLS been tested cross-role before launch?* Yes systematically green · informally amber · *no red — privacy incident risk*.

*Question two — for queries combining HRIS data + policy, does the copilot handle both in one answer?* Yes green · separate handling amber · *no/only one source per query red — feels broken to users*.

> [S5 ▸ reveal 2 · the close]

The Monday move. *Pick your top 10 expected user queries.* For each, identify HRIS-only · policy-only · or both. *Distribution tells you the architectural priority.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Building the conversation flow.*

> [end]
