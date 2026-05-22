# Chapter 3 — Drift detection

**Course:** MLOps for LLMs · **Chapter:** 03 · ~4.5 min

## Persona
Andrew. Platform-engineer register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter three. *Drift detection.* Three drift types in LLM systems. The actionable alerts. The cosmetic dashboards.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · 3 drift types]

Three distinct drift types in LLM systems.

*Drift type one — input drift.* The distribution of user queries shifts. *New use case launches. New customer cohort. Topic distribution moves.* You catch this with embedding-based clustering on incoming queries.

*Drift type two — output drift.* The distribution of model responses shifts. *Response length changes. Refusal rate changes. Vocabulary shifts.* You catch this with statistical monitoring on output features.

*Drift type three — behavioral drift.* Same input now produces meaningfully different output. *Vendor updated the model. Your prompt changed. A retrieval source got swapped.* This is the dangerous one.

> [S3 ▸ slide change · t ≈ 1:15]

> [S3 ▸ reveal 1 · detecting behavioral drift]

Detecting behavioral drift — the hardest case.

*The technique.* Maintain a regression set of canonical queries. Run them daily against production. *Compare outputs to a frozen baseline using semantic similarity.*

If today's output drifts more than threshold from baseline. *Alert.*

The investigation playbook. *Was the prompt changed? Was the model version updated by the vendor? Was a retrieval source changed?*

Most behavioral drift comes from one of three causes. *Once you have the regression set in place, root cause becomes fast.*

> [S4 ▸ slide change · t ≈ 2:15]

> [S4 ▸ reveal 1 · actionable vs cosmetic]

Actionable alerts versus cosmetic dashboards.

*Cosmetic.* "Quality score: 4.2/5." Dashboard looks great. Nobody acts on it.

*Actionable.* "Groundedness dropped 8% over 24 hours in the legal-Q&A flow. Investigate retrieval source X." *Specific. Triggers action.*

The principle. *Every monitor must have a runbook. Every alert must have an owner. If neither exists, the monitor is theater.*

> [S5 ▸ slide change · t ≈ 3:15]

> [S5 ▸ reveal 1 · honest scoring]

How to score drift detection. *Two questions.*

*Question one — when the vendor last updated their model, did your monitoring catch the behavioral change?* Yes within 24 hours green · within a week amber · *days-or-weeks-or-never red — drift is invisible to you*.

*Question two — does each LLM alert have a written runbook?* Yes for all green · for some amber · *no red — alert noise will train your team to ignore*.

> [S5 ▸ reveal 2 · the close]

The Monday move. *Build a 50-query regression set this week.* Run it daily. *That's your behavioral-drift early warning.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Cost optimization.* Patterns that survive past the first quarter.

> [end]
