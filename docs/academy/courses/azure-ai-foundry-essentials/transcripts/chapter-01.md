# Chapter 1 — Foundry architecture

**Course:** Azure AI Foundry Essentials · **Chapter:** 01 · ~4.5 min

## Persona
Emma. Azure-architect register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Welcome to Azure AI Foundry Essentials. *Emma here.* Hubs, projects, connections. What runs where. When Foundry beats raw Azure OpenAI.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · the principle]

The principle.

*Foundry is the production layer on top of Azure AI.* You can build LLM features by gluing Azure OpenAI, AI Search, and Functions together. *Most teams do.*

What you get back at three projects in. *Operational mess.* Different deployment patterns. Different identity strategies. Different cost dashboards. Nothing scales.

Foundry consolidates that. *Hub. Project. Connections.* The price is learning a new abstraction. The payoff is one place to manage all of it.

> [S3 ▸ slide change · t ≈ 1:15]

> [S3 ▸ reveal 1 · 3-layer architecture]

The three-layer Foundry architecture.

*Layer one — the hub.* Tenant-level. Shared compute. Shared keyvault. Identity boundaries. *One hub per business unit usually.*

*Layer two — the project.* Where a specific AI workload lives. Models, evals, deployments, traces. *Roughly one project per shipping feature or product.*

*Layer three — connections.* How a project reaches into Azure OpenAI, AI Search, storage, custom endpoints. *Connections live at the project level with managed identity.*

The mental model. *Hub = your foundation. Project = your application. Connections = your dependencies.*

> [S4 ▸ slide change · t ≈ 2:30]

> [S4 ▸ reveal 1 · Foundry vs raw Azure OpenAI]

Foundry versus raw Azure OpenAI.

*When raw Azure OpenAI is fine.* Single feature. One team. Mature MLOps already in place. *Foundry adds overhead you don't need.*

*When Foundry pays back.* Multiple features. Multiple teams. Shared evaluation discipline. *Centralised cost + identity + observability.*

*Migration path.* Start raw. Migrate to Foundry when the third feature ships. *Premature Foundry is overhead. Late Foundry is rework.*

> [S5 ▸ slide change · t ≈ 3:30]

> [S5 ▸ reveal 1 · honest scoring]

How to score Foundry readiness. *Two questions.*

*Question one — do you have 3+ LLM features in production?* Yes green · 1-2 amber · *zero red — raw Azure OpenAI is fine for now*.

*Question two — does your platform team operate the Foundry hub, or every dev team rolls their own?* Platform-operated green · mixed amber · *every-team-rolls-own red — Foundry's value is consolidation, you've lost it*.

> [S5 ▸ reveal 2 · the close]

The Monday move. *Inventory your current Azure AI workloads.* Map each to: which hub, which project. *If everything is "ad-hoc," that's the migration plan.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Model catalog navigation.* Azure OpenAI · Mistral · Llama · Phi · partner models.

> [end]
