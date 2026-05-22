# Chapter 6 — The platform pattern

**Course:** Enterprise Data Foundations for AI · **Chapter:** 06 · ~4.5 min

## Persona
Andrew. Architecture register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter six. *The platform pattern.* Lakehouse choices, data products, contracts, mesh. *The architectural decisions that tie everything together at scale.*

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · architecture choices]

Two architecture choices most enterprises face.

*Choice one — lakehouse vs warehouse vs lake.* In twenty twenty-six, *most large enterprises end up with a lakehouse pattern.* Databricks, Snowflake, Microsoft Fabric — all converging here. Open formats — Delta, Iceberg, Hudi — make this defensible.

*Choice two — central vs federated.* Pure central — one team owns everything — doesn't scale. *Pure federated — every team builds its own — doesn't compound.* The data mesh pattern is the federated-with-central-platform middle.

For most enterprises — *lakehouse plus federated-with-central-platform.* That's the durable pattern.

> [S3 ▸ slide change · t ≈ 1:15]

> [S3 ▸ reveal 1 · data products]

The data product pattern. *The most important shift of the last few years.*

A data product is a curated, versioned, documented, owned dataset published for consumption. *Like a product internally.* It has an owner, an SLA, a release cadence, a deprecation policy.

Why this matters for AI. *AI initiatives need consumable data, not raw lake tables.* When data is published as products, AI teams move three to five times faster.

The pattern works when *three or four high-value data products exist first* — customer, financial transactions, maybe operational data. *Not when you try to product-ise everything at once.*

> [S4 ▸ slide change · t ≈ 2:30]

> [S4 ▸ reveal 1 · data contracts]

Data contracts. *The reliability layer between producer and consumer.*

A data contract specifies the schema, the SLA, the quality guarantees of a data product. *Upstream producer breaks the contract — they own the fix. Downstream consumer breaks their pipeline using out-of-contract behaviour — they own the fix.*

Without contracts — silent breakages. Upstream changes a column. Downstream pipeline breaks. *Blame ensues.* With contracts — the breakage is detected at the contract boundary, before consumers feel it.

This is plumbing nobody notices when it works. *And everyone notices when it doesn't.*

> [S5 ▸ slide change · t ≈ 3:30]

> [S5 ▸ reveal 1 · honest scoring]

How to score platform honestly. *Two questions.*

*Question one — do you have three or four high-value data products published with owners and SLAs?* Yes is green. One or two is amber. *None is red.*

*Question two — do data contracts exist between producers and consumers of those products?* Yes is green. Informal is amber. *No is red.*

> [S5 ▸ reveal 2 · the close]

The Monday move. *Pick one of your highest-value datasets.* Make it the first data product. *Owner, SLA, quality contract, documentation. Real consumers using it within a quarter. Then expand.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Vendor and tooling reality.* What to buy, what to build, what to consolidate.

> [end]
