# Chapter 2 — Model catalog navigation

**Course:** Azure AI Foundry Essentials · **Chapter:** 02 · ~4.5 min

## Persona
Emma. Azure-architect register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter two. *Model catalog navigation.* What Foundry actually offers. The picks that ship.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · 4 model families]

Four model families in the Foundry catalog.

*Family one — Azure OpenAI.* GPT-4 series, GPT-4o, o1-style reasoning models, embeddings. *Microsoft-hosted. SLA + responsible AI tooling built in.*

*Family two — open-weight models.* Llama, Mistral, Phi, Mixtral. *Run on managed compute or serverless. Lower per-token cost. More ops to manage.*

*Family three — partner models.* Cohere, AI21, Stability. Available via marketplace. *Licensing varies. Useful when a specialised model fits the use case.*

*Family four — fine-tuned + custom.* Your own fine-tunes. Hosted on managed compute. *Most teams skip this until they have specific evidence they need it.*

> [S3 ▸ slide change · t ≈ 1:15]

> [S3 ▸ reveal 1 · 3 deployment types]

Three deployment types — and when each fits.

*Type one — serverless API.* Pay per token. No infra to manage. *Default for most workloads. Latency p99 is variable.*

*Type two — managed compute.* Dedicated GPU. Provisioned capacity. *Lower per-token cost above ~10M tokens per month. Predictable latency.*

*Type three — batch endpoints.* Async processing. Lowest per-token cost. *For document summarisation, embedding pipelines, eval runs — anything that doesn't need real-time.*

The rule. *Start serverless. Move to managed compute when monthly token volume justifies. Batch for everything async.*

> [S4 ▸ slide change · t ≈ 2:30]

> [S4 ▸ reveal 1 · 3 selection criteria]

Three criteria for picking the right model.

*Criterion one — quality on your eval set.* Not vendor benchmarks. *Your eval set on your workload.* No exceptions.

*Criterion two — cost per successful task.* Not per token. *Per task that meets your quality bar. Cheap models that need 3 retries to be good are expensive.*

*Criterion three — operational fit.* Does your security team accept the deployment type? Does your latency budget hold? *Pick by what passes review, not by what's exciting.*

> [S5 ▸ slide change · t ≈ 3:30]

> [S5 ▸ reveal 1 · honest scoring]

How to score model selection. *Two questions.*

*Question one — your top model pick has been evaluated on your eval set, not vendor benchmarks?* Yes green · vendor benchmarks only amber · *vibes red*.

*Question two — has cost been modelled per successful task, not per token?* Yes green · per-token amber · *no model at all red*.

> [S5 ▸ reveal 2 · the close]

The Monday move. *Pick your top three candidate models.* Run your eval set against each. *Decide based on the data, not the slide deck.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Project setup and identity.* Managed identity, Key Vault, private endpoints.

> [end]
