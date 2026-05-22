# Chapter 3 — Clinical trial operations

**Course:** AI in Pharma · **Chapter:** 03 · ~4.5 min

## Persona
Emma. Clinical-ops register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter three. *Clinical trial operations.* Patient identification, site selection, data quality.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · 4 use cases]

Four clinical trial AI use cases.

*Use case one — patient identification.* AI surfaces patients who may meet inclusion criteria across EHR data. *Speeds enrolment, particularly in rare disease.*

*Use case two — site selection.* AI predicts which clinical trial sites will deliver on enrolment, quality, and timeline. Reduces wasted activation cost.

*Use case three — protocol optimisation.* AI analyses similar trials to flag protocol elements likely to cause enrolment difficulty, protocol amendments, or data quality issues.

*Use case four — data quality monitoring.* Risk-based monitoring augmented by AI. Anomalies in data patterns surface for medical and data manager review.

> [S3 ▸ slide change · t ≈ 1:15]

> [S3 ▸ reveal 1 · the GCP constraint]

The Good Clinical Practice constraint. *Always.*

AI-supported patient identification is acceptable. *AI deciding patient eligibility without investigator review is not.* The investigator remains the eligibility decision-maker. *ICH GCP, FDA twenty-one CFR Part Three Twelve, EMA Clinical Trial Regulation all assume this.*

AI-supported data quality monitoring is acceptable. *AI altering or correcting trial data autonomously is not.* The data manager and medical monitor remain accountable.

The discipline. *AI accelerates the human work. AI does not replace the human accountability that GCP requires.*

> [S4 ▸ slide change · t ≈ 2:30]

> [S4 ▸ reveal 1 · the consent question]

The consent question.

When AI is used to identify patients for trial outreach. *Is the patient's data being processed for this purpose lawful? Have they consented or is the use covered by other legal basis?*

In most jurisdictions, retrospective EHR queries for trial feasibility are acceptable under specific conditions. *Patient outreach based on AI-surfaced records requires careful handling — particularly under GDPR, HIPAA, India DPDPA.*

What works. *Institutional Review Board approval for the AI-enabled identification protocol. Documented legal basis. Patient communication that does not surveil and does not surprise.*

What does not work. *AI surfaces patients for outreach without IRB review. Patient receives a call about a trial and is unclear how their information was found. Trust damaged.*

> [S5 ▸ slide change · t ≈ 3:30]

> [S5 ▸ reveal 1 · honest scoring]

How to score clinical trial AI honestly. *Two questions.*

*Question one — for AI-supported patient identification, has the protocol been IRB-reviewed and consent path documented?* Yes for all studies green. Most amber. *No or honestly variable red.*

*Question two — for AI-supported data quality monitoring, are anomaly findings routed through medical monitor and data manager review?* Yes green. Sometimes amber. *Automated correction without review red.*

> [S5 ▸ reveal 2 · the close]

The Monday move. *Pull one current trial using AI for patient ID.* What was the IRB approval scope? Is the actual use within scope? *Drift between approved scope and operational practice is the regulatory risk.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Regulatory submission preparation.* Where AI saves significant time without crossing regulatory lines.

> [end]
