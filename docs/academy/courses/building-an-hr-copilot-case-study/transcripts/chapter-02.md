# Chapter 2 — Stack Fit Assessment

**Course:** HR Copilot Case Study · **Chapter:** 02 · ~4.5 min

## Persona
Emma. Builder-storyteller register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter two. *Stack Fit Assessment.* Azure OpenAI · Copilot Studio · Dataverse. The integration gotchas at pilot scale.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · 3-layer fit]

Three layers · three Microsoft services.

*Layer one — model.* Azure OpenAI · GPT-4o for primary. text-embedding-3-large for embeddings on policy docs.

*Layer two — orchestration.* Copilot Studio. *Topics for deterministic flows (leave request · expense submission). Generative answers for policy questions.*

*Layer three — data.* Dataverse for HRIS data (employee profile · manager · location · entitlements). SharePoint for policy documents.

> [S3 ▸ slide change · t ≈ 1:00]

> [S3 ▸ reveal 1 · integration gotchas]

Three integration gotchas that show up only at pilot scale.

*Gotcha one — identity flow.* Copilot Studio auth flow into Dataverse via on-behalf-of token. *Worked fine in demo. Pilot users hit token-refresh race conditions. Took two days to root-cause.*

*Gotcha two — Dataverse RLS scale.* Row-level security tested with 5 users worked. Tested with 500 users surfaced per-query latency spike. *Index strategy needed updating.*

*Gotcha three — SharePoint connector throttling.* SharePoint search API has rate limits. With 50 concurrent users, hit throttle. *Cache layer added.*

These three are predictable. *Plan capacity testing into pilot before broad rollout.*

> [S4 ▸ slide change · t ≈ 2:00]

> [S4 ▸ reveal 1 · why not other stacks]

Why not other stacks for this case.

*Why not pure Azure OpenAI Service.* Without Copilot Studio, the team would build the orchestration layer themselves. *4-6 weeks of work. Not differentiated.*

*Why not Power Virtual Agents legacy.* Deprecated in favour of Copilot Studio. *Wouldn't be supported long-term.*

*Why not third-party (Zendesk · ServiceNow with AI).* Existing licenses but no HRIS integration. *Cost of additional licenses + integration work exceeded Copilot Studio path.*

The Stack Fit was specific to this enterprise's existing Microsoft 365 + Dynamics 365 footprint. *Different enterprise, different stack — same Stack Fit Assessment discipline.*

> [S5 ▸ slide change · t ≈ 3:15]

> [S5 ▸ reveal 1 · honest scoring]

How to score Stack Fit. *Two questions.*

*Question one — did you do capacity testing at pilot scale before broad rollout?* Yes documented green · "we tested with 5 users" amber · *no/zero red — integration gotchas will surface in production*.

*Question two — did the Stack Fit Assessment include "why not" for alternatives?* Yes documented green · partial amber · *no red — defaulted without comparing*.

> [S5 ▸ reveal 2 · the close]

The Monday move. *Walk your current AI stack with your IT architect.* For each layer, what's the alternative? *That comparison is what makes the choice defensible.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Architecture and grounding.*

> [end]
