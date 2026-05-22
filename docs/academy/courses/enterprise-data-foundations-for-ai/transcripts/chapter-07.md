# Chapter 7 — Vendor + tooling reality

**Course:** Enterprise Data Foundations for AI · **Chapter:** 07 · ~4.5 min

## Persona
Andrew. Vendor + buy-build register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter seven. *Vendor and tooling reality.* What to buy. What to build. *What to consolidate.*

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · the landscape]

The vendor landscape in twenty twenty-six.

*Cloud data platforms.* Databricks, Snowflake, Microsoft Fabric, Google BigQuery, AWS Redshift. *Consolidation is real. Most enterprises end up on one or two.*

*Data governance and catalogue.* Collibra, Alation, Atlan, Microsoft Purview. *Specialist tools for metadata, lineage, access governance.*

*Quality and observability.* Monte Carlo, Bigeye, Soda, native cloud quality tools. *Watch for vendor lock-in to one platform.*

*Privacy and synthetic data.* Privitar, Tonic, Mostly AI, Statice. *Useful where sensitive data and AI training intersect.*

> [S3 ▸ slide change · t ≈ 1:15]

> [S3 ▸ reveal 1 · build vs buy]

Build vs buy. *Three principles.*

*Principle one — buy commodity, build differentiator.* Storage, compute, basic governance, basic catalogue — *buy. Mature, plenty of vendors.* AI-specific accelerators, custom feature stores aligned to your business — *build only when it's truly differentiating.*

*Principle two — single throat to choke beats best-of-breed.* The integration cost of stitching ten best-of-breed tools is real. *Most enterprises do better with a primary platform plus two or three specialists than with twelve tools.*

*Principle three — vendor lock-in is real, plan for it.* Open formats (Delta, Iceberg, Parquet) reduce lock-in. *Closed proprietary formats increase it. The decision lives with three-year strategic visibility.*

> [S4 ▸ slide change · t ≈ 2:30]

> [S4 ▸ reveal 1 · consolidation]

Consolidation. *Most enterprises are over-tooled.*

*The pattern I see.* Marketing buys one tool. Engineering buys another. Data team buys a third. *Each does part of governance. Lineage scattered. Access policies in three places.*

Consolidate when. *Renewal is coming up.* When migration cost is lower than ongoing duplication cost. *When the political moment exists.*

*Don't consolidate prematurely.* If you've just bought a tool, give it eighteen months of runway. *Reorganising every six months destroys momentum.*

> [S5 ▸ slide change · t ≈ 3:30]

> [S5 ▸ reveal 1 · honest scoring]

How to score vendor reality honestly. *Two questions.*

*Question one — what's your primary data platform and is the org standardised on it?* Standardised is green. Multi-platform with reason is amber. *Five platforms with no reason is red.*

*Question two — do contracts with data and AI vendors include AI-specific terms — training data rights, model updates, sunset?* Yes is green. Some is amber. No is red.

> [S5 ▸ reveal 2 · the close]

The Monday move. *List every data and AI tool in your org budget.* Group by function. *Where do you have three tools doing the same thing? That's the consolidation conversation.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Last chapter. *Your data foundations roadmap.* Where to start. What to sequence. Four trust trip-wires.

> [end]
