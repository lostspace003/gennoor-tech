# Chapter 5 — Vendor management

**Course:** AI Strategy for the CDO · **Chapter:** 05 · ~4.5 min

## Persona
Emma. CDO-board register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter five. *Vendor management.* MDM versus MLOps versus AI platforms. Overlapping turf. The 4-vendor stack nobody can integrate.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · 4 overlapping vendor categories]

Four overlapping vendor categories pitching to your CDO seat.

*Category one — MDM and data catalog.* Collibra, Informatica, Atlan, Alation. *Claim coverage of governance, quality, lineage, and now AI metadata too.*

*Category two — data platforms.* Databricks, Snowflake, AWS, Microsoft Fabric. *Claim coverage of storage, transformation, ML lifecycle, AI applications.*

*Category three — MLOps + LLMOps.* MLflow, Weights and Biases, LangSmith, Comet. *Claim coverage of experiment tracking, model lifecycle, evaluation, observability.*

*Category four — AI platforms.* Azure AI Foundry, AWS Bedrock, Google Vertex AI, plus emerging AI-native platforms. *Claim coverage of model catalog, deployment, evaluation, governance.*

Each vendor claims overlap with the others. *Pitch decks make it look comprehensive. Integration reality is different.*

> [S3 ▸ slide change · t ≈ 1:30]

> [S3 ▸ reveal 1 · 4-vendor trap]

The 4-vendor trap.

The pattern. *Buy one of each category. Hope they integrate.*

Reality. *Four vendor APIs. Four authentication models. Four pricing curves. Four upgrade cadences. Each vendor blames the others when integration breaks.*

The cure. *Default to two strong vendors with explicit integration commitments. Skip a category if your existing two cover 80%.*

Common working pattern.

*Data platform vendor (Databricks or Snowflake or Fabric) covers storage + transformation + ML lifecycle + most AI workloads.*

*Governance vendor (Collibra, Informatica, Atlan) covers catalog + lineage + metadata governance.*

Two vendors. *Real integration. Lower TCO. Faster.*

> [S4 ▸ slide change · t ≈ 2:45]

> [S4 ▸ reveal 1 · 3 vendor selection criteria]

Three CDO-specific vendor selection criteria.

*Criterion one — multi-cloud roadmap.* Will this vendor lock you into one hyperscaler? Especially relevant if your enterprise is hybrid or multi-cloud.

*Criterion two — governance + lineage extensibility.* Does the vendor expose metadata via open APIs? Or proprietary formats only?

*Criterion three — model + data residency support.* For BFSI, healthcare, government — vendor must support your specific residency requirements. *Not "available in your region" — actually contracted in writing.*

> [S5 ▸ slide change · t ≈ 3:30]

> [S5 ▸ reveal 1 · honest scoring]

How to score CDO-level vendor management. *Two questions.*

*Question one — does your data + AI vendor stack have 2-3 strategic vendors, not 5+ overlapping?* 2-3 strategic green · 4 amber · *5+ red — integration debt accumulates*.

*Question two — are vendors selected on multi-cloud, extensibility, residency criteria, not just feature lists?* Yes documented green · partial amber · *no red — vendor lock-in by default*.

> [S5 ▸ reveal 2 · the close]

The Monday move. *Map your current data + AI vendor stack.* If you have more than 4 strategic vendors with overlapping claims, *that\'s the consolidation roadmap.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *KPIs the CDO reports to the board.*

> [end]
