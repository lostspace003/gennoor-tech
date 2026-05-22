# Chapter 5 — Deployment options

**Course:** Azure AI Foundry Essentials · **Chapter:** 05 · ~4.5 min

## Persona
Emma. Azure-architect register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter five. *Deployment options.* Serverless. Managed compute. PTU. Batch. The picks that fit each workload.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · 4 deployment types]

Four deployment types in Foundry.

*Type one — serverless API.* Shared infrastructure. Pay per token. *Default. Lowest barrier. Variable latency.*

*Type two — Provisioned Throughput Units, PTU.* Reserved capacity on Azure OpenAI. Fixed cost per hour. *Predictable latency. Cheaper above a threshold.*

*Type three — managed compute.* Dedicated GPU instances. Full control. *For open-weight models, custom fine-tunes, or workloads needing the most control.*

*Type four — batch endpoints.* Async processing. Lowest per-token cost. *For document pipelines, eval runs, periodic re-embedding.*

> [S3 ▸ slide change · t ≈ 1:15]

> [S3 ▸ reveal 1 · when each fits]

When each deployment type fits.

*Serverless.* Default for prototypes and low-volume production. *Up to ~5M tokens/month per workload.*

*PTU.* Tipping point usually around 10M tokens/month per workload. *Calculator: count last month's tokens. PTU price at your tier vs serverless cost. Switch when PTU is cheaper.*

*Managed compute.* Open-weight models. Workloads requiring data-residency guarantees. *Higher fixed cost, you operate it.*

*Batch.* Anything that can wait minutes to hours. *Cost reduction can be 50%+ versus real-time.*

> [S4 ▸ slide change · t ≈ 2:30]

> [S4 ▸ reveal 1 · 3 latency rules]

Three latency rules.

*Rule one — serverless P99 is variable.* On a busy day, P99 latency can spike 3-5x. *Critical if you have a sub-second budget.*

*Rule two — PTU stabilises latency.* Reserved capacity means consistent response times. *That's often the actual reason to pay for PTU, not cost.*

*Rule three — batch is irrelevant to latency.* Don't put a real-time user-facing query in a batch endpoint. *Latency is measured in minutes, not seconds.*

> [S5 ▸ slide change · t ≈ 3:15]

> [S5 ▸ reveal 1 · honest scoring]

How to score deployment fit. *Two questions.*

*Question one — does your workload's deployment type match its actual volume + latency profile?* Yes green · "we picked it 6 months ago" amber · *no/no-one-checked red — cost or quality is being burned*.

*Question two — for high-volume workloads, has PTU vs serverless been calculated in the last quarter?* Yes green · informally amber · *no red — money on the table or fire about to start*.

> [S5 ▸ reveal 2 · the close]

The Monday move. *Pull last month's token count by workload.* Map each to recommended deployment type. *Mismatches are your cost or quality optimization.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Cost monitoring.* Catching runaway spend before the invoice does.

> [end]
