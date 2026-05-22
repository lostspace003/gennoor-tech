# Chapter 2 — Predictive maintenance for plants

**Course:** AI in Manufacturing · **Chapter:** 02 · ~4.5 min

## Persona
Emma. Plant-engineer register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter two. *Predictive maintenance for plants.* Where AI pays back fastest.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · why this play first]

Why this play often comes first.

Predictive maintenance has *clear economics, available sensor data, and concrete actions*. Unplanned downtime costs are measurable. Sensors on critical assets are common. *AI surfaces "this asset will fail" — the maintenance team acts on it.*

The pattern works when three pieces line up. *Quality sensor coverage. A model that catches real failure modes. A maintenance workflow that uses the predictions.*

When any one piece is missing. *AI predictions get ignored. Failures still happen.*

> [S3 ▸ slide change · t ≈ 1:15]

> [S3 ▸ reveal 1 · 3 sensor coverage decisions]

Three sensor coverage decisions.

*Decision one — which assets get covered.* Not every asset deserves sensors. *Pareto principle — twenty percent of assets cause eighty percent of unplanned downtime.* Start there.

*Decision two — which sensor types.* Vibration is the workhorse for rotating equipment. Temperature for electrical and thermal. Current draw for motors. Oil chemistry for high-value drivetrains. *Match sensor type to failure mode, not the other way around.*

*Decision three — sampling frequency.* High frequency catches more failure modes but generates more data and cost. *Match frequency to failure mode timescale.*

> [S4 ▸ slide change · t ≈ 2:30]

> [S4 ▸ reveal 1 · narrative layer]

The narrative layer.

*Maintenance engineers do not act on probability scores.* They act on *what's wrong, why, what to inspect, what to repair*.

The narrative layer translates model output into actionable guidance. *"Bearing wear pattern detected — vibration spectrum shows characteristic frequency. Inspect within 48 hours. Likely root cause: lubrication."*

Without the narrative. *Predictions are ignored.* The engineer who's been with this asset for ten years doesn't trust a probability score.

> [S5 ▸ slide change · t ≈ 3:30]

> [S5 ▸ reveal 1 · 3 project killers]

Three predictive maintenance project killers.

*Killer one — sensor data quality.* Sensors degrade. Calibration drifts. Network drops. *Quality data infrastructure has to come first or models drift silently.*

*Killer two — alert fatigue.* Too many false positives. Maintenance team stops responding. *Tune for precision over recall in mature deployment.*

*Killer three — disconnect from CMMS.* Predictions live in a separate dashboard. Maintenance team uses the existing computerised maintenance management system. *Integration in must, not a "phase two."*

> [S5 ▸ reveal 2 · the close]

The Monday move. *Pull your top ten assets by unplanned downtime cost.* For each — sensor coverage, model coverage, integration with CMMS? *That gap analysis is your maintenance AI investment priority.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Quality vision AI.* The operator labelling loop and the false-confidence discipline.

> [end]
