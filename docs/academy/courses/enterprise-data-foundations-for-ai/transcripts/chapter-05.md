# Chapter 5 — Data privacy techniques

**Course:** Enterprise Data Foundations for AI · **Chapter:** 05 · ~4.5 min

## Persona
Andrew. Privacy-engineering register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter five. *Data privacy techniques.* The patterns that let you use sensitive data safely in AI. *Masking, tokenisation, differential privacy.*

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · 3 techniques]

Three privacy techniques. *Different tools for different problems.*

*Technique one — masking.* Replace sensitive values with placeholders. *Customer name becomes "Customer_001." Useful when downstream uses don't need the real value.*

*Technique two — tokenisation.* Replace sensitive values with non-sensitive tokens. The mapping is preserved. *Useful when you need to rejoin or reverse the mapping later — payments, healthcare ID handling.*

*Technique three — differential privacy.* Add calibrated noise so individual identities can't be recovered from aggregate statistics. *Useful when you need to share statistics from sensitive data — research, public reporting, regulatory submissions.*

> [S3 ▸ slide change · t ≈ 1:30]

> [S3 ▸ reveal 1 · when to use what]

When to use what.

*AI model training on sensitive data — synthetic or tokenised data.* You don't need real customer names to train a model on transaction patterns.

*AI inference on production data — proper access controls, encryption, audit.* The data has to be real at inference time. Protect at the perimeter and in transit.

*Reporting or sharing aggregate insights — differential privacy or k-anonymity.* When the output is statistics, not individual records.

*Cross-border data sharing — masking plus tokenisation plus contractual controls.* GDPR Standard Contractual Clauses. DPDPA cross-border permit list.

> [S4 ▸ slide change · t ≈ 2:45]

> [S4 ▸ reveal 1 · 3 privacy failure modes]

Three privacy failure modes.

*Failure mode one — synthetic data that leaks.* Synthetic generated naively from real data leaks information. *Differential privacy bounds are mathematical — synthetic alone is not enough.*

*Failure mode two — masking that doesn't.* Pseudonymisation that's reversible from context. *"Customer_001 in row 42" is still identifiable if there are enough quasi-identifiers.*

*Failure mode three — production access without audit.* Engineer downloads a customer dataset to a laptop. *No audit trail. GDPR breach if the laptop walks.*

> [S5 ▸ slide change · t ≈ 3:45]

> [S5 ▸ reveal 1 · honest scoring]

How to score privacy honestly. *Two questions.*

*Question one — when an engineer needs sensitive data for AI training, what's the standard pattern?* Synthetic or tokenised is green. Real with audit is amber. *Real without controls is red.*

*Question two — when a customer exercises right to deletion, is it actually executed across all systems?* Yes is green. Mostly is amber. *Honestly no is red.*

> [S5 ▸ reveal 2 · the close]

The Monday move. *Trace one production sensitive dataset through to AI model training.* What pattern is used? *If real-without-controls — that's your highest-ROI privacy fix this quarter.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *The platform pattern.* Lakehouse choices, data products, contracts, mesh. *The architectural decisions that tie everything together at scale.*

> [end]
