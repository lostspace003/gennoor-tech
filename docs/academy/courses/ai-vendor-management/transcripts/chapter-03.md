# Chapter 3 — Contract terms

**Course:** AI Vendor Management · **Chapter:** 03 · ~4.5 min

## Persona
Andrew. Procurement-discipline register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter three. *Contract terms.* Six AI-specific clauses most standard MSAs are missing.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · 6 clauses]

Six AI-specific clauses you negotiate in.

*Clause one — data use commitment.* Vendor cannot use your data, prompts, or outputs to train their general models. *Explicit. Written. Not in the privacy policy where it can be quietly amended.*

*Clause two — sub-processor disclosure.* Named list of every sub-processor handling your data. Change requires advance notice. *Without this, sub-processors swap silently.*

*Clause three — model lineage transparency.* What model, what version, what training data domains. *Updated when the vendor changes models.*

*Clause four — performance + drift remedies.* Defined metrics for accuracy, latency, drift. Remedies when missed. *Not "best efforts" language.*

*Clause five — IP and output ownership.* Outputs generated using your prompts and data are yours. *Some vendor MSAs grab joint IP rights silently.*

*Clause six — exit cooperation.* Data return, model deletion proof, transition support for a defined period. *Otherwise exit becomes hostage negotiation.*

> [S3 ▸ slide change · t ≈ 1:45]

> [S3 ▸ reveal 1 · training-data trap]

The training-data trap.

Most standard SaaS contracts have permissive training-data language buried in privacy policies or DPAs. *Vendor can use your data for product improvement, model training, or analytics.*

For AI vendors specifically, this is unacceptable. *Your data becomes their competitive advantage. Your prompts train their models. Your edge cases become their training set.*

The fix. *Negotiate this explicitly into the master agreement, not the DPA. "Customer data, prompts, outputs, and embeddings shall not be used for training, model improvement, or any general-purpose machine learning."*

Vendors with "no, that's not how we work" answers. *Get it in writing anyway.* What they say evolves; what they sign holds.

> [S4 ▸ slide change · t ≈ 3:00]

> [S4 ▸ reveal 1 · regulator-driven clauses]

Three regulator-driven clauses for specific contexts.

*Clause one — BFSI.* RBI, MAS, SAMA, ADGM cyber + outsourcing guidelines. *Right to audit. On-shore data residency commitments. Sub-processor approval.*

*Clause two — healthcare.* HIPAA BAA for US. DPDPA for India healthcare. *Explicit PHI handling, retention, deletion proof.*

*Clause three — EU AI Act.* For high-risk AI systems, conformance evidence. *Compliance documentation flows from vendor to customer.*

For regulated industries, these aren't optional. *Vendor refusal to sign = vendor refusal of the deal.*

> [S5 ▸ slide change · t ≈ 3:45]

> [S5 ▸ reveal 1 · honest scoring]

How to score contract discipline. *Two questions.*

*Question one — do your Tier 1 AI vendor contracts have all 6 AI-specific clauses?* Yes green · 4-5 amber · *<4 red — vendor leverage is theirs, not yours*.

*Question two — has legal reviewed the AI-specific MSA template in the last 12 months?* Yes green · "we use the standard one" amber · *no red — template lags evolving risk*.

> [S5 ▸ reveal 2 · the close]

The Monday move. *Pull your most recent Tier 1 AI vendor contract.* Walk the 6 clauses. *Missing ones become the amendment list.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Performance SLAs.* Beyond the uptime-only trap.

> [end]
