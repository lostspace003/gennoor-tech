# Chapter 2 — Alert triage + noise reduction

**Course:** AI for Cybersecurity SOC · **Chapter:** 02 · ~4.5 min

## Persona
Emma. Alert-triage register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter two. *Alert triage and noise reduction.* Where SOC AI delivers most reliable value.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · the problem]

The alert volume problem.

Modern enterprise SOCs typically receive thousands of alerts daily. *Many or most are noise — known benign patterns, duplicate signals, low-risk events.* Analyst attention is the bottleneck.

The cost of false positives. *Real attacks missed because analysts are fatigued by noise.* The cost of false negatives. *Real attacks miss the alert pipeline entirely.*

AI alert triage targets both. *Reduce the noise. Prioritise the signal.*

> [S3 ▸ slide change · t ≈ 1:00]

> [S3 ▸ reveal 1 · 3 triage AI patterns]

Three AI patterns for alert triage.

*Pattern one — supervised scoring on historical labels.* Train on alerts your analysts triaged in the past. Predict severity. *Works when labelling is consistent.*

*Pattern two — context enrichment at alert time.* AI pulls related context — recent activity, asset criticality, user role, known threats. Enriched alert has higher signal-to-noise.

*Pattern three — alert clustering and similarity.* Group related alerts. Show the analyst the cluster, not fifty individual events. *Reduces decision count without reducing visibility.*

> [S4 ▸ slide change · t ≈ 2:15]

> [S4 ▸ reveal 1 · 3 failure modes]

Three triage AI failure modes.

*Failure mode one — historical bias inherited.* If past analysts triaged certain types of alerts poorly, the model learns to triage them poorly. *Audit training labels before training.*

*Failure mode two — over-aggressive suppression.* AI marks alerts as low priority and they are never reviewed. Real attack signal lost. *Maintain shadow review on suppressed alerts.*

*Failure mode three — concept drift.* Attacker tactics change. Model trained on last year's threats misses this year's. *Retraining cadence and drift monitoring required.*

> [S5 ▸ slide change · t ≈ 3:15]

> [S5 ▸ reveal 1 · honest scoring]

How to score alert triage AI honestly. *Three questions.*

*Question one — analyst time per alert before vs after AI deployment.* Reduction of fifty percent or more green. *Less than thirty percent reduction red — investment not paying back.*

*Question two — false negative rate on shadow-review of suppressed alerts.* Below one percent green. One to three percent amber. *Above three percent red — model is hiding real attacks.*

*Question three — model retraining cadence.* Quarterly or more frequent green. Annual amber. *Set once and forgotten red.*

> [S5 ▸ reveal 2 · the close]

The Monday move. *Pull one week of alerts that AI marked low priority and your team did not review.* Sample ten randomly. *Are any of them real signals that needed attention?* That false-negative rate is the truth.

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Threat detection augmentation.* UEBA, anomaly detection, the things signatures miss.

> [end]
