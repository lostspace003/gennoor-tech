# Chapter 5 — Predictive maintenance for T+D assets

**Course:** AI for Energy & Utilities · **Chapter:** 05 · ~4.5 min

## Persona
Emma. Asset-maintenance register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter five. *Predictive maintenance for transmission and distribution assets.* Capital deferral done responsibly.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · the economics]

The economics. *Most utilities defer capital that doesn't need to be spent yet.*

A transformer with another five years of life is left alone. A transformer at end of life is replaced. *The decision rests on assessing remaining life. Historically this was visual inspection, occasional oil testing, age-based heuristics.*

AI changes the assessment. *Sensor data, oil chemistry, operational stress patterns combine into a probabilistic remaining-life estimate.* Replace the failing assets. Defer the healthy ones. *Tens of millions in deferred capital, with safety maintained.*

> [S3 ▸ slide change · t ≈ 1:15]

> [S3 ▸ reveal 1 · 3 use cases]

Three predictive maintenance use cases.

*Use case one — transformer health assessment.* Oil dissolved gas analysis. Load patterns. Cooling system performance. *Probability of failure in next twelve to twenty-four months.*

*Use case two — switchgear and circuit breaker.* Operating cycles. Trip history. Maintenance records. *Failure risk scoring for prioritised replacement.*

*Use case three — line monitoring.* Sag, sway, vegetation encroachment. Increasingly from drone or satellite imagery plus AI. *Replaces or augments helicopter inspections.*

> [S4 ▸ slide change · t ≈ 2:30]

> [S4 ▸ reveal 1 · the safety constraint]

The safety constraint. *AI cannot tell a maintenance crew "this is fine" if it isn't.*

The failure mode that matters. *AI predicts healthy. Crew skips inspection. Asset fails. Worker hurt or killed. Customers blacked out.*

The discipline. *AI extends inspection intervals, never eliminates them entirely.* For high-consequence assets — major substations, river crossings, critical lines — *human inspection cadence is preserved. AI prioritises and informs, doesn't replace.*

OSHA, equivalent regulators, and your own safety teams will hold you to this. *Document the AI-plus-human-inspection logic.*

> [S5 ▸ slide change · t ≈ 3:30]

> [S5 ▸ reveal 1 · honest scoring]

How to score predictive maintenance honestly. *Two questions.*

*Question one — in the last twelve months, has AI prediction missed an asset failure that subsequent investigation said should have been predictable?* Zero or one green. Two to four amber. *Five or more red — your model needs retraining.*

*Question two — does your predictive maintenance program have explicit human safety overrides on every recommendation type?* Yes green. Implicit amber. *Algorithmic decision without override authority red.*

> [S5 ▸ reveal 2 · the close]

The Monday move. *Pull the last five asset failures that surprised the AI.* What did the model miss? *That's your model's blind spot. Address it before the next failure.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Customer operations.* Outage notifications, bill explanations, energy advice. *Lower stakes, higher volume.*

> [end]
