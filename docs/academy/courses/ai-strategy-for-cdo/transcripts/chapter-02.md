# Chapter 2 — Data foundations AI actually needs

**Course:** AI Strategy for the CDO · **Chapter:** 02 · ~4.5 min

## Persona
Emma. CDO-board register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter two. *Data foundations AI actually needs.* What unblocks AI. What's data work that doesn't. The minimum viable filter.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · the principle]

The principle.

CDOs accumulate data investment requests. *Catalog rollout. MDM consolidation. Lineage tooling. Quality remediation. Vendor migration.*

All of it is justifiable. *Most of it doesn't unblock the AI roadmap.* The discipline is separating the two.

The minimum viable filter. *Does this work directly enable an AI use case this year?* If yes — prioritize. If no — it can wait, even if it's strategically right long-term.

> [S3 ▸ slide change · t ≈ 1:15]

> [S3 ▸ reveal 1 · what AI needs]

Three data foundations AI genuinely needs.

*Foundation one — retrievable, indexable knowledge.* For RAG use cases. Documents accessible via API. Permissions metadata. Recency tracking. *Not the full enterprise data lake. The specific corpora your AI features need.*

*Foundation two — structured operational data with lineage.* For analytics + decision-support AI. Master data clean enough that AI doesn't hallucinate joins. *Lineage so you can defend numbers to regulators.*

*Foundation three — labelled training data, where needed.* For fine-tuning or eval. Usually small — hundreds to low thousands of labels. *Most teams skip fine-tuning. Most workloads don't need it.*

These three unblock AI. *Everything else can wait.*

> [S4 ▸ slide change · t ≈ 2:30]

> [S4 ▸ reveal 1 · what AI doesn't need]

Three data investments that don't unblock AI.

*Doesn't unblock — full MDM consolidation.* AI features work on specific datasets. They don't need the entire enterprise master data to be unified.

*Doesn't unblock — comprehensive data catalog.* AI engineers find their data through Slack and tribal knowledge. Catalog helps governance, not feature shipping.

*Doesn't unblock — universal lineage.* Lineage matters for regulator-facing numbers. Not for most AI features.

These investments may be strategically right. *They just shouldn't be on the critical path to AI value.* Sequence them after AI proves out.

> [S5 ▸ slide change · t ≈ 3:30]

> [S5 ▸ reveal 1 · honest scoring]

How to score data foundation discipline. *Two questions.*

*Question one — when an AI feature is blocked by data, what's the typical lag from request to unblocked?* <30 days green · 30-90 amber · *>90 red — data team is the bottleneck*.

*Question two — does every data investment >$200K have a documented AI use case it unblocks within 12 months?* Yes green · some do amber · *no/most justified differently red — boil-the-ocean spending*.

> [S5 ▸ reveal 2 · the close]

The Monday move. *List your team's top 5 data investments.* For each, name the AI use case unblocked within 12 months. *Ones without clear answer are the ones to defer.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Governance partnership with CISO and CRO.*

> [end]
