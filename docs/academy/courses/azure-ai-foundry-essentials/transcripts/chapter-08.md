# Chapter 8 — Capstone: Promote a Foundry project to production

**Course:** Azure AI Foundry Essentials · **Chapter:** 08 · ~5 min

## Persona
Emma. Azure-architect register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter eight. *Capstone.* Production sign-off pack. 4 trust trip-wires. The builder.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · the principle]

The principle. *Foundry promotes you from POC to production.* The sign-off pack is what your platform team accepts as evidence.

> [S3 ▸ slide change · t ≈ 0:45]

> [S3 ▸ reveal 1 · the sign-off pack]

The four sections of a production sign-off pack.

*Section one — workload summary.* What it does. Who uses it. Expected volume. Latency budget.

*Section two — deployment plan.* Model choice. Deployment type (serverless, PTU, managed compute, batch). Identity + Key Vault + private endpoint setup. Region.

*Section three — eval evidence.* Gold eval set + baseline metrics + last 3 eval runs. Disagreement triage notes.

*Section four — operational readiness.* Cost telemetry wired. 3 alerts in place. Rollback tested. On-call runbook published.

Each section: one page. Owner signed. *Stored in the Foundry project page.*

> [S4 ▸ slide change · t ≈ 2:00]

> [S4 ▸ reveal 1 · 4 trust trip-wires]

Four trust trip-wires. *Do not cross.*

*Trip-wire one — API keys in env vars.* Use managed identity. Always.

*Trip-wire two — workload promoted without an eval flow.* Every deploy without measurement is a guess. *No eval = no go-live.*

*Trip-wire three — rollback that hasn't been tested.* Untested rollback during incident = no rollback.

*Trip-wire four — production cost without per-feature breakdown.* Optimisation is blind without it.

> [S5 ▸ slide change · t ≈ 3:15]

> [S5 ▸ reveal 1 · the builder]

The interactive Foundry sign-off builder.

Pick your deployment type. Pick your eval depth. Pick your identity model. *Download the sign-off pack Markdown.* Take it to platform review Monday.

> [S5 ▸ reveal 2 · the close]

The course in one breath. *Foundry is the production layer on top of Azure AI.* Hub-project-connections. Pick the deployment type that matches volume + latency. Identity via managed + Key Vault + private endpoints. Eval flow on every change. Cost telemetry + alerts. 20-item checklist with 3 disqualifiers. 4 trust trip-wires.

*Eight chapters. That's the course.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · the final close]

Open the builder. Build your sign-off pack. *Get platform team review on the calendar before next Friday.*

See you in the next one.

> [end]
