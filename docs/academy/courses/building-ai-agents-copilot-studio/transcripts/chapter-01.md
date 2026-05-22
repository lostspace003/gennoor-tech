# Chapter 1 — Copilot Studio architecture

**Course:** Building AI Agents with Copilot Studio · **Chapter:** 01 · ~4.5 min

## Persona
Andrew. Architect register. Practitioner.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Welcome to Building AI Agents with Copilot Studio. *Andrew here.* Six components. Three architectural decisions. Governance from day one.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · the principle]

The principle.

Copilot Studio is not a single product. *It's a stack.* And the teams that ship production-grade agents make architectural decisions deliberately at the start. *Not after the third rebuild.*

> [S3 ▸ slide change · t ≈ 0:45]

> [S3 ▸ reveal 1 · 6 components]

Six components of the Copilot Studio stack.

*Component one — the maker portal.* Where you design topics, agents, knowledge sources.

*Component two — the runtime.* Where the agent executes — Teams, web, custom channels.

*Component three — Power Platform and Dataverse.* Where state lives, where connectors flow.

*Component four — the model layer.* Microsoft hosts Azure OpenAI models. Pay-as-you-go or fixed capacity.

*Component five — knowledge sources.* SharePoint, files, web, MCP servers, Dataverse.

*Component six — governance and Power Platform admin centre.* DLP policies, environment strategy, agent inventory.

The pattern. *Every component has its own scaling characteristic. Every component has its own failure mode. Every component has its own admin console.*

> [S4 ▸ slide change · t ≈ 2:15]

> [S4 ▸ reveal 1 · 3 architectural decisions]

Three architectural decisions you make at the start.

*Decision one — environment strategy.* Dev, test, prod minimum. Per-project versus shared. *Get this wrong and ALM becomes painful.*

*Decision two — authentication and authorisation.* User authentication, agent-to-API auth, knowledge source permissions. *Get this wrong and you get a security incident.*

*Decision three — knowledge source pattern.* Centralised governed sources versus agent-team-owned sources. *Get this wrong and you get knowledge sprawl.*

> [S5 ▸ slide change · t ≈ 3:30]

> [S5 ▸ reveal 1 · governance from day one]

Governance touchpoints from day one.

*DLP policies.* Define what connectors can be used in what environments before makers build anything.

*Authentication.* Decide whether agents use user identity (delegated) or service identity (application) at architecture time.

*Sensitivity labels.* Ensure agents respect Microsoft Information Protection labels on documents. *Don't add this after — add it at the start.*

> [S5 ▸ reveal 2 · the close]

The Monday move. *Map your six components on one page.* For each: who owns it, who admins it, what the failure mode is. *That map is your architecture brief.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Topic design versus generative answers.* The four-question framework.

> [end]
