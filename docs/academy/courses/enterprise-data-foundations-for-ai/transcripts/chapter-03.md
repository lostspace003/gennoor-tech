# Chapter 3 — Data lineage

**Course:** Enterprise Data Foundations for AI · **Chapter:** 03 · ~4.5 min

## Persona
Andrew. Audit-defensibility register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter three. *Data lineage.* Provenance you can defend to an auditor. *Where your data came from. What was transformed. Who touched it.*

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · why lineage matters]

Why lineage matters now. *Three reasons.*

*Reason one — AI explainability.* When a model predicts something significant — credit decision, hire screening, claims — you need to explain what data went in. *Lineage is the trail.*

*Reason two — regulatory readiness.* EU AI Act Article fifteen requires traceability for high-risk AI systems. *NIST AI RMF's measure function expects it. GDPR Article thirty record-keeping requires it for personal data flows.*

*Reason three — incident response.* When something goes wrong — a model gives a bad prediction, a customer complaint, a regulator inquiry — *the first question is "what data was used and where did it come from?" If you can't answer in two business days, you have a lineage problem.*

> [S3 ▸ slide change · t ≈ 1:30]

> [S3 ▸ reveal 1 · 3 lineage layers]

Three layers of lineage.

*Layer one — source-to-sink.* Where data originated, where it landed. *The simplest layer. Most platforms support it.*

*Layer two — transformation lineage.* What logic was applied to the data between source and sink. *Filters, joins, aggregations, derived columns. Where most lineage tools stop being useful.*

*Layer three — semantic lineage.* What this data means at each step. *"Customer value" calculated one way in marketing vs another way in finance — both feeding the same AI model. Semantic mismatch causes silent failures.*

> [S4 ▸ slide change · t ≈ 2:45]

> [S4 ▸ reveal 1 · what works]

What works for lineage.

*One — automated lineage capture in pipelines.* Tools like dbt, Apache Atlas, Collibra, modern data platforms surface lineage automatically. *Avoid manual lineage documentation — it goes stale within months.*

*Two — lineage as part of the data product spec.* Each data product publishes its lineage as metadata. Consumers know what's upstream before they depend on it.

*Three — semantic models maintained centrally.* "Customer," "revenue," "active user" defined once and referenced everywhere. *Same definition across functions. Same definition into AI models.*

> [S5 ▸ slide change · t ≈ 3:45]

> [S5 ▸ reveal 1 · honest scoring]

How to score lineage honestly. *Two questions.*

*Question one — for your highest-priority AI use case, can you produce a complete lineage diagram in two business days?* Yes is green. With effort is amber. Honestly no is red.

*Question two — do you have a central semantic model that defines key business entities consistently across functions?* Yes is green. Partial is amber. No is red.

> [S5 ▸ reveal 2 · the close]

The Monday move. *Pick one AI initiative you've shipped or are about to ship.* Ask the team for a complete lineage diagram. *If they can't produce one in two days, you have your next quarter's lineage investment priority.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Governance.* Ownership, access, retention, deletion. *GDPR plus DPDPA plus CCPA enforceability.*

> [end]
