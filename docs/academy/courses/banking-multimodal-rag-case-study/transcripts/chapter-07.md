# Chapter 7 — Regulatory acceptance

**Course:** Banking Multimodal RAG · **Chapter:** 07 · ~4.5 min

## Persona
Andrew. Engineer + product register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter seven. *Regulatory acceptance.* RBI · SAMA · MRM submission. The 5 questions regulators consistently ask.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · MRM submission structure]

The MRM submission structure this bank used.

*Section one — model definition.* What is the model? What does it do? Where in the bank's decision flow does it sit?

*Section two — model development.* Architecture. Training data lineage. Evaluation methodology. Test sets.

*Section three — model performance.* Eval results across all 3 layers. Test set composition. Known limitations and failure modes.

*Section four — controls.* Pre-deployment controls. Production monitoring. Drift detection. Incident response.

*Section five — governance.* Named accountable owner. Review cadence. Decommission criteria.

Five sections. *Each rated by MRM. Each tied to NIST AI RMF or local regulator equivalent.*

> [S3 ▸ slide change · t ≈ 1:30]

> [S3 ▸ reveal 1 · 5 regulator questions]

Five questions regional regulators consistently ask about RAG.

*Q1 — explainability.* How does a user understand why this answer? *Citation surfacing answers this. Without citations, RAG doesn't pass.*

*Q2 — auditability.* Can you trace a specific answer back through the retrieval and generation chain? *Logging every query · retrieved chunks · LLM response · model version.*

*Q3 — bias + fairness.* Does the model treat different demographic groups consistently? *Required even for non-credit-decision RAG, increasingly.*

*Q4 — data residency.* Where is the data processed? Where do the embeddings live? *Sovereign region commitments in writing.*

*Q5 — vendor concentration.* What happens if Azure OpenAI changes pricing or sunsets a model? *Vendor risk plan required.*

> [S4 ▸ slide change · t ≈ 3:00]

> [S4 ▸ reveal 1 · RBI + SAMA specifics]

RBI and SAMA specifics for this build.

*RBI (India).* Data residency in Indian region. Audit trail of every customer-facing AI interaction. Annual independent model validation by third-party.

*SAMA (Saudi).* Sovereign infrastructure preference (G42, NEOM Cloud). Arabic-language explainability. Sharia-compliance review for any decision-supporting AI.

*EU AI Act (for international banks with EU customers).* High-risk classification if used in credit decisions. Conformity assessment. Post-market monitoring.

The bank ran each regulator-specific check in parallel. *Six-week assessment cycle before pilot launch.*

> [S5 ▸ slide change · t ≈ 3:45]

> [S5 ▸ reveal 1 · honest scoring]

How to score regulatory readiness. *Two questions.*

*Question one — can you answer all 5 regulator questions with documentation today?* Yes all 5 green · 3-4 amber · *<3 red — regulator submission will fail*.

*Question two — is your MRM submission tied to regulatory frameworks (NIST AI RMF + regional)?* Yes mapped green · partial amber · *no red — MRM committee finds gaps*.

> [S5 ▸ reveal 2 · the close]

The Monday move. *Write 2-line answers to the 5 questions for your current AI build.* If any answer is "we'll figure it out," that's the regulator submission gap.

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · last chapter]

Last chapter. *Capstone — the lessons + the builder.*

> [end]
