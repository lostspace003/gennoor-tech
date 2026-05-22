# Chapter 5 — Dimension 4 · Infrastructure

**Course:** AI Readiness Assessment · **Chapter:** 05 · ~4.5 min

## Persona
Emma. Infrastructure + ops register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter five. *The infrastructure dimension.* Compute, MLOps, model registry, observability. *The plumbing that makes AI possible — or makes every AI project ten times harder.*

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · 4 components]

Four infrastructure components for AI readiness.

*Component one — compute.* GPU access, cloud spend predictability, capacity for training and inference. *Not "do we have GPUs in the basement" — do we have a defensible compute strategy.*

*Component two — MLOps.* The pipeline from experiment to production. Versioning. CI/CD for models. *Without this, every deployment is a one-off heroics exercise.*

*Component three — model registry.* A single source of truth for what models are deployed where, who owns them, when they were last evaluated. *Most orgs don't have this. Then they discover stale models in production after an incident.*

*Component four — observability.* Real-time monitoring of model performance, data drift, prediction quality. *AI systems silently degrade. Without observability you find out from customers, not dashboards.*

> [S3 ▸ slide change · t ≈ 1:15]

> [S3 ▸ reveal 1 · 3 common gaps]

Three infrastructure gaps I see consistently.

*Gap one — shadow MLOps.* Each team has built its own pipeline. *No standardisation. Five different model registries. Three different monitoring approaches.* Diffusion of effort.

*Gap two — compute cost surprise.* AI workloads run, cloud bills spike, finance gets surprised. *No predictability. No FinOps discipline applied to AI.*

*Gap three — silent model decay.* Models deployed two years ago still serving traffic. *No one is checking whether they still work. Data drift accumulates. Predictions degrade. Eventually a customer notices.*

> [S4 ▸ slide change · t ≈ 2:30]

> [S4 ▸ reveal 1 · cloud + edge realities]

Cloud + edge realities. *Both matter.*

*Cloud AI.* AWS, Azure, GCP all have mature AI/ML platforms. *The question is: are you standardised on one or fragmented across all three?* Fragmentation kills compounding learning. *Pick one as primary. Use the others tactically.*

*Edge AI.* For latency, privacy, or cost reasons. *Most enterprises will need some edge AI within two to three years.* Plan now.

*Hybrid.* The reality for most large enterprises. *Make the seams deliberate, not accidental.*

> [S5 ▸ slide change · t ≈ 3:15]

> [S5 ▸ reveal 1 · honest scoring]

How to score infrastructure honestly. *Three questions.*

*Question one — can you deploy a new model to production in under two weeks if compliance approves?* Yes is green. Usually is amber. No is red.

*Question two — do you have a current registry of all production models with last-evaluation dates?* Yes is green. Partial is amber. No is red.

*Question three — when a model's prediction quality drops by ten percent, how do you find out?* Automated alert is green. Manual review is amber. *Customer complaint is red.*

> [S5 ▸ reveal 2 · the close]

The Monday move. *Ask your engineering team to pull the registry of every model in production with last-evaluation date.* If no such registry exists — that's your highest-ROI infrastructure investment this quarter. *Without it, you don't know what's silently breaking.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Dimension five — leadership commitment.* Sponsorship, funding, ROI patience. *The dimension that doesn't show up in technical assessments but determines everything.*

> [end]
