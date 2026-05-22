# Chapter 2 — Data quality

**Course:** Enterprise Data Foundations for AI · **Chapter:** 02 · ~4.5 min

## Persona
Andrew. Quality-discipline register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter two. *Data quality.* The DAMA framework applied with discipline. *Accuracy, completeness, freshness, consistency.*

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · 4 dimensions]

Four dimensions of data quality from the DAMA Data Management Body of Knowledge.

*Accuracy.* Does the data match the real-world entity? Customer name spelled right. Address current. Amount correct.

*Completeness.* Are required fields populated? Or are critical fields null fifteen percent of the time?

*Freshness.* When was the data last updated? *Last quarter is not fresh for customer behaviour data. It is fresh for company-headquarters data.*

*Consistency.* Does the same customer show up the same way in CRM, ERP, billing, marketing? *Or is "ACME Corp" in one system and "Acme Inc." in another?*

> [S3 ▸ slide change · t ≈ 1:15]

> [S3 ▸ reveal 1 · 3 quality failure modes]

Three quality failure modes I see consistently.

*Failure mode one — entity resolution gap.* Same customer, multiple records. *Each system maintains its own version of truth. Reconciliation is manual. Errors compound.*

*Failure mode two — silent drift.* Source data changes — new field added upstream, format change, encoding shift. *Downstream pipelines keep running. Bad data flows. Months later, somebody notices.*

*Failure mode three — quality assumed not tested.* No automated quality checks. No alerting on anomalies. *Quality is whatever the data engineering team feels like checking that week.*

> [S4 ▸ slide change · t ≈ 2:30]

> [S4 ▸ reveal 1 · what works]

What works for data quality. *Three patterns.*

*Pattern one — quality at the source.* Fix data at point of capture, not in downstream pipelines. *A web form that validates email format. A workflow that requires complete fields. A clerk who calls back if the address looks wrong.*

*Pattern two — automated quality monitoring.* Run quality checks on every pipeline run. Alert when accuracy or completeness drops below threshold. *Catch silent drift before it cascades.*

*Pattern three — data quality SLAs published per data product.* Each consumer knows what quality bar this dataset meets. *No surprises.*

> [S5 ▸ slide change · t ≈ 3:30]

> [S5 ▸ reveal 1 · honest scoring]

How to score data quality honestly. *Three questions.*

*Question one — pick the top three datasets you use for AI.* Audit each on accuracy, completeness, freshness. *Below seventy percent pass rate is red.*

*Question two — when source data changes, do you find out automatically?* Yes is green. Manual review is amber. *Customer complaint is red.*

*Question three — do you publish quality SLAs per data product?* Yes is green. Internal is amber. *No is red.*

> [S5 ▸ reveal 2 · the close]

The Monday move. *Pick your most-used dataset.* Two-hour quality audit on accuracy, completeness, freshness. *Score it. If below seventy percent, that's your highest-ROI fix this quarter.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Lineage.* Provenance you can defend to an auditor. *Where your data came from, what was transformed, who touched it.*

> [end]
