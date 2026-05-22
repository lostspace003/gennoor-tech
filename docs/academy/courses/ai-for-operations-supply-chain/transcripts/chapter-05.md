# Chapter 5 — Predictive maintenance

**Course:** AI for Operations & Supply Chain · **Chapter:** 05 · ~4.5 min

## Persona
Andrew. Maintenance-discipline register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter five. *Predictive maintenance.* The sensor-plus-narrative pattern.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · the economics]

The predictive maintenance economics.

*Reactive maintenance.* Equipment fails. You fix it. *Most expensive in total cost — production downtime, expedited parts, overtime labour.*

*Preventive maintenance.* Schedule-based. Replace components on time intervals regardless of actual condition. *Better. Still wasteful — replacing parts that have life left.*

*Predictive maintenance.* Condition-based using sensor data plus AI. Replace components when they actually need replacement. *Best total cost when done well. Worst when done poorly.*

The discipline is what separates good predictive maintenance from bad. *Sensor quality. Model quality. Maintenance crew training. Operational discipline.*

> [S3 ▸ slide change · t ≈ 1:15]

> [S3 ▸ reveal 1 · 3 components]

The three components of working predictive maintenance.

*Component one — quality sensors.* Vibration, temperature, current draw, oil chemistry. *Sensors need to be installed correctly, calibrated regularly, and produce reliable signal.*

*Component two — predictive model.* Anomaly detection at minimum. Remaining-useful-life estimation when data supports it. *Each asset class needs its own model — pumps, motors, transformers behave differently.*

*Component three — maintenance narrative.* The model surfaces "this transformer has a thirty percent chance of failure in the next ninety days." *The maintenance team needs the context to act — what type of failure, what early-warning signals, what to inspect first.*

Without all three. *AI predictions get ignored. Real failures still happen. Investment doesn\'t pay back.*

> [S4 ▸ slide change · t ≈ 2:30]

> [S4 ▸ reveal 1 · safety constraint]

The safety constraint. *Critical.*

Predictive maintenance must not eliminate human inspection on high-consequence equipment. *AI extends the interval between inspections, sometimes. AI never replaces them entirely.*

OSHA, equivalent regulators, and your own safety teams will hold you to this. *Document the AI-plus-human-inspection logic.*

What works. *AI prioritises inspection schedules. Human inspectors verify high-priority assets first. Routine inspections continue on a baseline cadence.*

What does not work. *AI predicts "this asset is fine, skip the inspection."* Then the failure happens during operation. Workers hurt. Production stopped. *Regulatory consequence.*

> [S5 ▸ slide change · t ≈ 3:30]

> [S5 ▸ reveal 1 · honest scoring]

How to score predictive maintenance honestly. *Two questions.*

*Question one — in the last twelve months, has AI prediction missed asset failures that subsequent investigation said should have been predictable?* Zero or one green. Two to four amber. *Five or more red — model needs retraining.*

*Question two — does your maintenance team trust the AI predictions enough to act on them?* Yes, consistently green. Mixed amber. *No or rarely red — model or narrative not landing with the team.*

> [S5 ▸ reveal 2 · the close]

The Monday move. *Pull last quarter\'s asset failures that surprised the AI.* What did the model miss? *That blind spot is your model retraining priority before the next surprise.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Inventory intelligence.* Dynamic safety stock and allocation optimization.

> [end]
